import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIK5BnhrlIDePf5Tc4WOBQu5LpNl63_5c",
  authDomain: "whatsapp-2eebe.firebaseapp.com",
  projectId: "whatsapp-2eebe",
  storageBucket: "whatsapp-2eebe.firebasestorage.app",
  messagingSenderId: "255469820332",
  appId: "1:255469820332:web:416c8e38ecf0a45f454209",
  measurementId: "G-42F2BSJJDL"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics conditionally
export let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

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

// Email OTP / Link Authentication helpers
export const sendEmailOtpLink = (email) => {
  const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true
  };
  return sendSignInLinkToEmail(auth, email, actionCodeSettings);
};

export const completeEmailOtpLogin = (email, href = window.location.href) => {
  return signInWithEmailLink(auth, email, href);
};

export { isSignInWithEmailLink };

export default app;
