const fs = require('fs');
let content = fs.readFileSync('src/components/SubscriptionListView.tsx', 'utf8');

content = content.replace(
  /onDelete: \(id: string\) => void;/g,
  `onDelete: (id: string) => void;\n  onArchive: (sub: Subscription) => void;`
);

fs.writeFileSync('src/components/SubscriptionListView.tsx', content);
