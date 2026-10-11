import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

const formatDueDate = (dueDate, dueAt) => {
  const dateKey = typeof dueDate === 'string' ? dueDate.slice(0, 10) : '';
  const date = new Date(`${dateKey}T12:00:00`);
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = dueAt
    ? new Date(dueAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : 'end of day';

  return `${formattedDate} at ${formattedTime}`;
};

const ReminderModal = ({ tasks, onDismiss, onMarkComplete }) => {
  if (tasks.length === 0) return null;

  return (
    <div className="modal-overlay reminder-overlay" onClick={onDismiss}>
      <section
        className="modal-content reminder-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-reminder-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="task-reminder-title" className="modal-title">
            <AlertCircle size={20} color="var(--danger)" />
            Task reminders
          </h3>
        </div>

        <div className="modal-body reminder-body">
          <p className="reminder-intro">
            You have {tasks.length} active task{tasks.length === 1 ? '' : 's'} due today or overdue.
          </p>
          <ul className="reminder-list">
            {tasks.map((task) => (
              <li className="reminder-item" key={task._id}>
                <div className="reminder-item-copy">
                  <span
                    className={`reminder-status ${task.reminderStatus === 'Overdue' ? 'is-overdue' : 'is-due-today'}`}
                  >
                    {task.reminderStatus}
                  </span>
                  <strong className="reminder-task-title">{task.title}</strong>
                  <span className="reminder-due-date">Due {formatDueDate(task.dueDate, task.dueAt)}</span>
                </div>
                <button
                  type="button"
                  className="reminder-complete-btn"
                  onClick={() => onMarkComplete(task)}
                  aria-label={`Mark ${task.title} as completed`}
                >
                  <Check size={15} />
                  Mark complete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="modal-footer reminder-footer">
          <span className="reminder-footer-note">Dismissed reminders return tomorrow.</span>
          <button type="button" className="btn-primary" onClick={onDismiss}>
            Got it
          </button>
        </div>
      </section>
    </div>
  );
};

export default ReminderModal;