// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDMocOa64f_KlLALE7a5x6CwOXGJ49Mlyg",
  authDomain: "dinersaur-8bd21.firebaseapp.com",
  projectId: "dinersaur-8bd21",
  storageBucket: "dinersaur-8bd21.appspot.com",
  messagingSenderId: "1054185811017",
  appId: "1:1054185811017:web:95cba0c4e5a65eab05e398",
  measurementId: "G-6FE81MFER8"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const analytics = getAnalytics(firebaseApp);
export const storage = getStorage(firebaseApp, "gs://dinersaur-8bd21.appspot.com");
