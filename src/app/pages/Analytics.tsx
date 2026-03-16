import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Users, Star, LayoutDashboard, PieChart as PieIcon } from 'lucide-react';

export function Analytics() {
  // 🟢 جلب اللون المختار من الذاكرة المحلية
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');

  useEffect(() => {
    const handleStorage = () => {
      const color = localStorage.getItem('voxdub_theme');
      if (color) setThemeColor(color);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const monthlyData = [
    { month: 'يناير', revenue: 180000, projects: 12 },
    { month: 'فبراير', revenue: 220000, projects: 15 },
    { month: 'مارس', revenue: 234000, projects: 18 },
  ];

  // ألوان الباقات تعتمد على تدرج اللون الأساسي (Opacity)
  const packageData = [
    { name: 'أساسية', value: 35, color: `${themeColor}66` }, // شفافية 40%
    { name: 'قياسية', value: 40, color: `${themeColor}AA` }, // شفافية 60%
    { name: 'شاملة', value: 25, color: themeColor },         // اللون كامل
  ];

  const artistPerformance = [
    { name: 'منال إبراهيمي', projects: 15, rating: 4.9 },
    { name: 'بلهادي محمد', projects: 12, rating: 4.9 },
    { name: 'آدم حمدوني', projects: 10, rating: 4.8 },
    { name: 'مصطفى جغلال', projects: 9, rating: 4.7 },
    { name: 'أحمد حاج', projects: 8, rating: 4.6 },
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* ستايل الألوان الديناميكية */}
      <style>{`
        .bg-vox-primary { background-color: ${themeColor} !important; }
        .text-vox-primary { color: ${themeColor} !important; }
        .border-vox-primary { border-color: ${themeColor} !important; }
        .bg-vox-light { background-color: ${themeColor}15 !important; }
        .fill-vox-primary { fill: ${themeColor} !important; }
      `}</style>

      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-stone-900 mb-2">الإحصائيات والتحليلات</h1>
        <p className="text-stone-500 font-bold italic">نظرة شاملة على النمو المالي والإنتاجي لمنصة VoxDub</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'إيرادات الشهر', val: '234,000 دج', icon: DollarSign, trend: '+8%', color: 'border-vox-primary' },
          { title: 'مشاريع مكتملة', val: '144', icon: TrendingUp, trend: '+12%', color: 'border-blue-500' },
          { title: 'متوسط التقييم', val: '4.8/5', icon: Star, trend: '+0.2', color: 'border-green-500' },
          { title: 'عملاء جدد', val: '23', icon: Users, trend: '+15%', color: 'border-purple-500' }
        ].map((kpi, i) => (
          <Card key={i} className={`border-r-4 ${kpi.color} shadow-sm rounded-2xl`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black text-stone-500 uppercase">{kpi.title}</CardTitle>
              <kpi.icon className={`h-5 w-5 ${i === 0 ? 'text-vox-primary' : 'text-stone-300'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-stone-900">{kpi.val}</div>
              <p className="text-xs text-green-600 font-bold mt-2">↑ {kpi.trend} عن الشهر الماضي</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="bg-stone-100 p-1.5 rounded-[1.5rem] w-fit">
          <TabsTrigger value="revenue" className="rounded-xl font-black px-8">💰 الإيرادات</TabsTrigger>
          <TabsTrigger value="projects" className="rounded-xl font-black px-8">📊 المشاريع</TabsTrigger>
          <TabsTrigger value="artists" className="rounded-xl font-black px-8">🎙️ أداء المؤدين</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden">
            <CardHeader className="p-8 border-b border-stone-50">
              <CardTitle className="font-black text-xl">تطور الإيرادات الشهرية</CardTitle>
              <CardDescription className="font-bold">تحليل الأداء المالي لآخر 3 أشهر</CardDescription>
            </CardHeader>
            <CardContent className="p-10">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontWeight: 'bold' }} />
                  <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                  <Legend iconType="circle" />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke={themeColor} 
                    strokeWidth={4} 
                    dot={{ r: 8, fill: themeColor, strokeWidth: 4, stroke: '#fff' }} 
                    activeDot={{ r: 10 }}
                    name="الإيرادات (دج)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-[2.5rem] border-none shadow-sm">
              <CardHeader className="p-8">
                <CardTitle className="font-black">كثافة الإنتاج</CardTitle>
                <CardDescription className="font-bold">المشاريع المكتملة شهرياً</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f8f8f8' }} />
                    <Bar dataKey="projects" fill={themeColor} radius={[10, 10, 0, 0]} name="عدد المشاريع" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-sm">
              <CardHeader className="p-8">
                <CardTitle className="font-black">تحليل الباقات</CardTitle>
                <CardDescription className="font-bold">الباقات الأكثر مبيعاً</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={packageData}
                      cx="50%" cy="50%"
                      innerRadius={70} outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {packageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="artists">
          <Card className="rounded-[2.5rem] border-none shadow-sm">
            <CardHeader className="p-8 border-b border-stone-50">
              <CardTitle className="font-black text-xl">لوحة تميز المؤدين</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-stone-50 font-bold text-sm">
                {artistPerformance.map((artist, index) => (
                  <div key={index} className="flex items-center justify-between p-6 hover:bg-stone-50 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-vox-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-vox-primary/20">
                        {artist.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-lg text-stone-900 font-black mb-1">{artist.name}</p>
                        <p className="text-stone-400">{artist.projects} مشروع منفذ</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="text-center">
                         <p className="text-[10px] text-stone-400 uppercase mb-1">التقييم العام</p>
                         <div className="flex items-center gap-1.5">
                            <Star className="h-5 w-5 fill-vox-primary text-vox-primary" />
                            <span className="text-xl font-black">{artist.rating}</span>
                         </div>
                      </div>
                      <button className="px-6 py-2 rounded-xl border-2 border-stone-100 hover:border-vox-primary text-stone-400 hover:text-vox-primary transition-all">الملف</button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}