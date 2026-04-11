'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../components/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mic2, Upload, LogOut, User, Music, 
  Plus, Eye, Settings, Users, FileText,
  BarChart3, Bell, ChevronLeft
} from 'lucide-react';

const Dashboard = () => {
  const [artist, setArtist] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allArtists, setAllArtists] = useState<any[]>([]);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [audioSample, setAudioSample] = useState<File | null>(null);
  const [sampleName, setSampleName] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'audio' | 'admin'>('profile');
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('userRole');

    if (!userId) {
      router.push('/login');
      return;
    }

    if (role === 'admin') {
      setIsAdmin(true);
      setActiveTab('admin');
      // جلب كل المعلقين للمدير
      const fetchAllArtists = async () => {
        try {
          const snapshot = await getDocs(collection(db, 'artists'));
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAllArtists(data);
        } catch (err) {
          console.error(err);
        }
        setLoading(false);
      };
      fetchAllArtists();
    } else {
      const fetchArtist = async () => {
        try {
          const docRef = doc(db, 'artists', userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setArtist({ id: docSnap.id, ...docSnap.data() });
          }
        } catch (err) {
          console.error(err);
        }
        setLoading(false);
      };
      fetchArtist();
    }
  }, [router]);

  const handleProfilePicUpload = async () => {
    if (!profilePic || !artist) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `profile_pics/${artist.id}`);
      await uploadBytes(storageRef, profilePic);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'artists', artist.id), { profilePicture: url });
      setArtist({ ...artist, profilePicture: url });
      alert('تم تحديث الصورة الشخصية بنجاح!');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الرفع.');
    }
    setUploading(false);
  };

  const handleAudioUpload = async () => {
    if (!audioSample || !sampleName || !artist) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `audio_samples/${artist.id}/${Date.now()}_${audioSample.name}`);
      await uploadBytes(storageRef, audioSample);
      const url = await getDownloadURL(storageRef);
      const newSample = { name: sampleName, url };
      await updateDoc(doc(db, 'artists', artist.id), {
        audioSamples: arrayUnion(newSample)
      });
      setArtist({
        ...artist,
        audioSamples: [...(artist.audioSamples || []), newSample]
      });
      setSampleName('');
      setAudioSample(null);
      alert('تم رفع العينة الصوتية بنجاح!');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الرفع.');
    }
    setUploading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-xl font-black text-red-600 animate-pulse">جاري تحميل بياناتك...</div>
      </div>
    );
  }

  // ===== واجهة المدير =====
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap'); * { font-family: 'Cairo', sans-serif; }`}</style>

        {/* Header المدير */}
        <header className="bg-gray-900 text-white px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl">
              <Mic2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black">Vox<span className="text-red-500">Dub</span> — لوحة المدير</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white font-bold text-sm transition">
              الواجهة الرئيسية
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm hover:bg-red-700 transition">
              <LogOut size={16} /> خروج
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'إجمالي المعلقين', value: allArtists.length, icon: Users, color: 'bg-blue-500' },
              { label: 'المعلقون النشطون', value: allArtists.filter(a => a.audioSamples?.length > 0).length, icon: Music, color: 'bg-green-500' },
              { label: 'بدون عينة صوتية', value: allArtists.filter(a => !a.audioSamples?.length).length, icon: Bell, color: 'bg-yellow-500' },
              { label: 'إجمالي العينات', value: allArtists.reduce((acc, a) => acc + (a.audioSamples?.length || 0), 0), icon: BarChart3, color: 'bg-red-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                <div className="text-gray-500 font-bold text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* قائمة المعلقين */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900">قائمة المعلقين الصوتيين</h2>
              <Link href="/register" className="bg-red-600 text-white px-5 py-2 rounded-full font-black text-sm hover:bg-red-700 transition flex items-center gap-2">
                <Plus size={16} /> إضافة معلق
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {allArtists.map((a) => (
                <div key={a.id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {a.profilePicture ? (
                        <img src={a.profilePicture} alt={a.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-black text-lg">
                          {a.name?.[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-black text-gray-900">{a.name}</p>
                      <p className="text-sm text-gray-500 font-bold">{a.voiceType || a.style || ''} | {a.gender || ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${a.audioSamples?.length > 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {a.audioSamples?.length > 0 ? `${a.audioSamples.length} عينة` : 'بدون عينة'}
                    </span>
                    <Link href={`/artists/${a.id}`} className="flex items-center gap-1 text-gray-500 hover:text-red-600 font-bold text-sm transition">
                      <Eye size={16} /> عرض
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== واجهة المعلق =====
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap'); * { font-family: 'Cairo', sans-serif; }`}</style>

      {/* Header */}
      <header className="bg-gray-900 text-white px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-xl">
            <Mic2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black">Vox<span className="text-red-500">Dub</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white font-bold text-sm transition">
            الواجهة الرئيسية
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm hover:bg-red-700 transition">
            <LogOut size={16} /> خروج
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* معلومات المعلق */}
        <div className="bg-gray-900 text-white rounded-3xl p-8 mb-8 flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-700 flex-shrink-0">
            {artist?.profilePicture ? (
              <img src={artist.profilePicture} alt={artist.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-gray-400">
                {artist?.name?.[0]}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black">{artist?.name}</h1>
            <p className="text-gray-400 font-bold">{artist?.voiceType || artist?.style} | {artist?.gender}</p>
            <p className="text-gray-500 text-sm font-bold mt-1">{artist?.audioSamples?.length || 0} عينة صوتية مرفوعة</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          {[
            { key: 'profile', label: 'الصورة الشخصية', icon: User },
            { key: 'audio', label: 'العينات الصوتية', icon: Music },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${activeTab === tab.key ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* تبويب الصورة */}
        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6">تحديث الصورة الشخصية</h2>
            <div className="flex flex-col items-center gap-6">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 border-4 border-gray-50">
                {artist?.profilePicture ? (
                  <img src={artist.profilePicture} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-black text-gray-300">
                    {artist?.name?.[0]}
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={e => setProfilePic(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:font-black file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
              />
              <button
                onClick={handleProfilePicUpload}
                disabled={uploading || !profilePic}
                className="w-full bg-red-600 text-white py-3 rounded-2xl font-black hover:bg-gray-900 disabled:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Upload size={18} />
                {uploading ? 'جاري الرفع...' : 'تحديث الصورة'}
              </button>
            </div>
          </div>
        )}

        {/* تبويب العينات الصوتية */}
        {activeTab === 'audio' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-6">رفع عينة صوتية جديدة</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={sampleName}
                  onChange={e => setSampleName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-bold text-sm"
                  placeholder="اسم العينة (مثلاً: إعلان تجاري)"
                />
                <input
                  type="file"
                  accept="audio/*"
                  onChange={e => setAudioSample(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:font-black file:bg-green-50 file:text-green-600 hover:file:bg-green-100"
                />
                <button
                  onClick={handleAudioUpload}
                  disabled={uploading || !audioSample || !sampleName}
                  className="w-full bg-green-600 text-white py-3 rounded-2xl font-black hover:bg-gray-900 disabled:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  {uploading ? 'جاري الرفع...' : 'رفع العينة'}
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-6">عيناتك الحالية ({artist?.audioSamples?.length || 0})</h2>
              <div className="space-y-4">
                {artist?.audioSamples?.length > 0 ? (
                  artist.audioSamples.map((sample: any, i: number) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="font-black text-gray-800 mb-3 text-sm">{sample.name}</p>
                      <audio src={sample.url} controls className="w-full h-10" />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 font-bold text-center py-8">لا توجد عينات مرفوعة بعد</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/artists" className="text-red-600 hover:underline font-black text-sm">
            مشاهدة ملفك الشخصي كما يراه الآخرون ←
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
