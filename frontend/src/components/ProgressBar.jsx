// Progress Summary Bar Component
import React from 'react';
import { Award } from 'lucide-react';

const ProgressBar = ({ total, completed }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-summary-card">
      <div className="progress-header">
        <Award size={18} color="var(--primary)" />
        <span className="progress-title">Overall Progress</span>
      </div>

      <div className="progress-track-wrapper">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${percentage}%` }}
            aria-valuenow={percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <span className="progress-percent">{percentage}%</span>
      </div>

      <div className="progress-count-text">
        <strong>{completed}</strong> of <strong>{total}</strong> tasks completed
      </div>
    </div>
  );
};

export default ProgressBar;
