const fs = require('fs');
let content = fs.readFileSync('src/components/SubscriptionListView.tsx', 'utf8');

if (!content.includes('useLanguage')) {
  content = content.replace(/from 'lucide-react';/, "from 'lucide-react';\nimport { useLanguage } from '@/lib/i18n';");
  content = content.replace(/=> \{\n/, "=> {\n  const { t } = useLanguage();\n");
}

content = content.replace(/"Előfizetések Listája"/, "{t('subscriptionList')}");
content = content.replace(/"Az összes aktív és archivált szolgáltatásod kezelése\\."/, "{t('subscriptionListDesc')}");
content = content.replace(/"Új előfizetés felvitele"/, "{t('newSubscription')}");
content = content.replace(/"Keresés név vagy kategória alapján\.\.\."/, "{t('searchPlaceholder')}");
content = content.replace(/"Név \(A-Z\)"/, "{t('sortName')}");
content = content.replace(/"Ár \(csökkenő\)"/, "{t('sortPriceDesc')}");
content = content.replace(/"Ár \(növekvő\)"/, "{t('sortPriceAsc')}");
content = content.replace(/"Következő fizetés"/, "{t('sortDate')}");
content = content.replace(/"Nincs a keresésnek megfelelő előfizetés\."/, "{t('emptySearch')}");
content = content.replace(/'havonta'/, "t('monthly')");
content = content.replace(/'évente'/, "t('yearly')");
content = content.replace(/'negyedévente'/, "t('quarterly')");
content = content.replace(/'hetente'/, "t('weekly')");
content = content.replace(/'Aktív'/, "t('activeSub')");
content = content.replace(/'Archivált'/, "t('archivedSub')");
content = content.replace(/'Próbaidőszak'/, "t('isTrial')");
content = content.replace(/'Szünetel'/, "t('pausedSub')");
content = content.replace(/'Havi'/, "t('monthly')");
content = content.replace(/'Éves'/, "t('yearly')");
content = content.replace(/'Negyedéves'/, "t('quarterly')");
content = content.replace(/'Heti'/, "t('weekly')");
content = content.replace(/'Új előfizetés'/, "t('newSubscription')");
content = content.replace(/'Összes'/, "t('filterAll')");
content = content.replace(/title=\{sub\.isActive \? 'Szüneteltetés' : 'Aktiválás'\}/, "title={sub.isActive ? t('pausedSub') : t('activeSub')}");

fs.writeFileSync('src/components/SubscriptionListView.tsx', content);
