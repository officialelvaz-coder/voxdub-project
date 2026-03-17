import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Search, UserPlus, Trash2, Play, Pause, Camera, Music, Upload, FileAudio, CheckCircle2, Headset, Mic, X, CloudUpload } from 'lucide-react';
import { toast } from 'sonner';

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
    if (!file.type.startsWith('audio/')) { toast.error('يُقبل فقط ملفات صوتية'); return; }
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
    e.preventDefault(); setIsDragging(false);
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
          <button onClick={onClose} className="absolute top-6 left-6 w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white/70">
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
            <button onClick={onClose} className="flex-1 h-14 rounded-2xl font-black text-white/50 border border-white/10" style={{ background: '#1c1c1c' }}>إلغاء</button>
            <button onClick={handleConfirm} disabled={!previewFile} className="h-14 rounded-2xl font-black text-white transition-all disabled:opacity-30" style={{ background: previewFile ? themeColor : '#333', flex: 2 }}>
              {previewFile ? 'تأكيد واعتماد العينة' : 'اختر ملفاً أولاً'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Artists() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [newArtist, setNewArtist] = useState({
    name: '', role: '', gender: '', experienceYears: '',
    language: 'عربية فصحى', bio: '', image: '', audio: '', audioName: '',
  });
  const [artists, setArtists] = useState(() => {
    const saved = localStorage.getItem('voxdub_artists_v2');
    return saved ? JSON.parse(saved) : [];
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
      audio: newArtist.audio || `/audio/${slug}.mp3`,
      audioName: newArtist.audioName || `${slug}.mp3`,
      image: newArtist.image || `/images/${slug}.jpg`,
      experience: newArtist.experienceYears ? `${newArtist.experienceYears} سنوات` : 'غير محدد',
      language: newArtist.language || 'عربية فصحى',
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

  const toggleAudio = (id: number, audioUrl: string) => {
    if (playingId === id) { currentAudio?.pause(); setPlayingId(null); }
    else {
      if (currentAudio) currentAudio.pause();
      const audio = new Audio(audioUrl);
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

      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black text-stone-900 italic">
          المكتبة <span style={{ color: themeColor }}>الصوتية</span>
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-16 px-10 rounded-2xl font-black text-white shadow-2xl" style={{ backgroundColor: themeColor }}>
              <UserPlus className="ml-3" /> إضافة مؤدي للمنصة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none rounded-[3rem] bg-white">
            <div className="vox-gradient-header p-10 text-white relative">
              <Headset className="absolute left-10 top-10 opacity-10" size={120} />
              <h2 className="text-3xl font-black mb-2">تسجيل معلق جديد</h2>
              <p className="text-stone-400 font-bold italic">يكفي الاسم للبدء — بقية التفاصيل في الملف الشخصي</p>
            </div>
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="font-black text-stone-400 text-xs">الصورة الشخصية (اختياري)</Label>
                  <div
                    onClick={() => document.getElementById('img-v3')?.click()}
                    className="aspect-square rounded-[2rem] bg-stone-100 border-2 border-dashed border-stone-200 flex items-center justify-center cursor-pointer hover:border-stone-400 transition-all overflow-hidden"
                  >
                    {newArtist.image ? (
                      <img src={newArtist.image} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <Camera className="text-stone-300" size={30} />
                    )}
                  </div>
                  <input type="file" id="img-v3" hidden accept="image/*" onChange={handleImageUpload} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="font-black text-stone-400 text-xs">ملف الأداء الصوتي (اختياري)</Label>
                  <button
                    type="button"
                    onClick={() => setIsAudioModalOpen(true)}
                    className="w-full h-full min-h-[140px] rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all"
                    style={{
                      border: newArtist.audio ? '2.5px solid #22c55e' : '2.5px dashed #e5e7eb',
                      background: newArtist.audio ? '#f0fdf4' : '#fafafa',
                    }}
                  >
                    {newArtist.audio ? (
                      <>
                        <CheckCircle2 size={22} className="text-green-500" />
                        <p className="text-green-700 font-black text-xs truncate max-w-[160px] px-2 text-center">{newArtist.audioName}</p>
                        <p className="text-green-500/60 text-[10px] font-bold">انقر لتغيير الملف</p>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${themeColor}15` }}>
                          <Mic size={24} style={{ color: themeColor }} />
                        </div>
                        <span className="text-sm text-stone-500 font-black">رفع عينة صوتية (اختياري)</span>
                        <span className="text-xs text-stone-400">MP3 · WAV · AAC</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-black pr-2 text-stone-600">اسم المعلق <span className="text-red-400">*</span></Label>
                  <Input
                    value={newArtist.name}
                    onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
                    className="h-14 rounded-2xl bg-stone-50 border-none font-bold text-lg"
                    placeholder="الاسم الكامل"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-black pr-2 text-stone-600">نوع الخامة (اختياري)</Label>
                  <Input
                    value={newArtist.role}
                    onChange={(e) => setNewArtist({ ...newArtist, role: e.target.value })}
                    placeholder="إعلاني، وثائقي..."
                    className="h-14 rounded-2xl bg-stone-50 border-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="font-black pr-2 text-stone-600">الجنس (اختياري)</Label>
                  <div className="flex gap-3">
                    {[{ value: 'ذكر', label: '♂ ذكر' }, { value: 'أنثى', label: '♀ أنثى' }].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setNewArtist({ ...newArtist, gender: opt.value })}
                        className={`flex-1 h-14 rounded-2xl font-black text-sm gender-btn ${newArtist.gender === opt.value ? 'active' : 'text-stone-400'}`}
                        style={{ background: newArtist.gender === opt.value ? `${themeColor}10` : '#f9fafb' }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-black pr-2 text-stone-600">سنوات الخبرة (اختياري)</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      value={newArtist.experienceYears}
                      onChange={(e) => setNewArtist({ ...newArtist, experienceYears: e.target.value })}
                      placeholder="0"
                      className="h-14 rounded-2xl bg-stone-50 border-none font-bold text-lg pl-16"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-black text-sm pointer-events-none">سنة</span>
                  </div>
                </div>
              </div>

              {newArtist.name && (
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                  <p className="text-xs font-black text-stone-400 mb-2">المسارات المولّدة تلقائياً:</p>
                  <p className="font-black text-sm text-stone-600">🖼️ <span style={{ color: themeColor }}>/images/{arabicToSlug(newArtist.name)}.jpg</span></p>
                  <p className="font-black text-sm text-stone-600">🎵 <span style={{ color: themeColor }}>/audio/{arabicToSlug(newArtist.name)}.mp3</span></p>
                </div>
              )}

              <button
                onClick={handleAddArtist}
                className="w-full h-16 rounded-2xl font-black text-white text-lg shadow-xl"
                style={{ backgroundColor: themeColor }}
              >
                إضافة المعلق للمنصة
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6">
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
          <p className="font-black text-xl">لا يوجد معلقون بعد</p>
          <p className="font-bold text-sm mt-2">اضغط على "إضافة مؤدي للمنصة" للبدء</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist: any) => (
            <div key={artist.id} className="bg-white rounded-[2.5rem] p-6 border border-stone-100 shadow-sm hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden bg-stone-100 flex-shrink-0">
                  {artist.image && !artist.image.startsWith('/images/') ? (
                    <img src={artist.image} classN
<img src={artist.image} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-black text-stone-300">
                      {artist.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-stone-900 truncate">{artist.name}</h3>
                  <p className="text-sm font-bold truncate" style={{ color: themeColor }}>{artist.role || 'معلق صوتي'}</p>
                  <p className="text-xs text-stone-400 font-bold">{artist.experience || 'خبرة غير محددة'}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => toggleAudio(artist.id, artist.audio)}
                  className="flex-1 h-12 rounded-2xl font-black text-white flex items-center justify-center gap-2"
                  style={{ backgroundColor: playingId === artist.id ? '#1c1917' : themeColor }}
                >
                  {playingId === artist.id ? <><Pause size={16} /> إيقاف</> : <><Play size={16} /> استمع</>}
                </button>
                <button
                  onClick={() => handleDeleteArtist(artist.id)}
                  className="w-12 h-12 rounded-2xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
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
