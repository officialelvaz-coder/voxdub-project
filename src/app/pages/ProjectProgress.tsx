import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { CheckCircle2, Circle, Clock, FileText, Mic, Music, Send } from 'lucide-react';

export function ProjectProgress() {
  const { id } = useParams();

  // 🟢 جلب اللون الديناميكي من localStorage لضمان التزامن
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');

  useEffect(() => {
    const handleStorage = () => {
      const color = localStorage.getItem('voxdub_theme');
      if (color) setThemeColor(color);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const stages = [
    { id: 1, name: 'إنشاء المشروع', icon: FileText, status: 'completed', progress: 100 },
    { id: 2, name: 'اختيار الصوت', icon: Mic, status: 'completed', progress: 100 },
    { id: 3, name: 'التسجيل الصوتي', icon: Circle, status: 'active', progress: 60 },
    { id: 4, name: 'المكساج والمراجعة', icon: Music, status: 'pending', progress: 0 },
    { id: 5, name: 'التسليم', icon: Send, status: 'pending', progress: 0 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
      {/* ستايل الألوان الديناميكية */}
      <style>{`
        .bg-vox-primary { background-color: ${themeColor} !important; }
        .text-vox-primary { color: ${themeColor} !important; }
        .border-vox-primary { border-color: ${themeColor} !important; }
        .bg-vox-light { background-color: ${themeColor}15 !important; }
        .progress-vox > div { background-color: ${themeColor} !important; }
      `}</style>

      <div>
        <h1 className="text-3xl font-black text-stone-900 mb-2">متابعة المشروع #{id}</h1>
        <p className="text-stone-600 font-bold">تابع مراحل إنتاج عملك الصوتي لحظة بلحظة</p>
      </div>

      {/* بطاقة التقدم الإجمالي الملونة */}
      <Card className="bg-vox-primary text-white overflow-hidden relative border-none shadow-xl">
        <CardContent className="p-8">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black">التقدم الإجمالي للمشروع</h3>
              <Badge className="bg-white text-stone-900 px-4 py-1 rounded-full font-black">52%</Badge>
            </div>
            <Progress value={52} className="h-4 bg-white/20 progress-vox" />
            <div className="flex items-center gap-2 text-white/90 font-bold">
              <Clock size={18} />
              <span>المرحلة الحالية: التسجيل الصوتي (بإشراف بلهادي إسلام)</span>
            </div>
          </div>
          {/* تأثير بصري خفيف */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        </CardContent>
      </Card>

      {/* مراحل التنفيذ - التايم لاين */}
      <div className="space-y-4">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isActive = stage.status === 'active';
          const isCompleted = stage.status === 'completed';

          return (
            <Card
              key={stage.id}
              className={`border-2 transition-all rounded-[2rem] ${
                isActive ? 'border-vox-primary shadow-lg bg-vox-light' : 'border-stone-100 opacity-80'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                    isCompleted ? 'bg-green-100 text-green-600' : 
                    isActive ? 'bg-vox-primary text-white animate-pulse' : 'bg-stone-100 text-stone-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={28} /> : <Icon size={28} />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-black text-xl text-stone-900">{stage.name}</h3>
                        <p className={`text-sm font-bold ${isActive ? 'text-vox-primary' : 'text-stone-400'}`}>
                          {isCompleted ? 'تم الإنجاز بنجاح' : isActive ? 'جاري العمل الآن' : 'في انتظار البدء'}
                        </p>
                      </div>
                      {isActive && (
                        <Button className="bg-stone-900 text-white rounded-xl font-black px-6 hover:bg-vox-primary">
                          عرض المخرجات
                        </Button>
                      )}
                    </div>

                    {stage.status !== 'pending' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-black">
                          <span className="text-stone-500">نسبة المرحلة</span>
                          <span className="text-stone-900">{stage.progress}%</span>
                        </div>
                        <Progress value={stage.progress} className="h-2 bg-stone-100" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* سجل النشاط المحدث */}
      <Card className="rounded-[2.5rem] border-stone-100 shadow-sm">
        <CardHeader className="border-b border-stone-50 p-8">
          <CardTitle className="font-black text-2xl flex items-center gap-2">
            <div className="w-2 h-8 bg-vox-primary rounded-full"></div>
            سجل نشاطات المشروع
          </CardTitle>
          <CardDescription className="font-bold">متابعة دقيقة لكل إجراء تم اتخاذه</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            {[
              { action: 'بدء مرحلة التسجيل الصوتي', time: 'منذ ساعتين', user: 'بلهادي محمد إسلام', color: 'bg-vox-primary' },
              { action: 'تم تعيين المؤدي الصوتي للمشروع', time: 'منذ 5 ساعات', user: 'لميس حميمي', color: 'bg-stone-200' },
              { action: 'تم رفع النصوص والمواد الفنية', time: 'أمس الساعة 10:00 م', user: 'لميس حميمي', color: 'bg-stone-200' },
              { action: 'تم إنشاء المشروع بنجاح', time: 'أمس الساعة 09:30 م', user: 'لميس حميمي', color: 'bg-green-400' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className={`w-3 h-3 rounded-full ${activity.color} mt-2 group-hover:scale-150 transition-all shadow-sm`} />
                <div className="flex-1 border-b border-stone-50 pb-4">
                  <p className="font-black text-stone-800 text-lg mb-1">{activity.action}</p>
                  <p className="text-sm font-bold text-stone-500 flex items-center gap-2">
                    <span className="text-vox-primary">{activity.user}</span>
                    <span className="text-stone-300">•</span>
                    <span>{activity.time}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}