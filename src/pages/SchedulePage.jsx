import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertTriangle, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import useProjectStore from '../store/projectStore';
import useAuthStore from '../store/authStore';
import { toast } from '../components/Toaster';

const SchedulePage = () => {
  const { tasks } = useProjectStore();
  const { userRole } = useAuthStore();
  const [viewMode, setViewMode] = useState('month'); // week, month, year
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCriticalPath, setShowCriticalPath] = useState(false);

  // Calculate date range based on view mode
  const getDateRange = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    
    switch (viewMode) {
      case 'week':
        start.setDate(start.getDate() - start.getDay());
        end.setDate(end.getDate() + (6 - end.getDay()));
        break;
      case 'month':
        start.setDate(1);
        end.setMonth(end.getMonth() + 1, 0);
        break;
      case 'year':
        start.setMonth(0, 1);
        end.setMonth(11, 31);
        break;
    }
    
    return { start, end };
  };

  const { start: startDate, end: endDate } = getDateRange();

  // Generate timeline headers
  const generateTimelineHeaders = () => {
    const headers = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      if (viewMode === 'week') {
        headers.push({
          label: current.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
          date: new Date(current)
        });
        current.setDate(current.getDate() + 1);
      } else if (viewMode === 'month') {
        headers.push({
          label: current.getDate().toString(),
          date: new Date(current)
        });
        current.setDate(current.getDate() + 1);
      } else {
        headers.push({
          label: current.toLocaleDateString('en-US', { month: 'short' }),
          date: new Date(current)
        });
        current.setMonth(current.getMonth() + 1);
      }
    }
    
    return headers;
  };

  const timelineHeaders = generateTimelineHeaders();

  // Calculate task position and width
  const getTaskPosition = (task) => {
    if (!task.startDate || !task.dueDate) return null;
    
    const taskStart = new Date(task.startDate || task.dueDate);
    const taskEnd = new Date(task.dueDate);
    
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const startOffset = Math.max(0, (taskStart - startDate) / (1000 * 60 * 60 * 24));
    const duration = Math.max(1, (taskEnd - taskStart) / (1000 * 60 * 60 * 24));
    
    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;
    
    return {
      left: `${Math.max(0, Math.min(left, 100))}%`,
      width: `${Math.max(1, Math.min(width, 100 - left))}%`
    };
  };

  const getTaskColor = (task) => {
    const statusColors = {
      assigned: 'bg-gray-500',
      accepted: 'bg-blue-500',
      work_done: 'bg-purple-500',
      inspection_requested: 'bg-yellow-500',
      rework_required: 'bg-red-500',
      approved: 'bg-green-500'
    };
    
    return task.isDelayed ? 'bg-red-600' : (statusColors[task.status] || 'bg-gray-400');
  };

  const handleTaskDrag = (taskId, newDate) => {
    if (userRole !== 'client') {
      toast.error('Only clients can modify the schedule');
      return;
    }
    
    // Update task dates
    const projectStore = useProjectStore.getState();
    projectStore.updateTask(taskId, { dueDate: newDate.toISOString() });
    toast.success('Task schedule updated');
  };

  const navigateTimeline = (direction) => {
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'week':
        newDate.setDate(newDate.getDate() + (direction * 7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + direction);
        break;
    }
    
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="section-padding py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Project Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize project timeline and dependencies
          </p>
        </motion.div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">View:</span>
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {['week', 'month', 'year'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded capitalize text-sm font-medium transition-colors ${
                      viewMode === mode
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {mode}ly
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateTimeline(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium min-w-[150px] text-center">
                {currentDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <button
                onClick={() => navigateTimeline(1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Critical Path Toggle */}
            <button
              onClick={() => setShowCriticalPath(!showCriticalPath)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showCriticalPath
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Critical Path</span>
            </button>
          </div>
        </div>

        {/* Gantt Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          {/* Timeline Header */}
          <div className="grid grid-cols-[250px_1fr] border-b border-gray-200 dark:border-gray-700">
            <div className="p-4 font-semibold border-r border-gray-200 dark:border-gray-700">
              Task Name
            </div>
            <div className="relative">
              <div className="flex">
                {timelineHeaders.map((header, index) => (
                  <div
                    key={index}
                    className="flex-1 p-2 text-center text-xs font-medium border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                  >
                    {header.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task Rows */}
          <div className="max-h-[600px] overflow-y-auto">
            {tasks.map((task) => {
              const position = getTaskPosition(task);
              return (
                <div
                  key={task.id}
                  className="grid grid-cols-[250px_1fr] border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  {/* Task Info */}
                  <div className="p-4 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      {task.isDelayed && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm font-medium truncate">
                        {task.title}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {task.assignedTo}
                    </div>
                  </div>

                  {/* Task Bar */}
                  <div className="relative h-16">
                    {position && (
                      <div
                        className={`absolute top-4 h-8 ${getTaskColor(task)} bg-opacity-80 rounded cursor-pointer hover:bg-opacity-100 transition-all`}
                        style={{
                          left: position.left,
                          width: position.width
                        }}
                        title={`${task.title}\n${task.startDate || task.dueDate} - ${task.dueDate}`}
                      >
                        <div className="px-2 py-1 text-xs text-white truncate">
                          {task.title}
                        </div>
                      </div>
                    )}
                    
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex">
                      {timelineHeaders.map((_, index) => (
                        <div
                          key={index}
                          className="flex-1 border-r border-gray-100 dark:border-gray-800"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded" />
                <span>Assigned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded" />
                <span>Work Done</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded" />
                <span>Inspection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span>Rework/Delayed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span>Approved</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Read-only notice for subcontractors */}
        {userRole === 'subcontractor' && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                This schedule is read-only. You can view the timeline but cannot make changes. 
                Use the "Note a Delay" function in task details to report delays.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;