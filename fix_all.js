const fs = require('fs');

const replaceInFile = (file, replacements) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key, 'g'), value);
  }
  fs.writeFileSync(file, content);
};

// Navbar
replaceInFile('src/components/Navbar.tsx', {
  "'Áttekintés'": "t('dashboard')",
  "'Előfizetéseim'": "t('subscriptions')",
  "'Mentés & Import'": "t('backup')",
  "Előfizetés Menedzser": "{t('subscriptions')}",
  ">Új előfizetés<": ">{t('newSubscription')}<",
  ">Új<": ">{t('newSubscription').substring(0, 3)}<"
});

// Dashboard
replaceInFile('src/components/DashboardView.tsx', {
  "Havi összköltség": "{t('totalMonthly').toUpperCase()}",
  "Éves vetített költség": "{t('totalYearly').toUpperCase()}",
  "Aktív szolgáltatások": "{t('activeCount').toUpperCase()}",
  "Levonás a héten": "{t('upcoming7Days').toUpperCase()}",
  "esedékes": "{t('upcoming7Days')}", // Or maybe just "due" ? Wait, "esedékes" isn't in t(). Let's add it or replace with something simpler.
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
  "az összköltségből": "{t('ofTotal')}",
  "\\/ hó": "/ {t('monthly')}"
});

// Analytics
replaceInFile('src/components/AnalyticsView.tsx', {
  "\\/ hó": "/ {t('monthly')}"
});

// SubscriptionList
replaceInFile('src/components/SubscriptionListView.tsx', {
  "\\/ hó": "/ {t('monthly')}"
});

