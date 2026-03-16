import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
// 🟢 تم إصلاح الاستيراد وإضافة CheckCircle2 و Building2 و ExternalLink
import { Handshake, Star, MapPin, Briefcase, Plus, Search, Building2, ExternalLink, CheckCircle2 } from 'lucide-react';

export function Partners() {
  // جلب اللون الديناميكي لضمان التزامن
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');

  useEffect(() => {
    const handleStorage = () => {
      const color = localStorage.getItem('voxdub_theme');
      if (color) setThemeColor(color);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // قائمة الشركاء المعتمدة
  const voxPartners = [
    { id: 1, name: "قناة الحياة الجزائرية", type: "شريك إعلامي", location: "الجزائر العاصمة", rating: 4.9, projects: 45 },
    { id: 2, name: "جامعة يحيى فارس - المدية", type: "شريك أكاديمي", location: "المدية", rating: 4.8, projects: 12 },
    { id: 3, name: "جامعة لونيسي علي - البليدة 02", type: "شريك بحثي", location: "العفرون، البليدة", rating: 4.7, projects: 8 },
    { id: 4, name: "استوديوهات الزهرة", type: "شريك إنتاج ودوبلاج", location: "دمشق / دبي", rating: 5.0, projects: 120 },
    { id: 5, name: "وكالة إمكان للإعلام", type: "شريك استراتيجي", location: "الجزائر", rating: 4.9, projects: 34 }
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* ستايل الألوان الديناميكية */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        body { font-family: 'Cairo', sans-serif !important; }
        .text-vox-primary { color: ${themeColor} !important; }
        .bg-vox-primary { background-color: ${themeColor} !important; }
        .border-vox-primary { border-color: ${themeColor} !important; }
        .bg-vox-light { background-color: ${themeColor}15 !important; }
        .fill-vox-primary { fill: ${themeColor} !important; }
        .focus-ring-vox:focus { border-color: ${themeColor} !important; box-shadow: 0 0 0 2px ${themeColor}22; }
      `}</style>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-stone-900 mb-2">الشراكات والموردين المعتمدين</h1>
          <p className="text-stone-600 font-bold">إدارة شبكة شركاء VoxDub الاستراتيجيين</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-vox-primary text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:brightness-95 transition-all">
              <Plus className="h-5 w-5" /> إضافة شريك جديد
            </button>
          </DialogTrigger>
          <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
            <DialogHeader className="text-right">
              <DialogTitle className="text-2xl font-black text-right">إضافة شريك جديد</DialogTitle>
              <DialogDescription className="font-bold text-right">أدخل معلومات الشريك أو المؤسسة المتعاقدة</DialogDescription>
            </DialogHeader>
            <div className="space-y-5 pt-6 text-right">
              <div className="space-y-2 text-right">
                <Label className="font-black">اسم المؤسسة / الشركة</Label>
                <Input placeholder="مثال: التلفزيون الجزائري" className="focus-ring-vox rounded-xl h-12 font-bold text-right" />
              </div>
              <div className="space-y-2 text-right">
                <Label className="font-black">نوع الشراكة</Label>
                <Input placeholder="مثال: شريك تقني" className="focus-ring-vox rounded-xl h-12 font-bold text-right" />
              </div>
              <button className="bg-vox-primary text-white w-full py-4 rounded-xl font-black text-lg shadow-lg mt-4 transition-all active:scale-95">حفظ الشراكة</button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-vox-primary/60" />
          <input
            type="text"
            placeholder="ابحث عن شريك أو مؤسسة..."
            className="w-full pr-12 pl-4 py-5 font-bold outline-none border-b-2 border-transparent focus:border-vox-primary transition-all text-right"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الشركاء', val: voxPartners.length, icon: Building2 },
          { label: 'شراكات نشطة', val: voxPartners.length, icon: CheckCircle2, color: 'text-green-600' },
          { label: 'معدل الرضا', val: '4.9', icon: Star, color: 'text-vox-primary' },
          { label: 'مشاريع مشتركة', val: '224', icon: Briefcase }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="text-right">
                  <p className="text-sm font-black text-stone-500 mb-2">{stat.label}</p>
                  <div className={`text-3xl font-black ${stat.color || 'text-stone-900'}`}>{stat.val}</div>
                </div>
                <stat.icon className={`h-6 w-6 ${stat.color || 'text-stone-200'}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {voxPartners.map((partner) => (
          <Card key={partner.id} className="border-stone-100 shadow-sm hover:shadow-xl transition-all rounded-[2.5rem] overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-vox-light flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <Handshake className="h-8 w-8 text-vox-primary" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-xl font-black text-stone-900">{partner.name}</h3>
                    <p className="text-vox-primary font-black text-sm flex items-center gap-1 justify-end">
                      <Briefcase className="h-3 w-3" />
                      {partner.type}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-none px-4 py-1 rounded-full font-black text-xs">نشط</Badge>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-sm font-bold text-stone-500 bg-stone-50 p-3 rounded-xl justify-end">
                  <span>الموقع: {partner.location}</span>
                  <MapPin className="h-4 w-4 text-vox-primary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-stone-50 mb-6 text-center">
                <div className="border-l border-stone-50">
                  <p className="text-xs text-stone-400 font-black mb-1 italic">التقييم</p>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-vox-primary text-vox-primary" />
                    <span className="font-black text-stone-900">{partner.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-black mb-1 italic">المشاريع</p>
                  <p className="font-black text-stone-900">{partner.projects}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-3 border-2 border-stone-100 rounded-xl font-bold text-stone-500 hover:border-vox-primary hover:text-vox-primary transition-all flex items-center justify-center gap-2">
                  <ExternalLink size={16} /> التفاصيل
                </button>
                <button className="flex-1 bg-vox-primary text-white py-3 rounded-xl font-black shadow-lg hover:brightness-95 transition-all">
                  تواصل الآن
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[3rem] border-none bg-stone-900 text-white overflow-hidden relative shadow-2xl">
        <CardHeader className="p-10 pb-4 text-right">
          <CardTitle className="text-3xl font-black italic">مزايا شركاء VoxDub المعتمدين</CardTitle>
          <CardDescription className="text-stone-400 font-bold">بناء بيئة عمل احترافية تدعم المبدعين والمؤسسات</CardDescription>
        </CardHeader>
        <CardContent className="p-10 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 text-right">
            {[
              { t: "أولوية المشاريع", d: "حصول الشركاء على أولوية في مناقصات الدوبلاج والإنتاج الصوتي الضخمة.", c: "bg-vox-primary/20 border-vox-primary/30" },
              { t: "خصومات حصرية", d: "أسعار تنافسية خاصة للمؤسسات الأكاديمية والشركاء الدائمين.", c: "bg-white/5 border-white/10" },
              { t: "استشارات تقنية", d: "دعم فني وتجهيز استوديوهات للشركاء من قبل خبراء VoxDub.", c: "bg-white/5 border-white/10" }
            ].map((benefit, i) => (
              <div key={i} className={`p-6 rounded-[2rem] border ${benefit.c} transition-hover hover:scale-105 transition-all`}>
                <h3 className="font-black text-xl mb-3 text-vox-primary italic">{benefit.t}</h3>
                <p className="text-sm text-stone-300 font-bold leading-relaxed">{benefit.d}</p>
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-vox-primary/10 rounded-full blur-[100px] -ml-20 -mt-20"></div>
        </CardContent>
      </Card>
    </div>
  );
}