const fs = require('fs');
let content = fs.readFileSync('src/components/SubscriptionModal.tsx', 'utf8');

content = content.replace(
  /<Check,\n\s*TrendingUp/g,
  '<Check'
);

fs.writeFileSync('src/components/SubscriptionModal.tsx', content);
