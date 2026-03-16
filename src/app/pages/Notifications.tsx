import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Bell, CheckCheck, Trash2, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { notifications } from '../data/mockData';

export function Notifications() {
  const [notifs, setNotifs] = useState(notifications);

  // 🟢 جلب اللون الديناميكي لضمان التزامن
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');

  useEffect(() => {
    const handleStorage = () => {
      const color = localStorage.getItem('voxdub_theme');
      if (color) setThemeColor(color);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const unreadNotifs = notifs.filter(n => !n.read);
  const readNotifs = notifs.filter(n => n.read);

  const markAsRead = (id: string) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  const deleteNotif = (id: string) => {
    setNotifs(notifs.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case 'error': return <AlertCircle className="h-6 w-6 text-red-600" />;
      default: return <Info className="h-6 w-6 text-vox-primary" />;
    }
  };

  const getBgColor = (type: string) => {
    if (type === 'info') return 'bg-vox-light border-vox-primary/20';
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-stone-50 border-stone-200';
    }
  };

  const NotificationItem = ({ notif }: { notif: any }) => (
    <div
      className={`p-6 rounded-[2rem] border-2 transition-all hover:shadow-md ${
        notif.read ? 'bg-white border-stone-100 opacity-70' : `${getBgColor(notif.type)} shadow-sm`
      }`}
    >
      <div className="flex items-start gap-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${notif.read ? 'bg-stone-100' : 'bg-white'}`}>
          {getIcon(notif.type)}
        </div>
        <div className="flex-1 text-right">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-black text-stone-900 text-lg">{notif.title}</h4>
              <p className="font-bold text-stone-500 mt-1 leading-relaxed">{notif.message}</p>
            </div>
            {!notif.read && (
              <Badge className="bg-vox-primary text-white px-4 py-1 rounded-full font-black animate-pulse">جديد</Badge>
            )}
          </div>
          <div className="flex items-center justify-between mt-5 border-t border-stone-100 pt-4">
            <p className="text-xs font-black text-stone-400">
              {new Date(notif.timestamp).toLocaleString('ar-DZ')}
            </p>
            <div className="flex gap-3">
              {!notif.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsRead(notif.id)}
                  className="text-vox-primary font-black hover:bg-vox-light rounded-xl"
                >
                  <CheckCheck className="h-4 w-4 ml-1" />
                  مقروء
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteNotif(notif.id)}
                className="text-red-500 font-black hover:bg-red-50 rounded-xl"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
      {/* ستايل الألوان الديناميكية */}
      <style>{`
        .bg-vox-primary { background-color: ${themeColor} !important; }
        .text-vox-primary { color: ${themeColor} !important; }
        .border-vox-primary { border-color: ${themeColor} !important; }
        .bg-vox-light { background-color: ${themeColor}15 !important; }
        .tabs-vox-trigger[data-state="active"] { background-color: ${themeColor} !important; color: white !important; }
      `}</style>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-stone-900 mb-2">مركز الإشعارات</h1>
          <p className="text-stone-600 font-bold">تابع كل ما هو جديد في مشروع VoxDub</p>
        </div>
        {unreadNotifs.length > 0 && (
          <Button
            variant="outline"
            onClick={markAllAsRead}
            className="border-vox-primary text-vox-primary font-black rounded-2xl px-6 py-6 hover:bg-vox-light transition-all"
          >
            <CheckCheck className="h-5 w-5 ml-2" />
            تعليم الكل كمقروء
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-[2rem] border-none shadow-sm bg-vox-light">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-black text-vox-primary">تنبيهات غير مقروءة</CardTitle>
            <Bell className="h-5 w-5 text-vox-primary animate-ring" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-stone-900">{unreadNotifs.length}</div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-sm bg-stone-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-black text-stone-500">إجمالي الإشعارات</CardTitle>
            <CheckCheck className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-stone-900">{notifs.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-stone-100 p-1.5 rounded-2xl h-16 w-full max-w-md mb-8">
          <TabsTrigger value="all" className="tabs-vox-trigger rounded-xl font-black flex-1">الكل</TabsTrigger>
          <TabsTrigger value="unread" className="tabs-vox-trigger rounded-xl font-black flex-1">الجديدة</TabsTrigger>
          <TabsTrigger value="read" className="tabs-vox-trigger rounded-xl font-black flex-1">المقروءة</TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          <TabsContent value="all" className="space-y-4">
            {notifs.length === 0 ? (
              <EmptyState icon={<Bell />} message="لا توجد إشعارات حالياً" />
            ) : (
              notifs.map(notif => <NotificationItem key={notif.id} notif={notif} />)
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {unreadNotifs.length === 0 ? (
              <EmptyState icon={<CheckCircle2 />} message="صندوق الوارد فارغ، كل شيء تحت السيطرة!" />
            ) : (
              unreadNotifs.map(notif => <NotificationItem key={notif.id} notif={notif} />)
            )}
          </TabsContent>

          <TabsContent value="read" className="space-y-4">
            {readNotifs.length === 0 ? (
              <EmptyState icon={<Info />} message="لا توجد إشعارات مؤرشفة" />
            ) : (
              readNotifs.map(notif => <NotificationItem key={notif.id} notif={notif} />)
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// 🟢 مكون الحالة الفارغة (إضافي لتحسين المظهر)
const EmptyState = ({ icon, message }: { icon: any, message: string }) => (
  <Card className="rounded-[3rem] border-dashed border-2 border-stone-200 bg-transparent">
    <CardContent className="p-20 text-center">
      <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
        {React.cloneElement(icon, { size: 40 })}
      </div>
      <p className="text-stone-500 font-black text-xl italic">{message}</p>
    </CardContent>
  </Card>
);