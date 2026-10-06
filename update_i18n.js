const fs = require('fs');

let content = fs.readFileSync('src/lib/i18n.tsx', 'utf8');

// The file has translations.hu and translations.en objects
// I will just completely overwrite it to make sure nothing is missed
