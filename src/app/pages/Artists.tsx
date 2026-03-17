import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Search, UserPlus, Trash2, Play, Pause, Camera, Music, Upload, FileAudio, CheckCircle2, Headset, Mic, X, CloudUpload } from 'lucide-react';
import { toast } from 'sonner';

// \u062f\u0627\u0644\u0629 \u062a\u062d\u0648\u064a\u0644 \u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0639\u0631\u0628\u064a \u0625\u0644\u0649 slug \u0644\u0627\u062a\u064a\u0646\u064a
const arabicToSlug = (name: string): string => {
  const firstWord = name.trim().split(' ')[0];
  const map: Record<string, string> = {
    '\u0627': 'a', '\u0623': 'a', '\u0625': 'i', '\u0622': 'a',
    '\u0628': 'b', '\u062a': 't', '\u062b': 'th', '\u062c': 'j',
    '\u062d': 'h', '\u062e': 'kh', '\u062f': 'd', '\u0630': 'z',
    '\u0631': 'r', '\u0632': 'z', '\u0633': 's', '\u0634': 'sh',
    '\u0635': 's', '\u0636': 'd', '\u0637': 't', '\u0638': 'z',
    '\u0639': 'a', '\u063a': 'gh', '\u0641': 'f', '\u0642': 'q',
    '\u0643': 'k', '\u0644': 'l', '\u0645': 'm', '\u0646': 'n',
    '\u0647': 'h', '\u0648': 'w', '\u064a': 'y', '\u0649': 'a',
    '\u0629': 'a', '\u0621': 'a', '\u0626': 'y', '\u0624': 'w',
  };
  return firstWord.split('').map(c => map[c] || '').join('').toLowerCase();
};

function AudioUploadModal({
  isOpen, onClose, onUpload, themeColor, currentAudioName,
}: {
  isOpen: boolean; onClose: () => void;
  onUpload: (dataUrl: string, fileName: string) => void;
  themeColor: string; currentAudioName?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ name: string; size: string; dataUrl: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) { setPreviewFile(null); setIsLoading(false); }
  }, [isOpen]);

  const processFile = (file: File) => {
    if (!file.type.startsWith('audio/')) { toast.error('\u064a\u064f\u0642\u0628\u0644 \u0641\u0642\u0637 \u0645\u0644\u0641\u0627\u062a \u0635\u0648\u062a\u064a\u0629'); return; }
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
      <div className="relative w-full max-w-lg mx-4 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)]" style={{ background: '#111' }}>
        <div className="relative px-10 pt-10 pb-6" style={{ background: `linear-gradient(135deg, #1a1a1a, #2a2a2a)` }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 80% 50%, ${themeColor} 0%, transparent 60%)` }} />
          <button onClick={onClose} className="absolute top-6 left-6 w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-all">
            <X size={18} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: themeColor }}>
              <Mic size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-black text-2xl leading-tight">\u0631\u0641\u0639 \u0627\u0644\u0639\u064a\u0646\u0629 \u0627\u0644\u0635\u0648\u062a\u064a\u0629</h3>
              <p className="text-white/40 text-sm font-bold mt-1">MP3 \u00b7 WAV \u00b7 AAC \u00b7 FLAC \u00b7 OGG</p>
            </div>
          </div>
        </div>
        <div className="px-8 py-8 space-y-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="relative rounded-[1.8rem] cursor-pointer transition-all duration-300 overflow-hidden"
            style={{
              border: `2.5px dashed ${isDragging ? themeColor : previewFile ? '#22c55e' : '#333'}`,
              background: isDragging ? `${themeColor}15` : previewFile ? '#0d2010' : '#1a1a1a',
              minHeight: '190px',
            }}
          >
            <input ref={inputRef} type="file" accept="audio/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
            <div className="flex flex-col items-center justify-center p-10 text-center h-full">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse" style={{ background: `${themeColor}30` }}>
                    <CloudUpload size={28} style={{ color: themeColor }} />
                  </div>
                  <p className="text-white/50 font-bold text-sm">\u062c\u0627\u0631\u064d \u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0645\u0644\u0641...</p>
                </div>
              ) : previewFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-end gap-[3px] h-12 mb-1">
                    {[6, 12, 18, 24, 30, 22, 16, 28, 20, 14, 26, 18, 10, 24, 16].map((h, i) => (
                      <div key={i} className="w-[5px] rounded-full animate-pulse" style={{ height: `${h * 1.3}px`, background: '#22c55e', animationDelay: `${i * 0.07}s`, opacity: 0.7 + (i % 3) * 0.1 }} />
                    ))}
                  </div>
                  <CheckCircle2 size={32} className="text-green-400" />
                  <p className="text-green-300 font-black text-base truncate max-w-[260px]">{previewFile.name}</p>
                  <p className="text-green-500/60 text-xs font-bold">{previewFile.size} \u00b7 \u062a\u0645 \u0627\u0644\u062a\u062d\u0642\u0642 \u2713</p>
                  <p className="text-white/30 text-xs mt-1">\u0627\u0646\u0642\u0631 \u0644\u0627\u062e\u062a\u064a\u0627\u0631 \u0645\u0644\u0641 \u0622\u062e\u0631</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300" style={{ background: isDragging ? `${themeColor}30` : '#252525', transform: isDragging ? 'scale(1.15)' : 'scale(1)' }}>
                    <CloudUpload size={30} style={{ color: isDragging ? themeColor : '#555' }} />
                  </div>
                  <p className="font-black text-white/70 text-base mb-1">{isDragging ? '\u0623\u0641\u0644\u062a \u0627\u0644\u0645\u0644\u0641 \u0647\u0646\u0627' : '\u0627\u0633\u062d\u0628 \u0645\u0644\u0641 \u0627\u0644\u0635\u0648\u062a \u0648\u0623\u0641\u0644\u062a\u0647 \u0647\u0646\u0627'}</p>
                  <p className="text-white/30 text-sm font-bold">\u0623\u0648 \u0627\u0646\u0642\u0631 \u0644\u0627\u062e\u062a\u064a\u0627\u0631 \u0645\u0646 \u0627\u0644\u062c\u0647\u0627\u0632</p>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 h-14 rounded-2xl font-black text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all" style={{ background: '#1c1c1c' }}>\u0625\u0644\u063a\u0627\u0621</button>
            <button onClick={handleConfirm} disabled={!previewFile} className="flex-2 flex-1 h-14 rounded-2xl font-black text-white shadow-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed" style={{ background: previewFile ? themeColor : '#333', flex: 2 }}>
              {previewFile ? '\u062a\u0623\u0643\u064a\u062f \u0648\u0627\u0639\u062a\u0645\u0627\u062f \u0627\u0644\u0639\u064a\u0646\u0629' : '\u0627\u062e\u062a\u0631 \u0645\u0644\u0641\u0627\u064b \u0623\u0648\u0644\u0627\u064b'}
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
    language: '\u0639\u0631\u0628\u064a\u0629 \u0641\u0635\u062d\u0649', bio: '', image: '', audio: '', audioName: '',
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
    toast.success('\u062a\u0645 \u062a\u062d\u0645\u064a\u0644 \u0639\u064a\u0646\u0629 \u0627\u0644\u0623\u062f\u0627\u0621 \u0628\u0646\u062c\u0627\u062d');
  };

  // \u2705 \u0627\u0644\u062a\u0639\u062f\u064a\u0644 1: \u064a\u0643\u0641\u064a \u0627\u0644\u0627\u0633\u0645 \u0641\u0642\u0637 \u0644\u0644\u0625\u0636\u0627\u0641\u0629
  const handleAddArtist = () => {
    if (!newArtist.name.trim()) {
      toast.error('\u0627\u0644\u0627\u0633\u0645 \u0645\u0637\u0644\u0648\u0628');
      return;
    }
    const slug = arabicToSlug(newArtist.name);
    const artistToAdd = {
      ...newArtist,
      id: Date.now(),
      rating: 5.0,
      slug,
      // \u2705 \u0625\u0630\u0627 \u0644\u0645 \u062a\u0631\u0641\u0639 \u0635\u0648\u062a\u0627\u064b \u064a\u0623\u062e\u0630 \u0627\u0644\u0639\u064a\u0646\u0629 \u0627\u0644\u0627\u0641\u062a\u0631\u0627\u0636\u064a\u0629
      audio: newArtist.audio || `/audio/${slug}.mp3`,
      audioName: newArtist.audioName || `${slug}.mp3`,
      // \u2705 \u0625\u0630\u0627 \u0644\u0645 \u062a\u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u064a\u0623\u062e\u0630 \u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0627\u0641\u062a\u0631\u0627\u0636\u064a\u0629
      image: newArtist.image || `/images/${slug}.jpg`,
      experience: newArtist.experienceYears ? `${newArtist.experienceYears} \u0633\u0646\u0648\u0627\u062a` : '\u063a\u064a\u0631 \u0645\u062d\u062f\u062f',
      language: newArtist.language || '\u0639\u0631\u0628\u064a\u0629 \u0641\u0635\u062d\u0649',
    };
    const updatedArtists = [artistToAdd, ...artists];
    setArtists(updatedArtists);
    // \u2705 \u0627\u0644\u062a\u0639\u062f\u064a\u0644 2: \u062d\u0641\u0638 \u062f\u0627\u0626\u0645 \u0641\u064a localStorage
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(updatedArtists));
    // \u2705 \u062d\u0641\u0638 \u0627\u0644\u0639\u064a\u0646\u0629 \u0641\u064a \u0645\u0641\u062a\u0627\u062d \u062e\u0627\u0635 \u0628\u0627\u0644\u0641\u0646\u0627\u0646 \u062d\u062a\u0649 \u062a\u0638\u0647\u0631 \u0641\u064a \u0645\u0644\u0641\u0647 \u0627\u0644\u0634\u062e\u0635\u064a
    localStorage.setItem(`voxdub_samples_${artistToAdd.id}`, JSON.stringify([
      { id: 1, title: `\u0639\u064a\u0646\u0629 ${newArtist.name}`, url: artistToAdd.audio }
    ]));
    setIsAddDialogOpen(false);
    setNewArtist({ name: '', role: '', gender: '', experienceYears: '', language: '\u0639\u0631\u0628\u064a\u0629 \u0641\u0635\u062d\u0649', bio: '', image: '', audio: '', audioName: '' });
    toast.success(`\u062a\u0645\u062a \u0625\u0636\u0627\u0641\u0629 ${newArtist.name} \u0628\u0646\u062c\u0627\u062d`);
  };

  const handleDeleteArtist = (id: number) => {
    const updated = artists.filter((a: any) => a.id !== id);
    setArtists(updated);
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(updated));
    localStorage.removeItem(`voxdub_samples_${id}`);
    toast.success('\u062a\u0645 \u062d\u0630\u0641 \u0627\u0644\u0645\u0639\u0644\u0642');
  };

  const toggleAudio = (id: number, audioUrl: string) => {
    if (playingId === id) { currentAudio?.pause(); setPlayingId(null); }
    else {
      if (currentAudio) currentAudio.pause();
      const audio = new Audio(audioUrl);
      audio.play().catch(() => toast.error('\u0627\u0644\u0639\u064a\u0646\u0629 \u063a\u064a\u0631 \u0645\u062a\u0648\u0641\u0631\u0629'));
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
          \u0627\u0644\u0645\u0643\u062a\u0628\u0629 <span style={{ color: themeColor }}>\u0627\u0644\u0635\u0648\u062a\u064a\u0629</span>
        </h1>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-16 px-10 rounded-2xl font-black text-white shadow-2xl transition-transform hover:scale-105 active:scale-95" style={{ backgroundColor: themeColor }}>
              <UserPlus className="ml-3" /> \u0625\u0636\u0627\u0641\u0629 \u0645\u0624\u062f\u064a \u0644\u0644\u0645\u0646\u0635\u0629
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none rounded-[3rem] bg-white shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
            <div className="vox-gradient-header p-10 text-white relative">
              <Headset className="absolute left-10 top-10 opacity-10" size={120} />
              <h2 className="text-3xl font-black mb-2">\u062a\u0633\u062c\u064a\u0644 \u0645\u0639\u0644\u0642 \u062c\u062f\u064a\u062f</h2>
              <p className="text-stone-400 font-bold italic">\u064a\u0643\u0641\u064a \u0627\u0644\u0627\u0633\u0645 \u0644\u0644\u0628\u062f\u0621 \u2014 \u0628\u0642\u064a\u0629 \u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644 \u0641\u064a \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a</p>
            </div>

            <div className="p-10 space-y-8">
              {/* \u0627\u0644\u0635\u0648\u0631\u0629 + \u0627\u0644\u0635\u0648\u062a */}
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="font-black text-stone-400 text-xs">\u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u062e\u0635\u064a\u0629 (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)</Label>
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
                  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) { setPreviewFile(null); setIsLoading(false); }
  }, [isOpen]);

  const processFile = (file: File) => {
    if (!file.type.startsWith('audio/')) { toast.error('\u064a\u064f\u0642\u0628\u0644 \u0641\u0642\u0637 \u0645\u0644\u0641\u0627\u062a \u0635\u0648\u062a\u064a\u0629'); return; }
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
      <div className="relative w-full max-w-lg mx-4 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)]" style={{ background: '#111' }}>
        <div className="relative px-10 pt-10 pb-6" style={{ background: `linear-gradient(135deg, #1a1a1a, #2a2a2a)` }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 80% 50%, ${themeColor} 0%, transparent 60%)` }} />
          <button onClick={onClose} className="absolute top-6 left-6 w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-all">
            <X size={18} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: themeColor }}>
              <Mic size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-black text-2xl leading-tight">\u0631\u0641\u0639 \u0627\u0644\u0639\u064a\u0646\u0629 \u0627\u0644\u0635\u0648\u062a\u064a\u0629</h3>
              <p className="text-white/40 text-sm font-bold mt-1">MP3 \u00b7 WAV \u00b7 AAC \u00b7 FLAC \u00b7 OGG</p>
            </div>
          </div>
        </div>
        <div className="px-8 py-8 space-y-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="relative rounded-[1.8rem] cursor-pointer transition-all duration-300 overflow-hidden"
            style={{
              border: `2.5px dashed ${isDragging ? themeColor : previewFile ? '#22c55e' : '#333'}`,
              background: isDragging ? `${themeColor}15` : previewFile ? '#0d2010' : '#1a1a1a',
              minHeight: '190px',
            }}
          >
            <input ref={inputRef} type="file" accept="audio/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
            <div className="flex flex-col items-center justify-center p-10 text-center h-full">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse" style={{ background: `${themeColor}30` }}>
                    <CloudUpload size={28} style={{ color: themeColor }} />
                  </div>
                  <p className="text-white/50 font-bold text-sm">\u062c\u0627\u0631\u064d \u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0645\u0644\u0641...</p>
                </div>
              ) : previewFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-end gap-[3px] h-12 mb-1">
                    {[6, 12, 18, 24, 30, 22, 16, 28, 20, 14, 26, 18, 10, 24, 16].map((h, i) => (
                      <div key={i} className="w-[5px] rounded-full animate-pulse" style={{ height: `${h * 1.3}px`, background: '#22c55e', animationDelay: `${i * 0.07}s`, opacity: 0.7 + (i % 3) * 0.1 }} />
                    ))}
                  </div>
                  <CheckCircle2 size={32} className="text-green-400" />
                  <p className="text-green-300 font-black text-base truncate max-w-[260px]">{previewFile.name}</p>
                  <p className="text-green-500/60 text-xs font-bold">{previewFile.size} \u00b7 \u062a\u0645 \u0627\u0644\u062a\u062d\u0642\u0642 \u2713</p>
                  <p className="text-white/30 text-xs mt-1">\u0627\u0646\u0642\u0631 \u0644\u0627\u062e\u062a\u064a\u0627\u0631 \u0645\u0644\u0641 \u0622\u062e\u0631</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300" style={{ background: isDragging ? `${themeColor}30` : '#252525', transform: isDragging ? 'scale(1.15)' : 'scale(1)' }}>
                    <CloudUpload size={30} style={{ color: isDragging ? themeColor : '#555' }} />
                  </div>
                  <p className="font-black text-white/70 text-base mb-1">{isDragging ? '\u0623\u0641\u0644\u062a \u0627\u0644\u0645\u0644\u0641 \u0647\u0646\u0627' : '\u0627\u0633\u062d\u0628 \u0645\u0644\u0641 \u0627\u0644\u0635\u0648\u062a \u0648\u0623\u0641\u0644\u062a\u0647 \u0647\u0646\u0627'}</p>
                  <p className="text-white/30 text-sm font-bold">\u0623\u0648 \u0627\u0646\u0642\u0631 \u0644\u0627\u062e\u062a\u064a\u0627\u0631 \u0645\u0646 \u0627\u0644\u062c\u0647\u0627\u0632</p>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 h-14 rounded-2xl font-black text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all" style={{ background: '#1c1c1c' }}>\u0625\u0644\u063a\u0627\u0621</button>
            <button onClick={handleConfirm} disabled={!previewFile} className="flex-2 flex-1 h-14 rounded-2xl font-black text-white shadow-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed" style={{ background: previewFile ? themeColor : '#333', flex: 2 }}>
              {previewFile ? '\u062a\u0623\u0643\u064a\u062f \u0648\u0627\u0639\u062a\u0645\u0627\u062f \u0627\u0644\u0639\u064a\u0646\u0629' : '\u0627\u062e\u062a\u0631 \u0645\u0644\u0641\u0627\u064b \u0623\u0648\u0644\u0627\u064b'}
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
    language: '\u0639\u0631\u0628\u064a\u0629 \u0641\u0635\u062d\u0649', bio: '', image: '', audio: '', audioName: '',
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
    toast.success('\u062a\u0645 \u062a\u062d\u0645\u064a\u0644 \u0639\u064a\u0646\u0629 \u0627\u0644\u0623\u062f\u0627\u0621 \u0628\u0646\u062c\u0627\u062d');
  };

  // \u2705 \u0627\u0644\u062a\u0639\u062f\u064a\u0644 1: \u064a\u0643\u0641\u064a \u0627\u0644\u0627\u0633\u0645 \u0641\u0642\u0637 \u0644\u0644\u0625\u0636\u0627\u0641\u0629
  const handleAddArtist = () => {
    if (!newArtist.name.trim()) {
      toast.error('\u0627\u0644\u0627\u0633\u0645 \u0645\u0637\u0644\u0648\u0628');
      return;
    }
    const slug = arabicToSlug(newArtist.name);
    const artistToAdd = {
      ...newArtist,
      id: Date.now(),
      rating: 5.0,
      slug,
      // \u2705 \u0625\u0630\u0627 \u0644\u0645 \u062a\u0631\u0641\u0639 \u0635\u0648\u062a\u0627\u064b \u064a\u0623\u062e\u0630 \u0627\u0644\u0639\u064a\u0646\u0629 \u0627\u0644\u0627\u0641\u062a\u0631\u0627\u0636\u064a\u0629
      audio: newArtist.audio || `/audio/${slug}.mp3`,
      audioName: newArtist.audioName || `${slug}.mp3`,
      // \u2705 \u0625\u0630\u0627 \u0644\u0645 \u062a\u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u064a\u0623\u062e\u0630 \u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0627\u0641\u062a\u0631\u0627\u0636\u064a\u0629
      image: newArtist.image || `/images/${slug}.jpg`,
      experience: newArtist.experienceYears ? `${newArtist.experienceYears} \u0633\u0646\u0648\u0627\u062a` : '\u063a\u064a\u0631 \u0645\u062d\u062f\u062f',
      language: newArtist.language || '\u0639\u0631\u0628\u064a\u0629 \u0641\u0635\u062d\u0649',
    };
    const updatedArtists = [artistToAdd, ...artists];
    setArtists(updatedArtists);
    // \u2705 \u0627\u0644\u062a\u0639\u062f\u064a\u0644 2: \u062d\u0641\u0638 \u062f\u0627\u0626\u0645 \u0641\u064a localStorage
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(updatedArtists));
    // \u2705 \u062d\u0641\u0638 \u0627\u0644\u0639\u064a\u0646\u0629 \u0641\u064a \u0645\u0641\u062a\u0627\u062d \u062e\u0627\u0635 \u0628\u0627\u0644\u0641\u0646\u0627\u0646 \u062d\u062a\u0649 \u062a\u0638\u0647\u0631 \u0641\u064a \u0645\u0644\u0641\u0647 \u0627\u0644\u0634\u062e\u0635\u064a
    localStorage.setItem(`voxdub_samples_${artistToAdd.id}`, JSON.stringify([
      { id: 1, title: `\u0639\u064a\u0646\u0629 ${newArtist.name}`, url: artistToAdd.audio }
    ]));
    setIsAddDialogOpen(false);
    setNewArtist({ name: '', role: '', gender: '', experienceYears: '', language: '\u0639\u0631\u0628\u064a\u0629 \u0641\u0635\u062d\u0649', bio: '', image: '', audio: '', audioName: '' });
    toast.success(`\u062a\u0645\u062a \u0625\u0636\u0627\u0641\u0629 ${newArtist.name} \u0628\u0646\u062c\u0627\u062d`);
  };

  const handleDeleteArtist = (id: number) => {
    const updated = artists.filter((a: any) => a.id !== id);
    setArtists(updated);
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(updated));
    localStorage.removeItem(`voxdub_samples_${id}`);
    toast.success('\u062a\u0645 \u062d\u0630\u0641 \u0627\u0644\u0645\u0639\u0644\u0642');
  };

  const toggleAudio = (id: number, audioUrl: string) => {
    if (playingId === id) { currentAudio?.pause(); setPlayingId(null); }
    else {
      if (currentAudio) currentAudio.pause();
      const audio = new Audio(audioUrl);
      audio.play().catch(() => toast.error('\u0627\u0644\u0639\u064a\u0646\u0629 \u063a\u064a\u0631 \u0645\u062a\u0648\u0641\u0631\u0629'));
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
          \u0627\u0644\u0645\u0643\u062a\u0628\u0629 <span style={{ color: themeColor }}>\u0627\u0644\u0635\u0648\u062a\u064a\u0629</span>
        </h1>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-16 px-10 rounded-2xl font-black text-white shadow-2xl transition-transform hover:scale-105 active:scale-95" style={{ backgroundColor: themeColor }}>
              <UserPlus className="ml-3" /> \u0625\u0636\u0627\u0641\u0629 \u0645\u0624\u062f\u064a \u0644\u0644\u0645\u0646\u0635\u0629
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none rounded-[3rem] bg-white shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
            <div className="vox-gradient-header p-10 text-white relative">
              <Headset className="absolute left-10 top-10 opacity-10" size={120} />
              <h2 className="text-3xl font-black mb-2">\u062a\u0633\u062c\u064a\u0644 \u0645\u0639\u0644\u0642 \u062c\u062f\u064a\u062f</h2>
              <p className="text-stone-400 font-bold italic">\u064a\u0643\u0641\u064a \u0627\u0644\u0627\u0633\u0645 \u0644\u0644\u0628\u062f\u0621 \u2014 \u0628\u0642\u064a\u0629 \u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644 \u0641\u064a \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a</p>
            </div>

            <div className="p-10 space-y-8">
              {/* \u0627\u0644\u0635\u0648\u0631\u0629 + \u0627\u0644\u0635\u0648\u062a */}
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="font-black text-stone-400 text-xs">\u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u062e\u0635\u064a\u0629 (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)</Label>
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
                
