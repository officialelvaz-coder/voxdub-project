'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../components/firebase'; // المسار الصحيح الآن
import { useRouter } from 'next/navigation'; // استخدام router الخاص بـ Next.js

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // تسجيل دخول المدير (Admin)
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('userRole', 'admin');
      router.push('/admin'); // تأكد من وجود صفحة admin
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'artists'));
      const artists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // البحث عن المعلق ببياناته
      const user = artists.find((a: any) => a.name === username && a.password === password);

      if (user) {
        localStorage.setItem('userRole', 'artist');
        localStorage.setItem('userId', user.id);
        router.push('/dashboard'); // التوجه للوحة التحكم
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة لاحقاً.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">تسجيل الدخول - VoxDub</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="أدخل اسمك المسجل"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
          >
            دخول
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">ليس لديك حساب؟</p>
          <button 
            onClick={() => router.push('/register')}
            className="text-blue-600 font-bold hover:underline mt-2"
          >
            سجل كمعلق صوتي الآن
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
