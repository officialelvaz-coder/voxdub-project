'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../components/firebase';

interface ArtistData {
  name: string;
  email: string;
  gender: string;
  voiceType: string;
  profilePicture?: string;
  audioSamples?: string[];
}

const Dashboardforvoiceover: React.FC = () => {
  const searchParams = useSearchParams();
  const artistId = searchParams.get('artistId');
  const [artistData, setArtistData] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [audioSampleFile, setAudioSampleFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!artistId) {
      setError('معرف المعلق غير موجود.');
      setLoading(false);
      return;
    }

    const fetchArtistData = async () => {
      try {
        const docRef = doc(db, 'artists', artistId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setArtistData(docSnap.data() as ArtistData);
        } else {
          setError('لم يتم العثور على بيانات المعلق.');
        }
      } catch (err) {
        console.error('Error fetching artist data:', err);
        setError('فشل في جلب بيانات المعلق.');
      }
      setLoading(false);
    };

    fetchArtistData();
  }, [artistId]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePictureFile(e.target.files[0]);
    }
  };

  const handleAudioSampleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioSampleFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File, path: string) => {
    if (!file) return null;
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  const handleUpload = async () => {
    if (!artistId) return;
    setUploading(true);
    setUploadMessage(null);

    try {
      const updatedFields: Partial<ArtistData> = {};

      if (profilePictureFile) {
        const profilePictureURL = await uploadFile(
          profilePictureFile,
          `artists/${artistId}/profilePictures/${profilePictureFile.name}`
        );
        if (profilePictureURL) {
          updatedFields.profilePicture = profilePictureURL;
        }
      }

      if (audioSampleFile) {
        const audioSampleURL = await uploadFile(
          audioSampleFile,
          `artists/${artistId}/audioSamples/${audioSampleFile.name}`
        );
        if (audioSampleURL) {
          updatedFields.audioSamples = [...(artistData?.audioSamples || []), audioSampleURL];
        }
      }

      if (Object.keys(updatedFields).length > 0) {
        const artistDocRef = doc(db, 'artists', artistId);
        await updateDoc(artistDocRef, updatedFields);
        setArtistData(prev => (prev ? { ...prev, ...updatedFields } : null));
        setUploadMessage('تم الرفع بنجاح!');
        setProfilePictureFile(null);
        setAudioSampleFile(null);
      } else {
        setUploadMessage('الرجاء اختيار ملف للرفع.');
      }
    } catch (err) {
      console.error('Error uploading files:', err);
      setUploadMessage('فشل الرفع: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">خطأ: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-red-800 mb-2 text-center">
          لوحة تحكم المعلق
        </h2>
        <p className="text-center text-gray-600 mb-6">مرحباً بك، {artistData?.name}</p>

        <div className="mb-8 p-6 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-xl font-semibold text-red-800 mb-4">معلومات حسابك</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">الاسم:</p>
              <p className="text-gray-800 font-semibold">{artistData?.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">البريد الإلكتروني:</p>
              <p className="text-gray-800 font-semibold">{artistData?.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">الجنس:</p>
              <p className="text-gray-800 font-semibold">{artistData?.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">نوع الصوت:</p>
              <p className="text-gray-800 font-semibold">
                {artistData?.voiceType === 'young' ? 'شاب/شابة' :
                 artistData?.voiceType === 'adult' ? 'بالغ/بالغة' :
                 'طفل/طفلة'}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">تحديث الصورة الشخصية</h3>
          {artistData?.profilePicture && (
            <div className="mb-4">
              <p className="text-gray-600 mb-2">الصورة الحالية:</p>
              <img src={artistData.profilePicture} alt="صورة شخصية" className="w-32 h-32 object-cover rounded-full border-4 border-red-800" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
          />
          {profilePictureFile && (
            <p className="text-sm text-gray-600 mt-2">الملف المختار: {profilePictureFile.name}</p>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">إضافة عينة صوتية</h3>
          {artistData?.audioSamples && artistData.audioSamples.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 font-semibold mb-2">العينات الصوتية الحالية:</p>
              <div className="space-y-2">
                {artistData.audioSamples.map((sample, index) => (
                  <audio key={index} controls src={sample} className="w-full h-8" />
                ))}
              </div>
            </div>
          )}
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioSampleChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
          />
          {audioSampleFile && (
            <p className="text-sm text-gray-600 mt-2">الملف المختار: {audioSampleFile.name}</p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading || (!profilePictureFile && !audioSampleFile)}
          className="w-full bg-red-800 hover:bg-red-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {uploading ? 'جاري الرفع...' : 'رفع الملفات'}
        </button>

        {uploadMessage && (
          <p className={`mt-4 text-center text-sm font-semibold ${
            uploadMessage.includes('فشل') ? 'text-red-500' : 'text-green-600'
          }`}>
            {uploadMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboardforvoiceover;
