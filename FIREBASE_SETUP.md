# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "5MinuteHabits"
4. Follow the setup wizard

## Step 2: Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable the following providers:
   - ✅ **Email/Password**
   - ✅ **Google**
   - ✅ **Apple** (optional, iOS only)

## Step 3: Register Your App

### For Web/Expo:
1. In Firebase Console, click the **Web icon** (</>)
2. Register app with nickname: "5MinuteHabits"
3. Copy the Firebase configuration object

### For iOS (Apple Sign-In):
1. Click the **iOS icon**
2. Enter iOS bundle ID (from app.json)
3. Download GoogleService-Info.plist

### For Android (Google Sign-In):
1. Click the **Android icon**
2. Enter Android package name (from app.json)
3. Download google-services.json

## Step 4: Update Firebase Config

Open `src/config/firebase.ts` and replace with your config:

\`\`\`typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
\`\`\`

## Step 5: Configure Google Sign-In

1. In Firebase Console → **Authentication** → **Sign-in method** → **Google**
2. Copy the **Web Client ID**
3. Open `src/stores/useAuthStore.firebase.ts`
4. Replace `YOUR_WEB_CLIENT_ID` with your actual Web Client ID:

\`\`\`typescript
GoogleSignin.configure({
  webClientId: 'YOUR_ACTUAL_WEB_CLIENT_ID.apps.googleusercontent.com',
});
\`\`\`

## Step 6: Switch to Firebase Auth Store

Rename the auth store files:
\`\`\`bash
# Backup the old one
mv src/stores/useAuthStore.ts src/stores/useAuthStore.local.ts

# Use the Firebase one
mv src/stores/useAuthStore.firebase.ts src/stores/useAuthStore.ts
\`\`\`

## Step 7: Test

1. Run the app: `npm start`
2. Try signing up with email/password
3. Try Google Sign-In (requires proper configuration)

## Troubleshooting

### Google Sign-In not working?
- Make sure you added the correct Web Client ID
- Check that Google is enabled in Firebase Console
- For Android: Add SHA-1 fingerprint in Firebase project settings

### Apple Sign-In not working?
- Requires Apple Developer account
- Need to configure Apple Sign-In capability in Xcode
- Install: `npm install @invertase/react-native-apple-authentication`

## Current Status

✅ Email/Password authentication - Ready
⚠️ Google Sign-In - Needs Firebase config
⚠️ Apple Sign-In - Needs additional setup
