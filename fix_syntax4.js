const fs = require('fs');

let backup = fs.readFileSync('src/components/BackupView.tsx', 'utf8');
backup = backup.replace(/confirm\('\$\\{t\('backupConfirm'\)\\}([^\n]+)/g, "confirm(t('backupConfirm'))");
fs.writeFileSync('src/components/BackupView.tsx', backup);

