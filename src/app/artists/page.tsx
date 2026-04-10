'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../components/firebase';

interface Artist {
  id: string;
  name: string;
  gender: string;
  voiceType: string;
  profilePicture?: string;
  audioSamples?: string[];
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
            <label htmlFor="gender-filter" className="text-gray-700 font-semibold">الجنس:</label>
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
            <label htmlFor="voice-type-filter" className="text-gray-700 font-semibold">نوع الصوت:</label>
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
            </select>
          </div>
        </div>

        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtists.map((artist) => (
              <div key={artist.id} className="bg-gradient-to-br from-red-50 to-yellow-50 rounded-lg shadow-md p-6 text-center border border-red-200 hover:shadow-lg transition">
                {artist.profilePicture && (
                  <img
                    src={artist.profilePicture}
                    alt={artist.name}
                    className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-red-800"
                  />
                )}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{artist.name}</h3>
                <p className="text-gray-600 text-sm mb-1">
                  <span className="font-bold">الجنس:</span> {artist.gender === 'male' ? 'ذكر' : 'أنثى'}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  <span className="font-bold">نوع الصوت:</span> {
                    artist.voiceType === 'young' ? 'شاب/شابة' :
                    artist.voiceType === 'adult' ? 'بالغ/بالغة' :
                    'طفل/طفلة'
                  }
                </p>
                {artist.audioSamples && artist.audioSamples.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-700 font-semibold text-sm">العينات الصوتية:</p>
                    {artist.audioSamples.map((sample, index) => (
                      <audio key={index} controls src={sample} className="w-full h-8" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">لا يوجد معلقون مطابقون لمعايير البحث.</p>
        )}
      </div>
    </div>
  );
};

export default Artists;
