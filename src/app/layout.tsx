import type { Metadata } from 'next';
import './globals.css';

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
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}
