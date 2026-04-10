import { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

import { db } from '../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function OrderForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', package: '', 
    voiceArtist: '', projectType: '', description: '', 
    duration: '', deadline: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await addDoc(collection(db, "orders"), {
        ...formData,
        status: 'جديد',
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
      toast.success('تم إرسال طلبك بنجاح!');
    } catch (error) {
      console.error("Error: ", error);
      toast.error('حدث خطأ أثناء الإرسال');
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold">تم استلام طلبك بنجاح!</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white" dir="rtl">
      <div className="container mx-auto px-4 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>الاسم الكامل</Label>
          <Input required onChange={(e) => handleChange('name', e.target.value)} />
          <Label>البريد الإلكتروني</Label>
          <Input type="email" required onChange={(e) => handleChange('email', e.target.value)} />
          <Label>رقم الهاتف</Label>
          <Input required onChange={(e) => handleChange('phone', e.target.value)} />
          <Label>تفاصيل المشروع</Label>
          <Textarea required onChange={(e) => handleChange('description', e.target.value)} />
          <Button type="submit" disabled={isSending} className="w-full bg-black text-white py-4">
            {isSending ? 'جاري الإرسال...' : 'تأكيد وإرسال الطلب'}
          </Button>
        </form>
      </div>
    </section>
  );
}
