import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Home, ArrowRight } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-orange-900 flex items-center justify-center p-4" dir="rtl">
      <div className="text-center">
        <h1 className="text-9xl font-bold bg-gradient-to-l from-orange-400 to-orange-500 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mb-4">الصفحة غير موجودة</h2>
        <p className="text-stone-300 mb-8">عذراً، الصفحة التي تبحث عنها غير متوفرة</p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button
              size="lg"
              className="bg-gradient-to-l from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <Home className="ml-2 h-5 w-5" />
              العودة للرئيسية
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              لوحة التحكم
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
