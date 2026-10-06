const fs = require('fs');
let content = fs.readFileSync('src/components/SubscriptionModal.tsx', 'utf8');

content = content.replace(
  /const \[url, setUrl\] = useState\(initialSubscription\?\.url \|\| ''\);/g,
  `const [url, setUrl] = useState(initialSubscription?.url || '');
  const [domain, setDomain] = useState(initialSubscription?.domain || '');`
);

fs.writeFileSync('src/components/SubscriptionModal.tsx', content);
