const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

// Import useLanguage
if (!content.includes('useLanguage')) {
  content = content.replace("from 'lucide-react';", "from 'lucide-react';\nimport { useLanguage } from '@/lib/i18n';");
  
  // Add const { t } = useLanguage();
  content = content.replace("const dailyAverageHuf", "const { t } = useLanguage();\n  const dailyAverageHuf");
}

// Replacements
content = content.replace(/>HAVI ÖSSZKÖLTSÉG</, ">{t('totalMonthly').toUpperCase()}<");
content = content.replace(/>ÉVES VETÍTETT KÖLTSÉG</, ">{t('totalYearly').toUpperCase()}<");
content = content.replace(/>AKTÍV SZOLGÁLTATÁSOK</, ">{t('activeCount').toUpperCase()}<");
content = content.replace(/>LEVONÁS A HÉTEN</, ">{t('upcoming7Days').toUpperCase()}<");

content = content.replace(/~\{formatMoney\(dailyAverageHuf, 'HUF'\)\} \/ nap átlagosan/, "~{formatMoney(dailyAverageHuf, 'HUF')} / {t('monthlyEquiv')} (avg)"); 
content = content.replace(/12 havi aktuális állapot alapján/, "Based on 12 months current state"); 
content = content.replace(/Minden felvitt tétel aktív/, "All tracked items active"); 
content = content.replace(/Következő 7 napban várható/, "Expected in next 7 days"); 
content = content.replace(/Hamarosan esedékes levonások/, "{t('upcoming7Days')}");
content = content.replace(/Következő 7 nap eseményei naptári sorrendben/, "Next 7 days events in order");
content = content.replace(/Naptár nézet >/, "{t('calendar')} >");
content = content.replace(/A következő 7 napban nincs esedékes fizetendő tétel\./, "{t('noUpcoming')}");

content = content.replace(/Legnagyobb költségtényezők/, "Top Expenses");
content = content.replace(/Havi egyenérték szerint csökkenő sorrendben/, "Sorted by monthly equivalent");
content = content.replace(/Részletes elemzés >/, "Detailed analytics >");
content = content.replace(/Jelentés készítése:/, "Generate report:");
content = content.replace(/PDF Kimutatás letöltése/, "{t('downloadPdf')}");
content = content.replace(/az összköltségből/, "of total");

// Fix remaining stat hardcodes by using translation keys if possible or just EN/HU check if needed.
// Actually, it's better to update i18n to have these keys.
fs.writeFileSync('src/components/DashboardView.tsx', content);

