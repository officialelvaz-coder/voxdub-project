import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic2, Play, Pause, Award, Star, Mic, 
  CheckCircle2, Save, Search, MessageSquare, Headphones, FileCheck, X, Palette 
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { OrderForm } from '../components/OrderForm';
import { Packages } from '../components/Packages';
import { HowItWorks } from '../components/HowItWorks';
import { useAuth } from '../context/AuthContext';

// 1. خريطة العينات الصوتية الافتراضية
const audioMap: Record<number, string> = {
  1: "/audio/mustapha.mp3",
  2: "/audio/lamis.mp3",
  3: "/audio/islam.mp3",
  4: "/audio/ahmed.mp3",
  5: "/audio/manal.mp3",
  6: "/audio/adam.mp3",
};

const initialArtists = [
  { id: 1, name: "مصطفى جغلال", role: "صوت احترافي ومتزن", rating: 4.9, experience: "12 سنة", language: "فصحى وإنجليزي", image: "/images/mustapha.jpg", isNew: false, audio: "" },
  { id: 2, name: "لميس حميمي", role: "صوت ناعم ومقنع", rating: 5.0, experience: "7 سنوات", language: "عربي وفرنسي", image: "/images/lamis.jpg", isNew: false, audio: "" },
  { id: 3, name: "بلهادي محمد إسلام", role: "صوت عميق وقوي", rating: 4.9, experience: "8 سنوات", language: "عربي فصحى", image: "/images/islam.jpg", isNew: false, audio: "" },
  { id: 4, name: "أحمد حاج إسماعيل", role: "صوت حماسي وشبابي", rating: 4.8, experience: "6 سنوات", language: "فصحى وعامية", image: "/images/ahmed.jpg", isNew: false, audio: "" },
  { id: 5, name: "منال إبراهيمي", role: "صوت درامي ومؤثر", rating: 4.9, experience: "5 سنوات", language: "عربي فصحى", image: "/images/manal.jpg", isNew: false, audio: "" },
  { id: 6, name: "آدم حمدوني", role: "صوت دافئ وجذاب", rating: 5.0, experience: "10 سنوات", language: "عربي فصحى وعامية", image: "/images/adam.jpg", isNew: false, audio: "" }
];

// دالة دمج المعلقين المضافين مع الافتراضيين
const getMergedArtists = () => {
  const saved = localStorage.getItem('voxdub_artists_v2');
  const savedArtists = saved ? JSON.parse(saved) : [];
  const combinedMap = new Map();

  initialArtists.forEach(a => combinedMap.set(String(a.id), a));
  savedArtists.forEach((a: any) => {
    const existing = combinedMap.get(String(a.id));
    if (existing) {
      combinedMap.set(String(a.id), { ...existing, ...a });
    } else {
      combinedMap.set(String(a.id), {
        ...a,
        role: a.role || 'معلق صوتي',
        rating: a.rating || 5.0,
        audio: a.audio || `/audio/mustapha.mp3`, // افتراضي إذا لم يوجد
        isNew: true
      });
    }
  });

  return Array.from(combinedMap.values())
    .filter((a: any) => !a.isArchived)
    .sort((a: any, b: any) => Number(a.id) - Number(b.id));
};

export function Landing() {
  const navigate = useNavigate();
  const { userRole, setUserRole, login } = useAuth();

  // 🎨 إدارة اللون (themeColor)
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [allArtists, setAllArtists] = useState(getMergedArtists);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // تحديث اللون في التخزين المحلي فور التغيير
  useEffect(() => {
    localStorage.setItem('voxdub_theme', themeColor);
    window.dispatchEvent(new Event('storage')); // تنبيه باقي الصفحات
  }, [themeColor]);

  useEffect(() => {
    const handleStorageChange = () => setAllArtists(getMergedArtists());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAdminLogin = () => {
    const success = login(loginUser, loginPass);
    if (success) {
      setShowLoginModal(false); navigate('/dashboard');
    } else {
      setLoginError('اسم المستخدم أو كلمة السر غير صحيحة');
    }
  };

  const toggleAudio = (artist: any) => {
    const id = artist.id;
    const audioUrl = artist.audio || audioMap[id] || "/audio/mustapha.mp3";

    if (playingId === id) {
      currentAudio?.pause(); setPlayingId(null);
    } else {
      if (currentAudio) currentAudio.pause();
      const newAudio = new Audio(audioUrl);
      newAudio.play().catch(() => toast.error("العينة غير متوفرة حالياً"));
      setCurrentAudio(newAudio); setPlayingId(id);
      newAudio.onended = () => setPlayingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-right" dir="rtl">
      <style>{`
        *, body { font-family: 'Cairo', sans-serif !important; }
        html { scroll-behavior: smooth; }
        .text-vox-primary { color: ${themeColor} !important; }
        .bg-vox-primary { background-color: ${themeColor} !important; }
        .border-vox-primary { border-color: ${themeColor} !important; }
        .highlight-full { background-color: ${themeColor}; color: white; padding: 8px 25px; border-radius: 12px; display: inline-block; transform: rotate(-1deg); }
      `}</style>

      {/* 🎨 زر تغيير اللون العائم لـ "لميس" فقط */}
      {userRole === 'admin' && (
        <div className="fixed bottom-10 left-10 z-[1000] bg-white p-4 rounded-[2.5rem] shadow-2xl border-4 border-stone-100 flex flex-col items-center gap-2 group hover:scale-110 transition-all">
          <div className="bg-stone-50 p-2 rounded-2xl text-stone-400 group-hover:text-vox-primary">
            <Palette size={24} />
          </div>
          <span className="text-[10px] font-black text-stone-400">ثيم الموقع</span>
          <input 
            type="color" 
            value={themeColor} 
            onChange={(e) => setThemeColor(e.target.value)}
            className="w-12 h-12 rounded-full cursor-pointer border-4 border-white shadow-inner bg-transparent"
          />
        </div>
      )}

      {/* 🔐 مودال الدخول */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowLoginModal(false)}>
          <div className="bg-white rounded-[2rem] p-10 w-full max-w-sm text-center">
            <h2 className="text-2xl font-black mb-6">دخول الإدارة</h2>
            <input className="w-full border-2 p-3 rounded-xl mb-3 text-right outline-none focus:border-vox-primary" type="text" placeholder="اسم المستخدم" value={loginUser} onChange={(e)=>setLoginUser(e.target.value)} />
            <input className="w-full border-2 p-3 rounded-xl mb-4 text-right outline-none focus:border-vox-primary" type="password" placeholder="كلمة السر" value={loginPass} onChange={(e)=>setLoginPass(e.target.value)} />
            {loginError && <p className="text-red-500 text-sm mb-4 font-bold">{loginError}</p>}
            <Button onClick={handleAdminLogin} className="w-full h-14 bg-vox-primary text-white font-black text-lg rounded-xl">دخول</Button>
          </div>
        </div>
      )}

      {/* 🟢 الـ Navbar */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100 h-24 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Mic2 className="text-vox-primary w-8 h-8" />
            <span className="text-3xl font-black italic text-stone-900">Vox<span className="text-vox-primary">Dub</span></span>
          </div>
          <div className="hidden md:flex bg-stone-100 p-1.5 rounded-full border border-stone-200">
            <button onClick={() => userRole === 'admin' ? navigate('/dashboard') : setShowLoginModal(true)} className={`px-6 py-2 rounded-full text-xs font-black transition-all ${userRole === 'admin' ? 'bg-white shadow-md text-vox-primary' : 'text-stone-500'}`}>واجهة الإدارة</button>
            <button onClick={() => { setUserRole('artist'); navigate('/login'); }} className={`px-6 py-2 rounded-full text-xs font-black transition-all ${userRole === 'artist' ? 'bg-white shadow-md text-vox-primary' : 'text-stone-500'}`}>واجهة المعلق</button>
            <button onClick={() => setUserRole('visitor')} className={`px-6 py-2 rounded-full text-xs font-black transition-all ${userRole === 'visitor' ? 'bg-white shadow-md text-stone-900' : 'text-stone-500'}`}>زائر</button>
          </div>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="pt-32 pb-40 px-4 text-center">
        <h1 className="text-7xl font-black text-stone-900 mb-10 leading-tight">اجعل لمشروعك <span className="highlight-full">صوتاً</span> لا يُنسى</h1>
        <p className="text-2xl text-stone-500 max-w-3xl mx-auto mb-20 font-bold italic">نخبة من المعلقين الصوتيين المحترفين بجودة استوديو عالمية.</p>
        <div className="flex justify-center gap-6">
          <a href="#artists" className="bg-stone-900 text-white px-14 py-6 rounded-[2rem] font-black text-2xl shadow-2xl hover:bg-vox-primary transition-all">اكتشف المبدعين</a>
          <a href="#pricing" className="bg-white text-stone-900 border-4 border-stone-100 px-14 py-6 rounded-[2rem] font-black text-2xl hover:border-vox-primary transition-all">باقاتنا</a>
        </div>
      </section>

      {/* 💡 قسم كيف نعمل (النبذة) */}
      <HowItWorks />

      {/* 🎙️ Artists Section */}
      <section id="artists" className="py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-black mb-24 underline decoration-vox-primary decoration-8 underline-offset-8">معلقونا الصوتيون</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-right">
            {allArtists.map((artist) => (
              <div key={artist.id} className="bg-vox-primary rounded-[4rem] p-10 shadow-2xl relative overflow-hidden group transition-all hover:-translate-y-4 text-white">
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <Award size={32} className="opacity-50" />
                  <div className="text-right">
                    <h3 className="text-3xl font-black leading-none">{artist.name}</h3>
                    <p className="font-bold opacity-80 mt-2">{artist.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 mb-10 bg-white/10 p-6 rounded-[3rem] border border-white/20 backdrop-blur-2xl relative z-10 shadow-inner">
                  <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-white/50 shadow-xl bg-stone-200">
                    <img src={artist.image || '/images/default.jpg'} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="text-right text-white/90 text-sm font-bold space-y-1">
                    <p>الخبرة: <span className="text-white">{artist.experience}</span></p>
                    <p>اللغة: <span className="text-white">{artist.language}</span></p>
                  </div>
                </div>
                <div className="space-y-4 relative z-10">
                  <button onClick={() => toggleAudio(artist)} className={`w-full py-5 rounded-[2.5rem] font-black text-2xl transition-all flex justify-center items-center gap-4 ${playingId === artist.id ? "bg-stone-900 text-white" : "bg-white text-vox-primary hover:bg-stone-100"}`}>
                    {playingId === artist.id ? <Pause size={28} /> : <Play fill="currentColor" size={28} />}
                    {playingId === artist.id ? "إيقاف" : "استمع"}
                  </button>
                  <button onClick={() => navigate(`/dashboard/artists/${artist.id}`)} className="w-full py-4 rounded-[1.5rem] font-bold text-white border border-white/30 text-center bg-white/10 hover:bg-white hover:text-vox-primary transition-all">الملف الشخصي</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 💎 قسم الباقات */}
      <Packages />

      {/* 📝 استمارة العميل */}
      <section id="order" className="py-32 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-5xl font-black mb-16 text-center underline decoration-vox-primary decoration-8 underline-offset-8">اطلب خدمتك الآن</h2>
          <div className="bg-white p-8 md:p-12 rounded-[4rem] shadow-2xl border-4 border-stone-100">
            <OrderForm />
          </div>
        </div>
      </section>

      {/* 🏁 Footer */}
      <footer className="bg-stone-900 text-white py-24 text-center rounded-t-[4rem]">
        <div className="text-4xl font-black mb-8 italic">Vox<span className="text-vox-primary">Dub</span></div>
        <p className="text-stone-600 font-bold italic">إدارة وتأسيس: لميس حميمي © 2026 - جميع الحقوق محفوظة لـ VoxDub Studio</p>
      </footer>
    </div>
  );
}
