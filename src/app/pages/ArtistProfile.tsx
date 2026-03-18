import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  Save, Home, Play, Pause, Music, Star, User, Clock, 
  Trash2, Plus, Edit3, MessageSquare, Quote
} from 'lucide-react';
import { toast } from 'sonner';

const getSlug = (name: string) => {
  const map: any = {
    'أ': 'a', 'إ': 'i', 'آ': 'a', 'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
    'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a',
    'ة': 'a', 'ء': 'a', 'ئ': 'y', 'ؤ': 'w'
  };
  const firstName = name.trim().split(' ')[0];
  return firstName.split('').map(c => map[c] || c).join('').toLowerCase();
};

export function ArtistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const themeColor = localStorage.getItem('voxdub_theme') || '#e11d48';
  const userRole = localStorage.getItem('voxdub_user_role') || 'visitor';
  const loggedInArtistId = localStorage.getItem('voxdub_logged_artist_id');
  
  const isOwner = userRole === 'artist' && String(loggedInArtistId) === String(id);

  // 1. حالة البيانات الأساسية
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('voxdub_artists_v2');
    const artists = saved ? JSON.parse(saved) : [];
    const found = artists.find((a: any) => String(a.id) === String(id));
    return found || { name: 'معلق', role: 'وصف الصوت', bio: 'النبذة', gender: 'ذكر', experience: '0 سنة', image: '/images/default.jpg' };
  });

  // 2. حالة العينات الصوتية
  const [samples, setSamples] = useState(() => {
    const saved = localStorage.getItem(`voxdub_samples_${id}`);
    return saved ? JSON.parse(saved) : [
      { id: 'main', title: 'نموذج الأداء الرئيسي', url: `/audio/${getSlug(profile.name)}.mp3` }
    ];
  });

  // 3. حالة التقييمات الوهمية
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(`voxdub_reviews_${id}`);
    return saved ? JSON.parse(saved) : [
      { id: 1, client: "أحمد منصور", text: "أداء احترافي وسرعة في التسليم، أنصح به بشدة!", stars: 5 }
    ];
  });

  const [playingId, setPlayingId] = useState<string | number | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  const togglePlay = (sid: string | number, url: string) => {
    if (playingId === sid) { 
      audioInstance?.pause(); setPlayingId(null); 
    } else {
      if (audioInstance) audioInstance.pause();
      const audio = new Audio(url);
      audio.play().then(() => {
        setAudioInstance(audio);
        setPlayingId(sid);
        audio.onended = () => setPlayingId(null);
      }).catch(() => toast.error("العينة غير متوفرة"));
    }
  };

  const handleSave = () => {
    // حفظ البروفايل
    const saved = localStorage.getItem('voxdub_artists_v2');
    let artists = saved ? JSON.parse(saved) : [];
    const idx = artists.findIndex((a: any) => String(a.id) === String(id));
    if (idx >= 0) artists[idx] = profile;
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(artists));

    // حفظ العينات والتقييمات
    localStorage.setItem(`voxdub_samples_${id}`, JSON.stringify(samples));
    localStorage.setItem(`voxdub_reviews_${id}`, JSON.stringify(reviews));

    toast.success("تم حفظ جميع التعديلات بنجاح");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 text-right px-4" dir="rtl">
      <style>{`.text-vox-primary { color: ${themeColor} !important; } .bg-vox-primary { background-color: ${themeColor} !important; }`}</style>

      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-100 mt-6">
        <Button onClick={() => navigate('/dashboard/artists')} variant="ghost" className="font-black text-stone-400 hover:text-vox-primary"><Home className="ml-2" /> العودة</Button>
        {isOwner && <Button onClick={handleSave} className="bg-vox-primary text-white rounded-2xl px-10 font-black shadow-lg"><Save className="ml-2" /> حفظ بياناتي</Button>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-stone-100 text-center">
            <div className="w-40 h-40 mx-auto rounded-[2.5rem] overflow-hidden mb-6 border-4 border-stone-50 shadow-inner">
               <img src={profile.image || '/images/default.jpg'} className="w-full h-full object-cover" alt="" />
            </div>
            
            {/* تعديل الاسم والوصف للمالك */}
            {isOwner ? (
              <div className="space-y-2 mb-4">
                <input className="text-center text-2xl font-black bg-stone-50 rounded-xl w-full p-2 outline-none" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                <input className="text-center font-bold italic text-vox-primary bg-stone-50 rounded-xl w-full p-2 outline-none" value={profile.role} onChange={(e) => setProfile({...profile, role: e.target.value})} />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black">{profile.name}</h2>
                <p className="font-bold italic text-vox-primary mt-2">{profile.role}</p>
              </>
            )}

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-stone-50 p-4 rounded-2xl">
                <User size={16} className="mx-auto mb-1 text-stone-400"/>
                {isOwner ? (
                  <select className="bg-transparent text-xs font-black outline-none" value={profile.gender} onChange={(e)=>setProfile({...profile, gender: e.target.value})}>
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                ) : <p className="text-xs font-black">{profile.gender}</p>}
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl">
                <Clock size={16} className="mx-auto mb-1 text-stone-400"/>
                {isOwner ? (
                  <input className="bg-transparent text-xs font-black text-center w-full outline-none" value={profile.experience} onChange={(e)=>setProfile({...profile, experience: e.target.value})} />
                ) : <p className="text-xs font-black">{profile.experience}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {/* النبذة */}
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-stone-100">
            <h3 className="text-xl font-black flex items-center gap-2 mb-4"><Star className="text-vox-primary" /> النبذة التعريفية</h3>
            {isOwner ? (
              <textarea className="w-full p-6 bg-stone-50 rounded-[2rem] border-none outline-none font-bold text-stone-700 h-40 resize-none" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
            ) : <p className="leading-relaxed font-bold text-stone-500">{profile.bio}</p>}
          </div>

          {/* العينات الصوتية وتعديلها */}
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-stone-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black flex items-center gap-2"><Music className="text-vox-primary" /> العينات الصوتية</h3>
              {isOwner && (
                <Button variant="ghost" className="text-vox-primary font-black" onClick={() => {
                  const newSample = { id: Date.now(), title: 'عينة جديدة', url: '' };
                  setSamples([...samples, newSample]);
                }}><Plus size={18} className="ml-1" /> إضافة عينة</Button>
              )}
            </div>
            
            <div className="space-y-4">
              {samples.map((s: any, idx: number) => (
                <div key={s.id} className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Button onClick={() => togglePlay(s.id, s.url)} className={`w-12 h-12 rounded-2xl text-white ${playingId === s.id ? 'bg-stone-900' : 'bg-vox-primary'}`}>
                      {playingId === s.id ? <Pause /> : <Play />}
                    </Button>
                    {isOwner ? (
                      <input className="bg-transparent font-black text-lg outline-none border-b border-dashed border-stone-300 focus:border-vox-primary" value={s.title} onChange={(e) => {
                        const newSamples = [...samples];
                        newSamples[idx].title = e.target.value;
                        setSamples(newSamples);
                      }} />
                    ) : <span className="font-black text-lg">{s.title}</span>}
                  </div>
                  {isOwner && (
                    <button className="text-red-400 p-2" onClick={() => setSamples(samples.filter((item:any) => item.id !== s.id))}><Trash2 size={18}/></button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* التقييمات الوهمية */}
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-stone-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black flex items-center gap-2"><Quote className="text-vox-primary" /> ماذا يقول العملاء</h3>
              {isOwner && (
                <Button variant="ghost" className="text-vox-primary font-black" onClick={() => {
                  const newReview = { id: Date.now(), client: "اسم العميل", text: "اكتب التقييم هنا", stars: 5 };
                  setReviews([...reviews, newReview]);
                }}><Plus size={18} className="ml-1" /> إضافة تقييم</Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev: any, idx: number) => (
                <div key={rev.id} className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100">
                  <div className="flex gap-1 mb-2">
                    {[...Array(rev.stars)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                  </div>
                  {isOwner ? (
                    <div className="space-y-2">
                      <textarea className="w-full bg-transparent text-sm font-bold text-stone-600 outline-none resize-none h-20" value={rev.text} onChange={(e) => {
                        const newReviews = [...reviews];
                        newReviews[idx].text = e.target.value;
                        setReviews(newReviews);
                      }} />
                      <input className="w-full bg-transparent text-xs font-black text-stone-400 outline-none" value={rev.client} onChange={(e) => {
                        const newReviews = [...reviews];
                        newReviews[idx].client = e.target.value;
                        setReviews(newReviews);
                      }} />
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-stone-600 italic mb-2">"{rev.text}"</p>
                      <p className="text-xs font-black text-stone-400">— {rev.client}</p>
                    </>
                  )}
                  {isOwner && (
                    <button className="text-red-300 mt-2" onClick={() => setReviews(reviews.filter((item:any) => item.id !== rev.id))}><Trash2 size={14}/></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
