
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog';
import {
  Search, UserPlus, Trash2, Play, Pause, Upload,
  CheckCircle2, Mic, X, CloudUpload
} from 'lucide-react';
import { toast } from 'sonner';
import { db, app } from '../components/firebase'; // تم تصحيح المسار هنا
import { collection, getDocs, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- مكون المودال لرفع العينات الصوتية (نفس الكود الخاص بك) ---
function AudioUploadModal({ isOpen, onClose, onUpload, themeColor }: any) {
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!isOpen) { setPreviewFile(null); setIsLoading(false); } }, [isOpen]);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('audio/')) { toast.error('يُقبل فقط ملفات صوتية'); return; }
    setIsLoading(true);

    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `temp_samples/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setPreviewFile({ name: file.name, url: downloadURL });
      toast.success('تم تجهيز الملف بنجاح');
    } catch (error) {
      toast.error('فشل معالجة الملف');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-lg mx-4 rounded-[2.5rem] overflow-hidden bg-[#111]">
        <div className="p-10 pb-6 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] relative">
           <button onClick={onClose} className="absolute top-6 left-6 text-white/70 hover:text-white"><X size={18} /></button>
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: themeColor }}><Mic size={28} className="text-white" /></div>
              <div><h3 className="text-white font-black text-2xl">رفع العينة الصوتية</h3></div>
           </div>
        </div>
        <div className="p-8 space-y-6">
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed rounded-[1.8rem] p-10 text-center cursor-pointer transition-all"
            style={{ borderColor: previewFile ? '#22c55e' : '#333', background: previewFile ? '#0d2010' : '#1a1a1a' }}
          >
            <input ref={inputRef} type="file" accept="audio/*" hidden onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
            {isLoading ? <div className="text-white/30 animate-pulse">جاري المعالجة...</div> : previewFile ? <div className="text-green-400 font-black"><CheckCircle2 className="mx-auto mb-2" />{previewFile.name}</div> : <div className="text-white/30"><CloudUpload className="mx-auto mb-2" />اسحب أو انقر للرفع</div>}
          </div>
          <Button onClick={() => { onUpload(previewFile.url, previewFile.name); onClose(); }} disabled={!previewFile} className="w-full h-14 rounded-2xl font-black text-white" style={{ background: themeColor }}>تأكيد العينة</Button>
        </div>
      </div>
    </div>
  );
}

export function Artists() {
  const navigate = useNavigate();
  const themeColor = (typeof window !== 'undefined' ? localStorage.getItem('voxdub_theme') : '#e11d48') || '#e11d48';

  const userRole = typeof window !== 'undefined' ? localStorage.getItem('voxdub_user_role') : null;
  const isAdmin = userRole === 'admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [newArtist, setNewArtist] = useState({ name: '', role: '', gender: 'ذكر', experienceYears: '', language: 'عربية فصحى', bio: '', image: '', audio: '', audioName: '' });

  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // جلب البيانات حياً من Firebase Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "artists"), (snapshot) => {
      const artistsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArtists(artistsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddArtist = async () => {
    if (!newArtist.name.trim()) return toast.error('الاسم مطلوب');

    try {
      const artistToAdd = {
        name: newArtist.name,
        role: newArtist.role,
        gender: newArtist.gender,
        experience: `${newArtist.experienceYears || 0} سنوات`,
        language: newArtist.language,
        bio: newArtist.bio,
        imageUrl: newArtist.image || null,
        samples: newArtist.audio ? [{ id: Date.now().toString(), title: newArtist.audioName || "عينة أساسية", audio: newArtist.audio }] : [],
        createdAt: new Date()
      };

      await addDoc(collection(db, "artists"), artistToAdd);
      setIsAddDialogOpen(false);
      setNewArtist({ name: '', role: '', gender: 'ذكر', experienceYears: '', language: 'عربية فصحى', bio: '', image: '', audio: '', audioName: '' });
      toast.success(`تمت إضافة ${newArtist.name} بنجاح`);
    } catch (error) {
      toast.error('حدث خطأ أثناء الإضافة');
    }
  };

  const handleDeleteArtist = async (id: string) => {
    if (!isAdmin) return toast.error("عذراً، المديرة فقط تملك صلاحية الحذف");
    if (!window.confirm("هل أنت متأكد من حذف هذا المعلق؟")) return;

    try {
      await deleteDoc(doc(db, "artists", id));
      toast.success('تم حذف المعلق بنجاح');
    } catch (error) {
      toast.error('فشل الحذف');
    }
  };

  const toggleAudio = (id: string, audioUrl: string) => {
    if (!audioUrl) return toast.error("العينة غير متاحة لهذا المعلق");
    if (playingId === id) { currentAudio?.pause(); setPlayingId(null); }
    else {
      if (currentAudio) currentAudio.pause();
      const audio = new Audio(audioUrl);
      audio.play().catch(() => toast.error('فشل تشغيل العينة'));
      setCurrentAudio(audio); setPlayingId(id);
      audio.onended = () => setPlayingId(null);
    }
  };

  const filteredArtists = artists.filter((a: any) =>
    a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">جاري تحميل المكتبة الصوتية...</div>;

  return (
    <div className="p-4 space-y-6 text-right px-6" dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        *, body { font-family: 'Cairo', sans-serif !important; }
      `}</style>

      <AudioUploadModal isOpen={isAudioModalOpen} onClose={() => setIsAudioModalOpen(false)} onUpload={(url: any, name: any) => setNewArtist({...newArtist, audio: url, audioName: name})} themeColor={themeColor} />

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black italic">المكتبة <span style={{ color: themeColor }}>الصوتية</span></h1>

        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 px-8 rounded-2xl font-black text-white shadow-xl" style={{ backgroundColor: themeColor }}>
                <UserPlus className="ml-2" /> إضافة مؤدي
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] p-10 bg-white text-right" dir="rtl">
              <h2 className="text-2xl font-black mb-6">تسجيل معلق جديد</h2>
              <div className="space-y-4">
                <Input placeholder="الاسم الكامل" value={newArtist.name} onChange={(e) => setNewArtist({...newArtist, name: e.target.value})} className="h-14 rounded-xl px-4 font-bold" />
                <Input placeholder="التخصص (مثلاً: وثائقي)" value={newArtist.role} onChange={(e) => setNewArtist({...newArtist, role: e.target.value})} className="h-14 rounded-xl px-4 font-bold" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={newArtist.gender} onChange={(e) => setNewArtist({...newArtist, gender: e.target.value})} className="h-14 rounded-xl px-4 font-bold border border-stone-200 outline-none">
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                  <Input placeholder="سنوات الخبرة" type="number" value={newArtist.experienceYears} onChange={(e) => setNewArtist({...newArtist, experienceYears: e.target.value})} className="h-14 rounded-xl px-4 font-bold" />
                </div>
                <Button onClick={() => setIsAudioModalOpen(true)} variant="outline" className="w-full h-14 rounded-xl border-dashed border-2 font-bold">
                  {newArtist.audioName || "رفع عينة الصوت (اختياري)"}
                </Button>
                <Button onClick={handleAddArtist} className="w-full h-14 rounded-xl font-black text-white" style={{ background: themeColor }}>حفظ البيانات في السحابة</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="relative mb-8">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن اسم أو تخصص..." className="w-full h-14 pr-12 rounded-2xl border border-stone-100 shadow-sm outline-none px-6 font-bold" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.map((artist: any) => (
          <div key={artist.id} className="bg-white rounded-[2.5rem] p-6 border border-stone-50 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-6 cursor-pointer" onClick={() => navigate(`/dashboard/artists/${artist.id}`)}>
              <div className="w-16 h-16 rounded-2xl bg-stone-100 overflow-hidden flex-shrink-0">
                <img src={artist.imageUrl || '/images/default.jpg'} className="w-full h-full object-cover" alt="" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center font-black text-stone-300 bg-stone-50">${artist.name[0]}</div>` }} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-stone-900">{artist.name}</h3>
                <p className="text-sm font-bold" style={{ color: themeColor }}>{artist.role}</p>
                {(!artist.samples || artist.samples.length === 0) && <span className="text-[10px] text-red-400 font-bold italic">العينة غير متاحة</span>}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleAudio(artist.id, artist.samples?.[0]?.audio || artist.audio)}
                className={`flex-1 h-12 rounded-2xl font-black text-white flex items-center justify-center gap-2 transition-all ${(!artist.samples?.[0]?.audio && !artist.audio) ? 'opacity-30 cursor-not-allowed' : ''}`}
                style={{ backgroundColor: playingId === artist.id ? '#1c1917' : themeColor }}
              >
                {playingId === artist.id ? <Pause size={16} /> : <Play size={16} />}
                {playingId === artist.id ? 'إيقاف' : 'استمع'}
              </button>

              {isAdmin && (
                <button onClick={() => handleDeleteArtist(artist.id)} className="w-12 h-12 rounded-2xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
