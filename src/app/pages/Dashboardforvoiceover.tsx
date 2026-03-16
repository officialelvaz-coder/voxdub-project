import React, { useState, useEffect } from 'react';
import { 
  Camera, Upload, Play, Pause, Home, User, 
  FileText, Plus, Trash2, Mic2, Save, LogOut
} from 'lucide-react';

export function Dashboardforvoiceover() {
  // 1. جلب لون الهوية المختار ليبقى الموقع متناسقاً
  const [themeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');

  // 2. جلب البيانات من "الذاكرة المركزية" (المفتاح v2 الذي استخدمناه في Landing)
  const [artists, setArtists] = useState(() => {
    const saved = localStorage.getItem('voxdub_artists_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // افترضنا أنك أنت المعلق رقم 1 (مصطفى)
  const myId = 1;
  const myData = artists.find((a: any) => a.id === myId) || artists[0];

  // 3. حالة محلية للتعديل على العينات والنبذة (لضمان السرعة)
  const [mySamples, setMySamples] = useState(myData?.samples || [
    { id: 1, title: "عينة وثائقية تاريخية", audio: "/audio/mustapha.mp3" },
    { id: 2, title: "إعلان تجاري حماسي", audio: "#" }
  ]);
  
  const [myBio, setMyBio] = useState(myData?.bio || "معلق صوتي محترف وصانع محتوى. أقدم تعليقاً وثائقياً وإعلانيّاً يلامس القلوب.");

  // 4. دالة الحفظ النهائي (ترسل التعديلات للذاكرة المركزية)
  const saveAllChanges = () => {
    const updatedArtists = artists.map((a: any) => 
      a.id === myId ? { ...a, bio: myBio, samples: mySamples } : a
    );
    setArtists(updatedArtists);
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(updatedArtists));
    alert("✨ تم حفظ جميع التعديلات في ملفك الشخصي بنجاح!");
  };

  // نظام مشغل الصوت
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const toggleAudio = (id: number, audioUrl: string) => {
    if (audioUrl === "#" || !audioUrl) {
      alert("عذراً، العينة الصوتية قيد التجهيز!");
      return;
    }
    if (playingId === id) {
      currentAudio?.pause();
      setPlayingId(null);
    } else {
      if (currentAudio) currentAudio.pause();
      const newAudio = new Audio(audioUrl);
      newAudio.play();
      setCurrentAudio(newAudio);
      setPlayingId(id);
      newAudio.onended = () => setPlayingId(null);
    }
  };

  const addNewSample = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const title = prompt("أدخل عنوان العينة الصوتية الجديدة:");
        const finalTitle = title ? title : "عينة جديدة";
        const url = URL.createObjectURL(file);
        setMySamples([...mySamples, { id: Date.now(), title: finalTitle, audio: url }]);
      }
    };
    input.click();
  };

  const deleteSample = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذه العينة؟")) {
      setMySamples(mySamples.filter((s: any) => s.id !== id));
      if (playingId === id) {
        currentAudio?.pause();
        setPlayingId(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-right flex flex-col" dir="rtl">
      <style>{`
        .dynamic-text { color: ${themeColor} !important; }
        .dynamic-bg { background-color: ${themeColor} !important; }
        .dynamic-border { border-color: ${themeColor} !important; }
        .hover-bg:hover { background-color: ${themeColor} !important; color: white !important; }
      `}</style>

      {/* الهيدر */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic2 className="dynamic-text w-6 h-6" />
            <span className="font-black text-xl text-stone-900">مساحة المعلق</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-stone-500 hover:dynamic-text transition-colors text-sm font-bold flex items-center gap-1">
              <Home size={16} /> الرئيسية
            </a>
            <a href="/login" className="text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors text-sm font-bold flex items-center gap-1">
              <LogOut size={16} /> خروج
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8 w-full">
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-right">
          <div>
            <h1 className="text-3xl font-black text-stone-900 mb-1">مرحباً، {myData?.name} 🎙️</h1>
            <p className="text-stone-500 font-medium">قم بإدارة عيناتك ونبذتك التعريفية ليراها العملاء بشكل احترافي.</p>
          </div>
          <button 
            onClick={saveAllChanges}
            className="flex items-center gap-2 dynamic-bg text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:brightness-90 transition-all"
          >
            <Save size={20} /> حفظ التعديلات في الملف
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* الملف الشخصي */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm text-center">
              <div className="relative w-32 h-32 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
                <User size={60} className="text-stone-300" />
              </div>
              <h3 className="text-xl font-black text-stone-900 mb-1">{myData?.name}</h3>
              <p className="dynamic-text font-bold text-sm mb-6" dir="ltr">@ElHakawati</p>
              
              <div className="text-right space-y-4 pt-4 border-t border-stone-50">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <span className="text-xs font-bold text-stone-400 block mb-1">اللغات:</span>
                  <span className="text-sm font-bold text-stone-700">{myData?.language}</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <span className="text-xs font-bold text-stone-400 block mb-1">الخبرة:</span>
                  <span className="text-sm font-bold text-stone-700">{myData?.experience}</span>
                </div>
              </div>
            </div>
          </div>

          {/* النبذة والعينات */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
              <label className="text-sm font-black text-stone-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="dynamic-text"/> النبذة التعريفية الشخصية
              </label>
              <textarea 
                rows={4}
                value={myBio}
                onChange={(e) => setMyBio(e.target.value)}
                className="w-full text-stone-600 bg-stone-50 border border-stone-200 rounded-2xl p-4 focus:dynamic-border outline-none transition-all resize-none leading-relaxed font-medium"
                placeholder="اكتب نبذة عنك..."
              />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <label className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <Mic2 size={18} className="dynamic-text"/> معرض عيناتك الصوتية
                </label>
                <button 
                  onClick={addNewSample}
                  className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:dynamic-bg transition-colors"
                >
                  <Plus size={16} /> إضافة عينة
                </button>
              </div>

              <div className="space-y-3">
                {mySamples.map((sample: any) => (
                  <div key={sample.id} className="flex items-center justify-between p-4 rounded-2xl border border-stone-100 bg-stone-50 hover:dynamic-border transition-all group">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleAudio(sample.id, sample.audio)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          playingId === sample.id 
                            ? "dynamic-bg text-white shadow-lg" 
                            : "bg-white text-stone-400 border border-stone-200 hover:dynamic-text hover:border-vox-primary"
                        }`}
                      >
                        {playingId === sample.id ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                      </button>
                      <h4 className="font-bold text-stone-900">{sample.title}</h4>
                    </div>
                    <button 
                      onClick={() => deleteSample(sample.id)}
                      className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
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