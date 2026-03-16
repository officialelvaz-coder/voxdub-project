import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Download, Send, CheckCircle2, FileAudio, Star, PartyPopper } from 'lucide-react';
import { toast } from 'sonner';

export function Delivery() {
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

  const handleDeliver = () => {
    toast.success('🎉 تم إرسال المشروع للعميل بنجاح!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
      {/* ستايل الألوان الديناميكية */}
      <style>{`
        .bg-vox-primary { background-color: ${themeColor} !important; }
        .text-vox-primary { color: ${themeColor} !important; }
        .border-vox-primary { border-color: ${themeColor} !important; }
        .bg-vox-light { background-color: ${themeColor}15 !important; }
        .focus-ring-vox:focus { border-color: ${themeColor} !important; box-shadow: 0 0 0 2px ${themeColor}22; }
      `}</style>

      <div>
        <h1 className="text-3xl font-black text-stone-900 mb-2">التسليم والتقرير النهائي</h1>
        <p className="text-stone-600 font-bold">مراجعة المخرجات النهائية وإغلاق المشروع</p>
      </div>

      {/* بنر النجاح - البطل في هذه الصفحة */}
      <Card className="bg-vox-primary text-white overflow-hidden relative border-none shadow-2xl rounded-[2.5rem]">
        <CardContent className="p-10">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-[2rem] bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md shadow-inner animate-bounce">
              <PartyPopper className="h-10 w-10 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-black mb-2 text-white italic">المشروع جاهز للتسليم!</h3>
              <p className="text-white/80 font-bold text-lg">أحسنتِ يا لميس، تم إكمال جميع مراحل الإنتاج بنجاح مذهل.</p>
            </div>
          </div>
          {/* لمسات فنية خلفية */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16 blur-2xl" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ملخص المشروع - Column 1 & 2 */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[2rem] border-stone-100 shadow-sm">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="font-black text-xl">ملخص المشروع</CardTitle>
              <CardDescription className="font-bold">مراجعة بيانات العميل والمؤدي</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'عنوان العمل', val: 'إعلان تلفزيوني - اتصالات' },
                  { label: 'رقم المرجع', val: 'VOX-2026-001' },
                  { label: 'العميل المستلم', val: 'شركة موبيليس الجزائر' },
                  { label: 'المؤدي الصوتي', val: 'بلهادي محمد إسلام', highlight: true },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 transition-hover hover:bg-white hover:shadow-md">
                    <p className="text-xs text-stone-400 font-black mb-1">{item.label}</p>
                    <p className={`font-black ${item.highlight ? 'text-vox-primary' : 'text-stone-800'}`}>{item.val}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* الملفات النهائية */}
          <Card className="rounded-[2rem] border-stone-100 shadow-sm">
            <CardHeader className="p-8 pb-4 text-right">
              <CardTitle className="font-black text-xl">الملفات النهائية المرفقة</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              {[
                { name: 'voxdub_master_high_quality.wav', size: '45.2 MB', type: 'WAV Studio Quality' },
                { name: 'voxdub_social_media_version.mp3', size: '8.7 MB', type: 'MP3 320kbps' },
              ].map((file, index) => (
                <div key={index} className="flex items-center justify-between p-5 bg-stone-50 rounded-[1.5rem] border border-stone-100 hover:border-vox-primary transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-vox-light flex items-center justify-center transition-transform group-hover:scale-110">
                      <FileAudio className="h-7 w-7 text-vox-primary" />
                    </div>
                    <div>
                      <p className="font-black text-stone-800">{file.name}</p>
                      <p className="text-xs text-stone-400 font-bold">{file.type} • {file.size}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-vox-primary text-vox-primary font-black hover:bg-vox-primary hover:text-white rounded-xl">
                    <Download className="ml-2 h-4 w-4" /> تحميل
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* رسالة التسليم والتقييم - Column 3 */}
        <div className="space-y-6">
          <Card className="rounded-[2rem] border-stone-100 shadow-sm h-full flex flex-col">
            <CardHeader className="p-8">
              <CardTitle className="font-black text-xl">ملاحظات التسليم</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 flex-1 flex flex-col">
              <Textarea
                className="focus-ring-vox flex-1 min-h-[250px] rounded-2xl border-stone-200 p-5 font-bold text-sm bg-stone-50"
                placeholder="أضف رسالة شكر أو تعليمات للعميل..."
                defaultValue={`تحية طيبة من فريق VoxDub، يسرنا تسليمكم النسخة النهائية للمشروع. نأمل أن تنال إعجابكم.`}
              />
              <div className="mt-6 p-4 bg-vox-light rounded-2xl border border-vox-primary/10">
                 <p className="text-xs font-black text-vox-primary mb-2 flex items-center gap-1"><Star size={14} fill="currentColor" /> جودة الإنتاج</p>
                 <p className="text-xs text-stone-500 font-bold">تم فحص الملفات برمجياً لضمان خلوها من الضوضاء الرقمية.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* أزرار الأكشن الكبيرة */}
      <div className="flex flex-col md:flex-row gap-6 pt-6 pb-12">
        <Button variant="outline" className="flex-1 py-8 border-2 border-vox-primary text-vox-primary hover:bg-vox-light text-xl font-black rounded-2xl shadow-lg transition-all">
          <Download className="ml-3 h-6 w-6" /> تحميل تقرير المخرجات
        </Button>
        <Button
          className="bg-vox-primary flex-1 py-8 text-white font-black text-xl shadow-2xl rounded-2xl hover:scale-[1.02] transition-all border-none"
          onClick={handleDeliver}
        >
          <Send className="ml-3 h-6 w-6 text-white" />
          <span className="text-white">إرسال المشروع رسمياً للعميل</span>
        </Button>
      </div>
    </div>
  );
}