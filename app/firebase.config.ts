// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";        
import { getFirestore } from "firebase/firestore"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZtBkLlMmc9ISS-UNVJzKQ5AKMSlecZf0",
  authDomain: "restaurant-app-3dee2.firebaseapp.com",
  projectId: "restaurant-app-3dee2",
  storageBucket: "restaurant-app-3dee2.firebasestorage.app",
  messagingSenderId: "572657782600",
  appId: "1:572657782600:web:9e106e74d63aae4bf3ad7d",
  measurementId: "G-VT5X76MP0V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics — инициализируем 
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Auth и Firestore 
export const auth = getAuth(app);
export const db = getFirestore(app);