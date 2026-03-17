import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { 
  Search, UserPlus, Trash2, Play, Pause, Upload, 
  CheckCircle2, Headset, Mic, X, CloudUpload, Home 
} from 'lucide-react';
import { toast } from 'sonner';

// القائمة الرسمية الأساسية
const officialArtists = [
  { id: 1, name: "مصطفى جغلال", role: "صوت احترافي ومتزن", gender: "ذكر", experience: "12 سنة", image: "/images/mustapha.jpg", language: "فصحى وإنجليزي", audio: "/audio/mustapha.mp3" },
  { id: 2, name: "لميس حميمي", role: "صوت ناعم ومقنع", gender: "أنثى", experience: "7 سنوات", image: "/images/lamis.jpg", language: "عربي وفرنسي", audio: "/audio/mustapha.mp3" },
  { id: 3, name: "بلهادي محمد إسلام", role: "صوت عميق وقوي", gender: "ذكر", experience: "8 سنوات", image: "/images/islam.jpg", language: "عربي فصحى", audio: "/audio/mustapha.mp3" },
  { id: 4, name: "أحمد حاج إسماعيل", role: "صوت حماسي وشبابي", gender: "ذكر", experience: "6 سنوات", image: "/images/ahmed.jpg", language: "فصحى وعامية", audio: "/audio/mustapha.mp3" },
  { id: 5, name: "منال إبراهيمي", role: "صوت درامي ومؤثر", gender: "أنثى", experience: "5 سنوات", image: "/images/manal.jpg", language: "عربي فصحى", audio: "/audio/mustapha.mp3" },
  { id: 6, name: "آدم حمدوني", role: "صوت دافئ وجذاب", gender: "ذكر", experience: "10 سنوات", image: "/images/adam.jpg", language: "عربي فصحى وعامية", audio: "/audio/mustapha.mp3" }
];

const arabicToSlug = (name: string): string => {
  const firstWord = name.trim().split(' ')[0];
  const map: Record<string, string> = {
    'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
    'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a',
    'ة': 'a', 'ء': 'a', 'ئ': 'y', 'ؤ': 'w',
  };
  return firstWord.split('').map(c => map[c] || '').join('').toLowerCase();
};

function AudioUploadModal({ isOpen, onClose, onUpload, themeColor }: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (dataUrl: string, fileName: string) => void;
  themeColor: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ name: string; size: string; dataUrl: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) { setPreviewFile(null); setIsLoading(false); }
  }, [isOpen]);

  const processFile = (file: File) => {
    if (!file.type.startsWith('audio/')) { 
      toast.error('يُقبل فقط ملفات صوتية'); 
      return; 
    }
    setIsLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      setPreviewFile({ name: file.name, size: `${sizeMB} MB`, dataUrl: reader.result as string });
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); 
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleConfirm = () => {
    if (!previewFile) return;
    onUpload(previewFile.dataUrl, previewFile.name);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg mx-4 rounded-[2.5rem] overflow-hidden" style={{ background: '#111' }}>
        <div className="relative px-10 pt-10 pb-6" style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)' }}>
          <button onClick={onClose} className="absolute top-6 left-6 w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all">
            <X size={18} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: themeColor }}>
              <Mic size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-black text-2xl">رفع العينة الصوتية</h3>
              <p className="text-white/40 text-sm font-bold mt-1">MP3 · WAV · AAC · FLAC</p>
            </div>
          </div>
        </div>
        <div className="px-8 py-8 space-y-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="relative rounded-[1.8rem] cursor-pointer transition-all overflow-hidden"
            style={{
              border: `2.5px dashed ${isDragging ? themeColor : previewFile ? '#22c55e' : '#333'}`,
              background: isDragging ? `${themeColor}15` : previewFile ? '#0d2010' : '#1a1a1a',
              minHeight: '190px',
            }}
          >
            <input ref={inputRef} type="file" accept="audio/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
            <div className="flex flex-col items-center justify-center p-10 text-center">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <CloudUpload size={28} style={{ color: themeColor }} />
                  <p className="text-white/50 font-bold text-sm">جارٍ قراءة الملف...</p>
                </div>
              ) : previewFile ? (
                <div className="flex flex-col items-center gap-3">
                  <CheckCircle2 size={32} className="text-green-400" />
                  <p className="text-green-300 font-black text-base truncate max-w-[260px]">{previewFile.name}</p>
                  <p className="text-green-500/60 text-xs font-bold">{previewFile.size} · تم التحقق ✓</p>
                  <p className="text-white/30 text-xs mt-1">انقر لاختيار ملف آخر</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <CloudUpload size={30} style={{ color: '#555' }} />
                  <p className="font-black text-white/70 text-base">اسحب ملف الصوت وأفلته هنا</p>
                  <p className="text-white/30 text-sm font-bold">أو انقر لاختيار من الجهاز</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 h-14 rounded-2xl font-black text-white/50 border border-white/10 hover:bg-white/5 transition-all" style={{ background: '#1c1c1c' }}>إلغاء</button>
            <button onClick={handleConfirm} disabled={!previewFile} className="h-14 rounded-2xl font-black text-white transition-all disabled:opacity-30 hover:opacity-90" style={{ background: previewFile ? themeColor : '#333', flex: 2 }}>
              {previewFile ? 'تأكيد واعتماد العينة' : 'اختر ملفاً أولاً'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Artists() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [newArtist, setNewArtist] = useState({
    name: '', role: '', gender: '', experienceYears: '',
    language: 'عربية فصحى', bio: '', image: '', audio: '', audioName: '',
  });
  
  // 🟢 سر الخلطة: دمج المعلقين القدامى (مثل ساااالمي) مع القائمة الرسمية
  const [artists, setArtists] = useState(() => {
    const saved = localStorage.getItem('voxdub_artists_v2');
    const savedArtists = saved ? JSON.parse(saved) : [];
    
    // تأكد من وجود القائمة الرسمية دائماً إلى جانب إضافاتك
    const combined = [...savedArtists];
    officialArtists.forEach(official => {
      if (!combined.find((a: any) => a.id === official.id)) {
        combined.push(official);
      }
    });
    return combined;
  });

  const [playingId, setPlayingId] = useState<number | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');

  useEffect(() => {
    const handleStorage = () => {
      const color = localStorage.getItem('voxdub_theme');
      if (color) setThemeColor(color);
      const savedArtists = localStorage.getItem('voxdub_artists_v2');
      if (savedArtists) {
        const parsed = JSON.parse(savedArtists);
        const combined = [...parsed];
        officialArtists.forEach(official => {
          if (!combined.find((a: any) => a.id === official.id)) combined.push(official);
        });
        setArtists(combined);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleAudioConfirm = (dataUrl: string, fileName: string) => {
    setNewArtist((prev) => ({ ...prev, audio: dataUrl, audioName: fileName }));
    toast.success('تم تحميل عينة الأداء بنجاح');
  };

  const handleAddArtist = () => {
    if (!newArtist.name.trim()) {
      toast.error('الاسم مطلوب');
      return;
    }
    const slug = arabicToSlug(newArtist.name);
    const artistToAdd = {
      ...newArtist,
      id: Date.now(),
      rating: 5.0,
      slug,
      audio: newArtist.audio || "/audio/mustapha.mp3",
      audioName: newArtist.audioName || `عينة ${newArtist.name}`,
      image: newArtist.image || `/images/${slug}.jpg`,
      experience: newArtist.experienceYears ? `${newArtist.experienceYears} سنوات` : 'غير محدد',
      language: newArtist.language || 'عربية فصحى'
    };
    
    const updatedArtists = [artistToAdd, ...artists];
    setArtists(updatedArtists);
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(updatedArtists));
    setIsAddDialogOpen(false);
    setNewArtist({ name: '', role: '', gender: '', experienceYears: '', language: 'عربية فصحى', bio: '', image: '', audio: '', audioName: '' });
    toast.success(`تمت إضافة ${newArtist.name} بنجاح`);
  };

  const handleDeleteArtist = (id: number) => {
    const updated = artists.filter((a: any) => a.id !== id);
    setArtists(updated);
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(updated));
    toast.success('تم حذف المعلق');
  };

  const toggleAudio = (id: number, audioUrl: string) => {
    if (playingId === id) { 
      currentAudio?.pause(); 
      setPlayingId(null); 
    } else {
      if (currentAudio) currentAudio.pause();
      const audio = new Audio(audioUrl || "/audio/mustapha.mp3");
      audio.play().catch(() => toast.error('العينة غير متوفرة'));
      setCurrentAudio(audio);
      setPlayingId(id);
      audio.onended = () => setPlayingId(null);
    }
  };

  const filteredArtists = artists.filter((a: any) =>
    a.name?.includes(searchQuery) || a.role?.includes(searchQuery)
  );

  return (
    <div className="p-4 space-y-6 text-right" dir="rtl">
      <style>{`
        .vox-gradient-header { background: linear-gradient(135deg, #1c1917 0%, #44403c 100%); }
      `}</style>

      <AudioUploadModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        onUpload={handleAudioConfirm}
        themeColor={themeColor}
      />

      {/* زر العودة للرئيسية الذي طلبته */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 transition-all font-bold shadow-sm"
        >
          <Home size={20} />
          الصفحة الرئيسية
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <h1 className="text-4xl font-black text-stone-900 italic">
          المكتبة <span style={{ color: themeColor }}>الصوتية</span>
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-16 px-10 rounded-2xl font-black text-white shadow-2xl" style={{ backgroundColor: themeColor }}>
              <UserPlus className="ml-3" /> إضافة مؤدي للمنصة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none rounded-[3rem] bg-white text-right" dir="rtl">
            <div className="vox-gradient-header p-10 text-white relative">
              <Headset className="absolute left-10 top-10 opacity-10" size={120} />
              <h2 className="text-3xl font-black mb-2">تسجيل معلق جديد</h2>
              <p className="text-stone-400 font-bold italic">يكفي الاسم للبدء — بقية التفاصيل لاحقاً</p>
            </div>
            <div className="p-10 space-y-6">
              <div>
                <Label className="font-bold text-stone-700">الاسم الكامل</Label>
                <Input value={newArtist.name} onChange={(e) => setNewArtist({...newArtist, name: e.target.value})} placeholder="مثال: مصطفى جغلال" className="h-14 mt-2 rounded-2xl bg-stone-50 border-stone-200 font-bold px-4" />
              </div>
              <div>
                <Label className="font-bold text-stone-700">الدور أو صفة الصوت</Label>
                <Input value={newArtist.role} onChange={(e) => setNewArtist({...newArtist, role: e.target.value})} placeholder="مثال: صوت احترافي ومتزن" className="h-14 mt-2 rounded-2xl bg-stone-50 border-stone-200 font-bold px-4" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-bold text-stone-700">الخبرة</Label>
                  <Input type="number" value={newArtist.experienceYears} onChange={(e) => setNewArtist({...newArtist, experienceYears: e.target.value})} placeholder="سنوات الخبرة" className="h-14 mt-2 rounded-2xl bg-stone-50 border-stone-200 font-bold px-4 text-left" dir="ltr" />
                </div>
                <div>
                  <Label className="font-bold text-stone-700">اللغة</Label>
                  <Input value={newArtist.language} onChange={(e) => setNewArtist({...newArtist, language: e.target.value})} placeholder="مثال: عربية فصحى" className="h-14 mt-2 rounded-2xl bg-stone-50 border-stone-200 font-bold px-4" />
                </div>
              </div>
              <Button onClick={() => setIsAudioModalOpen(true)} variant="outline" className="w-full h-14 rounded-2xl border-stone-200 text-stone-600 font-bold hover:bg-stone-50">
                <Upload className="ml-2" size={18} /> {newArtist.audioName || 'رفع عينة صوتية (اختياري)'}
              </Button>
              <Button onClick={handleAddArtist} className="w-full h-16 rounded-2xl font-black text-white text-lg mt-4 shadow-xl hover:opacity-90 transition-all" style={{ backgroundColor: themeColor }}>
                اعتماد وإضافة المعلق
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-8">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن معلق..."
          className="w-full h-14 pr-12 pl-6 rounded-2xl bg-white border border-stone-100 font-bold text-stone-700 outline-none shadow-sm"
        />
      </div>

      {filteredArtists.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <Mic size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-black text-xl">لا يوجد معلقون مسجلون بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist: any) => (
            <div key={artist.id} className="bg-white rounded-[2.5rem] p-6 border border-stone-100 shadow-sm hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-6 cursor-pointer" onClick={() => navigate(`/dashboard/artists/${artist.id}`)}>
                <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden bg-stone-100 flex-shrink-0 border-2 border-transparent hover:border-stone-200 transition-all">
                  {artist.image && !artist.image.startsWith('/images/') ? (
                    <img src={artist.image} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <img src={artist.image || '/images/default.jpg'} className="w-full h-full object-cover" alt={artist.name} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-2xl font-black text-stone-300">${artist.name?.charAt(0)}</div>`; }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-stone-900 truncate hover:text-stone-600 transition-colors">{artist.name}</h3>
                  <p className="text-sm font-bold truncate" style={{ color: themeColor }}>{artist.role || 'معلق صوتي'}</p>
                  <p className="text-xs text-stone-400 font-bold">{artist.experience || 'خبرة غير محددة'}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => toggleAudio(artist.id, artist.audio)}
                  className="flex-1 h-12 rounded-2xl font-black text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                  style={{ backgroundColor: playingId === artist.id ? '#1c1917' : themeColor }}
                >
                  {playingId === artist.id ? <><Pause size={16} /> إيقاف</> : <><Play size={16} /> استمع</>}
                </button>
                <button
                  onClick={() => handleDeleteArtist(artist.id)}
                  className="w-12 h-12 rounded-2xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                  title="حذف المعلق"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
