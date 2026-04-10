import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyOoLEsDzhQdcqfDgntBejE-xTnLULbTg",
  authDomain: "voxdub-a541c.firebaseapp.com",
  projectId: "voxdub-a541c",
  storageBucket: "voxdub-a541c.firebasestorage.app",
  messagingSenderId: "1040506253784",
  appId: "1:1040506253784:web:42086b27296e0327ae42ad",
  measurementId: "G-R2EBWHN9S2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
