'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Camera, Upload, Play, Pause, Home, User, 
  FileText, Plus, Trash2, Mic2, Save, LogOut
} from 'lucide-react';
import { db, app } from '../../firebase'; // تأكد من المسار الصحيح لملف firebase
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export function Dashboardforvoiceover() {
  const params = useParams();
  const artistId = params.id as string;

  // 1. جلب لون الهوية المختار ليبقى الموقع متناسقاً
  const [themeColor] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('voxdub_theme') : '#e11d48') || '#e11d48');

  // 2. حالات البيانات
  const [artistData, setArtistData] = useState<any>(null);
  const [myBio, setMyBio] = useState("");
  const [mySamples, setMySamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // 3. جلب البيانات من Firebase Firestore
  useEffect(() => {
    const fetchArtistData = async () => {
      if (!artistId) return;
      try {
        const docRef = doc(db, "artists", artistId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setArtistData(data);
          setMyBio(data.bio || "");
          setMySamples(data.samples || []);
        }
      } catch (err) {
        console.error("Error fetching artist data: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [artistId]);

  // 4. دالة الحفظ النهائي (تحديث النبذة في Firestore)
  const saveAllChanges = async () => {
    if (!artistId) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "artists", artistId), {
        bio: myBio
      });
      alert("✨ تم حفظ جميع التعديلات في ملفك الشخصي بنجاح!");
    } catch (err) {
      console.error("Error saving changes: ", err);
      alert("❌ حدث خطأ أثناء الحفظ، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  // نظام مشغل الصوت
  const toggleAudio = (id: string, audioUrl: string) => {
    if (!audioUrl || audioUrl === "#") {
      alert("عذراً، العينة الصوتية قيد التجهيز!");
      return;
    }
    if (playingId === id) {
      currentAudio?.pause();
      setPlayingId(null);
    } else {
      if (currentAudio) currentAudio.pause();
      const newAudio = new Audio(audioUrl);
      newAudio.play();
      setCurrentAudio(newAudio);
      setPlayingId(id);
      newAudio.onended = () => setPlayingId(null);
    }
  };

  // رفع الصورة الشخصية لـ Firebase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !artistId) return;

    setUploading(true);
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `artists/${artistId}/profile_${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await updateDoc(doc(db, "artists", artistId), {
        imageUrl: downloadURL
      });

      setArtistData({ ...artistData, imageUrl: downloadURL });
      alert("📸 تم تحديث الصورة الشخصية بنجاح!");
    } catch (err) {
      console.error("Error uploading image: ", err);
      alert("❌ فشل رفع الصورة.");
    } finally {
      setUploading(false);
    }
  };

  // إضافة عينة صوتية جديدة لـ Firebase Storage
  const addNewSample = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/mp3';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file && artistId) {
        const title = prompt("أدخل عنوان العينة الصوتية الجديدة:");
        const finalTitle = title ? title : "عينة جديدة";
        
        setUploading(true);
        try {
          const storage = getStorage(app);
          const storageRef = ref(storage, `artists/${artistId}/samples/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);

          const newSample = {
            id: Date.now().toString(),
            title: finalTitle,
            audio: downloadURL
          };

          await updateDoc(doc(db, "artists", artistId), {
            samples: arrayUnion(newSample)
          });

          setMySamples([...mySamples, newSample]);
          alert("🎵 تم إضافة العينة الصوتية بنجاح!");
        } catch (err) {
          console.error("Error uploading audio: ", err);
          alert("❌ فشل رفع العينة الصوتية.");
        } finally {
          setUploading(false);
        }
      }
    };
    input.click();
  };

  // حذف عينة صوتية من Firestore
  const deleteSample = async (sample: any) => {
    if (window.confirm("هل أنت متأكد من حذف هذه العينة؟")) {
      try {
        await updateDoc(doc(db, "artists", artistId), {
          samples: arrayRemove(sample)
        });
        setMySamples(mySamples.filter((s: any) => s.id !== sample.id));
        if (playingId === sample.id) {
          currentAudio?.pause();
          setPlayingId(null);
        }
        alert("🗑️ تم حذف العينة بنجاح.");
      } catch (err) {
        console.error("Error deleting sample: ", err);
        alert("❌ فشل حذف العينة.");
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">جاري تحميل لوحة التحكم...</div>;

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-right flex flex-col" dir="rtl">
      <style>{`
        .dynamic-text { color: ${themeColor} !important; }
        .dynamic-bg { background-color: ${themeColor} !important; }
        .dynamic-border { border-color: ${themeColor} !important; }
        .hover-bg:hover { background-color: ${themeColor} !important; color: white !important; }
      `}</style>

      {/* الهيدر */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic2 className="dynamic-text w-6 h-6" />
            <span className="font-black text-xl text-stone-900">مساحة المعلق</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-stone-500 hover:dynamic-text transition-colors text-sm font-bold flex items-center gap-1">
              <Home size={16} /> الرئيسية
            </a>
            <a href="/login" className="text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors text-sm font-bold flex items-center gap-1">
              <LogOut size={16} /> خروج
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8 w-full">
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-right">
          <div>
            <h1 className="text-3xl font-black text-stone-900 mb-1">مرحباً، {artistData?.name} 🎙️</h1>
            <p className="text-stone-500 font-medium">قم بإدارة عيناتك ونبذتك التعريفية ليراها العملاء بشكل احترافي.</p>
          </div>
          <button 
            onClick={saveAllChanges}
            disabled={loading}
            className="flex items-center gap-2 dynamic-bg text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:brightness-90 transition-all disabled:bg-stone-300"
          >
            <Save size={20} /> {loading ? "جاري الحفظ..." : "حفظ التعديلات في الملف"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* الملف الشخصي */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm text-center">
              <div className="relative w-32 h-32 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center border-4 border-white shadow-inner overflow-hidden">
                {artistData?.imageUrl ? (
                  <img src={artistData.imageUrl} alt={artistData.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={60} className="text-stone-300" />
                )}
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all border border-stone-100">
                  <Camera size={16} className="dynamic-text" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
              <h3 className="text-xl font-black text-stone-900 mb-1">{artistData?.name}</h3>
              <p className="dynamic-text font-bold text-sm mb-6" dir="ltr">@{artistData?.username || 'Artist'}</p>
              
              <div className="text-right space-y-4 pt-4 border-t border-stone-50">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <span className="text-xs font-bold text-stone-400 block mb-1">اللغات:</span>
                  <span className="text-sm font-bold text-stone-700">{artistData?.language || 'العربية'}</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <span className="text-xs font-bold text-stone-400 block mb-1">الخبرة:</span>
                  <span className="text-sm font-bold text-stone-700">{artistData?.experience || 'معلق محترف'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* النبذة والعينات */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
              <label className="text-sm font-black text-stone-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="dynamic-text"/> النبذة التعريفية الشخصية
              </label>
              <textarea 
                rows={4}
                value={myBio}
                onChange={(e) => setMyBio(e.target.value)}
                className="w-full text-stone-600 bg-stone-50 border border-stone-200 rounded-2xl p-4 focus:dynamic-border outline-none transition-all resize-none leading-relaxed font-medium"
                placeholder="اكتب نبذة عنك..."
              />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <label className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <Mic2 size={18} className="dynamic-text"/> معرض عيناتك الصوتية
                </label>
                <button 
                  onClick={addNewSample}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:dynamic-bg transition-colors disabled:bg-stone-300"
                >
                  <Plus size={16} /> {uploading ? "جاري الرفع..." : "إضافة عينة"}
                </button>
              </div>

              <div className="space-y-3">
                {mySamples.map((sample: any) => (
                  <div key={sample.id} className="flex items-center justify-between p-4 rounded-2xl border border-stone-100 bg-stone-50 hover:dynamic-border transition-all group">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleAudio(sample.id, sample.audio)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          playingId === sample.id 
                            ? "dynamic-bg text-white shadow-lg" 
                            : "bg-white text-stone-400 border border-stone-200 hover:dynamic-text hover:border-vox-primary"
                        }`}
                      >
                        {playingId === sample.id ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                      </button>
                      <h4 className="font-bold text-stone-900">{sample.title}</h4>
                    </div>
                    <button 
                      onClick={() => deleteSample(sample)}
                      className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
