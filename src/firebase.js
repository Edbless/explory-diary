import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBt7TJu8YvrrSexuBHsfW--rIBx2TCkHAw",
  authDomain: "adventure-journal-20a28.firebaseapp.com",
  projectId: "adventure-journal-20a28",
  storageBucket: "adventure-journal-20a28.firebasestorage.app",
  messagingSenderId: "359516242583",
  appId: "1:359516242583:web:d2aa759c370d9c69379fd2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;