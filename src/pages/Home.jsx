import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Video, FileText, Activity } from 'lucide-react';

export default function Home() {
    return (
        <div className="main-container" style={{ flexDirection: 'column', gap: '4rem', padding: '4rem 1rem' }}>
            <header className="app-header" style={{ marginBottom: 0 }}>
                <h1 className="title gradient-text" style={{ fontSize: '4.5rem' }}>LensQuiz AI</h1>
                <p className="subtitle" style={{ fontSize: '1.4rem', maxWidth: '700px', margin: '1rem auto' }}>
                    Intelligent educational platform that creates customized, interactive quizzes from videos, audio, PDFs, and textual content instantly.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem' }}>
                    <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
                    <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', background: 'rgba(255, 255, 255, 0.05)' }}>Login</Link>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1000px' }}>

                <div className="glass-panel" style={{ flex: '1 1 300px', textAlign: 'center', padding: '2rem' }}>
                    <div className="upload-icon-wrapper" style={{ margin: '0 auto 1.5rem', animation: 'none' }}>
                        <BookOpen className="upload-icon" />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Two Intelligent Roles</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Students can generate learning material instantly, while Teachers retain full control to edit, publish, and track progress using advanced analytics.</p>
                </div>

                <div className="glass-panel" style={{ flex: '1 1 300px', textAlign: 'center', padding: '2rem' }}>
                    <div className="upload-icon-wrapper" style={{ margin: '0 auto 1.5rem', animation: 'none', background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.2), rgba(67, 97, 238, 0.2))', color: 'var(--success-color)' }}>
                        <Video className="upload-icon" />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Multi-format Support</h3>
                    <p style={{ color: 'var(--text-muted)' }}>We don't just do video anymore. Drop in an audio lecture, a dense PDF syllabus, or a raw textual note, and AI does the rest.</p>
                </div>

                <div className="glass-panel" style={{ flex: '1 1 300px', textAlign: 'center', padding: '2rem' }}>
                    <div className="upload-icon-wrapper" style={{ margin: '0 auto 1.5rem', animation: 'none', background: 'linear-gradient(135deg, rgba(247, 37, 133, 0.2), rgba(255, 190, 11, 0.2))', color: '#ffbe0b' }}>
                        <Activity className="upload-icon" />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Analytics & Leaderboards</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Transform passive learning into engaging competition with tracked performance insights and a public quiz leaderboard.</p>
                </div>

            </div>
        </div>
    );
}
