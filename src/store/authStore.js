import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      userRole: null, // 'client' or 'subcontractor'
      
      login: (userData) => set({ 
        user: userData, 
        isAuthenticated: true,
        userRole: userData.role 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        userRole: null 
      }),
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),

      // Check if user has specific permission
      hasPermission: (permission) => {
        const { userRole } = useAuthStore.getState();
        const permissions = {
          client: [
            'approve_inspection',
            'reject_inspection',
            'manage_users',
            'edit_schedule',
            'assign_tasks',
            'change_due_dates',
            'move_to_approved',
            'move_to_rework'
          ],
          subcontractor: [
            'accept_task',
            'mark_work_done',
            'request_inspection',
            'note_delay',
            'view_schedule'
          ]
        };
        
        return permissions[userRole]?.includes(permission) || false;
      },

      // Check if user can interact with a specific task
      canInteractWithTask: (task) => {
        const { user, userRole } = useAuthStore.getState();
        
        if (userRole === 'client') {
          return true; // Clients can interact with all tasks
        }
        
        if (userRole === 'subcontractor') {
          // Subcontractors can only interact with tasks assigned to them
          return task.assignedTo === user?.id || task.assignedTo === user?.company;
        }
        
        return false;
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);

export default useAuthStore;