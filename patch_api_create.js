const fs = require('fs');
let content = fs.readFileSync('src/app/api/subscriptions/route.ts', 'utf8');

content = content.replace(
  /url: body\.url\?\.trim\(\) \|\| undefined\n\s*\};/g,
  `url: body.url?.trim() || undefined,
      domain: body.domain?.trim() || undefined,
      status: body.status || 'active'
    };`
);

fs.writeFileSync('src/app/api/subscriptions/route.ts', content);

let content2 = fs.readFileSync('src/app/api/subscriptions/[id]/route.ts', 'utf8');
content2 = content2.replace(
  /url: body\.url\?\.trim\(\) \|\| undefined\n\s*\};/g,
  `url: body.url?.trim() || undefined,
      domain: body.domain?.trim() || undefined,
      status: body.status || 'active'
    };`
);
// Also need to handle params properly in Next.js 15
content2 = content2.replace(
  /export async function PUT\(request: Request, \{ params \}: \{ params: \{ id: string \} \}\) \{/g,
  `export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {\n  const params = await props.params;`
);
content2 = content2.replace(
  /export async function DELETE\(request: Request, \{ params \}: \{ params: \{ id: string \} \}\) \{/g,
  `export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {\n  const params = await props.params;`
);

fs.writeFileSync('src/app/api/subscriptions/[id]/route.ts', content2);
