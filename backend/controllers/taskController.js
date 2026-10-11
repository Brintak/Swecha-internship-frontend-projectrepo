// Task Controller - Handles business logic for REST API endpoints
const Task = require('../models/Task');

const getDateKey = (value) => {
  if (typeof value === 'string') {
    const match = value.match(/^\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};

// @desc    Get all tasks with optional search, filter, and sorting
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res, next) => {
  try {
    const { search, status, category, priority, filterType, sortBy } = req.query;

    // Build query object
    let query = {};

    // 1. Text Search (Matches title or description case-insensitively)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // 2. Direct Filters
    if (status && status !== 'All') {
      query.status = status;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // 3. Smart Date Filters (Overdue / Today)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    if (filterType === 'overdue') {
      query.$and = [
        ...(query.$and || []),
        {
          $or: [
            { dueAt: { $lt: new Date() } },
            {
              $and: [
                { $or: [{ dueAt: { $exists: false } }, { dueAt: null }] },
                { dueDate: { $lt: todayStart } },
              ],
            },
          ],
        },
      ];
      query.status = { $ne: 'Completed' };
    } else if (filterType === 'today') {
      query.dueDate = { $gte: todayStart, $lte: todayEnd };
    }

    // 4. Sorting logic
    let sortOptions = { createdAt: -1 }; // Default: Recently added

    if (sortBy === 'dueDate_asc') {
      sortOptions = { dueDate: 1 };
    } else if (sortBy === 'dueDate_desc') {
      sortOptions = { dueDate: -1 };
    } else if (sortBy === 'alphabetical') {
      sortOptions = { title: 1 };
    } else if (sortBy === 'priority') {
      // Custom priority order can be handled in post-sort or mapped
      sortOptions = { priority: 1, dueDate: 1 };
    }

    const tasks = await Task.find(query).sort(sortOptions);

    // If sorting by priority, we can ensure High -> Medium -> Low order
    let finalTasks = tasks;
    if (sortBy === 'priority') {
      const priorityWeights = { High: 1, Medium: 2, Low: 3 };
      finalTasks = [...tasks].sort((a, b) => {
        const weightA = priorityWeights[a.priority] || 4;
        const weightB = priorityWeights[b.priority] || 4;
        return weightA - weightB;
      });
    }

    res.status(200).json({
      success: true,
      count: finalTasks.length,
      data: finalTasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics (Total, Completed, Pending, Overdue, Today)
// @route   GET /api/tasks/stats
// @access  Public
const getTaskStats = async (req, res, next) => {
  try {
    const allTasks = await Task.find({});

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.status === 'Completed').length;
    const inProgress = allTasks.filter((t) => t.status === 'In Progress').length;
    const pending = allTasks.filter((t) => t.status === 'Pending').length;

    // Overdue: due date is in the past AND status is not Completed
    const now = new Date();
    const overdue = allTasks.filter((t) => {
      if (t.status === 'Completed') return false;
      if (t.dueAt) return new Date(t.dueAt) < now;
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      return due < todayStart;
    }).length;

    // Today's tasks
    const todayTasks = allTasks.filter((t) => {
      const due = new Date(t.dueDate);
      return due >= todayStart && due <= todayEnd;
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending: pending + inProgress, // Combined active pending count
        purePending: pending,
        inProgress,
        overdue,
        todayCount: todayTasks.length,
        completionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Public
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res, next) => {
  try {
    const { title, description, category, priority, startDate, dueDate, dueAt, status } = req.body;

    // Basic Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a task title',
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a due date',
      });
    }

    const resolvedStartDate = startDate || dueDate;
    const startDateKey = getDateKey(resolvedStartDate);
    const dueDateKey = getDateKey(dueDate);
    if (!startDateKey || !dueDateKey) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid start and due dates',
      });
    }
    if (startDateKey > dueDateKey) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be on or before the due date',
      });
    }

    let parsedDueAt;
    if (dueAt) {
      parsedDueAt = new Date(dueAt);
      if (Number.isNaN(parsedDueAt.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid due date and time',
        });
      }
    }

    const taskData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category || 'Personal',
      priority: priority || 'Medium',
      startDate: new Date(resolvedStartDate),
      dueDate: new Date(dueDate),
      status: status || 'Pending',
    };
    if (parsedDueAt) taskData.dueAt = parsedDueAt;

    const newTask = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${req.params.id} not found`,
      });
    }

    // Update fields if provided
    const { title, description, category, priority, startDate, dueDate, dueAt, status } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (category !== undefined) task.category = category;
    if (priority !== undefined) task.priority = priority;
    const nextDueDate = dueDate !== undefined ? new Date(dueDate) : task.dueDate;
    const nextStartDate = startDate !== undefined
      ? new Date(startDate)
      : task.startDate || (dueDate !== undefined ? nextDueDate : undefined);

    if (dueDate !== undefined && Number.isNaN(nextDueDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid due date',
      });
    }
    if (startDate !== undefined && Number.isNaN(nextStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid start date',
      });
    }
    if (startDate !== undefined || dueDate !== undefined) {
      const startDateKey = getDateKey(nextStartDate || nextDueDate);
      const dueDateKey = getDateKey(nextDueDate);
      if (!startDateKey || !dueDateKey || startDateKey > dueDateKey) {
        return res.status(400).json({
          success: false,
          message: 'Start date must be on or before the due date',
        });
      }
    }

    if (dueDate !== undefined) task.dueDate = nextDueDate;
    if (startDate !== undefined) task.startDate = nextStartDate;
    else if (dueDate !== undefined && !task.startDate) task.startDate = nextDueDate;
    if (dueAt !== undefined) {
      if (!dueAt) {
        task.dueAt = undefined;
      } else {
        const parsedDueAt = new Date(dueAt);
        if (Number.isNaN(parsedDueAt.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Please provide a valid due date and time',
          });
        }
        task.dueAt = parsedDueAt;
      }
    } else if (dueDate !== undefined) {
      task.dueAt = undefined;
    }

    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${req.params.id} not found`,
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed sample tasks for quick testing/demo
// @route   POST /api/tasks/seed
// @access  Public
const seedSampleTasks = async (req, res, next) => {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 2);

    const sampleTasks = [
      {
        title: 'Complete DBMS Assignment',
        description: 'Design ER Diagram and write SQL queries for College Library Management.',
        category: 'College',
        priority: 'High',
        dueDate: today,
        status: 'In Progress',
      },
      {
        title: 'Study Java Spring Boot & REST APIs',
        description: 'Read Chapter 4 on Controllers and Services for upcoming viva.',
        category: 'College',
        priority: 'Medium',
        dueDate: tomorrow,
        status: 'Pending',
      },
      {
        title: 'Buy Groceries & Weekly Supplies',
        description: 'Milk, oats, fruits, and notebook from the store.',
        category: 'Shopping',
        priority: 'Low',
        dueDate: tomorrow,
        status: 'Completed',
      },
      {
        title: 'Submit Lab Record',
        description: 'Get record verified and signed by subject faculty.',
        category: 'College',
        priority: 'High',
        dueDate: yesterday, // Will trigger Overdue smart feature
        status: 'Pending',
      },
      {
        title: 'Gym Workout - Leg Day',
        description: 'Squats, lunges, and 15 mins cardio.',
        category: 'Personal',
        priority: 'Low',
        dueDate: today,
        status: 'Pending',
      },
    ];

    await Task.deleteMany({});
    const created = await Task.insertMany(sampleTasks);

    res.status(201).json({
      success: true,
      message: 'Demo tasks seeded successfully',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  seedSampleTasks,
};
