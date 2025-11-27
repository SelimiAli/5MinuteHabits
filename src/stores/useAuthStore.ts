import { create } from 'zustand';
import { User } from '../types';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import {
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

// Helper to convert Firebase user to our User type
const convertFirebaseUser = (firebaseUser: any): User => {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || 'User',
    createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
  };
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  loadUser: async () => {
    set({ isLoading: true });
    
    // Listen to Firebase auth state changes
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = convertFirebaseUser(firebaseUser);
        await saveUserToStorage(user);
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        await removeUserFromStorage();
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    });
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = convertFirebaseUser(userCredential.user);
      
      await saveUserToStorage(user);
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      set({ isLoading: false });
      
      let errorMessage = 'An error occurred during login';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled';
      }
      
      return { success: false, error: errorMessage };
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });
      
      const user = convertFirebaseUser(userCredential.user);
      user.name = name.trim(); // Ensure name is set
      
      await saveUserToStorage(user);

      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });

      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      set({ isLoading: false });
      
      let errorMessage = 'An error occurred during signup';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }
      
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
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
