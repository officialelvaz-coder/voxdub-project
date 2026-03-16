import { Mic2, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-amber-700 p-2 rounded-lg">
                <Mic2 className="size-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">VoxDub</span>
            </div>
            <p className="text-sm leading-relaxed">
              منصتك الاحترافية للتعليق الصوتي والدوبلاج. نقدم خدمات عالية الجودة مع فريق من أفضل المعلقين الصوتيين.
            </p>
          </div>

          <div>
            <h3 className="text-white text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => document.getElementById('voices')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-amber-400 transition-colors"
                >
                  الأصوات
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-amber-400 transition-colors"
                >
                  الباقات
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-amber-400 transition-colors"
                >
                  كيف نعمل
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-amber-400 transition-colors"
                >
                  اطلب الآن
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg mb-4">خدماتنا</h3>
            <ul className="space-y-2 text-sm">
              <li>التعليق الصوتي</li>
              <li>الدوبلاج</li>
              <li>التدقيق اللغوي</li>
              <li>كتابة المحتوى</li>
              <li>الإعلانات التجارية</li>
              <li>الكتب الصوتية</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg mb-4">تواصل معنا</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="size-4" />
                <a href="mailto:info@voxdub.com" className="hover:text-amber-400 transition-colors">
                  info@voxdub.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4" />
                <a href="tel:+213551234567" className="hover:text-amber-400 transition-colors" dir="ltr">
                  +213 55 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4" />
                <span>الجزائر العاصمة، الجزائر</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© 2026 VoxDub. جميع الحقوق محفوظة.</p>
          <p className="mt-2 text-gray-400">تأسيس وإدارة: لميس حميمي</p>
        </div>
      </div>
    </footer>
  );
}