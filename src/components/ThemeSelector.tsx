'use client';

import React, { useState, useEffect, useRef } from 'react';
import { THEMES, DEFAULT_THEME_ID } from '@/lib/themes';
import { ThemeId } from '@/types';
import { Palette, Check, Moon, Sun } from 'lucide-react';
import { useLanguage, getTranslatedThemeDescription } from '@/lib/i18n';

export const ThemeSelector: React.FC = () => {
  const { t } = useLanguage();
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(DEFAULT_THEME_ID);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Betöltjük a mentett témát
    const saved = localStorage.getItem('subman_theme') as ThemeId;
    if (saved && THEMES.some(t => t.id === saved)) {
      setCurrentTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', DEFAULT_THEME_ID);
    }
  }, []);

  useEffect(() => {
    // Kívülre kattintás figyelése
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeTheme = (themeId: ThemeId) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('subman_theme', themeId);
    setIsOpen(false);
  };

  const activeThemeObj = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-card-foreground text-xs sm:text-sm font-medium transition-colors shadow-sm"
        title={t('changeTheme')}
      >
        <span
          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-inner"
          style={{ backgroundColor: activeThemeObj.primaryColor }}
        />
        <span className="hidden md:inline">{activeThemeObj.name}</span>
        <Palette className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-card border border-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1.5 border-b border-border mb-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              10 Dizájn Téma
            </span>
            <span className="text-[11px] text-muted-foreground">{t('immediateSwitch')}</span>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
            {THEMES.map((theme) => {
              const isSelected = theme.id === currentTheme;
              return (
                <button
                  key={theme.id}
                  onClick={() => changeTheme(theme.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'bg-primary/10 border border-primary/30 text-primary font-medium'
                      : 'hover:bg-muted text-card-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Téma szín előnézet */}
                    <div
                      className="w-5 h-5 rounded-md border border-border flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: theme.bgColor }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                        {theme.name}
                        {theme.isDark ? (
                          <Moon className="w-3 h-3 text-muted-foreground" />
                        ) : (
                          <Sun className="w-3 h-3 text-amber-500" />
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate max-w-[190px]">
                        {getTranslatedThemeDescription(t, theme.id) || theme.description}
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
