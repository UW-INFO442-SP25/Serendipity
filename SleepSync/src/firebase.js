// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Add Firestore support
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChlQIORpFKLlcRNVZIXLtF--Z1x4flZ2g",
  authDomain: "serendipity-4a9ed.firebaseapp.com",
  projectId: "serendipity-4a9ed",
  storageBucket: "serendipity-4a9ed.appspot.com",
  messagingSenderId: "807197840316",
  appId: "1:807197840316:web:de441d338d5406bc1191b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firebase app and Firestore instance
export default app;
export { db };
