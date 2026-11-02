// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCKStbiro0WmyID6NH_tWGk8ukCp8NRWyQ",
//   authDomain: "groupifyai-31aeb.firebaseapp.com",
//   projectId: "groupifyai-31aeb",
//   storageBucket: "groupifyai-31aeb.firebasestorage.app",
//   messagingSenderId: "345164055342",
//   appId: "1:345164055342:web:85781980ea5f63cc0730bf",
//   measurementId: "G-EK9FLV6WFZ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Analytics only works in the browser
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCKStbiro0WmyID6NH_tWGk8ukCp8NRWyQ",
  authDomain: "groupifyai-31aeb.firebaseapp.com",
  projectId: "groupifyai-31aeb",
  storageBucket: "groupifyai-31aeb.firebasestorage.app",
  messagingSenderId: "345164055342",
  appId: "1:345164055342:web:85781980ea5f63cc0730bf",
  measurementId: "G-EK9FLV6WFZ"
};

// Initialize Firebase (Singleton pattern for Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Export Auth and Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics safely
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && await isSupported()) {
    return getAnalytics(app);
  }
};

export default app;