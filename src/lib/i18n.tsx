'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'hu' | 'en';

const translations = {
  hu: {
    dashboard: 'Áttekintés',
    subscriptions: 'Előfizetéseim',
    calendar: 'Naptár',
    analytics: 'Statisztikák',
    backup: 'Mentés & Import',
    newSubscription: 'Új előfizetés',
    loading: 'Adatok betöltése folyamatban...',
    errorLoading: 'Hiba az adatok betöltésekor',
    retry: 'Újrapróbálkozás',
    activeSub: 'Aktív',
    archivedSub: 'Archivált',
    pausedSub: 'Szünetel',
    monthlyEquiv: 'Havi egyenérték',
    nextBilling: 'Következő levonás',
    totalMonthly: 'Havi összköltség',
    totalYearly: 'Éves vetített költség',
    activeCount: 'Aktív szolgáltatások',
    upcoming7Days: 'Levonás a héten',
    dailyAvg: 'nap átlagosan',
    basedOn12Months: '12 havi aktuális állapot alapján',
    allActive: 'Minden felvitt tétel aktív',
    expectedNext7Days: 'Következő 7 napban várható',
    upcomingPaymentsTitle: 'Hamarosan esedékes levonások',
    upcomingPaymentsSub: 'Következő 7 nap eseményei naptári sorrendben',
    noUpcoming: 'A következő 7 napban nincs esedékes fizetendő tétel.',
    calendarView: 'Naptár nézet',
    topExpenses: 'Legnagyobb költségtényezők',
    topExpensesSub: 'Havi egyenérték szerint csökkenő sorrendben',
    detailedAnalytics: 'Részletes elemzés',
    generateReport: 'Jelentés készítése:',
    ofTotal: 'az összköltségből',
    downloadPdf: 'PDF Kimutatás letöltése',
    upcomingPayments: 'Közelgő fizetések (következő 30 nap)',
    categoryDist: 'Kiadások megoszlása kategóriák szerint',
    settings: 'Beállítások',
    theme: 'Téma',
    language: 'Nyelv',
    save: 'Mentés',
    cancel: 'Mégse',
    delete: 'Törlés',
    edit: 'Szerkesztés',
    archive: 'Archiválás',
    unarchive: 'Visszaállítás',
    confirmDelete: 'Biztosan törölni szeretnéd?',
    confirmArchive: 'Biztosan archiválod/visszaállítod ezt az előfizetést?',
    name: 'Szolgáltatás neve',
    amount: 'Összeg',
    currency: 'Valuta',
    billingCycle: 'Ciklus',
    monthly: 'havonta',
    yearly: 'évente',
    quarterly: 'negyedévente',
    weekly: 'hetente',
    category: 'Kategória',
    paymentMethod: 'Fizetési mód',
    notes: 'Megjegyzés',
    url: 'Weboldal',
    isActive: 'Aktív előfizetés',
    isTrial: 'Próbaidőszak',
    trialEnd: 'Próbaidőszak lejárata',
    priceHistory: 'Ártörténet és Infláció',
    noHistory: 'Nincs rögzített árváltozás.',
    custom: 'Egyedi felvitel',
    catalog: 'Katalógusból',
    searchCatalog: 'Keresés a katalógusban...',
    noResult: 'Nincs találat',
    import: 'Importálás',
    export: 'Exportálás',
    backupDesc: 'Mentsd le az adataidat biztonsági mentésként vagy tölts vissza egy korábbi állapotot.',
    downloadBackup: 'JSON Biztonsági Mentés',
    importBackup: 'Mentés visszaállítása (JSON)',
    successImport: 'Sikeres importálás',
    errorImport: 'Hiba az importálás során',
    emptyList: 'Nincs megjeleníthető előfizetés.',
    calendarTitle: 'Fizetési Naptár',
    calendarDesc: 'A havi fizetendő tételek és próbaidőszakok áttekintése.',
    prevMonth: 'Előző hónap',
    nextMonth: 'Következő hónap',
    today: 'Ma',
    mon: 'Hétfő', tue: 'Kedd', wed: 'Szerda', thu: 'Csütörtök', fri: 'Péntek', sat: 'Szombat', sun: 'Vasárnap',
    jan: 'Január', feb: 'Február', mar: 'Március', apr: 'Április', may: 'Május', jun: 'Június',
    jul: 'Július', aug: 'Augusztus', sep: 'Szeptember', oct: 'Október', nov: 'November', dec: 'December',
    dailyDetails: 'Napi részletek',
    noEventsToday: 'Ezen a napon nincs esedékes levonás.',
    expectedDeduction: 'Várható levonások a hónapban:',
    subscriptionList: 'Előfizetések Listája',
    subscriptionListDesc: 'Az összes aktív és archivált szolgáltatásod kezelése.',
    searchPlaceholder: 'Keresés név, kártya vagy megjegyzés szerint...',
    filterAll: 'Minden státusz',
    filterActive: 'Aktív',
    filterArchived: 'Archivált',
    filterTrial: 'Próbaidőszak',
    sortName: 'Név (A-Z)',
    sortPriceDesc: 'Ár (csökkenő)',
    sortPriceAsc: 'Ár (növekvő)',
    sortDate: 'Következő levonás',
    emptySearch: 'Nincs a keresésnek megfelelő előfizetés.',
    analyticsTitle: 'Financial Analytics és Elemzések',
    analyticsDesc: 'Részletes kiadási struktúra kategóriák, devizák és fizetési kártyák szerint',
    catBreakdown: 'Kiadások megoszlása kategóriák szerint',
    catBreakdownDesc: 'Havi egyenérték arányában',
    paymentMethodsTitle: 'Fizetési Módok',
    paymentMethodsDesc: 'Honnan várható a legtöbb levonás?',
    yearlyBudgetTitle: 'Legnagyobb havi tételek összehasonlítása',
    yearlyBudgetDesc: 'Top előfizetések költsége HUF-ban',
    totalYearlyCost: 'Összesített Éves Költség',
    perYear: 'évente',
    optimizationTips: 'Optimalizációs és Költségcsökkentési Ötletek',
    optDesc: 'Néhány tipp a felesleges kiadások csökkentésére.',
    opt1: 'Éves előfizetés választása:',
    opt1Desc: 'Sok szolgáltatás (pl. VPN, tárhely) 20-30% kedvezményt ad éves fizetés esetén.',
    opt2: 'Családi csomagok:',
    opt2Desc: 'Ha többen használtok Spotify-t vagy YouTube Premiumot a családban, váltsatok közös csomagra!',
    opt3: 'Inaktív szolgáltatások:',
    opt3Desc: 'Rendszeresen nézd át a listát, és archiváld/mondd le azokat, amiket már több mint 2 hónapja nem használtál.',
    opt4: 'Próbaidőszakok követése:',
    opt4Desc: 'Állíts be emlékeztetőt a naptáradban a próbaidőszakok lejárata előtt 1 nappal.',
    count: 'db',
    selectDay: 'Válassz egy napot!',
    clickDayDetails: 'Kattints a naptár bármelyik cellájára a részletekért',
    payment: 'Fizetés',
    clickDayDesc: 'Kattints egy naptári napra, ahol előfizetés található, hogy megtekinthesd a részleteit vagy szerkeszd.',
    autoMonthlyDesc: 'A havi előfizetések automatikusan minden hónap adott napján szerepelnek a naptárban.',
    allCategories: 'Minden kategória',
    backupTitle: 'Adatmentés és Visszaállítás (Backup & Restore)',
    exportData: 'Adatok Exportálása',
    currentSaved: 'Jelenleg rögzített előfizetések száma:',
    formatDesc: 'Teljes visszaállításhoz szükséges formátum',
    csvTitle: 'CSV Táblázat',
    csvDesc: 'Excel, Google Sheets elemzéshez',
    jsonPreserve: 'A JSON mentés minden mezőt (színek, ikonok, deviza, jegyzetek) megőriz.',
    restoreBackup: 'Biztonsági Mentés Visszatöltése',
    restoreDesc: 'Tölts vissza egy korábban elmentett .json fájlt',
    readMode: 'BEOLVASÁS MÓDJA',
    fullOverwrite: 'Teljes felülírás (Jelenlegi adatok törlése)',
    merge: 'Összefésülés (Meglévők megtartása és bővítése)',
    clickToSelect: 'Kattints ide a JSON fájl kiválasztásához',
    jsonSupported: '.json formátum támogatott',
    autoRefresh: 'Visszatöltés után az alkalmazás automatikusan frissíti az összes kimutatást.',
    due: 'esedékes',
    download: 'Letöltés',

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

    footerSubtracker: 'SubTracker &bull; Teljesen privát, Dockerben futó előfizetés kezelő',
    footerSqlite: 'SQLite helyi adatbázis &bull; 10 beépített stílustéma',
    monthlyCost: 'Havi költség',
    pdfTitle: 'ELŐFIZETÉSI KIMUTATÁS ÉS PÉNZÜGYI JELENTÉS',
    pdfGeneratedAt: 'Készült: {date} | Valuta: HUF bázis',
    pdfTotalMonthly: 'Havi összköltség',
    pdfTotalYearly: 'Éves összköltség',
    pdfActive: 'Aktív szolgáltatás',
    pdfUpcoming: 'Közelgő (7 nap)',
    pdfExpensesByCategory: 'Kiadások kategóriák szerint',
    pdfCategory: 'Kategória',
    pdfSubscriptions: 'Előfizetések',
    pdfMonthlyAmount: 'Havi összeg',
    pdfShare: 'Részarány',
    pdfDetailedList: 'Részletes előfizetési lista',
    pdfService: 'Szolgáltatás',
    pdfAmount: 'Összeg',
    pdfCycle: 'Ciklus',
    pdfMonthlyHuf: 'Havi HUF',
    pdfNextBilling: 'Következő levonás',
    pdfPaymentMethod: 'Fizetési mód',
    pdfStatus: 'Státusz',
    pdfTrialSuffix: ' (Próba)',
    pdfActiveStatus: 'Aktív',
    pdfInactiveStatus: 'Inaktív',
    pdfPage: 'Oldal {current} / {total} | Subscription Manager',
    backupOverwrite: 'Teljes felülírás',
    backupOverwriteDesc: '(Jelenlegi adatok törlése)',
    backupMerge: 'Összefésülés',
    backupMergeDesc: '(Meglévők megtartása és bővítése)',
    backupConfirm: 'Figyelem: A teljes felülírás törli az összes jelenlegi előfizetésedet, és a fájl tartalmát tölti be helyettük. Biztosan folytatod?',

    changeTheme: 'Téma módosítása',
    cardView: 'Kártya nézet',
    tableView: 'Táblázat nézet',
    toggleStatus: 'Státusz váltása',
    immediateSwitch: 'Azonnali váltás',
    notEnoughData: 'Nincs elegendő adat a diagramhoz',
    noResults: 'Nincs találat a megadott feltételekre',
    colService: 'Szolgáltatás',
    colCategory: 'Kategória',
    colAmount: 'Összeg',
    colCycle: 'Ciklus',
    colPayment: 'Fizetési mód',
    colStatus: 'Státusz',
    colActions: 'Műveletek',
    errorOccurred: 'Hiba történt:',
    errorDelete: 'Hiba a törlés során:',
    error: 'Hiba:',
    errorPdf: 'Nem sikerült generálni a PDF riportot.',
    confirmRestore: 'Biztosan visszaállítod ezt az előfizetést?',
    placeholderName: 'pl. Netflix',
    placeholderAmount: 'pl. 3490',
    placeholderNotes: 'pl. Családi csomag...',
    placeholderUrl: 'https://...',
    errorLoadingData: 'Hiba az adatok betöltésekor',
  },
  en: {



  }
};

type TranslationKey = keyof typeof translations.hu;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({ lang: "hu", setLang: () => {}, t: (key) => key
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('hu');

  useEffect(() => {
    const saved = localStorage.getItem('subtracker_lang') as Language;
    if (saved && (saved === 'hu' || saved === 'en')) {
      setLang(saved);
    }
  }, []);

  const changeLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('subtracker_lang', newLang);
  };

  const t = (key: TranslationKey): string => {
    return (translations[lang] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const getTranslatedCategory = (t: any, category: string): string => {
  const map: Record<string, keyof typeof translations.hu> = {
    'Streaming & Média': 'catStreaming',
    'AI & Produktivitás': 'catAI',
    'Fejlesztés & Felhő': 'catCloud',
    'Szoftver & Eszközök': 'catSoftware',
    'Zene & Podcast': 'catMusic',
    'Játék': 'catGaming',
    'Hírek & Oktatás': 'catNews',
    'Fitnesz & Életmód': 'catFitness',
    'Közmű & Pénzügy': 'catFinance',
    'Egyéb': 'catOther'
  };
  if (map[category]) {
    return t(map[category]);
  }
  return category;
};


export function getTranslatedThemeDescription(t: any, themeId: string): string {
  const enMap: Record<string, string> = {
    'obsidian': 'Elegant deep graphite background with cool blue accents (Dark)',
    'minimal-light': 'Clean porcelain background with elegant black and royal blue typography (Light)',
    'arctic': 'Arctic blue-grey palette with ice blue and frosty turquoise shades (Dark)',
    'midnight': 'Deep night blue with discreet lavender and pastel blue accents (Dark)',
    'velvet': 'Velvety dark tones with soft warm purple and blue pastels (Dark)',
    'forest': 'Deep forest green and slate shades with premium emerald highlights (Dark)',
    'monochrome': 'Strict black-and-white and neutral grey typographic design (Dark)',
    'classic-dark': 'Classic dark cyan and teal background with subtle amber (Dark)',
    'sepia': 'Warm parchment background with elegant terracotta and warm brown details (Light)',
    'fintech': 'Deep indigo fintech aesthetic with modern cobalt blue focus (Dark)'
  };
  if (t('dashboard') !== 'Vezérlőpult') {
    return enMap[themeId] || '';
  }
  return '';
}

export function getTranslatedPresetDescription(t: any, presetId: string, originalDesc: string): string {
  if (t('dashboard') === 'Vezérlőpult') return originalDesc;
  const enMap: Record<string, string> = {
    'netflix': 'Streaming movies and series in Standard/Premium plan',
    'youtube-premium': 'Ad-free video watching and YouTube Music with background play',
    'apple-tv': 'Apple Originals movies and series in 4K HDR quality',
    'disney-plus': 'Disney, Pixar, Marvel, Star Wars and National Geographic content',
    'max': 'Warner Bros, HBO, Discovery and DC content',
    'amazon-prime': 'Prime Video streaming and free shipping benefits',
    'google-one': 'Google One AI Premium plan with 2TB storage and Gemini 1.5 Pro model',
    'chatgpt-plus': 'GPT-4o, Canvas, DALL-E image generation and priority access',
    'claude-pro': 'Claude 3.5 Sonnet, 5x more messages and Artifacts feature',
    'github-copilot': 'AI code completion and assistant for IDE development environment',
    'midjourney': 'Generative image generation software on Discord and web interface',
    'notion': 'Unlimited blocks, file uploads and collaboration workspace',
    'spotify': 'Ad-free music listening and podcasts with offline downloads',
    'apple-music': 'Spatial Audio and Lossless quality music streaming',
    'tidal': 'Hi-Res FLAC and Dolby Atmos studio quality streaming',
    'google-workspace': 'Extended Google Photos, Drive and Gmail storage with sharing',
    'apple-icloud': 'iCloud storage, Private Relay and Hide My Email feature',
    'dropbox': '2 TB encrypted cloud storage and synchronization',
    'adobe-creative-cloud': 'Photoshop, Illustrator, Premiere Pro, After Effects and InDesign',
    'figma': 'UI/UX design, prototyping and team collaboration',
    'canva-pro': 'Premium templates, brand kit and background remover',
    'jetbrains-all-products': 'IntelliJ IDEA, WebStorm, PyCharm, CLion and GoLand IDE package',
    'microsoft-365': 'Word, Excel, PowerPoint and 1TB OneDrive cloud storage',
    '1password': 'Secure password manager and digital vault for all devices',
    'nordvpn': 'Encrypted VPN and cybersecurity protection against threats',
    'playstation-plus': 'Online multiplayer and hundreds of downloadable PS4/PS5 games',
    'xbox-game-pass': 'Over 100 PC and console games, EA Play and Cloud Gaming',
    'nintendo-switch-online': 'Online play and classic NES/SNES game collection',
    'duolingo-super': 'Unlimited hearts, ad-free language learning and personalized practice',
    'strava': 'Detailed route planning, segment leaderboards and workout analysis',
    'headspace': 'Guided meditation, sleep sounds and mindfulness exercises'
  };
  return enMap[presetId] || originalDesc;
}
