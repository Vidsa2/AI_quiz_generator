import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, userRole } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            const user = await login(email, password);

            // Navigate based on roles later - handle via context useEffect ideally,
            // but here we wait for AuthContext to resolve role. We will navigate to generic place for now.
            setTimeout(() => {
                navigate('/generate-quiz'); // App.jsx ProtectedRoute will redirect if wrong role
            }, 500);

        } catch (err) {
            setError('Failed to log in: ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="main-container">
            <div className="view-panel glass-panel" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="title" style={{ fontSize: '2.5rem', textAlign: 'center' }}>Welcome Back</h2>
                {error && <div style={{ background: 'var(--error-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', color: 'white' }}>{error}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
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
                    <button disabled={loading} type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                        Log In
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
                    Need an account? <Link to="/signup" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Sign Up</Link>
                </div>
            </div>
        </div>
    );
}
