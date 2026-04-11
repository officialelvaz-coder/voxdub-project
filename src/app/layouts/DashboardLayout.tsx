'use client';

import { Sidebar } from '../components/ui/sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 text-right flex" dir="rtl">
      <Sidebar />
      <main className="flex-1 max-w-7xl mx-auto p-4 md:p-10 animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}
