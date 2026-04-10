import { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

// استيراد قاعدة البيانات من ملفك المحلي
import { db } from '../firebase'; 
// استيراد دوال Firebase عبر الرابط المباشر لتجنب أخطاء Vercel
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

export function OrderForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    package: '',
    voiceArtist: '',
    projectType: '',
    description: '',
    duration: '',
    deadline: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      // إرسال البيانات إلى مجموعة "orders" في Firestore
      await addDoc(collection(db, "orders"), {
        ...formData,
        status: 'جديد',
        createdAt: serverTimestamp()
      });

      setIsSubmitted(true);
      toast.success('تم إرسال طلبك بنجاح!');
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '', email: '', phone: '', package: '', 
          voiceArtist: '', projectType: '', description: '', 
          duration: '', deadline: ''
        });
      }, 5000);

    } catch (error) {
      console.error("Error adding order: ", error);
      toast.error('حدث خطأ أثناء الإرسال. حاول مجدداً');
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <section id="order" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-12 text-center border-2 border-vox-light shadow-xl">
            <div className="bg-stone-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="size-10 text-vox-primary" />
            </div>
            <h3 className="text-3xl mb-4 text-gray-900 font-bold">تم استلام طلبك بنجاح!</h3>
            <p className="text-xl text-gray-600 mb-6 font-bold">
              شكراً لثقتك بنا. سيتواصل معك فريقنا خلال 24 ساعة للبدء في مشروعك
            </p>
            <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
              <p className="text-vox-primary font-black">
                سيتواصل معك مصطفى أو لميس قريباً لمناقشة التفاصيل
              </p>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="py-20 bg-white" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4 text-gray-900 font-black">أطلب مشروعك الآن</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-bold">
            املأ النموذج وسنتواصل معك لبدء العمل على مشروعك
          </p>
        </div>

        <Card className="max-w-3xl mx-auto p-8 shadow-2xl border-gray-100 rounded-[2.5rem]">
          <form onSubmit={handleSubmit} className="space-y-6 text-right">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold">الاسم الكامل *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  required
                  className="rounded-xl h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="rounded-xl h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-bold">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+213 5X XXX XXXX"
                  required
                  className="rounded-xl h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="package" className="font-bold">الباقة المطلوبة *</Label>
                <Select value={formData.package} onValueChange={(value) => handleChange('package', value)}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="اختر الباقة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">باقة التعليق الصوتي</SelectItem>
                    <SelectItem value="standard">باقة التعليق والتدقيق</SelectItem>
                    <SelectItem value="premium">باقة كاملة المحتوى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold">تفاصيل المشروع *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="صف مشروعك بالتفصيل..."
                required
                rows={5}
                className="rounded-2xl"
              />
            </div>

            <Button
              type="submit"
              disabled={isSending}
              className="w-full h-16 bg-vox-primary text-white font-black text-xl rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              {isSending ? (
                <>
                  <Loader2 className="animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="size-6" />
                  تأكيد وإرسال الطلب
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
