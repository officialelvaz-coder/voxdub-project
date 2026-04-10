import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDyOoLEsDzhQdcqfDgntBejE-xTnLULbTg",
  authDomain: "voxdub-a541c.firebaseapp.com",
  projectId: "voxdub-a541c",
  storageBucket: "voxdub-a541c.firebasestorage.app",
  messagingSenderId: "1040506253784",
  appId: "1:1040506253784:web:42086b27296e0327ae42ad",
  measurementId: "G-R2EBWHN9S2"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير قاعدة البيانات لاستخدامها في الملفات الأخرى
export const db = getFirestore(app);
