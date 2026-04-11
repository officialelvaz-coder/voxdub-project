'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export function Sidebar() {
  const pathname = usePathname();
  const [themeColor, setThemeColor] = useState('#e11d48');
  const [currentUserName, setCurrentUserName] = useState('...');
  const [currentUserRole, setCurrentUserRole] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setThemeColor(localStorage.getItem('voxdub_theme') || '#e11d48');

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        // جلب بيانات المستخدم من Firestore
        const docRef = doc(db, 'artists', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentUserName(data.name || user.displayName || 'معلق صوتي');
          setCurrentUserRole(data.role === 'admin' ? 'مديرة المنصة' : 'مؤدي صوتي محترف');
          setUserRole(data.role || 'artist');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const color = localStorage.getItem('voxdub_theme');
      if (color) setThemeColor(color);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const allNavItems = [
    { icon: LayoutDashboard, label: 'الرئيسية', path: '/dashboard', roles: ['admin'] },
    { icon: User, label: 'بروفايلي الشخصي', path: `/dashboard/artists/${userId}`, roles: ['artist'] },
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

  const filteredNavItems = allNavItems.filter(item => 
    item.roles.includes(userRole || 'admin')
  );

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
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.label}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all hover-link ${
                  isActive ? 'active-link' : 'text-stone-500'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

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
