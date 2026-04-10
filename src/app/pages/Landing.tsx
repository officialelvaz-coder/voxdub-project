import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic2, Play, Pause, Award, Star, Mic, 
  CheckCircle2, Save, Search, MessageSquare, Headphones, FileCheck, X, Palette, Menu 
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
        audio: a.audio || `/audio/mustapha.mp3`,
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

  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [allArtists, setAllArtists] = useState(getMergedArtists);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // حالة القائمة المنسدلة للهاتف
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('voxdub_theme', themeColor);
    window.dispatchEvent(new Event('storage'));
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
        .highlight-full { background-color: ${themeColor}; color: white; padding: 4px 15px; border-radius: 12px; display: inline-block; transform: rotate(-1deg); }
        @media (min-width: 768px) { .highlight-full { padding: 8px 25px; } }
      `}</style>

      {userRole === 'admin' && (
        <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[1000] bg-white p-3 md:p-4 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border-4 border-stone-100 flex flex-col items-center gap-2 group hover:scale-110 transition-all">
          <div className="bg-stone-50 p-2 rounded-xl text-stone-400 group-hover:text-vox-primary">
            <Palette size={20} className="md:w-6 md:h-6" />
          </div>
          <input 
            type="color" 
            value={themeColor} 
            onChange={(e) => setThemeColor(e.target.value)}
            className="w-8 h-8 md:w-12 md:h-12 rounded-full cursor-pointer border-2 md:border-4 border-white shadow-inner bg-transparent"
          />
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowLoginModal(false)}>
          <div className="bg-white rounded-[2rem] p-8 md:p-10 w-full max-w-sm text-center">
            <h2 className="text-xl md:text-2xl font-black mb-6">دخول الإدارة</h2>
            <input className="w-full border-2 p-3 rounded-xl mb-3 text-right outline-none focus:border-vox-primary" type="text" placeholder="اسم المستخدم" value={loginUser} onChange={(e)=>setLoginUser(e.target.value)} />
            <input className="w-full border-2 p-3 rounded-xl mb-4 text-right outline-none focus:border-vox-primary" type="password" placeholder="كلمة السر" value={loginPass} onChange={(e)=>setLoginPass(e.target.value)} />
            {loginError && <p className="text-red-500 text-sm mb-4 font-bold">{loginError}</p>}
            <Button onClick={handleAdminLogin} className="w-full h-12 md:h-14 bg-vox-primary text-white font-black text-lg rounded-xl">دخول</Button>
          </div>
        </div>
      )}

      {/* 🟢 الـ Navbar */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100 h-20 md:h-24 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <Mic2 className="text-vox-primary w-6 h-6 md:w-8 md:h-8" />
            <span className="text-2xl md:text-3xl font-black italic text-stone-900">Vox<span className="text-vox-primary">Dub</span></span>
          </div>
          
          {/* زر القائمة للهاتف */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-stone-600 focus:outline-none">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* أزرار الكمبيوتر */}
          <div className="hidden md:flex bg-stone-100 p-1.5 rounded-full border border-stone-200">
            <button onClick={() => userRole === 'admin' ? navigate('/dashboard') : setShowLoginModal(true)} className={`px-6 py-2 rounded-full text-xs font-black transition-all ${userRole === 'admin' ? 'bg-white shadow-md text-vox-primary' : 'text-stone-500'}`}>واجهة الإدارة</button>
            <button onClick={() => { setUserRole('artist'); navigate('/login'); }} className={`px-6 py-2 rounded-full text-xs font-black transition-all ${userRole === 'artist' ? 'bg-white shadow-md text-vox-primary' : 'text-stone-500'}`}>واجهة المعلق</button>
            <button onClick={() => setUserRole('visitor')} className={`px-6 py-2 rounded-full text-xs font-black transition-all ${userRole === 'visitor' ? 'bg-white shadow-md text-stone-900' : 'text-stone-500'}`}>زائر</button>
          </div>
        </div>

        {/* قائمة الهاتف المنسدلة */}
        {isMobileMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-white border-b border-stone-100 p-4 flex flex-col gap-2 shadow-xl md:hidden">
            <button onClick={() => { userRole === 'admin' ? navigate('/dashboard') : setShowLoginModal(true); setIsMobileMenuOpen(false); }} className={`w-full py-3 rounded-xl font-bold ${userRole === 'admin' ? 'bg-vox-primary/10 text-vox-primary' : 'bg-stone-50 text-stone-700'}`}>واجهة الإدارة</button>
            <button onClick={() => { setUserRole('artist'); navigate('/login'); setIsMobileMenuOpen(false); }} className={`w-full py-3 rounded-xl font-bold ${userRole === 'artist' ? 'bg-vox-primary/10 text-vox-primary' : 'bg-stone-50 text-stone-700'}`}>واجهة المعلق</button>
            <button onClick={() => { setUserRole('visitor'); setIsMobileMenuOpen(false); }} className={`w-full py-3 rounded-xl font-bold ${userRole === 'visitor' ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-700'}`}>زائر</button>
          </div>
        )}
      </nav>

      {/* 🚀 Hero Section */}
      <section className="pt-20 pb-24 md:pt-32 md:pb-40 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-stone-900 mb-6 md:mb-10 leading-tight">اجعل لمشروعك <span className="highlight-full">صوتاً</span> لا يُنسى</h1>
        <p className="text-lg md:text-2xl text-stone-500 max-w-3xl mx-auto mb-10 md:mb-20 font-bold italic px-2">نخبة من المعلقين الصوتيين المحترفين بجودة استوديو عالمية.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-4">
          <a href="#artists" className="bg-stone-900 text-white px-8 py-4 md:px-14 md:py-6 rounded-full md:rounded-[2rem] font-black text-lg md:text-2xl shadow-2xl hover:bg-vox-primary transition-all">اكتشف المبدعين</a>
          <a href="#pricing" className="bg-white text-stone-900 border-4 border-stone-100 px-8 py-4 md:px-14 md:py-6 rounded-full md:rounded-[2rem] font-black text-lg md:text-2xl hover:border-vox-primary transition-all">باقاتنا</a>
        </div>
      </section>

      {/* 💡 قسم كيف نعمل (النبذة) */}
      <HowItWorks />

      {/* 🎙️ Artists Section */}
      <section id="artists" className="py-20 md:py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-16 md:mb-24 underline decoration-vox-primary decoration-4 md:decoration-8 underline-offset-8">معلقونا الصوتيون</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 text-right">
            {allArtists.map((artist) => (
              <div key={artist.id} className="bg-vox-primary rounded-[3rem] md:rounded-[4rem] p-6 md:p-10 shadow-2xl relative overflow-hidden group transition-all md:hover:-translate-y-4 text-white">
                <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                  <Award size={28} className="opacity-50 md:w-8 md:h-8" />
                  <div className="text-right">
                    <h3 className="text-2xl md:text-3xl font-black leading-none">{artist.name}</h3>
                    <p className="font-bold opacity-80 mt-2 text-sm md:text-base">{artist.role}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-8 mb-8 md:mb-10 bg-white/10 p-4 md:p-6 rounded-[2rem] md:rounded-[3rem] border border-white/20 backdrop-blur-2xl relative z-10 shadow-inner">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full md:rounded-[2rem] overflow-hidden border-4 border-white/50 shadow-xl bg-stone-200 shrink-0">
                    <img src={artist.image || '/images/default.jpg'} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="text-center sm:text-right text-white/90 text-sm font-bold space-y-1 w-full sm:mt-4">
                    <p>الخبرة: <span className="text-white">{artist.experience}</span></p>
                    <p>اللغة: <span className="text-white">{artist.language}</span></p>
                  </div>
                </div>
                <div className="space-y-3 md:space-y-4 relative z-10">
                  <button onClick={() => toggleAudio(artist)} className={`w-full py-4 md:py-5 rounded-full md:rounded-[2.5rem] font-black text-xl md:text-2xl transition-all flex justify-center items-center gap-3 md:gap-4 ${playingId === artist.id ? "bg-stone-900 text-white" : "bg-white text-vox-primary hover:bg-stone-100"}`}>
                    {playingId === artist.id ? <Pause size={24} /> : <Play fill="currentColor" size={24} />}
                    {playingId === artist.id ? "إيقاف" : "استمع"}
                  </button>
                  <button onClick={() => navigate(`/dashboard/artists/${artist.id}`)} className="w-full py-3 md:py-4 rounded-full md:rounded-[1.5rem] font-bold text-white border border-white/30 text-center bg-white/10 hover:bg-white hover:text-vox-primary transition-all text-sm md:text-base">الملف الشخصي</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 💎 قسم الباقات */}
      <Packages />

      {/* 📝 استمارة العميل */}
      <OrderForm />

      {/* 🏁 Footer */}
      <footer className="bg-stone-900 text-white py-12 md:py-24 text-center rounded-t-[3rem] md:rounded-t-[4rem] px-4">
        <div className="text-3xl md:text-4xl font-black mb-6 md:mb-8 italic">Vox<span className="text-vox-primary">Dub</span></div>
        <p className="text-stone-500 font-bold italic text-sm md:text-base">إدارة وتأسيس: لميس حميمي © 2026 - جميع الحقوق محفوظة لـ VoxDub Studio</p>
      </footer>
    </div>
  );
}
