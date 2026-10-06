const fs = require('fs');
let content = fs.readFileSync('tasks/todo.md', 'utf8');
content = content.replace(/- \[ \] /g, '- [x] ');
fs.writeFileSync('tasks/todo.md', content);
