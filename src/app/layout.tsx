import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaRegistry } from '@/components/PwaRegistry';
import { LanguageProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'SubTracker - Modern Előfizetés Kezelő',
  description: 'Kezeld az összes előfizetésedet egy helyen: havi költségek, naptár nézet, statisztikák, PDF riport és adatmentés.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SubTracker'
  }
};

export const viewport: Viewport = {
  themeColor: '#10B981',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu" data-theme="obsidian">
      <body className="antialiased font-sans">
        <LanguageProvider>
          <PwaRegistry />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
