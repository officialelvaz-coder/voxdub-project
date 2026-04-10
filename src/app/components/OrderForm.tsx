'use client';
import { useState } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function OrderForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOrder = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const target = e.target;
      await addDoc(collection(db, "orders"), {
        name: target.name.value,
        email: target.email.value,
        description: target.description.value,
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
    } catch (err) {
      alert("حدث خطأ، تأكد من اتصالك");
    }
    setLoading(false);
  };

  if (isSubmitted) return <div className="p-10 text-center font-bold text-green-600">تم استلام طلبك! سنقوم بالرد عليك قريباً.</div>;

  return (
    <form onSubmit={sendOrder} className="max-w-md mx-auto p-6 space-y-4" dir="rtl">
      <input name="name" placeholder="الاسم الكامل" required className="w-full p-2 border rounded" />
      <input name="email" type="email" placeholder="البريد الإلكتروني" required className="w-full p-2 border rounded" />
      <textarea name="description" placeholder="تفاصيل المشروع" required className="w-full p-2 border rounded" />
      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded">
        {loading ? "جاري الإرسال..." : "إرسال الطلب"}
      </button>
    </form>
  );
}
