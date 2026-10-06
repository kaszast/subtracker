const fs = require('fs');
let content = fs.readFileSync('src/components/SubscriptionListView.tsx', 'utf8');

// Add Archive to lucide imports if not there
if (!content.includes('Archive')) {
  content = content.replace(/import {([^}]+)} from 'lucide-react';/, (m, p1) => `import { Archive, ${p1} } from 'lucide-react';`);
}

// Add onArchive to props
content = content.replace(
  /onDelete: \(id: string\) => void;/g,
  `onDelete: (id: string) => void;\n  onArchive: (sub: Subscription) => void;`
);

content = content.replace(
  /onDelete,\n  onToggleStatus,\n  onOpenNewModal\n}\) => \{/g,
  `onDelete,\n  onArchive,\n  onToggleStatus,\n  onOpenNewModal\n}) => {\n  const [showArchived, setShowArchived] = useState(false);`
);

// Add Tab toggle for Archived
content = content.replace(
  /<div className="flex gap-2 bg-secondary\/30 p-1 rounded-xl">/g,
  `<div className="flex items-center gap-4 border-r border-border pr-4 mr-2">
            <button
              onClick={() => setShowArchived(false)}
              className={\`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors \${!showArchived ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}\`}
            >
              Aktívak
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={\`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors \${showArchived ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}\`}
            >
              Archiváltak
            </button>
          </div>
          <div className="flex gap-2 bg-secondary/30 p-1 rounded-xl">`
);

// Update filter logic
content = content.replace(
  /let filtered = subscriptions;/g,
  `let filtered = subscriptions.filter(s => showArchived ? s.status === 'archived' : s.status !== 'archived');`
);

// Update Archive button in Card view
content = content.replace(
  /<button\s+onClick=\{\(\) => onToggleStatus\(sub\)\}/g,
  `<button
                        onClick={() => {
                          if (confirm(\`Biztosan \${sub.status === 'archived' ? 'visszaállítod' : 'archiválod'} ezt az előfizetést?\`)) {
                            onArchive(sub);
                          }
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                        title={sub.status === 'archived' ? 'Visszaállítás' : 'Archiválás'}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onToggleStatus(sub)}`
);

// Update Archive button in Table view
content = content.replace(
  /<button\s+onClick=\{\(\) => onToggleStatus\(sub\)\}\s+className="p-1 rounded text-muted-foreground hover:text-emerald-500"/g,
  `<button
                            onClick={() => {
                              if (confirm(\`Biztosan \${sub.status === 'archived' ? 'visszaállítod' : 'archiválod'} ezt az előfizetést?\`)) {
                                onArchive(sub);
                              }
                            }}
                            className="p-1 rounded text-muted-foreground hover:text-amber-500"
                            title={sub.status === 'archived' ? 'Visszaállítás' : 'Archiválás'}
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onToggleStatus(sub)}
                            className="p-1 rounded text-muted-foreground hover:text-emerald-500"`
);

// Add status column to table
content = content.replace(
  /<th className="py-3 px-4">Státusz<\/th>/g,
  `<th className="py-3 px-4">Státusz</th>`
);

content = content.replace(
  /<span\n\s*className=\{\`inline-flex px-2 py-0\.5 rounded-full text-\[10px\] font-semibold \$\{\n\s*sub\.isActive\n\s*\? 'bg-emerald-500\/10 text-emerald-500 border border-emerald-500\/20'\n\s*: 'bg-muted text-muted-foreground'\n\s*\}\`\}\n\s*>\n\s*\{sub\.isActive \? 'Aktív' : 'Szünetel'\}/g,
  `<span
                          className={\`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold \${
                            sub.status === 'archived'
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : sub.isActive
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-muted text-muted-foreground'
                          }\`}
                        >
                          {sub.status === 'archived' ? 'Archivált' : sub.isActive ? 'Aktív' : 'Szünetel'}`
);

fs.writeFileSync('src/components/SubscriptionListView.tsx', content);
