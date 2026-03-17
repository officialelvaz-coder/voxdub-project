import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { 
  UploadCloud, Save, Home, Play, Pause, Trash2, 
  User, Music, Star, CheckCircle2, Clock, FolderKanban, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

const officialArtists = [
  { id: "1", name: "مصطفى جغلال", role: "صوت احترافي ومتزن", gender: "ذكر", experience: "12 سنة", image: "/images/mustapha.jpg", language: "فصحى وإنجليزي", isArchived: false },
  { id: "2", name: "لميس حميمي", role: "صوت ناعم ومقنع", gender: "أنثى", experience: "7 سنوات", image: "/images/lamis.jpg", language: "عربي وفرنسي", isArchived: false },
  { id: "3", name: "بلهادي محمد إسلام", role: "صوت عميق وقوي", gender: "ذكر", experience: "8 سنوات", image: "/images/islam.jpg", language: "عربي فصحى", isArchived: false },
  { id: "4", name: "أحمد حاج إسماعيل", role: "صوت حماسي وشبابي", gender: "ذكر", experience: "6 سنوات", image: "/images/ahmed.jpg", language: "فصحى وعامية", isArchived: false },
  { id: "5", name: "منال إبراهيمي", role: "صوت درامي ومؤثر", gender: "أنثى", experience: "5 سنوات", image: "/images/manal.jpg", language: "عربي فصحى", isArchived: false },
  { id: "6", name: "آدم حمدوني", role: "صوت دافئ وجذاب", gender: "ذكر", experience: "10 سنوات", image: "/images/adam.jpg", language: "عربي فصحى وعامية", isArchived: false }
];

export function ArtistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const themeColor = localStorage.getItem('voxdub_theme') || '#e11d48';

  // 🟢 نظام الصلاحيات
  const userRole = localStorage.getItem('voxdub_user_role') || 'admin';
  const loggedInArtistId = localStorage.getItem('voxdub_logged_in_id') || "1"; // نفترض أنك المعلق المسجل حالياً
  
  // يحق التعديل للمديرة (لميس) على كل الملفات، أو للمعلق على ملفه فقط
  const canEdit = userRole === 'admin' || (userRole === 'artist' && loggedInArtistId === String(id));

  const [profile, setProfile] = useState(() => {
    const savedArtists = localStorage.getItem('voxdub_artists_v2');
    const parsedArtists = savedArtists ? JSON.parse(savedArtists) : [];
    const localArtist = parsedArtists.find((a: any) => String(a.id) === String(id));
    const officialArtist = officialArtists.find(a => String(a.id) === String(id));
    
    const foundData = localArtist || officialArtist || officialArtists[0];
    return { 
      ...foundData, 
      bio: foundData.bio || (id === "1" ? "معلق صوتي محترف، رائد فن الحكي والتعليق الإبداعي." : "مؤدي صوتي متميز في منصة VoxDub.")
    };
  });

  const [samples, setSamples] = useState(() => {
    const saved = localStorage.getItem(`voxdub_samples_${id}`);
    const defaultAudioUrl = "/audio/mustapha.mp3";
    return saved ? JSON.parse(saved) : [
      { id: 1, title: `عينة العرض الرئيسية - ${profile.name}`, url: defaultAudioUrl }
    ];
  });

  const [playingId, setPlayingId] = useState<number | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

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

  const handleSaveProfile = () => {
    const savedArtists = localStorage.getItem('voxdub_artists_v2');
    let artistsArray = savedArtists ? JSON.parse(savedArtists) : [...officialArtists];
    
    const index = artistsArray.findIndex((a: any) => String(a.id) === String(id));
    if (index >= 0) {
      artistsArray[index] = profile;
    } else {
      artistsArray.push(profile);
    }
    
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(artistsArray));
    toast.success("تم حفظ التعديلات بنجاح!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 text-right px-4 text-stone-900" dir="rtl">
      <style>{`.bg-vox-primary { background-color: ${themeColor} !important; } .text-vox-primary { color: ${themeColor} !important; }`}</style>

      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-100 mt-6">
        <Button onClick={() => navigate('/dashboard/artists')} variant="ghost" className="font-black text-stone-400 hover:text-vox-primary"><Home className="ml-2" /> العودة للقائمة</Button>
        
        {/* 🟢 زر الحفظ يظهر فقط للمديرة لميس أو لصاحب الملف */}
        {canEdit && (
          <Button onClick={handleSaveProfile} className="bg-vox-primary text-white rounded-2xl px-10 py-6 font-black border-none shadow-xl hover:opacity-90 transition-all">
            <Save className="ml-2" /> حفظ التغييرات
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-stone-100 text-center relative">
            {/* إشعار حالة الصلاحية */}
            {canEdit && (
              <span className="absolute top-6 right-6 bg-green-100 text-green-700 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck size={14} /> وضع التعديل
              </span>
            )}
            
            <div className="w-40 h-40 mx-auto rounded-[2.5rem] overflow-hidden mb-6 border-4 border-stone-50 shadow-inner mt-4">
               <img src={profile.image || '/images/default.jpg'} className="w-full h-full object-cover" alt="" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-5xl font-black text-stone-300 bg-stone-100">${profile.name?.charAt(0)}</div>`; }} />
            </div>
            
            {/* 🟢 عرض الاسم: حقل إدخال للمديرة/المعلق، ونص ثابت للزائر */}
            {canEdit ? (
              <input 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="text-2xl font-black text-center bg-transparent border-b-2 border-dashed border-stone-200 focus:border-stone-400 outline-none w-full max-w-[200px] mb-2 px-2 py-1 transition-colors block mx-auto"
                placeholder="اسم المعلق"
              />
            ) : (
              <h2 className="text-2xl font-black mb-2">{profile.name}</h2>
            )}
            
            {/* 🟢 عرض الدور: حقل إدخال للمديرة/المعلق، ونص ثابت للزائر */}
            {canEdit ? (
              <input 
                value={profile.role}
                onChange={(e) => setProfile({...profile, role: e.target.value})}
                className="font-bold italic text-center bg-transparent border-b-2 border-dashed border-stone-200 outline-none w-full max-w-[250px] px-2 py-1 transition-colors block mx-auto"
                style={{ color: themeColor, borderBottomColor: `${themeColor}40` }}
                placeholder="الدور أو الصفة"
              />
            ) : (
              <p className="font-bold italic" style={{ color: themeColor }}>{profile.role}</p>
            )}
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
              
              {/* 🟢 عرض النبذة: نص قابل للتعديل لمن يملك الصلاحية، ونص ثابت للقراءة للزائر */}
              {canEdit ? (
                <Textarea 
                  value={profile.bio} 
                  onChange={(e)=>setProfile({...profile, bio: e.target.value})} 
                  className="bg-stone-50 border-none rounded-2xl p-6 font-bold min-h-[120px] outline-none resize-none focus:ring-2 ring-stone-200 transition-all text-stone-700 leading-relaxed" 
                  placeholder="اكتب نبذة عن المعلق هنا..."
                />
              ) : (
                <p className="bg-stone-50 border border-stone-100 rounded-2xl p-6 font-bold min-h-[120px] text-stone-700 leading-relaxed">
                  {profile.bio || "لا توجد نبذة تعريفية مسجلة بعد."}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black flex items-center gap-2"><Music className="text-vox-primary" /> معرض العينات الصوتية</h3>
              
              {/* 🟢 زر رفع العينات يظهر فقط لمن يملك الصلاحية */}
              {canEdit && (
                <>
                  <div className="bg-purple-50 text-purple-700 p-4 rounded-2xl text-sm font-bold border border-purple-100 flex items-center gap-2 mb-2">
                    <UploadCloud size={18} /> يمكنك رفع عينات إضافية لتظهر في هذا الملف
                  </div>
                  <Button onClick={() => document.getElementById('file-up')?.click()} className="bg-vox-primary text-white w-full h-16 rounded-2xl font-black border-none shadow-lg hover:opacity-90 transition-all">
                    <UploadCloud className="ml-2" /> ارفع عينة صوتية جديدة
                  </Button>
                  <input type="file" id="file-up" hidden accept="audio/*" onChange={handleFileUpload} />
                </>
              )}
              
              <div className="space-y-4">
                {samples.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between p-5 bg-stone-50 rounded-[2rem] border border-stone-100">
                    <div className="flex items-center gap-4">
                      <Button onClick={() => togglePlay(s.id, s.url)} className={`w-12 h-12 rounded-2xl text-white transition-all ${playingId === s.id ? 'bg-stone-900' : 'bg-vox-primary'}`}>
                        {playingId === s.id ? <Pause /> : <Play />}
                      </Button>
                      <span className="font-black truncate max-w-[200px] md:max-w-md">{s.title}</span>
                    </div>
                    {/* 🟢 زر الحذف يظهر فقط لمن يملك الصلاحية */}
                    {canEdit && (
                      <button onClick={() => {
                        const updated = samples.filter(x => x.id !== s.id);
                        setSamples(updated);
                        localStorage.setItem(`voxdub_samples_${id}`, JSON.stringify(updated));
                        toast.success("تم حذف العينة");
                      }} className="text-red-400 p-2 hover:bg-red-50 rounded-full transition-all"><Trash2 size={20} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-stone-50" />

            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-black flex items-center gap-2"><Star className="text-yellow-500 fill-yellow-500" /> قالوا عن {profile.name?.split(' ')[0]}</h3>
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
