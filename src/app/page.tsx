'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './components/firebase';
import {
  Mic2, Play, Pause, Award, Star, Mic,
  Search, MessageSquare, Headphones, FileCheck,
  CheckCircle2, ChevronDown
} from 'lucide-react';

interface Artist {
  id: string;
  name: string;
  role?: string;
  style?: string;
  rating?: number;
  experience?: string;
  language?: string;
  image?: string;
  profilePicture?: string;
  audioSamples?: string[];
  audio?: string;
}

export default function Home() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'artists'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Artist[];
        setArtists(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingArtists(false);
      }
    };
    fetchArtists();
  }, []);

  const toggleAudio = (artist: Artist) => {
    const audioUrl = artist.audioSamples?.[0] || artist.audio || null;
    if (!audioUrl) return;

    if (playingId === artist.id) {
      currentAudio?.pause();
      setPlayingId(null);
    } else {
      if (currentAudio) currentAudio.pause();
      const newAudio = new Audio(audioUrl);
      newAudio.play().catch(() => {});
      setCurrentAudio(newAudio);
      setPlayingId(artist.id);
      newAudio.onended = () => setPlayingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-right" dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        * { font-family: 'Cairo', sans-serif; }
        .btn-primary { background: #1c1c1c; color: white; padding: 16px 48px; border-radius: 9999px; font-weight: 900; font-size: 1.1rem; transition: all 0.2s; }
        .btn-primary:hover { background: #e11d48; }
        .btn-outline { background: white; color: #1c1c1c; border: 3px solid #e5e7eb; padding: 16px 48px; border-radius: 9999px; font-weight: 900; font-size: 1.1rem; transition: all 0.2s; }
        .btn-outline:hover { border-color: #e11d48; color: #e11d48; }
        .artist-card { background: #1c1c1c; border-radius: 2rem; padding: 2rem; transition: transform 0.3s; }
        .artist-card:hover { transform: translateY(-8px); }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-2 rounded-xl">
              <Mic2 className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-black">Vox<span className="text-red-600">Dub</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/artists" className="text-gray-600 font-bold hover:text-red-600 transition hidden md:block">المعلقون</Link>
            <Link href="/login" className="text-gray-600 font-bold hover:text-red-600 transition hidden md:block">دخول</Link>
            <Link href="/register" className="bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition">
              ابدأ الآن
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-40 px-6 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-red-50 text-red-600 font-black px-5 py-2 rounded-full text-sm mb-8 border border-red-100">
            🎙️ منصة المعلقين الصوتيين الأولى في الجزائر
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
            اجعل لمشروعك<br />
            <span className="text-red-600">صوتاً</span> لا يُنسى
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-bold">
            نخبة من المعلقين الصوتيين المحترفين بجودة استوديو عالمية — اختر صوتك وابدأ مشروعك اليوم.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#artists" className="btn-primary">اكتشف المعلقين</a>
            <a href="#pricing" className="btn-outline">باقاتنا</a>
          </div>
          <div className="mt-16 flex justify-center gap-12 text-center">
            {[['50+', 'معلق محترف'], ['500+', 'مشروع منجز'], ['100%', 'رضا العملاء']].map(([num, label]) => (
              <div key={label}>
                <div className="text-3xl font-black text-gray-900">{num}</div>
                <div className="text-gray-500 font-bold text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why VoxDub */}
      <section className="py-24 bg-gray-950 rounded-[3rem] mx-4 text-white text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-black mb-16">لماذا <span className="text-red-500">VoxDub</span>؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Mic, title: 'أصوات متنوعة', desc: 'أكثر من 50 معلق صوتي محترف بأساليب وأصوات متنوعة' },
              { icon: Headphones, title: 'جودة عالية', desc: 'تسجيلات بجودة استوديو احترافية مع ضمان الجودة' },
              { icon: FileCheck, title: 'خدمات شاملة', desc: 'باقات متكاملة تشمل الكتابة والتدقيق اللغوي' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 p-8 rounded-3xl border border-white/10">
                <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon size={32} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-black mb-3">{title}</h3>
                <p className="text-gray-400 font-bold leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artists */}
      <section id="artists" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">معلقونا الصوتيون</h2>
            <p className="text-gray-500 font-bold text-lg">اختر الصوت المثالي لمشروعك</p>
          </div>

          {loadingArtists ? (
            <div className="text-center py-20 text-gray-400 font-bold">جاري تحميل المعلقين...</div>
          ) : artists.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-bold">لا يوجد معلقون حالياً</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artists.map((artist) => (
                <div key={artist.id} className="artist-card text-white">
                  <div className="flex justify-between items-start mb-6">
                    <Award size={24} className="text-red-400 opacity-70" />
                    <div className="text-right">
                      <h3 className="text-2xl font-black">{artist.name}</h3>
                      <p className="text-gray-400 font-bold mt-1 text-sm">{artist.role || artist.style || ''}</p>
                      {artist.rating && (
                        <div className="flex items-center justify-end gap-1 mt-2">
                          <span className="font-black">{artist.rating}</span>
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl mb-6">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-700 flex-shrink-0">
                      {(artist.profilePicture || artist.image) ? (
                        <img src={artist.profilePicture || artist.image} alt={artist.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-black text-gray-400">
                          {artist.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-bold text-gray-300 space-y-1 text-right">
                      {artist.experience && <p>الخبرة: <span className="text-white">{artist.experience}</span></p>}
                      {artist.language && <p>اللغة: <span className="text-white">{artist.language}</span></p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(artist.audioSamples?.[0] || artist.audio) && (
                      <button
                        onClick={() => toggleAudio(artist)}
                        className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                          playingId === artist.id
                            ? 'bg-gray-700 text-white'
                            : 'bg-white text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {playingId === artist.id ? <Pause size={22} /> : <Play size={22} fill="currentColor" />}
                        {playingId === artist.id ? 'إيقاف' : 'استمع'}
                      </button>
                    )}
                    <Link
                      href={`/dashboard/artists/${artist.id}`}
                      className="w-full py-3 rounded-2xl font-bold text-center block border border-white/20 text-gray-300 hover:bg-white hover:text-gray-900 transition-all"
                    >
                      الملف الشخصي
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/artists" className="btn-primary inline-block">عرض جميع المعلقين</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="workflow" className="py-24 bg-white text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-black text-gray-900 mb-16">كيف <span className="text-red-600">نعمل؟</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Search, t: 'اكتشف', d: 'اختر الصوت المناسب لمشروعك' },
              { icon: MessageSquare, t: 'تواصل', d: 'أرسل تفاصيل مشروعك والنص' },
              { icon: Headphones, t: 'تنفيذ', d: 'نسجل العمل بأحدث التقنيات' },
              { icon: FileCheck, t: 'استلام', d: 'استلم ملفك بجودة احترافية' },
            ].map((step, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                  <step.icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-black mb-2 text-gray-900">{i + 1}. {step.t}</h3>
                <p className="text-gray-500 font-bold text-sm">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-16">باقاتنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
            {[
              { t: 'باقة التعليق الصوتي', d: 'مثالية للمشاريع البسيطة', p: '5000', popular: false, f: ['تعليق صوتي احترافي', 'جودة تسجيل HD', 'تسليم خلال 3 أيام', 'مراجعة واحدة مجانية'] },
              { t: 'باقة التعليق والتدقيق', d: 'للمحتوى الاحترافي', p: '8000', popular: true, f: ['كل مميزات الباقة الأولى', 'تدقيق لغوي للنص', 'تصحيح الأخطاء النحوية', 'تحسين الصياغة'] },
              { t: 'باقة كاملة المحتوى', d: 'حل شامل ومتكامل', p: '13000', popular: false, f: ['كل مميزات الباقتين السابقتين', 'كتابة النص من الصفر', 'بحث وتطوير المحتوى', 'كتابة إبداعية'] },
            ].map((plan, i) => (
              <div key={i} className={`p-8 rounded-3xl border-2 transition-all bg-white ${plan.popular ? 'border-red-600 shadow-2xl scale-105 relative' : 'border-gray-100'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-1 rounded-full font-black text-sm">
                    الأكثر طلباً
                  </div>
                )}
                <h3 className="text-xl font-black text-gray-900 mb-1">{plan.t}</h3>
                <p className="text-gray-400 font-bold text-sm mb-6">{plan.d}</p>
                <div className="mb-8">
                  <span className="text-4xl font-black text-red-600">{plan.p}</span>
                  <span className="text-gray-400 font-bold text-xs mr-2">دينار</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.f.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm font-bold text-gray-600">
                      <CheckCircle2 size={16} className="text-red-600 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`w-full py-3 rounded-2xl block text-center font-black transition-all ${plan.popular ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-900 text-white hover:bg-gray-700'}`}>
                  اختيار الباقة
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-16 text-center rounded-t-3xl mt-4">
        <div className="text-3xl font-black mb-4">Vox<span className="text-red-500">Dub</span></div>
        <p className="text-gray-500 font-bold text-sm">إدارة وتأسيس: لميس حميمي © 2026 — جميع الحقوق محفوظة</p>
        <div className="flex justify-center gap-8 mt-8">
          <Link href="/artists" className="text-gray-400 hover:text-white font-bold text-sm transition">المعلقون</Link>
          <Link href="/login" className="text-gray-400 hover:text-white font-bold text-sm transition">تسجيل الدخول</Link>
          <Link href="/register" className="text-gray-400 hover:text-white font-bold text-sm transition">تسجيل جديد</Link>
        </div>
      </footer>
    </div>
  );
}
