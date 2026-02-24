import React, { useState, useRef, useEffect } from 'react';
import { Upload, Video, Sparkles, Check, X, RefreshCw, ChevronRight, FileVideo, Activity } from 'lucide-react';
import './App.css';

// Removed MOCK_QUIZ mock data since we will rely on dynamically fetched data

function App() {
  const [appState, setAppState] = useState('UPLOAD'); // UPLOAD, PROCESSING, QUIZ, RESULT
  const [fileName, setFileName] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quizData, setQuizData] = useState([]); // Store actual quiz data

  // Quiz state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);

  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    if (!file.type.includes('video/')) {
      alert('Please upload a valid video file.');
      return;
    }
    setFileName(file.name);
    setAppState('PROCESSING');
    setProgress(0);
    setErrorMsg(null);

    // Create a fake progress bar visually while we wait for backend
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      // Cap visual progress at 95% until we actually finish
      if (currentProgress < 95) {
        currentProgress += (95 - currentProgress) * 0.05;
        setProgress(currentProgress);
      }
    }, 500);

    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await fetch('http://localhost:3001/api/generate-quiz', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.quiz && data.quiz.length > 0) {
        setQuizData(data.quiz);
        setTimeout(() => {
          setAppState('QUIZ');
        }, 500);
      } else {
        throw new Error('No quiz questions generated. Please try another video.');
      }

    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error generating quiz from video:", error);
      setErrorMsg(error.message || 'Failed to generate quiz. Is the backend running?');
      setTimeout(() => {
        setAppState('UPLOAD'); // Head back to upload to try again
      }, 4000);
    }
  };

  const handleOptionClick = (idx) => {
    if (isAnswerRevealed) return;

    setSelectedAnswer(idx);
    setIsAnswerRevealed(true);

    if (idx === quizData[currentQuestionIdx].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < quizData.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
    } else {
      setAppState('RESULT');
    }
  };

  const handleRestart = () => {
    setAppState('UPLOAD');
    setFileName('');
    setProgress(0);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setQuizData([]); // Clear quiz data on restart
    setErrorMsg(null); // Clear error message on restart
  };

  return (
    <div className="main-container">
      <div className="view-panel glass-panel">

        <div className="app-header">
          <h1 className="title gradient-text">LensQuiz AI</h1>
          <p className="subtitle">Upload any video and let AI generate a smart quiz instantly</p>
        </div>

        {appState === 'UPLOAD' && (
          <div
            className={`upload-area ${isHovering ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <div className="upload-icon-wrapper">
              <Upload className="upload-icon" />
            </div>
            <div className="upload-text">
              <h3>Drag & Drop your video here</h3>
              <p>Supports MP4, MOV, AVI formats up to 500MB</p>
            </div>
            <button className="btn-primary" onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current.click();
            }}>
              Browse Files
            </button>
            <input
              type="file"
              className="file-input"
              ref={fileInputRef}
              accept="video/*"
              onChange={handleFileChange}
            />
          </div>
        )}

        {appState === 'PROCESSING' && (
          <div className="processing-container">
            <div className="spinner">
              <div className="spinner-ring"></div>
              <Activity className="spinner-icon" size={32} />
            </div>

            <div className="processing-status">
              <h3 className="gradient-text" style={{ fontSize: '1.5rem' }}>Analyzing "{fileName}"</h3>
              <div className="progress-bar-container" style={{ marginTop: '1.5rem' }}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {errorMsg ? (
                <p style={{ color: 'var(--error-color)', fontWeight: 'bold' }}>{errorMsg}</p>
              ) : (
                <p>
                  {progress < 30 && 'Uploading video to AI Engine...'}
                  {progress >= 30 && progress < 80 && 'Vision & Audio AI analyzing content...'}
                  {progress >= 80 && progress < 95 && 'Generating contextual intelligence...'}
                  {progress >= 95 && 'Finalizing custom quiz...'}
                </p>
              )}
            </div>
          </div>
        )}

        {appState === 'QUIZ' && quizData.length > 0 && (
          <div className="quiz-container">
            <div className="quiz-header">
              <div className="progress-indicator">
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Question {currentQuestionIdx + 1} of {quizData.length}
                </span>
              </div>
              <div className="progress-pills">
                {quizData.map((_, idx) => (
                  <div
                    key={idx}
                    className={`pill ${idx === currentQuestionIdx ? 'active' : ''} ${idx < currentQuestionIdx ? 'completed' : ''}`}
                  ></div>
                ))}
              </div>
            </div>

            <h2 className="question-text">{quizData[currentQuestionIdx].question}</h2>

            <div className="options-container">
              {quizData[currentQuestionIdx].options.map((option, idx) => {
                const isCorrect = idx === quizData[currentQuestionIdx].correctAnswer;
                const isSelected = selectedAnswer === idx;

                let optionClass = 'option-btn';
                if (isAnswerRevealed) {
                  if (isSelected && isCorrect) optionClass += ' correct';
                  else if (isSelected && !isCorrect) optionClass += ' incorrect';
                  else if (isCorrect) optionClass += ' correct'; // reveal correct if wrong
                } else if (isSelected) {
                  optionClass += ' selected';
                }

                const letters = ['A', 'B', 'C', 'D'];

                return (
                  <button
                    key={idx}
                    className={optionClass}
                    onClick={() => handleOptionClick(idx)}
                    disabled={isAnswerRevealed}
                  >
                    <span className="option-letter">{letters[idx]}</span>
                    <span style={{ flex: 1 }}>{option}</span>
                    {isAnswerRevealed && isCorrect && <Check size={20} className="status-icon" />}
                    {isAnswerRevealed && isSelected && !isCorrect && <X size={20} className="status-icon" />}
                  </button>
                );
              })}
            </div>

            {isAnswerRevealed && (
              <div className="explanation-box" style={{ marginTop: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', borderLeft: '4px solid var(--accent-color)' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-color)', fontWeight: '600' }}>
                  <Sparkles size={18} /> Explanation
                </p>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>{quizData[currentQuestionIdx].explanation}</p>
              </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-primary"
                onClick={handleNextQuestion}
                disabled={!isAnswerRevealed}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {currentQuestionIdx < quizData.length - 1 ? 'Next Question' : 'View Results'}
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {appState === 'RESULT' && (
          <div className="result-container fadeIn">
            <h2 className="title">Quiz Complete!</h2>

            <div
              className="score-circle"
              style={{ '--score': (score / quizData.length) * 100 }}
            >
              <div className="score-text">
                {score}/{quizData.length}
              </div>
            </div>

            <p className="result-feedback">
              {score === quizData.length ?
                "Perfect score! You're a true expert." :
                score >= quizData.length / 2 ?
                  "Great job! You grasped most of the concepts." :
                  "Good effort! Might need a quick review."}
            </p>

            <div className="action-buttons">
              <button className="btn-secondary" onClick={handleRestart} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={18} /> Create New Quiz
              </button>
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileVideo size={18} /> View Video Summary
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
