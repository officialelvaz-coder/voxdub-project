import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Search, UserPlus, Trash2, Play, Pause, Camera, Music, Upload, FileAudio, CheckCircle2, Headset, Mic, X, CloudUpload } from 'lucide-react';
import { toast } from 'sonner';

// ─── نافذة رفع الملف الصوتي المخصصة ─────────────────────────────────────────
function AudioUploadModal({
  isOpen,
  onClose,
  onUpload,
  themeColor,
  currentAudioName,
}: {
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
    if (!file.type.startsWith('audio/')) { toast.error('يُقبل فقط ملفات صوتية (MP3, WAV, AAC...)'); return; }
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
      <div
        className="relative w-full max-w-lg mx-4 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
        style={{ background: '#111' }}
      >
        {/* ─── الهيدر ─── */}
        <div className="relative px-10 pt-10 pb-6" style={{ background: `linear-gradient(135deg, #1a1a1a, #2a2a2a)` }}>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 80% 50%, ${themeColor} 0%, transparent 60%)`,
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-6 left-6 w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-all"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
              style={{ background: themeColor }}
            >
              <Mic size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-black text-2xl leading-tight">رفع العينة الصوتية</h3>
              <p className="text-white/40 text-sm font-bold mt-1">MP3 · WAV · AAC · FLAC · OGG</p>
            </div>
          </div>
        </div>

        {/* ─── منطقة الإفلات ─── */}
        <div className="px-8 py-8 space-y-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="relative rounded-[1.8rem] cursor-pointer transition-all duration-300 overflow-hidden"
            style={{
              border: `2.5px dashed ${isDragging ? themeColor : previewFile ? '#22c55e' : '#333'}`,
              background: isDragging
                ? `${themeColor}15`
                : previewFile
                ? '#0d2010'
                : '#1a1a1a',
              minHeight: '190px',
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="audio/*"
              hidden
              onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
            />

            <div className="flex flex-col items-center justify-center p-10 text-center h-full">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
                    style={{ background: `${themeColor}30` }}
                  >
                    <CloudUpload size={28} style={{ color: themeColor }} />
                  </div>
                  <p className="text-white/50 font-bold text-sm">جارٍ قراءة الملف...</p>
                </div>
              ) : previewFile ? (
                <div className="flex flex-col items-center gap-3">
                  {/* موجة صوتية تزيينية */}
                  <div className="flex items-end gap-[3px] h-12 mb-1">
                    {[6, 12, 18, 24, 30, 22, 16, 28, 20, 14, 26, 18, 10, 24, 16].map((h, i) => (
                      <div
                        key={i}
                        className="w-[5px] rounded-full animate-pulse"
                        style={{
                          height: `${h * 1.3}px`,
                          background: '#22c55e',
                          animationDelay: `${i * 0.07}s`,
                          opacity: 0.7 + (i % 3) * 0.1,
                        }}
                      />
                    ))}
                  </div>
                  <CheckCircle2 size={32} className="text-green-400" />
                  <p className="text-green-300 font-black text-base truncate max-w-[260px]">{previewFile.name}</p>
                  <p className="text-green-500/60 text-xs font-bold">{previewFile.size} · تم التحقق من الملف ✓</p>
                  <p className="text-white/30 text-xs mt-1">انقر لاختيار ملف آخر</p>
                </div>
              ) : (
                <>
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300"
                    style={{
                      background: isDragging ? `${themeColor}30` : '#252525',
                      transform: isDragging ? 'scale(1.15)' : 'scale(1)',
                    }}
                  >
                    <CloudUpload size={30} style={{ color: isDragging ? themeColor : '#555' }} />
                  </div>
                  <p className="font-black text-white/70 text-base mb-1">
                    {isDragging ? 'أفلت الملف هنا' : 'اسحب ملف الصوت وأفلته هنا'}
                  </p>
                  <p className="text-white/30 text-sm font-bold">أو انقر لاختيار من الجهاز</p>
                </>
              )}
            </div>
          </div>

          {/* ─── أزرار التأكيد ─── */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl font-black text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all"
              style={{ background: '#1c1c1c' }}
            >
              إلغاء
            </button>
            <button
              onClick={handleConfirm}
              disabled={!previewFile}
              className="flex-2 flex-1 h-14 rounded-2xl font-black text-white shadow-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: previewFile ? themeColor : '#333', flex: 2 }}
            >
              {previewFile ? 'تأكيد واعتماد العينة' : 'اختر ملفاً أولاً'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── المكوّن الرئيسي ──────────────────────────────────────────────────────────
export function Artists() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [newArtist, setNewArtist] = useState({
    name: '',
    role: '',
    gender: '',
    experienceYears: '',
    language: 'عربية فصحى',
    bio: '',
    image: '',
    audio: '',
    audioName: '',
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
    if (!newArtist.name || !newArtist.audio) {
      toast.error('الاسم وعينة الصوت مطلوبة');
      return;
    }
    const artistToAdd = { ...newArtist, id: Date.now(), rating: 5.0 };
    const updatedArtists = [artistToAdd, ...artists];
    setArtists(updatedArtists);
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(updatedArtists));
    setIsAddDialogOpen(false);
    setNewArtist({ name: '', role: '', gender: '', experienceYears: '', language: 'عربية فصحى', bio: '', image: '', audio: '', audioName: '' });
  };

  const toggleAudio = (id: number, audioUrl: string) => {
    if (playingId === id) { currentAudio?.pause(); setPlayingId(null); }
    else {
      if (currentAudio) currentAudio.pause();
      const audio = new Audio(audioUrl);
      audio.play();
      setCurrentAudio(audio);
      setPlayingId(id);
      audio.onended = () => setPlayingId(null);
    }
  };

  return (
    <div className="p-4 space-y-6 text-right" dir="rtl">
      <style>{`
        .vox-gradient-header { background: linear-gradient(135deg, #1c1917 0%, #44403c 100%); }
        .gender-btn { transition: all 0.2s ease; border: 2.5px solid #e5e7eb; }
        .gender-btn.active { border-color: ${themeColor}; color: ${themeColor}; background: ${themeColor}12; font-weight: 900; }
        .gender-btn:hover:not(.active) { border-color: #d1d5db; background: #f9fafb; }
      `}</style>

      {/* ─── نافذة رفع الصوت المخصصة ─── */}
      <AudioUploadModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        onUpload={handleAudioConfirm}
        themeColor={themeColor}
        currentAudioName={newArtist.audioName}
      />

      {/* ─── الهيدر ─── */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black text-stone-900 italic">
          المكتبة <span style={{ color: themeColor }}>الصوتية</span>
        </h1>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="h-16 px-10 rounded-2xl font-black text-white shadow-2xl transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: themeColor }}
            >
              <UserPlus className="ml-3" /> إضافة مؤدي للمنصة
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none rounded-[3rem] bg-white shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
            {/* هيدر النافذة */}
            <div className="vox-gradient-header p-10 text-white relative">
              <Headset className="absolute left-10 top-10 opacity-10" size={120} />
              <h2 className="text-3xl font-black mb-2">تسجيل معلق جديد</h2>
              <p className="text-stone-400 font-bold italic">قم برفع البيانات الفنية والعينة الصوتية للمؤدي</p>
            </div>

            <div className="p-10 space-y-8">
              {/* ─── الصورة + رفع الصوت ─── */}
              <div className="grid grid-cols-3 gap-6">
                {/* صورة شخصية */}
                <div className="space-y-2">
                  <Label className="font-black text-stone-400 text-xs">الصورة الشخصية</Label>
                  <div
                    onClick={() => document.getElementById('img-v3')?.click()}
                    className="aspect-square rounded-[2rem] bg-stone-100 border-2 border-dashed border-stone-200 flex items-center justify-center cursor-pointer hover:border-stone-400 transition-all overflow-hidden"
                  >
                    {newArtist.image ? (
                      <img src={newArtist.image} className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="text-stone-300" size={30} />
                    )}
                  </div>
                  <input type="file" id="img-v3" hidden accept="image/*" onChange={handleImageUpload} />
                </div>

                {/* زر فتح نافذة رفع الصوت */}
                <div className="col-span-2 space-y-2">
                  <Label className="font-black text-stone-400 text-xs">ملف الأداء الصوتي</Label>
                  <button
                    type="button"
                    onClick={() => setIsAudioModalOpen(true)}
                    className="w-full h-full min-h-[140px] rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all duration-300 border-3"
                    style={{
                      border: newArtist.audio
                        ? '2.5px solid #22c55e'
                        : `2.5px dashed #e5e7eb`,
                      background: newArtist.audio ? '#f0fdf4' : '#fafafa',
                    }}
                  >
                    {newArtist.audio ? (
                      <>
                        {/* موجة مصغرة */}
                        <div className="flex items-end gap-[3px] h-8">
                          {[4, 8, 12, 16, 10, 14, 8, 12, 6, 10].map((h, i) => (
                            <div
                              key={i}
                              className="w-[4px] rounded-full"
                              style={{ height: `${h}px`, background: '#22c55e', opacity: 0.75 }}
                            />
                          ))}
                        </div>
                        <CheckCircle2 size={22} className="text-green-500" />
                        <p className="text-green-700 font-black text-xs truncate max-w-[160px] px-2 text-center">
                          {newArtist.audioName}
                        </p>
                        <p className="text-green-500/60 text-[10px] font-bold">انقر لتغيير الملف</p>
                      </>
                    ) : (
                      <>
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ background: `${themeColor}15` }}
                        >
                          <Mic size={24} style={{ color: themeColor }} />
                        </div>
                        <span className="text-sm text-stone-500 font-black">فتح نافذة رفع الصوت</span>
                        <span className="text-xs text-stone-400">MP3 · WAV · AAC</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ─── الاسم + نوع الخامة ─── */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-black pr-2 text-stone-600">اسم المعلق</Label>
                  <Input
                    value={newArtist.name}
                    onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
                    className="h-14 rounded-2xl bg-stone-50 border-none font-bold text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-black pr-2 text-stone-600">نوع الخامة</Label>
                  <Input
                    value={newArtist.role}
                    onChange={(e) => setNewArtist({ ...newArtist, role: e.target.value })}
                    placeholder="إعلاني، وثائقي..."
                    className="h-14 rounded-2xl bg-stone-50 border-none font-bold"
                  />
                </div>
              </div>

              {/* ─── الجنس + سنوات الخبرة ─── */}
              <div className="grid grid-cols-2 gap-6">
                {/* الجنس */}
                <div className="space-y-3">
                  <Label className="font-black pr-2 text-stone-600">الجنس</Label>
                  <div className="flex gap-3">
                    {[
                      { value: 'ذكر', label: '♂ ذكر' },
                      { value: 'أنثى', label: '♀ أنثى' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setNewArtist({ ...newArtist, gender: opt.value })}
                        className={`flex-1 h-14 rounded-2xl font-black text-sm transition-all gender-btn ${
                          newArtist.gender === opt.value ? 'active' : 'text-stone-400'
                        }`}
                        style={{ background: newArtist.gender === opt.value ? `${themeColor}10` : '#f9fafb' }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* سنوات الخبرة */}
                <div className="space-y-2">
                  <Label className="font-black pr-2 text-stone-600">سنوات الخبرة</Label>
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
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-black text-sm pointer-events-none">
                      سنة
                    </span>
                  </div>
                </div>
              </div>

              {/* ─── الخبرة والتفاصيل ─── */}
              <div className="space-y-2">
                <Label className="font-black pr-2 text-stone-600">ملاحظات إضافية</Label>
                <Textarea
                  value={newArtist.bio}
                  onChange={(e) => setNewArtist({ ...newArtist, bio: e.target.value })}
                  className="rounded-2xl min-h-[90px] bg-stone-50 border-none font-bold"
                />
              </div>

              <Button
                onClick={handleAddArtist}
                className="w-full h-16 rounded-2xl font-black text-xl text-white shadow-2xl hover:brightness-110 transition-all"
                style={{ backgroundColor: themeColor }}
              >
                اعتماد المبدع ونشره فوراً
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ─── بطاقات المعلقين ─── */}
      <div className="grid grid-cols-1 gap-8">
        {artists.map((artist: any) => (
          <Card
            key={artist.id}
            className="group border-none shadow-sm rounded-[3.5rem] bg-white p-10 hover:shadow-2xl transition-all duration-500"
          >
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group-hover:rotate-3 transition-transform">
                  <img
                    src={artist.image}
                    className="w-full h-full object-cover"
                    onError={(e: any) =>
                      (e.target.src = 'https://ui-avatars.com/api/?name=' + artist.name)
                    }
                  />
                </div>
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                  <FileAudio size={24} style={{ color: themeColor }} />
                </div>
              </div>

              <div className="flex-1 text-right space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-black text-stone-900 leading-none">{artist.name}</h3>
                    <p className="font-black italic mt-2" style={{ color: themeColor }}>
                      {artist.role}
                    </p>
                    {/* بادجات الجنس والخبرة */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {artist.gender && (
                        <span className="px-4 py-1.5 rounded-full text-xs font-black bg-stone-100 text-stone-500">
                          {artist.gender === 'ذكر' ? '♂' : '♀'} {artist.gender}
                        </span>
                      )}
                      {artist.experienceYears && (
                        <span
                          className="px-4 py-1.5 rounded-full text-xs font-black text-white"
                          style={{ background: themeColor }}
                        >
                          {artist.experienceYears} سنة خبرة
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const up = artists.filter((a: any) => a.id !== artist.id);
                      setArtists(up);
                      localStorage.setItem('voxdub_artists_v2', JSON.stringify(up));
                    }}
                    className="p-4 bg-stone-50 text-stone-300 hover:text-red-500 rounded-2xl transition-all"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>

                <div className="flex items-center gap-6 p-6 bg-stone-50 rounded-[2.5rem] border border-stone-100 group-hover:border-vox-primary/30 transition-all">
                  <button
                    onClick={() => toggleAudio(artist.id, artist.audio)}
                    className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl transition-all active:scale-90"
                    style={{ backgroundColor: playingId === artist.id ? '#1c1917' : themeColor }}
                  >
                    {playingId === artist.id ? (
                      <Pause size={28} fill="currentColor" />
                    ) : (
                      <Play size={28} fill="currentColor" className="ml-1" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className="font-black text-stone-800 text-lg leading-tight">
                      {playingId === artist.id ? 'يتم الآن عرض خامة الصوت...' : 'تشغيل العينة الصوتية المرفوعة'}
                    </p>
                    <p className="text-xs text-stone-400 font-bold italic mt-1 truncate max-w-[250px]">
                      {artist.audioName || 'Mastered Audio Track'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
