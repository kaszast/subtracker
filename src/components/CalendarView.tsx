'use client';

import React, { useState } from 'react';
import { Subscription } from '@/types';
import { formatMoney } from '@/lib/calculator';
import { ServiceIcon } from './ServiceIcon';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  ExternalLink
} from 'lucide-react';

interface CalendarViewProps {
  subscriptions: Subscription[];
  onEditSubscription: (sub: Subscription) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  subscriptions,
  onEditSubscription
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Hónap első napja és utolsó napja
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Magyar naptár: Hétfő (1) a hét kezdete, Vasárnap (0 -> 7)
  let startDayOfWeek = firstDayOfMonth.getDay();
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // 0: Hétfő, 6: Vasárnap

  // Előző hónap napjai a rács elején
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonthDays = [];
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    prevMonthDays.push(prevMonthLastDay - i);
  }

  // Következő / előző hónap váltás
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayDate(null);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDayDate(null);
  };

  // Megállapítjuk, mely előfizetések esedékesek az adott napon a kiválasztott év/hónapban
  const getSubscriptionsForDay = (dayNum: number): Subscription[] => {
    const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const targetDate = new Date(year, month, dayNum);

    return subscriptions.filter(sub => {
      if (!sub.isActive) return false;

      const subDate = new Date(sub.nextBillingDate);
      const subDay = subDate.getDate();

      // Havi előfizetés: ha a nap egyezik (vagy ha a hónap rövidebb és a hónap utolsó napja van)
      if (sub.billingCycle === 'monthly') {
        if (subDay === dayNum) return true;
        if (subDay > daysInMonth && dayNum === daysInMonth) return true;
        return false;
      }

      // Éves előfizetés: évforduló hónapja és napja
      if (sub.billingCycle === 'yearly') {
        return subDate.getMonth() === month && subDay === dayNum;
      }

      // Negyedéves: 3 havonta
      if (sub.billingCycle === 'quarterly') {
        const monthDiff = (year - subDate.getFullYear()) * 12 + (month - subDate.getMonth());
        return monthDiff % 3 === 0 && subDay === dayNum;
      }

      // Heti: minden 7. nap
      if (sub.billingCycle === 'weekly') {
        const diffTime = targetDate.getTime() - subDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays % 7 === 0;
      }

      // Alapértelmezett: pontos dátum egyezés
      return sub.nextBillingDate === targetDateStr;
    });
  };

  const monthNames = [
    'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
    'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
  ];

  const weekDayNames = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDateNum = today.getDate();

  // Kiszámítjuk a hónapban várható összes esedékes levonás összegét
  let monthlyTotalDue = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const subsOnDay = getSubscriptionsForDay(d);
    for (const s of subsOnDay) {
      monthlyTotalDue += s.amount * (s.currency === 'HUF' ? 1 : 400); // közelítő HUF
    }
  }

  // Kiválasztott nap előfizetései
  const selectedDaySubs = selectedDayDate ? getSubscriptionsForDay(parseInt(selectedDayDate.split('-')[2])) : [];

  return (
    <div className="space-y-6">
      
      {/* Naptár Fejléc */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {year}. {monthNames[month]}
            </h2>
            <p className="text-xs text-muted-foreground">
              Várható levonások a hónapban: ~{formatMoney(Math.round(monthlyTotalDue), 'HUF')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors mr-1"
          >
            Ma
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Előző hónap"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Következő hónap"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Naptár rács (3 oszlop) */}
        <div className="lg:col-span-3 rounded-2xl bg-card border border-border shadow-sm overflow-hidden p-4">
          
          {/* Hét napjai fejléc */}
          <div className="grid grid-cols-7 mb-2 text-center text-xs font-bold text-muted-foreground border-b border-border pb-2">
            {weekDayNames.map(day => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>

          {/* Napok cellái */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 auto-rows-fr">
            
            {/* Előző hónap szürke napjai */}
            {prevMonthDays.map((pDay, idx) => (
              <div
                key={`prev-${idx}`}
                className="min-h-[70px] sm:min-h-[90px] p-1.5 rounded-xl bg-secondary/20 text-muted-foreground/40 text-[11px]"
              >
                {pDay}
              </div>
            ))}

            {/* Aktuális hónap napjai */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const daySubs = getSubscriptionsForDay(dayNum);
              const isToday = isCurrentMonth && dayNum === todayDateNum;
              const isSelected = selectedDayDate === dateStr;

              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDayDate(dateStr)}
                  className={`min-h-[75px] sm:min-h-[95px] p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/30 bg-primary/5'
                      : isToday
                      ? 'border-primary/50 bg-secondary/40 font-bold'
                      : 'border-border/60 hover:border-border hover:bg-secondary/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs inline-flex items-center justify-center rounded-md px-1.5 py-0.5 ${
                        isToday
                          ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                          : 'text-foreground font-semibold'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {daySubs.length > 0 && (
                      <span className="text-[10px] font-bold text-primary">
                        {daySubs.length} db
                      </span>
                    )}
                  </div>

                  {/* Előfizetések buborékok a cellában */}
                  <div className="space-y-1 overflow-y-auto max-h-[50px] sm:max-h-[65px] scrollbar-none">
                    {daySubs.map(sub => (
                      <div
                        key={sub.id}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] truncate shadow-sm"
                        style={{
                          backgroundColor: `${sub.color || '#3b82f6'}20`,
                          color: sub.color || 'var(--foreground)',
                          borderLeft: `2.5px solid ${sub.color || '#3b82f6'}`
                        }}
                        title={`${sub.name} - ${formatMoney(sub.amount, sub.currency)}`}
                      >
                        <span className="font-semibold truncate">{sub.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Kiválasztott nap vagy havi összegző oldalsáv (1 oszlop) */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="border-b border-border pb-3 mb-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {selectedDayDate ? `Napi részletek: ${selectedDayDate}` : 'Válassz egy napot!'}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kattints a naptár bármelyik cellájára a részletekért
              </p>
            </div>

            {selectedDayDate ? (
              selectedDaySubs.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Ezen a napon nincs esedékes levonás.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDaySubs.map(sub => (
                    <div
                      key={sub.id}
                      onClick={() => onEditSubscription(sub)}
                      className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/60 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <ServiceIcon name={sub.icon} domain={sub.domain} color={sub.color} className="w-7 h-7 p-1.5" />
                        <span className="text-xs font-bold text-foreground truncate">{sub.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{sub.category}</span>
                        <span className="font-bold text-foreground">
                          {formatMoney(sub.amount, sub.currency)}
                        </span>
                      </div>
                      {sub.paymentMethod && (
                        <div className="text-[10px] text-muted-foreground mt-1">
                          Fizetés: {sub.paymentMethod}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Kattints egy naptári napra, ahol előfizetés található, hogy megtekinthesd a részleteit vagy szerkeszd.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border mt-4 text-[11px] text-muted-foreground">
            A havi előfizetések automatikusan minden hónap adott napján szerepelnek a naptárban.
          </div>
        </div>

      </div>

    </div>
  );
};
