import React, { useState, useEffect } from 'react'; // أضفنا useEffect
import { Mic2, LogIn } from 'lucide-react';

export function Login() {
  const [password, setPassword] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('1');

  // 🔴 السطر السحري: بمجرد تحميل صفحة الـ Login، نمسح كل القيود القديمة
  useEffect(() => {
    localStorage.removeItem('voxdub_user_role');
    localStorage.removeItem('voxdub_logged_artist_id');
  }, []);

  const themeColor = localStorage.getItem('voxdub_theme') || '#e11d48';

  const artistsList = [
    { id: '1', name: "مصطفى جغلال" },
    { id: '6', name: "آدم حمدوني" },
    { id: '5', name: "بلهادي محمد إسلام" },
    { id: '2', name: "لميس حميمي" }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234567890') {
      if (selectedArtist === '2') {
        localStorage.setItem('voxdub_user_role', 'admin');
        window.location.href = '/dashboard';
      } else {
        localStorage.setItem('voxdub_user_role', 'artist');
        localStorage.setItem('voxdub_logged_artist_id', selectedArtist);
        window.location.href = `/dashboard/artists/${selectedArtist}`;
      }
    } else {
      alert('كلمة المرور خاطئة!');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 text-right" dir="rtl">
       <div className="w-full max-w-[450px] bg-white rounded-[3rem] shadow-2xl p-12 border border-stone-100">
         <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-lg" style={{backgroundColor: themeColor}}>
               <Mic2 size={40} />
            </div>
            <h1 className="text-3xl font-black">تسجيل دخول المبدعين</h1>
         </div>

         <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
               <label className="font-black text-stone-400 text-xs mr-2">اختر حسابك</label>
               <select value={selectedArtist} onChange={(e)=>setSelectedArtist(e.target.value)} className="w-full p-4 rounded-2xl bg-stone-50 border-none font-black outline-none">
                  {artistsList.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
               </select>
            </div>

            <div className="space-y-2">
               <label className="font-black text-stone-400 text-xs mr-2">كلمة المرور</label>
               <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-4 rounded-2xl bg-stone-50 border-none font-black text-left" dir="ltr" />
            </div>

            <button type="submit" className="w-full py-5 rounded-2xl text-white font-black text-xl shadow-xl transition-all active:scale-95" style={{backgroundColor: themeColor}}>
               <LogIn className="inline ml-2" /> دخول
            </button>
         </form>
       </div>
    </div>
  );
}