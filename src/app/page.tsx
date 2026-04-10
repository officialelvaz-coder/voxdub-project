export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1f2937', color: 'white', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>VoxDub</h1>
        <p style={{ fontSize: '20px', marginBottom: '40px', opacity: 0.8 }}>منصة المعلقين الصوتيين المحترفين</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/login" style={{ backgroundColor: '#dc2626', color: 'white', padding: '12px 30px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>تسجيل الدخول</a>
          <a href="/register" style={{ backgroundColor: '#fbbf24', color: '#1f2937', padding: '12px 30px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>تسجيل جديد</a>
          <a href="/artists" style={{ backgroundColor: '#4b5563', color: 'white', padding: '12px 30px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>المعلقين</a>
        </div>
      </div>
    </div>
  );
}
