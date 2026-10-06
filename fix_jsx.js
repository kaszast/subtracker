const fs = require('fs');

// Fix SubscriptionListView
let content = fs.readFileSync('src/components/SubscriptionListView.tsx', 'utf8');
content = content.replace(/title=\{sub.isActive \? '\{t\('pausedSub'\)\}tetés' : 'Aktiválás'\}/, "title={sub.isActive ? t('pausedSub') : t('activeSub')}");
content = content.replace(/'\{t\('isTrial'\)\}'/, "t('isTrial')");
content = content.replace(/'\{t\('pausedSub'\)\}'/, "t('pausedSub')");
content = content.replace(/'\{t\('activeSub'\)\}'/, "t('activeSub')");
content = content.replace(/'\{t\('archivedSub'\)\}'/, "t('archivedSub')");
content = content.replace(/\{t\('monthly'\)\}/g, "t('monthly')");
content = content.replace(/\{t\('yearly'\)\}/g, "t('yearly')");
content = content.replace(/\{t\('quarterly'\)\}/g, "t('quarterly')");
content = content.replace(/\{t\('weekly'\)\}/g, "t('weekly')");
fs.writeFileSync('src/components/SubscriptionListView.tsx', content);

