import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  UploadCloud, Save, Home, Play, Pause, Trash2, 
  Music, Star, ShieldCheck, Edit3, MessageSquare, Palette, User, Languages, Clock
} from 'lucide-react';
import { toast } from 'sonner';

// 1. قاعدة البيانات المرجعية بالعينات الصحيحة لكل معلق
const officialArtists = [
  { id: "1", name: "مصطفى جغلال", role: "صوت احترافي ومتزن (الحكواتي)", gender: "ذكر", experience: "12 سنة", image: "/images/mustapha.jpg", language: "فصحى وإنجليزي", audio: "/audio/mustapha.mp3", bio: "معلق صوتي خبير ومؤسس منصة الحكواتي، متخصص في الوثائقيات والإعلانات الرسمية." },
  { id: "2", name: "لميس حميمي", role: "صوت ناعم ومقنع", gender: "أنثى", experience: "7 سنوات", image: "/images/lamis.jpg", language: "عربي وفرنسي", audio: "/audio/lamis.mp3", bio: "متميزة في الأداء الدرامي والكتب الصوتية، تمتلك خامة صوتية دافئة وجذابة." },
  { id: "3", name: "بلهادي محمد إسلام", role: "صوت عميق وقوي", gender: "ذكر", experience: "8 سنوات", image: "/images/islam.jpg", language: "عربي فصحى", audio: "/audio/islam.mp3", bio: "متخصص في التعليق الرياضي والحماسي، يتميز بنبرة صوتية جهورية." },
  { id: "4", name: "أحمد حاج إسماعيل", role: "صوت حماسي وشبابي", gender: "ذكر", experience: "6 سنوات", image: "/images/ahmed.jpg", language: "فصحى وعامية", audio: "/audio/ahmed.mp3", bio: "يؤدي الإعلانات الشبابية والبودكاست بأسلوب عصري وممتع." }
];

export function ArtistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 🎨 إعدادات اللون والصلاحيات
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');
  const userRole = localStorage.getItem('voxdub_user_role') || 'visitor';
  const loggedInArtistId = localStorage.getItem('voxdub_logged_artist_id');
  const isAdmin = userRole === 'admin';
  const isOwner = userRole === 'artist' && String(loggedInArtistId) === String(id);
  const canEdit = isAdmin || isOwner;

  // 2. جلب بيانات البروفايل كاملة (من الذاكرة أو القائمة الرسمية)
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('voxdub_artists_v2');
    const artists = saved ? JSON.parse(saved) : [];
    const found = artists.find((a: any) => String(a.id) === String(id)) || officialArtists.find(a => String(a.id) === String(id)) || officialArtists[0];
    return found;
  });

  // 3. جلب العينات الصوتية (تلقائية لكل معلق حسب اسمه)
  const [samples, setSamples] = useState(() => {
    const saved = localStorage.getItem(`voxdub_samples_${id}`);
    if (saved) return JSON.parse(saved);
    // إذا لم توجد عينات مرفوعة، نضع العينة الرسمية الخاصة بهذا المعلق فقط
    return [{ id: 'main', title: `العينة الرئيسية - ${profile.name}`, url: profile.audio }];
  });

  const [playingId, setPlayingId] = useState<string | number | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  const togglePlay = (sid: any, url: string) => {
    if (!url) return toast.error("العينة غير متاحة");
    if (playingId === sid) { audioInstance?.pause(); setPlayingId(null); }
    else {
      if (audioInstance) audioInstance.pause();
      const audio = new Audio(url);
      audio.play().catch(() => toast.error("خطأ في تشغيل ملف " + url));
      setAudioInstance(audio); setPlayingId(sid);
      audio.onended = () => setPlayingId(null);
    }
  };

  const handleSave = () => {
    const saved = localStorage.getItem('voxdub_artists_v2');
    let artists = saved ? JSON.parse(saved) : [...officialArtists];
    const idx = artists.findIndex((a: any) => String(a.id) === String(id));
    if (idx >= 0) artists[idx] = profile; else artists.push(profile);
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(artists));
    toast.success("تم حفظ البيانات بنجاح");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 text-right px-4" dir="rtl">
      <style>{`
        .text-vox-primary { color: ${themeColor} !important; }
        .bg-vox-primary { background-color: ${themeColor} !important; }
        .bg-vox-light { background-color: ${themeColor}15 !important; }
      `}</style>

      {/* 🔝 الشريط العلوي - زر الألوان للمديرة فقط */}
      <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-100 mt-6">
        <Button onClick={() => navigate('/dashboard/artists')} variant="ghost" className="font-black text-stone-400 hover:text-vox-primary"><Home className="ml-2" /> العودة</Button>
        
        <div className="flex items-center gap-4">
          {isAdmin && (
            <div className="flex items-center gap-3 bg-stone-50 p-2 px-4 rounded-2xl border border-stone-100">
              <Palette size={18} className="text-stone-400" />
              <input type="color" value={themeColor} onChange={(e) => {
                setThemeColor(e.target.value);
                localStorage.setItem('voxdub_theme', e.target.value);
              }} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
            </div>
          )}
          {canEdit && <Button onClick={handleSave} className="bg-vox-primary text-white rounded-2xl px-8 font-black shadow-lg"><Save className="ml-2" /> حفظ الملف</Button>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* الجانب الأيمن: الكرت الشخصي */}
        <div className="space-y-6">
          <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-stone-100 text-center">
            <div className="w-40 h-40 mx-auto rounded-[2.5rem] overflow-hidden mb-6 border-4 border-stone-50 shadow-inner">
               <img src={profile.image} className="w-full h-full object-cover" alt={profile.name} />
            </div>
            <h2 className="text-2xl font-black">{profile.name}</h2>
            <p className="font-bold text-vox-primary mt-2">{profile.role}</p>
            
            <div className="grid grid-cols-2 gap-3 mt-8">
              <div className="bg-stone-50 p-4 rounded-2xl">
                <User size={18} className="mx-auto mb-2 text-stone-400" />
                <p className="text-[10px] font-black text-stone-400">الجنس</p>
                <p className="font-black text-stone-800">{profile.gender}</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl">
                <Clock size={18} className="mx-auto mb-2 text-stone-400" />
                <p className="text-[10px] font-black text-stone-400">الخبرة</p>
                <p className="font-black text-stone-800">{profile.experience}</p>
              </div>
            </div>
          </div>
        </div>

        {/* الجانب الأيسر: النبذة والعينات والرسائل */}
        <div className="lg:col-span-2 space-y-8">
          {/* النبذة الشخصية */}
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-stone-100">
            <h3 className="text-xl font-black flex items-center gap-2 mb-4"><Star className="text-vox-primary" /> النبذة الشخصية</h3>
            {canEdit ? (
              <textarea 
                className="w-full p-4 bg-stone-50 rounded-2xl border-none outline-none font-bold text-stone-600 h-32"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
              />
            ) : <p className="leading-relaxed font-bold text-stone-500">{profile.bio}</p>}
          </div>

          {/* العينات الصوتية (منفصلة لكل معلق) */}
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-stone-100">
            <h3 className="text-xl font-black flex items-center gap-2 mb-6"><Music className="text-vox-primary" /> العينات الصوتية الخاصة بـ {profile.name}</h3>
            <div className="space-y-4">
              {samples.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-5 bg-stone-50 rounded-[2rem] border border-stone-100">
                  <div className="flex items-center gap-4">
                    <Button onClick={() => togglePlay(s.id, s.url)} className={`w-12 h-12 rounded-2xl text-white ${playingId === s.id ? 'bg-stone-900' : 'bg-vox-primary'}`}>
                      {playingId === s.id ? <Pause /> : <Play />}
                    </Button>
                    <span className="font-black">{s.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* صندوق الرسائل (محمي: لا يراه إلا صاحب الملف أو المديرة) */}
          {canEdit && (
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-stone-100">
              <h3 className="text-xl font-black flex items-center gap-2 mb-6"><MessageSquare className="text-vox-primary" /> رسائل خاصة لـ {profile.name}</h3>
              <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 text-center">
                <p className="text-blue-600 font-black italic">لا توجد رسائل جديدة لهذا الحساب حالياً.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
