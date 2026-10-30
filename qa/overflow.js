const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const pg = await b.newPage({ viewport: { width: +(process.argv[3]||390), height: 860 } });
  await pg.goto((process.env.QA_BASE || 'http://localhost:5311') + process.argv[2], { waitUntil: 'networkidle' });
  console.log(await pg.evaluate(() => {
    const w = document.documentElement.clientWidth, out = [];
    document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); if (r.right > w + 1 && r.width > 0) out.push(e.tagName + '.' + (e.className.baseVal ?? e.className) + ' ' + Math.round(r.left) + '-' + Math.round(r.right)); });
    return 'scrollW=' + document.documentElement.scrollWidth + ' clientW=' + w + '\n' + out.slice(0, 12).join('\n');
  }));
  await b.close();
})();
