# Firebase Setup Guide for Explorer Diary

## 🔥 Firebase Console Setup

### 1. Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **adventure-journal-20a28**
3. Click **Authentication** in the left sidebar
4. Click **Get started** if not already set up
5. Go to **Sign-in method** tab
6. Click **Email/Password**
7. Enable **Email/Password** (first toggle)
8. Click **Save**

### 2. Set up Firestore Database
1. Click **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for now)
4. Select your preferred location (closest to your users)
5. Click **Done**

### 3. Set up Firebase Storage
1. Click **Storage** in the left sidebar
2. Click **Get started**
3. Choose **Start in test mode** (for now)
4. Select the same location as your Firestore
5. Click **Done**

## 🔒 Security Rules Setup

### Firestore Security Rules
Go to **Firestore Database** → **Rules** tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own entries
    match /entries/{document} {
      allow read, write: if request.auth != null && 
        (resource == null || request.auth.uid == resource.data.userId);
    }
    
    // Allow test documents for debugging
    match /test/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Security Rules
Go to **Storage** → **Rules** tab and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to upload/read their own images
    match /images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 Testing Your Setup

1. **Test Authentication:**
   - Try creating a new account
   - Check the browser console for any errors
   - Look for success messages

2. **Test Database:**
   - Click the "Test Database" button in Add Adventure page
   - Check the browser console for connection status
   - Verify test documents appear in Firestore console

3. **Test Full Flow:**
   - Create a new adventure entry
   - Add a photo
   - Check if it saves successfully
   - Verify data appears in Firestore console

## 🐛 Common Issues & Solutions

### "Permission Denied" Error
- **Cause:** Security rules are too restrictive
- **Solution:** Use the test mode rules above, then customize as needed

### "Unauthenticated" Error
- **Cause:** User is not logged in or session expired
- **Solution:** Log out and log back in

### "Operation Not Allowed" Error
- **Cause:** Authentication method not enabled
- **Solution:** Enable Email/Password in Authentication settings

### Images Not Uploading
- **Cause:** Storage rules or missing Storage setup
- **Solution:** Follow Storage setup steps above

### Database Connection Failed
- **Cause:** Firestore not initialized or wrong project
- **Solution:** Verify project ID matches in firebase.js

## 📝 Current Configuration

Your app is configured for:
- **Project ID:** adventure-journal-20a28
- **Auth Domain:** adventure-journal-20a28.firebaseapp.com
- **Storage Bucket:** adventure-journal-20a28.firebasestorage.app

## 🔍 Debugging Tips

1. **Open Browser Console** (F12) to see detailed error messages
2. **Check Firebase Console** to see if data is being written
3. **Use Test Database Button** to verify connection
4. **Check Network Tab** to see if requests are being made

## ✅ Verification Checklist

- [ ] Authentication enabled with Email/Password
- [ ] Firestore Database created
- [ ] Firebase Storage enabled
- [ ] Security rules updated for both Firestore and Storage
- [ ] Test database connection works
- [ ] Can create user accounts
- [ ] Can save adventures without images
- [ ] Can upload and save images

If you're still having issues after following this guide, check the browser console for specific error messages and let me know what you see!