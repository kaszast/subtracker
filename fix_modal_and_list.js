const fs = require('fs');

const replaceInFile = (file, replacements) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key, 'g'), value);
  }
  fs.writeFileSync(file, content);
};

// SubscriptionListView
replaceInFile('src/components/SubscriptionListView.tsx', {
  'placeholder="\\{t\\(\'searchPlaceholder\'\\)\\}"': 'placeholder={t(\'searchPlaceholder\')}',
  'Csak aktív': '{t(\'filterActive\')}',
  'Szüneteltetett': '{t(\'pausedSub\')}',
  'Csak próbaidőszak': '{t(\'filterTrial\')}',
  'Biztosan törölni szeretnéd a\\(z\\) \\$\\{sub.name\\} előfizetést\\?': '${t(\'confirmDelete\')} ${sub.name}', // t('confirmDelete') doesn't have the sub name placeholder, but let's just make it general or append it
  // Actually wait, let's just use \`\${t('confirmDelete')} (\${sub.name})\`
});

// Let's refine the confirm dialog replace manually to be sure it is correct JS
let listContent = fs.readFileSync('src/components/SubscriptionListView.tsx', 'utf8');
listContent = listContent.replace(/confirm\(`Biztosan törölni szeretnéd a\(z\) \$\{sub\.name\} előfizetést\?`\)/g, "confirm(`${t('confirmDelete')} (${sub.name})`)");
fs.writeFileSync('src/components/SubscriptionListView.tsx', listContent);


// Add useLanguage to SubscriptionModal.tsx
let modalContent = fs.readFileSync('src/components/SubscriptionModal.tsx', 'utf8');
if (!modalContent.includes('useLanguage')) {
  modalContent = modalContent.replace(/from 'lucide-react';/, "from 'lucide-react';\nimport { useLanguage } from '@/lib/i18n';");
  modalContent = modalContent.replace(/export const SubscriptionModal: React\.FC<SubscriptionModalProps> = \(\{\n([^\}]*)\n\}\) => \{/, "export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({\n$1\n}) => {\n  const { t } = useLanguage();");
}

fs.writeFileSync('src/components/SubscriptionModal.tsx', modalContent);

replaceInFile('src/components/SubscriptionModal.tsx', {
  "Előfizetés módosítása": "{t('editSubscription')}",
  "Új előfizetés hozzáadása": "{t('addSubscription')}",
  "Módosítsd az előfizetés paramétereit": "{t('editSubscriptionDesc')}",
  "Válassz a népszerű katalógusból vagy add meg kézzel": "{t('addSubscriptionDesc')}",
  "Katalógusból választás": "{t('fromCatalog')}",
  "Kézi felvitel & Testreszabás": "{t('customEntry')}",
  "Szolgáltatás neve \\*": "{t('serviceName')} *",
  "pl\\. Netflix": "e.g. Netflix",
  "Összeg \\*": "{t('amount')} *",
  "pl\\. 3490": "e.g. 3490",
  "Pénznem": "{t('currency')}",
  "Számlázási ciklus": "{t('billingCycle')}",
  "Havi": "{t('monthly')}",
  "Éves": "{t('yearly')}",
  "Negyedéves": "{t('quarterly')}",
  "Heti": "{t('weekly')}",
  "Következő levonási dátum \\*": "{t('nextBillingDate')} *",
  "Kategória": "{t('category')}",
  "Fizetési mód \\(opcionális\\)": "{t('paymentMethodOpt')}",
  "pl\\. Revolut Virtual, OTP Főkártya, PayPal": "e.g. Revolut Virtual, PayPal",
  "Szolgáltatás weboldala \\(opcionális\\)": "{t('websiteOpt')}",
  "Aktív előfizetés": "{t('activeSubscription')}",
  "Az inaktív \\/ szüneteltetett tételek nem számítanak bele a havi összköltségbe": "{t('inactiveDesc')}",
  "Ingyenes próbaidőszak \\(Trial\\)": "{t('freeTrial')}",
  "Jelölés próbaidőszakos előfizetésekhez automatikus riasztással": "{t('trialDesc')}",
  "Megjegyzés \\(opcionális\\)": "{t('notesOpt')}",
  "pl\\. Családi csomag, lemondani ha nincs kihasználva\\.\\.\\.": "e.g. Family plan...",
  "Mégse": "{t('cancel')}",
  "Előfizetés mentése": "{t('saveSubscription')}",
  "Módosítások mentése": "{t('saveChanges')}",
  "Ártörténet és Infláció": "{t('priceHistory')}",
  "Nincs rögzített árváltozás\\.": "{t('noHistory')}",
  "Mentés folyamatban\\.\\.\\.": "{t('saving')}"
});

