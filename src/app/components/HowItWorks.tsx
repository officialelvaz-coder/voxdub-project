import { Search, MessageSquare, Mic2, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'اختر الصوت المناسب',
    description: 'تصفح مجموعة الأصوات واستمع للعينات واختر الصوت الذي يناسب مشروعك',
  },
  {
    icon: MessageSquare,
    title: 'حدد الباقة والتفاصيل',
    description: 'اختر الباقة المناسبة وقدم تفاصيل مشروعك بدقة',
  },
  {
    icon: Mic2,
    title: 'نبدأ العمل',
    description: 'فريقنا يبدأ العمل على مشروعك بأعلى معايير الجودة',
  },
  {
    icon: CheckCircle,
    title: 'استلم مشروعك',
    description: 'احصل على التعليق الصوتي النهائي بجودة احترافية في الموعد المحدد',
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4 text-gray-900 font-bold">كيف نعمل</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            عملية بسيطة وسلسة للحصول على تعليق صوتي احترافي
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              
              return (
                <div key={index} className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gray-100 -z-10" 
                         style={{ transform: 'translateX(-50%)' }} />
                  )}
                  
                  <div className="text-center">
                    {/* استخدام الكلاسات الموحدة للأيقونات */}
                    <div className="bg-vox-light w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-vox-light shadow-sm">
                      <Icon className="size-12 text-vox-primary" />
                    </div>
                    
                    <div className="mb-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-vox-primary text-white text-sm font-bold mb-2">
                        {index + 1}
                      </span>
                    </div>
                    
                    <h3 className="text-xl mb-3 text-gray-900 font-semibold">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* الصندوق الكبير - تم ربطه بـ bg-vox-primary */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-vox-primary rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
            <h3 className="text-3xl mb-4 font-bold">جاهز للبدء؟</h3>
            <p className="text-xl mb-8 opacity-90">
              انضم إلى مئات العملاء الراضين عن خدماتنا
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-vox-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                ابدأ مشروعك الآن
              </button>
              <button
                onClick={() => document.getElementById('voices')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
              >
                تعرف على أصواتنا
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}