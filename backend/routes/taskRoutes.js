// Express Router for Task Endpoints
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');

const {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  seedSampleTasks,
} = require('../controllers/taskController');

router.use(authenticate);

// Route for getting statistics
router.get('/stats', getTaskStats);

// Route for seeding sample demo data
router.post('/seed', seedSampleTasks);

// Main collection routes: GET all tasks, POST create task
router.route('/').get(getTasks).post(createTask);

// Individual item routes: GET one task, PUT update task, DELETE task
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;
