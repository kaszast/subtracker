const fs = require('fs');

// Fix i18n
let i18n = fs.readFileSync('src/lib/i18n.tsx', 'utf8');
i18n = i18n.replace("download: 'Letöltés'\n\n    editSubscription:", "download: 'Letöltés',\n\n    editSubscription:");
i18n = i18n.replace("download: 'Download'\n\n    editSubscription:", "download: 'Download',\n\n    editSubscription:");
fs.writeFileSync('src/lib/i18n.tsx', i18n);

// Fix JSX syntax in Modal
let modal = fs.readFileSync('src/components/SubscriptionModal.tsx', 'utf8');
modal = modal.replace(/'\{t\('([^']+)'\)\}'/g, "t('$1')");
fs.writeFileSync('src/components/SubscriptionModal.tsx', modal);

