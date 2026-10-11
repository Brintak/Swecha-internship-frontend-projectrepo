// About Page - Technical Overview & Viva Reference
import React from 'react';
import { Database, Server, Layout, CheckCircle, Code, Shield } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="page-container-scrollable">
      <div className="about-card">
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          About Smart To-Do & Task Management Application
        </h2>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          A full-stack web application developed for college coursework, emphasizing clean
          architecture, RESTful API design, dynamic MongoDB queries, and a modern viewport-first
          responsive UI.
        </p>

        {/* Technology Stack */}
        <h3 className="about-section-title">
          <Code size={20} color="var(--primary)" /> Technology Stack
        </h3>
        <div className="tech-stack-badges">
          <span className="tech-badge">React.js (Vite)</span>
          <span className="tech-badge">React Hooks</span>
          <span className="tech-badge">React Router DOM</span>
          <span className="tech-badge">Axios API Client</span>
          <span className="tech-badge">Node.js</span>
          <span className="tech-badge">Express.js</span>
          <span className="tech-badge">MongoDB</span>
          <span className="tech-badge">Mongoose ODM</span>
          <span className="tech-badge">CSS3 Flexbox / Grid</span>
          <span className="tech-badge">Railway & Atlas Ready</span>
        </div>

        {/* Viva-Friendly Architecture Explanation */}
        <h3 className="about-section-title">
          <Layout size={20} color="var(--primary)" /> How This Application Works (Viva Guide)
        </h3>
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            lineHeight: 1.6,
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
          }}
        >
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>1. Frontend Interaction:</strong> The user creates, modifies, or marks tasks as
            completed through the responsive React interface.
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>2. RESTful API Request:</strong> The frontend makes asynchronous HTTP requests
            using Axios to the Express backend endpoints (e.g. <code>/api/tasks</code>).
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>3. Backend Processing & Controller:</strong> Express routes the request to
            dedicated controller functions, which validate data and execute Mongoose database
            operations.
          </p>
          <p>
            <strong>4. Database & Dynamic Response:</strong> MongoDB persists the task data. The
            server returns structured JSON responses back to React, triggering state updates and
            immediate UI re-renders.
          </p>
        </div>

        {/* REST API Endpoints Table */}
        <h3 className="about-section-title">
          <Server size={20} color="var(--primary)" /> REST API Endpoints
        </h3>
        <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.88rem',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.65rem 0.85rem' }}>Method</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Endpoint</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>CRUD Operation</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.6rem 0.85rem', fontWeight: 700, color: 'var(--info)' }}>GET</td>
                <td style={{ padding: '0.6rem 0.85rem' }}><code>/api/tasks</code></td>
                <td style={{ padding: '0.6rem 0.85rem' }}>Read</td>
                <td style={{ padding: '0.6rem 0.85rem' }}>Fetch all tasks with search, filter, and sort queries</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.6rem 0.85rem', fontWeight: 700, color: 'var(--info)' }}>GET</td>
                <td style={{ padding: '0.6rem 0.85rem' }}><code>/api/tasks/stats</code></td>
                <td style={{ padding: '0.6rem 0.85rem' }}>Read (Aggregation)</td>
                <td style={{ padding: '0.6rem 0.85rem' }}>Get summary statistics (Total, Completed, Pending, Overdue)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.6rem 0.85rem', fontWeight: 700, color: 'var(--success)' }}>POST</td>
                <td style={{ padding: '0.6rem 0.85rem' }}><code>/api/tasks</code></td>
                <td style={{ padding: '0.6rem 0.85rem' }}>Create</td>
                <td style={{ padding: '0.6rem 0.85rem' }}>Create and validate a new task in MongoDB</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.6rem 0.85rem', fontWeight: 700, color: 'var(--warning-text)' }}>PUT</td>
                <td style={{ padding: '0.6rem 0.85rem' }}><code>/api/tasks/:id</code></td>
                <td style={{ padding: '0.6rem 0.85rem' }}>Update</td>
                <td style={{ padding: '0.6rem 0.85rem' }}>Update task attributes or toggle completion status</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.6rem 0.85rem', fontWeight: 700, color: 'var(--danger)' }}>DELETE</td>
                <td style={{ padding: '0.6rem 0.85rem' }}><code>/api/tasks/:id</code></td>
                <td style={{ padding: '0.6rem 0.85rem' }}>Delete</td>
                <td style={{ padding: '0.6rem 0.85rem' }}>Permanently remove task by ID</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Smart Features List */}
        <h3 className="about-section-title">
          <CheckCircle size={20} color="var(--primary)" /> Smart Features Highlights
        </h3>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <li>
            <strong>Overdue Detection:</strong> Evaluates whether <code>dueDate &lt; currentDate</code> and <code>status !== 'Completed'</code>, dynamically updating the statistic card and applying an urgent OVERDUE badge.
          </li>
          <li>
            <strong>Priority Management:</strong> Visual indicator badges (🔴 High, 🟡 Medium, 🟢 Low) with sorting support.
          </li>
          <li>
            <strong>Progress Tracking:</strong> Real-time progress bar computing <code>(completed / total) * 100</code>.
          </li>
          <li>
            <strong>Today's Focus Pane:</strong> Dedicated widget identifying tasks due on the current day.
          </li>
          <li>
            <strong>Desktop-Style Viewport:</strong> Structured with zero page scrolling on desktop viewports and smooth internal scrolling inside the task list pane.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
