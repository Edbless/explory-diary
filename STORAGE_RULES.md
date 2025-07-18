# Firebase Storage Rules

## 🔥 **Current Issue: Storage Upload Failing**

The error "retry-limit-exceeded" usually means:
1. **Storage rules are too restrictive**
2. **Network connectivity issues**
3. **File size too large**

## 🔧 **Simple Storage Rules (For Testing)**

Go to Firebase Console → Storage → Rules and use these **temporary** rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🔒 **Secure Storage Rules (For Production)**

Once testing works, use these more secure rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read, write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024  // Max 5MB
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 📋 **Steps to Fix:**

### 1. **Update Storage Rules**
- Go to [Firebase Console](https://console.firebase.google.com)
- Select your project: `adventure-journal-20a28`
- Click **Storage** in left sidebar
- Click **Rules** tab
- Replace with the simple rules above
- Click **Publish**

### 2. **Test Upload**
- Try uploading a **small image** (under 1MB)
- Use common formats: JPG, PNG, GIF
- Make sure you're logged in

### 3. **Check Browser Console**
- Open Developer Tools (F12)
- Look for any error messages
- Check Network tab for failed requests

## 🚨 **Quick Test:**

1. Use the **simple rules** above first
2. Try uploading a very small image (under 500KB)
3. If it works, then gradually make rules more secure
4. If it still fails, the issue might be network-related

## 💡 **Alternative Solution:**

The app now has a fallback - if image upload fails, it will ask if you want to save the adventure without the image. This way you don't lose your adventure entry even if the image fails to upload.