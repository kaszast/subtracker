const fs = require('fs');
let code = fs.readFileSync('src/components/CalendarView.tsx', 'utf8');
code = code.replace("{selectedDayDate ? `{t('dailyDetails')}: ${selectedDayDate}` : t('selectDay')}", "{selectedDayDate ? `${t('dailyDetails')}: ${selectedDayDate}` : t('selectDay')}");
fs.writeFileSync('src/components/CalendarView.tsx', code);
