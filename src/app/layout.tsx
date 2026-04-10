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
      <head>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background-color: #f3f4f6;
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
