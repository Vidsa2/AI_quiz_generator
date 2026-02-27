import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FilePlus, Target, Award, LogOut } from 'lucide-react';

export default function StudentDashboard() {
    const { logout, currentUser } = useAuth();

    return (
        <div className="main-container" style={{ alignItems: 'flex-start', padding: '2rem' }}>
            <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <div>
                        <h1 className="title gradient-text" style={{ fontSize: '2.5rem' }}>Student Hub</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Welcome back, {currentUser?.email}</p>
                    </div>
                    <button onClick={logout} className="btn-secondary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem', padding: '2rem', animationDelay: '0.1s' }}>
                        <div style={{ background: 'rgba(247, 37, 133, 0.1)', padding: '1rem', borderRadius: '12px', width: 'fit-content', color: 'var(--accent-color)' }}>
                            <FilePlus size={28} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem' }}>Self Practice</h2>
                        <p style={{ color: 'var(--text-muted)', flex: 1 }}>Upload your own study materials, lectures, or readings and generate private quizzes designed for self-assessment only.</p>
                        <Link to="/generate-quiz" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>Create Practice Quiz</Link>
                    </div>

                    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem', padding: '2rem', animationDelay: '0.2s' }}>
                        <div style={{ background: 'rgba(67, 97, 238, 0.1)', padding: '1rem', borderRadius: '12px', width: 'fit-content', color: '#4361ee' }}>
                            <Target size={28} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem' }}>Assigned Quizzes</h2>
                        <p style={{ color: 'var(--text-muted)', flex: 1 }}>View and complete official quizzes published by your teachers. Your scores will reflect on the leaderboard.</p>
                        <button className="btn-secondary" style={{ opacity: 0.5, cursor: 'not-allowed' }}>No new assignments</button>
                    </div>

                    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem', padding: '2rem', animationDelay: '0.3s' }}>
                        <div style={{ background: 'rgba(6, 214, 160, 0.1)', padding: '1rem', borderRadius: '12px', width: 'fit-content', color: 'var(--success-color)' }}>
                            <Award size={28} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem' }}>Achievements</h2>
                        <p style={{ color: 'var(--text-muted)', flex: 1 }}>Check your leaderboard ranking, average accuracy, completion time, and overall study progress analytics.</p>
                        <Link to="/leaderboard" className="btn-secondary" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>View Analytics</Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
