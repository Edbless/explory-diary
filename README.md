# Explorer Diary

A digital diary application for explorers to log places visited, journal thoughts, and upload pictures. Built with React and Firebase.

## Features

- � **User iAuthentication**: Secure sign up and login system
- � **LocatiJon Tracking**: Add locations manually or use geolocation API to detect current location
- � ***Story Journaling**: Write detailed stories about your adventures
- � **Date LUogging**: Track when your adventures happened
- �  **Photo Upload**: Upload and store photos with your entries
- �️️ **Timeline View**: View all your entries in chronological order
- �️ **Map Vsiew**: See all your adventures plotted on an interactive map
- 📊 **Personal Dashboard**: View stats about your adventures
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🔒 **Private Data**: Each user's data is completely private and secure

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Enable Storage
6. Get your Firebase configuration
7. Update `src/firebase.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Firestore Security Rules

Set up your Firestore security rules for user data protection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /entries/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 4. Storage Security Rules

Set up your Storage security rules for user file protection:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Optional: Geocoding API

For better address resolution, you can sign up for a free API key at [OpenCage Geocoding API](https://opencagedata.com/) and replace `YOUR_OPENCAGE_API_KEY` in `src/components/LocationPicker.js`.

### 6. Run the Application

```bash
npm start
```

The application will open at `http://localhost:3000`.

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Sign in to access your personal adventure diary
3. **Add Entry**: Click "Add Adventure" to create a new adventure log
4. **Use Current Location**: Click the location button to automatically detect your current position
5. **Upload Photos**: Select images to accompany your stories
6. **View Timeline**: See all your adventures in chronological order
7. **Explore Map**: View your adventures plotted on an interactive map
8. **Dashboard**: View statistics about your adventures and recent entries

## Project Structure

```
src/
├── components/
│   ├── LocationPicker.js    # Location selection component
│   ├── Navigation.js        # Navigation bar with auth
│   ├── Login.js            # Login form component
│   ├── Signup.js           # Registration form component
│   ├── PrivateRoute.js     # Protected route wrapper
│   ├── LoadingSpinner.js   # Loading state component
│   └── Stats.js            # Statistics display component
├── contexts/
│   └── AuthContext.js      # Authentication context provider
├── pages/
│   ├── Home.js             # Dashboard with stats and recent entries
│   ├── Auth.js             # Authentication page (login/signup)
│   ├── AddEntry.js         # Form to add new entries
│   ├── Timeline.js         # Timeline view of all entries
│   └── MapView.js          # Map view with markers
├── App.js                  # Main app component with auth
├── firebase.js             # Firebase configuration
├── index.js               # App entry point
└── index.css              # Global styles with responsive design
```

## Technologies Used

- **React** - Frontend framework
- **Firebase Authentication** - User authentication system
- **Firebase Firestore** - NoSQL database
- **Firebase Storage** - Image storage
- **React Router** - Client-side routing
- **React Context API** - State management for authentication
- **React Leaflet** - Interactive maps
- **Lucide React** - Modern icon library
- **Date-fns** - Date formatting and manipulation
- **CSS3** - Responsive design with modern styling

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).