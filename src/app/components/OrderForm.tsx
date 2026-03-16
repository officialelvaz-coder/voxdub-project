import { useState } from 'react';
import { Send, Upload, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

export function OrderForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast.success('تم استلام طلبك بنجاح! سنتواصل معك قريباً');
    
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '', email: '', phone: '', package: '', 
        voiceArtist: '', projectType: '', description: '', 
        duration: '', deadline: ''
      });
    }, 3000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <section id="order" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-12 text-center border-2 border-vox-light shadow-xl">
            <div className="bg-vox-light w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="size-10 text-vox-primary" />
            </div>
            <h3 className="text-3xl mb-4 text-gray-900 font-bold">تم استلام طلبك بنجاح!</h3>
            <p className="text-xl text-gray-600 mb-6">
              شكراً لثقتك بنا. سيتواصل معك فريقنا خلال 24 ساعة للبدء في مشروعك
            </p>
            <div className="bg-vox-light p-6 rounded-lg border border-vox-primary/10">
              <p className="text-vox-primary font-medium">
                سيصلك بريد إلكتروني يحتوي على تفاصيل الطلب ورقم المتابعة
              </p>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4 text-gray-900 font-bold">أطلب مشروعك الآن</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            املأ النموذج وسنتواصل معك لبدء العمل على مشروعك
          </p>
        </div>

        <Card className="max-w-3xl mx-auto p-8 shadow-2xl border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">الاسم الكامل *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  required
                  className="mt-2 focus:border-vox-primary"
                />
              </div>

              <div>
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="mt-2 focus:border-vox-primary"
                />
              </div>

              <div>
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+213 5X XXX XXXX"
                  required
                  className="mt-2 focus:border-vox-primary"
                />
              </div>

              <div>
                <Label htmlFor="package">الباقة المطلوبة *</Label>
                <Select value={formData.package} onValueChange={(value) => handleChange('package', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="اختر الباقة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">باقة التعليق الصوتي - 5000 دينار</SelectItem>
                    <SelectItem value="standard">باقة التعليق والتدقيق - 8000 دينار</SelectItem>
                    <SelectItem value="premium">باقة كاملة المحتوى - 13000 دينار</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="voiceArtist">المعلق الصوتي المفضل</Label>
                <Select value={formData.voiceArtist} onValueChange={(value) => handleChange('voiceArtist', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="اختر المعلق (اختياري)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="belhadi">بلهادي محمد إسلام</SelectItem>
                    <SelectItem value="adam">آدم حمدوني</SelectItem>
                    <SelectItem value="mostafa">مصطفى جغلال</SelectItem>
                    <SelectItem value="manal">منال إبراهيمي</SelectItem>
                    <SelectItem value="ahmed">أحمد حاج إسماعيل</SelectItem>
                    <SelectItem value="any">لا يهم - اختر الأنسب</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="projectType">نوع المشروع *</Label>
                <Select value={formData.projectType} onValueChange={(value) => handleChange('projectType', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="اختر نوع المشروع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commercial">إعلان تجاري</SelectItem>
                    <SelectItem value="documentary">وثائقي</SelectItem>
                    <SelectItem value="audiobook">كتاب صوتي</SelectItem>
                    <SelectItem value="elearning">محتوى تعليمي</SelectItem>
                    <SelectItem value="youtube">فيديو يوتيوب</SelectItem>
                    <SelectItem value="podcast">بودكاست</SelectItem>
                    <SelectItem value="ivr">رد آلي IVR</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">تفاصيل المشروع *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="صف مشروعك بالتفصيل..."
                required
                rows={6}
                className="mt-2 focus:border-vox-primary"
              />
            </div>

            {/* تم تغيير لون الحدود هنا ليصبح متناسقاً مع الثيم عند التمرير */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-vox-primary transition-colors cursor-pointer">
              <Upload className="size-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">ارفع ملفات المشروع (اختياري)</p>
              <Button type="button" variant="outline" className="mt-4 border-vox-primary text-vox-primary hover:bg-vox-light">
                اختر الملفات
              </Button>
            </div>

            {/* صندوق الملاحظة أصبح بنفسجي فاتح */}
            <div className="bg-vox-light p-6 rounded-lg border-r-4 border-vox-primary">
              <p className="text-sm text-gray-800 leading-relaxed font-medium">
                <strong>ملاحظة:</strong> بعد إرسال الطلب، سيتواصل معك أحد مسؤولي المبيعات خلال 24 ساعة لمناقشة التفاصيل والبدء في العمل.
              </p>
            </div>

            {/* الزر النهائي: لون الخط أبيض ناصع والخلفية تتبع الثيم */}
            <Button
              type="submit"
              size="lg"
              className="btn-vox w-full text-white font-bold text-xl shadow-lg hover:shadow-vox-primary/20 flex items-center justify-center gap-2"
            >
              <Send className="size-6 text-white" />
              <span className="text-white">إرسال الطلب</span>
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}