import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ChevronLeft, Medal } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function Leaderboard() {
    const [boardData, setBoardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userRole } = useAuth();

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const q = query(
                    collection(db, 'leaderboard'),
                    orderBy('score', 'desc'),
                    limit(20)
                );
                const querySnapshot = await getDocs(q);
                const data = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() });
                });

                data.sort((a, b) => {
                    const pctA = a.total > 0 ? a.score / a.total : 0;
                    const pctB = b.total > 0 ? b.score / b.total : 0;
                    return pctB - pctA;
                });

                setBoardData(data);
            } catch (e) {
                console.error("Error fetching leaderboard: ", e);
            }
            setLoading(false);
        }
        fetchLeaderboard();
    }, []);

    return (
        <div className="main-container" style={{ alignItems: 'flex-start', padding: '2rem' }}>
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <Link to={userRole === 'teacher' ? "/teacher-dashboard" : "/student-dashboard"} style={{ color: 'var(--text-muted)' }}>
                        <ChevronLeft size={28} />
                    </Link>
                    <h1 className="title gradient-text" style={{ fontSize: '2.5rem', margin: '0' }}>Real-time Leaderboard</h1>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading Analytics...</div>
                    ) : boardData.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No completed quizzes yet. Be the first!</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {boardData.map((entry, idx) => {
                                const percentage = entry.total > 0 ? Math.round((entry.score / entry.total) * 100) : 0;
                                let rankIcon = null;
                                if (idx === 0) rankIcon = <Medal size={28} style={{ color: '#FFD700' }} />;
                                else if (idx === 1) rankIcon = <Medal size={28} style={{ color: '#C0C0C0' }} />;
                                else if (idx === 2) rankIcon = <Medal size={28} style={{ color: '#CD7F32' }} />;

                                return (
                                    <div key={entry.id} style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', gap: '1.5rem', animation: `fadeIn 0.3s ease-out ${idx * 0.1}s forwards`, opacity: 0 }}>
                                        <div style={{ width: '40px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                                            {rankIcon || `#${idx + 1}`}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{entry.userEmail.split('@')[0]}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{entry.timestamp?.toDate ? new Date(entry.timestamp.toDate()).toLocaleDateString() : 'Just now'}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{percentage}%</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{entry.score} / {entry.total} points</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
