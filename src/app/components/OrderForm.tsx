'use client';

import React, { useState } from 'react';
import { db, app } from './firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Check } from 'lucide-react';

export function OrderForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedVoiceActor, setSelectedVoiceActor] = useState('');
  const [workType, setWorkType] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const voiceActors = [
    'مصطفى جغلال', 'لميس حميمي', 'بلهادي محمد إسلام', 
    'أحمد حاج إسماعيل', 'منال إبراهيمي', 'آدم حمدوني', 
    'اختيار الأنسب من طرفكم'
  ];

  const workTypes = ['إعلان تجاري', 'وثائقي', 'كتاب صوتي', 'رد آلي (IVR)', 'بودكاست', 'آخر'];

  const packages = [
    { 
      name: "باقة التعليق الصوتي", 
      price: "5000", 
      isGold: false,
      description: "مثالية للمشاريع القصيرة والإعلانات السريعة",
      features: ["تسجيل صوتي احترافي (Raw)", "معدات تسجيل عالمية", "تعديل هندسي بسيط", "تسليم خلال 48 ساعة"]
    },
    { 
      name: "باقة التعليق والتدقيق", 
      price: "8000", 
      isGold: true, 
      description: "الباقة الأكثر طلباً للمحتوى الوثائقي والتعليمي",
      features: ["كل مميزات الباقة الأساسية", "تدقيق لغوي وتشكيل كامل", "هندسة صوتية متقدمة (Mixing)", "خيار الموسيقى الخلفية", "مراجعة واحدة مجانية"]
    },
    { 
      name: "باقة كاملة المحتوى", 
      price: "13000", 
      isGold: false,
      description: "حل متكامل من الفكرة وحتى النشر النهائي",
      features: ["إعداد وكتابة السكريبت", "دبلجة احترافية متعددة الطبقات", "مؤثرات صوتية خاصة (SFX)", "حقوق استخدام تجاري كاملة", "دعم فني وتعديلات مفتوحة"]
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) { setError('يرجى اختيار الباقة المناسبة أولاً'); return; }
    if (!selectedVoiceActor) { setError('يرجى اختيار المعلق الصوتي'); return; }
    
    setLoading(true);
    setError(null);

    try {
      let fileDownloadURL = null;
      if (attachedFile) {
        const storage = getStorage(app);
        const storageRef = ref(storage, `orders/${Date.now()}_${attachedFile.name}`);
        const snapshot = await uploadBytes(storageRef, attachedFile);
        fileDownloadURL = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "orders"), {
        firstName,
        lastName,
        email,
        phoneNumber,
        selectedPackage,
        selectedVoiceActor,
        workType,
        description,
        fileAttachmentURL: fileDownloadURL,
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Firebase Error: ", err);
      setError("حدث خطأ أثناء الإرسال، يرجى التأكد من تفعيل Firebase Storage والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-12 bg-green-50 border-2 border-green-200 text-green-800 rounded-[32px] text-center shadow-xl">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="text-white w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold mb-4">تم استلام طلبك بنجاح!</h2>
        <p className="text-lg">شكراً لثقتك بـ VoxDub. سيقوم فريقنا بمراجعة طلبك والتواصل معك قريباً.</p>
        <button onClick={() => setIsSubmitted(false)} className="mt-8 text-green-700 font-bold underline">إرسال طلب آخر</button>
      </div>
    );
  }

  return (
    <section className="py-16 bg-stone-50" id="order-form">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-stone-900 mb-4">ابدأ مشروعك الآن</h2>
          <p className="text-stone-500">اختر الباقة المناسبة وأكمل بياناتك لنبدأ العمل فوراً</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* مرحلة اختيار الباقة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div 
                key={pkg.name} 
                onClick={() => setSelectedPackage(pkg.name)}
                className={`cursor-pointer p-6 rounded-[24px] border-2 transition-all duration-300 ${
                  selectedPackage === pkg.name 
                  ? (pkg.isGold ? 'border-[#D4AF37] bg-amber-50 shadow-lg' : 'border-red-600 bg-red-50 shadow-lg')
                  : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-stone-800">{pkg.name}</h3>
                  {selectedPackage === pkg.name && <Check className={pkg.isGold ? 'text-[#D4AF37]' : 'text-red-600'} />}
                </div>
                <p className="text-2xl font-black mb-2">{pkg.price} <span className="text-sm font-normal text-stone-500">د.ج</span></p>
                <p className="text-xs text-stone-500 mb-4">{pkg.description}</p>
                <ul className="space-y-2">
                  {pkg.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="text-[11px] text-stone-600 flex items-center gap-2">
                      <div className={`w-1 h-1 rounded-full ${pkg.isGold ? 'bg-[#D4AF37]' : 'bg-red-600'}`} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* مرحلة البيانات الشخصية */}
          <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-xl border border-stone-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* العمود الأول */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">الاسم الأول *</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="محمد" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">اللقب *</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="أحمد" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">البريد الإلكتروني *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="example@mail.com" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">رقم الهاتف *</label>
                  <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="05XXXXXXXX" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">نوع العمل *</label>
                  <select value={workType} onChange={(e) => setWorkType(e.target.value)} required className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all">
                    <option value="">اختر نوع العمل</option>
                    {workTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* العمود الثاني */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">اختر المعلق الصوتي *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {voiceActors.map(actor => (
                      <button 
                        key={actor} 
                        type="button" 
                        onClick={() => setSelectedVoiceActor(actor)} 
                        className={`p-2 text-[11px] font-bold border rounded-xl transition-all ${selectedVoiceActor === actor ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'}`}
                      >
                        {actor}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">تفاصيل إضافية *</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" rows={3} placeholder="اشرح طلبك بالتفصيل..." />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">إرفاق ملف (اختياري)</label>
                  <div className="relative">
                    <input type="file" onChange={(e) => setAttachedFile(e.target.files ? e.target.files[0] : null)} className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-red-600/20 hover:bg-stone-900 transition-all duration-300 disabled:bg-stone-300 disabled:shadow-none"
              >
                {loading ? "جاري معالجة طلبك..." : "تأكيد وإرسال الطلب"}
              </button>
              {error && <p className="text-red-600 text-center font-bold mt-4">{error}</p>}
              <p className="text-center text-stone-400 text-xs mt-4">بالضغط على إرسال، أنت توافق على شروط الخدمة الخاصة بـ VoxDub</p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
