const fs = require('fs');

const replaceInFile = (file, replacements) => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('useLanguage')) {
    content = content.replace(/from 'lucide-react';/, "from 'lucide-react';\nimport { useLanguage } from '@/lib/i18n';");
    
    // Add const { t } = useLanguage(); inside the component
    // Assuming the component starts with export const ... = ({ ... }) => {
    content = content.replace(/=> \{\n/, "=> {\n  const { t } = useLanguage();\n");
  }
  for (const [key, value] of Object.entries(replacements)) {
    // using regex string replace or simple replace based on if key is string or regex
    // key is string pattern
    content = content.replace(new RegExp(key, 'g'), value);
  }
  fs.writeFileSync(file, content);
};

// DashboardView replacements
replaceInFile('src/components/DashboardView.tsx', {
  "HAVI ÖSSZKÖLTSÉG": "{t('totalMonthly').toUpperCase()}",
  "ÉVES VETÍTETT KÖLTSÉG": "{t('totalYearly').toUpperCase()}",
  "AKTÍV SZOLGÁLTATÁSOK": "{t('activeCount').toUpperCase()}",
  "LEVONÁS A HÉTEN": "{t('upcoming7Days').toUpperCase()}",
  "\\/ nap átlagosan": "/ {t('dailyAvg')}",
  "12 havi aktuális állapot alapján": "{t('basedOn12Months')}",
  "Minden felvitt tétel aktív": "{t('allActive')}",
  "Következő 7 napban várható": "{t('expectedNext7Days')}",
  "Hamarosan esedékes levonások": "{t('upcomingPaymentsTitle')}",
  "Következő 7 nap eseményei naptári sorrendben": "{t('upcomingPaymentsSub')}",
  "Naptár nézet >": "{t('calendarView')} >",
  "A következő 7 napban nincs esedékes fizetendő tétel\\.*": "{t('noUpcoming')}",
  "Legnagyobb költségtényezők": "{t('topExpenses')}",
  "Havi egyenérték szerint csökkenő sorrendben": "{t('topExpensesSub')}",
  "Részletes elemzés >": "{t('detailedAnalytics')} >",
  "Jelentés készítése:": "{t('generateReport')}",
  "PDF Kimutatás letöltése": "{t('downloadPdf')}",
  "az összköltségből": "{t('ofTotal')}"
});

// SubscriptionListView replacements
replaceInFile('src/components/SubscriptionListView.tsx', {
  "Előfizetések Listája": "{t('subscriptionList')}",
  "Az összes aktív és archivált szolgáltatásod kezelése\\.*": "{t('subscriptionListDesc')}",
  "Új előfizetés felvitele": "{t('newSubscription')}",
  "Keresés név vagy kategória alapján\\.\\.\\.": "{t('searchPlaceholder')}",
  "Név \\(A-Z\\)": "{t('sortName')}",
  "Ár \\(csökkenő\\)": "{t('sortPriceDesc')}",
  "Ár \\(növekvő\\)": "{t('sortPriceAsc')}",
  "Következő fizetés": "{t('sortDate')}",
  "Nincs a keresésnek megfelelő előfizetés\\.*": "{t('emptySearch')}",
  "havonta": "{t('monthly')}",
  "évente": "{t('yearly')}",
  "negyedévente": "{t('quarterly')}",
  "hetente": "{t('weekly')}",
  "Aktív": "{t('activeSub')}",
  "Archivált": "{t('archivedSub')}",
  "Próbaidőszak": "{t('isTrial')}",
  "Szünetel": "{t('pausedSub')}",
  "Havi": "{t('monthly')}",
  "Éves": "{t('yearly')}",
  "Negyedéves": "{t('quarterly')}",
  "Heti": "{t('weekly')}",
  "Új előfizetés": "{t('newSubscription')}",
  "Összes": "{t('filterAll')}"
});

// AnalyticsView replacements
replaceInFile('src/components/AnalyticsView.tsx', {
  "Pénzügyi Statisztikák": "{t('analyticsTitle')}",
  "Részletes kimutatások és vizualizációk a költéseidről\\.*": "{t('analyticsDesc')}",
  "Kategóriák szerinti megoszlás": "{t('catBreakdown')}",
  "Mire költesz a legtöbbet havonta\\?": "{t('catBreakdownDesc')}",
  "Fizetési Módok": "{t('paymentMethodsTitle')}",
  "Honnan várható a legtöbb levonás\\?": "{t('paymentMethodsDesc')}",
  "Éves Költségvetés Szolgáltatásonként": "{t('yearlyBudgetTitle')}",
  "Mennyibe kerülnek az egyes előfizetések 1 év alatt\\?": "{t('yearlyBudgetDesc')}",
  "Összesített Éves Költség": "{t('totalYearlyCost')}",
  "\\/ hó": "/ {t('monthly')}",
  "Optimalizációs és Költségcsökkentési Ötletek": "{t('optimizationTips')}",
  "Néhány tipp a felesleges kiadások csökkentésére\\.*": "{t('optDesc')}",
  "Éves előfizetés választása:": "{t('opt1')}",
  "Sok szolgáltatás \\(pl\\. VPN, tárhely\\) 20-30% kedvezményt ad éves fizetés esetén\\.*": "{t('opt1Desc')}",
  "Családi csomagok:": "{t('opt2')}",
  "Ha többen használtok Spotify-t vagy YouTube Premiumot a családban, váltsatok közös csomagra!": "{t('opt2Desc')}",
  "Inaktív szolgáltatások:": "{t('opt3')}",
  "Rendszeresen nézd át a listát, és archiváld/mondd le azokat, amiket már több mint 2 hónapja nem használtál\\.*": "{t('opt3Desc')}",
  "Próbaidőszakok követése:": "{t('opt4')}",
  "Állíts be emlékeztetőt a naptáradban a próbaidőszakok lejárata előtt 1 nappal\\.*": "{t('opt4Desc')}"
});

// BackupView replacements
replaceInFile('src/components/BackupView.tsx', {
  "Biztonsági Mentés és Visszaállítás": "{t('backup')}",
  "Készíts biztonsági mentést az adataidról JSON formátumban, vagy állítsd vissza őket egy korábbi mentésből\\.*": "{t('backupDesc')}",
  "Mentés letöltése \\(JSON\\)": "{t('downloadBackup')}",
  "Mentés visszaállítása \\(JSON\\)": "{t('importBackup')}",
  "Sikeres importálás": "{t('successImport')}",
  "Hiba az importálás során": "{t('errorImport')}"
});

// CalendarView replacements
replaceInFile('src/components/CalendarView.tsx', {
  "Fizetési Naptár": "{t('calendarTitle')}",
  "A havi fizetendő tételek és próbaidőszakok áttekintése\\.*": "{t('calendarDesc')}",
  "Napi részletek": "{t('dailyDetails')}",
  "Nincs esedékes fizetés ezen a napon\\.*": "{t('noEventsToday')}",
  "Várható levonás:": "{t('expectedDeduction')}:",
  "Új felvitele": "{t('newSubscription')}"
});

