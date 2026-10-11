// Mongoose Model for Task
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['Personal', 'College', 'Work', 'Shopping', 'Other'],
      default: 'Personal',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    startDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    dueAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true, // Automatically creates and manages createdAt and updatedAt
  }
);

// Virtual property or helper to check if a task is overdue
taskSchema.methods.isOverdue = function () {
  if (this.status === 'Completed') return false;
  if (this.dueAt) return new Date(this.dueAt) < new Date();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDue = new Date(this.dueDate);
  taskDue.setHours(0, 0, 0, 0);
  return taskDue < today;
};

module.exports = mongoose.model('Task', taskSchema);
