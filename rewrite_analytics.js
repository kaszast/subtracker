const fs = require('fs');

let content = fs.readFileSync('src/components/AnalyticsView.tsx', 'utf8');

// Fix tooltips
content = content.replace(/color: 'var\(--foreground\)',\n\s*fontSize: '12px',\n\s*color: 'var\(--foreground\)'/g, "fontSize: '12px'");
// Then add itemStyle and labelStyle cleanly:
// We already added them via sed but let's make sure it's valid.

// The requested feature 1: Category breakdown
// We need to group subs by category and show them.
const categoryListOriginal = `          {/* Kategória jelmagyarázat lista */}
          <div className="space-y-2 mt-4 pt-4 border-t border-border">
            {stats.categorySummaries.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-foreground truncate">{cat.category}</span>
                  <span className="text-[11px] text-muted-foreground">({cat.count} db)</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 font-medium">
                  <span className="text-muted-foreground">{cat.percentage}%</span>
                  <span className="font-bold text-foreground">{formatMoney(cat.monthlyTotalHuf, 'HUF')}</span>
                </div>
              </div>
            ))}
          </div>`;

const categoryListNew = `          {/* Kategória jelmagyarázat lista részletezve */}
          <div className="space-y-4 mt-4 pt-4 border-t border-border">
            {stats.categorySummaries.map((cat) => {
              const subsInCategory = activeSubs.filter(s => (s.category || 'Egyéb') === cat.category).sort((a, b) => getMonthlyEquivalentHuf(b) - getMonthlyEquivalentHuf(a));
              return (
                <div key={cat.category} className="text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-foreground font-semibold truncate">{cat.category}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 font-medium">
                      <span className="text-muted-foreground">{cat.percentage}%</span>
                      <span className="font-bold text-foreground">{formatMoney(cat.monthlyTotalHuf, 'HUF')} / hó</span>
                    </div>
                  </div>
                  <div className="pl-5 space-y-1">
                    {subsInCategory.map(sub => (
                      <div key={sub.id} className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground truncate">{sub.name}</span>
                        <span className="text-foreground font-medium shrink-0">{formatMoney(getMonthlyEquivalentHuf(sub), 'HUF')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>`;

content = content.replace(categoryListOriginal, categoryListNew);

// The requested feature 2: Yearly breakdown per subscription
const yearlyStatsHtml = `
      {/* Éves előrejelzés szolgáltatásonként */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm mt-6">
        <div className="border-b border-border pb-3 mb-4 flex justify-between items-end">
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Éves Költségvetés Szolgáltatásonként
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Mennyibe kerülnek az egyes előfizetések 1 év alatt?</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Összesített Éves Költség</p>
            <p className="text-sm font-bold text-foreground">{formatMoney(stats.totalYearlyHuf, 'HUF')}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeSubs
            .map(sub => ({ ...sub, yearlyCost: getMonthlyEquivalentHuf(sub) * 12 }))
            .sort((a, b) => b.yearlyCost - a.yearlyCost)
            .map(sub => (
              <div key={sub.id} className="p-3 rounded-xl bg-secondary/50 border border-border flex justify-between items-center">
                <div className="truncate pr-3">
                  <p className="text-xs font-semibold text-foreground truncate">{sub.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">{sub.billingCycle}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-foreground">{formatMoney(sub.yearlyCost, 'HUF')}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">évente</p>
                </div>
              </div>
          ))}
        </div>
      </div>
`;

// Insert the yearlyStatsHtml before the closing </div> of the main flex container, or just above the optimization tips.
content = content.replace(
  /\{\/\* Optimalizációs és Költségcsökkentési Ötletek \*\/\}/,
  yearlyStatsHtml + '\n\n      {/* Optimalizációs és Költségcsökkentési Ötletek */}'
);

fs.writeFileSync('src/components/AnalyticsView.tsx', content);

