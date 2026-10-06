const fs = require('fs');
let content = fs.readFileSync('src/lib/db.ts', 'utf8');

// Insert history on create
content = content.replace(
  /return getSubscriptionById\(data\.id\)!;/g,
  `const historyId = \`ph-\${Date.now()}-\${Math.floor(Math.random()*1000)}\`;
  db.prepare('INSERT INTO price_history (id, subscription_id, amount, currency, changed_at) VALUES (?, ?, ?, ?, ?)').run(historyId, data.id, data.amount, data.currency, now);
  return getSubscriptionById(data.id)!;`
);

// Insert history on update
content = content.replace(
  /return getSubscriptionById\(id\);/g,
  `if (existing.amount !== merged.amount || existing.currency !== merged.currency) {
    const historyId = \`ph-\${Date.now()}-\${Math.floor(Math.random()*1000)}\`;
    db.prepare('INSERT INTO price_history (id, subscription_id, amount, currency, changed_at) VALUES (?, ?, ?, ?, ?)').run(historyId, id, merged.amount, merged.currency, now);
  }
  return getSubscriptionById(id);`
);

fs.writeFileSync('src/lib/db.ts', content);
