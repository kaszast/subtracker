import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaRegistry } from '@/components/PwaRegistry';
import { LanguageProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'SubTracker - Modern Előfizetés Kezelő',
  description: 'Manage all your subscriptions in one place: monthly costs, calendar view, statistics, PDF report, and backup.',
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
