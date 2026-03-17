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

const officialArtists = [
  { id: 1, name: "مصطفى جغلال", role: "صوت احترافي ومتزن (الحكواتي)", gender: "ذكر", experience: "12 سنة", image: "/images/mustapha.jpg", language: "فصحى وإنجليزي", audio: "/audio/mustapha.mp3", isArchived: false },
  { id: 2, name: "لميس حميمي", role: "صوت ناعم ومقنع", gender: "أنثى", experience: "7 سنوات", image: "/images/lamis.jpg", language: "عربي وفرنسي", audio: "/audio/lamis.mp3", isArchived: false },
  { id: 3, name: "بلهادي محمد إسلام", role: "صوت عميق وقوي", gender: "ذكر", experience: "8 سنوات", image: "/images/islam.jpg", language: "عربي فصحى", audio: "/audio/islam.mp3", isArchived: false },
  { id: 4, name: "أحمد حاج إسماعيل", role: "صوت حماسي وشبابي", gender: "ذكر", experience: "6 سنوات", image: "/images/ahmed.jpg", language: "فصحى وعامية", audio: "/audio/ahmed.mp3", isArchived: false },
  { id: 5, name: "منال إبراهيمي", role: "صوت درامي ومؤثر", gender: "أنثى", experience: "5 سنوات", image: "/images/manal.jpg", language: "عربي فصحى", audio: "/audio/manal.mp3", isArchived: false },
  { id: 6, name: "آدم حمدوني", role: "صوت دافئ وجذاب", gender: "ذكر", experience: "10 سنوات", image: "/images/adam.jpg", language: "عربي فصحى وعامية", audio: "/audio/adam.mp3", isArchived: false }
];

// 🟢 دالة تحويل الأسماء العربية إلى إنجليزية للروابط
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
          <div
