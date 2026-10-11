// Search, Filters, and Sorting Controls Component
import React from 'react';
import { Search, Plus, Sparkles } from 'lucide-react';

const FilterBar = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  onOpenAddTask,
  onSeedData,
  totalTasks,
}) => {
  return (
    <div className="controls-bar">
      <div className="controls-left">
        {/* Search Input */}
        <div className="search-input-group">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          title="Filter by Status"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Category Filter */}
        <select
          className="filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          title="Filter by Category"
        >
          <option value="All">All Categories</option>
          <option value="Personal">Personal</option>
          <option value="College">College</option>
          <option value="Work">Work</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>

        {/* Priority Filter */}
        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          title="Filter by Priority"
        >
          <option value="All">All Priorities</option>
          <option value="High">🔴 High</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Low">🟢 Low</option>
        </select>

        {/* Sort Options */}
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          title="Sort Tasks"
        >
          <option value="newest">Sort: Recently Added</option>
          <option value="dueDate_asc">Sort: Due Date (Earliest)</option>
          <option value="dueDate_desc">Sort: Due Date (Latest)</option>
          <option value="priority">Sort: Priority (High to Low)</option>
          <option value="alphabetical">Sort: Alphabetical (A-Z)</option>
        </select>
      </div>

      <div className="controls-right">
        {totalTasks === 0 && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onSeedData}
            title="Load sample tasks for testing"
          >
            <Sparkles size={16} color="var(--warning)" />
            <span>Load Demo Data</span>
          </button>
        )}

        <button
          type="button"
          className="btn-primary"
          onClick={onOpenAddTask}
          id="add-task-btn"
        >
          <Plus size={17} />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
