const fs = require('fs');

// src/lib/pdf.ts
let pdf = fs.readFileSync('src/lib/pdf.ts', 'utf8');
pdf = pdf.replace("import { formatMoney, getMonthlyEquivalentHuf } from './calculator';", "import { formatMoney, getMonthlyEquivalentHuf } from './calculator';\nimport { getTranslatedCategory } from '@/lib/i18n';");
pdf = pdf.replace("export function generatePdfReport(subscriptions: Subscription[], stats: MonthlyStats): void {", "export function generatePdfReport(subscriptions: Subscription[], stats: MonthlyStats, t: any): void {");

// Replacing strings inside pdf.ts
pdf = pdf.replace("'ELŐFIZETÉSI KIMUTATÁS ÉS PÉNZÜGYI JELENTÉS'", "t('pdfTitle')");
pdf = pdf.replace(/`Készült: \$\{todayStr\} \| Valuta: HUF bázis`/g, "t('pdfGeneratedAt').replace('{date}', todayStr)");
pdf = pdf.replace("'Havi összköltség'", "t('pdfTotalMonthly')");
pdf = pdf.replace("'Éves összköltség'", "t('pdfTotalYearly')");
pdf = pdf.replace("'Aktív szolgáltatás'", "t('pdfActive')");
pdf = pdf.replace("'Közelgő (7 nap)'", "t('pdfUpcoming')");
pdf = pdf.replace("'Kiadások kategóriák szerint'", "t('pdfExpensesByCategory')");
pdf = pdf.replace(/\['Kategória', 'Előfizetések', 'Havi összeg', 'Részarány'\]/g, "[t('pdfCategory'), t('pdfSubscriptions'), t('pdfMonthlyAmount'), t('pdfShare')]");
pdf = pdf.replace("'Részletes előfizetési lista'", "t('pdfDetailedList')");
pdf = pdf.replace(/\['Szolgáltatás', 'Kategória', 'Összeg', 'Ciklus', 'Havi HUF', 'Következő levonás', 'Fizetési mód', 'Státusz'\]/g, "[t('pdfService'), t('pdfCategory'), t('pdfAmount'), t('pdfCycle'), t('pdfMonthlyHuf'), t('pdfNextBilling'), t('pdfPaymentMethod'), t('pdfStatus')]");
pdf = pdf.replace(/sub\.isTrial \? ' \(Próba\)' : ''/g, "sub.isTrial ? t('pdfTrialSuffix') : ''");
pdf = pdf.replace(/cleanText\('Aktív'\) : cleanText\('Inaktív'\)/g, "cleanText(t('pdfActiveStatus')) : cleanText(t('pdfInactiveStatus'))");
pdf = pdf.replace(/`Oldal \$\{currentPage\} \/ \$\{pageCount\} \| Subscription Manager`/g, "t('pdfPage').replace('{current}', currentPage.toString()).replace('{total}', pageCount.toString())");
// also apply getTranslatedCategory for categories
pdf = pdf.replace(/cleanText\(c\.category\)/g, "cleanText(getTranslatedCategory(t, c.category))");
pdf = pdf.replace(/cleanText\(sub\.category\)/g, "cleanText(getTranslatedCategory(t, sub.category))");

// cycleLabel function inside pdf.ts needs translation
pdf = pdf.replace(/function cycleLabel\(cycle: string\): string \{/g, "function cycleLabel(cycle: string, t: any): string {");
pdf = pdf.replace(/cleanText\(cycleLabel\(sub\.billingCycle\)\)/g, "cleanText(cycleLabel(sub.billingCycle, t))");
pdf = pdf.replace("case 'monthly': return 'Havi';", "case 'monthly': return t('monthly');");
pdf = pdf.replace("case 'yearly': return 'Éves';", "case 'yearly': return t('yearly');");
pdf = pdf.replace("case 'quarterly': return 'Negyedéves';", "case 'quarterly': return t('quarterly');");
pdf = pdf.replace("case 'weekly': return 'Heti';", "case 'weekly': return t('weekly');");
fs.writeFileSync('src/lib/pdf.ts', pdf);

// page.tsx
let page = fs.readFileSync('src/app/page.tsx', 'utf8');
page = page.replace(/generatePdfReport\(subscriptions, stats\);/g, "generatePdfReport(subscriptions, stats, t);");
fs.writeFileSync('src/app/page.tsx', page);

