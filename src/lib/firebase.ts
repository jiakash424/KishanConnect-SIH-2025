import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  "projectId": "studio-4373312232-121b7",
  "appId": "1:1029512912553:web:74c311d283270fbce993b8",
  "storageBucket": "studio-4373312232-121b7.firebasestorage.app",
  "apiKey": "AIzaSyCNUiA5aQ-9C91ai6Tc4aAZHt2NpWtj9O4",
  "authDomain": "studio-4373312232-121b7.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1029512912553"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use auth emulator in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // The port needs to match the one exposed by the Firebase Auth emulator
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
     console.log("Firebase Auth emulator connected.");
  } catch (error) {
    console.error("Error connecting to Firebase Auth emulator:", error);
  }
}


export { app, auth };
