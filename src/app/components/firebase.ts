// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyOoLEsDzhQdcqfDgntBejE-xTnLULbTg",
  authDomain: "voxdub-a541c.firebaseapp.com",
  projectId: "voxdub-a541c",
  storageBucket: "voxdub-a541c.firebasestorage.app",
  messagingSenderId: "1040506253784",
  appId: "1:1040506253784:web:42086b27296e0327ae42ad",
  measurementId: "G-R2EBWHN9S2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
