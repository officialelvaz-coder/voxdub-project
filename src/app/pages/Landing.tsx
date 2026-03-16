import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic2, Play, Pause, Award, Star, Mic, 
  LogIn, CheckCircle2, LayoutDashboard, Info, Zap, Crown, Rocket, Save, 
  Search, MessageSquare, Headphones, FileCheck, X
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '../components/ui/button';
import { OrderForm } from '../components/OrderForm';

const AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const initialArtists = [
  { id: 1, name: "مصطفى جغلال", role: "صوت احترافي ومتزن", rating: 4.9, experience: "12 سنة", language: "فصحى وإنجليزي", image: "/images/mustapha.jpg" },
  { id: 2, name: "لميس حميمي", role: "صوت ناعم ومقنع", rating: 5.0, experience: "7 سنوات", language: "عربي وفرنسي", image: "/images/lamis.jpg" },
  { id: 3, name: "بلهادي محمد إسلام", role: "صوت عميق وقوي", rating: 4.9, experience: "8 سنوات", language: "عربي فصحى", image: "/images/islam.jpg" },
  { id: 4, name: "أحمد حاج إسماعيل", role: "صوت حماسي وشبابي", rating: 4.8, experience: "6 سنوات", language: "فصحى وعامية", image: "/images/ahmed.jpg" },
  { id: 5, name: "منال إبراهيمي", role: "صوت درامي ومؤثر", rating: 4.9, experience: "5 سنوات", language: "عربي فصحى", image: "/images/manal.jpg" },
  { id: 6, name: "آدم حمدوني", role: "صوت دافئ وجذاب", rating: 5.0, experience: "10 سنوات", language: "عربي فصحى وعامية", image: "/images/adam.jpg" }
];

export function Landing() {
  const navigate = useNavigate();

  // ✅ التعديل 3: الافتراضي = visitor
  const [userRole, setUserRole] = useState<'admin' | 'artist' | 'visitor'>('visitor');
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#4c1d95');
  const [liveLang, setLiveLang] = useState(() => localStorage.getItem('voxdub_artist_lang') || 'عربية فصحى');
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // ✅ التعديل 4: حالة نافذة تسجيل الدخول
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleAdminLogin = () => {
    if (loginUser === 'admin2026' && loginPass === 'admin2026') {
      setUserRole('admin');
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

  useEffect(() => {
    localStorage.setItem('voxdub_theme', themeColor);
  }, [themeColor]);

  // ✅ التعديل 2: كل العينات من نفس ملف مصطفى
  const toggleAudio = (id: number) => {
    const savedSamples = localStorage.getItem(`voxdub_samples_${id}`);
    let audioToPlay = AUDIO_URL;
    if (savedSamples) {
      const samplesArray = JSON.parse(savedSamples);
      if (samplesArray.length > 0) audioToPlay = samplesArray[0].url;
    }
    if (playingId === id) {
      currentAudio?.pause();
      setPlayingId(null);
    } else {
      if (currentAudio) currentAudio.pause();
      const newAudio = new Audio(audioToPlay);
      newAudio.play().catch(() => toast.error("العينة غير متوفرة"));
      setCurrentAudio(newAudio);
      setPlayingId(id);
      newAudio.onended = () => setPlayingId(null);
    }
  };

  const iconMap: any = { Mic: Mic, Headphones: Headphones, FileCheck: FileCheck };

  return (
    <div className="min-h-screen bg-white font-sans text-right" dir="rtl">
      {/* ✅ التعديل 1: خط Cairo على كل شيء */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        *, *::before, *::after, body, input, textarea, button, select {
          font-family: 'Cairo', sans-serif !important;
        }
        html { scroll-behavior: smooth; }
        .text-vox-primary { color: ${themeColor} !important; }
        .bg-vox-primary { background-color: ${themeColor} !important; }
        .border-vox-primary { border-color: ${themeColor} !important; }
        .highlight-full { background-color: ${themeColor}; color: white; padding: 8px 25px; border-radius: 12px; display: inline-block; transform: rotate(-1deg); }
        .editable-input { background: transparent; border: 1px dashed white; color: white; padding: 4px; border-radius: 8px; width: 100%; text-align: center; font-family: 'Cairo', sans-serif !important; }
        .pricing-input { border: 1px dashed ${themeColor}44; color: black; font-family: 'Cairo', sans-serif !important; }
        .about-icon-bg { background-color: ${themeColor}22; }

        /* ✅ نافذة تسجيل الدخول */
        .login-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; }
        .login-box { background: white; border-radius: 2rem; padding: 2.5rem; width: 90%; max-width: 400px; text-align: center; direction: rtl; }
        .login-input { width: 100%; border: 2px solid #e5e7eb; border-radius: 1rem; padding: 12px 16px; font-size: 16px; margin-bottom: 12px; text-align: right; font-family: 'Cairo', sans-serif !important; outline: none; }
        .login-input:focus { border-color: ${themeColor}; }
        .login-btn { width: 100%; background: ${themeColor}; color: white; border: none; border-radius: 1rem; padding: 14px; font-size: 18px; font-weight: 900; cursor: pointer; font-family: 'Cairo', sans-serif !important; }
        .login-btn:hover { opacity: 0.9; }
        .login-error { color: #dc2626; font-size: 14px; margin-bottom: 10px; font-weight: 700; }
      `}</style>

      {/* ✅ التعديل 4: نافذة تسجيل الدخول */}
      {showLoginModal && (
        <div className="login-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setShowLoginModal(false); setLoginError(''); } }}>
          <div className="login-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <button onClick={() => { setShowLoginModal(false); setLoginError(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} color="#9ca3af" />
              </button>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>
                  Vox<span style={{ color: themeColor }}>Dub</span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: 700 }}>دخول لوحة الإدارة</p>
              </div>
            </div>
            <input
              className="login-input"
              type="text"
              placeholder="اسم المستخدم"
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <input
              className="login-input"
              type="password"
              placeholder="كلمة السر"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            {loginError && <p className="login-error">{loginError}</p>}
            <button className="login-btn" onClick={handleAdminLogin}>دخول</button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100 h-24 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Mic2 className="text-vox-primary w-8 h-8" />
            <span className="text-3xl font-black italic text-stone-900">Vox<span className="text-vox-primary">Dub</span></span>
          </div>
          <div className="flex items-center gap-4">
            {userRole === 'admin' && (
              <Button onClick={saveAllChanges} className="bg-green-600 text-white gap-2 rounded-full font-black px-6 shadow-lg border-none hover:bg-green-700">
                <Save size={18} /> حفظ التعديلات
              </Button>
            )}
            <div className="hidden md:flex bg-stone-100 p-1.5 rounded-full border border-stone-200">
              {/* ✅ التعديل 4: زر لميس يفتح نافذة تسجيل الدخول */}
              <button
                onClick={() => {
                  if (userRole === 'admin') {
                    navigate('/dashboard');
                  } else {
                    setShowLoginModal(true);
                  }
                }}
                className={`px-6 py-2 rounded-full text-xs font-black transition-all ${userRole === 'admin' ? 'bg-white shadow-md text-vox-primary' : 'text-stone-500'}`}
              >
                واجهة لميس
              </button>
              <button
                onClick={() => { setUserRole('artist'); navigate('/login'); }}
                className={`px-6 py-2 rounded-full text-xs font-black transition-all ${userRole === 'artist' ? 'bg-white shadow-md text-vox-primary' : 'text-stone-500'}`}
              >
                واجهة المعلق
              </button>
              <button
                onClick={() => setUserRole('visitor')}
                className={`px-6 py-2 rounded-full text-xs font-black transition-all ${userRole === 'visitor' ? 'bg-white shadow-md text-stone-900' : 'text-stone-500'}`}
              >
                زائر
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-40 px-4 text-center">
        <h1 className="text-7xl md:text-7xl font-black text-stone-900 mb-10 leading-tight">اجعل لمشروعك <span className="highlight-full">صوتاً</span> لا يُنسى</h1>
        <p className="text-2xl md:text-3xl text-stone-500 max-w-3xl mx-auto mb-20 font-bold leading-relaxed italic">نخبة من المعلقين الصوتيين المحترفين بجودة استوديو عالمية.</p>
        <div className="flex justify-center gap-6">
          <a href="#artists" className="bg-stone-900 text-white px-14 py-6 rounded-[2rem] font-black text-2xl shadow-2xl hover:bg-vox-primary transition-all">اكتشف المبدعين</a>
          <a href="#pricing" className="bg-white text-stone-900 border-4 border-stone-100 px-14 py-6 rounded-[2rem] font-black text-2xl hover:border-vox-primary transition-all">باقاتنا</a>
        </div>
      </section>

      {/* Why VoxDub */}
      <section id="about" className="py-32 bg-stone-900 text-white rounded-[4rem] mx-4 overflow-hidden text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-black mb-16 italic text-white">لماذا VoxDub؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
            {aboutData.map((item: any, i: number) => {
              const IconComponent = iconMap[item.icon] || Mic;
              return (
                <div key={i} className="bg-white/5 p-10 rounded-[3rem] border border-white/10 text-center">
                  {userRole === 'admin' ? (
                    <div className="space-y-4">
                      <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: themeColor + '33' }}>
                        <IconComponent size={52} style={{ color: themeColor }} />
                      </div>
                      <input value={item.t} onChange={(e) => { const nd = [...aboutData]; nd[i].t = e.target.value; setAboutData(nd); }} className="editable-input text-2xl font-black" />
                      <textarea value={item.d} onChange={(e) => { const nd = [...aboutData]; nd[i].d = e.target.value; setAboutData(nd); }} className="editable-input text-stone-400 font-bold h-24 resize-none text-lg" />
                    </div>
                  ) : (
                    <>
                      <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8" style={{ backgroundColor: themeColor + '33' }}>
                        <IconComponent size={52} style={{ color: themeColor }} />
                      </div>
                      <h3 className="text-3xl font-black mb-4 text-white">{item.t}</h3>
                      <p className="text-stone-300 font-bold leading-relaxed text-xl">{item.d}</p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Artists Section */}
      <section id="artists" className="py-32 bg-stone-50 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-black text-stone-900 mb-4">معلقونا الصوتيون</h2>
          <p className="text-xl text-stone-500 font-bold mb-24">اختر الصوت المثالي لمشروعك من بين نخبة من المعلقين المحترفين</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-right">
            {initialArtists.map((artist) => (
              <div key={artist.id} className="bg-vox-primary rounded-[4rem] p-10 shadow-2xl relative overflow-hidden group transition-all hover:-translate-y-4 text-white">
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <Award size={32} className="opacity-50" />
                  <div>
                    <h3 className="text-3xl font-black leading-none">{artist.name}</h3>
                    <p className="font-bold opacity-80 mt-2">{artist.role}</p>
                    <div className="flex items-center justify-end gap-1 mt-3">
                      <span className="text-xl font-black">{artist.rating}</span>
                      <Star size={18} className="fill-white text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8 mb-10 bg-white/10 p-6 rounded-[3rem] border border-white/20 backdrop-blur-2xl relative z-10 shadow-inner">
                  <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-white/50 shadow-xl bg-stone-200">
                    <img src={artist.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="text-right text-white/90 text-sm font-bold space-y-1">
                    <p>الخبرة: <span className="text-white">{artist.experience}</span></p>
                    <p>اللغة: <span className="text-white">{artist.id === 1 ? liveLang : artist.language}</span></p>
                  </div>
                </div>
                <div className="space-y-4 relative z-10">
                  {/* ✅ التعديل 2: toggleAudio بدون defaultUrl */}
                  <button
                    onClick={() => toggleAudio(artist.id)}
                    className={`w-full py-5 rounded-[2.5rem] font-black text-2xl transition-all flex justify-center items-center gap-4 ${playingId === artist.id ? "bg-stone-900 text-white" : "bg-white text-vox-primary hover:bg-stone-100"}`}
                  >
                    {playingId === artist.id ? <Pause size={28} /> : <Play fill="currentColor" size={28} />}
                    {playingId === artist.id ? "إيقاف" : "استمع"}
                  </button>
                  <a href={`/dashboard/artists/${artist.id}`} className="w-full py-4 rounded-[1.5rem] font-bold text-white border border-white/30 text-center block bg-white/10 hover:bg-white hover:text-vox-primary transition-all">
                    الملف الشخصي
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="py-32 bg-white text-center text-stone-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-black mb-24 italic text-stone-900">كيف <span className="text-vox-primary">نعمل؟</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Search, t: "1. اكتشف", d: "اختر الصوت المناسب لمشروعك." },
              { icon: MessageSquare, t: "2. تواصل", d: "أرسل تفاصيل مشروعك والنص." },
              { icon: Headphones, t: "3. تنفيذ", d: "نسجل العمل بأحدث التقنيات." },
              { icon: FileCheck, t: "4. استلام", d: "استلم ملفك بجودة احترافية." }
            ].map((step, i) => (
              <div key={i} className="bg-stone-50 p-8 rounded-[3rem] border border-stone-100 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-vox-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:rotate-12 transition-transform">
                  <step.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-black mb-4">{step.t}</h3>
                <p className="text-stone-500 font-bold text-sm leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 bg-stone-50 text-center text-stone-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-black mb-24 underline decoration-vox-primary decoration-8 underline-offset-8">باقاتنا الإبداعية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
            {pricingData.map((plan: any, i: number) => (
              <div key={i} className={`p-10 rounded-[4rem] border-4 transition-all ${plan.popular ? 'border-vox-primary bg-white scale-105 shadow-2xl relative' : 'border-stone-100 bg-white/50'}`}>
                {plan.popular && <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-vox-primary text-white px-8 py-2 rounded-full font-black">الأكثر طلباً</div>}
                {userRole === 'admin' ? (
                  <div className="space-y-3">
                    <input value={plan.t} onChange={(e) => { const nd = [...pricingData]; nd[i].t = e.target.value; setPricingData(nd); }} className="editable-input pricing-input text-2xl font-black text-stone-900" />
                    <input value={plan.d} onChange={(e) => { const nd = [...pricingData]; nd[i].d = e.target.value; setPricingData(nd); }} className="editable-input pricing-input text-sm font-bold text-stone-400" />
                    <div className="flex items-center justify-center gap-2 py-4">
                      <input value={plan.p} onChange={(e) => { const nd = [...pricingData]; nd[i].p = e.target.value; setPricingData(nd); }} className="editable-input pricing-input text-4xl font-black text-vox-primary w-24" />
                      <input value={plan.u} onChange={(e) => { const nd = [...pricingData]; nd[i].u = e.target.value; setPricingData(nd); }} className="editable-input pricing-input text-xs font-black text-stone-400 w-24" />
                    </div>
                    <textarea value={plan.f.join('\n')} onChange={(e) => { const nd = [...pricingData]; nd[i].f = e.target.value.split('\n'); setPricingData(nd); }} className="editable-input pricing-input text-stone-600 font-bold h-40 resize-none text-sm leading-relaxed" />
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-black mb-1">{plan.t}</h3>
                    <p className="text-stone-400 font-bold text-sm mb-6">{plan.d}</p>
                    <div className="mb-8"><span className="text-5xl font-black text-vox-primary">{plan.p}</span><span className="text-stone-400 font-black text-xs mr-2">{plan.u}</span></div>
                    <ul className="space-y-4 mb-10">
                      {plan.f.map((feature: string, j: number) => (
                        <li key={j} className="flex items-center gap-3 font-bold text-stone-600 text-sm"><CheckCircle2 className="text-vox-primary flex-shrink-0" size={16} /> {feature}</li>
                      ))}
                    </ul>
                  </>
                )}
                <a href="#contact" className={`w-full py-4 rounded-2xl block text-center font-black transition-all ${plan.popular ? 'bg-vox-primary text-white shadow-lg' : 'bg-stone-900 text-white'}`}>اختيار الباقة</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order & Footer */}
      <section id="contact" className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 bg-white p-2 rounded-[3rem] shadow-2xl border border-stone-100 overflow-hidden">
          <OrderForm />
        </div>
      </section>
      <footer className="bg-stone-900 text-white py-24 text-center rounded-t-[4rem]">
        <div className="text-4xl font-black mb-8 italic text-white">Vox<span className="text-vox-primary">Dub</span></div>
        <p className="text-stone-600 font-bold italic">إدارة وتأسيس: لميس حميمي © 2026 - جميع الحقوق محفوظة لـ VoxDub Studio</p>
      </footer>
    </div>
  );
}
