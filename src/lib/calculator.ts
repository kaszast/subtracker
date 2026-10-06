import { Subscription, MonthlyStats, CategorySummary, Category, ExchangeRates } from '@/types';
import { CATEGORY_COLORS, ALL_CATEGORIES } from './presets';

export const DEFAULT_RATES: ExchangeRates = {
  HUF: 1,
  EUR: 405,
  USD: 375,
  GBP: 480
};

export function convertToHuf(amount: number, currency: string, rates: ExchangeRates = DEFAULT_RATES): number {
  const rate = rates[currency as keyof ExchangeRates] || 1;
  return amount * rate;
}

export function getMonthlyEquivalentHuf(sub: Subscription, rates: ExchangeRates = DEFAULT_RATES): number {
  if (!sub.isActive) return 0;
  
  const hufAmount = convertToHuf(sub.amount, sub.currency, rates);
  
  switch (sub.billingCycle) {
    case 'monthly':
      return hufAmount;
    case 'yearly':
      return hufAmount / 12;
    case 'quarterly':
      return hufAmount / 3;
    case 'weekly':
      return (hufAmount * 52) / 12;
    default:
      return hufAmount;
  }
}

export function formatMoney(amount: number, currency: string = 'HUF'): string {
  const rounded = Math.round(amount * 100) / 100;
  
  if (currency === 'HUF') {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: 'HUF',
      maximumFractionDigits: 0
    }).format(rounded);
  }
  
  if (currency === 'EUR') {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(rounded);
  }
  
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(rounded);
  }

  if (currency === 'GBP') {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(rounded);
  }

  return `${rounded} ${currency}`;
}

export function calculateMonthlyStats(subscriptions: Subscription[], rates: ExchangeRates = DEFAULT_RATES): MonthlyStats {
  const activeSubs = subscriptions.filter(s => s.isActive);
  
  let totalMonthlyHuf = 0;
  const categoryTotals: Record<string, { total: number; count: number }> = {};

  for (const cat of ALL_CATEGORIES) {
    categoryTotals[cat] = { total: 0, count: 0 };
  }

  for (const sub of activeSubs) {
    const monthlyHuf = getMonthlyEquivalentHuf(sub, rates);
    totalMonthlyHuf += monthlyHuf;
    
    const cat = sub.category || 'Egyéb';
    if (!categoryTotals[cat]) {
      categoryTotals[cat] = { total: 0, count: 0 };
    }
    categoryTotals[cat].total += monthlyHuf;
    categoryTotals[cat].count += 1;
  }

  const categorySummaries: CategorySummary[] = Object.entries(categoryTotals)
    .filter(([_, data]) => data.count > 0 || data.total > 0)
    .map(([cat, data]) => ({
      category: cat as Category,
      monthlyTotalHuf: Math.round(data.total),
      count: data.count,
      percentage: totalMonthlyHuf > 0 ? Math.round((data.total / totalMonthlyHuf) * 100) : 0,
      color: CATEGORY_COLORS[cat] || '#6B7280'
    }))
    .sort((a, b) => b.monthlyTotalHuf - a.monthlyTotalHuf);

  // Következő 7 napban esedékes előfizetések
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const in7Days = new Date(today);
  in7Days.setDate(in7Days.getDate() + 7);

  const upcomingSubscriptions = subscriptions
    .filter(sub => {
      if (!sub.isActive) return false;
      const d = new Date(sub.nextBillingDate);
      return d >= today && d <= in7Days;
    })
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());

  return {
    totalMonthlyHuf: Math.round(totalMonthlyHuf),
    totalYearlyHuf: Math.round(totalMonthlyHuf * 12),
    activeCount: activeSubs.length,
    trialCount: subscriptions.filter(s => s.isTrial).length,
    upcomingCount7Days: upcomingSubscriptions.length,
    categorySummaries,
    upcomingSubscriptions
  };
}
