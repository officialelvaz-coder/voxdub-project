'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../components/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mic2, Upload, LogOut, User, Music,
  Plus, Eye, Users, FileText,
  Bell, CheckCircle, Check, X, Trash2
} from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:     { label: 'في الانتظار',     color: 'bg-yellow-100 text-yellow-700' },
  accepted:    { label: 'تم القبول',        color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'جاري التنفيذ',    color: 'bg-purple-100 text-purple-700' },
  review:      { label: 'بحاجة للمراجعة', color: 'bg-orange-100 text-orange-700' },
  completed:   { label: 'مكتمل',           color: 'bg-green-100 text-green-700' },
};

const statusOptions = [
  { value: 'pending',     label: 'في الانتظار' },
  { value: 'accepted',    label: 'تم القبول' },
  { value: 'in_progress', label: 'جاري التنفيذ' },
  { value: 'review',      label: 'بحاجة للمراجعة' },
  { value: 'completed',   label: 'مكتمل' },
];

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [artist, setArtist] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allArtists, setAllArtists] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [audioSample, setAudioSample] = useState<File | null>(null);
  const [sampleName, setSampleName] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'artists' | 'orders' | 'profile' | 'audio'>('artists');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('userRole');
    if (!userId) { router.push('/login'); return; }

    if (role === 'admin') {
      setIsAdmin(true);
      setActiveTab('artists');
      const fetchAll = async () => {
        try {
          const artistsSnap = await getDocs(collection(db, 'artists'));
          setAllArtists(artistsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          const ordersSnap = await getDocs(collection(db, 'orders'));
          setAllOrders(ordersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) { console.error(err); }
        setLoading(false);
      };
      fetchAll();
    } else {
      const fetchArtist = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'artists', userId));
          if (docSnap.exists()) setArtist({ id: docSnap.id, ...docSnap.data() });
        } catch (err) { console.error(err); }
        setLoading(false);
      };
      fetchArtist();
    }
  }, [mounted, router]);

  const handleApprove = async (artistId: string) => {
    try {
      await updateDoc(doc(db, 'artists', artistId), { approved: true });
      setAllArtists(prev => prev.map(a => a.id === artistId ? { ...a, approved: true } : a));
    } catch (err) { console.error(err); }
  };

  const handleReject = async (artistId: string) => {
    try {
      await updateDoc(doc(db, 'artists', artistId), { approved: false });
      setAllArtists(prev => prev.map(a => a.id === artistId ? { ...a, approved: false } : a));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (artistId: string, artistName: string) => {
    if (!confirm(`هل أنت متأكد من حذف المعلق "${artistName}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) return;
    setDeletingId(artistId);
    try {
      await deleteDoc(doc(db, 'artists', artistId));
      setAllArtists(prev => prev.filter(a => a.id !== artistId));
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحذف.');
    }
    setDeletingId(null);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) { console.error(err); }
  };

  const handleProfilePicUpload = async () => {
    if (!profilePic || !artist) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `profile_pics/${artist.id}`);
      await uploadBytes(storageRef, profilePic);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'artists', artist.id), { profilePicture: url });
      setArtist({ ...artist, profilePicture: url });
      alert('تم تحديث الصورة!');
    } catch (err) { alert('حدث خطأ.'); }
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
      await updateDoc(doc(db, 'artists', artist.id), { audioSamples: arrayUnion(newSample) });
      setArtist({ ...artist, audioSamples: [...(artist.audioSamples || []), newSample] });
      setSampleName(''); setAudioSample(null);
      alert('تم رفع العينة!');
    } catch (err) { alert('حدث خطأ.'); }
    setUploading(false);
  };

  const handleLogout = () => { localStorage.clear(); router.push('/login'); };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-xl font-black text-red-600 animate-pulse">جاري التحميل...</div>
      </div>
    );
  }

  // ===== واجهة المديرة =====
  if (isAdmin) {
    const pendingArtists = allArtists.filter(a => !a.approved);
    const approvedArtists = allArtists.filter(a => a.approved);
    const completedOrders = allOrders.filter(o => o.status === 'completed');

    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap'); * { font-family: 'Cairo', sans-serif; }`}</style>

        <header className="bg-gray-900 text-white px-8 py-5 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl"><Mic2 className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-black">Vox<span className="text-red-500">Dub</span> — لوحة المديرة</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white font-bold text-sm transition">الواجهة الرئيسية</Link>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm hover:bg-red-700 transition">
              <LogOut size={16} /> خروج
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* إحصائيات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'إجمالي المعلقين', value: allArtists.length, color: 'bg-blue-500', icon: Users },
              { label: 'بانتظار الموافقة', value: pendingArtists.length, color: 'bg-yellow-500', icon: Bell },
              { label: 'إجمالي الطلبات', value: allOrders.length, color: 'bg-purple-500', icon: FileText },
              { label: 'طلبات مكتملة', value: completedOrders.length, color: 'bg-green-500', icon: CheckCircle },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                <div className="text-gray-500 font-bold text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            {[
              { key: 'artists', label: 'المعلقون', icon: Users },
              { key: 'orders', label: 'الطلبات', icon: FileText },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${activeTab === tab.key ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                <tab.icon size={16} />
                {tab.label}
                {tab.key === 'artists' && pendingArtists.length > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{pendingArtists.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* تبويب المعلقين */}
          {activeTab === 'artists' && (
            <div className="space-y-6">
              {/* بانتظار الموافقة */}
              {pendingArtists.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-yellow-200 overflow-hidden">
                  <div className="px-8 py-5 border-b border-yellow-100 bg-yellow-50">
                    <h2 className="text-lg font-black text-yellow-800">⏳ بانتظار الموافقة ({pendingArtists.length})</h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {pendingArtists.map(a => (
                      <div key={a.id} className="px-8 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-400 text-lg">
                            {a.name?.[0] || '?'}
                          </div>
                          <div>
                            <p className="font-black text-gray-900">{a.name}</p>
                            <p className="text-sm text-gray-500 font-bold">{a.email} | {a.voiceType} | {a.gender}</p>
                            {a.tagline && <p className="text-xs text-gray-400 font-bold italic mt-0.5">"{a.tagline}"</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleApprove(a.id)}
                            className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-full font-black text-sm hover:bg-green-700 transition">
                            <Check size={14} /> موافقة
                          </button>
                          <button onClick={() => handleReject(a.id)}
                            className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-black text-sm hover:bg-yellow-200 transition">
                            <X size={14} /> رفض
                          </button>
                          <button
                            onClick={() => handleDelete(a.id, a.name)}
                            disabled={deletingId === a.id}
                            className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm hover:bg-red-700 transition disabled:bg-gray-300"
                          >
                            <Trash2 size={14} />
                            {deletingId === a.id ? '...' : 'حذف'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* المعلقون النشطون */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-black text-gray-900">✅ المعلقون النشطون ({approvedArtists.length})</h2>
                  <Link href="/register" className="bg-red-600 text-white px-5 py-2 rounded-full font-black text-sm hover:bg-red-700 transition flex items-center gap-2">
                    <Plus size={16} /> إضافة معلق
                  </Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {approvedArtists.map(a => (
                    <div key={a.id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          {a.profilePicture ? (
                            <img src={a.profilePicture} alt={a.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-black text-lg">
                              {a.name?.[0] || '?'}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-gray-900">{a.name}</p>
                          <p className="text-sm text-gray-500 font-bold">{a.voiceType} | {a.gender}</p>
                          {a.tagline && <p className="text-xs text-gray-400 font-bold italic mt-0.5">"{a.tagline}"</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${a.audioSamples?.length > 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {a.audioSamples?.length > 0 ? `${a.audioSamples.length} عينة` : 'بدون عينة'}
                        </span>
                        <button onClick={() => handleReject(a.id)} className="text-gray-400 hover:text-yellow-600 font-bold text-xs transition">
                          إلغاء الموافقة
                        </button>
                        <Link href={`/artists/${a.id}`} className="flex items-center gap-1 text-gray-500 hover:text-red-600 font-bold text-sm transition">
                          <Eye size={16} /> عرض
                        </Link>
                        <button
                          onClick={() => handleDelete(a.id, a.name)}
                          disabled={deletingId === a.id}
                          className="flex items-center gap-1 text-red-400 hover:text-red-600 font-bold text-sm transition disabled:text-gray-300"
                        >
                          <Trash2 size={16} />
                          {deletingId === a.id ? '...' : 'حذف'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تبويب الطلبات */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {allOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-100">
                  <FileText size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-black text-lg">لا توجد طلبات بعد</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(s => (
                      <span key={s.value} className={`px-4 py-2 rounded-full text-xs font-black ${statusConfig[s.value]?.color}`}>
                        {s.label} ({allOrders.filter(o => o.status === s.value).length})
                      </span>
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-50">
                      {allOrders.map(order => {
                        const status = statusConfig[order.status] || statusConfig.pending;
                        return (
                          <div key={order.id} className="px-8 py-6 hover:bg-gray-50 transition">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h3 className="font-black text-gray-900">{order.selectedPackage}</h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-black ${status.color}`}>{status.label}</span>
                                </div>
                                <p className="text-gray-500 font-bold text-sm">العميل: <span className="text-gray-700">{order.clientName || 'غير محدد'}</span></p>
                                <p className="text-gray-500 font-bold text-sm">المعلق: <span className="text-gray-700">{order.selectedVoiceActor}</span></p>
                                <p className="text-gray-500 font-bold text-sm">نوع العمل: <span className="text-gray-700">{order.workType}</span></p>
                                {order.description && <p className="text-gray-400 font-bold text-xs mt-2 line-clamp-2">{order.description}</p>}
                              </div>
                              <div className="flex-shrink-0">
                                <label className="block text-xs font-black text-gray-500 mb-1">تغيير الحالة</label>
                                <select value={order.status || 'pending'} onChange={e => handleStatusChange(order.id, e.target.value)}
                                  className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-gray-700 font-bold text-sm outline-none focus:border-red-400">
                                  {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== واجهة المعلق =====
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap'); * { font-family: 'Cairo', sans-serif; }`}</style>

      <header className="bg-gray-900 text-white px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-xl"><Mic2 className="w-5 h-5 text-white" /></div>
          <span className="text-xl font-black">Vox<span className="text-red-500">Dub</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white font-bold text-sm transition">الواجهة الرئيسية</Link>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm hover:bg-red-700 transition">
            <LogOut size={16} /> خروج
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-gray-900 text-white rounded-3xl p-8 mb-8 flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-700 flex-shrink-0">
            {artist?.profilePicture ? (
              <img src={artist.profilePicture} alt={artist.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-gray-400">
                {artist?.name?.[0] || '?'}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black">{artist?.name}</h1>
            {artist?.tagline && <p className="text-red-400 font-black text-sm italic mt-1">"{artist.tagline}"</p>}
            <p className="text-gray-400 font-bold mt-1">{artist?.voiceType} | {artist?.gender}</p>
            <p className="text-gray-500 text-sm font-bold mt-1">{artist?.audioSamples?.length || 0} عينة صوتية</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          {[
            { key: 'profile', label: 'الصورة الشخصية', icon: User },
            { key: 'audio', label: 'العينات الصوتية', icon: Music },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${activeTab === tab.key ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6">تحديث الصورة الشخصية</h2>
            <div className="flex flex-col items-center gap-6">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100">
                {artist?.profilePicture ? (
                  <img src={artist.profilePicture} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-black text-gray-300">
                    {artist?.name?.[0] || '?'}
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={e => setProfilePic(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:font-black file:bg-red-50 file:text-red-600 hover:file:bg-red-100" />
              <button onClick={handleProfilePicUpload} disabled={uploading || !profilePic}
                className="w-full bg-red-600 text-white py-3 rounded-2xl font-black hover:bg-gray-900 disabled:bg-gray-200 transition-all flex items-center justify-center gap-2">
                <Upload size={18} />
                {uploading ? 'جاري الرفع...' : 'تحديث الصورة'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-6">رفع عينة صوتية جديدة</h2>
              <div className="space-y-4">
                <input type="text" value={sampleName} onChange={e => setSampleName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-bold text-sm"
                  placeholder="اسم العينة (مثلاً: إعلان تجاري)" />
                <input type="file" accept="audio/*" onChange={e => setAudioSample(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:font-black file:bg-green-50 file:text-green-600 hover:file:bg-green-100" />
                <button onClick={handleAudioUpload} disabled={uploading || !audioSample || !sampleName}
                  className="w-full bg-green-600 text-white py-3 rounded-2xl font-black hover:bg-gray-900 disabled:bg-gray-200 transition-all flex items-center justify-center gap-2">
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
