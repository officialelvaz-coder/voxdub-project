import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  Truck,
  Handshake,
  PieChart,
  FolderKanban,
  User
} from 'lucide-react';

export function Sidebar() {
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');
  
  // 🟢 جلب بيانات المستخدم الذي سجل الدخول
  const userRole = localStorage.getItem('voxdub_user_role'); // admin أو artist
  const loggedId = localStorage.getItem('voxdub_logged_artist_id');

  // مصفوفة الأسماء للمزامنة (تأكد أنها نفس التي في صفحة الـ Login)
  const artistsNames: Record<string, string> = {
    '1': 'مصطفى جغلال',
    '6': 'آدم حمدوني',
    '5': 'بلهادي محمد إسلام',
    '2': 'لميس حميمي',
    '3': 'منال إبراهيمي',
    '4': 'أحمد حاج إسماعيل',
  };

  const currentUserName = userRole === 'admin' ? 'لميس حميمي' : (artistsNames[loggedId || '1'] || 'معلق صوتي');
  const currentUserRole = userRole === 'admin' ? 'مديرة المنصة' : 'مؤدي صوتي محترف';

  useEffect(() => {
    const handleStorage = () => {
      const color = localStorage.getItem('voxdub_theme');
      if (color) setThemeColor(color);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // 🔴 تخصيص الروابط حسب الهوية
  const allNavItems = [
    { icon: LayoutDashboard, label: 'الرئيسية', path: '/dashboard', roles: ['admin'] },
    { icon: User, label: 'بروفايلي الشخصي', path: `/dashboard/artists/${loggedId}`, roles: ['artist'] },
    { icon: FolderKanban, label: 'مشاريعي', path: '/dashboard/projects', roles: ['artist'] },
    { icon: PlusCircle, label: 'مشروع جديد', path: '/dashboard/new-project', roles: ['admin'] },
    { icon: FolderKanban, label: 'المشاريع الجارية', path: '/dashboard/projects', roles: ['admin'] },
    { icon: Truck, label: 'التسليم النهائي', path: '/dashboard/delivery/1', roles: ['admin'] },
    { icon: Users, label: 'المؤدون الصوتيون', path: '/dashboard/artists', roles: ['admin'] },
    { icon: Handshake, label: 'الشركاء', path: '/dashboard/partners', roles: ['admin'] },
    { icon: BarChart3, label: 'تقارير الأداء', path: '/dashboard/reports', roles: ['admin'] },
    { icon: PieChart, label: 'الإحصائيات', path: '/dashboard/analytics', roles: ['admin'] },
    { icon: Bell, label: 'الإشعارات', path: '/dashboard/notifications', roles: ['admin', 'artist'] },
    { icon: Settings, label: 'الإعدادات', path: '/dashboard/settings', roles: ['admin'] },
  ];

  // تصفية الروابط لتظهر فقط ما يناسب دور المستخدم الحالي
  const filteredNavItems = allNavItems.filter(item => item.roles.includes(userRole || 'admin'));

  return (
    <aside className="w-64 bg-white border-l border-stone-200 h-screen sticky top-0 flex flex-col shadow-sm" dir="rtl">
      <style>{`
        .active-link { 
          background-color: ${themeColor}15 !important; 
          color: ${themeColor} !important; 
          border-right: 4px solid ${themeColor} !important;
        }
        .hover-link:hover { 
          background-color: ${themeColor}08;
          color: ${themeColor};
        }
      `}</style>

      <div className="p-8 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: themeColor }}>
            <span className="font-black text-xl">V</span>
          </div>
          <span className="text-2xl font-black italic">Vox<span style={{ color: themeColor }}>Dub</span></span>
        </div>

        <nav className="space-y-1 flex-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all hover-link ${
                  isActive ? 'active-link' : 'text-stone-500'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* 🟢 الآن هذا الجزء سيتغير ديناميكياً */}
        <div className="mt-auto pt-6 border-t border-stone-100">
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black"
              style={{ backgroundColor: themeColor }}
            >
              {currentUserName[0]}
            </div>
            <div className="text-right overflow-hidden">
              <p className="text-sm font-black text-stone-900 truncate">{currentUserName}</p>
              <p className="text-xs text-stone-500 font-bold italic">{currentUserRole}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}