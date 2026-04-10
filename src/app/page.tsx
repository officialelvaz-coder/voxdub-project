'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-yellow-700 flex items-center justify-center">
      <div className="text-center text-white px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">VoxDub</h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">منصة المعلقين الصوتيين المحترفين</p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/login" className="bg-white text-red-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition text-lg">
            تسجيل الدخول
          </Link>
          <Link href="/register" className="bg-yellow-500 text-red-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition text-lg">
            تسجيل جديد
          </Link>
          <Link href="/artists" className="bg-red-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-600 transition text-lg border-2 border-white">
            المعلقين
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur">
            <h3 className="text-2xl font-bold mb-2">🎙️ معلقون محترفون</h3>
            <p className="opacity-80">اختر من بين أفضل المعلقين الصوتيين المحترفين</p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur">
            <h3 className="text-2xl font-bold mb-2">📝 طلبات سهلة</h3>
            <p className="opacity-80">أرسل طلبك واحصل على النتيجة بسرعة وجودة عالية</p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur">
            <h3 className="text-2xl font-bold mb-2">⭐ جودة مضمونة</h3>
            <p className="opacity-80">نضمن لك أفضل جودة صوتية احترافية</p>
          </div>
        </div>
      </div>
    </div>
  );
}
