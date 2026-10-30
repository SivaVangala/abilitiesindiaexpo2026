/* Loads key pages and fails on console errors / CSP violations. QA_BASE defaults to the .NET host. */
const { chromium } = require('playwright-core');
const BASE = process.env.QA_BASE || 'http://localhost:5320';
(async () => {
  const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage(); const errs = [];
  p.on('console', m => m.type() === 'error' && errs.push(p.url() + ' ' + m.text()));
  p.on('pageerror', e => errs.push(p.url() + ' ' + e.message));
  for (const u of ['/', '/programs/', '/programs/visitor/', '/contact/', '/faq/', '/register/?t=visitor']) {
    await p.goto(BASE + u, { waitUntil: 'networkidle' });
    if (u === '/') { await p.keyboard.press('Alt+a'); await p.waitForTimeout(200); await p.click('[data-toggle="contrast"]'); }
  }
  console.log(errs.length ? errs.join('\n') : 'No console errors or CSP violations on ' + BASE);
  await b.close();
})();
