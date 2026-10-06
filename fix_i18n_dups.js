const fs = require('fs');
let i18n = fs.readFileSync('src/lib/i18n.tsx', 'utf8');

// I will remove the exact keys from my huNew block:
const keysToRemove = [
  'edit', 'delete', 'allCategories', 'loading'
];

let lines = i18n.split('\n');
let cleanLines = [];
let keysSeenHu = new Set();
let keysSeenEn = new Set();
let currentLang = 'hu';

for (let line of lines) {
  if (line.includes('en: {')) {
    currentLang = 'en';
  }
  
  let match = line.match(/^\s*([a-zA-Z0-9_]+):/);
  if (match) {
    let key = match[1];
    if (currentLang === 'hu') {
      if (keysSeenHu.has(key)) {
        continue;
      }
      keysSeenHu.add(key);
    } else {
      if (keysSeenEn.has(key)) {
        continue;
      }
      keysSeenEn.add(key);
    }
  }
  cleanLines.push(line);
}

fs.writeFileSync('src/lib/i18n.tsx', cleanLines.join('\n'));
