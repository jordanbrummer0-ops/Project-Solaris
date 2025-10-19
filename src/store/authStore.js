import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Demo users for testing
const DEMO_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'John Doe',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: '3',
    email: 'demo@example.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
  },
];

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login function
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Find user in demo users
        const user = DEMO_USERS.find(
          u => u.email === email && u.password === password
        );
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true, user: userWithoutPassword };
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Invalid email or password',
          });
          return { success: false, error: 'Invalid email or password' };
        }
      },

      // Signup function
      signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user already exists
        const existingUser = DEMO_USERS.find(u => u.email === email);
        
        if (existingUser) {
          set({
            isLoading: false,
            error: 'User with this email already exists',
          });
          return { success: false, error: 'User with this email already exists' };
        }
        
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          email,
          name,
          role: 'user',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        };
        
        // Add to demo users (in real app, this would be saved to backend)
        DEMO_USERS.push({ ...newUser, password });
        
        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        return { success: true, user: newUser };
      },

      // Logout function
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Update user profile
      updateProfile: async (updates) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...updates };
        
        set({
          user: updatedUser,
          isLoading: false,
        });
        
        return { success: true, user: updatedUser };
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;

// Export demo credentials for easy reference
export const DEMO_CREDENTIALS = [
  { email: 'admin@example.com', password: 'admin123', role: 'Admin' },
  { email: 'user@example.com', password: 'user123', role: 'User' },
  { email: 'demo@example.com', password: 'demo123', role: 'Demo' },
];