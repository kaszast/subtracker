const fs = require('fs');

let content = fs.readFileSync('src/lib/db.ts', 'utf8');

// Add price_history table
if (!content.includes('price_history')) {
  content = content.replace('CREATE TABLE IF NOT EXISTS settings', `CREATE TABLE IF NOT EXISTS price_history (
      id TEXT PRIMARY KEY,
      subscription_id TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      changed_at TEXT NOT NULL,
      FOREIGN KEY(subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings`);
}

// Fix createSubscription
content = content.replace(
  /@notes, @icon, @color, @url, @createdAt, @updatedAt/g,
  '@notes, @icon, @color, @url, @domain, @status, @createdAt, @updatedAt'
);

// Fix create run mapping
content = content.replace(
  /url: data\.url \|\| null,\n\s*createdAt/g,
  'url: data.url || null,\n    domain: data.domain || null,\n    status: data.status || \'active\',\n    createdAt'
);

// Fix update run mapping
content = content.replace(
  /url: merged\.url \|\| null,\n\s*updatedAt/g,
  'url: merged.url || null,\n    domain: merged.domain || null,\n    status: merged.status || \'active\',\n    updatedAt'
);

// Fix import run mapping
content = content.replace(
  /url: sub\.url \|\| null,\n\s*createdAt/g,
  'url: sub.url || null,\n        domain: sub.domain || null,\n        status: sub.status || \'active\',\n        createdAt'
);

// Map row correctly
content = content.replace(
  /url: row\.url \|\| undefined,\n\s*createdAt/g,
  'url: row.url || undefined,\n    domain: row.domain || undefined,\n    status: row.status || \'active\',\n    createdAt'
);

// Fix sample subscriptions array mapping
content = content.replace(
  /url: 'https:\/\/netflix\.com',/g,
  'url: \'https://netflix.com\',\n      domain: \'netflix.com\',\n      status: \'active\','
);
content = content.replace(
  /url: 'https:\/\/one\.google\.com',/g,
  'url: \'https://one.google.com\',\n      domain: \'google.com\',\n      status: \'active\','
);
content = content.replace(
  /url: 'https:\/\/youtube\.com',/g,
  'url: \'https://youtube.com\',\n      domain: \'youtube.com\',\n      status: \'active\','
);
content = content.replace(
  /url: 'https:\/\/tv\.apple\.com',/g,
  'url: \'https://tv.apple.com\',\n      domain: \'apple.com\',\n      status: \'active\','
);
content = content.replace(
  /url: 'https:\/\/spotify\.com',/g,
  'url: \'https://spotify.com\',\n      domain: \'spotify.com\',\n      status: \'active\','
);
content = content.replace(
  /url: 'https:\/\/chat\.openai\.com',/g,
  'url: \'https://chat.openai.com\',\n      domain: \'openai.com\',\n      status: \'active\','
);

// Add getPriceHistory function
if (!content.includes('export function getPriceHistory')) {
  content += `\n
export function getPriceHistory(subscriptionId: string): import('@/types').PriceHistory[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM price_history WHERE subscription_id = ? ORDER BY changed_at DESC').all(subscriptionId);
  return rows.map((r: any) => ({
    id: r.id,
    subscriptionId: r.subscription_id,
    amount: Number(r.amount),
    currency: r.currency,
    changedAt: r.changed_at
  }));
}\n`;
}

fs.writeFileSync('src/lib/db.ts', content);
