import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  FolderPlus, Mic, TrendingUp, Clock, DollarSign, Users, Star, 
  Settings, Bell, Truck, Handshake, PieChart, FolderKanban, Home, LogOut,
  PlusCircle
} from 'lucide-react';
import { projects, stats } from '../data/mockData';
import { toast } from 'sonner';

export function Dashboard() {
  const navigate = useNavigate();
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');

  useEffect(() => {
    const handleStorage = () => {
      const color = localStorage.getItem('voxdub_theme');
      if (color) setThemeColor(color);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const quickActions = [
    { label: 'مشروع جديد', path: '/dashboard/new-project', icon: PlusCircle, color: '#0ea5e9' },
    { label: 'المشاريع', path: '/dashboard/projects', icon: FolderKanban, color: '#8b5cf6' },
    { label: 'المؤدون', path: '/dashboard/artists', icon: Users, color: '#ec4899' },
    { label: 'التسليم', path: '/dashboard/delivery/1', icon: Truck, color: '#f59e0b' },
    { label: 'الشركاء', path: '/dashboard/partners', icon: Handshake, color: '#10b981' },
    { label: 'الإحصائيات', path: '/dashboard/analytics', icon: PieChart, color: '#6366f1' },
    { label: 'الإشعارات', path: '/dashboard/notifications', icon: Bell, color: '#14b8a6' },
    { label: 'الإعدادات', path: '/dashboard/settings', icon: Settings, color: '#71717a' },
  ];

  const recentProjects = projects.slice(0, 4);

  const statusColors = {
    draft: 'bg-stone-200 text-stone-800',
    casting: 'bg-blue-100 text-blue-800',
    recording: 'bg-vox-light text-vox-primary',
    mixing: 'bg-orange-100 text-orange-800',
    review: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    delivered: 'bg-emerald-100 text-emerald-800'
  };

  const statusLabels = {
    draft: 'مسودة', casting: 'اختيار الصوت', recording: 'تسجيل',
    mixing: 'مكساج', review: 'مراجعة', completed: 'مكتمل', delivered: 'تم التسليم'
  };

  const handleLogout = () => {
    localStorage.removeItem('voxdub_user_role');
    toast.info("تم تسجيل الخروج بنجاح");
    navigate('/');
  };

  // ✅ الرجوع للرئيسية مع الحفاظ على role=admin
  const handleGoHome = () => {
    localStorage.setItem('voxdub_user_role', 'admin');
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 text-right" dir="rtl">
      <style>{`
        .text-vox-primary { color: ${themeColor} !important; }
        .bg-vox-primary { background-color: ${themeColor} !important; }
        .bg-vox-light { background-color: ${themeColor}15 !important; }
        .border-vox-primary { border-color: ${themeColor} !important; }
        .progress-fill { background-color: ${themeColor} !important; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[3rem] shadow-sm border border-stone-100 gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-vox-primary rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
            <Mic size={40} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-stone-900 mb-1">مرحباً، لميس حميمي 👋</h1>
            <p className="text-stone-500 font-bold italic">إليكِ لوحة التحكم المركزية لـ VoxDub</p>
          </div>
        </div>
        <div className="flex gap-3">
          {/* ✅ زر الرئيسية يحفظ role=admin قبل الانتقال */}
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="rounded-2xl font-black h-12 border-stone-200"
          >
            <Home className="ml-2" size={18} /> الرئيسية
          </Button>
          <Button
            onClick={handleLogout}
            className="rounded-2xl font-black h-12 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border-none shadow-none"
          >
            <LogOut className="ml-2" size={18} /> خروج
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="bg-white p-4 rounded-[2rem] shadow-sm border border-stone-50 flex flex-col items-center gap-3 hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
              style={{ backgroundColor: action.color }}
            >
              <action.icon size={24} />
            </div>
            <span className="text-[10px] font-black text-stone-600 truncate w-full px-1">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'إجمالي المشاريع', val: stats.totalProjects, icon: FolderPlus },
          { label: 'مشاريع نشطة', val: stats.activeProjects, icon: Clock },
          { label: 'الإيرادات', val: `${stats.monthlyRevenue.toLocaleString()} دج`, icon: TrendingUp },
          { label: 'رضا العملاء', val: `${stats.clientSatisfaction}%`, icon: Star }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-stone-50 rounded-2xl text-vox-primary group-hover:bg-vox-primary group-hover:text-white transition-all">
                  <stat.icon size={24} />
                </div>
                <Badge className="bg-green-50 text-green-600 border-none font-black">+12%</Badge>
              </div>
              <div className="text-2xl font-black text-stone-900">{stat.val}</div>
              <p className="text-xs font-bold text-stone-400 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[3rem] bg-white p-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-black text-2xl">آخر العمليات</CardTitle>
            <Button
              onClick={() => navigate('/dashboard/projects')}
              variant="ghost"
              className="text-vox-primary font-black hover:bg-vox-light"
            >
              كل المشاريع ←
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="p-6 rounded-[2rem] border border-stone-50 bg-stone-50/30 hover:bg-white hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-black text-lg text-stone-900 group-hover:text-vox-primary transition-colors">
                    {project.title}
                  </h4>
                  <Badge className={`${statusColors[project.status as keyof typeof statusColors]} px-4 py-1 rounded-full font-black text-[10px]`}>
                    {statusLabels[project.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                <div className="flex gap-6 text-xs font-bold text-stone-400 mb-6">
                  <span className="flex items-center gap-2"><Users size={14} /> {project.clientName}</span>
                  <span className="flex items-center gap-2"><Mic size={14} /> {project.voiceArtist}</span>
                </div>
                <Progress value={project.progress} className="h-2 bg-stone-100" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[3rem] bg-white overflow-hidden">
          <div className="bg-stone-900 p-8 text-white">
            <h3 className="text-xl font-black">نجوم VoxDub ⭐</h3>
            <p className="text-stone-400 text-xs font-bold italic mt-1">الأكثر طلباً هذا الأسبوع</p>
          </div>
          <CardContent className="p-8 space-y-6">
            {[
              { name: 'منال إبراهيمي', projects: 15, rating: 4.9, initial: 'م' },
              { name: 'بلهادي إسلام', projects: 12, rating: 4.9, initial: 'ب' },
              { name: 'مصطفى جغلال', projects: 18, rating: 5.0, initial: 'م' }
            ].map((artist, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-vox-light text-vox-primary flex items-center justify-center font-black text-xl group-hover:bg-vox-primary group-hover:text-white transition-all">
                    {artist.initial}
                  </div>
                  <div>
                    <p className="font-black text-stone-800">{artist.name}</p>
                    <p className="text-[10px] text-stone-400 font-bold">{artist.projects} تسجيل ناجح</p>
                  </div>
                </div>
                <div className="font-black text-vox-primary">{artist.rating}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
