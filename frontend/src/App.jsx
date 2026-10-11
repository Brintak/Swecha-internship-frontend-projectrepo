// Main Application Component with Router and Global Toast System
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import './styles/app.css';

// Wrapper component to provide navigation handling to Navbar
const AppContent = () => {
  const navigate = useNavigate();
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
      <Navbar onOpenAddTask={handleOpenAddTaskFromNav} />

      {/* Main Routed Content */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage showToast={showToast} />} />
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
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
