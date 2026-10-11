// Entry point for Node.js / Express Backend Server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.set('trust proxy', 1);

// Middleware: Enable CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware: Body parser to read JSON request payloads
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart To-Do API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
      <h2>🚀 Smart To-Do & Task Management API</h2>
      <p>The backend server is active and running.</p>
      <p>REST API Endpoint: <a href="/api/tasks">/api/tasks</a></p>
    </div>
  `);
});

// Mount Task REST API Routes
app.use('/api/tasks', taskRoutes);

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`,
  });
});

// Centralized error handling middleware
app.use(errorHandler);

// Read port from environment variable for Railway/production deployment, or fallback to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 Local API URL: http://localhost:${PORT}/api/tasks`);
});
