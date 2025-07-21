# 🌍 Explorer Diary

A modern, responsive digital diary application for adventurers to document their journeys, capture memories, and map their experiences around the world. Built with React, Firebase, and optimized for mobile devices.

## ✨ Features

- 🔐 **Secure Authentication**: Email/password login with Firebase Auth
- 📍 **Smart Location Tracking**: GPS detection with manual coordinate input
- 📝 **Rich Story Journaling**: Write detailed adventure stories
- 📅 **Date Management**: Track when your adventures happened
- 📸 **Fast Image Uploads**: Reliable photo storage with ImgBB integration
- 🗓️ **Timeline View**: Chronological view of all your adventures
- 🗺️ **Interactive Maps**: See your adventures plotted on world maps
- 📊 **Personal Dashboard**: Statistics and insights about your travels
- 📱 **Mobile Optimized**: Fully responsive design for all devices
- 🔒 **Private & Secure**: Each user's data is completely isolated
- ⚡ **Fast & Reliable**: Optimized for performance on mobile networks
- 🌍 **PWA Ready**: Can be installed as a mobile app

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- ImgBB account (for image uploads)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/explorer-diary.git
cd explorer-diary
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# ImgBB Configuration
REACT_APP_IMGBB_API_KEY=your_imgbb_api_key
```

4. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Set up security rules (see below)

5. **Run the application**
```bash
npm start
```

## 🔧 Firebase Configuration

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /entries/{document} {
      allow read, write: if request.auth != null && 
        (resource == null || request.auth.uid == resource.data.userId);
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Authentication Setup
1. Go to Firebase Console → Authentication
2. Enable Email/Password sign-in method
3. Add your domain to authorized domains

## 📱 Mobile Optimization

This app is specifically optimized for mobile users:

- **Touch-friendly interface** with 44px minimum touch targets
- **Responsive design** that works on all screen sizes
- **Fast image uploads** with ImgBB integration
- **Offline-ready** with proper error handling
- **PWA capabilities** for app-like experience
- **Optimized performance** for mobile networks

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LocationPicker.js
│   ├── ImageUpload.js
│   ├── Navigation.js
│   └── ...
├── contexts/           # React Context providers
│   └── AuthContext.js
├── pages/             # Main application pages
│   ├── Home.js
│   ├── AddEntry.js
│   ├── Timeline.js
│   └── MapView.js
├── utils/             # Utility functions
│   └── imgbbUpload.js
└── firebase.js        # Firebase configuration
```

## 🛠️ Technologies Used

- **Frontend**: React 18, React Router, React Context API
- **Backend**: Firebase (Auth, Firestore)
- **Image Storage**: ImgBB API
- **Maps**: React Leaflet, OpenStreetMap
- **Styling**: CSS3 with custom responsive design
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Geolocation**: OpenCage Geocoding API

## 📦 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

## 🔒 Security Features

- **User Authentication**: Secure Firebase Auth integration
- **Data Isolation**: Users can only access their own data
- **Environment Variables**: Sensitive keys stored securely
- **Input Validation**: Client and server-side validation
- **HTTPS Only**: Secure connections enforced

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- ImgBB for reliable image hosting
- OpenStreetMap for map data
- React community for excellent libraries

---

**Ready to document your adventures? Start exploring! 🌟**