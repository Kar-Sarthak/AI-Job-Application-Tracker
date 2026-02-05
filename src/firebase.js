// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace this config with your Firebase project config
const firebaseConfig = {

  apiKey: "AIzaSyAJnI4JnnsnJMd5OXacI15plRfdG8ugOLk",

  authDomain: "job-tracker-2d185.firebaseapp.com",

  projectId: "job-tracker-2d185",

  storageBucket: "job-tracker-2d185.firebasestorage.app",

  messagingSenderId: "136783240398",

  appId: "1:136783240398:web:9fb43004f190a49a34449f"

};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };


