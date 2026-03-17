import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { 
  UploadCloud, Save, Home, Play, Pause, Trash2, 
  User, Music, Star, CheckCircle2, Clock, FolderKanban, ShieldCheck, Edit3, MessageSquare, Palette
} from 'lucide-react';
import { toast } from 'sonner';

const officialArtists = [
  { id: "1", name: "مصطفى جغلال", role: "صوت احترافي ومتزن (الحكواتي)", gender: "ذكر", experience: "12 سنة", image: "/images/mustapha.jpg", language: "فصحى وإنجليزي", isArchived: false },
  { id: "2", name: "لميس حميمي", role: "صوت ناعم ومقنع", gender: "أنثى", experience: "7 سنوات", image: "/images/lamis.jpg", language: "عربي وفرنسي", isArchived: false },
  { id: "3", name: "بلهادي محمد إسلام", role: "صوت عميق وقوي", gender: "ذكر", experience: "8 سنوات", image: "/images/islam.jpg", language: "عربي فصحى", isArchived: false },
  { id: "4", name: "أحمد حاج إسماعيل", role: "صوت حماسي وشبابي", gender: "ذكر", experience: "6 سنوات", image: "/images/ahmed.jpg", language: "فصحى وعامية", isArchived: false },
  { id: "5", name: "منال إبراهيمي", role: "صوت درامي ومؤثر", gender: "أنثى", experience: "5 سنوات", image: "/images/manal.jpg", language: "عربي فصحى", isArchived: false },
  { id: "6", name: "آدم حمدوني", role: "صوت دافئ وجذاب", gender: "ذكر", experience: "10 سنوات", image: "/images/adam.jpg", language: "عربي فصحى وعامية", isArchived: false }
];

export function ArtistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 🎨 إدارة الألوان والصلاحيات
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');
  const userRole = localStorage.getItem('voxdub_user_role') || 'visitor';
  const loggedInArtistId = localStorage.getItem('voxdub_logged_artist_id');
  
  // شرط الصلاحية: المديرة أو صاحب الملف فقط
  const canEdit = userRole === 'admin' || (userRole === 'artist' && String(loggedInArtistId) === String(id));

  const [profile, setProfile] = useState(() => {
    const savedArtists = localStorage.getItem('voxdub_artists_v2');
    const parsedArtists = savedArtists ? JSON.parse(savedArtists) : [];
    const localArtist = parsedArtists.find((a: any) => String(a.id) === String(id));
    const officialArtist = officialArtists.find(a => String(a.id) === String(id));
    const foundData = localArtist || officialArtist || officialArtists[0];
    return { ...foundData, bio: foundData.bio || "معلق صوتي متميز في منصة VoxDub." };
  });

  const [samples, setSamples] = useState(() => {
    const saved = localStorage.getItem(`voxdub_samples_${id}`);
    return saved ? JSON.parse(saved) : (profile.audio ? [{ id: 1, title: `العينة الرئيسية`, url: profile.audio }] : []);
  });

  const [playingId, setPlayingId] = useState<number | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  // 1. رفع عينة جديدة وتخزينها
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newSample = { id: Date.now(), title: file.name.split('.')[0], url: event.target?.result as string };
        const updated = [newSample, ...samples];
        setSamples(updated);
        localStorage.setItem(`voxdub_samples_${id}`, JSON.stringify(updated));
        toast.success("تم رفع العينة بنجاح");
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePlay = (sid: number, url: string) => {
    if (!url) return toast.error("العينة غير متاحة");
    if (playingId === sid) { audioInstance?.pause(); setPlayingId(null); }
    else {
      if (audioInstance) audioInstance.pause();
      const audio = new Audio(url);
      audio.play().catch(() => toast.error("خطأ في التشغيل"));
      setAudioInstance(audio); setPlayingId(sid);
      audio.onended = () => setPlayingId(null);
    }
  };

  const handleSaveProfile = () => {
    const savedArtists = localStorage.getItem('voxdub_artists_v2');
    let artistsArray = savedArtists ? JSON.parse(savedArtists) : [...officialArtists];
    const index = artistsArray.findIndex((a: any) => String(a.id) === String(id));
    if (index >= 0) artistsArray[index] = profile;
    else artistsArray.push(profile);
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(artistsArray));
    toast.success("تم الحفظ بنجاح!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 text-right px-4 text-stone-900" dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        *, body { font-family: 'Cairo', sans-serif !important; }
        .bg-vox-primary { background-color: ${themeColor} !important; } 
        .text-vox-primary { color: ${themeColor} !important; }
      `}</style>

      {/* 🔝 الشريط العلوي */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-100 mt-6">
        <Button onClick={() => navigate('/dashboard/artists')} variant="ghost" className="font-black text-stone-400 hover:text-vox-primary"><Home className="ml-2" /> المكتبة</Button>
        
        <div className="flex items-center gap-4">
          {/* 🎨 مبدل الألوان للمديرة فقط */}
          {userRole === 'admin' && (
            <div className="flex items-center gap-2 bg-stone-50 p-2 px-4 rounded-2xl border border-stone-100">
              <Palette size={18} className="text-stone-400" />
              <input type="color" value={themeColor} onChange={(e) => {
                setThemeColor(e.target.value);
                localStorage.setItem('voxdub_theme', e.target.value);
              }} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
            </div>
          )}
          
          {canEdit && (
            <Button onClick={handleSaveProfile} className="bg-vox-primary text-white rounded-2xl px-10 py-6 font-black shadow-xl">
              <Save className="ml-2" /> حفظ التغييرات
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 👤 الجانب الأيمن: البروفايل */}
        <div className="space-y-6">
          <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-stone-100 text-center relative">
            {canEdit && (
              <span className="absolute top-6 right-6 bg-green-100 text-green-700 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck size={14} /> وضع التعديل متاح
              </span>
            )}
            
            {/* 📸 تعديل الصورة الشخصية */}
            <div className="w-40 h-40 mx-auto rounded-[2.5rem] overflow-hidden mb-6 border-4 border-stone-50 shadow-inner relative group mt-4">
               <img src={profile.image || '/images/default.jpg'} className="w-full h-full object-cover" alt="" />
               {canEdit && (
                 <div onClick={() => {
                   const input = document.createElement('input');
                   input.type = 'file'; input.accept = 'image/*';
                   input.onchange = (e: any) => {
                     const reader = new FileReader();
                     reader.onload = (ev) => setProfile({...profile, image: ev.target?.result as string});
                     reader.readAsDataURL(e.target.files[0]);
                   };
                   input.click();
                 }} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                   <UploadCloud className="text-white" />
                 </div>
               )}
            </div>
            
            <h2 className="text-2xl font-black mb-2">
              {canEdit ? <input value={profile.name} onChange={(e)=>setProfile({...profile, name: e.target.value})} className="text-center bg-transparent border-b border-dashed border-stone-200 w-full outline-none px-2" /> : profile.name}
            </h2>
            <p className="font-bold italic text-vox-primary">
              {canEdit ? <input value={profile.role} onChange={(e)=>setProfile({...profile, role: e.target.value})} className="text-center bg-transparent border-b border-dashed border-stone-200 w-full outline-none px-2" /> : profile.role}
            </p>
          </div>
        </div>

        {/* 📝 الجانب الأيسر: العينات والرسائل */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-stone-100">
            <h3 className="text-xl font-black flex items-center gap-2 mb-6"><Music className="text-vox-primary" /> معرض العينات الصوتية</h3>
            
            {canEdit && (
              <Button onClick={() => document.getElementById('file-up')?.click()} className="bg-vox-primary text-white w-full h-16 rounded-2xl font-black mb-6">
                <UploadCloud className="ml-2" /> ارفع عينة صوتية جديدة
              </Button>
            )}
            <input type="file" id="file-up" hidden accept="audio/*" onChange={handleFileUpload} />

            <div className="space-y-4">
              {samples.length > 0 ? (
                samples.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between p-5 bg-stone-50 rounded-[2rem] border border-stone-100">
                    <div className="flex items-center gap-4">
                      <Button onClick={() => togglePlay(s.id, s.url)} className={`w-12 h-12 rounded-2xl text-white ${playingId === s.id ? 'bg-stone-900' : 'bg-vox-primary'}`}>
                        {playingId === s.id ? <Pause /> : <Play />}
                      </Button>
                      <div className="flex flex-col">
                        <span className="font-black">{s.title}</span>
                        {!s.url && <span className="text-red-400 text-xs font-bold italic">العينة غير متاحة</span>}
                      </div>
                    </div>
                    {canEdit && (
                      <div className="flex gap-2">
                        {/* ✏️ تعديل اسم العينة */}
                        <button onClick={() => {
                          const newName = prompt("اسم العينة الجديد:", s.title);
                          if (newName) {
                            const updated = samples.map((x:any) => x.id === s.id ? {...x, title: newName} : x);
                            setSamples(updated);
                            localStorage.setItem(`voxdub_samples_${id}`, JSON.stringify(updated));
                          }
                        }} className="p-2 text-stone-400 hover:text-vox-primary" title="تعديل الاسم"><Edit3 size={18} /></button>
                        <button onClick={() => {
                          const updated = samples.filter(x => x.id !== s.id);
                          setSamples(updated);
                          localStorage.setItem(`voxdub_samples_${id}`, JSON.stringify(updated));
                        }} className="p-2 text-red-400" title="حذف"><Trash2 size={18} /></button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-stone-100 rounded-[2rem]">
                   <p className="text-stone-400 font-bold italic">عذراً، العينة غير متاحة حالياً لهذا المعلق.</p>
                </div>
              )}
            </div>
          </div>

          {/* ✉️ خانة الرسائل (للمعلق أو المديرة فقط) */}
          {(userRole === 'admin' || (userRole === 'artist' && String(loggedInArtistId) === String(id))) && (
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-stone-100">
              <h3 className="text-xl font-black flex items-center gap-2 mb-6"><MessageSquare className="text-vox-primary" /> صندوق رسائل المعلق</h3>
              <div className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100 text-center">
                 <p className="text-stone-400 font-bold">لا توجد رسائل جديدة حالياً. سيتم إخطارك فور وصول طلبات عمل.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
