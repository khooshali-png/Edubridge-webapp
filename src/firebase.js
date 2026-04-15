import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbO4F9DkyfeZ0NWUJe_SsEUrQmbyu_Zys",
  authDomain: "attendance-app-58dda.firebaseapp.com",
  projectId: "attendance-app-58dda",
  storageBucket: "attendance-app-58dda.firebasestorage.app",
  messagingSenderId: "981548291578",
  appId: "1:981548291578:web:e718a189fe993c14ac8043",
  measurementId: "G-T13N8600FV"
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;