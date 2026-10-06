'use client';

import React from 'react';
import { ThemeSelector } from './ThemeSelector';
import { useLanguage } from '@/lib/i18n';
import { 
  LayoutDashboard, 
  ListFilter, 
  CalendarDays, 
  PieChart, 
  HardDriveDownload, 
  PlusCircle,
  Receipt
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'subscriptions' | 'calendar' | 'analytics' | 'backup';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenNewModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onOpenNewModal }) => {
  const { t, lang, setLang } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'subscriptions', label: t('subscriptions'), icon: ListFilter },
    { id: 'calendar', label: t('calendar'), icon: CalendarDays },
    { id: 'analytics', label: t('analytics'), icon: PieChart },
    { id: 'backup', label: t('backup'), icon: HardDriveDownload },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logó és cím */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-foreground block">
                SubTracker
              </span>
              <span className="text-[11px] text-muted-foreground hidden sm:block">
                {t('subscriptions')}
              </span>
            </div>
          </div>

          {/* Navigációs fülek (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as ActiveTab)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-card text-foreground shadow-sm border border-border font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Jobb oldali műveletek: Téma és Új gomb */}
          <div className="flex items-center gap-2.5">
            <button
            onClick={() => setLang(lang === 'hu' ? 'en' : 'hu')}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-secondary transition-colors uppercase"
            title={t('language')}
          >
            {lang}
          </button>
          <ThemeSelector />
            
            <button
              onClick={onOpenNewModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-accent text-primary-foreground text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t('newSubscription')}</span>
              <span className="sm:hidden">{t('newSubscription').substring(0, 3)}</span>
            </button>
          </div>
        </div>

        {/* Mobil Navigáció (Alsó sor kisebb képernyőkön) */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-border gap-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as ActiveTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
