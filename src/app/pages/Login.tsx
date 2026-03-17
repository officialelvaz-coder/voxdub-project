import React, { useState, useEffect } from 'react';
import { Mic2, LogIn } from 'lucide-react';

// نترك هذه القائمة فارغة أو كاحتياط فقط في حال كانت الذاكرة فارغة تماماً
const defaultArtists = [
  { id: "1", name: "مصطفى جغلال" },
  { id: "2", name: "لميس حميمي" },
  { id: "3", name: "بلهادي محمد إسلام" },
  { id: "4", name: "أحمد حاج إسماعيل" }
  { id: "4", name: "زب زبي" }

];

export function Login() {
  const [password, setPassword] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [artistsList, setArtistsList] = useState<{id: string, name: string}[]>([]);
  
  const themeColor = localStorage.getItem('voxdub_theme') || '#e11d48';

  useEffect(() => {
    localStorage.removeItem('voxdub_user_role');
    localStorage.removeItem('voxdub_logged_artist_id');
    
    // 🟢 السر هنا: نجلب البيانات الحية التي تضيفها أنت من لوحة التحكم
    const saved = localStorage.getItem('voxdub_artists_v2');
    let allArtists = saved ? JSON.parse(saved) : defaultArtists;

    // 🟢 نأخذ أول 4 معلقين موجودين في الذاكرة حالياً (سواء قدامى أو جدد)
    // ونستبعد أي حساب يحمل اسم "مديرة الموقع" إذا وجد
    const topFour = allArtists
      .filter((a: any) => a.name !== "مديرة الموقع" && a.name !== "Admin")
      .slice(0, 4);

    setArtistsList(topFour);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // دخول المديرة: بدون اختيار اسم + كلمة سر المديرة
    if (!selectedArtist && password === 'admin123') {
      localStorage.setItem('voxdub_user_role', 'admin');
      window.location.href = '/dashboard/artists';
      return;
    }

    // دخول المعلق: اختيار اسم + كلمة سر المعلق
    if (selectedArtist && password === 'artist123') {
      localStorage.setItem('voxdub_user_role', 'artist');
      localStorage.setItem('voxdub_logged_artist_id', selectedArtist);
      window.location.href = `/dashboard/artists/${selectedArtist}`;
      return;
    }

    alert('تأكد من اختيار الاسم الصحيح وكلمة المرور');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-right" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-stone-100">
        <div className="flex flex-col items-center mb-8">
          <div className="p-5 rounded-[1.5rem] mb-4" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>
            <Mic2 size={40} />
          </div>
          <h1 className="text-3xl font-black text-stone-900 italic">Voxdub <span style={{ color: themeColor }}>Portal</span></h1>
          <p className="text-stone-400 font-bold mt-2">اختر حسابك للبدء</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-stone-700 mb-2 mr-1">الحساب</label>
            <select
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
              className="w-full h-14 px-4 rounded-2xl border border-stone-200 focus:ring-2 outline-none font-bold text-stone-600 bg-stone-50 transition-all"
              style={{ '--tw-ring-color': themeColor } as any}
            >
              {/* خيار المديرة مخفي برمجياً (يدخل عبر كلمة السر فقط دون اختيار اسم) */}
              <option value="">دخول كمدير (المديرة لميس)</option>
              
              {artistsList.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-black text-stone-700 mb-2 mr-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 px-4 rounded-2xl border border-stone-200 focus:ring-2 outline-none font-bold text-left bg-stone-50"
              style={{ '--tw-ring-color': themeColor } as any}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full text-white h-14 rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-stone-200 active:scale-95"
            style={{ backgroundColor: themeColor }}
          >
            <LogIn size={20} />
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}
