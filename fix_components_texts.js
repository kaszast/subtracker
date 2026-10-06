const fs = require('fs');

// ThemeSelector.tsx
let theme = fs.readFileSync('src/components/ThemeSelector.tsx', 'utf8');
if (!theme.includes('useLanguage')) {
  theme = theme.replace("import React from 'react';", "import React from 'react';\nimport { useLanguage } from '@/lib/i18n';");
  theme = theme.replace("export function ThemeSelector({ currentTheme, onSelectTheme }: ThemeSelectorProps) {", "export function ThemeSelector({ currentTheme, onSelectTheme }: ThemeSelectorProps) {\n  const { t } = useLanguage();");
}
theme = theme.replace(/Azonnali váltás/g, "{t('immediateSwitch')}");
theme = theme.replace(/title="Téma módosítása"/g, "title={t('changeTheme')}");
fs.writeFileSync('src/components/ThemeSelector.tsx', theme);

// SubscriptionModal.tsx
let modal = fs.readFileSync('src/components/SubscriptionModal.tsx', 'utf8');
modal = modal.replace(/Minden kategória/g, "{t('allCategories')}");
modal = modal.replace(/placeholder="e\.g\. Netflix"/g, "placeholder={t('placeholderName')}");
modal = modal.replace(/placeholder="e\.g\. 3490"/g, "placeholder={t('placeholderAmount')}");
modal = modal.replace(/placeholder="e\.g\. Family plan\.\.\."/g, "placeholder={t('placeholderNotes')}");
modal = modal.replace(/placeholder="https:\/\/\.\.\."/g, "placeholder={t('placeholderUrl')}");
fs.writeFileSync('src/components/SubscriptionModal.tsx', modal);

// AnalyticsView.tsx
let analytics = fs.readFileSync('src/components/AnalyticsView.tsx', 'utf8');
analytics = analytics.replace(/Nincs elegendő adat a diagramhoz/g, "{t('notEnoughData')}");
fs.writeFileSync('src/components/AnalyticsView.tsx', analytics);

// SubscriptionListView.tsx
let list = fs.readFileSync('src/components/SubscriptionListView.tsx', 'utf8');
list = list.replace(/Nincs találat a megadott feltételekre/g, "{t('noResults')}");
list = list.replace(/<th className="py-3 px-4">Szolgáltatás<\/th>/g, '<th className="py-3 px-4">{t(\'colService\')}</th>');
list = list.replace(/<th className="py-3 px-4">Kategória<\/th>/g, '<th className="py-3 px-4">{t(\'colCategory\')}</th>');
list = list.replace(/<th className="py-3 px-4">Összeg<\/th>/g, '<th className="py-3 px-4">{t(\'colAmount\')}</th>');
list = list.replace(/<th className="py-3 px-4">Ciklus<\/th>/g, '<th className="py-3 px-4">{t(\'colCycle\')}</th>');
list = list.replace(/<th className="py-3 px-4">Fizetési mód<\/th>/g, '<th className="py-3 px-4">{t(\'colPayment\')}</th>');
list = list.replace(/<th className="py-3 px-4">Státusz<\/th>/g, '<th className="py-3 px-4">{t(\'colStatus\')}</th>');
list = list.replace(/<th className="py-3 px-4 text-right">Műveletek<\/th>/g, '<th className="py-3 px-4 text-right">{t(\'colActions\')}</th>');

list = list.replace(/title="Kártya nézet"/g, "title={t('cardView')}");
list = list.replace(/title="Táblázat nézet"/g, "title={t('tableView')}");
list = list.replace(/title="Szerkesztés"/g, "title={t('edit')}");
list = list.replace(/title="Törlés"/g, "title={t('delete')}");
list = list.replace(/title="Státusz váltása"/g, "title={t('toggleStatus')}");

list = list.replace(/confirm\(`Biztosan \$\{sub\.status === 'archived' \? 'visszaállítod' : 'archiválod'\} ezt az előfizetést\?`\)/g, "confirm(sub.status === 'archived' ? t('confirmRestore') : t('confirmArchive'))");
fs.writeFileSync('src/components/SubscriptionListView.tsx', list);

// page.tsx
let page = fs.readFileSync('src/app/page.tsx', 'utf8');
page = page.replace(/alert\(`Hiba történt: \$\{err\.message\}`\)/g, "alert(`${t('errorOccurred')} ${err.message}`)");
page = page.replace(/alert\(`Hiba a törlés során: \$\{err\.message\}`\)/g, "alert(`${t('errorDelete')} ${err.message}`)");
page = page.replace(/alert\(`Hiba: \$\{err\.message\}`\)/g, "alert(`${t('error')} ${err.message}`)");
page = page.replace(/alert\('Nem sikerült generálni a PDF riportot\.'\)/g, "alert(t('errorPdf'))");
fs.writeFileSync('src/app/page.tsx', page);

