const fs = require('fs');
let content = fs.readFileSync('src/components/SubscriptionModal.tsx', 'utf8');

// Add imports
content = content.replace(
  /import React, \{ useState, useEffect \} from 'react';/,
  "import React, { useState, useEffect } from 'react';\nimport { PriceHistory } from '@/types';"
);

// Add state
content = content.replace(
  /const \[notes, setNotes\] = useState\(initialSubscription\?\.notes \|\| ''\);/g,
  `const [notes, setNotes] = useState(initialSubscription?.notes || '');\n  const [history, setHistory] = useState<PriceHistory[]>([]);\n  const [loadingHistory, setLoadingHistory] = useState(false);`
);

// Fetch history effect
content = content.replace(
  /useEffect\(\(\) => \{\n\s*if \(!isOpen\) \{\n\s*setSearchTerm\(''\);\n\s*\}\n\s*\}, \[isOpen\]\);/g,
  `useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setHistory([]);
    } else if (initialSubscription && activeTab === 'custom') {
      setLoadingHistory(true);
      fetch(\`/api/subscriptions/\${initialSubscription.id}/history\`)
        .then(res => res.json())
        .then(data => setHistory(data.data || []))
        .catch(console.error)
        .finally(() => setLoadingHistory(false));
    }
  }, [isOpen, initialSubscription, activeTab]);`
);

// Add UI for history below notes
const historyUi = `              {/* Ártörténet */}
              {initialSubscription && (
                <div className="pt-4 border-t border-border mt-4">
                  <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Ártörténet és Infláció
                  </h4>
                  {loadingHistory ? (
                    <div className="text-[11px] text-muted-foreground">Betöltés...</div>
                  ) : history.length > 0 ? (
                    <div className="space-y-2">
                      {history.map((h, i) => (
                        <div key={h.id} className="flex justify-between items-center text-[11px] p-2 bg-background rounded-lg border border-border">
                          <span className="text-muted-foreground">
                            {new Date(h.changedAt).toLocaleDateString('hu-HU')}
                          </span>
                          <span className={\`font-semibold \${i === 0 ? 'text-foreground' : 'text-muted-foreground'}\`}>
                            {h.amount} {h.currency}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-muted-foreground bg-background p-2 rounded-lg border border-border text-center">
                      Nincs rögzített árváltozás.
                    </div>
                  )}
                </div>
              )}`;

content = content.replace(
  /<\/form>\n\s*\)\}\n\s*<\/div>/g,
  `              ${historyUi}\n            </form>\n          )}\n        </div>`
);

// Make sure TrendingUp is imported
if (!content.includes('TrendingUp')) {
  content = content.replace(/import {([^}]+)} from 'lucide-react';/, (m, p1) => `import { TrendingUp, ${p1} } from 'lucide-react';`);
}

fs.writeFileSync('src/components/SubscriptionModal.tsx', content);
