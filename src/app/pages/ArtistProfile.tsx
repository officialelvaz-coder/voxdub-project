import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  UploadCloud, Save, Home, Play, Pause, Trash2, 
  Music, Star, ShieldCheck, User, Clock, MessageSquare, Edit3
} from 'lucide-react';
import { toast } from 'sonner';

const convertArabicToLatin = (name: string): string => {
  const charMap: { [key: string]: string } = {
    'أ': 'a', 'إ': 'i', 'آ': 'a', 'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
    'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a',
    'ة': 'a', 'ء': 'a', 'ئ': 'y', 'ؤ': 'w', ' ': '_'
  };

  // نأخذ الاسم الأول فقط، ونحول حروفه بناءً على الخريطة أعلاه
  const firstName = name.trim().split(' ')[0];
  return firstName
    .split('')
    .map(char => charMap[char] || char)
    .join('')
    .toLowerCase();
};

export function ArtistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const themeColor = localStorage.getItem('voxdub_theme') || '#e11d48';
  
  const userRole = localStorage.getItem('voxdub_user_role') || 'visitor';
  const loggedInArtistId = localStorage.getItem('voxdub_logged_artist_id');
  
  // الخصوصية المطلوبة: التعديل للمعلق نفسه فقط (حتى لميس لا تعدل النبذة)
  const isOwner = userRole === 'artist' && String(loggedInArtistId) === String(id);
  const isAdmin = userRole === 'admin';

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('voxdub_artists_v2');
    const artists = saved ? JSON.parse(saved) : [];
    const found = artists.find((a: any) => String(a.id) === String(id));
    return found || { name: 'معلق جديد', role: 'وصف الصوت', bio: 'النبذة التعريفية', gender: 'ذكر', experience: '0 سنة', image: '/images/default.jpg' };
  });

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  const togglePlay = (url: string) => {
    // النظام التلقائي للعينات
    const audioPath = `/audio/${getFirstSlotName(profile.name)}.mp3`;
    
    if (playingId) { 
      audioInstance?.pause(); setPlayingId(null); 
    } else {
      const audio = new Audio(audioPath);
      audio.play()
        .then(() => {
          setAudioInstance(audio);
          setPlayingId('playing');
          audio.onended = () => setPlayingId(null);
        })
        .catch(() => toast.error("العينة غير متوفرة حالياً (يرجى إضافة ملف " + audioPath + ")"));
    }
  };

  const handleSave = () => {
    const saved = localStorage.getItem('voxdub_artists_v2');
    let artists = saved ? JSON.parse(saved) : [];
    const idx = artists.findIndex((a: any) => String(a.id) === String(id));
    if (idx >= 0) artists[idx] = profile;
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(artists));
    toast.success("تم حفظ التعديلات الخاصة بك");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 text-right px-4" dir="rtl">
      <style>{`.text-vox-primary { color: ${themeColor} !important; } .bg-vox-primary { background-color: ${themeColor} !important; }`}</style>

      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-100 mt-6">
        <Button onClick={() => navigate('/dashboard/artists')} variant="ghost" className="font-black text-stone-400 hover:text-vox-primary"><Home className="ml-2" /> العودة</Button>
        {isOwner && <Button onClick={handleSave} className="bg-vox-primary text-white rounded-2xl px-10 font-black shadow-lg"><Save className="ml-2" /> حفظ التعديلات</Button>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-stone-100 text-center relative">
            <div className="w-40 h-40 mx-auto rounded-[2.5rem] overflow-hidden mb-6 border-4 border-stone-50 shadow-inner">
               <img src={profile.image} className="w-full h-full object-cover" alt="" />
            </div>
            
            {/* وصف الصوت قابل للتعديل من المعلق فقط */}
            <h2 className="text-2xl font-black">{profile.name}</h2>
            {isOwner ? (
              <input 
                className="text-center font-bold italic text-vox-primary bg-stone-50 rounded-xl w-full border-none outline-none mt-2"
                value={profile.role}
                onChange={(e) => setProfile({...profile, role: e.target.value})}
              />
            ) : <p className="font-bold italic text-vox-primary mt-2">{profile.role}</p>}

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-stone-50 p-4 rounded-2xl"><User size={16} className="mx-auto mb-1 text-stone-400"/><p className="text-xs font-black">{profile.gender}</p></div>
              <div className="bg-stone-50 p-4 rounded-2xl"><Clock size={16} className="mx-auto mb-1 text-stone-400"/><p className="text-xs font-black">{profile.experience}</p></div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-stone-100">
            <h3 className="text-xl font-black flex items-center gap-2 mb-4"><Star className="text-vox-primary" /> النبذة التعريفية</h3>
            {/* النبذة قابلة للتعديل من المعلق فقط */}
            {isOwner ? (
              <textarea 
                className="w-full p-6 bg-stone-50 rounded-[2rem] border-none outline-none font-bold text-stone-700 h-40"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
              />
            ) : <p className="leading-relaxed font-bold text-stone-500">{profile.bio}</p>}
          </div>

          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-stone-100">
            <h3 className="text-xl font-black flex items-center gap-2 mb-6"><Music className="text-vox-primary" /> العينة الصوتية</h3>
            <div className="flex items-center justify-between p-6 bg-stone-50 rounded-[2rem] border border-stone-100">
              <div className="flex items-center gap-4">
                <Button onClick={() => togglePlay(profile.name)} className={`w-14 h-14 rounded-2xl text-white ${playingId ? 'bg-stone-900' : 'bg-vox-primary'}`}>
                  {playingId ? <Pause /> : <Play />}
                </Button>
                <span className="font-black text-lg">استمع للأداء الصوتي</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
