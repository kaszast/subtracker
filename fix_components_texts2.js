const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');
page = page.replace(/<h3 className="font-bold text-sm">Hiba az adatok betöltésekor<\/h3>/g, '<h3 className="font-bold text-sm">{t(\'errorLoadingData\')}</h3>');
fs.writeFileSync('src/app/page.tsx', page);

let modal = fs.readFileSync('src/components/SubscriptionModal.tsx', 'utf8');
modal = modal.replace(/Betöltés\.\.\./g, "{t('loading')}");
fs.writeFileSync('src/components/SubscriptionModal.tsx', modal);
