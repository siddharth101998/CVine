// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCktkNvbxBN62c6hqD6iVWJ3xnkViJJixo",
  authDomain: "cvine-fullstack.firebaseapp.com",
  projectId: "cvine-fullstack",
  storageBucket: "cvine-fullstack.firebasestorage.app",
  messagingSenderId: "405950595027",
  appId: "1:405950595027:web:83371e90c426be3ef57926",
  measurementId: "G-K89K34L6P1"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export
export const auth = getAuth(app);
export default app;