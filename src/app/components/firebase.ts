import { initializeApp } from 'firebase/app';
// قمنا باستبدال getFirestore بـ initializeFirestore هنا
import { initializeFirestore } from 'firebase/firestore'; 
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDyOoLEsDzhQdcqfDgntBejE-xTnLULbTg',
  authDomain: 'voxdub-a541c.firebaseapp.com',
  projectId: 'voxdub-a541c',
  storageBucket: 'voxdub-a541c.firebasestorage.app',
  messagingSenderId: '1040506253784',
  appId: '1:1040506253784:web:42086b27296e0327ae42ad',
};

const app = initializeApp(firebaseConfig);

// التعديل الجوهري لتخطي مشكلة الاتصال في الشبكة (QUIC Error)
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true
});

export const storage = getStorage(app);
export const auth = getAuth(app);
export { app };
