import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProjectStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      milestones: [],
      subcontractors: [],
      activityLogs: [],
      filters: {
        assignee: null,
        dueDate: null,
        status: null
      },

      // Task Management
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, {
          ...task,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          status: 'assigned',
          activityLog: [],
          comments: [],
          documents: []
        }]
      })),

      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      })),

      moveTask: (taskId, newStatus, userId, userName) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task) return;

        // Log the activity
        const activity = {
          id: Date.now().toString(),
          taskId,
          action: `moved to ${newStatus}`,
          userId,
          userName,
          timestamp: new Date().toISOString()
        };

        set((state) => ({
          tasks: state.tasks.map(t => 
            t.id === taskId 
              ? { 
                  ...t, 
                  status: newStatus,
                  activityLog: [...(t.activityLog || []), activity]
                }
              : t
          ),
          activityLogs: [...state.activityLogs, activity]
        }));
      },

      // Comments
      addComment: (taskId, comment) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                comments: [...(task.comments || []), {
                  ...comment,
                  id: Date.now().toString(),
                  timestamp: new Date().toISOString()
                }]
              }
            : task
        )
      })),

      // Documents
      addDocument: (taskId, document) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                documents: [...(task.documents || []), {
                  ...document,
                  id: Date.now().toString(),
                  uploadedAt: new Date().toISOString()
                }]
              }
            : task
        )
      })),

      // Filtering
      setFilters: (filters) => set({ filters }),
      
      getFilteredTasks: () => {
        const { tasks, filters } = get();
        let filtered = [...tasks];

        if (filters.assignee) {
          filtered = filtered.filter(task => task.assignedTo === filters.assignee);
        }
        
        if (filters.status) {
          filtered = filtered.filter(task => task.status === filters.status);
        }
        
        if (filters.dueDate) {
          filtered = filtered.filter(task => {
            const taskDate = new Date(task.dueDate);
            const filterDate = new Date(filters.dueDate);
            return taskDate <= filterDate;
          });
        }

        return filtered;
      },

      // Milestones
      addMilestone: (milestone) => set((state) => ({
        milestones: [...state.milestones, {
          ...milestone,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      })),

      // Performance Metrics
      getSubcontractorPerformance: () => {
        const { tasks } = get();
        const performance = {};

        tasks.forEach(task => {
          if (!task.assignedTo) return;
          
          if (!performance[task.assignedTo]) {
            performance[task.assignedTo] = {
              totalTasks: 0,
              completedOnTime: 0,
              delayed: 0,
              inspectionPassed: 0,
              inspectionFailed: 0
            };
          }

          performance[task.assignedTo].totalTasks++;
          
          if (task.status === 'approved') {
            performance[task.assignedTo].completedOnTime++;
            performance[task.assignedTo].inspectionPassed++;
          }
          
          if (task.isDelayed) {
            performance[task.assignedTo].delayed++;
          }
          
          if (task.status === 'rework_required') {
            performance[task.assignedTo].inspectionFailed++;
          }
        });

        return performance;
      },

      // Project Health Metrics
      getProjectHealth: () => {
        const { tasks } = get();
        const total = tasks.length;
        if (total === 0) return null;

        const completed = tasks.filter(t => t.status === 'approved').length;
        const delayed = tasks.filter(t => t.isDelayed).length;
        const inspectionFailed = tasks.filter(t => t.status === 'rework_required').length;

        return {
          completionPercentage: (completed / total) * 100,
          onTimePercentage: ((total - delayed) / total) * 100,
          delayedPercentage: (delayed / total) * 100,
          inspectionPassRate: total > 0 ? ((total - inspectionFailed) / total) * 100 : 100
        };
      }
    }),
    {
      name: 'project-storage'
    }
  )
);

export default useProjectStore;