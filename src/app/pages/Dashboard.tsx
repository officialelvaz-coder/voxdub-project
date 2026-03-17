import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  FolderPlus, Mic, TrendingUp, Clock, Users, Star, 
  Settings, Bell, Truck, Handshake, PieChart, FolderKanban, Home, LogOut,
  PlusCircle, UserCircle, MessageSquare
} from 'lucide-react';
import { projects, stats } from '../data/mockData';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');

  // 🛡️ جلب بيانات المستخدم الحالي
  const userRole = localStorage.getItem('voxdub_user_role') || 'visitor';
  const loggedInArtistId = localStorage.getItem('voxdub_logged_artist_id');
  const isAdmin = userRole === 'admin';

  // جلب اسم المعلق الحالي إذا لم يكن أدمين
  const [userName, setUserName] = useState(isAdmin ? 'لميس حميمي' : 'المعلق الصوتي');

  useEffect(() => {
    if (!isAdmin && loggedInArtistId) {
      const saved = localStorage.getItem('voxdub_artists_v2');
      if (saved) {
        const artists = JSON.parse(saved);
        const current = artists.find((a: any) => String(a.id) === String(loggedInArtistId));
        if (current) setUserName(current.name);
      }
    }

    const handleStorage = () => {
      const color = localStorage.getItem('voxdub_theme');
      if (color) setThemeColor(color);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [isAdmin, loggedInArtistId]);

  // ⚙️ تخصيص الأزرار السريعة حسب الصلاحية
  const quickActions = isAdmin ? [
    { label: 'مشروع جديد', path: '/dashboard/new-project', icon: PlusCircle, color: '#0ea5e9' },
    { label: 'المشاريع', path: '/dashboard/projects', icon: FolderKanban, color: '#8b5cf6' },
    { label: 'المؤدون', path: '/dashboard/artists', icon: Users, color: '#ec4899' },
    { label: 'التسليم', path: '/dashboard/delivery/1', icon: Truck, color: '#f59e0b' },
    { label: 'الشركاء', path: '/dashboard/partners', icon: Handshake, color: '#10b981' },
    { label: 'الإحصائيات', path: '/dashboard/analytics', icon: PieChart, color: '#6366f1' },
    { label: 'الإشعارات', path: '/dashboard/notifications', icon: Bell, color: '#14b8a6' },
    { label: 'الإعدادات', path: '/dashboard/settings', icon: Settings, color: '#71717a' },
  ] : [
    { label: 'ملفي الشخصي', path: `/dashboard/artists/${loggedInArtistId}`, icon: UserCircle, color: themeColor },
    { label: 'رسائلي', path: `/dashboard/artists/${loggedInArtistId}`, icon: MessageSquare, color: '#8b5cf6' },
    { label: 'مشاريعي', path: '/dashboard/projects', icon: FolderKanban, color: '#0ea5e9' },
    { label: 'الإشعارات', path: '/dashboard/notifications', icon: Bell, color: '#14b8a6' },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem('voxdub_user_role');
    localStorage.removeItem('voxdub_logged_artist_id');
    toast.info("تم تسجيل الخروج");
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 text-right px-4" dir="rtl">
      <style>{`
        .text-vox-primary { color: ${themeColor} !important; }
        .bg-vox-primary { background-color: ${themeColor} !important; }
        .bg-vox-light { background-color: ${themeColor}15 !important; }
      `}</style>

      {/* Header المحدث ليتعرف على المستخدم */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[3rem] shadow-sm border border-stone-100 gap-6 mt-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-vox-primary rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-105">
            {isAdmin ? <Mic size={40} /> : <UserCircle size={40} />}
          </div>
          <div>
            <h1 className="text-4xl font-black text-stone-900 mb-1">مرحباً، {userName} 👋</h1>
            <p className="text-stone-500 font-bold italic">
              {isAdmin ? 'إليكِ لوحة التحكم المركزية لـ VoxDub' : 'أهلاً بك في مساحتك الخاصة لإدارة أعمالك'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/')} variant="outline" className="rounded-2xl font-black h-12 border-stone-200"><Home className="ml-2" size={18} /> الرئيسية</Button>
          <Button onClick={handleLogout} className="rounded-2xl font-black h-12 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border-none shadow-none transition-all"><LogOut className="ml-2" size={18} /> خروج</Button>
        </div>
      </div>

      {/* Quick Actions - تظهر حسب المستخدم */}
      <div className={`grid gap-4 ${isAdmin ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8' : 'grid-cols-2 md:grid-cols-4'}`}>
        {quickActions.map((action) => (
          <button key={action.label} onClick={() => navigate(action.path)} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-50 flex flex-col items-center gap-3 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110" style={{ backgroundColor: action.color }}>
              <action.icon size={28} />
            </div>
            <span className="text-xs font-black text-stone-700">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Stats - تظهر للمديرة فقط أو بشكل مبسط للمعلق */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'إجمالي المشاريع', val: stats.totalProjects, icon: FolderPlus },
            { label: 'مشاريع نشطة', val: stats.activeProjects, icon: Clock },
            { label: 'الإيرادات', val: `${stats.monthlyRevenue.toLocaleString()} دج`, icon: TrendingUp },
            { label: 'رضا العملاء', val: `${stats.clientSatisfaction}%`, icon: Star }
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-[2.5rem] bg-white group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-stone-50 rounded-2xl text-vox-primary group-hover:bg-vox-primary group-hover:text-white transition-all"><stat.icon size={24} /></div>
                  <Badge className="bg-green-50 text-green-600 border-none font-black">+12%</Badge>
                </div>
                <div className="text-2xl font-black text-stone-900">{stat.val}</div>
                <p className="text-xs font-bold text-stone-400 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[3rem] bg-white p-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-black text-2xl">{isAdmin ? 'آخر العمليات' : 'مشاريعي الحالية'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="p-6 rounded-[2rem] border border-stone-50 bg-stone-50/30 hover:bg-white hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-black text-lg text-stone-900 group-hover:text-vox-primary">{project.title}</h4>
                  <Badge className="bg-vox-light text-vox-primary px-4 py-1 rounded-full font-black text-[10px]">قيد التنفيذ</Badge>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* تظهر فقط للمديرة لميس */}
        {isAdmin && (
          <Card className="border-none shadow-sm rounded-[3rem] bg-white overflow-hidden">
            <div className="bg-stone-900 p-8 text-white">
              <h3 className="text-xl font-black">نجوم VoxDub ⭐</h3>
            </div>
            <CardContent className="p-8 space-y-6">
              {[{ name: 'مصطفى جغلال', rating: 5.0, initial: 'م' }].map((artist, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-vox-light text-vox-primary flex items-center justify-center font-black">{artist.initial}</div>
                    <p className="font-black text-stone-800">{artist.name}</p>
                  </div>
                  <div className="font-black text-vox-primary">{artist.rating}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
