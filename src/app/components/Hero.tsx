import { Mic2, Headphones, FileText } from 'lucide-react';
import { Button } from './ui/button';

export function Hero() {
  const scrollToOrder = () => {
    const element = document.getElementById('order');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center">
          
          {/* المربع الأحمر الملكي - بدون ميلان وبالخط الأصلي */}
          <div className="flex justify-center mb-8">
            <span className="inline-block px-6 py-2 rounded-lg bg-vox-primary text-white font-bold shadow-md">
              منصتك الاحترافية للتعليق الصوتي والدوبلاج
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6 leading-tight">
            اجعل لمشروعك <span className="text-vox-primary">صوتاً</span> لا يُنسى
          </h1>
          
          <p className="text-xl text-stone-600 mb-10 max-w-2xl mx-auto">
            نخبة من المعلقين الصوتيين المحترفين في العالم العربي بين يديك، بجودة استوديو عالمية.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <Button
              size="lg"
              onClick={scrollToOrder}
              className="bg-vox-primary hover:bg-stone-900 text-white text-lg px-8 py-6 h-auto"
            >
              ابدأ مشروعك الآن
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('voices')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8 py-6 h-auto border-vox-primary text-vox-primary hover:bg-vox-light"
            >
              استمع للأصوات
            </Button>
          </div>

          {/* المميزات الثلاث */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-vox-light w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic2 className="size-7 text-vox-primary" />
              </div>
              <h3 className="text-xl mb-2 text-gray-900 font-semibold">أصوات متنوعة</h3>
              <p className="text-gray-600">أكثر من 50 معلق صوتي محترف بأساليب وأصوات متنوعة</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-vox-light w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="size-7 text-vox-primary" />
              </div>
              <h3 className="text-xl mb-2 text-gray-900 font-semibold">جودة عالية</h3>
              <p className="text-gray-600">تسجيلات بجودة استوديو احترافية مع ضمان الجودة</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-vox-light w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="size-7 text-vox-primary" />
              </div>
              <h3 className="text-xl mb-2 text-gray-900 font-semibold">خدمات شاملة</h3>
              <p className="text-gray-600">باقات متكاملة تشمل الكتابة والتدقيق اللغوي</p>
            </div>
          </div>

        </div> {/* إغلاق text-center */}
      </div> {/* إغلاق container */}
    </section>
  );
}