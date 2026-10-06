const fs = require('fs');
let i18n = fs.readFileSync('src/lib/i18n.tsx', 'utf8');

const huNew = `
    editSubscription: 'Előfizetés módosítása',
    addSubscription: 'Új előfizetés hozzáadása',
    editSubscriptionDesc: 'Módosítsd az előfizetés paramétereit',
    addSubscriptionDesc: 'Válassz a népszerű katalógusból vagy add meg kézzel',
    fromCatalog: 'Katalógusból választás',
    customEntry: 'Kézi felvitel & Testreszabás',
    serviceName: 'Szolgáltatás neve',
    nextBillingDate: 'Következő levonási dátum',
    paymentMethodOpt: 'Fizetési mód (opcionális)',
    websiteOpt: 'Szolgáltatás weboldala (opcionális)',
    activeSubscription: 'Aktív előfizetés',
    inactiveDesc: 'Az inaktív / szüneteltetett tételek nem számítanak bele a havi összköltségbe',
    freeTrial: 'Ingyenes próbaidőszak (Trial)',
    trialDesc: 'Jelölés próbaidőszakos előfizetésekhez automatikus riasztással',
    notesOpt: 'Megjegyzés (opcionális)',
    saveSubscription: 'Előfizetés mentése',
    saveChanges: 'Módosítások mentése',
    saving: 'Mentés folyamatban...',
    catStreaming: 'Streaming & Média',
    catAI: 'AI & Produktivitás',
    catCloud: 'Fejlesztés & Felhő',
    catSoftware: 'Szoftver & Eszközök',
    catMusic: 'Zene & Podcast',
    catGaming: 'Játék',
    catNews: 'Hírek & Oktatás',
    catFitness: 'Fitnesz & Életmód',
    catFinance: 'Közmű & Pénzügy',
    catOther: 'Egyéb',
  },
  en:`;

const enNew = `
    editSubscription: 'Edit Subscription',
    addSubscription: 'Add New Subscription',
    editSubscriptionDesc: 'Modify subscription details',
    addSubscriptionDesc: 'Choose from catalog or add manually',
    fromCatalog: 'From Catalog',
    customEntry: 'Custom Entry',
    serviceName: 'Service Name',
    nextBillingDate: 'Next Billing Date',
    paymentMethodOpt: 'Payment Method (optional)',
    websiteOpt: 'Website (optional)',
    activeSubscription: 'Active Subscription',
    inactiveDesc: 'Inactive / paused items are not included in monthly costs',
    freeTrial: 'Free Trial',
    trialDesc: 'Mark for free trials to receive automatic alerts',
    notesOpt: 'Notes (optional)',
    saveSubscription: 'Save Subscription',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    catStreaming: 'Streaming & Media',
    catAI: 'AI & Productivity',
    catCloud: 'Dev & Cloud',
    catSoftware: 'Software & Tools',
    catMusic: 'Music & Podcasts',
    catGaming: 'Gaming',
    catNews: 'News & Education',
    catFitness: 'Fitness & Lifestyle',
    catFinance: 'Utilities & Finance',
    catOther: 'Other',
  }
};`;

i18n = i18n.replace('  },\n  en: {', huNew + ' {');
i18n = i18n.replace('  }\n};', enNew);

fs.writeFileSync('src/lib/i18n.tsx', i18n);

