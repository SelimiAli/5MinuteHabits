import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// Note: AsyncStorage persistence is handled by @react-native-async-storage/async-storage
// which is already installed in the project

// TODO: Replace with your Firebase config from Firebase Console
// Go to: Firebase Console > Project Settings > Your apps > SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgZcMOPgdDqvKsvXJiGWpOXIt9GAgZx2A",
  authDomain: "minutehabits-12580.firebaseapp.com",
  projectId: "minutehabits-12580",
  storageBucket: "minutehabits-12580.firebasestorage.app",
  messagingSenderId: "68184488656",
  appId: "1:68184488656:ios:03a7ea7e36ec4c6248bcd5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Log successful initialization
console.log('✅ Firebase initialized successfully');
console.log('📱 Project ID:', firebaseConfig.projectId);

export default app;
