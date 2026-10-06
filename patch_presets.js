const fs = require('fs');
let content = fs.readFileSync('src/lib/presets.ts', 'utf8');

const domainMap = {
  'Netflix': 'netflix.com',
  'HBO Max': 'max.com',
  'Disney+': 'disneyplus.com',
  'Amazon Prime Video': 'primevideo.com',
  'Apple TV+': 'apple.com',
  'YouTube Premium': 'youtube.com',
  'Spotify Premium': 'spotify.com',
  'Apple Music': 'apple.com',
  'Tidal': 'tidal.com',
  'ChatGPT Plus': 'openai.com',
  'GitHub Copilot': 'github.com',
  'Midjourney': 'midjourney.com',
  'Adobe Creative Cloud': 'adobe.com',
  'Microsoft 365': 'microsoft.com',
  'Google One': 'google.com',
  'PlayStation Plus': 'playstation.com',
  'Xbox Game Pass': 'xbox.com',
  'Nintendo Switch Online': 'nintendo.com'
};

content = content.replace(/name: '([^']+)',\n    defaultAmount/g, (match, name) => {
  let domain = '';
  for (const [key, val] of Object.entries(domainMap)) {
    if (name.includes(key)) {
      domain = val;
      break;
    }
  }
  if (!domain) {
    domain = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  }
  return `name: '${name}',\n    domain: '${domain}',\n    defaultAmount`;
});

fs.writeFileSync('src/lib/presets.ts', content);
