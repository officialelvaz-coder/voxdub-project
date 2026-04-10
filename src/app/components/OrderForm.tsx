'use client';

import React, { useState } from 'react';
// تم تصحيح المسار هنا للرجوع لنفس المجلد
import { db } from './firebase'; 
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
    setError(null);

    try {
      await addDoc(collection(db, "orders"), {
        name,
        email,
        description,
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("حدث خطأ، تأكد من اتصالك بالإنترنت والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-6 bg-green-100 text-green-800 rounded-lg text-center shadow-md">
        <p className="text-lg font-bold">تم استلام طلبك بنجاح!</p>
        <p>سنقوم بالرد عليك في أقرب وقت ممكن.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">إرسال طلب جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="أدخل اسمك هنا"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="example@mail.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تفاصيل الطلب</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            rows={4}
            placeholder="اشرح طلبك بالتفصيل..."
          />
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? "جاري الإرسال..." : "إرسال الطلب الآن"}
        </button>
        {error && <p className="text-red-600 text-center text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}
