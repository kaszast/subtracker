const fs = require('fs');
let content = fs.readFileSync('src/app/layout.tsx', 'utf8');

content = content.replace(
  /import \{ PwaRegistry \} from '@\/components\/PwaRegistry';/,
  "import { PwaRegistry } from '@/components/PwaRegistry';\nimport { LanguageProvider } from '@/lib/i18n';"
);

content = content.replace(
  /<body className="antialiased font-sans">\n\s*<PwaRegistry \/>\n\s*\{children\}\n\s*<\/body>/,
  `<body className="antialiased font-sans">
        <LanguageProvider>
          <PwaRegistry />
          {children}
        </LanguageProvider>
      </body>`
);

fs.writeFileSync('src/app/layout.tsx', content);
