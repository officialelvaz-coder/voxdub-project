import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { TrendingUp, TrendingDown, Download, Calendar, Target, Users } from 'lucide-react';

export function Reports() {
  // 🟢 جلب اللون والبيانات الحقيقية
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');
  const [artists, setArtists] = useState(() => {
    const saved = localStorage.getItem('voxdub_artists_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // 🟢 حالة المعلق المختار والبيانات التفاعلية
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [performanceData, setPerformanceData] = useState({
    completion: 94,
    satisfaction: 96,
    deliveryTime: 4.2,
    quality: [98, 95, 97, 99, 96]
  });

  useEffect(() => {
    const handleStorage = () => {
      const color = localStorage.getItem('voxdub_theme');
      if (color) setThemeColor(color);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // 🟢 دالة محاكاة تغيير البيانات عند اختيار معلق مختلف
  const handleArtistChange = (id: string) => {
    setSelectedArtist(id);
    if (id === 'all') {
      setPerformanceData({ completion: 94, satisfaction: 96, deliveryTime: 4.2, quality: [98, 95, 97, 99, 96] });
    } else {
      // توليد أرقام عشوائية قريبة لتعطي إيحاء بالواقعية أثناء العرض
      const randomFactor = Math.floor(Math.random() * 10);
      setPerformanceData({
        completion: 85 + randomFactor,
        satisfaction: 90 + (randomFactor % 5),
        deliveryTime: (3 + Math.random() * 2).toFixed(1) as any,
        quality: [92 + randomFactor, 88 + randomFactor, 95, 90 + randomFactor, 94]
      });
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <style>{`
        .bg-vox-primary { background-color: ${themeColor} !important; }
        .text-vox-primary { color: ${themeColor} !important; }
        .border-vox-primary { border-color: ${themeColor} !important; }
        .bg-vox-light { background-color: ${themeColor}15 !important; }
      `}</style>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-stone-900 mb-2">تقارير الأداء والجودة</h1>
          <p className="text-stone-600 font-bold">تحليل ذكي لأداء منصة VoxDub والمعلقين</p>
        </div>
        <Button className="bg-vox-primary text-white hover:opacity-90 shadow-xl px-8 py-6 rounded-2xl font-black">
          <Download className="ml-2 h-5 w-5" /> تصدير PDF
        </Button>
      </div>

      {/* الفلترة واختيار المعلق من القائمة الحقيقية */}
      <Card className="rounded-3xl border-stone-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-stone-400 mr-2">النطاق الزمني</label>
              <Select defaultValue="month">
                <SelectTrigger className="w-[200px] rounded-xl font-bold border-stone-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl font-bold">
                  <SelectItem value="week">هذا الأسبوع</SelectItem>
                  <SelectItem value="month">هذا الشهر</SelectItem>
                  <SelectItem value="year">هذا العام</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-stone-400 mr-2">المعلق الصوتي</label>
              <Select value={selectedArtist} onValueChange={handleArtistChange}>
                <SelectTrigger className="w-[250px] rounded-xl font-bold border-stone-200">
                  <SelectValue placeholder="اختر معلقاً" />
                </SelectTrigger>
                <SelectContent className="rounded-xl font-bold">
                  <SelectItem value="all">📊 جميع المعلقين (إجمالي)</SelectItem>
                  {artists.map((artist: any) => (
                    <SelectItem key={artist.id} value={artist.id.toString()}>
                      🎙️ {artist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* بطاقات الإحصائيات المتغيرة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'معدل الإنجاز', val: `${performanceData.completion}%`, trend: '+5%', icon: Target },
          { label: 'رضا العملاء', val: `${performanceData.satisfaction}%`, trend: '+2%', icon: Users },
          { label: 'وقت التسليم', val: `${performanceData.deliveryTime} يوم`, trend: '-0.8', icon: Calendar, down: true },
        ].map((stat, i) => (
          <Card key={i} className="hover:shadow-xl transition-all border-none shadow-sm rounded-[2rem] overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-black text-stone-500">{stat.label}</p>
                <stat.icon className="h-6 w-6 text-vox-primary opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-4xl font-black text-stone-900 mb-4">{stat.val}</div>
              <div className="flex items-center gap-2 text-sm font-bold">
                {stat.down ? <TrendingDown className="h-4 w-4 text-green-600" /> : <TrendingUp className="h-4 w-4 text-green-600" />}
                <span className="text-green-600">{stat.trend}</span>
                <span className="text-stone-400 font-normal italic">مقارنة بالفترة السابقة</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* مؤشرات الجودة المتغيرة حسب المعلق */}
      <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-stone-50 p-8">
          <CardTitle className="font-black text-xl flex items-center gap-2">
            <div className="w-2 h-6 bg-vox-primary rounded-full"></div>
            تحليل دقة الجودة (QA)
          </CardTitle>
          <CardDescription className="font-bold italic">
            {selectedArtist === 'all' ? 'متوسط أداء المنصة' : `تحليل أداء المعلق المختار`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10 space-y-8">
          {[
            { label: 'نقاء جودة الصوت', score: performanceData.quality[0] },
            { label: 'الالتزام بمخارج الحروف', score: performanceData.quality[1] },
            { label: 'دقة التنغيم (Tone)', score: performanceData.quality[2] },
            { label: 'السرعة ومواكبة الزمن', score: performanceData.quality[3] },
            { label: 'الاحترافية في التعامل', score: performanceData.quality[4] },
          ].map((metric, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-3 font-black text-stone-700">
                <span>{metric.label}</span>
                <span className="text-vox-primary">{metric.score}%</span>
              </div>
              <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-vox-primary transition-all duration-1000 ease-out"
                  style={{ width: `${metric.score}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* المقارنة الشهرية */}
      <Card className="rounded-[2.5rem] border-stone-100 shadow-sm overflow-hidden">
        <CardHeader className="p-8 border-b border-stone-50">
          <CardTitle className="font-black">السجل التاريخي للإنجاز</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-stone-50 text-sm font-bold">
            {[
              { month: 'مارس 2026', projects: 18, revenue: 234000, rating: 4.8 },
              { month: 'فبراير 2026', projects: 15, revenue: 220000, rating: 4.6 },
              { month: 'يناير 2026', projects: 12, revenue: 180000, rating: 4.7 },
            ].map((month, i) => (
              <div key={i} className="flex items-center justify-between p-6 hover:bg-stone-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-vox-light flex items-center justify-center text-vox-primary">
                    <Calendar size={20} />
                  </div>
                  <span className="text-lg text-stone-800 font-black">{month.month}</span>
                </div>
                <div className="flex items-center gap-10">
                  <div className="text-center">
                    <p className="text-[10px] text-stone-400 uppercase mb-1">المشاريع</p>
                    <p className="font-black text-stone-900">{month.projects}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-stone-400 uppercase mb-1">الإيرادات</p>
                    <p className="font-black text-stone-900">{month.revenue.toLocaleString()} دج</p>
                  </div>
                  <Badge className="bg-vox-primary text-white border-none py-1.5 px-4 rounded-xl font-black">
                    {month.rating} ⭐
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}