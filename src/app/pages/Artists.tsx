import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  Search, UserPlus, Trash2, Play, Pause, Camera, Music, Upload, 
  FileAudio, CheckCircle2, Headset, Mic, X, CloudUpload, 
  Home, Archive, RotateCcw 
} from 'lucide-react';
import { toast } from 'sonner';

// القائمة الرسمية الموحدة للموقع
const officialArtists = [
  { id: 1, name: "مصطفى جغلال", role: "صوت احترافي ومتزن", gender: "ذكر", experience: "12 سنة", image: "/images/mustapha.jpg", language: "فصحى وإنجليزي", audio: "/audio/mustapha.mp3", isArchived: false },
  { id: 2, name: "لميس حميمي", role: "صوت ناعم ومقنع", gender: "أنثى", experience: "7 سنوات", image: "/images/lamis.jpg", language: "عربي وفرنسي", audio: "/audio/mustapha.mp3", isArchived: false },
  { id: 3, name: "بلهادي محمد إسلام", role: "صوت عميق وقوي", gender: "ذكر", experience: "8 سنوات", image: "/images/islam.jpg", language: "عربي فصحى", audio: "/audio/mustapha.mp3", isArchived: false },
  { id: 4, name: "أحمد حاج إسماعيل", role: "صوت حماسي وشبابي", gender: "ذكر", experience: "6 سنوات", image: "/images/ahmed.jpg", language: "فصحى وعامية", audio: "/audio/mustapha.mp3", isArchived: false },
  { id: 5, name: "منال إبراهيمي", role: "صوت درامي ومؤثر", gender: "أنثى", experience: "5 سنوات", image: "/images/manal.jpg", language: "عربي فصحى", audio: "/audio/mustapha.mp3", isArchived: false },
  { id: 6, name: "آدم حمدوني", role: "صوت دافئ وجذاب", gender: "ذكر", experience: "10 سنوات", image: "/images/adam.jpg", language: "عربي فصحى وعامية", audio: "/audio/mustapha.mp3", isArchived: false }
];

const arabicToSlug = (name: string): string => {
  const firstWord = name.trim().split(' ')[0];
  const map: Record<string, string> = {
    'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'a',
    'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z',
    'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
    'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z',
    'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
    'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a',
    'ة': 'a', 'ء': 'a', 'ئ': 'y', 'ؤ': 'w',
  };
  return firstWord.split('').map(c => map[c] || '').join('').toLowerCase();
};

function AudioUploadModal({ isOpen, onClose, onUpload, themeColor, currentAudioName }: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (dataUrl: string, fileName: string) => void;
  themeColor: string;
  currentAudioName?: string;
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
  const [showArchived, setShowArchived] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [newArtist, setNewArtist] = useState({
    name: '', role: '', gender: '', experienceYears: '',
    language: 'عربية فصحى', bio: '', image: '', audio: '', audioName: '',
  });
  
  // 🟢 التعديل الجوهري: استخدام القائمة الرسمية إذا كانت الذاكرة فارغة
  const [artists, setArtists] = useState(() => {
    const saved = localStorage.getItem('voxdub_artists_v2');
    return saved ? JSON.parse(saved) : officialArtists;
  });

  const [playingId, setPlayingId] = useState<number | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');

  useEffect(() => {
    const handleStorage = () => {
      const color = localStorage.getItem('voxdub_theme');
      if (color) setThemeColor(color);
      const savedArtists = localStorage.getItem('voxdub_artists_v2');
      if (savedArtists) setArtists(JSON.parse(savedArtists));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewArtist({ ...newArtist, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

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
      language: newArtist.language || 'عربية فصحى',
      isArchived: false,
    };
    const updatedArtists = [artistToAdd, ...artists];
    setArtists(updatedArtists);
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(updatedArtists));
    localStorage.setItem(`voxdub_samples_${artistToAdd.id}`, JSON.stringify([
      { id: 1, title: `عينة ${newArtist.name}`, url: artistToAdd.audio }
    ]));
    setIsAddDialogOpen(false);
    setNewArtist({ name: '', role: '', gender: '', experienceYears: '', language: 'عربية فصحى', bio: '', image: '', audio: '', audioName: '' });
    toast.success(`تمت إضافة ${newArtist.name} بنجاح`);
  };

  const handleDeleteArtist = (id: number) => {
    const updated = artists.filter((a: any) => a.id !== id);
    setArtists(updated);
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(updated));
    localStorage.removeItem(`voxdub_samples_${id}`);
    toast.success('تم حذف المعلق');
  };

  const handleArchiveToggle = (id: number) => {
    const updated = artists.map((a: any) =>
      a.id === id ? { ...a, isArchived: !a.isArchived } : a
    );
    setArtists(updated);
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(updated));
    toast.success(updated.find((a: any) => a.id === id)?.isArchived 
      ? 'تم أرشفة المعلق' 
      : 'تم إعادة التفعيل'
    );
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

  const filteredArtists = artists
    .filter((a: any) => showArchived ? a.isArchived : !a.isArchived)
    .filter((a: any) =>
      a.name?.includes(searchQuery) || a.role?.includes(searchQuery)
    );

  return (
    <div className="p-4 space-y-6 text-right" dir="rtl">
      <style>{`
        .vox-gradient-header { background: linear-gradient(135deg, #1c1917 0%, #44403c 100%); }
        .gender-btn { transition: all 0.2s ease; border: 2.5px solid #e5e7eb; }
        .gender-btn.active { border-color: ${themeColor}; color: ${themeColor}; background: ${themeColor}12; font-weight: 900; }
        .gender-btn:hover:not(.active) { border-color: #d1d5db; background: #f9fafb; }
      `}</style>

      <AudioUploadModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        onUpload={handleAudioConfirm}
        themeColor={themeColor}
        currentAudioName={newArtist.audioName}
      />
