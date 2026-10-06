const fs = require('fs');
let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

// Fix the syntax error
content = content.replace(/'Ma \{t\('upcoming7Days'\)\}!'/g, "`Ma ${t('upcoming7Days')}!`");

fs.writeFileSync('src/components/DashboardView.tsx', content);
