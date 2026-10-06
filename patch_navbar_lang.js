const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Import useLanguage
content = content.replace(
  /import \{ ThemeSelector \} from '\.\/ThemeSelector';/,
  "import { ThemeSelector } from './ThemeSelector';\nimport { useLanguage } from '@/lib/i18n';"
);

// Add language switcher button
content = content.replace(
  /const navItems = \[/,
  `const { t, lang, setLang } = useLanguage();\n\n  const navItems = [`
);

// Translate labels
content = content.replace(/label: 'Irányítópult'/g, "label: t('dashboard')");
content = content.replace(/label: 'Előfizetések'/g, "label: t('subscriptions')");
content = content.replace(/label: 'Naptár'/g, "label: t('calendar')");
content = content.replace(/label: 'Statisztikák'/g, "label: t('analytics')");
content = content.replace(/label: 'Adatmentés'/g, "label: t('backup')");

// Add Lang Switcher UI next to ThemeSelector
content = content.replace(
  /<ThemeSelector \/>/,
  `<button
            onClick={() => setLang(lang === 'hu' ? 'en' : 'hu')}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-secondary transition-colors uppercase"
            title={t('language')}
          >
            {lang}
          </button>
          <ThemeSelector />`
);

content = content.replace(
  /<span>Új előfizetés<\/span>/g,
  `<span>{t('newSubscription')}</span>`
);

fs.writeFileSync('src/components/Navbar.tsx', content);
