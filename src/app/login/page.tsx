'use client';

import React, { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../components/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mic2, LogIn } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // تسجيل دخول المدير
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userId', 'admin');
      router.push('/dashboard');
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'artists'));
      const artists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const user = artists.find((a: any) => a.name === username && a.password === password);

      if (user) {
        localStorage.setItem('userRole', 'artist');
        localStorage.setItem('userId', user.id);
        router.push('/dashboard');
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء تسجيل الدخول.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap'); * { font-family: 'Cairo', sans-serif; }`}</style>

      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <div className="bg-red-600 p-2 rounded-xl">
              <Mic2 className="text-white w-6 h-6" />
            </div>
            <span className="text-3xl font-black">Vox<span className="text-red-600">Dub</span></span>
          </Link>
          <p className="text-gray-500 font-bold mt-3">سجل دخولك للمتابعة</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">اسم المستخدم</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-bold text-sm focus:border-red-400 transition-colors"
                placeholder="أدخل اسمك المسجل"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-bold text-sm focus:border-red-400 transition-colors"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-bold text-center py-3 px-4 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-gray-900 disabled:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {loading ? 'جاري التحقق...' : 'دخول'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 font-bold text-sm">ليس لديك حساب؟</p>
            <Link href="/register" className="text-red-600 font-black hover:underline mt-1 inline-block">
              سجل كمعلق صوتي الآن
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-400 font-bold text-sm hover:text-gray-600 transition">
            ← العودة للواجهة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
