import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            // Store role and additional info in Firestore
            try {
                await signup(email, password, role, name);

                // Auto redirect to correct dashboard
                if (role === 'teacher') navigate('/teacher-dashboard');
                else navigate('/student-dashboard');

            } catch (fsErr) {
                console.error("Auth success but Firestore failed:", fsErr);
                setError('Account created, but database access failed. ' + fsErr.message);
                // navigate anyway or let them try to login
            }

        } catch (err) {
            setError('Failed to create an account: ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="main-container">
            <div className="view-panel glass-panel" style={{ maxWidth: '500px', width: '100%', padding: '3rem' }}>
                <h2 className="title" style={{ fontSize: '2.5rem', textAlign: 'center' }}>Create Account</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Join the next generation of AI learning</p>

                {error && <div style={{ background: 'var(--error-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', color: 'white' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '12px' }}>
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: role === 'student' ? 'var(--accent-color)' : 'transparent',
                                color: 'white',
                                borderRadius: '8px'
                            }}
                        >
                            I'm a Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('teacher')}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: role === 'teacher' ? 'var(--primary-color)' : 'transparent',
                                color: 'white',
                                borderRadius: '8px'
                            }}
                        >
                            I'm a Teacher
                        </button>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                        <input
                            type="text"
                            required
                            style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)', color: 'white' }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                        <input
                            type="email"
                            required
                            style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)', color: 'white' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
                        <input
                            type="password"
                            required
                            style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)', color: 'white' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button disabled={loading} type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                        Sign Up as {role === 'student' ? 'Student' : 'Teacher'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Log In</Link>
                </div>
            </div>
        </div>
    );
}
