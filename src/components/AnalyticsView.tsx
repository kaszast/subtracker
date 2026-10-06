'use client';

import React, { useState, useEffect } from 'react';
import { Subscription, MonthlyStats } from '@/types';
import { formatMoney, getMonthlyEquivalentHuf } from '@/lib/calculator';
import { 
  FileDown, 
  PieChart as PieChartIcon, 
  BarChart3, 
  CreditCard, 
  CheckCircle2, 
  Sparkles,
  TrendingDown,
  Info
, Calendar } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis 
} from 'recharts';

interface AnalyticsViewProps {
  subscriptions: Subscription[];
  stats: MonthlyStats;
  onDownloadPdf: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  subscriptions,
  stats,
  onDownloadPdf
}) => {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeSubs = subscriptions.filter(s => s.isActive);

  // Fizetési módok szerinti összesítés
  const paymentMethodTotals: Record<string, number> = {};
  for (const sub of activeSubs) {
    const pm = sub.paymentMethod || 'Nincs megadva';
    const huf = getMonthlyEquivalentHuf(sub);
    paymentMethodTotals[pm] = (paymentMethodTotals[pm] || 0) + huf;
  }

  const paymentMethodList = Object.entries(paymentMethodTotals)
    .map(([method, total]) => ({
      method,
      total: Math.round(total),
      percentage: stats.totalMonthlyHuf > 0 ? Math.round((total / stats.totalMonthlyHuf) * 100) : 0
    }))
    .sort((a, b) => b.total - a.total);

  // Top 6 legdrágább előfizetés diagram adatokhoz
  const topBarData = [...activeSubs]
    .sort((a, b) => getMonthlyEquivalentHuf(b) - getMonthlyEquivalentHuf(a))
    .slice(0, 6)
    .map(s => ({
      name: s.name.length > 12 ? `${s.name.substring(0, 11)}...` : s.name,
      amount: Math.round(getMonthlyEquivalentHuf(s))
    }));

  const pieChartData = stats.categorySummaries.map(c => ({
    name: c.category,
    value: c.monthlyTotalHuf,
    color: c.color
  }));

  return (
    <div className="space-y-6">
      
      {/* Fejléc és PDF gomb */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-primary" />
            {t('analyticsTitle')} és Elemzések
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Részletes kiadási struktúra kategóriák, devizák és fizetési kártyák szerint
          </p>
        </div>

        <button
          onClick={onDownloadPdf}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-accent text-primary-foreground text-xs font-semibold shadow-sm transition-all"
        >
          <FileDown className="w-4 h-4" />
          <span>PDF Kimutatás letöltése</span>
        </button>
      </div>

      {/* Diagramok 2 oszlopban */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* {t('catBreakdown')} kördiagram */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="border-b border-border pb-3 mb-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-primary" />
              Kiadások megoszlása kategóriák szerint
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Havi egyenérték arányában</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {mounted && pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    itemStyle={{ color: 'var(--foreground)' }}
                    labelStyle={{ color: 'var(--foreground)' }}

                    formatter={(value: any) => [formatMoney(Number(value), 'HUF'), 'Havi költség']}
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '0.75rem',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground">Nincs elegendő adat a diagramhoz</div>
            )}
          </div>

          {/* Kategória jelmagyarázat lista részletezve */}
          <div className="space-y-4 mt-4 pt-4 border-t border-border">
            {stats.categorySummaries.map((cat) => {
              const subsInCategory = activeSubs.filter(s => (s.category || 'Egyéb') === cat.category).sort((a, b) => getMonthlyEquivalentHuf(b) - getMonthlyEquivalentHuf(a));
              return (
                <div key={cat.category} className="text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-foreground font-semibold truncate">{cat.category}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 font-medium">
                      <span className="text-muted-foreground">{cat.percentage}%</span>
                      <span className="font-bold text-foreground">{formatMoney(cat.monthlyTotalHuf, 'HUF')} / {t('monthly')}</span>
                    </div>
                  </div>
                  <div className="pl-5 space-y-1">
                    {subsInCategory.map(sub => (
                      <div key={sub.id} className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground truncate">{sub.name}</span>
                        <span className="text-foreground font-medium shrink-0">{formatMoney(getMonthlyEquivalentHuf(sub), 'HUF')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legnagyobb havi tételek oszlopdiagram */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="border-b border-border pb-3 mb-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              Legnagyobb havi tételek összehasonlítása
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Top előfizetések költsége HUF-ban</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {mounted && topBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topBarData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--muted-foreground)" 
                    fontSize={11} 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)" 
                    fontSize={11} 
                    tickLine={false}
                    tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                  />
                  <Tooltip
                    itemStyle={{ color: 'var(--foreground)' }}
                    labelStyle={{ color: 'var(--foreground)' }}

                    formatter={(value: any) => [formatMoney(Number(value), 'HUF'), 'Havi egyenérték']}
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '0.75rem',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="amount" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground">Nincs elegendő adat a diagramhoz</div>
            )}
          </div>

          {/* Fizetési kártyák és módok szerinti összesítés */}
          <div className="space-y-2 mt-4 pt-4 border-t border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Fizetési módok és kártyák szerinti terhelés
            </span>
            {paymentMethodList.map((pm) => (
              <div key={pm.method} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate text-foreground">
                  <CreditCard className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{pm.method}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 font-medium">
                  <span className="text-muted-foreground">{pm.percentage}%</span>
                  <span className="font-bold text-foreground">{formatMoney(pm.total, 'HUF')}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      
      {/* Éves előrejelzés szolgáltatásonként */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm mt-6">
        <div className="border-b border-border pb-3 mb-4 flex justify-between items-end">
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              {t('yearlyBudgetTitle')}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{t('yearlyBudgetDesc')}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{t('totalYearlyCost')}</p>
            <p className="text-sm font-bold text-foreground">{formatMoney(stats.totalYearlyHuf, 'HUF')}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeSubs
            .map(sub => ({ ...sub, yearlyCost: getMonthlyEquivalentHuf(sub) * 12 }))
            .sort((a, b) => b.yearlyCost - a.yearlyCost)
            .map(sub => (
              <div key={sub.id} className="p-3 rounded-xl bg-secondary/50 border border-border flex justify-between items-center">
                <div className="truncate pr-3">
                  <p className="text-xs font-semibold text-foreground truncate">{sub.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">{sub.billingCycle}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-foreground">{formatMoney(sub.yearlyCost, 'HUF')}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">évente</p>
                </div>
              </div>
          ))}
        </div>
      </div>


      {/* {t('optimizationTips')} */}
      <div className="p-5 rounded-2xl bg-secondary/30 border border-border">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Költségoptimalizálási Javaslatok
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-card border border-border">
            <div className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
              Éves előfizetési kedvezmények
            </div>
            <p className="text-muted-foreground text-[11px]">
              Sok szolgáltató (pl. Disney+, Duolingo, VPN) 15-20% kedvezményt ad az éves díjfizetés esetén.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border">
            <div className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              Családi és csoportos csomagok
            </div>
            <p className="text-muted-foreground text-[11px]">
              A Spotify és YouTube Premium családi csomagjai fejenként akár 50-70%-kal olcsóbbak a szóló előfizetésnél.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border">
            <div className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
              Ritkán használt szolgáltatások
            </div>
            <p className="text-muted-foreground text-[11px]">
              Szüneteltesd a streaming fiókokat azokra a hónapokra, amikor nem nézel sorozatokat az adott platformon.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
