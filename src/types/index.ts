export type BillingCycle = 'monthly' | 'yearly' | 'quarterly' | 'weekly';

export type Currency = 'HUF' | 'EUR' | 'USD' | 'GBP';

export type Category = 
  | 'Streaming & Média'
  | 'AI & Produktivitás'
  | 'Fejlesztés & Felhő'
  | 'Szoftver & Eszközök'
  | 'Zene & Podcast'
  | 'Játék'
  | 'Hírek & Oktatás'
  | 'Fitnesz & Életmód'
  | 'Közmű & Pénzügy'
  | 'Egyéb';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  billingCycle: BillingCycle;
  nextBillingDate: string; // ISO YYYY-MM-DD
  category: Category;
  paymentMethod?: string;
  isActive: boolean;
  isTrial: boolean;
  trialEndDate?: string;
  notes?: string;
  icon?: string;
  color?: string;
  url?: string;
  domain?: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface PresetSubscription {
  id: string;
  name: string;
  defaultAmount: number;
  defaultCurrency: Currency;
  defaultCycle: BillingCycle;
  category: Category;
  icon: string;
  color: string;
  url?: string;
  domain?: string;
  description?: string;
}

export interface PriceHistory {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: Currency;
  changedAt: string; // ISO YYYY-MM-DDTHH:mm:ss.sssZ
}

export type ThemeId = 
  | 'obsidian'
  | 'porcelain'
  | 'nord'
  | 'tokyo'
  | 'catppuccin'
  | 'forest'
  | 'monochrome'
  | 'solarized'
  | 'sand'
  | 'indigo';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  description: string;
  isDark: boolean;
  primaryColor: string;
  bgColor: string;
  accentColor: string;
}

export interface ExchangeRates {
  HUF: number;
  EUR: number;
  USD: number;
  GBP: number;
}

export interface CategorySummary {
  category: Category;
  monthlyTotalHuf: number;
  count: number;
  percentage: number;
  color: string;
}

export interface MonthlyStats {
  totalMonthlyHuf: number;
  totalYearlyHuf: number;
  activeCount: number;
  trialCount: number;
  upcomingCount7Days: number;
  categorySummaries: CategorySummary[];
  upcomingSubscriptions: Subscription[];
}
