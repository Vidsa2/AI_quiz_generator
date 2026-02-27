import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import QuizGenerator from './pages/QuizGenerator';
import QuizEditor from './pages/QuizEditor';
import QuizTaker from './pages/QuizTaker';
import Leaderboard from './pages/Leaderboard';
import './App.css';

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <div className="loading-container">Loading authenticating session...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // User is authenticated but doesn't have the required role
    if (userRole === 'teacher') return <Navigate to="/teacher-dashboard" replace />;
    return <Navigate to="/student-dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/student-dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />

          <Route path="/teacher-dashboard" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />

          <Route path="/generate-quiz" element={
            <ProtectedRoute allowedRoles={['teacher', 'student']}>
              <QuizGenerator />
            </ProtectedRoute>
          } />

          <Route path="/quiz-editor" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <QuizEditor />
            </ProtectedRoute>
          } />

          <Route path="/quiz-taker" element={
            <ProtectedRoute allowedRoles={['teacher', 'student']}>
              <QuizTaker />
            </ProtectedRoute>
          } />

          <Route path="/leaderboard" element={
            <ProtectedRoute allowedRoles={['teacher', 'student']}>
              <Leaderboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
