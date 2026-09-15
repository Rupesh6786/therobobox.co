// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration with hardcoded values
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBZ1Hf_kNSqzTbcinPOP3PEqNH1vqGtm0E",
  authDomain: "coretronics-694b5.firebaseapp.com",
  projectId: "coretronics-694b5",
  storageBucket: "coretronics-694b5.firebasestorage.app",
  messagingSenderId: "611388168687",
  appId: "1:994741997631:web:1e40ca021b087fe232e88a",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, firebaseConfig };