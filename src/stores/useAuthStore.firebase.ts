import { create } from 'zustand';
import { User } from '../types';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  saveUserToStorage,
  removeUserFromStorage,
} from '../utils/storage';

// Configure Google Sign-In
// TODO: Replace with your Web Client ID from Firebase Console
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
});

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  loadUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithApple: () => Promise<{ success: boolean; error?: string }>;
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

  loginWithGoogle: async () => {
    set({ isLoading: true });

    try {
      // Check if device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get user info from Google
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      
      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);
      
      // Sign in to Firebase with the Google credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = convertFirebaseUser(userCredential.user);
      
      await saveUserToStorage(user);
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });

      return { success: true };
    } catch (error: any) {
      console.error('Google login error:', error);
      set({ isLoading: false });
      
      let errorMessage = 'An error occurred during Google sign-in';
      if (error.code === 'SIGN_IN_CANCELLED') {
        errorMessage = 'Sign-in was cancelled';
      } else if (error.code === 'IN_PROGRESS') {
        errorMessage = 'Sign-in is already in progress';
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        errorMessage = 'Google Play Services not available';
      }
      
      return { success: false, error: errorMessage };
    }
  },

  loginWithApple: async () => {
    set({ isLoading: true });

    try {
      // Apple Sign-In implementation
      // Note: This requires @invertase/react-native-apple-authentication
      // and proper iOS configuration
      
      // For now, return not implemented
      set({ isLoading: false });
      return { 
        success: false, 
        error: 'Apple Sign-In requires additional setup. Check documentation.' 
      };
    } catch (error: any) {
      console.error('Apple login error:', error);
      set({ isLoading: false });
      return { success: false, error: 'An error occurred during Apple sign-in' };
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      await removeUserFromStorage();
      
      // Sign out from Google if signed in
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        // Ignore if not signed in
      }
      
      set({ 
        user: null, 
        isAuthenticated: false 
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
}));
