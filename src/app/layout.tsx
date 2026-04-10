import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VoxDub - منصة المعلقين الصوتيين',
  description: 'منصة متخصصة للمعلقين الصوتيين المحترفين',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ backgroundColor: '#f3f4f6' }}>
        {children}
      </body>
    </html>
  );
}
