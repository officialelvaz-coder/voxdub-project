'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../components/firebase'; // المسار الصحيح
import { useRouter } from 'next/navigation'; // استخدام router الخاص بـ Next.js
import Link from 'next/link';

const Dashboard = () => {
  const [artist, setArtist] = useState<any>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [audioSample, setAudioSample] = useState<File | null>(null);
  const [sampleName, setSampleName] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    const fetchArtist = async () => {
      try {
        const docRef = doc(db, 'artists', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArtist({ id: docSnap.id, ...docSnap.data() });
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching artist:", err);
        setLoading(false);
      }
    };
    fetchArtist();
  }, [router]);

  const handleProfilePicUpload = async () => {
    if (!profilePic || !artist) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `profile_pics/${artist.id}`);
      await uploadBytes(storageRef, profilePic);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'artists', artist.id), { profilePicture: url });
      setArtist({ ...artist, profilePicture: url });
      alert('تم تحديث الصورة الشخصية بنجاح!');
    } catch (err) {
      console.error("Error uploading profile pic:", err);
      alert('حدث خطأ أثناء الرفع.');
    }
    setUploading(false);
  };

  const handleAudioUpload = async () => {
    if (!audioSample || !sampleName || !artist) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `audio_samples/${artist.id}/${Date.now()}_${audioSample.name}`);
      await uploadBytes(storageRef, audioSample);
      const url = await getDownloadURL(storageRef);
      const newSample = { name: sampleName, url };
      await updateDoc(doc(db, 'artists', artist.id), {
        audioSamples: arrayUnion(newSample)
      });
      setArtist({
        ...artist,
        audioSamples: [...(artist.audioSamples || []), newSample]
      });
      setSampleName('');
      setAudioSample(null);
      alert('تم رفع العينة الصوتية بنجاح!');
    } catch (err) {
      console.error("Error uploading audio:", err);
      alert('حدث خطأ أثناء الرفع.');
    }
    setUploading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-xl font-bold text-blue-600 animate-pulse">جاري تحميل بياناتك...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">لوحة تحكم المعلق</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
            تسجيل الخروج
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* الملف الشخصي */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-700">الملف الشخصي</h2>
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 bg-blue-100 rounded-full overflow-hidden mb-4 border-4 border-blue-50 shadow-inner">
                {artist?.profilePicture ? (
                  <img src={artist.profilePicture} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-400 text-4xl">🎙️</div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{artist?.name}</h3>
              <p className="text-gray-500">{artist?.voiceType} | {artist?.gender}</p>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">تحديث الصورة الشخصية</label>
              <input 
                type="file" 
                onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button 
                onClick={handleProfilePicUpload}
                disabled={uploading || !profilePic}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
              >
                {uploading ? 'جاري الرفع...' : 'تحديث الصورة'}
              </button>
            </div>
          </div>

          {/* العينات الصوتية */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-700">إضافة عينة صوتية جديدة</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم العينة (مثلاً: إعلان تجاري)</label>
                <input 
                  type="text" 
                  value={sampleName}
                  onChange={(e) => setSampleName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="أدخل اسم العينة"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملف الصوت</label>
                <input 
                  type="file" 
                  accept="audio/*"
                  onChange={(e) => setAudioSample(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <button 
                onClick={handleAudioUpload}
                disabled={uploading || !audioSample || !sampleName}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-300 transition-colors"
              >
                {uploading ? 'جاري الرفع...' : 'رفع العينة الصوتية'}
              </button>
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-gray-700 mb-4">عيناتك الحالية:</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {artist?.audioSamples && artist.audioSamples.length > 0 ? (
                  artist.audioSamples.map((sample: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-700 mb-2">{sample.name}</p>
                      <audio src={sample.url} controls className="w-full h-8" />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-center py-4">لا توجد عينات مرفوعة بعد.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/artists" className="text-blue-600 hover:underline font-medium">مشاهدة ملفك الشخصي كما يراه الآخرون</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
