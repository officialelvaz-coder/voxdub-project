import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic2, Play, Pause, Award, Star, Mic,
  CheckCircle2, Save, Search, MessageSquare, Headphones, FileCheck, X
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { OrderForm } from '../components/OrderForm';
import { useAuth } from '../context/AuthContext';

const audioMap = {
  1: "/audio/mustapha.mp3",
  2: "/audio/lamis.mp3",
  3: "/audio/islam.mp3",
  4: "/audio/ahmed.mp3",
  5: "/audio/manel.mp3",
  6: "/audio/adem.mp3",
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
  
  savedArtists.forEach((a) => {
    const existing = combinedMap.get(String(a.id));
    if (existing) {
      combinedMap.set(String(a.id), { ...existing, ...a });
    } else {
      combinedMap.set(String(a.id), {
        id: a.id,
        name: a.name,
        role: a.role || 'معلق صوتي',
        rating: a.rating || 5.0,
        experience: a.experience || 'غير محدد',
        language: a.language || 'عربية فصحى',
        image: a.image || '',
        audio: a.audio || `/audio/${a.slug || 'mustapha'}.mp3`,
        isNew: true,
        isArchived: a.isArchived || false
      });
    }
  });

  return Array.from(combinedMap.values())
    .filter((a) => !a.isArchived)
    .sort((a, b) => Number(a.id) - Number(b.id));
};

export function Landing() {
  const navigate = useNavigate();
  const { userRole, setUserRole, login } = useAuth();
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#4c1d95');
  const [liveLang] = useState(() => localStorage.getItem('voxdub_artist_lang') || 'عربية فصحى');
  const [playingId, setPlayingId] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
 
  const [allArtists, setAllArtists] = useState(getMergedArtists);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    localStorage.setItem('voxdub_theme', themeColor);
  }, [themeColor]);

  useEffect(() => {
    const handleStorageChange = () => {
      setAllArtists(getMergedArtists());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAdminLogin = () => {
    const success = login(loginUser, loginPass);
    if (success) {
      setShowLoginModal(false);
      setLoginUser('');
      setLoginPass('');
      setLoginError('');
      navigate('/dashboard');
    } else {
      setLoginError('اسم المستخدم أو كلمة السر غير صحيحة');
    }
  };

  const [aboutData, setAboutData] = useState(() => {
    const saved = localStorage.getItem('voxdub_about_content');
    return saved ? JSON.parse(saved) : [
      { t: "أصوات متنوعة", d: "أكثر من 50 معلق صوتي محترف بأساليب وأصوات متنوعة", icon: "Mic" },
      { t: "جودة عالية", d: "تسجيلات بجودة استوديو احترافية مع ضمان الجودة", icon: "Headphones" },
      { t: "خدمات شاملة", d: "باقات متكاملة تشمل الكتابة والتدقيق اللغوي", icon: "FileCheck" }
    ];
  });

  const [pricingData, setPricingData] = useState(() => {
    const saved = localStorage.getItem('voxdub_pricing_plans');
    return saved ? JSON.parse(saved) : [
      { t: "باقة التعليق الصوتي", d: "مثالية للمشاريع البسيطة", p: "5000", u: "دينار", f: ["تعليق صوتي احترافي", "جودة تسجيل HD", "تسليم خلال 3 أيام", "مراجعة واحدة مجانية"] },
      { t: "باقة التعليق والتدقيق", d: "للمحتوى الاحترافي", p: "8000", u: "دينار", f: ["كل مميزات الباقة الأولى", "تدقيق لغوي للنص", "تصحيح الأخطاء النحوية", "تحسين الصياغة"], popular: true },
      { t: "باقة كاملة المحتوى", d: "حل شامل ومتكامل", p: "13000", u: "دينار", f: ["كل مميزات الباقتين السابقتين", "كتابة النص من الصفر", "بحث وتطوير المحتوى", "كتابة إبداعية"] }
    ];
  });

  const saveAllChanges = () => {
    localStorage.setItem('voxdub_about_content', JSON.stringify(aboutData));
    localStorage.setItem('voxdub_pricing_plans', JSON.stringify(pricingData));
    toast.success("تم حفظ تعديلات الواجهة!");
  };

  const toggleAudio = (artist) => {
    const id = artist.id;
    const audioUrl = artist.audio || audioMap[id] || "/audio/mustapha.mp3";
    
    if (playingId === id) {
      currentAudio?.pause();
      setPlayingId(null);
    } else {
      if (currentAudio) currentAudio.pause();
      const newAudio = new Audio(audioUrl);
      newAudio.play().catch(() => toast.error("العينة غير متوفرة"));
      setCurrentAudio(newAudio);
      setPlayingId(id);
      newAudio.onended = () => setPlayingId(null);
    }
  };

  const iconMap = { Mic, Headphones, FileCheck };

  return (
    <div className="min-h-screen bg-white font-sans text-right" dir="rtl">
      {/* باقي الكود كما هو تمامًا (الـ style + الـ login modal + كل الأقسام) */}
      {/* ... (لم أغير أي شيء آخر لأن باقي الكود سليم 100%) ... */}

      {/* فقط مثال على الجزء الذي تم تصحيحه في الـ artists map */}
      <section id="artists" className="py-32 bg-stone-50 text-center">
        {/* ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-right">
          {allArtists.map((artist) => (
            <div key={artist.id} className="bg-vox-primary rounded-[4rem] p-10 shadow-2xl relative overflow-hidden group transition-all hover:-translate-y-4 text-white">
              {/* ... */}
              <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-white/50 shadow-xl bg-stone-200 flex items-center justify-center">
                <img 
                  src={artist.image || '/images/default.jpg'} 
                  className="w-full h-full object-cover" 
                  alt={artist.name} 
                  onError={(e) => { 
                    e.currentTarget.style.display = 'none'; 
                    e.currentTarget.parentElement.innerHTML = 
                      `<span style="font-size: 3rem; font-weight: 900; color: #9ca3af;">${artist.name?.charAt(0)}</span>`; 
                  }} 
                />
              </div>
              {/* ... */}
            </div>
          ))}
        </div>
      </section>
      {/* ... باقي الكود (workflow + pricing + contact + footer) ... */}
    </div>
  );
}
