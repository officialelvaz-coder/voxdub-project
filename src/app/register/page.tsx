'use client';

import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../components/firebase'; // المسار الصحيح
import { useRouter } from 'next/navigation'; // استخدام router الخاص بـ Next.js
import Link from 'next/link';

const Register = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('ذكر');
  const [voiceType, setVoiceType] = useState('رخيم');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    try {
      // إضافة المعلق الجديد إلى Firestore
      await addDoc(collection(db, 'artists'), {
        name,
        gender,
        voiceType,
        password,
        profilePicture: '', // سيتم رفعها لاحقاً من لوحة التحكم
        audioSamples: [],   // سيتم رفعها لاحقاً من لوحة التحكم
        createdAt: new Date().toISOString()
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/login'); // التوجه لصفحة تسجيل الدخول بعد النجاح
      }, 2000);
    } catch (err) {
      console.error("Error during registration:", err);
      setError('حدث خطأ أثناء التسجيل. يرجى المحاولة لاحقاً.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-green-500 text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">تم التسجيل بنجاح!</h2>
          <p className="text-gray-600">جاري تحويلك لصفحة تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">تسجيل معلق جديد - VoxDub</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="أدخل اسمك الثلاثي"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الجنس</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع الصوت</label>
              <select
                value={voiceType}
                onChange={(e) => setVoiceType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="رخيم">رخيم</option>
                <option value="ناعم">ناعم</option>
                <option value="إعلاني">إعلاني</option>
                <option value="وثائقي">وثائقي</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="أدخل كلمة مرور قوية"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="أعد إدخال كلمة المرور"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md mt-4"
          >
            إنشاء حسابي الآن
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">لديك حساب بالفعل؟</p>
          <Link href="/login" className="text-blue-600 font-bold hover:underline mt-2 inline-block">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
