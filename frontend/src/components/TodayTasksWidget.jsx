// Today's Tasks Sidebar Widget - Highlights tasks due on the current day
import React from 'react';
import { CalendarDays, CheckCircle2 } from 'lucide-react';

const TodayTasksWidget = ({ tasks, onToggleComplete }) => {
  // Check if a date matches today (local calendar date)
  const isDateToday = (dateString) => {
    if (!dateString) return false;
    const taskDate = new Date(dateString);
    const today = new Date();
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  };

  const todayTasks = tasks.filter((task) => isDateToday(task.dueDate));

  return (
    <div className="today-tasks-pane">
      <div className="pane-header">
        <span className="pane-title">
          <CalendarDays size={18} color="var(--primary)" />
          Today's Tasks
        </span>
        <span className="task-count-badge">{todayTasks.length}</span>
      </div>

      <div className="today-tasks-list">
        {todayTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.88rem' }}>No tasks due today 🎉</p>
            <span style={{ fontSize: '0.78rem' }}>Enjoy your day or plan ahead!</span>
          </div>
        ) : (
          todayTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            return (
              <div key={task._id} className="today-task-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                  <button
                    type="button"
                    className={`task-checkbox-btn ${isCompleted ? 'checked' : ''}`}
                    onClick={() => onToggleComplete(task)}
                    style={{ width: '17px', height: '17px', marginTop: 0 }}
                  >
                    {isCompleted && <CheckCircle2 size={13} />}
                  </button>
                  <span
                    className="today-task-title"
                    style={{
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                    }}
                  >
                    {task.title}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color:
                      task.priority === 'High'
                        ? 'var(--danger)'
                        : task.priority === 'Medium'
                        ? 'var(--warning-text)'
                        : 'var(--success-text)',
                  }}
                >
                  {task.priority}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TodayTasksWidget;
