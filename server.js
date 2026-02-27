import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Set up multer for file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Initialize Gemini client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function waitForProcessing(file) {
    console.log(`Waiting for file processing: ${file.name}`);
    let statusObject = await ai.files.get({ name: file.name });

    while (statusObject.state === 'PROCESSING') {
        console.log('File is still processing, waiting 2 seconds...');
        await new Promise((resolve) => setTimeout(resolve, 2000));
        statusObject = await ai.files.get({ name: file.name });
    }

    if (statusObject.state === 'FAILED') {
        throw new Error('Video processing failed');
    }

    console.log(`File processing complete: ${file.name}`);
    return statusObject;
}

app.post('/api/generate-quiz', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    let uploadedFile = null;

    try {
        console.log(`Uploading file to Gemini: ${filePath}`);

        // Upload the file to Gemini
        uploadedFile = await ai.files.upload({
            file: filePath,
            mimeType: req.file.mimetype,
        });

        console.log(`File uploaded successfully: ${uploadedFile.name}`);

        // Wait for the video processing to complete
        await waitForProcessing(uploadedFile);

        const { difficulty, types, format } = req.body;
        const parsedTypes = types ? JSON.parse(types) : {};

        let typeInstructions = [];
        if (parsedTypes.MCQ) typeInstructions.push("Multiple Choice Questions (4 options, specify index of correct option)");
        if (parsedTypes.TrueFalse) typeInstructions.push("True/False Questions (Include options ['True', 'False'] and indicate correct index)");
        if (parsedTypes.FillInBlank) typeInstructions.push("Fill in the Blank Questions (Provide 4 reasonable options to fill in the blank)");
        if (parsedTypes.ShortDesc) typeInstructions.push("Short Answer Multiple Choice Questions (Give descriptive options for a concept)");

        if (typeInstructions.length === 0) {
            typeInstructions.push("Multiple Choice Questions");
        }

        // Generate content using the file
        console.log(`Generating a ${difficulty || 'Medium'} quiz from ${format || 'Video'}...`);
        const prompt = `
      You are an expert educator and assessment creator.
      Review the attached ${format || 'educational file'} carefully and generate a quiz based ONLY on the content presented.
      
      Generate EXACTLY 5 high-quality questions.
      The difficulty level MUST be: ${difficulty || 'Medium'}. Adjust the complexity of the terminology and concepts tested accordingly.
      
      The questions must be structured as one of the following requested types:
      ${typeInstructions.join('\n      - ')}
      MIX the question types if multiple are requested!
      
      For each question:
      1. Provide a clear question statement.
      2. Provide exactly 4 options. (Even for true/false or fill in the blank, generate 4 possible choices to maintain strict format).
      3. Specify the index (0-3) of the correct answer.
      4. Provide a brief explanation of why the answer is correct explicitly based on the text/audio/video content.
      
      CRITICAL INSTRUCTION: Your output MUST be ONLY a valid JSON array of objects. Do not include any markdown formatting like \`\`\`json or \`\`\`. Start directly with [ and end with ]. Do not include any introductory or concluding text.

      The JSON structure should strictly be:
      [
        {
          "id": 1,
          "question": "Question text here",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Explanation text here"
        }
      ]
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { fileData: { fileUri: uploadedFile.uri, mimeType: uploadedFile.mimeType } },
                { text: prompt }
            ],
            config: {
                temperature: 0.2, // Low temperature for more factual output
            }
        });

        const outputText = response.text || (response.candidates && response.candidates[0].content.parts[0].text);
        if (!outputText) {
            throw new Error("Could not extract text from model response.");
        }

        console.log('Generated Output:', outputText);

        // Clean up the JSON string in case the model added markdown despite instructions
        let jsonStr = outputText.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.substring(7);
        }
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.substring(3);
        }
        if (jsonStr.endsWith('```')) {
            jsonStr = jsonStr.substring(0, jsonStr.length - 3);
        }
        jsonStr = jsonStr.trim();

        const quizData = JSON.parse(jsonStr);

        res.json({ quiz: quizData });

    } catch (error) {
        console.error('Error generating quiz:', error);
        res.status(500).json({ error: 'Failed to generate quiz', details: error.message });
    } finally {
        // Clean up local file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Cleaned up local file: ${filePath}`);
        }

        // Clean up Gemini file
        if (uploadedFile) {
            try {
                await ai.files.delete({ name: uploadedFile.name });
                console.log(`Cleaned up Gemini file: ${uploadedFile.name}`);
            } catch (cleanupError) {
                console.error(`Failed to clean up Gemini file ${uploadedFile.name}:`, cleanupError);
            }
        }
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
