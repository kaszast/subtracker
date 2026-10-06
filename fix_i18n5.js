const fs = require('fs');
let i18n = fs.readFileSync('src/lib/i18n.tsx', 'utf8');

const huNew = `
    errorLoadingData: 'Hiba az adatok betöltésekor',
    loading: 'Betöltés...',
  },
  en:`;

const enNew = `
    errorLoadingData: 'Error loading data',
    loading: 'Loading...',
  }
};`;

i18n = i18n.replace('  },\n  en: {', huNew + ' {');
i18n = i18n.replace('  }\n};', enNew);
fs.writeFileSync('src/lib/i18n.tsx', i18n);
