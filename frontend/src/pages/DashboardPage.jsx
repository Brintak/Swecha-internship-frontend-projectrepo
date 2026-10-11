// Main Dashboard Page - Fixed-Height Viewport with Internal Task-List Scrolling
import React, { useState, useEffect, useCallback } from 'react';
import {
  getTasks,
  getTaskStats,
  createTask,
  updateTask,
  deleteTask,
  seedSampleTasks,
} from '../services/taskService';

import StatCards from '../components/StatCards';
import ProgressBar from '../components/ProgressBar';
import FilterBar from '../components/FilterBar';
import TaskCard from '../components/TaskCard';
import TodayTasksWidget from '../components/TodayTasksWidget';
import TaskFormModal from '../components/TaskFormModal';
import DeleteModal from '../components/DeleteModal';

import { ListTodo, Plus, AlertCircle, RefreshCw } from 'lucide-react';

const DashboardPage = ({ showToast }) => {
  // State for task data and statistics
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]); // Kept for widgets & progress calculations
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    todayCount: 0,
    completionRate: 0,
  });

  // State for controls
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [filterType, setFilterType] = useState(''); // 'overdue' or 'today'
  const [sortBy, setSortBy] = useState('newest');

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const res = await getTaskStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  };

  // Fetch tasks according to current filter/search parameters
  const fetchTasksData = useCallback(async () => {
    try {
      setError(null);
      const params = {
        search: searchQuery,
        status: statusFilter,
        category: categoryFilter,
        priority: priorityFilter,
        filterType: filterType,
        sortBy: sortBy,
      };

      const [tasksRes, allTasksRes] = await Promise.all([
        getTasks(params),
        getTasks({}), // Fetch raw full dataset for Today's Tasks widget & progress
      ]);

      if (tasksRes.success) {
        setTasks(tasksRes.data);
      }
      if (allTasksRes.success) {
        setAllTasks(allTasksRes.data);
      }

      await fetchStats();
    } catch (err) {
      console.error('API Error:', err);
      setError('Unable to load tasks. Please ensure the backend server and MongoDB are running.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, categoryFilter, priorityFilter, filterType, sortBy]);

  // Trigger fetch on query change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasksData();
    }, 150); // slight debounce for smooth search

    return () => clearTimeout(timer);
  }, [fetchTasksData]);

  // Handle Stat Card quick clicks (e.g. clicking 'Overdue' filters by overdue)
  const handleStatCardFilter = (type, val) => {
    if (type === 'special' && val === 'overdue') {
      setFilterType('overdue');
      setStatusFilter('All');
    } else if (type === 'status') {
      setFilterType('');
      setStatusFilter(val);
    }
  };

  // Open Add Task Modal
  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Task Modal
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  };

  // Handle Form Submit (Add or Update)
  const handleFormSubmit = async (formData) => {
    try {
      if (editingTask) {
        // Update Task
        const res = await updateTask(editingTask._id, formData);
        if (res.success) {
          showToast('Task updated successfully! ✨');
          fetchTasksData();
        }
      } else {
        // Create Task
        const res = await createTask(formData);
        if (res.success) {
          showToast('Task created successfully! 🚀');
          fetchTasksData();
        }
      }
    } catch (err) {
      console.error('Failed to save task:', err);
      showToast('Error saving task. Please try again.');
      throw err;
    }
  };

  // Handle Quick Toggle Task Complete Checkbox
  const handleToggleComplete = async (task) => {
    try {
      const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      
      // Optimistic UI update for immediate response
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
      );
      setAllTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
      );

      const res = await updateTask(task._id, { status: newStatus });
      if (res.success) {
        showToast(
          newStatus === 'Completed' ? 'Task marked as Completed! ✅' : 'Task marked as Pending'
        );
        fetchStats();
      }
    } catch (err) {
      console.error('Failed to toggle completion status:', err);
      showToast('Error updating status. Please try again.');
      fetchTasksData(); // Revert on failure
    }
  };

  // Open Delete Confirmation Modal
  const handleOpenDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      const res = await deleteTask(taskToDelete._id);
      if (res.success) {
        showToast('Task deleted successfully');
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
        fetchTasksData();
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
      showToast('Error deleting task.');
    }
  };

  // Seed sample data for fast testing / viva demo
  const handleSeedData = async () => {
    try {
      setLoading(true);
      const res = await seedSampleTasks();
      if (res.success) {
        showToast('Sample tasks loaded! 🌟');
        fetchTasksData();
      }
    } catch (err) {
      console.error('Failed to seed sample data:', err);
      showToast('Could not load sample data. Is backend active?');
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Header & Statistics Section */}
      <div className="dashboard-top-section">
        <StatCards
          stats={stats}
          activeFilter={filterType === 'overdue' ? 'overdue' : statusFilter}
          onSelectFilter={handleStatCardFilter}
        />

        <ProgressBar total={stats.total} completed={stats.completed} />

        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={(val) => {
            setFilterType('');
            setStatusFilter(val);
          }}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onOpenAddTask={handleOpenAddModal}
          onSeedData={handleSeedData}
          totalTasks={stats.total}
        />
      </div>

      {/* Main Content Area (Internally Scrollable Task List + Today's Tasks) */}
      <div className="dashboard-main-split">
        {/* Left/Main Task List Pane */}
        <div className="task-list-pane">
          <div className="pane-header">
            <span className="pane-title">
              <ListTodo size={18} color="var(--primary)" />
              Tasks List
              {filterType === 'overdue' && (
                <span style={{ fontSize: '0.78rem', color: 'var(--danger)', fontWeight: 600 }}>
                  (Showing Overdue Only)
                </span>
              )}
            </span>
            <span className="task-count-badge">{tasks.length}</span>
          </div>

          {/* INTERNAL SCROLL CONTAINER */}
          <div className="task-list-scrollable">
            {loading ? (
              <div className="state-container">
                <div className="spinner"></div>
                <p style={{ fontWeight: 600 }}>Loading tasks...</p>
              </div>
            ) : error ? (
              <div className="state-container">
                <AlertCircle size={36} color="var(--danger)" className="state-icon" />
                <h4 className="state-title">Connection Issue</h4>
                <p className="state-subtitle">{error}</p>
                <button type="button" className="btn-secondary" onClick={fetchTasksData}>
                  <RefreshCw size={15} /> Retry
                </button>
              </div>
            ) : tasks.length === 0 ? (
              <div className="state-container">
                <ListTodo size={42} className="state-icon" />
                <h4 className="state-title">No tasks found</h4>
                <p className="state-subtitle">
                  {searchQuery || statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All' || filterType
                    ? 'No tasks matched your current search or filter criteria.'
                    : 'Your task list is empty. Get started by creating your first task!'}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" className="btn-primary" onClick={handleOpenAddModal}>
                    <Plus size={16} /> Add Task
                  </button>
                  {stats.total === 0 && (
                    <button type="button" className="btn-secondary" onClick={handleSeedData}>
                      Load Sample Tasks
                    </button>
                  )}
                </div>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Today's Tasks Quick Widget */}
        <TodayTasksWidget
          tasks={allTasks}
          onToggleComplete={handleToggleComplete}
        />
      </div>

      {/* Add / Edit Task Modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete?.title}
      />
    </div>
  );
};

export default DashboardPage;
