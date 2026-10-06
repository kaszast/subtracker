const fs = require('fs');
let content = fs.readFileSync('src/components/SubscriptionModal.tsx', 'utf8');
content = content.replace(
  /url,\n\s*isActive/g,
  'url,\n      domain,\n      isActive'
);
fs.writeFileSync('src/components/SubscriptionModal.tsx', content);
