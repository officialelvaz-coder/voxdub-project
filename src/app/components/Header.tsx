import { Mic2, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* قسم الشعار */}
          <div className="flex items-center gap-2">
            {/* الكلاس bg-vox-primary هو الذي يتحكم في لون الأيقونة من ملف theme.css */}
            <div className="bg-vox-primary p-2 rounded-lg">
              <Mic2 className="size-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 font-arabic">VoxDub</span>
          </div>

          {/* أزرار التنقل */}
          <div className="flex items-center gap-3">
            {/* زر لوحة التحكم */}
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-200"
            >
              <LayoutDashboard className="size-4" />
              <span>لوحة التحكم</span>
            </Link>

            {/* زر اطلب الآن - الكلاس btn-vox هو الذي يتحكم في لونه من ملف theme.css */}
            <Button
              onClick={() => scrollToSection('order')}
              className="btn-vox"
            >
              اطلب الآن
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}