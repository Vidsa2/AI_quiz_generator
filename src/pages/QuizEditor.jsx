import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Trash2, Plus, Edit2, PlayCircle } from 'lucide-react';

export default function QuizEditor() {
    const [quizData, setQuizData] = useState([]);
    const [editingIdx, setEditingIdx] = useState(null);
    const [editorContent, setEditorContent] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem('tempQuizData');
        if (saved) {
            setQuizData(JSON.parse(saved));
        } else {
            navigate('/teacher-dashboard');
        }
    }, [navigate]);

    if (quizData.length === 0) {
        return (
            <div className="main-container">
                <div className="view-panel glass-panel" style={{ width: '100%', maxWidth: '700px', textAlign: 'center', padding: '3rem' }}>
                    <h2 className="title gradient-text" style={{ fontSize: '2rem' }}>Loading Editor Data...</h2>
                    <p style={{ color: 'var(--text-muted)' }}>If this takes more than a few seconds, data may have been lost. Please generate the quiz again.</p>
                    <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/teacher-dashboard')}>
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const handleEdit = (idx) => {
        setEditingIdx(idx);
        setEditorContent(JSON.parse(JSON.stringify(quizData[idx])));
    };

    const handleSaveEdit = () => {
        const updated = [...quizData];
        updated[editingIdx] = editorContent;
        setQuizData(updated);
        localStorage.setItem('tempQuizData', JSON.stringify(updated));
        setEditingIdx(null);
    };

    const handleDelete = (idx) => {
        if (quizData.length === 1) {
            alert("Cannot delete the last question.");
            return;
        }
        const updated = quizData.filter((_, i) => i !== idx);
        setQuizData(updated);
        localStorage.setItem('tempQuizData', JSON.stringify(updated));
    };

    const handlePublish = () => {
        // Scaffold: In real app, push this array to Firebase Firestore
        alert('Quiz Published Successfully to Class Roster!');
        navigate('/teacher-dashboard');
    };

    return (
        <div className="main-container" style={{ alignItems: 'flex-start', padding: '2rem' }}>
            <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <div>
                        <h1 className="title gradient-text" style={{ fontSize: '2.2rem' }}>Edit Generated Quiz</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Review AI questions, modify options, and adjust explanations before publishing.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-secondary" onClick={() => navigate('/quiz-taker')} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <PlayCircle size={18} /> Preview
                        </button>
                        <button className="btn-primary" onClick={handlePublish} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Save size={18} /> Publish
                        </button>
                    </div>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {quizData.map((q, idx) => (
                        <div key={idx} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {editingIdx === idx ? (
                                // Edit Mode
                                <>
                                    <label style={{ color: 'var(--text-muted)' }}>Question text:</label>
                                    <textarea
                                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--accent-color)', color: 'white', fontFamily: 'inherit' }}
                                        value={editorContent.question}
                                        onChange={(e) => setEditorContent({ ...editorContent, question: e.target.value })}
                                    />
                                    <label style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Options (Select dot for correct answer):</label>
                                    {editorContent.options.map((opt, oIdx) => (
                                        <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <input
                                                type="radio"
                                                name="correct"
                                                checked={editorContent.correctAnswer === oIdx}
                                                onChange={() => setEditorContent({ ...editorContent, correctAnswer: oIdx })}
                                            />
                                            <input
                                                type="text"
                                                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)', color: 'white' }}
                                                value={opt}
                                                onChange={(e) => {
                                                    const newOpts = [...editorContent.options];
                                                    newOpts[oIdx] = e.target.value;
                                                    setEditorContent({ ...editorContent, options: newOpts });
                                                }}
                                            />
                                        </div>
                                    ))}
                                    <label style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Explanation:</label>
                                    <textarea
                                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)', color: 'white', fontFamily: 'inherit' }}
                                        value={editorContent.explanation}
                                        onChange={(e) => setEditorContent({ ...editorContent, explanation: e.target.value })}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                        <button className="btn-secondary" onClick={() => setEditingIdx(null)}>Cancel</button>
                                        <button className="btn-primary" onClick={handleSaveEdit}>Save Changes</button>
                                    </div>
                                </>
                            ) : (
                                // View Mode
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 style={{ fontSize: '1.25rem', paddingRight: '2rem' }}>
                                            <span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>{idx + 1}.</span>
                                            {q.question}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleEdit(idx)} style={{ background: 'transparent', color: '#4361ee', padding: '0.5rem' }}><Edit2 size={20} /></button>
                                            <button onClick={() => handleDelete(idx)} style={{ background: 'transparent', color: 'var(--error-color)', padding: '0.5rem' }}><Trash2 size={20} /></button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        {q.options.map((opt, oIdx) => (
                                            <div key={oIdx} style={{
                                                padding: '1rem',
                                                background: oIdx === q.correctAnswer ? 'rgba(6, 214, 160, 0.15)' : 'rgba(255,255,255,0.05)',
                                                border: `1px solid ${oIdx === q.correctAnswer ? 'var(--success-color)' : 'var(--surface-border)'}`,
                                                borderRadius: '8px'
                                            }}>
                                                {opt}
                                            </div>
                                        ))}
                                    </div>

                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '1rem', fontStyle: 'italic', borderLeft: '3px solid var(--accent-color)', paddingLeft: '1rem' }}>
                                        {q.explanation}
                                    </p>
                                </>
                            )}
                        </div>
                    ))}

                    <button className="glass-panel" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', background: 'transparent', borderStyle: 'dashed' }}>
                        <Plus size={24} /> Add Custom Question
                    </button>
                </div>
            </div>
        </div>
    );
}
