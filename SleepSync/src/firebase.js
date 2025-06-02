import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBpPKsN4z-CByr_Boy7oK-2gbzK1bLKu9M",
  authDomain: "sleepsync-46248.firebaseapp.com",
  projectId: "sleepsync-46248",
  storageBucket: "sleepsync-46248.firebasestorage.app", 
  messagingSenderId: "224292115885",
  appId: "1:224292115885:web:85a93e2785471c51737d24"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); 
const auth = getAuth(app);

export { app, db, storage, auth }; 
