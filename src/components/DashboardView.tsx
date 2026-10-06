'use client';

import React from 'react';
import { Subscription, MonthlyStats } from '@/types';
import { formatMoney, getMonthlyEquivalentHuf } from '@/lib/calculator';
import { ServiceIcon } from './ServiceIcon';
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  ChevronRight,
  ArrowUpRight,
  FileDown,
  Clock
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface DashboardViewProps {
  subscriptions: Subscription[];
  stats: MonthlyStats;
  onNavigate: (tab: any) => void;
  onEditSubscription: (sub: Subscription) => void;
  onDownloadPdf: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  subscriptions,
  stats,
  onNavigate,
  onEditSubscription,
  onDownloadPdf
}) => {
  const { t } = useLanguage();
  const dailyAverageHuf = Math.round(stats.totalMonthlyHuf / 30);
  const activeSubs = subscriptions.filter(s => s.isActive);
  const trialSubs = subscriptions.filter(s => s.isTrial && s.isActive);

  // Rendezés havi költség szerint csökkenő sorrendben a legdrágábbakhoz
  const topSubscriptions = [...activeSubs]
    .sort((a, b) => getMonthlyEquivalentHuf(b) - getMonthlyEquivalentHuf(a))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* KPI Kártyák */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. {t('totalMonthly').toUpperCase()} */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('totalMonthly').toUpperCase()}</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {formatMoney(stats.totalMonthlyHuf, 'HUF')}
          </div>
          <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
            <span className="text-foreground/75 font-medium">~{formatMoney(dailyAverageHuf, 'HUF')}</span> / {t('dailyAvg')}
          </div>
        </div>

        {/* 2. Éves vetület */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('totalYearly').toUpperCase()}</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {formatMoney(stats.totalYearlyHuf, 'HUF')}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Based on 12 months current state
          </div>
        </div>

        {/* 3. Aktív előfizetések */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('activeCount').toUpperCase()}</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {stats.activeCount} <span className="text-sm font-normal text-muted-foreground">/ {subscriptions.length} db</span>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {subscriptions.length - stats.activeCount > 0 ? (
              <span className="text-amber-500 font-medium">
                {subscriptions.length - stats.activeCount} db szüneteltetve
              </span>
            ) : (
              'All tracked items active'
            )}
          </div>
        </div>

        {/* 4. Közelgő levonások */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('upcoming7Days').toUpperCase()}</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {stats.upcomingCount7Days} <span className="text-sm font-normal text-muted-foreground">{t('upcoming7Days')}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Expected in next 7 days
          </div>
        </div>
      </div>

      {/* Próbaidőszak Figyelmeztető Értesítés (ha van ilyen) */}
      {trialSubs.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start sm:items-center justify-between gap-3 text-amber-500">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-foreground">
                Aktív próbaidőszak figyelmeztetés ({trialSubs.length} db)
              </div>
              <div className="text-xs text-muted-foreground">
                Ne felejtsd el időben lemondani, ha nem szeretnéd, hogy automatikusan megújuljon: {' '}
                <span className="text-foreground font-medium">
                  {trialSubs.map(s => s.name).join(', ')}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('subscriptions')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 text-white shrink-0 hover:bg-amber-600 transition-colors"
          >
            Kezelés
          </button>
        </div>
      )}

      {/* Kétoszlopos szekció: Közelgő {t('upcoming7Days')}ségek & Legnagyobb tételek */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bal oszlop: Közelgő levonások */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {t('upcoming7Days')}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Next 7 days events in order
              </p>
            </div>
            <button
              onClick={() => onNavigate('calendar')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Naptár nézet
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats.upcomingSubscriptions.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              {t('noUpcoming')}
            </div>
          ) : (
            <div className="space-y-3">
              {stats.upcomingSubscriptions.map((sub) => {
                const daysLeft = Math.ceil(
                  (new Date(sub.nextBillingDate).getTime() - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={sub.id}
                    onClick={() => onEditSubscription(sub)}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 hover:bg-secondary border border-border/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ServiceIcon name={sub.icon} domain={sub.domain} color={sub.color} className="w-9 h-9 shrink-0 p-2" />
                      <div className="truncate">
                        <div className="text-sm font-semibold text-foreground truncate flex items-center gap-1.5">
                          {sub.name}
                          {sub.isTrial && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 font-medium">
                              Próba
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {sub.nextBillingDate} &bull; {daysLeft === 0 ? `Ma ${t('upcoming7Days')}!` : `${daysLeft} nap múlva`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className="text-sm font-bold text-foreground">
                        {formatMoney(sub.amount, sub.currency)}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {sub.paymentMethod || 'Kártyás fizetés'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Jobb oszlop: Legnagyobb tételek & Gyorsműveletek */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Top Expenses
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sorted by monthly equivalent
                </p>
              </div>
              <button
                onClick={() => onNavigate('analytics')}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Részletes elemzés
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {topSubscriptions.map((sub) => {
                const monthlyHuf = Math.round(getMonthlyEquivalentHuf(sub));
                const percentOfTotal = stats.totalMonthlyHuf > 0 
                  ? Math.round((monthlyHuf / stats.totalMonthlyHuf) * 100) 
                  : 0;

                return (
                  <div
                    key={sub.id}
                    onClick={() => onEditSubscription(sub)}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 hover:bg-secondary border border-border/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ServiceIcon name={sub.icon} domain={sub.domain} color={sub.color} className="w-9 h-9 shrink-0 p-2" />
                      <div className="truncate">
                        <div className="text-sm font-semibold text-foreground truncate">
                          {sub.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {sub.category} &bull; {percentOfTotal}% of total
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className="text-sm font-bold text-foreground">
                        {formatMoney(monthlyHuf, 'HUF')} <span className="text-[11px] font-normal text-muted-foreground">/ {t('monthly')}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {formatMoney(sub.amount, sub.currency)} ({sub.billingCycle})
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alsó gyorsművelet sáv */}
          <div className="pt-5 mt-5 border-t border-border flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              Generate report:
            </span>
            <button
              onClick={onDownloadPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5 text-primary" />
              {t('downloadPdf')}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
