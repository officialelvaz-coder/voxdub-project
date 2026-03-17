import React, { useState, useEffect } from 'react';
import { Mic2, LogIn, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase'; // تأكد من مسار ملف السوبابيز أو قاعدة بياناتك

export function Login() {
  const [password, setPassword] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [artistsList, setArtistsList] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const themeColor = localStorage.getItem('voxdub_theme') || '#e11d48';

  // 1. تنظيف الجلسة القديمة عند فتح الصفحة
  useEffect(() => {
    localStorage.removeItem('voxdub_user_role');
    localStorage.removeItem('voxdub_logged_artist_id');
    
    // 2. جلب المعلقين تلقائياً من قاعدة البيانات
    const fetchArtists = async () => {
      try {
        setIsLoading(true);
        // ملاحظة: استبدل 'artists' باسم الجدول الحقيقي لديك
        const { data, error: dbError } = await supabase
          .from('artists') 
          .select('id, name')
          .order('name', { ascending: true });

        if (dbError) throw dbError;
        setArtistsList(data || []);
      } catch (err: any) {
        console.error("Error fetching artists:", err);
        setError("فشل تحميل قائمة المعلقين");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // تسجيل دخول المديرة
    if (password === 'admin123') {
      localStorage.setItem('voxdub_user_role', 'admin');
      window.location.href = '/dashboard';
      return;
    }

    // تسجيل دخول المعلق الصوتي
    if (selectedArtist && password === 'artist123') {
      localStorage.setItem('voxdub_user_role', 'artist');
      localStorage.setItem('voxdub_logged_artist_id', selectedArtist);
      window.location.href = '/dashboard';
      return;
    }

    alert('كلمة المرور غير صحيحة');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div 
            className="p-4 rounded-full mb-4"
            style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
          >
            <Mic2 size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Voxdub Portal</h1>
          <p className="text-gray-500">منصة إدارة التعليق الصوتي</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختر الحساب
            </label>
            <select
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 outline-none transition-all"
              style={{ '--tw-ring-color': themeColor } as any}
              disabled={isLoading}
            >
              <option value="">مديرة الموقع (Admin)</option>
              {isLoading ? (
                <option>جاري التحميل...</option>
              ) : (
                artistsList.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name} (معلق صوتي)
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 outline-none transition-all"
              style={{ '--tw-ring-color': themeColor } as any}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:bg-gray-400"
            style={{ backgroundColor: themeColor }}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
}
