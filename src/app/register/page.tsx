'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../components/firebase';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  voiceType: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    voiceType: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password || !formData.gender || !formData.voiceType) {
      setError('الرجاء ملء جميع الحقول.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'artists'), where('email', '==', formData.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setError('هذا البريد الإلكتروني مسجل بالفعل.');
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await addDoc(collection(db, 'artists'), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
        voiceType: formData.voiceType,
        profilePicture: null,
        audioSamples: [],
        createdAt: new Date(),
      });

      router.push('/login');
    } catch (err: any) {
      console.error('Error during registration:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('هذا البريد الإلكتروني مسجل بالفعل.');
      } else if (err.code === 'auth/invalid-email') {
        setError('البريد الإلكتروني غير صحيح.');
      } else if (err.code === 'auth/weak-password') {
        setError('كلمة المرور ضعيفة جداً.');
      } else {
        setError('فشل التسجيل: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-800 mb-6">تسجيل معلق جديد</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">الاسم الكامل:</label>
            <input
              type="text"
              id="name"
              name="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="أدخل اسمك الكامل"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">البريد الإلكتروني:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="أدخل بريدك الإلكتروني"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">كلمة المرور:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="أدخل كلمة المرور"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">تأكيد كلمة المرور:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="أعد إدخال كلمة المرور"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">الجنس:</label>
            <select
              id="gender"
              name="gender"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">اختر...</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="voiceType" className="block text-gray-700 text-sm font-bold mb-2">نوع الصوت:</label>
            <select
              id="voiceType"
              name="voiceType"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.voiceType}
              onChange={handleChange}
            >
              <option value="">اختر...</option>
              <option value="young">شاب/شابة</option>
              <option value="adult">بالغ/بالغة</option>
              <option value="child">طفل/طفلة</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {loading ? 'جاري التسجيل...' : 'تسجيل'}
            </button>
          </div>

          <p className="text-center text-gray-600 text-sm">
            هل لديك حساب بالفعل؟{' '}
            <a href="/login" className="text-red-800 hover:text-red-700 font-bold">
              تسجيل الدخول
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
