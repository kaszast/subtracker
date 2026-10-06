const fs = require('fs');
let content = fs.readFileSync('src/components/BackupView.tsx', 'utf8');
content = content.replace(/confirm\('\\\$\\{t\('backupConfirm'\)\\}([^\n]+)/g, "confirm(t('backupConfirm'))");
content = content.replace(/confirm\('\$\\{t\('backupConfirm'\)\}'\);/g, "confirm(t('backupConfirm'));");
fs.writeFileSync('src/components/BackupView.tsx', content);
