const fs = require('fs');
let content = fs.readFileSync('src/components/AnalyticsView.tsx', 'utf8');
content = content.replace(/\} ,\n  Calendar\n\} from 'lucide-react';/, ", Calendar } from 'lucide-react';");
fs.writeFileSync('src/components/AnalyticsView.tsx', content);
