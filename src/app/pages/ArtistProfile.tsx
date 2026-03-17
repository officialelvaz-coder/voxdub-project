import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { 
  Mic, UploadCloud, Save, Home, Play, Pause, Trash2, Edit3, 
  User, Camera, Music, Star, CheckCircle2, Clock, FolderKanban 
} from 'lucide-react';
import { toast } from 'sonner';

const officialArtists = [
  { id: "1", name: "مصطفى جغلال", role: "صوت احترافي ومتزن", gender: "ذكر", experience: "12 سنة", image: "/images/mustapha.jpg", lang: "فصحى وإنجليزي" },
  { id: "2", name: "لميس حميمي", role: "صوت ناعم ومقنع", gender: "أنثى", experience: "7 سنوات", image: "/images/lamis.jpg", lang: "عربي وفرنسي" },
  { id: "3", name: "بلهادي محمد إسلام", role: "صوت عميق وقوي", gender: "ذكر", experience: "8 سنوات", image: "/images/islam.jpg", lang: "عربي فصحى" },
  { id: "4", name: "أحمد حاج إسماعيل", role: "صوت حماسي وشبابي", gender: "ذكر", experience: "6 سنوات", image: "/images/ahmed.jpg", lang: "فصحى وعامية" },
  { id: "5", name: "منال إبراهيمي", role: "صوت درامي ومؤثر", gender: "أنثى", experience: "5 سنوات", image: "/images/manal.jpg", lang: "عربي فصحى" },
  { id: "6", name: "آدم حمدوني", role: "صوت دافئ وجذاب", gender: "ذكر", experience: "10 سنوات", image: "/images/adam.jpg", lang: "عربي فصحى وعامية" }
];

export function ArtistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const themeColor = localStorage.getItem('voxdub_theme') || '#e11d48';
  const artistData = officialArtists.find(a => a.id === String(id)) || officialArtists[0];

  const [profile, setProfile] = useState({ ...artistData, bio: "" });
  const [language, setLanguage] = useState(artistData.lang);
  
  // 🟢 تعديل كلود: توحيد العينة الافتراضية للجميع بدون شروط
  const [samples, setSamples] = useState(() => {
    const saved = localStorage.getItem(`voxdub_samples_${id}`);
    const audioMap: Record<string, string> = {
  "1": "/audio/mustapha.mp3",
  "2": "/audio/lamis.mp3",
  "3": "/audio/islam.mp3",
  "4": "/audio/ahmed.mp3",
  "5": "/audio/manel.mp3",
  "6": "/audio/adem.mp3",
};
const defaultAudioUrl = audioMap[String(id)] || "/audio/mustapha.mp3";
    
    return saved ? JSON.parse(saved) : [
      { id: 1, title: `عينة العرض الرئيسية - ${artistData.name}`, url: defaultAudioUrl }
    ];
  });

  const [playingId, setPlayingId] = useState<number | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const active = officialArtists.find(a => a.id === String(id)) || officialArtists[0];
    setProfile({
      ...active,
      bio: id === "1" ? (localStorage.getItem('voxdub_artist_bio') || "معلق صوتي محترف، رائد فن الحكي والتعليق الإبداعي. أقدم لك صوتاً لا يُنسى لمشروعك.") : `مؤدي صوتي متميز في منصة VoxDub.`
    });
    setLanguage(id === "1" ? (localStorage.getItem('voxdub_artist_lang') || active.lang) : active.lang);
  }, [id]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Audio = event.target?.result as string;
        const newSample = { id: Date.now(), title: file.name.split('.')[0], url: base64Audio };
        const updated = [newSample, ...samples];
        setSamples(updated);
        localStorage.setItem(`voxdub_samples_${id}`, JSON.stringify(updated));
        if (id === "1") localStorage.setItem('voxdub_custom_audio_1', base64Audio);
        toast.success("تم حفظ العينة بنجاح");
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePlay = (sid: number, url: string) => {
    if (playingId === sid) { audioInstance?.pause(); setPlayingId(null); }
    else {
      if (audioInstance) audioInstance.pause();
      const audio = new Audio(url);
      audio.play().catch(() => toast.error("عذراً، العينة غير متوفرة حالياً"));
      setAudioInstance(audio); setPlayingId(sid);
      audio.onended = () => setPlayingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 text-right px-4 text-stone-900" dir="rtl">
      <style>{`.bg-vox-primary { background-color: ${themeColor} !important; } .text-vox-primary { color: ${themeColor} !important; }`}</style>

      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-100 mt-6">
        <Button onClick={() => navigate('/')} variant="ghost" className="font-black text-stone-400 hover:text-vox-primary"><Home className="ml-2" /> الرئيسية</Button>
        <Button onClick={() => {
          if(id === "1") {
            localStorage.setItem('voxdub_artist_lang', language);
            localStorage.setItem('voxdub_artist_bio', profile.bio);
          }
          toast.success("تم الحفظ");
        }} className="bg-vox-primary text-white rounded-2xl px-10 py-6 font-black border-none shadow-xl"><Save className="ml-2" /> حفظ التغييرات</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-stone-100 text-center">
            <img src={profile.image} className="w-40 h-40 mx-auto rounded-[2.5rem] object-cover mb-4" alt="" />
            <h2 className="text-2xl font-black">{profile.name}</h2>
            <p className="text-vox-primary font-bold italic">{profile.role}</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
             {[
               { label: "مشاريع جديدة", count: id === "1" ? 5 : 2, icon: FolderKanban, color: "#0ea5e9" },
               { label: "قيد الإنجاز", count: id === "1" ? 3 : 1, icon: Clock, color: "#f59e0b" },
               { label: "مشاريع مكتملة", count: id === "1" ? 124 : 45, icon: CheckCircle2, color: "#10b981" }
             ].map((item, i) => (
               <div key={i} className="bg-white p-6 rounded-[2rem] border border-stone-100 flex items-center justify-between shadow-sm">
                 <div className="flex items-center gap-4">
                   <div className="p-3 rounded-2xl text-white" style={{backgroundColor: item.color}}><item.icon size={20}/></div>
                   <span className="font-black">{item.label}</span>
                 </div>
                 <span className="text-2xl font-black">{item.count}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-stone-100 space-y-8">
            <div className="space-y-3">
              <h3 className="text-lg font-black flex items-center gap-2"><User className="text-vox-primary" /> النبذة التعريفية</h3>
              <Textarea value={profile.bio} onChange={(e)=>setProfile({...profile, bio: e.target.value})} className="bg-stone-50 border-none rounded-2xl p-6 font-bold min-h-[120px] outline-none" />
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black flex items-center gap-2"><Music className="text-vox-primary" /> معرض العينات الصوتية</h3>
              
              <div className="bg-orange-50 text-orange-600 p-4 rounded-2xl text-sm font-bold border border-orange-100 flex items-center gap-2 mb-2">
                <UploadCloud size={18} /> يمكنك رفع عينات إضافية لتظهر في ملفك الشخصي فقط
              </div>
              
              <Button onClick={() => document.getElementById('file-up')?.click()} className="bg-vox-primary text-white w-full h-16 rounded-2xl font-black border-none shadow-lg">
                <UploadCloud className="ml-2" /> ارفع عينة صوتية جديدة (للملف الشخصي)
              </Button>
              <input type="file" id="file-up" hidden accept="audio/*" onChange={handleFileUpload} />
              
              <div className="space-y-4">
                {samples.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between p-5 bg-stone-50 rounded-[2rem] border border-stone-100">
                    <div className="flex items-center gap-4">
                      <Button onClick={() => togglePlay(s.id, s.url)} className={`w-12 h-12 rounded-2xl text-white ${playingId === s.id ? 'bg-stone-900' : 'bg-vox-primary'}`}>
                        {playingId === s.id ? <Pause /> : <Play />}
                      </Button>
                      <span className="font-black">{s.title}</span>
                    </div>
                    <button onClick={() => {
                      const updated = samples.filter(x => x.id !== s.id);
                      setSamples(updated);
                      localStorage.setItem(`voxdub_samples_${id}`, JSON.stringify(updated));
                      toast.success("تم حذف العينة محلياً");
                    }} className="text-red-400 p-2 hover:bg-red-50 rounded-full transition-all"><Trash2 size={20} /></button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-stone-50" />

            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-black flex items-center gap-2"><Star className="text-yellow-500 fill-yellow-500" /> قالوا عن {profile.name.split(' ')[0]}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{ name: "أحمد منصور", text: "أداء صوتي مذهل واحترافية عالية.", r: 5 }, { name: "سارة خالد", text: "صوت رخيم جداً، أضاف لمسة إبداعية.", r: 5 }].map((rev, i) => (
                  <div key={i} className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100">
                    <div className="flex gap-1 mb-2">{[...Array(rev.r)].map((_, j) => <Star key={j} size={14} className="fill-yellow-500 text-yellow-500" />)}</div>
                    <p className="text-stone-600 font-bold text-sm italic mb-2">"{rev.text}"</p>
                    <span className="font-black text-xs">— {rev.name}</span>
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
              
