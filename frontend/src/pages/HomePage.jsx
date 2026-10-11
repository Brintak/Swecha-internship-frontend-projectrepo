import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  CheckCircle2,
  Calendar,
  AlertTriangle,
  BarChart3,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className="page-container-scrollable">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <Zap size={15} />
          <span>Full-Stack Task Management</span>
        </div>

        <h1 className="hero-title">
          Organize Your Tasks. <br />
          <span>Simplify Your Day.</span>
        </h1>

        <p className="hero-subtitle">
          A modern, responsive, and intelligent full-stack to-do application designed for seamless
          productivity. Track priorities, manage due dates, and monitor daily progress with ease.
        </p>

        <div className="hero-actions">
          {user ? (
            <Link to="/dashboard" className="btn-primary hero-btn-lg">
              <span>Open Dashboard</span>
              <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary hero-btn-lg">
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-secondary hero-btn-lg">
                <span>Sign In</span>
              </Link>
            </>
          )}
          <Link to="/about" className="btn-secondary hero-btn-lg">
            <span>Project Architecture</span>
          </Link>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <BarChart3 size={22} />
          </div>
          <h3 className="feature-card-title">Dynamic Statistics</h3>
          <p className="feature-card-desc">
            Real-time calculation of total, completed, pending, and overdue tasks directly from MongoDB.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
            <AlertTriangle size={22} />
          </div>
          <h3 className="feature-card-title">Smart Overdue Detection</h3>
          <p className="feature-card-desc">
            Automatically detects tasks that have crossed their due date and highlights them with urgent badges.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <Calendar size={22} />
          </div>
          <h3 className="feature-card-title">Today's Focus Pane</h3>
          <p className="feature-card-desc">
            Dedicated sidebar to keep you focused exclusively on tasks and milestones due today.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Layers size={22} />
          </div>
          <h3 className="feature-card-title">Category & Priority Tagging</h3>
          <p className="feature-card-desc">
            Organize tasks by College, Personal, Work, or Shopping, with color-coded priority indicators.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <CheckCircle2 size={22} />
          </div>
          <h3 className="feature-card-title">Instant Status Toggle</h3>
          <p className="feature-card-desc">
            One-click task completion with dynamic progress tracking and visual feedback.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <ShieldCheck size={22} />
          </div>
          <h3 className="feature-card-title">Full REST API Integration</h3>
          <p className="feature-card-desc">
            Standard RESTful architecture using Node.js, Express, Mongoose, and React with Axios.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
