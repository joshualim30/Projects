import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBIxcxiddAwbBpRuf5xNczq7vS4i6fweJI",
  authDomain: "wave-bball.firebaseapp.com",
  projectId: "wave-bball",
  storageBucket: "wave-bball.appspot.com",
  messagingSenderId: "950444698758",
  appId: "1:950444698758:web:b73b018b7f024248247507",
  measurementId: "G-3KF19Z1H2E"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
