import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { ArrowRight, CalendarIcon, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toast } from 'sonner';

export function NewProject() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [deadline, setDeadline] = useState<Date>();
  
  // 🟢 ربط الألوان بالثيم المختار
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');

  useEffect(() => {
    const handleStorage = () => {
      const color = localStorage.getItem('voxdub_theme');
      if (color) setThemeColor(color);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    projectType: '',
    package: '',
    description: '',
    budget: '',
  });

  const handleNext = () => { if (step < 3) setStep(step + 1); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };
  const handleSubmit = () => {
    toast.success('تم إنشاء المشروع بنجاح!');
    navigate('/dashboard/projects');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-right" dir="rtl">
      {/* ستايل الألوان الديناميكية */}
      <style>{`
        .bg-vox-primary { background-color: ${themeColor} !important; }
        .text-vox-primary { color: ${themeColor} !important; }
        .border-vox-primary { border-color: ${themeColor} !important; }
        .bg-vox-light { background-color: ${themeColor}15 !important; }
        .focus-ring-vox:focus { border-color: ${themeColor} !important; box-shadow: 0 0 0 2px ${themeColor}22; }
      `}</style>

      {/* Progress Steps */}
      <div className="mb-12 px-4">
        <div className="flex items-center justify-between mb-6 relative">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all shadow-md ${
                  s <= step ? 'bg-vox-primary text-white scale-110 shadow-lg' : 'bg-stone-100 text-stone-400 border border-stone-200'
                }`}
              >
                {s < step ? <CheckCircle2 size={24} /> : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1.5 mx-4 rounded-full transition-all ${s < step ? 'bg-vox-primary' : 'bg-stone-100'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm font-black text-stone-500">
          <span className={step >= 1 ? 'text-vox-primary' : ''}>المعلومات الأساسية</span>
          <span className={step >= 2 ? 'text-vox-primary' : ''}>تفاصيل المشروع</span>
          <span className={step >= 3 ? 'text-vox-primary' : ''}>باقة المشروع</span>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden">
          <CardHeader className="bg-stone-50 p-8 border-b border-stone-100">
            <CardTitle className="text-2xl font-black">المعلومات الأساسية</CardTitle>
            <CardDescription className="font-bold">ابدأ بإدخال معلومات العميل وعنوان العمل</CardDescription>
          </CardHeader>
          <CardContent className="p-10 space-y-6">
            <div className="space-y-3 text-right">
              <Label htmlFor="title" className="font-black text-stone-700">عنوان المشروع *</Label>
              <Input
                id="title"
                placeholder="مثال: تسجيل وثائقي ناشيونال جيوغرافيك"
                className="focus-ring-vox h-14 rounded-2xl border-stone-200 font-bold"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="clientName" className="font-black text-stone-700">اسم العميل *</Label>
                <Input
                  id="clientName"
                  className="focus-ring-vox h-14 rounded-2xl border-stone-200 font-bold"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>
              <div className="space-y-3 text-right">
                <Label htmlFor="clientEmail" className="font-black text-stone-700">البريد الإلكتروني *</Label>
                <Input id="clientEmail" type="email" dir="ltr" className="focus-ring-vox h-14 rounded-2xl border-stone-200 font-bold text-left" />
              </div>
            </div>

            <div className="flex justify-end pt-8">
              <Button onClick={handleNext} className="bg-stone-900 text-white hover:bg-vox-primary px-12 py-7 rounded-2xl font-black text-lg transition-all">
                التالي <ArrowRight className="mr-3 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Project Details */}
      {step === 2 && (
        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden">
          <CardHeader className="bg-stone-50 p-8">
            <CardTitle className="text-2xl font-black">تفاصيل المشروع</CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="description" className="font-black text-stone-700">وصف المشروع والمتطلبات الفنية *</Label>
              <Textarea
                id="description"
                placeholder="اكتب تفاصيل النبرة، السرعة، وأي ملاحظات خاصة..."
                className="focus-ring-vox rounded-2xl border-stone-200 font-bold min-h-[180px] p-6"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            
            <div className="space-y-3">
              <Label className="font-black text-stone-700">تاريخ التسليم المتوقع *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-14 justify-start text-right rounded-2xl border-stone-200 font-bold hover:border-vox-primary">
                    <CalendarIcon className="ml-3 h-5 w-5 text-vox-primary" />
                    {deadline ? format(deadline, 'PPP', { locale: ar }) : 'اختر التاريخ من التقويم'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden shadow-2xl" align="start">
                  <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-between pt-8">
              <Button variant="outline" onClick={handleBack} className="border-2 border-stone-200 text-stone-500 hover:text-vox-primary hover:border-vox-primary px-10 py-7 rounded-2xl font-black">السابق</Button>
              <Button onClick={handleNext} className="bg-stone-900 text-white hover:bg-vox-primary px-12 py-7 rounded-2xl font-black text-lg">التالي <ArrowRight className="mr-3 h-5 w-5" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Package Selection */}
      {step === 3 && (
        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden">
          <CardHeader className="bg-stone-50 p-8">
            <CardTitle className="text-2xl font-black text-center">اختيار الباقة المناسبة</CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <RadioGroup value={formData.package} onValueChange={(v) => setFormData({ ...formData, package: v })}>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'basic', title: 'باقة التعليق الصوتي', price: '5,000', desc: 'تسجيل خام عالي الجودة مع تعديل واحد' },
                  { id: 'standard', title: 'باقة التعليق + الهندسة', price: '8,000', desc: 'تسجيل مع تنقية الصوت وموسيقى خلفية' },
                  { id: 'premium', title: 'الباقة الشاملة', price: '13,000', desc: 'كتابة نص، تسجيل، مكساج وتعديلات مفتوحة' }
                ].map((pkg) => (
                  <label
                    key={pkg.id}
                    className={`flex items-center gap-6 p-8 rounded-[2rem] border-4 cursor-pointer transition-all ${
                      formData.package === pkg.id ? 'border-vox-primary bg-vox-light shadow-lg' : 'border-stone-100 hover:bg-stone-50'
                    }`}
                  >
                    <RadioGroupItem value={pkg.id} id={pkg.id} className="w-6 h-6" />
                    <div className="flex-1 text-right">
                      <div className="flex items-center justify-between">
                        <h3 className="font-black text-xl text-stone-900">{pkg.title}</h3>
                        <span className="text-3xl font-black text-vox-primary">{pkg.price} <span className="text-sm">دج</span></span>
                      </div>
                      <p className="text-stone-500 font-bold mt-1">{pkg.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </RadioGroup>

            <div className="flex justify-between pt-12">
              <Button variant="outline" onClick={handleBack} className="border-2 border-stone-200 text-stone-500 px-10 py-7 rounded-2xl font-black">السابق</Button>
              <Button
                onClick={handleSubmit}
                className="bg-vox-primary text-white shadow-xl shadow-vox-primary/30 px-16 py-7 rounded-2xl font-black text-xl hover:scale-105 transition-all"
                disabled={!formData.package}
              >
                إنشاء المشروع الآن
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}