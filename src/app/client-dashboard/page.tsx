const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

useEffect(() => {
  if (!mounted) return;
  
  const role = localStorage.getItem('userRole');
  const id = localStorage.getItem('userId');
  // ... بقية الكود
}, [mounted, router]);

if (!mounted || loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="text-xl font-black text-red-600 animate-pulse">جاري التحميل...</div>
    </div>
  );
}
