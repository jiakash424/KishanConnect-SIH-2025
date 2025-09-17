import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

export { app, auth };
