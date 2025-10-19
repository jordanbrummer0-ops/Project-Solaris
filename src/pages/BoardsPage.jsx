import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import useProjectStore from '../store/projectStore';
import useAuthStore from '../store/authStore';
import TaskCard from '../components/TaskCard';
import TaskDetailModal from '../components/TaskDetailModal';
import { toast } from '../components/Toaster';
import { Plus, Filter } from 'lucide-react';

const BoardsPage = () => {
  const { tasks, moveTask, getFilteredTasks } = useProjectStore();
  const { user, userRole, canInteractWithTask } = useAuthStore();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const columns = [
    { id: 'assigned', title: 'Assigned (Pending Acceptance)', color: 'border-gray-500' },
    { id: 'accepted', title: 'Accepted (In Progress)', color: 'border-blue-500' },
    { id: 'work_done', title: 'Work Done', color: 'border-purple-500' },
    { id: 'inspection_requested', title: 'Inspection Requested', color: 'border-yellow-500' },
    { id: 'rework_required', title: 'Rework Required (Failed)', color: 'border-red-500' },
    { id: 'approved', title: 'Approved (Completed)', color: 'border-green-500' },
  ];

  useEffect(() => {
    setFilteredTasks(getFilteredTasks());
  }, [tasks]);

  const getTasksByColumn = (columnId) => {
    return filteredTasks.filter(task => task.status === columnId);
  };

  const canMoveTask = (task, fromColumn, toColumn) => {
    if (userRole === 'client') {
      // Clients can only move tasks from inspection_requested to approved or rework_required
      if (fromColumn === 'inspection_requested') {
        return toColumn === 'approved' || toColumn === 'rework_required';
      }
      return false;
    }

    if (userRole === 'subcontractor') {
      // Subcontractors can only move their own tasks
      if (!canInteractWithTask(task)) {
        return false;
      }

      // Define allowed transitions for subcontractors
      const allowedTransitions = {
        'assigned': ['accepted'],
        'accepted': ['work_done'],
        'rework_required': ['work_done'],
      };

      return allowedTransitions[fromColumn]?.includes(toColumn) || false;
    }

    return false;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    const overColumn = over.id;

    if (!activeTask) return;

    // Check if the move is allowed
    if (!canMoveTask(activeTask, activeTask.status, overColumn)) {
      return;
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    const overColumn = over.id;

    if (!activeTask || activeTask.status === overColumn) return;

    // Check if the move is allowed
    if (!canMoveTask(activeTask, activeTask.status, overColumn)) {
      toast.error('You do not have permission to move this task');
      return;
    }

    // Move the task
    moveTask(activeTask.id, overColumn, user.id, user.name);
    
    // Show success message based on action
    if (overColumn === 'approved') {
      toast.success('Task approved successfully');
    } else if (overColumn === 'rework_required') {
      toast.warning('Task sent for rework');
    } else {
      toast.success('Task moved successfully');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="section-padding py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">Project Boards</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Drag and drop tasks to manage workflow
            </p>
          </motion.div>

          {userRole === 'client' && (
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Task
            </button>
          )}
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges]}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {columns.map((column) => {
              const columnTasks = getTasksByColumn(column.id);
              
              return (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[500px] border-t-4 ${column.color}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm">{column.title}</h3>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>

                  <SortableContext
                    items={columnTasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                    id={column.id}
                  >
                    <div className="space-y-3">
                      {columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onClick={() => handleTaskClick(task)}
                          isDraggable={canMoveTask(task, task.status, task.status)}
                        />
                      ))}
                    </div>
                  </SortableContext>

                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                      No tasks
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="opacity-80">
                <TaskCard task={activeTask} isDragging />
              </div>
            )}
          </DragOverlay>
        </DndContext>

        {/* Task Detail Modal */}
        {isModalOpen && selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTask(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BoardsPage;