const fs = require('fs');

let i18n = fs.readFileSync('src/lib/i18n.tsx', 'utf8');

const huNew = `
    footerSubtracker: 'SubTracker &bull; Teljesen privát, Dockerben futó előfizetés kezelő',
    footerSqlite: 'SQLite helyi adatbázis &bull; 10 beépített stílustéma',
    monthlyCost: 'Havi költség',
    pdfTitle: 'ELŐFIZETÉSI KIMUTATÁS ÉS PÉNZÜGYI JELENTÉS',
    pdfGeneratedAt: 'Készült: {date} | Valuta: HUF bázis',
    pdfTotalMonthly: 'Havi összköltség',
    pdfTotalYearly: 'Éves összköltség',
    pdfActive: 'Aktív szolgáltatás',
    pdfUpcoming: 'Közelgő (7 nap)',
    pdfExpensesByCategory: 'Kiadások kategóriák szerint',
    pdfCategory: 'Kategória',
    pdfSubscriptions: 'Előfizetések',
    pdfMonthlyAmount: 'Havi összeg',
    pdfShare: 'Részarány',
    pdfDetailedList: 'Részletes előfizetési lista',
    pdfService: 'Szolgáltatás',
    pdfAmount: 'Összeg',
    pdfCycle: 'Ciklus',
    pdfMonthlyHuf: 'Havi HUF',
    pdfNextBilling: 'Következő levonás',
    pdfPaymentMethod: 'Fizetési mód',
    pdfStatus: 'Státusz',
    pdfTrialSuffix: ' (Próba)',
    pdfActiveStatus: 'Aktív',
    pdfInactiveStatus: 'Inaktív',
    pdfPage: 'Oldal {current} / {total} | Subscription Manager',
    backupOverwrite: 'Teljes felülírás',
    backupOverwriteDesc: '(Jelenlegi adatok törlése)',
    backupMerge: 'Összefésülés',
    backupMergeDesc: '(Meglévők megtartása és bővítése)',
    backupConfirm: 'Figyelem: A teljes felülírás törli az összes jelenlegi előfizetésedet, és a fájl tartalmát tölti be helyettük. Biztosan folytatod?',
  },
  en:`;

const enNew = `
    footerSubtracker: 'SubTracker &bull; Fully private, Docker-hosted subscription manager',
    footerSqlite: 'SQLite local database &bull; 10 built-in style themes',
    monthlyCost: 'Monthly cost',
    pdfTitle: 'SUBSCRIPTION AND FINANCIAL REPORT',
    pdfGeneratedAt: 'Generated: {date} | Base currency: HUF',
    pdfTotalMonthly: 'Total Monthly Cost',
    pdfTotalYearly: 'Total Yearly Cost',
    pdfActive: 'Active Services',
    pdfUpcoming: 'Upcoming (7 days)',
    pdfExpensesByCategory: 'Expenses by Category',
    pdfCategory: 'Category',
    pdfSubscriptions: 'Subscriptions',
    pdfMonthlyAmount: 'Monthly Amount',
    pdfShare: 'Share',
    pdfDetailedList: 'Detailed Subscription List',
    pdfService: 'Service',
    pdfAmount: 'Amount',
    pdfCycle: 'Cycle',
    pdfMonthlyHuf: 'Monthly HUF',
    pdfNextBilling: 'Next Billing',
    pdfPaymentMethod: 'Payment Method',
    pdfStatus: 'Status',
    pdfTrialSuffix: ' (Trial)',
    pdfActiveStatus: 'Active',
    pdfInactiveStatus: 'Inactive',
    pdfPage: 'Page {current} / {total} | Subscription Manager',
    backupOverwrite: 'Full Overwrite',
    backupOverwriteDesc: '(Delete current data)',
    backupMerge: 'Merge',
    backupMergeDesc: '(Keep existing and append)',
    backupConfirm: 'Warning: Full overwrite will delete all current subscriptions and load the file contents instead. Are you sure?',
  }
};`;

i18n = i18n.replace('  },\n  en: {', huNew + ' {');
i18n = i18n.replace('  }\n};', enNew);

fs.writeFileSync('src/lib/i18n.tsx', i18n);
