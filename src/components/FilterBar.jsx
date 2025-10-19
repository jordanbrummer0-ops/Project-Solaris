import React, { useState } from 'react';
import { Filter, X, Calendar, User, Tag } from 'lucide-react';
import useProjectStore from '../store/projectStore';

const FilterBar = () => {
  const { filters, setFilters, tasks } = useProjectStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get unique assignees from tasks
  const assignees = [...new Set(tasks.map(task => task.assignedTo).filter(Boolean))];

  const statuses = [
    { value: 'assigned', label: 'Assigned' },
    { value: 'accepted', label: 'In Progress' },
    { value: 'work_done', label: 'Work Done' },
    { value: 'inspection_requested', label: 'Inspection Requested' },
    { value: 'rework_required', label: 'Rework Required' },
    { value: 'approved', label: 'Approved' }
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value || null
    });
  };

  const clearFilters = () => {
    setFilters({
      assignee: null,
      dueDate: null,
      status: null
    });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
      <div className="section-padding py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 flex flex-wrap gap-4">
            {/* Assignee Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <User className="w-4 h-4" />
                Assignee
              </label>
              <select
                value={filters.assignee || ''}
                onChange={(e) => handleFilterChange('assignee', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Assignees</option>
                {assignees.map(assignee => (
                  <option key={assignee} value={assignee}>
                    {assignee}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Tag className="w-4 h-4" />
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Calendar className="w-4 h-4" />
                Due Before
              </label>
              <input
                type="date"
                value={filters.dueDate || ''}
                onChange={(e) => handleFilterChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;