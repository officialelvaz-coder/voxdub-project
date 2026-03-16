import { Outlet } from 'react-router-dom';

export function DashboardLayout() {
  return (
    // قمنا بإزالة الـ Sidebar وجعلنا الخلفية مريحة للعين
    <div className="min-h-screen bg-stone-50 text-right" dir="rtl">
      {/* الـ Outlet هو المكان الذي تظهر فيه الصفحات (Dashboard, Projects, etc.)
          جعلناه يأخذ كامل العرض مع إضافة هوامش (Padding) لجمالية العرض
      */}
      <main className="w-full max-w-7xl mx-auto p-4 md:p-10 animate-in fade-in duration-500">
        <Outlet />
      </main>
    </div>
  );
}