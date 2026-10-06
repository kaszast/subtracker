'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'hu' | 'en';

const translations = {
  hu: {
    dashboard: 'Irányítópult',
    subscriptions: 'Előfizetések',
    calendar: 'Naptár',
    analytics: 'Statisztikák',
    backup: 'Adatmentés',
    newSubscription: 'Új előfizetés',
    loading: 'Adatok betöltése folyamatban...',
    errorLoading: 'Hiba az adatok betöltésekor',
    retry: 'Újrapróbálkozás',
    activeSub: 'Aktív',
    archivedSub: 'Archivált',
    pausedSub: 'Szünetel',
    monthlyEquiv: 'Havi egyenérték',
    nextBilling: 'Következő levonás',
    totalMonthly: 'Havi összesen',
    totalYearly: 'Éves becsült',
    activeCount: 'Aktív előfizetések',
    upcoming7Days: 'Következő 7 napban',
    downloadPdf: 'PDF Riport Letöltése',
    upcomingPayments: 'Közelgő fizetések (következő 30 nap)',
    noUpcoming: 'Nincs közelgő fizetés a következő 30 napban.',
    categoryDist: 'Kategória eloszlás (HUF)',
    settings: 'Beállítások',
    theme: 'Téma',
    language: 'Nyelv',
    save: 'Mentés',
    cancel: 'Mégse',
    delete: 'Törlés',
    edit: 'Szerkesztés',
    archive: 'Archiválás',
    unarchive: 'Visszaállítás',
    confirmDelete: 'Biztosan törölni szeretnéd?',
    confirmArchive: 'Biztosan archiválod/visszaállítod ezt az előfizetést?',
    name: 'Szolgáltatás neve',
    amount: 'Összeg',
    currency: 'Valuta',
    billingCycle: 'Ciklus',
    monthly: 'Havi',
    yearly: 'Éves',
    quarterly: 'Negyedéves',
    weekly: 'Heti',
    category: 'Kategória',
    paymentMethod: 'Fizetési mód',
    notes: 'Megjegyzés',
    url: 'Weboldal',
    isActive: 'Aktív előfizetés',
    isTrial: 'Próbaidőszak',
    trialEnd: 'Próbaidőszak lejárata',
    priceHistory: 'Ártörténet és Infláció',
    noHistory: 'Nincs rögzített árváltozás.',
    custom: 'Egyedi felvitel',
    catalog: 'Katalógusból',
    searchCatalog: 'Keresés a katalógusban...',
    noResult: 'Nincs találat',
    import: 'Importálás',
    export: 'Exportálás',
    backupDesc: 'Készíts biztonsági mentést az adataidról JSON formátumban, vagy állítsd vissza őket egy korábbi mentésből.',
    downloadBackup: 'Mentés letöltése (JSON)',
    importBackup: 'Mentés visszaállítása (JSON)',
    successImport: 'Sikeres importálás',
    errorImport: 'Hiba az importálás során',
    emptyList: 'Nincs megjeleníthető előfizetés.'
  },
  en: {
    dashboard: 'Dashboard',
    subscriptions: 'Subscriptions',
    calendar: 'Calendar',
    analytics: 'Analytics',
    backup: 'Backup',
    newSubscription: 'New Subscription',
    loading: 'Loading data...',
    errorLoading: 'Error loading data',
    retry: 'Retry',
    activeSub: 'Active',
    archivedSub: 'Archived',
    pausedSub: 'Paused',
    monthlyEquiv: 'Monthly equiv.',
    nextBilling: 'Next billing',
    totalMonthly: 'Total Monthly',
    totalYearly: 'Yearly Estimate',
    activeCount: 'Active Subscriptions',
    upcoming7Days: 'Upcoming in 7 days',
    downloadPdf: 'Download PDF Report',
    upcomingPayments: 'Upcoming payments (next 30 days)',
    noUpcoming: 'No upcoming payments in the next 30 days.',
    categoryDist: 'Category Distribution (HUF)',
    settings: 'Settings',
    theme: 'Theme',
    language: 'Language',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    archive: 'Archive',
    unarchive: 'Unarchive',
    confirmDelete: 'Are you sure you want to delete this?',
    confirmArchive: 'Are you sure you want to archive/unarchive this subscription?',
    name: 'Service name',
    amount: 'Amount',
    currency: 'Currency',
    billingCycle: 'Cycle',
    monthly: 'Monthly',
    yearly: 'Yearly',
    quarterly: 'Quarterly',
    weekly: 'Weekly',
    category: 'Category',
    paymentMethod: 'Payment method',
    notes: 'Notes',
    url: 'Website',
    isActive: 'Active subscription',
    isTrial: 'Free Trial',
    trialEnd: 'Trial end date',
    priceHistory: 'Price History & Inflation',
    noHistory: 'No recorded price changes.',
    custom: 'Custom Entry',
    catalog: 'From Catalog',
    searchCatalog: 'Search catalog...',
    noResult: 'No results found',
    import: 'Import',
    export: 'Export',
    backupDesc: 'Backup your data in JSON format or restore from a previous backup.',
    downloadBackup: 'Download Backup (JSON)',
    importBackup: 'Restore Backup (JSON)',
    successImport: 'Successfully imported',
    errorImport: 'Error importing',
    emptyList: 'No subscriptions to display.'
  }
};

type TranslationKey = keyof typeof translations.hu;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'hu',
  setLang: () => {},
  t: (key) => translations.hu[key] || key
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('hu');

  useEffect(() => {
    const saved = localStorage.getItem('subtracker_lang') as Language;
    if (saved && (saved === 'hu' || saved === 'en')) {
      setLang(saved);
    }
  }, []);

  const changeLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('subtracker_lang', newLang);
  };

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
