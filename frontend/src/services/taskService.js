// API Service Layer for Communicating with Backend REST Endpoints
import axios from 'axios';
import { getSessionToken } from './authService';

// Determine backend API base URL from environment or default to local port 5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/tasks`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getSessionToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Fetch all tasks with optional filters (search, status, category, priority, filterType, sortBy)
export const getTasks = async (params = {}) => {
  const response = await api.get('/', { params });
  return response.data;
};

// Fetch dashboard statistics (Total, Completed, Pending, Overdue, Today's count)
export const getTaskStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

// Fetch a single task by ID
export const getTaskById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

// Create a new task
export const createTask = async (taskData) => {
  const response = await api.post('/', taskData);
  return response.data;
};

// Update an existing task or toggle its status
export const updateTask = async (id, updatedData) => {
  const response = await api.put(`/${id}`, updatedData);
  return response.data;
};

// Delete a task by ID
export const deleteTask = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

// Seed demo sample tasks for quick testing
export const seedSampleTasks = async () => {
  const response = await api.post('/seed');
  return response.data;
};

export default {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  seedSampleTasks,
};
