'use client';

import React, { useState } from 'react';
import { db } from './firebase'; // تأكد من صحة المسار لملف firebase.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function OrderForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // مسح الأخطاء السابقة

    try {
      await addDoc(collection(db, "orders"), {
        name,
        email,
        description,
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setDescription('');
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("حدث خطأ أثناء إرسال الطلب، يرجى التأكد من اتصالك والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto p-6 bg-green-100 text-green-800 rounded-lg shadow-md text-center">
        <p className="text-lg font-semibold">تم استلام طلبك بنجاح!</p>
        <p className="mt-2">سنقوم بالرد عليك قريباً.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">نموذج طلب جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">الاسم</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">تفاصيل الطلب</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows={4}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
        </button>
        {error && (
          <p className="mt-4 text-center text-red-600">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
