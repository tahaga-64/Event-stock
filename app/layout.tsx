import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'イベント在庫管理',
  description: 'イベント運営向けの無料在庫管理Webアプリ'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
