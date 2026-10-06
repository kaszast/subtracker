const fs = require('fs');
let content = fs.readFileSync('src/components/SubscriptionModal.tsx', 'utf8');

content = content.replace(
  /const \[notes, setNotes\] = useState\(initialSubscription\?\.notes \|\| ''\);/g,
  `const [notes, setNotes] = useState(initialSubscription?.notes || '');
  const [history, setHistory] = useState<PriceHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);`
);

fs.writeFileSync('src/components/SubscriptionModal.tsx', content);
