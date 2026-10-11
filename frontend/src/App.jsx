// Main Application Component with Router and Global Toast System
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import './styles/app.css';

// Wrapper component to provide navigation handling to Navbar
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <main className="auth-page"><p>Loading your private workspace…</p></main>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
};

const AppContent = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [toastMessage, setToastMessage] = useState(null);

  // Trigger toast notification
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Quick action from Navbar "Add Task" button -> routes to dashboard and triggers modal
  const handleOpenAddTaskFromNav = () => {
    navigate('/dashboard');
    setTimeout(() => {
      const addBtn = document.getElementById('add-task-btn');
      if (addBtn) addBtn.click();
    }, 100);
  };

  return (
    <>
      {/* Top Navbar */}
      <Navbar
        user={user}
        onLogout={async () => {
          await signOut();
          navigate('/');
        }}
        onOpenAddTask={handleOpenAddTaskFromNav}
      />

      {/* Main Routed Content */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/register" element={<AuthPage initialMode="register" />} />
        <Route
          path="/dashboard"
          element={(
            <RequireAuth>
              <DashboardPage showToast={showToast} />
            </RequireAuth>
          )}
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <CheckCircle2 size={18} color="var(--success)" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
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
