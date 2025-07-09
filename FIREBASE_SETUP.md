# Firebase Setup Guide

## Why You're Getting 400 Errors

The console errors you're seeing (400 status codes from `firestore.googleapis.com`) happen because the app is trying to connect to Firebase without proper credentials. This is normal when Firebase isn't configured yet.

## Quick Setup (5 minutes)

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or use an existing one
3. Follow the setup wizard

### 2. Get Your Configuration
1. In your Firebase project, click the gear icon → "Project settings"
2. Scroll to "Your apps" section
3. Click the web icon `</>` to create a web app
4. Copy the config object values

### 3. Configure Your App
1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your Firebase values:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
   ```

### 4. Enable Services
1. **Firestore Database**: Firebase Console → Firestore Database → Create database
2. **Authentication**: Firebase Console → Authentication → Get started
   - Enable "Email/Password" 
   - Enable "Google" (optional)

### 5. Set Security Rules
In Firestore Database → Rules, paste:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /transactions/{transactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 6. Restart Your App
```bash
npm run dev
```

## What This Fixes

✅ **No more 400 errors** - App connects to your Firebase project  
✅ **User authentication** - Login/signup works  
✅ **Data persistence** - Transactions save to database  
✅ **Real-time sync** - Data syncs across devices  

## Working Without Firebase

The app will work in "offline mode" without Firebase configuration:
- Shows helpful setup messages
- All UI features work
- Data isn't persistent (resets on refresh)

## Troubleshooting

**Still getting errors?**
- Check that all environment variables are set
- Ensure Firestore and Authentication are enabled
- Verify security rules are applied
- Restart the dev server after changes

**Need help?**
The `.env.local.example` file has detailed setup instructions.
