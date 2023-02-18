// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
//comment
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJPrF0CQA1tO1XK43uIWa4QPzAF2cwHcE",
  authDomain: "soen390-b027d.firebaseapp.com",
  projectId: "soen390-b027d",
  storageBucket: "soen390-b027d.appspot.com",
  messagingSenderId: "825149516501",
  appId: "1:825149516501:web:84ec4df12eac831675905c",
  measurementId: "G-VPHYPRJF37"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

