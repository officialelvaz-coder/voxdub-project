
'use client';

import React, { useState, useEffect } from 'react';
import { Mic2, LogIn } from 'lucide-react';
import { db } from '../components/firebase'; // تم تصحيح المسار هنا
import { collection, getDocs } from 'firebase/firestore';

export function Login() {
  const [password, setPassword] = useState('');
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const [artistsList, setArtistsList] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [themeColor] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('voxdub_theme') : '#e11d48') || '#e11d48');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "artists"));
        const artists = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        setArtistsList(artists);
      } catch (error) {
        console.error("Error fetching artists: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedArtistId && password === 'admin123') {
      localStorage.setItem('voxdub_user_role', 'admin');
      window.location.href = '/dashboard/artists';
      return;
    }

    if (selectedArtistId && password === 'artist123') {
      localStorage.setItem('voxdub_user_role', 'artist');
      localStorage.setItem('voxdub_logged_artist_id', selectedArtistId);
      window.location.href = `/dashboard/artists/${selectedArtistId}`;
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
          <p className="text-stone-400 font-bold mt-2">اختر حسابك للولوج</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-stone-700 mb-2 mr-1">الحساب</label>
            <select
              value={selectedArtistId}
              onChange={(e) => setSelectedArtistId(e.target.value)}
              className="w-full h-14 px-4 rounded-2xl border border-stone-200 focus:ring-2 outline-none font-bold text-stone-600 bg-stone-50 transition-all"
              style={{ '--tw-ring-color': themeColor } as any}
              disabled={loading}
            >
              <option value="">{loading ? 'جاري التحميل...' : 'دخول كمدير (المديرة لميس)'}</option>
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
            className="w-full text-white h-14 rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg active:scale-95"
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
