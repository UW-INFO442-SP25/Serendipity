// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyChlQIORpFKLlcRNVZIXLtF--Z1x4flZ2g",
  authDomain: "serendipity-4a9ed.firebaseapp.com",
  projectId: "serendipity-4a9ed",
  storageBucket: "serendipity-4a9ed.appspot.com",
  messagingSenderId: "807197840316",
  appId: "1:807197840316:web:de441d338d5406bc1191b9"
};

// Initialize app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export
export { app, db };
