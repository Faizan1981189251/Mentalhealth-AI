import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SessionProvider } from './contexts/SessionContext';
import HomePage from './pages/HomePage';
import LoginForm from './components/Auth/LoginForm';
import PatientDashboard from './pages/PatientDashboard';
import TherapistDashboard from './pages/TherapistDashboard';
import SessionsOverview from './pages/SessionsOverview';
import SessionAnalysis from './pages/SessionAnalysis';
import Header from './components/Layout/Header';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { Session } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    // Load sessions for therapist header alerts
    if (user?.role === 'therapist') {
      const savedSessions = JSON.parse(localStorage.getItem('mindbridge_sessions') || '[]');
      setSessions(savedSessions);
    }
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!user ? <HomePage /> : <Navigate to={user.role === 'patient' ? '/patient' : '/therapist'} replace />} />
        <Route path="/login" element={!user ? <LoginForm /> : <Navigate to={user.role === 'patient' ? '/patient' : '/therapist'} replace />} />
        
        {/* Protected Routes */}
        <Route 
          path="/patient" 
          element={
            <ProtectedRoute>
              <SessionProvider>
                <Header sessions={sessions} />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {user?.role === 'patient' ? <PatientDashboard /> : <Navigate to="/therapist" />}
                </main>
              </SessionProvider>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/therapist" 
          element={
            <ProtectedRoute>
              <Header sessions={sessions} />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {user?.role === 'therapist' ? <TherapistDashboard /> : <Navigate to="/patient" />}
              </main>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sessions" 
          element={
            <ProtectedRoute>
              <Header sessions={sessions} />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {user?.role === 'therapist' ? <SessionsOverview /> : <Navigate to="/patient" />}
              </main>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/session-analysis/:sessionId" 
          element={
            <ProtectedRoute>
              {user?.role === 'therapist' ? <SessionAnalysis /> : <Navigate to="/patient" />}
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;