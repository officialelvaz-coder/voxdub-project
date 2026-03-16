# 📘 دليل التعديل على مشروع VoxDub

## 🚀 كيفية تشغيل المشروع

### 1. التحميل والتشغيل
```bash
# بعد تحميل المشروع من Figma Make
npm install
npm run dev
```
المشروع سيعمل على: `http://localhost:5173`

---

## 📂 هيكل المشروع - الملفات الأساسية

```
📁 voxdub/
├── 📁 public/               ← ضع الملفات الثابتة هنا (صور، أصوات)
│   └── 📁 audio/           ← الملفات الصوتية للمؤدين
│       ├── belhadj-sample.mp3
│       ├── adam-sample.mp3
│       └── ...
│
├── 📁 src/app/
│   ├── 📄 App.tsx          ← الملف الرئيسي
│   ├── 📄 routes.ts        ← إدارة الصفحات والروابط
│   │
│   ├── 📁 pages/           ← جميع الصفحات (17 صفحة)
│   │   ├── Landing.tsx     ← الصفحة الرئيسية
│   │   ├── Login.tsx       ← تسجيل الدخول
│   │   ├── Dashboard.tsx   ← لوحة التحكم
│   │   ├── Artists.tsx     ← صفحة المؤدين ⭐
│   │   └── ...
│   │
│   ├── 📁 data/
│   │   └── mockData.ts     ← البيانات الوهمية ⭐⭐⭐ (أهم ملف للتعديل)
│   │
│   ├── 📁 layouts/
│   │   └── DashboardLayout.tsx  ← تصميم لوحة التحكم
│   │
│   ├── 📁 components/      ← المكونات القابلة لإعادة الاستخدام
│   │   └── ui/             ← الأزرار، النماذج، البطاقات...
│   │
│   └── 📁 styles/
│       ├── theme.css       ← الألوان والخطوط ⭐
│       └── fonts.css       ← الخطوط العربية
│
└── 📄 package.json         ← المكتبات المثبتة
```

---

## 🎨 التعديلات الشائعة

### 1️⃣ إضافة عينة صوتية لمؤدي

#### **الخطوة 1:** أضف الملف الصوتي
```
📁 public/audio/
├── belhadj-sample.mp3    ← ضع ملفك الصوتي هنا
```

#### **الخطوة 2:** عدّل البيانات
افتح `/src/app/data/mockData.ts`:

```typescript
export const voiceArtists: VoiceArtist[] = [
  {
    id: '1',
    name: 'بلهادي محمد إسلام',
    specialty: 'تعليق صوتي إعلاني',
    // ... باقي البيانات
    sampleAudio: '/audio/belhadj-sample.mp3' // ⭐ أضف هذا السطر
  }
];
```

✅ **النتيجة:** سيظهر زر "استماع للعينة الصوتية" في صفحة `/dashboard/artists`

---

### 2️⃣ إضافة مؤدي جديد

افتح `/src/app/data/mockData.ts` وأضف عنصر جديد:

```typescript
export const voiceArtists: VoiceArtist[] = [
  // ... المؤدين الحاليين
  {
    id: '6', // ⭐ رقم جديد
    name: 'سارة بن عيسى',
    specialty: 'تعليق نسائي ناعم',
    languages: ['العربية'],
    rating: 4.7,
    completedProjects: 89,
    hourlyRate: 7200,
    avatar: '',
    bio: 'معلقة صوتية متخصصة في الإعلانات النسائية',
    sampleAudio: '/audio/sarah-sample.mp3' // اختياري
  }
];
```

---

### 3️⃣ إضافة مشروع جديد

في `/src/app/data/mockData.ts`:

```typescript
export const projects: Project[] = [
  // ... المشاريع الحالية
  {
    id: 'PRJ-006',
    title: 'إعلان راديو - متجر إلكتروني',
    clientName: 'متجر جوميا',
    voiceArtist: 'منال إبراهيمي',
    package: 'standard', // basic | standard | premium
    status: 'draft', // draft | casting | recording | mixing | review | completed | delivered
    progress: 10,
    createdAt: '2026-03-14',
    deadline: '2026-03-28',
    budget: 8000,
    description: 'إعلان راديو 20 ثانية لحملة تسويقية'
  }
];
```

---

### 4️⃣ تغيير الألوان

افتح `/src/styles/theme.css`:

```css
@theme {
  /* الألوان الرئيسية */
  --color-primary: oklch(0.65 0.15 30); /* البرتقالي الحالي */
  
  /* لتغيير اللون الأساسي، غيّر هذا السطر */
  --color-primary: oklch(0.55 0.20 220); /* أزرق مثلاً */
}
```

---

### 5️⃣ تعديل نص في صفحة معينة

**مثال:** تغيير عنوان صفحة المؤدين

افتح `/src/app/pages/Artists.tsx`:

```typescript
<h1 className="text-3xl font-bold text-stone-900 mb-2">
  إدارة قاعدة بيانات المؤدين  {/* ⭐ غيّر هذا النص */}
</h1>
```

---

### 6️⃣ إضافة صفحة جديدة

#### **الخطوة 1:** أنشئ الملف
أنشئ ملف `/src/app/pages/Clients.tsx`:

```typescript
export function Clients() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-stone-900">قائمة العملاء</h1>
      <p>محتوى الصفحة هنا...</p>
    </div>
  );
}
```

#### **الخطوة 2:** أضفها للـ Routing
افتح `/src/app/routes.ts`:

```typescript
import { Clients } from './pages/Clients'; // ⭐ استيراد الصفحة

export const router = createBrowserRouter([
  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      // ... الصفحات الحالية
      {
        path: 'clients', // ⭐ المسار الجديد
        Component: Clients,
      },
    ],
  },
]);
```

#### **الخطوة 3:** أضف رابط في القائمة
افتح `/src/app/layouts/DashboardLayout.tsx` وأضف عنصر القائمة.

✅ **النتيجة:** صفحة جديدة على `/dashboard/clients`

---

### 7️⃣ إضافة إشعار جديد

في `/src/app/data/mockData.ts`:

```typescript
export const notifications: Notification[] = [
  {
    id: '5', // ⭐ رقم جديد
    type: 'success', // info | warning | success | error
    title: 'دفعة مالية',
    message: 'تم استلام دفعة بقيمة 15,000 دج من العميل',
    timestamp: '2026-03-14T11:00:00',
    read: false // false = غير مقروء
  },
  // ... باقي الإشعارات
];
```

---

### 8️⃣ تعديل أسعار الباقات

في `/src/app/pages/Landing.tsx` أو `/src/app/pages/NewProject.tsx`:

ابحث عن:
```typescript
const packages = [
  { name: 'basic', price: 5000 }, // ⭐ غيّر السعر
  { name: 'standard', price: 8000 },
  { name: 'premium', price: 13000 },
];
```

---

## 🔧 أدوات مفيدة

### تثبيت مكتبة جديدة
```bash
npm install library-name
```

### تشغيل المشروع
```bash
npm run dev
```

### بناء النسخة النهائية
```bash
npm run build
```

---

## 📸 إضافة صور

### من الإنترنت (Unsplash مثلاً):
```typescript
<img src="https://images.unsplash.com/photo-xxx" alt="وصف" />
```

### من المشروع:
```
📁 public/images/
└── logo.png

<img src="/images/logo.png" alt="شعار VoxDub" />
```

---

## 🎵 إضافة مشغل صوتي مخصص

```typescript
<audio controls>
  <source src="/audio/sample.mp3" type="audio/mpeg" />
  متصفحك لا يدعم تشغيل الصوت
</audio>
```

---

## 🐛 حل المشاكل الشائعة

### 1. الصوت لا يشتغل
- تأكد أن الملف موجود في `public/audio/`
- تأكد أن المسار صحيح: `/audio/filename.mp3`
- جرّب فتح الملف مباشرة: `http://localhost:5173/audio/filename.mp3`

### 2. التغييرات لا تظهر
- احفظ الملف (Ctrl+S)
- انتظر ثوانٍ - التطبيق يعيد التحميل تلقائياً
- جرّب إعادة تحميل الصفحة (F5)

### 3. خطأ في الكود
- تحقق من وحدة التحكم (F12 في المتصفح)
- راجع الأخطاء الإملائية
- تأكد من إغلاق جميع الأقواس `{}` `[]` `()`

---

## 📚 موارد إضافية

### الأيقونات (Lucide React)
```typescript
import { Icon1, Icon2 } from 'lucide-react';

<Icon1 className="h-5 w-5" />
```

**أمثلة:**
- `Mic`, `Video`, `Download`, `Upload`
- `Settings`, `User`, `Bell`, `Calendar`
- قائمة كاملة: https://lucide.dev/icons/

### المكونات الجاهزة
جميع المكونات في `/src/app/components/ui/`:
- `<Button>` - أزرار
- `<Card>` - بطاقات
- `<Input>` - حقول إدخال
- `<Badge>` - شارات
- `<Dialog>` - نوافذ منبثقة
- وغيرها...

---

## 💡 نصائح للمبتدئين

1. **ابدأ بالبيانات:** معظم التعديلات في `/src/app/data/mockData.ts`
2. **استخدم نسخ احتياطي:** انسخ الملف قبل التعديل
3. **غيّر تدريجياً:** لا تعدّل كثيراً دفعة واحدة
4. **جرّب فوراً:** شاهد النتيجة بعد كل تغيير
5. **اقرأ الأخطاء:** رسائل الخطأ تساعدك على الفهم

---

## 🎓 لمشروع التخرج

### ما يمكن تعديله بسهولة:
✅ البيانات (مؤدين، مشاريع، إشعارات)
✅ الألوان والتصميم
✅ النصوص والترجمات
✅ الصور والأيقونات
✅ إضافة صفحات بسيطة

### ما يحتاج معرفة برمجة:
⚠️ تغيير طريقة عمل الأزرار
⚠️ إضافة قاعدة بيانات حقيقية
⚠️ إضافة مزايا متقدمة جداً

---

**🎉 بالتوفيق في مشروع التخرج!**

للأسئلة: راجع هذا الدليل أو ابحث في الكود عن أمثلة مشابهة.
