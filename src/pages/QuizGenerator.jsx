import React, { useState, useRef } from 'react';
import { Upload, Activity, ChevronLeft, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function QuizGenerator() {
    const [appState, setAppState] = useState('SETUP'); // SETUP, UPLOAD, PROCESSING
    const [fileName, setFileName] = useState('');
    const [progress, setProgress] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    // Configuration State
    const [difficulty, setDifficulty] = useState('Medium');
    const [contentFormat, setContentFormat] = useState('Video');
    const [questionTypes, setQuestionTypes] = useState({
        MCQ: true,
        TrueFalse: true,
        FillInBlank: false,
        ShortDesc: false
    });

    const fileInputRef = useRef(null);
    const { userRole } = useAuth();
    const navigate = useNavigate();

    const handleToggleType = (type) => {
        setQuestionTypes(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const handleBeginUpload = () => {
        const atLeastOne = Object.values(questionTypes).some(Boolean);
        if (!atLeastOne) {
            alert("Please select at least one question type");
            return;
        }
        setAppState('UPLOAD');
    };

    const processFile = async (file) => {
        // Basic validation based on selected content format
        if (contentFormat === 'Video' && !file.type.includes('video/')) {
            alert('Please upload a valid video file.');
            return;
        }
        // Expand to Audio, PDF validation later

        setFileName(file.name);
        setAppState('PROCESSING');
        setProgress(0);
        setErrorMsg(null);

        let currentProgress = 0;
        const progressInterval = setInterval(() => {
            if (currentProgress < 95) {
                currentProgress += (95 - currentProgress) * 0.05;
                setProgress(currentProgress);
            }
        }, 500);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('difficulty', difficulty);
            formData.append('types', JSON.stringify(questionTypes));
            formData.append('format', contentFormat);

            // We will update the server route appropriately to handle generic files
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
                // Success. We need to pass data based on role.
                // In a real app we'd place this in a context or pass via state.
                // Using localStorage for simplicity in scaffolding generic flow
                localStorage.setItem('tempQuizData', JSON.stringify(data.quiz));

                setTimeout(() => {
                    if (userRole === 'teacher') {
                        navigate('/quiz-editor');
                    } else {
                        navigate('/quiz-taker');
                    }
                }, 500);
            } else {
                throw new Error('No quiz questions generated.');
            }

        } catch (error) {
            clearInterval(progressInterval);
            console.error("Error generating quiz from file:", error);
            setErrorMsg(error.message || 'Failed to generate quiz. Is the backend running?');
            setTimeout(() => {
                setAppState('UPLOAD');
            }, 4000);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsHovering(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="main-container">
            <div className="view-panel glass-panel" style={{ width: '100%', maxWidth: '700px' }}>

                {appState === 'SETUP' && (
                    <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                            <Link to={userRole === 'teacher' ? "/teacher-dashboard" : "/student-dashboard"} style={{ color: 'var(--text-muted)' }}>
                                <ChevronLeft size={24} />
                            </Link>
                            <h2 className="title" style={{ fontSize: '2rem', margin: '0 auto' }}>Quiz Configuration</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>1. Content Type</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {['Video', 'Audio', 'PDF', 'Internal Text'].map(fmt => (
                                        <button
                                            key={fmt}
                                            onClick={() => setContentFormat(fmt)}
                                            style={{
                                                flex: 1, padding: '1rem',
                                                background: contentFormat === fmt ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                                                color: 'white', borderRadius: '8px', border: '1px solid var(--surface-border)'
                                            }}
                                        >
                                            {fmt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>2. Difficulty Level</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {['Easy', 'Medium', 'Hard'].map(diff => (
                                        <button
                                            key={diff}
                                            onClick={() => setDifficulty(diff)}
                                            style={{
                                                flex: 1, padding: '1rem',
                                                background: difficulty === diff ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                                                color: 'white', borderRadius: '8px', border: '1px solid var(--surface-border)'
                                            }}
                                        >
                                            {diff}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>3. Question Types</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                        <input type="checkbox" checked={questionTypes.MCQ} onChange={() => handleToggleType('MCQ')} />
                                        Multiple Choice
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                        <input type="checkbox" checked={questionTypes.TrueFalse} onChange={() => handleToggleType('TrueFalse')} />
                                        True / False
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                        <input type="checkbox" checked={questionTypes.FillInBlank} onChange={() => handleToggleType('FillInBlank')} />
                                        Fill in the Blanks
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                        <input type="checkbox" checked={questionTypes.ShortDesc} onChange={() => handleToggleType('ShortDesc')} />
                                        Short Description
                                    </label>
                                </div>
                            </div>

                            <button className="btn-primary" onClick={handleBeginUpload} style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', marginTop: '1rem' }}>
                                Proceed to Upload
                            </button>
                        </div>
                    </div>
                )}

                {appState === 'UPLOAD' && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                            <button onClick={() => setAppState('SETUP')} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                                <ChevronLeft size={24} />
                            </button>
                            <h2 className="title" style={{ fontSize: '1.8rem', margin: '0 auto' }}>Upload {contentFormat}</h2>
                        </div>

                        <div
                            className={`upload-area ${isHovering ? 'dragging' : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                            onDragLeave={() => setIsHovering(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <div className="upload-icon-wrapper">
                                <Upload className="upload-icon" />
                            </div>
                            <div className="upload-text">
                                <h3>Drag & Drop your {contentFormat} here</h3>
                                <p>Generating {difficulty.toLowerCase()} quiz with custom types.</p>
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
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
                                }}
                            />
                        </div>
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
                                    {progress < 30 && `Uploading ${contentFormat} to AI Engine...`}
                                    {progress >= 30 && progress < 80 && `Extracting details and adjusting for ${difficulty} difficulty...`}
                                    {progress >= 80 && progress < 95 && `Generating custom mixed-type question set...`}
                                    {progress >= 95 && 'Finalizing custom quiz...'}
                                </p>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
