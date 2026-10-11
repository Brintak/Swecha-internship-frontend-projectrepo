// Compact Modal Form for Adding and Editing Tasks
import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Edit3 } from 'lucide-react';

const TaskFormModal = ({ isOpen, onClose, onSubmit, initialTask = null }) => {
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getFormattedDate = (dateVal) => {
    if (!dateVal) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return formatLocalDate(tomorrow);
    }

    if (typeof dateVal === 'string') {
      const match = dateVal.match(/^\d{4}-\d{2}-\d{2}/);
      if (match) return match[0];
    }

    const d = new Date(dateVal);
    return formatLocalDate(d);
  };

  const getTodayDate = () => formatLocalDate(new Date());

  const getFormattedTime = (dueAt) => {
    if (!dueAt) return '23:59';
    const date = new Date(dueAt);
    if (Number.isNaN(date.getTime())) return '23:59';
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal',
    priority: 'Medium',
    startDate: getTodayDate(),
    dueDate: getFormattedDate(),
    dueTime: '09:00',
    status: 'Pending',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        category: initialTask.category || 'Personal',
        priority: initialTask.priority || 'Medium',
        startDate: getFormattedDate(initialTask.startDate || initialTask.dueDate),
        dueDate: getFormattedDate(initialTask.dueDate),
        dueTime: getFormattedTime(initialTask.dueAt),
        status: initialTask.status || 'Pending',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Personal',
        priority: 'Medium',
        startDate: getTodayDate(),
        dueDate: getFormattedDate(),
        dueTime: '09:00',
        status: 'Pending',
      });
    }
    setErrors({});
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on field change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (formData.dueDate && formData.startDate > formData.dueDate) {
      newErrors.startDate = 'Start date must be on or before the due date';
    }
    if (!formData.dueTime) {
      newErrors.dueTime = 'Due time is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      const dueAt = new Date(`${formData.dueDate}T${formData.dueTime}:00`);
      await onSubmit({
        ...formData,
        dueAt: dueAt.toISOString(),
      });
      onClose();
    } catch (err) {
      console.error('Failed to save task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {initialTask ? <Edit3 size={20} color="var(--primary)" /> : <PlusCircle size={20} color="var(--primary)" />}
            {initialTask ? 'Edit Task' : 'Add New Task'}
          </h3>
          <button
            type="button"
            className="action-icon-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid-2">
              {/* Task Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="task-title">
                  Task Title *
                </label>
                <input
                  id="task-title"
                  name="title"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Complete DBMS Assignment"
                  value={formData.title}
                  onChange={handleChange}
                  autoFocus
                />
                {errors.title && <span className="form-error-text">{errors.title}</span>}
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label" htmlFor="task-category">
                  Category
                </label>
                <select
                  id="task-category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Personal">Personal</option>
                  <option value="College">College</option>
                  <option value="Work">Work</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Description (Full Width) */}
              <div className="form-group">
                <label className="form-label" htmlFor="task-desc">
                  Description
                </label>
                <textarea
                  id="task-desc"
                  name="description"
                  className="form-textarea"
                  placeholder="Add details, notes, or sub-tasks..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                />
              </div>

              {/* Priority */}
              <div className="form-group">
                <label className="form-label" htmlFor="task-priority">
                  Priority
                </label>
                <select
                  id="task-priority"
                  name="priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">🟢 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🔴 High</option>
                </select>
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label" htmlFor="task-status">
                  Status
                </label>
                <select
                  id="task-status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Due Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="task-start-date">
                  Start Date *
                </label>
                <input
                  id="task-start-date"
                  name="startDate"
                  type="date"
                  className="form-input"
                  value={formData.startDate}
                  onChange={handleChange}
                />
                {errors.startDate && <span className="form-error-text">{errors.startDate}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-due-date">
                  Due Date *
                </label>
                <input
                  id="task-due-date"
                  name="dueDate"
                  type="date"
                  className="form-input"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
                {errors.dueDate && <span className="form-error-text">{errors.dueDate}</span>}
              </div>

              <div className="form-group full-width">
                <label className="form-label" htmlFor="task-due-time">
                  Due Time *
                </label>
                <input
                  id="task-due-time"
                  name="dueTime"
                  type="time"
                  className="form-input"
                  value={formData.dueTime}
                  onChange={handleChange}
                  required
                />
                {errors.dueTime && <span className="form-error-text">{errors.dueTime}</span>}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : initialTask ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
