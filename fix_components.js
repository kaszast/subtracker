const fs = require('fs');

// AnalyticsView.tsx
let analytics = fs.readFileSync('src/components/AnalyticsView.tsx', 'utf8');
analytics = analytics.replace(/'Havi költség'/g, "t('monthlyCost')");
analytics = analytics.replace(/'Havi egyenérték'/g, "t('monthlyEquiv')");
analytics = analytics.replace(/<span>PDF Kimutatás letöltése<\/span>/g, "<span>{t('downloadPdf')}</span>");
analytics = analytics.replace(/name: c.category/g, "name: getTranslatedCategory(t, c.category)");
analytics = analytics.replace(/cat\.category/g, "getTranslatedCategory(t, cat.category)");
fs.writeFileSync('src/components/AnalyticsView.tsx', analytics);

// SubscriptionListView.tsx
let list = fs.readFileSync('src/components/SubscriptionListView.tsx', 'utf8');
list = list.replace(/Havi egyenérték/g, "{t('monthlyEquiv')}");
fs.writeFileSync('src/components/SubscriptionListView.tsx', list);

// DashboardView.tsx
let dashboard = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');
dashboard = dashboard.replace(/<span>Naptár nézet<\/span>/g, "<span>{t('calendarView')}</span>");
fs.writeFileSync('src/components/DashboardView.tsx', dashboard);

// BackupView.tsx
let backup = fs.readFileSync('src/components/BackupView.tsx', 'utf8');
backup = backup.replace(/Beolvasás módja/gi, "{t('readMode')}");
backup = backup.replace(/<strong>Teljes felülírás<\/strong>/g, "<strong>{t('backupOverwrite')}</strong>");
backup = backup.replace(/\(Jelenlegi adatok törlése\)/g, "{t('backupOverwriteDesc')}");
backup = backup.replace(/<strong>Összefésülés<\/strong>/g, "<strong>{t('backupMerge')}</strong>");
backup = backup.replace(/\(Meglévők megtartása és bővítése\)/g, "{t('backupMergeDesc')}");
backup = backup.replace(/Figyelem: A teljes felülírás törli az összes jelenlegi előfizetésedet, és a fájl tartalmát tölti be helyettük\. Biztosan folytatod\?/g, "${t('backupConfirm')}");
fs.writeFileSync('src/components/BackupView.tsx', backup);

// page.tsx
let page = fs.readFileSync('src/app/page.tsx', 'utf8');
if (!page.includes('useLanguage')) {
  page = page.replace(/from 'react';/, "from 'react';\nimport { useLanguage } from '@/lib/i18n';");
}
if (!page.includes('const { t } = useLanguage();')) {
  page = page.replace(/export default function SubTrackerApp\(\) \{/, "export default function SubTrackerApp() {\n  const { t } = useLanguage();");
}
page = page.replace(/<span>SubTracker &bull; Teljesen privát, Dockerben futó előfizetés kezelő<\/span>/g, "<span dangerouslySetInnerHTML={{ __html: t('footerSubtracker') }} />");
page = page.replace(/<span>SQLite helyi adatbázis &bull; 10 beépített stílustéma<\/span>/g, "<span dangerouslySetInnerHTML={{ __html: t('footerSqlite') }} />");
fs.writeFileSync('src/app/page.tsx', page);

// layout.tsx
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
layout = layout.replace(/Kezeld az összes előfizetésedet egy helyen: havi költségek, naptár nézet, statisztikák, PDF riport és adatmentés\./g, "Manage all your subscriptions in one place: monthly costs, calendar view, statistics, PDF report, and backup.");
fs.writeFileSync('src/app/layout.tsx', layout);

