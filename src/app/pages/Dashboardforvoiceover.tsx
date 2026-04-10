
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { db, app } from '../components/firebase'; // تم تصحيح المسار هنا
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'sonner';
import { Camera, Mic, Play, Pause, Trash2, Plus, X, CheckCircle2, CloudUpload } from 'lucide-react';

export function Dashboardforvoiceover() {
  const { artistId } = useParams();
  const [artistData, setArtistData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newSampleFile, setNewSampleFile] = useState<File | null>(null);
  const [newSampleTitle, setNewSampleTitle] = useState('');
  const [playingSampleId, setPlayingSampleId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [themeColor] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('voxdub_theme') : '#e11d48') || '#e11d48');

  useEffect(() => {
    if (!artistId) return;

    const fetchArtistData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "artists", artistId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArtistData({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("لم يتم العثور على بيانات المعلق.");
        }
      } catch (error) {
        console.error("Error fetching artist data: ", error);
        toast.error("فشل جلب بيانات المعلق.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [artistId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!artistId || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('يُقبل فقط ملفات الصور.');
      return;
    }

    setIsSaving(true);
    try {
      const storage = getStorage(app);
      const imageRef = ref(storage, `artists/${artistId}/profile_image_${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(snapshot.ref);

      const artistDocRef = doc(db, "artists", artistId);
      await updateDoc(artistDocRef, { imageUrl });
      setArtistData((prev: any) => ({ ...prev, imageUrl }));
      toast.success('تم تحديث الصورة الشخصية بنجاح!');
    } catch (error) {
      console.error("Error uploading image: ", error);
      toast.error('فشل تحديث الصورة الشخصية.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateBio = async () => {
    if (!artistId || !artistData) return;
    setIsSaving(true);
    try {
      const artistDocRef = doc(db, "artists", artistId);
      await updateDoc(artistDocRef, { bio: artistData.bio });
      toast.success('تم تحديث النبذة التعريفية بنجاح!');
    } catch (error) {
      console.error("Error updating bio: ", error);
      toast.error('فشل تحديث النبذة التعريفية.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSampleUpload = async () => {
    if (!artistId || !newSampleFile || !newSampleTitle.trim()) {
      toast.error('الرجاء اختيار ملف صوتي وكتابة عنوان للعينة.');
      return;
    }

    setIsSaving(true);
    try {
      const storage = getStorage(app);
      const sampleRef = ref(storage, `artists/${artistId}/samples/${Date.now()}_${newSampleFile.name}`);
      const snapshot = await uploadBytes(sampleRef, newSampleFile);
      const sampleUrl = await getDownloadURL(snapshot.ref);

      const artistDocRef = doc(db, "artists", artistId);
      const newSample = { id: Date.now().toString(), title: newSampleTitle, audio: sampleUrl };
      await updateDoc(artistDocRef, { samples: arrayUnion(newSample) });
      setArtistData((prev: any) => ({ ...prev, samples: [...(prev.samples || []), newSample] }));
      setNewSampleFile(null);
      setNewSampleTitle('');
      toast.success('تم إضافة العينة الصوتية بنجاح!');
    } catch (error) {
      console.error("Error uploading sample: ", error);
      toast.error('فشل إضافة العينة الصوتية.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSample = async (sampleId: string, sampleUrl: string) => {
    if (!artistId || !artistData || !window.confirm('هل أنت متأكد من حذف هذه العينة الصوتية؟')) return;

    setIsSaving(true);
    try {
      // حذف الملف من Firebase Storage
      const storage = getStorage(app);
      const fileRef = ref(storage, sampleUrl);
      await deleteObject(fileRef);

      // حذف الرابط من Firestore
      const artistDocRef = doc(db, "artists", artistId);
      const sampleToRemove = artistData.samples.find((s: any) => s.id === sampleId);
      if (sampleToRemove) {
        await updateDoc(artistDocRef, { samples: arrayRemove(sampleToRemove) });
        setArtistData((prev: any) => ({ ...prev, samples: prev.samples.filter((s: any) => s.id !== sampleId) }));
        toast.success('تم حذف العينة الصوتية بنجاح!');
      }
    } catch (error) {
      console.error("Error deleting sample: ", error);
      toast.error('فشل حذف العينة الصوتية.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAudio = (sampleUrl: string, sampleId: string) => {
    if (audioRef.current && playingSampleId === sampleId) {
      audioRef.current.pause();
      setPlayingSampleId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(sampleUrl);
      audioRef.current.play().catch(e => toast.error('فشل تشغيل العينة: ' + e.message));
      setPlayingSampleId(sampleId);
      audioRef.current.onended = () => setPlayingSampleId(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-stone-700">جاري تحميل لوحة التحكم...</div>;
  }

  if (!artistData) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-red-600">عذراً، لا توجد بيانات لهذا المعلق.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-right" dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        *, body { font-family: 'Cairo', sans-serif !important; }
      `}</style>
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl p-10 border border-stone-100">
        <h1 className="text-4xl font-black text-stone-900 mb-8">لوحة تحكم <span style={{ color: themeColor }}>{artistData.name}</span></h1>

        {/* قسم الصورة الشخصية */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-stone-200 shadow-md">
            <img 
              src={artistData.imageUrl || '/images/default_avatar.png'} 
              alt={artistData.name} 
              className="w-full h-full object-cover"
            />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isSaving}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
              <Camera size={30} />
            </div>
          </div>
          <p className="text-xl font-bold text-stone-800 mt-4">{artistData.name}</p>
          <p className="text-stone-500">{artistData.role}</p>
        </div>

        {/* قسم النبذة التعريفية */}
        <div className="mb-10">
          <label className="block text-lg font-black text-stone-700 mb-3">النبذة التعريفية</label>
          <textarea
            value={artistData.bio || ''}
            onChange={(e) => setArtistData((prev: any) => ({ ...prev, bio: e.target.value }))}
            className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-300 bg-stone-50"
            rows={5}
            disabled={isSaving}
          ></textarea>
          <button 
            onClick={handleUpdateBio} 
            className="mt-4 px-6 py-3 rounded-xl font-bold text-white shadow-md transition-all duration-300 disabled:bg-stone-300"
            style={{ backgroundColor: themeColor }}
            disabled={isSaving}
          >
            {isSaving ? 'جاري الحفظ...' : 'حفظ النبذة'}
          </button>
        </div>

        {/* قسم العينات الصوتية */}
        <div>
          <h2 className="text-2xl font-black text-stone-900 mb-5">عينات صوتية</h2>
          <div className="space-y-4 mb-6">
            {(artistData.samples || []).map((sample: any) => (
              <div key={sample.id} className="flex items-center bg-stone-50 p-4 rounded-xl border border-stone-200 shadow-sm">
                <button 
                  onClick={() => toggleAudio(sample.audio, sample.id)} 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300"
                  style={{ backgroundColor: playingSampleId === sample.id ? '#1c1917' : themeColor }}
                >
                  {playingSampleId === sample.id ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <p className="flex-1 font-bold text-stone-700 mr-4">{sample.title}</p>
                <button 
                  onClick={() => handleDeleteSample(sample.id, sample.audio)} 
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300"
                  disabled={isSaving}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* إضافة عينة جديدة */}
          <div className="p-6 border border-dashed border-stone-300 rounded-xl bg-stone-50">
            <h3 className="text-xl font-black text-stone-800 mb-4">إضافة عينة صوتية جديدة</h3>
            <input 
              type="text" 
              placeholder="عنوان العينة الصوتية (مثلاً: إعلان تجاري)" 
              value={newSampleTitle}
              onChange={(e) => setNewSampleTitle(e.target.value)}
              className="w-full p-3 mb-4 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-300 bg-white"
              disabled={isSaving}
            />
            <input 
              type="file" 
              accept="audio/*" 
              onChange={(e) => setNewSampleFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-sm text-stone-500 cursor-pointer mb-4"
              disabled={isSaving}
            />
            <button 
              onClick={handleSampleUpload} 
              className="w-full px-6 py-3 rounded-xl font-bold text-white shadow-md transition-all duration-300 disabled:bg-stone-300"
              style={{ backgroundColor: themeColor }}
              disabled={isSaving || !newSampleFile || !newSampleTitle.trim()}
            >
              {isSaving ? 'جاري الرفع...' : 'رفع العينة'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
