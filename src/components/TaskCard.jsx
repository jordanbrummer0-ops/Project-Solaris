import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, User, Flag, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onClick, isDraggable = true, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: task.id,
    disabled: !isDraggable
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging || isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    high: 'text-red-600 bg-red-100 dark:bg-red-900/30',
    medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
    low: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isDraggable ? attributes : {})}
      {...(isDraggable ? listeners : {})}
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600
        hover:shadow-md transition-shadow cursor-pointer
        ${isDraggable ? 'cursor-move' : 'cursor-pointer'}
        ${task.isDelayed ? 'border-l-4 border-l-red-500' : ''}
      `}
    >
      {/* Task Title */}
      <h4 className="font-medium text-sm mb-2 line-clamp-2">{task.title}</h4>

      {/* Task Meta */}
      <div className="space-y-2 text-xs">
        {/* Priority */}
        {task.priority && (
          <div className="flex items-center gap-1">
            <Flag className="w-3 h-3" />
            <span className={`px-1.5 py-0.5 rounded text-xs ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>
        )}

        {/* Assignee */}
        {task.assignedTo && (
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <User className="w-3 h-3" />
            <span className="truncate">{task.assignedTo}</span>
          </div>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}

        {/* Delay Indicator */}
        {task.isDelayed && (
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <AlertCircle className="w-3 h-3" />
            <span className="font-medium">Delayed</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;