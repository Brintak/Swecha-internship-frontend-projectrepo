// Dashboard Statistics Cards (Total, Completed, Pending, Overdue)
import React from 'react';
import { ListTodo, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const StatCards = ({ stats, activeFilter, onSelectFilter }) => {
  const statItems = [
    {
      id: 'All',
      label: 'Total Tasks',
      value: stats.total || 0,
      icon: <ListTodo size={20} />,
      className: 'stat-total',
      filterType: 'status',
      filterVal: 'All',
    },
    {
      id: 'Completed',
      label: 'Completed',
      value: stats.completed || 0,
      icon: <CheckCircle2 size={20} />,
      className: 'stat-completed',
      filterType: 'status',
      filterVal: 'Completed',
    },
    {
      id: 'Pending',
      label: 'Pending',
      value: stats.pending || 0,
      icon: <Clock size={20} />,
      className: 'stat-pending',
      filterType: 'status',
      filterVal: 'Pending',
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: stats.overdue || 0,
      icon: <AlertTriangle size={20} />,
      className: 'stat-overdue',
      filterType: 'special',
      filterVal: 'overdue',
    },
  ];

  return (
    <div className="stats-grid">
      {statItems.map((item) => (
        <div
          key={item.id}
          className={`stat-card ${item.className}`}
          onClick={() => onSelectFilter && onSelectFilter(item.filterType, item.filterVal)}
          style={{ cursor: onSelectFilter ? 'pointer' : 'default' }}
          title={`Click to filter by ${item.label}`}
        >
          <div className="stat-info">
            <span className="stat-label">{item.label}</span>
            <span className="stat-value">{item.value}</span>
          </div>
          <div className="stat-icon-wrapper">{item.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
