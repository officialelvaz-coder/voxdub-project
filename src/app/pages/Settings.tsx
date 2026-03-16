import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { User, Bell, Lock, CreditCard, Globe, Camera, Save, ShieldCheck, Mail } from 'lucide-react';
import { toast } from 'sonner';

export function Settings() {
  // 1. جلب الثيم والبيانات من localStorage لضمان التزامن الشامل
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#e11d48');
  const [artists, setArtists] = useState(() => {
    const saved = localStorage.getItem('voxdub_artists_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // تحديد "لميس" (ID: 2) لجلب بياناتها الحقيقية التي تظهر في الواجهة
  const lamisId = 2;
  const currentLamis = artists.find((a: any) => a.id === lamisId) || { name: "لميس حميمي", image: "", email: "lamis@voxdub.dz" };

  const [formData, setFormData] = useState({
    name: currentLamis.name,
    image: currentLamis.image,
    email: currentLamis.email || "lamis@voxdub.dz"
  });

  useEffect(() => {
    const handleStorage = () => {
      const color = localStorage.getItem('voxdub_theme');
      if (color) setThemeColor(color);
      
      const savedArtists = localStorage.getItem('voxdub_artists_v2');
      if (savedArtists) {
        const parsed = JSON.parse(savedArtists);
        setArtists(parsed);
        const lamis = parsed.find((a: any) => a.id === lamisId);
        if (lamis) setFormData({ name: lamis.name, image: lamis.image, email: lamis.email || "lamis@voxdub.dz" });
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleSaveAll = () => {
    // تحديث مصفوفة المعلقين لضمان ظهور التعديل في الواجهة (Landing) والبروفايل
    const updatedArtists = artists.map((a: any) => 
      a.id === lamisId ? { ...a, name: formData.name, image: formData.image } : a
    );
    localStorage.setItem('voxdub_artists_v2', JSON.stringify(updatedArtists));
    setArtists(updatedArtists);
    toast.success('✨ تم حفظ كافة الإعدادات ومزامنة البيانات بنجاح!');
  };

  const handleImageChange = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        body { font-family: 'Cairo', sans-serif !important; }
        .text-vox-primary { color: ${themeColor} !important; }
        .bg-vox-primary { background-color: ${themeColor} !important; }
        .border-vox-primary { border-color: ${themeColor} !important; }
        .bg-vox-light { background-color: ${themeColor}15 !important; }
        .tabs-trigger-vox[data-state="active"] { color: ${themeColor} !important; border-bottom: 3px solid ${themeColor}; background: ${themeColor}05; }
        .focus-ring-vox:focus { border-color: ${themeColor} !important; box-shadow: 0 0 0 2px ${themeColor}22; }
      `}</style>

      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-black text-stone-900">الإعدادات وإدارة المنصة</h1>
        <p className="text-stone-500 font-bold italic">تحكم كامل في حسابك، الأمان، والواجهة البرمجية</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-16 bg-stone-100 p-1.5 rounded-2xl mb-8">
          <TabsTrigger value="profile" className="tabs-trigger-vox rounded-xl font-black transition-all"><User className="h-4 w-4 ml-2" /> الملف الشخصي</TabsTrigger>
          <TabsTrigger value="notifications" className="tabs-trigger-vox rounded-xl font-black transition-all"><Bell className="h-4 w-4 ml-2" /> الإشعارات</TabsTrigger>
          <TabsTrigger value="security" className="tabs-trigger-vox rounded-xl font-black transition-all"><Lock className="h-4 w-4 ml-2" /> الأمان</TabsTrigger>
          <TabsTrigger value="billing" className="tabs-trigger-vox rounded-xl font-black transition-all"><CreditCard className="h-4 w-4 ml-2" /> الفوترة</TabsTrigger>
          <TabsTrigger value="preferences" className="tabs-trigger-vox rounded-xl font-black transition-all"><Globe className="h-4 w-4 ml-2" /> التفضيلات</TabsTrigger>
        </TabsList>

        {/* 1. الملف الشخصي (المتزامن) */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-sm">
            <CardHeader className="p-8">
              <CardTitle className="text-2xl font-black">معلومات المدير (مزامنة الواجهة)</CardTitle>
              <CardDescription className="font-bold">التعديل هنا يغير صورتك واسمك في الصفحة الرئيسية للموقع</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-stone-50 rounded-3xl border border-stone-100">
                <div className="relative group">
                  <img 
                    src={formData.image || "/images/lamis.jpg"} 
                    className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white shadow-2xl transition-transform group-hover:scale-105"
                    onError={(e: any) => { e.target.src = "https://ui-avatars.com/api/?name=Lamis&background=random"; }}
                  />
                  <button onClick={handleImageChange} className="absolute -bottom-2 -left-2 p-3 bg-vox-primary text-white rounded-2xl shadow-lg hover:scale-110 transition-all border-2 border-white"><Camera size={18} /></button>
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-black text-stone-900 mb-1">{formData.name}</h3>
                  <p className="text-vox-primary font-bold italic">مديرة ومؤسسة VoxDub</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-black text-stone-700">الاسم في الواجهة</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="focus-ring-vox h-12 rounded-xl border-stone-200 font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-stone-700">البريد الرسمي</Label>
                  <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} dir="ltr" className="focus-ring-vox h-12 rounded-xl border-stone-200 font-bold text-left" />
                </div>
              </div>
              <Button onClick={handleSaveAll} className="bg-vox-primary text-white px-10 py-6 rounded-2xl font-black shadow-lg"><Save className="ml-2 h-5 w-5" /> حفظ ومزامنة الواجهة</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. الإشعارات */}
        <TabsContent value="notifications">
          <Card className="rounded-[2.5rem] border-none shadow-sm p-10 space-y-6 text-right">
            <h3 className="text-xl font-black mb-6">تفضيلات التنبيهات</h3>
            {[
              { t: "تنبيهات المشاريع الجديدة", d: "إرسال إشعار عند طلب عميل لمشروع جديد." },
              { t: "رسائل المعلقين", d: "تنبيه عند استلام عينة صوتية جديدة من معلق." },
              { t: "تحديثات النظام", d: "إشعارات حول الميزات الجديدة في VoxDub." }
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
                <div>
                  <p className="font-black text-stone-900">{n.t}</p>
                  <p className="text-sm text-stone-500 font-bold">{n.d}</p>
                </div>
                <Switch className="data-[state=checked]:bg-vox-primary" defaultChecked />
              </div>
            ))}
          </Card>
        </TabsContent>

        {/* 3. الأمان */}
        <TabsContent value="security">
          <Card className="rounded-[2.5rem] border-none shadow-sm p-10 space-y-6">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Lock className="text-vox-primary" /> كلمة المرور والأمان</h3>
            <div className="grid gap-4">
              <div className="space-y-2 text-right">
                <Label className="font-bold">كلمة المرور الحالية</Label>
                <Input type="password" placeholder="••••••••" className="focus-ring-vox h-12 rounded-xl" />
              </div>
              <div className="space-y-2 text-right">
                <Label className="font-bold">كلمة المرور الجديدة</Label>
                <Input type="password" placeholder="••••••••" className="focus-ring-vox h-12 rounded-xl" />
              </div>
            </div>
            <div className="p-6 bg-vox-light rounded-3xl border border-vox-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ShieldCheck size={32} className="text-vox-primary" />
                <div className="text-right">
                   <p className="font-black">المصادقة الثنائية (2FA)</p>
                   <p className="text-xs text-stone-500 font-bold">تأمين الحساب عبر رمز الهاتف</p>
                </div>
              </div>
              <Switch className="data-[state=checked]:bg-vox-primary" />
            </div>
            <Button onClick={handleSaveAll} className="bg-stone-900 text-white px-8 py-4 rounded-xl font-black hover:bg-vox-primary transition-all">تحديث الأمان</Button>
          </Card>
        </TabsContent>

        {/* 4. الفوترة */}
        <TabsContent value="billing">
          <Card className="rounded-[2.5rem] border-none shadow-sm p-10">
            <h3 className="text-xl font-black mb-8 flex items-center gap-2"><CreditCard className="text-vox-primary" /> سجل الفواتير والدفع</h3>
            <div className="space-y-4">
               {[
                 { id: 'INV-2026-001', date: '01 مارس 2026', amount: '234,000' },
                 { id: 'INV-2026-002', date: '01 فبراير 2026', amount: '220,000' }
               ].map((inv) => (
                 <div key={inv.id} className="flex items-center justify-between p-5 bg-stone-50 rounded-2xl border border-stone-100 hover:border-vox-primary transition-all">
                    <div className="text-right">
                       <p className="font-black text-stone-900">{inv.id}</p>
                       <p className="text-xs text-stone-400 font-bold">{inv.date}</p>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className="text-xl font-black text-vox-primary">{inv.amount} دج</span>
                       <Button variant="outline" className="border-vox-primary text-vox-primary rounded-xl font-bold">تحميل PDF</Button>
                    </div>
                 </div>
               ))}
            </div>
          </Card>
        </TabsContent>

        {/* 5. التفضيلات */}
        <TabsContent value="preferences">
          <Card className="rounded-[2.5rem] border-none shadow-sm p-10">
            <h3 className="text-xl font-black mb-8 flex items-center gap-2"><Globe className="text-vox-primary" /> مظهر المنصة واللغة</h3>
            <div className="space-y-6">
               <div className="flex items-center justify-between p-6 bg-stone-50 rounded-3xl border border-stone-100">
                  <div className="text-right">
                     <p className="font-black text-stone-900">الوضع الداكن (Dark Mode)</p>
                     <p className="text-sm text-stone-500 font-bold italic">تحويل الواجهة للوضع الليلي</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-vox-primary" />
               </div>
               <div className="space-y-2 text-right">
                  <Label className="font-black">لغة المنصة</Label>
                  <Select defaultValue="ar">
                    <SelectTrigger className="w-full h-12 rounded-xl focus-ring-vox font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent className="font-bold"><SelectItem value="ar">العربية (الافتراضية)</SelectItem><SelectItem value="fr">الفرنسية</SelectItem><SelectItem value="en">الإنجليزية</SelectItem></SelectContent>
                  </Select>
               </div>
            </div>
            <Button onClick={handleSaveAll} className="bg-vox-primary text-white px-10 py-4 rounded-xl font-black shadow-lg mt-8">حفظ التفضيلات</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}