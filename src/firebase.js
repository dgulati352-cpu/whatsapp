import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "whatsapp-2eebe",
  appId: "1:255469820332:web:61dd2c4b530c348c454209",
  storageBucket: "whatsapp-2eebe.firebasestorage.app",
  apiKey: "AIzaSyCIK5BnhrlIDePf5Tc4WOBQu5LpNl63_5c",
  authDomain: "whatsapp-2eebe.firebaseapp.com",
  messagingSenderId: "255469820332",
  measurementId: "G-64SP9Z6XLB"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore Database
export const db = getFirestore(app);

// Authentication helper functions
export const signUpWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logInWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const logOut = () => {
  return firebaseSignOut(auth);
};

// Phone Authentication helper setup
export const setupRecaptcha = (containerId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      }
    });
  }
  return window.recaptchaVerifier;
};

export const sendPhoneOtp = (phoneNumber, appVerifier) => {
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

export default app;
