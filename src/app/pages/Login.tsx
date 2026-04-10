'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../components/firebase';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loginMode, setLoginMode] = useState<'artist' | 'admin'>('artist');
  const router = useRouter();

  const handleArtistLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // تسجيل الدخول باستخدام Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // البحث عن بيانات المعلق في Firestore باستخدام uid
      const q = query(collection(db, 'artists'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const artistDoc = querySnapshot.docs[0];
        const artistId = artistDoc.id;
        router.push(`/pages/Dashboardforvoiceover?artistId=${artistId}`);
      } else {
        setError('لم يتم العثور على بيانات المعلق.');
      }
    } catch (err: any) {
      console.error('Error during login:', err);
      if (err.code === 'auth/user-not-found') {
        setError('البريد الإلكتروني غير مسجل.');
      } else if (err.code === 'auth/wrong-password') {
        setError('كلمة المرور غير صحيحة.');
      } else if (err.code === 'auth/invalid-email') {
        setError('البريد الإلكتروني غير صحيح.');
      } else {
        setError('فشل تسجيل الدخول: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (adminPassword === 'admin123') {
        router.push('/pages/AdminDashboard');
      } else {
        setError('كلمة مرور المديرة غير صحيحة.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-800 mb-6">تسجيل الدخول</h2>
        
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setLoginMode('artist')}
            className={`flex-1 py-2 px-4 rounded font-bold transition ${
              loginMode === 'artist'
                ? 'bg-red-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            معلق صوتي
          </button>
          <button
            type="button"
            onClick={() => setLoginMode('admin')}
            className={`flex-1 py-2 px-4 rounded font-bold transition ${
              loginMode === 'admin'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            مديرة
          </button>
        </div>

        {loginMode === 'artist' ? (
          <form onSubmit={handleArtistLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">البريد الإلكتروني:</label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">كلمة المرور:</label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {loading ? 'جاري...' : 'تسجيل الدخول'}
            </button>
            <p className="text-center text-gray-600 text-sm mt-4">
              لا تملك حساباً؟{' '}
              <a href="/pages/Register" className="text-red-800 hover:text-red-700 font-bold">
                سجل الآن
              </a>
            </p>
          </form>
        ) : (
          <form onSubmit={handleAdminLogin}>
            <div className="mb-6">
              <label htmlFor="admin-password" className="block text-gray-700 text-sm font-bold mb-2">كلمة مرور المديرة:</label>
              <input
                type="password"
                id="admin-password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="أدخل كلمة مرور المديرة"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {loading ? 'جاري...' : 'دخول المديرة'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
