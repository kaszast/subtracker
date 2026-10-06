'use client';

import React, { useState, useEffect } from 'react';
import { PriceHistory } from '@/types';
import { Subscription, PresetSubscription, BillingCycle, Currency, Category } from '@/types';
import { PRESET_SUBSCRIPTIONS, ALL_CATEGORIES } from '@/lib/presets';
import { ServiceIcon } from './ServiceIcon';
import { formatMoney } from '@/lib/calculator';
import { 
  X, 
  Search, 
  Sparkles, 
  Sliders, 
  Calendar, 
  CreditCard, 
  ExternalLink,
  Check,
  TrendingUp
} from 'lucide-react';
import { useLanguage, getTranslatedCategory } from '@/lib/i18n';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subData: Partial<Subscription>) => Promise<void>;
  initialSubscription?: Subscription | null;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSubscription
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [presetSearch, setPresetSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Űrlap állapot
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [currency, setCurrency] = useState<Currency>('HUF');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [nextBillingDate, setNextBillingDate] = useState('');
  const [category, setCategory] = useState<Category>('Streaming & Média');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isTrial, setIsTrial] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState<PriceHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [icon, setIcon] = useState('CreditCard');
  const [color, setColor] = useState('#3B82F6');
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('');

  // Szerkesztés esetén betöltjük a meglévő adatokat
  useEffect(() => {
    if (initialSubscription) {
      setId(initialSubscription.id);
      setName(initialSubscription.name);
      setAmount(initialSubscription.amount);
      setCurrency(initialSubscription.currency);
      setBillingCycle(initialSubscription.billingCycle);
      setNextBillingDate(initialSubscription.nextBillingDate);
      setCategory(initialSubscription.category);
      setPaymentMethod(initialSubscription.paymentMethod || '');
      setIsActive(initialSubscription.isActive);
      setIsTrial(initialSubscription.isTrial);
      setTrialEndDate(initialSubscription.trialEndDate || '');
      setNotes(initialSubscription.notes || '');
      setIcon(initialSubscription.icon || 'CreditCard');
      setColor(initialSubscription.color || '#3B82F6');
      setUrl(initialSubscription.url || '');
      setDomain(initialSubscription.domain || '');
      setActiveTab('custom');
    } else {
      // Új felvitel alaphelyzet
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const defaultDate = nextMonth.toISOString().split('T')[0];

      setId(`sub-${Date.now()}`);
      setName('');
      setAmount('');
      setCurrency('HUF');
      setBillingCycle('monthly');
      setNextBillingDate(defaultDate);
      setCategory('Streaming & Média');
      setPaymentMethod('');
      setIsActive(true);
      setIsTrial(false);
      setTrialEndDate('');
      setNotes('');
      setIcon('CreditCard');
      setColor('#3B82F6');
      setUrl('');
      setDomain('');
      setActiveTab('presets');
    }
  }, [initialSubscription, isOpen]);

  if (!isOpen) return null;

  // Preset kiválasztása
  const handleSelectPreset = (preset: PresetSubscription) => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const defaultDate = nextMonth.toISOString().split('T')[0];

    setName(preset.name);
    setAmount(preset.defaultAmount);
    setCurrency(preset.defaultCurrency);
    setBillingCycle(preset.defaultCycle);
    setCategory(preset.category);
    setIcon(preset.icon);
    setColor(preset.color);
    setUrl(preset.url || '');
    setDomain(preset.domain || '');
    setNextBillingDate(defaultDate);
    setActiveTab('custom');
  };

  // Beküldés
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || amount === '' || !nextBillingDate) return;

    try {
      setIsSubmitting(true);
      await onSave({
        id: id || `sub-${Date.now()}`,
        name: name.trim(),
        amount: Number(amount),
        currency,
        billingCycle,
        nextBillingDate,
        category,
        paymentMethod: paymentMethod.trim() || undefined,
        isActive,
        isTrial,
        trialEndDate: isTrial ? trialEndDate : undefined,
        notes: notes.trim() || undefined,
        icon,
        color,
        url: url.trim() || undefined
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preset szűrés
  const filteredPresets = PRESET_SUBSCRIPTIONS.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
                          preset.description?.toLowerCase().includes(presetSearch.toLowerCase());
    const matchesCat = selectedCategory === 'all' || preset.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Fejléc */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {initialSubscription ? t('editSubscription') : t('addSubscription')}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {initialSubscription ? t('editSubscriptionDesc') : t('addSubscriptionDesc')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fülek (csak új felvitel esetén releváns a preset) */}
        {!initialSubscription && (
          <div className="flex border-b border-border bg-secondary/30 px-6 pt-2 gap-2">
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'presets'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {t('fromCatalog')} ({PRESET_SUBSCRIPTIONS.length}+)
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'custom'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sliders className="w-4 h-4" />
              {t('customEntry')}
            </button>
          </div>
        )}

        {/* Tartalom */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'presets' ? (
            <div className="space-y-4">
              {/* Kereső és kategória szűrő */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    value={presetSearch}
                    onChange={(e) => setPresetSearch(e.target.value)}
                    placeholder="Keresés (e.g. Netflix, Spotify, Gemini, ChatGPT...)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
                >
                  <option value="all">Minden kategória</option>
                  {ALL_CATEGORIES.map(cat => (
                    <option key={getTranslatedCategory(t, cat)} value={getTranslatedCategory(t, cat)}>{getTranslatedCategory(t, cat)}</option>
                  ))}
                </select>
              </div>

              {/* Preset Rács */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {filteredPresets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className="group flex items-start gap-3 p-3.5 rounded-xl border border-border hover:border-primary/50 bg-secondary/30 hover:bg-secondary/70 cursor-pointer transition-all"
                  >
                    <ServiceIcon name={preset.icon} domain={preset.domain} color={preset.color} className="w-10 h-10 shrink-0 p-2" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground truncate">
                          {preset.name}
                        </span>
                        <span className="text-xs font-semibold text-primary ml-1 shrink-0">
                          {formatMoney(preset.defaultAmount, preset.defaultCurrency)}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                        {preset.category}
                      </div>
                      {preset.description && (
                        <p className="text-[10px] text-muted-foreground/80 mt-1 line-clamp-1">
                          {preset.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Kézi űrlap */
            <form onSubmit={handleSubmit} id="sub-form" className="space-y-4">
              
              {/* Név & Összeg & Deviza */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-foreground mb-1">
                    {t('serviceName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Netflix"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    {t('amount')} *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="e.g. 3490"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    {t('currency')}
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
                  >
                    <option value="HUF">HUF (Ft)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              {/* Ciklus & Következő levonás & {t('category')} */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    {t('billingCycle')}
                  </label>
                  <select
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
                  >
                    <option value="monthly">{t('monthly')}</option>
                    <option value="yearly">{t('yearly')}</option>
                    <option value="quarterly">{t('quarterly')}</option>
                    <option value="weekly">{t('weekly')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    {t('nextBillingDate')} *
                  </label>
                  <input
                    type="date"
                    required
                    value={nextBillingDate}
                    onChange={(e) => setNextBillingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    {t('category')}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
                  >
                    {ALL_CATEGORIES.map(cat => (
                      <option key={getTranslatedCategory(t, cat)} value={getTranslatedCategory(t, cat)}>{getTranslatedCategory(t, cat)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fizetési mód & Weboldal URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    {t('paymentMethodOpt')}
                  </label>
                  <input
                    type="text"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    placeholder="e.g. Revolut Virtual, PayPal"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    {t('websiteOpt')}
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              {/* Próbaidőszak & Aktív státusz kapcsolók */}
              <div className="p-3.5 rounded-xl border border-border bg-secondary/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-foreground block">
                      {t('activeSubscription')}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {t('inactiveDesc')}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-foreground block">
                      {t('freeTrial')}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {t('trialDesc')}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isTrial}
                    onChange={(e) => setIsTrial(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

                {isTrial && (
                  <div className="pt-2">
                    <label className="block text-xs font-medium text-amber-500 mb-1">
                      Próbaidőszak lejárata
                    </label>
                    <input
                      type="date"
                      value={trialEndDate}
                      onChange={(e) => setTrialEndDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-500/40 bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                    />
                  </div>
                )}
              </div>

              {/* Jegyzetek */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  {t('notesOpt')}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Family plan..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
                />
              </div>

                                        {/* Ártörténet */}
              {initialSubscription && (
                <div className="pt-4 border-t border-border mt-4">
                  <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {t('priceHistory')}
                  </h4>
                  {loadingHistory ? (
                    <div className="text-[11px] text-muted-foreground">Betöltés...</div>
                  ) : history.length > 0 ? (
                    <div className="space-y-2">
                      {history.map((h, i) => (
                        <div key={h.id} className="flex justify-between items-center text-[11px] p-2 bg-background rounded-lg border border-border">
                          <span className="text-muted-foreground">
                            {new Date(h.changedAt).toLocaleDateString('hu-HU')}
                          </span>
                          <span className={`font-semibold ${i === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {h.amount} {h.currency}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-muted-foreground bg-background p-2 rounded-lg border border-border text-center">
                      {t('noHistory')}
                    </div>
                  )}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Lábléc gombok */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {t('cancel')}
          </button>

          {activeTab === 'custom' && (
            <button
              type="submit"
              form="sub-form"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-accent text-primary-foreground text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {isSubmitting ? 'Mentés...' : initialSubscription ? t('saveChanges') : t('saveSubscription')}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
