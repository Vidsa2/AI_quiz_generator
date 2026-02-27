import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, PenTool, BarChart3, Users } from 'lucide-react';

export default function TeacherDashboard() {
    const { logout, currentUser } = useAuth();

    return (
        <div className="main-container" style={{ alignItems: 'flex-start', padding: '2rem' }}>
            <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <div>
                        <h1 className="title gradient-text" style={{ fontSize: '2.5rem' }}>Teacher Hub</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Educator portal for {currentUser?.email}</p>
                    </div>
                    <button onClick={logout} className="btn-secondary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem', padding: '2rem', animationDelay: '0.1s' }}>
                        <div style={{ background: 'rgba(247, 37, 133, 0.1)', padding: '1rem', borderRadius: '12px', width: 'fit-content', color: 'var(--accent-color)' }}>
                            <PenTool size={28} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem' }}>Create Assessment</h2>
                        <p style={{ color: 'var(--text-muted)', flex: 1 }}>Upload videos, audio, or PDFs. Select difficulty and question types, and let AI generate a base quiz you can refine and publish.</p>
                        <Link to="/generate-quiz" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>Generate Quiz</Link>
                    </div>

                    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem', padding: '2rem', animationDelay: '0.2s' }}>
                        <div style={{ background: 'rgba(67, 97, 238, 0.1)', padding: '1rem', borderRadius: '12px', width: 'fit-content', color: '#4361ee' }}>
                            <Users size={28} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem' }}>Manage Students</h2>
                        <p style={{ color: 'var(--text-muted)', flex: 1 }}>Publish generated quizzes directly to your class sections and review individual student tracking and performance data.</p>
                        <button className="btn-secondary" style={{ opacity: 0.5, cursor: 'not-allowed' }}>Class Roster</button>
                    </div>

                    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem', padding: '2rem', animationDelay: '0.3s' }}>
                        <div style={{ background: 'rgba(6, 214, 160, 0.1)', padding: '1rem', borderRadius: '12px', width: 'fit-content', color: 'var(--success-color)' }}>
                            <BarChart3 size={28} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem' }}>Performance Analytics</h2>
                        <p style={{ color: 'var(--text-muted)', flex: 1 }}>Access the leaderboard for every published quiz, view aggregate stats, and analyze which topics need further review.</p>
                        <Link to="/leaderboard" className="btn-secondary" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>View Statistics</Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
