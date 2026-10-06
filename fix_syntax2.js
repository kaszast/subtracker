const fs = require('fs');

const fixJSXQuotes = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/'\{t\('clickToSelect'\)\}'/g, "t('clickToSelect')");
  content = content.replace(/'\{t\('selectDay'\)\}'/g, "t('selectDay')");
  // Also 'Feldolgozás...' should probably be translated, but let's just leave it or use a string
  fs.writeFileSync(file, content);
};

fixJSXQuotes('src/components/BackupView.tsx');
fixJSXQuotes('src/components/CalendarView.tsx');
