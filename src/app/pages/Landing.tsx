export function Landing() {
  const navigate = useNavigate();
  const { userRole, setUserRole, login } = useAuth();

  // 1. تعريف حالة اللون وسحبه من الذاكرة
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('voxdub_theme') || '#4c1d95');

  // 2. دالة التعامل مع تغيير اللون (تحديث الذاكرة وتنبيه الموقع)
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setThemeColor(newColor);
    localStorage.setItem('voxdub_theme', newColor);
    // هذا السطر يضمن أن اللون سيتغير في صفحة المعلق فوراً دون تحديث
    window.dispatchEvent(new Event('storage')); 
  };

  // ... (بقية الـ states الخاصة بك مثل playingId, allArtists إلخ)

  return (
    <div className="min-h-screen bg-white font-sans text-right" dir="rtl">
      {/* 🎨 زر تغيير اللون العائم - يظهر لـ "لميس" (admin) فقط */}
      {userRole === 'admin' && (
        <div className="fixed bottom-10 left-10 z-[1000] bg-white p-4 rounded-[2.5rem] shadow-2xl border-4 border-stone-100 flex flex-col items-center gap-2 group hover:scale-110 transition-all">
          <div className="bg-stone-50 p-2 rounded-2xl text-stone-400 group-hover:text-vox-primary">
            <Palette size={24} />
          </div>
          <span className="text-[10px] font-black text-stone-400">هوية الموقع</span>
          <input 
            type="color" 
            value={themeColor} 
            onChange={handleColorChange}
            className="w-12 h-12 rounded-full cursor-pointer border-4 border-white shadow-inner bg-transparent"
          />
        </div>
      )}

      <style>{`
        /* تأكد أن المتغير يستخدم themeColor الذي نغيره الآن */
        .text-vox-primary { color: ${themeColor} !important; }
        .bg-vox-primary { background-color: ${themeColor} !important; }
        .border-vox-primary { border-color: ${themeColor} !important; }
        /* ... بقية الستايلات الخاصة بك */
      `}</style>

      {/* ... (تكملة الـ JSX الخاص بك من Nav و Hero و Artists) */}
    </div>
  );
}
