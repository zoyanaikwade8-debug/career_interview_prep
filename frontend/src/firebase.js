import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC7ez7hb08xY-mJVW-tMrFbsYRuq1MQ9tI",
  authDomain: "careerinterviewprep.firebaseapp.com",
  projectId: "careerinterviewprep",
  storageBucket: "careerinterviewprep.firebasestorage.app",
  messagingSenderId: "712936776813",
  appId: "1:712936776813:web:5b42bbcd90cc00d5178b64",
  measurementId: "G-06W9G9K8HW"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
