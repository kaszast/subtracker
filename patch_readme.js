const fs = require('fs');

let content = fs.readFileSync('README.md', 'utf8');

// Insert Hungarian screenshots placeholder after the main header
const huScreenshots = `
<div align="center">
  <img src="docs/screenshots/dashboard-hu.png" alt="SubTracker Dashboard" width="800"/>
  <br/>
  <i>Irányítópult és havi költségvetés (Magyar nyelvű felület)</i>
</div>

`;

content = content.replace(/---\n\n## Főbb Funkciók/, huScreenshots + '---\n\n## Főbb Funkciók');

// Insert English screenshots placeholder after the main header
const enScreenshots = `
<div align="center">
  <img src="docs/screenshots/dashboard-en.png" alt="SubTracker Dashboard" width="800"/>
  <br/>
  <i>Dashboard and Monthly Budget (English interface)</i>
</div>

`;

content = content.replace(/---\n\n## Key Features/, enScreenshots + '---\n\n## Key Features');

fs.writeFileSync('README.md', content);

// create docs/screenshots folder
if (!fs.existsSync('docs/screenshots')) {
  fs.mkdirSync('docs/screenshots', { recursive: true });
}

