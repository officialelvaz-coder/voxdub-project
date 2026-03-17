import React, { useState, useEffect } from 'react';
import { Mic2, LogIn } from 'lucide-react';

const officialArtists = [
  { id: "1", name: "مصننننننننننطفى جغلال" },
  { id: "2", name: "لميس حميمي" },
  { id: "3", name: "بلهادي محمد إسلام" },
  { id: "4", name: "أحمد حاج إسماعيل" }
];

export function Login() {
  const [password, setPassword] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [artistsList, setArtistsList] = useState<{id: string, name: string}[]>([]);
  
  const themeColor = localStorage.getItem('voxdub_theme') || '#e11d48';

  useEffect(() => {
    localStorage.removeItem('voxdub_user_role');
    localStorage.removeItem('voxdub_logged_artist_id');
    
    // جلب البيانات وتحديث القائمة بـ 4 فقط بدون أي تكرار
    const saved = localStorage.getItem('voxdub_artists_v2');
    let combined = saved ? JSON.parse(saved) : [...officialArtists];
    
    // التأكد من أخذ أول 4 فقط وتجنب أي حساب "مدير" إذا تسلل للقائمة
    const finalSelection = combined
      .filter((a: any) => a.name !== "مديرة الموقع") 
      .slice(0, 4);

    setArtistsList(finalSelection);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // دخول المديرة: إذا لم يتم اختيار أي اسم من القائمة وكانت كلمة المرور صحيحة
    if (!selectedArtist && password === 'admin123') {
      localStorage.setItem('voxdub_user_role', 'admin');
      window.location.href = '/dashboard/artists';
      return;
    }

    // دخول المعلق: إذا اختار اسماً وكلمة المرور صحيحة
    if (selectedArtist && password === 'artist123') {
      localStorage.setItem('voxdub_user_role', 'artist');
      localStorage.setItem('voxdub_logged_artist_id', selectedArtist);
      window.location.href = `/dashboard/artists/${selectedArtist}`;
      return;
    }

    alert('خطأ في البيانات: تأكد من اختيار الحساب الصحيح أو كلمة المرور');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-right" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-stone-100">
        <div className="flex flex-col items-center mb-8">
          <div className="p-5 rounded-[1.5rem] mb-4" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>
            <Mic2 size={40} />
          </div>
          <h1 className="text-3xl font-black text-stone-900 italic">Voxdub <span style={{ color: themeColor }}>Portal</span></h1>
          <p className="text-stone-400 font-bold mt-2 text-center">قم باختيار حسابك للولوج للمنصة</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-stone-700 mb-2 mr-1">نوع الحساب</label>
            <select
              key={artistsList.length}
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
              className="w-full h-14 px-4 rounded-2xl border border-stone-200 focus:ring-2 outline-none font-bold text-stone-600 bg-stone-50 transition-all"
              style={{ '--tw-ring-color': themeColor } as any}
            >
              {/* خيار المديرة هو الافتراضي ولا يوجد لها حساب ضمن الأسماء */}
              <option value="">دخول كمدير (Admin)</option>
              {artistsList.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name} (معلق)
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
            className="w-full text-white h-14 rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg active:scale-95"
            style={{ backgroundColor: themeColor }}
          >
            <LogIn size={20} />
            تأكيد الدخول
          </button>
          
          <p className="text-[10px] text-center text-stone-300 font-bold">
            ملاحظة: إذا كنت مديراً، اترك خيار الحساب فارغاً وأدخل كلمة المرور مباشرة.
          </p>
        </form>
      </div>
    </div>
  );
}
