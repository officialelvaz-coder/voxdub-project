'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../components/firebase'; // المسار الصحيح
import { useRouter } from 'next/navigation'; // استخدام router الخاص بـ Next.js
import Link from 'next/link';

const Artists = () => {
  const [artists, setArtists] = useState<any[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<any[]>([]);
  const [genderFilter, setGenderFilter] = useState('الكل');
  const [voiceFilter, setVoiceFilter] = useState('الكل');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'artists'));
        const artistsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArtists(artistsData);
        setFilteredArtists(artistsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching artists:", err);
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  useEffect(() => {
    let result = artists;
    if (genderFilter !== 'الكل') {
      result = result.filter(a => a.gender === genderFilter);
    }
    if (voiceFilter !== 'الكل') {
      result = result.filter(a => a.voiceType === voiceFilter);
    }
    setFilteredArtists(result);
  }, [genderFilter, voiceFilter, artists]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-xl font-bold text-blue-600 animate-pulse">جاري تحميل قائمة المعلقين...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-gray-800">تصفح المعلقين الصوتيين</h1>
          <Link href="/" className="text-blue-600 hover:underline font-medium">العودة للرئيسية</Link>
        </div>

        {/* الفلاتر */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 flex flex-wrap gap-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">الجنس</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="الكل">الكل</option>
              <option value="ذكر">ذكر</option>
              <option value="أنثى">أنثى</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع الصوت</label>
            <select
              value={voiceFilter}
              onChange={(e) => setVoiceFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="الكل">الكل</option>
              <option value="رخيم">رخيم</option>
              <option value="ناعم">ناعم</option>
              <option value="إعلاني">إعلاني</option>
              <option value="وثائقي">وثائقي</option>
            </select>
          </div>
        </div>

        {/* قائمة المعلقين */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtists.length > 0 ? (
            filteredArtists.map((artist) => (
              <div key={artist.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                <div className="h-48 bg-blue-100 flex items-center justify-center relative">
                  {artist.profilePicture ? (
                    <img src={artist.profilePicture} alt={artist.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-blue-400 text-6xl">🎙️</div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-blue-600 shadow-sm">
                    {artist.voiceType}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{artist.name}</h3>
                  <p className="text-gray-600 mb-4 flex items-center gap-2">
                    <span>👤 {artist.gender}</span>
                    <span className="text-gray-300">|</span>
                    <span>🏷️ {artist.voiceType}</span>
                  </p>
                  
                  {/* عينات الصوت */}
                  <div className="space-y-3">
                    {artist.audioSamples && artist.audioSamples.length > 0 ? (
                      artist.audioSamples.map((sample: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-2 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">{sample.name || `عينة ${index + 1}`}</p>
                          <audio src={sample.url} controls className="w-full h-8" />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic">لا توجد عينات صوتية متاحة حالياً</p>
                    )}
                  </div>

                  <button 
                    onClick={() => alert('سيتم إضافة ميزة طلب التعليق قريباً!')}
                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  >
                    طلب تعليق صوتي
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-500 text-xl">لا يوجد معلقون يطابقون هذه الفلاتر حالياً.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Artists;
