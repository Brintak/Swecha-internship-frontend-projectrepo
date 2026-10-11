import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'smart-todo-session';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getSessionToken = () => window.localStorage.getItem(TOKEN_KEY);
export const saveSessionToken = (token) => window.localStorage.setItem(TOKEN_KEY, token);
export const clearSessionToken = () => window.localStorage.removeItem(TOKEN_KEY);

export const getSetupStatus = async () => (await api.get('/setup')).data;
export const bootstrapOwner = async (data) => (await api.post('/bootstrap', data)).data;
export const registerAccount = async (data) => (await api.post('/register', data)).data;
export const loginAccount = async (data) => (await api.post('/login', data)).data;
export const getCurrentUser = async () => (await api.get('/me')).data;
export const logoutAccount = async () => (await api.post('/logout')).data;