import { create } from 'zustand';
import { User } from '../types';
import {
  loadUserFromStorage,
  saveUserToStorage,
  removeUserFromStorage,
} from '../utils/storage';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  loadUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const user = await loadUserFromStorage();
      set({ 
        user, 
        isAuthenticated: !!user, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error loading user:', error);
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    // Basic validation
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    set({ isLoading: true });

    try {
      // For now, this is a mock implementation
      // In a real app, you would make an API call to your backend
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if user exists in storage (for demo purposes)
      const existingUser = await loadUserFromStorage();
      
      if (!existingUser) {
        set({ isLoading: false });
        return { success: false, error: 'No account found. Please sign up first.' };
      }

      // In a real app, you'd verify the password with the backend
      // For now, we'll just check if the email matches
      if (existingUser.email !== email) {
        set({ isLoading: false });
        return { success: false, error: 'Invalid email or password' };
      }

      set({ 
        user: existingUser, 
        isAuthenticated: true, 
        isLoading: false 
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      return { success: false, error: 'An error occurred during login' };
    }
  },

  signup: async (email: string, password: string, name: string) => {
    // Basic validation
    if (!email || !password || !name) {
      return { success: false, error: 'All fields are required' };
    }

    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    if (name.trim().length < 2) {
      return { success: false, error: 'Name must be at least 2 characters' };
    }

    set({ isLoading: true });

    try {
      // For now, this is a mock implementation
      // In a real app, you would make an API call to your backend
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if user already exists
      const existingUser = await loadUserFromStorage();
      if (existingUser && existingUser.email === email) {
        set({ isLoading: false });
        return { success: false, error: 'An account with this email already exists' };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(), // In a real app, this would come from the backend
        email: email.toLowerCase().trim(),
        name: name.trim(),
        createdAt: new Date().toISOString(),
      };

      await saveUserToStorage(newUser);

      set({ 
        user: newUser, 
        isAuthenticated: true, 
        isLoading: false 
      });

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      set({ isLoading: false });
      return { success: false, error: 'An error occurred during signup' };
    }
  },

  logout: async () => {
    try {
      await removeUserFromStorage();
      set({ 
        user: null, 
        isAuthenticated: false 
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
}));
