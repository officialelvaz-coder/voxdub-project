'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../components/firebase'; // المسار الصحيح لملف firebase.ts

interface Artist {
  id: string;
  name: string;
  gender: string;
  voiceType: string;
  profilePicture?: string;
  audioSamples?: string[];
  // أضف أي حقول أخرى للمعلق هنا
}

const Artists: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterVoiceType, setFilterVoiceType] = useState<string>('all');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'artists'));
        const artistsData: Artist[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          gender: doc.data().gender,
          voiceType: doc.data().voiceType,
          profilePicture: doc.data().profilePicture,
          audioSamples: doc.data().audioSamples || [],
        }));
        setArtists(artistsData);
        setFilteredArtists(artistsData);
      } catch (err) {
        console.error('Error fetching artists:', err);
        setError('فشل في جلب قائمة المعلقين.');
      }
      setLoading(false);
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    let currentArtists = artists;

    if (filterGender !== 'all') {
      currentArtists = currentArtists.filter(artist => artist.gender === filterGender);
    }

    if (filterVoiceType !== 'all') {
      currentArtists = currentArtists.filter(artist => artist.voiceType === filterVoiceType);
    }

    setFilteredArtists(currentArtists);
  }, [filterGender, filterVoiceType, artists]);

  if (loading) {
    return <div className="text-center py-10">جاري تحميل المعلقين...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">خطأ: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-red-800 mb-6 text-center">مكتبة المعلقين الصوتيين</h2>

        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label htmlFor="gender-filter" className="text-gray-700">الجنس:</label>
            <select
              id="gender-filter"
              className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
            >
              <option value="all">الكل</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="voice-type-filter" className="text-gray-700">نوع الصوت:</label>
            <select
              id="voice-type-filter"
              className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={filterVoiceType}
              onChange={(e) => setFilterVoiceType(e.target.value)}
            >
              <option value="all">الكل</option>
              <option value="young">شاب/شابة</option>
              <option value="adult">بالغ/بالغة</option>
              <option value="child">طفل/طفلة</option>
              {/* أضف أنواع أصوات أخرى حسب الحاجة */}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.length > 0 ? (
            filteredArtists.map((artist) => (
              <div key={artist.id} className="bg-white rounded-lg shadow-md p-6 text-center">
                {artist.profilePicture && (
                  <img
                    src={artist.profilePicture}
                    alt={artist.name}
                    className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{artist.name}</h3>
                <p className="text-gray-600">الجنس: {artist.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                <p className="text-gray-600">نوع الصوت: {artist.voiceType}</p>
                <div className="mt-4">
                  {artist.audioSamples && artist.audioSamples.map((sample, index) => (
                    <audio key={index} controls src={sample} className="w-full mb-2">
                      متصفحك لا يدعم العنصر الصوتي.
                    </audio>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">لا يوجد معلقون مطابقون لمعايير البحث.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Artists;
