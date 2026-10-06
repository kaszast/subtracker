const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

code = code.replace(/Aktív próbaidőszak figyelmeztetés \(\{trialSubs\.length\} db\)/g, "{t('trialWarning')} ({trialSubs.length})");
code = code.replace(/Ne felejtsd el időben lemondani, ha nem szeretnéd, hogy automatikusan megújuljon: /g, "{t('trialWarningDesc')} ");
code = code.replace(/>\s*Kezelés\s*<\/button>/g, ">{t('manage')}</button>");
code = code.replace(/>\s*Based on 12 months current state\s*<\/div>/g, ">{t('basedOn12Months')}</div>");
code = code.replace(/>\s*'All tracked items active'\s*<\/div>/g, ">{t('allActive')}</div>");
code = code.replace(/>\s*Expected in next 7 days\s*<\/div>/g, ">{t('expectedNext7Days')}</div>");
code = code.replace(/>\s*Next 7 days events in order\s*<\/p>/g, ">{t('upcomingPaymentsSub')}</p>");
code = code.replace(/>\s*Top Expenses\s*<\/h3>/g, ">{t('topExpenses')}</h3>");
code = code.replace(/>\s*Sorted by monthly equivalent\s*<\/p>/g, ">{t('topExpensesSub')}</p>");
code = code.replace(/>\s*Generate report:\s*<\/span>/g, ">{t('generateReport')}</span>");
code = code.replace(/&bull; \{percentOfTotal\}% of total/g, "&bull; {percentOfTotal}% {t('ofTotal')}");
code = code.replace(/>\s*Naptár nézet\s*</g, ">{t('calendarView')}<");
code = code.replace(/>\s*Részletes elemzés\s*</g, ">{t('detailedAnalytics')}<");
code = code.replace(/>\s*Próba\s*<\/span>/g, ">{t('isTrial')}</span>");
code = code.replace(/Ma \$\{t\('upcoming7Days'\)\}!/g, "Ma!");
code = code.replace(/\$\{daysLeft\} nap múlva/g, "${daysLeft} ${t('inDays')}");
code = code.replace(/'Kártyás fizetés'/g, "t('cardPayment')");

fs.writeFileSync('src/components/DashboardView.tsx', code);
