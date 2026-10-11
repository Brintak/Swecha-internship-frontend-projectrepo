// Task Card Component - Displays individual task details and action buttons
import React from 'react';
import { Calendar, Check, Edit2, Trash2, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  // Format readable date
  const getDateKey = (dateValue) => {
    if (typeof dateValue === 'string') {
      const match = dateValue.match(/^\d{4}-\d{2}-\d{2}/);
      if (match) return match[0];
    }
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const dateKey = getDateKey(dateString);
    if (!dateKey) return '';
    const d = new Date(`${dateKey}T12:00:00`);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Smart Feature 1: Overdue Detection
  const checkIsOverdue = () => {
    if (task.status === 'Completed') return false;
    if (task.dueAt) return new Date(task.dueAt) < new Date();
    const today = new Date();
    const todayKey = getDateKey(today);
    return getDateKey(task.dueDate) < todayKey;
  };

  const formatTime = (dueAt) => {
    if (!dueAt) return 'End of day';
    const date = new Date(dueAt);
    return Number.isNaN(date.getTime())
      ? 'End of day'
      : date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const isOverdue = checkIsOverdue();
  const isCompleted = task.status === 'Completed';

  // Smart Feature 2: Priority Icon / Badge Class
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="badge badge-priority-high">🔴 High</span>;
      case 'Medium':
        return <span className="badge badge-priority-medium">🟡 Medium</span>;
      case 'Low':
      default:
        return <span className="badge badge-priority-low">🟢 Low</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge badge-status-completed">Completed</span>;
      case 'In Progress':
        return <span className="badge badge-status-in-progress">In Progress</span>;
      case 'Pending':
      default:
        return <span className="badge badge-status-pending">Pending</span>;
    }
  };

  return (
    <div
      className={`task-card priority-${task.priority?.toLowerCase() || 'medium'} ${
        isCompleted ? 'is-completed' : ''
      }`}
    >
      {/* Complete Task Checkbox */}
      <button
        type="button"
        className={`task-checkbox-btn ${isCompleted ? 'checked' : ''}`}
        onClick={() => onToggleComplete(task)}
        title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
        aria-label="Toggle task completion"
      >
        {isCompleted && <Check size={14} strokeWidth={3} />}
      </button>

      {/* Task Content */}
      <div className="task-card-content">
        <div className="task-card-header">
          <h4 className="task-card-title">{task.title}</h4>
          <div className="task-card-actions">
            <button
              type="button"
              className="action-icon-btn"
              onClick={() => onEdit(task)}
              title="Edit Task"
              aria-label="Edit Task"
            >
              <Edit2 size={15} />
            </button>
            <button
              type="button"
              className="action-icon-btn btn-delete"
              onClick={() => onDelete(task)}
              title="Delete Task"
              aria-label="Delete Task"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {task.description && <p className="task-card-desc">{task.description}</p>}

        <div className="task-card-meta">
          {/* Category Pill */}
          <span className="badge badge-category">{task.category || 'General'}</span>

          {/* Priority Indicator */}
          {getPriorityBadge(task.priority)}

          {/* Status Badge */}
          {getStatusBadge(task.status)}

          {/* Overdue Alert Badge */}
          {isOverdue && (
            <span className="badge badge-overdue" title="Task is past its due date!">
              <AlertCircle size={12} /> OVERDUE
            </span>
          )}

          {/* Due Date */}
          <span className={`task-due-date ${isOverdue ? 'is-overdue-text' : ''}`}>
            <Calendar size={13} />
            Due: {formatDate(task.dueDate)} at {formatTime(task.dueAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
