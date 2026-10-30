/*
 * Automated QA — run against a served build:  npm run build && npm run serve  (port 5310), then  npm run qa
 *  1. axe-core WCAG 2.0/2.1/2.2 A + AA rules on every page, desktop (1280) and mobile (390)
 *  2. Reflow: no horizontal scroll at 320 CSS px (= 1280 px at 400% zoom, WCAG 1.4.10)
 *  3. Keyboard: first Tab lands on the skip link and it moves focus to <main>; Alt+A opens the display
 *     dialog, focus is trapped inside, Escape closes it and returns focus; mobile menu opens/closes with Escape
 *  4. Internal link check: every same-origin href resolves (HTTP 200)
 *  5. Page hygiene: exactly one <h1>, <html lang>, <title>, meta description, canonical
 * Writes qa/reports/qa-report.json and prints a summary. Uses the locally installed Chrome (playwright-core).
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');
const BASE = process.env.QA_BASE || 'http://localhost:5310';
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const PAGES = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'dist', 'pages.json'), 'utf8')).map(p => p.path);

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const report = { base: BASE, date: new Date().toISOString(), pages: PAGES.length, axe: [], reflow: [], hygiene: [], keyboard: [], links: [] };
  const hrefs = new Set();

  for (const [label, vp] of [['desktop', { width: 1280, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    for (const p of PAGES) {
      await page.goto(BASE + p, { waitUntil: 'networkidle' });
      await page.addScriptTag({ content: AXE });
      const res = await page.evaluate(async () => {
        const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
        return r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, targets: v.nodes.slice(0, 3).map(n => n.target.join(' ')) }));
      });
      res.forEach(v => report.axe.push({ page: p, viewport: label, ...v }));
      if (label === 'desktop') {
        const h = await page.evaluate(() => ({
          h1: document.querySelectorAll('h1').length, lang: document.documentElement.lang, title: document.title,
          desc: (document.querySelector('meta[name=description]') || {}).content || '', canonical: !!document.querySelector('link[rel=canonical]'), noindex: !!document.querySelector('meta[name=robots][content*=noindex]'),
          hrefs: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h.startsWith('/')),
        }));
        h.hrefs.forEach(x => hrefs.add(x.split('#')[0].split('?')[0]));
        const issues = [];
        if (h.h1 !== 1) issues.push(`h1 count ${h.h1}`);
        if (!h.lang) issues.push('no lang');
        if (!h.title) issues.push('no title');
        if (!h.noindex && (h.desc.length < 50 || h.desc.length > 165)) issues.push(`description length ${h.desc.length}`);
        if (!h.canonical) issues.push('no canonical');
        if (issues.length) report.hygiene.push({ page: p, issues });
      }
    }
    await ctx.close();
  }

  // Reflow at 320px
  const rctx = await browser.newContext({ viewport: { width: 320, height: 700 } });
  const rp = await rctx.newPage();
  for (const p of PAGES) {
    await rp.goto(BASE + p, { waitUntil: 'networkidle' });
    const r = await rp.evaluate(() => {
      const w = document.documentElement.clientWidth;
      const off = [...document.querySelectorAll('main *')].filter(e => { const b = e.getBoundingClientRect(); return b.width && b.right > w + 1 && !e.closest('.table-wrap, [aria-hidden=true]'); }).slice(0, 3).map(e => e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0]);
      return { scrollW: document.documentElement.scrollWidth, w, off };
    });
    if (r.scrollW > r.w || r.off.length) report.reflow.push({ page: p, ...r });
  }
  await rctx.close();

  // Keyboard checks
  const kctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const kp = await kctx.newPage();
  const check = (name, ok, detail = '') => report.keyboard.push({ name, ok, detail });
  // Regression (found 28 Oct 2026): Tab must leave the header and reach <main> — no keyboard trap (WCAG 2.1.2)
  for (const u of ['/', '/programs/']) {
    await kp.goto(BASE + u, { waitUntil: 'networkidle' });
    let reached = false;
    for (let i = 0; i < 40 && !reached; i++) { await kp.keyboard.press('Tab'); reached = await kp.evaluate(() => !!document.activeElement.closest('main')); }
    check(`Tab reaches main content on ${u} (no keyboard trap)`, reached);
  }
  let footer = false;
  for (let i = 0; i < 400 && !footer; i++) { await kp.keyboard.press('Tab'); footer = await kp.evaluate(() => !!document.activeElement.closest('footer')); }
  check('Tab reaches the footer on /programs/', footer);
  await kp.goto(BASE + '/', { waitUntil: 'networkidle' });
  await kp.keyboard.press('Tab');
  check('First Tab focuses skip link', await kp.evaluate(() => document.activeElement.classList.contains('skip')));
  await kp.keyboard.press('Enter');
  check('Skip link moves focus to main', await kp.evaluate(() => document.activeElement.id === 'main' || !!document.activeElement.closest('main')));
  await kp.keyboard.press('Alt+a');
  await kp.waitForTimeout(150);
  check('Alt+A opens display dialog with focus inside', await kp.evaluate(() => !document.getElementById('a11y').hidden && !!document.activeElement.closest('#a11y')));
  for (let i = 0; i < 25; i++) await kp.keyboard.press('Tab');
  check('Focus stays trapped in dialog', await kp.evaluate(() => !!document.activeElement.closest('#a11y')));
  await kp.keyboard.press('Escape');
  await kp.waitForTimeout(350);
  check('Escape closes dialog and restores focus', await kp.evaluate(() => document.getElementById('a11y').hidden && !document.activeElement.closest('#a11y')));
  await kp.focus('.nav__toggle');
  await kp.keyboard.press('Enter');
  check('Mega menu opens with keyboard', await kp.evaluate(() => !document.getElementById('mega-expo').hidden));
  await kp.keyboard.press('Escape');
  check('Escape closes mega menu', await kp.evaluate(() => document.getElementById('mega-expo').hidden && document.activeElement.classList.contains('nav__toggle')));
  await kp.goto(BASE + '/programs/?cat=work', { waitUntil: 'networkidle' });
  check('Filter from URL (?cat=work) shows only Jobs & careers', await kp.evaluate(() => [...document.querySelectorAll('.tgroup .tcard:not([hidden])')].every(c => c.dataset.cat === 'work') && document.getElementById('results').textContent.includes('2 of')), await kp.textContent('#results'));
  await kp.fill('#q', 'film'); await kp.click('[data-filter="all"]'); await kp.waitForTimeout(400);
  check('Search "film" finds Short Film Fest', await kp.evaluate(() => [...document.querySelectorAll('.tgroup .tcard:not([hidden]) .tcard__title')].some(t => /Film/.test(t.textContent))), await kp.textContent('#results'));
  await kp.goto(BASE + '/contact/', { waitUntil: 'networkidle' });
  await kp.click('#contact-form button[type=submit]');
  check('Empty contact form shows error summary with focus', await kp.evaluate(() => document.activeElement.id === 'form-errors' && document.querySelectorAll('[aria-invalid=true]').length === 3));
  await kctx.close();
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await mctx.newPage();
  await mp.goto(BASE + '/', { waitUntil: 'networkidle' });
  await mp.focus('.menu-btn'); await mp.keyboard.press('Enter'); await mp.waitForTimeout(350);
  check('Mobile menu opens with focus inside', await mp.evaluate(() => document.getElementById('site-nav').classList.contains('is-open') && !!document.activeElement.closest('#site-nav')));
  await mp.keyboard.press('Escape'); await mp.waitForTimeout(350);
  check('Escape closes mobile menu and returns focus', await mp.evaluate(() => !document.getElementById('site-nav').classList.contains('is-open') && document.activeElement.classList.contains('menu-btn')));
  await mctx.close();

  // Links
  for (const h of hrefs) {
    const r = await fetch(BASE + h).catch(() => ({ status: 0 }));
    if (r.status !== 200) report.links.push({ href: h, status: r.status });
  }
  await browser.close();

  fs.mkdirSync(path.join(__dirname, 'reports'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'reports', 'qa-report.json'), JSON.stringify(report, null, 2));
  const byRule = {};
  report.axe.forEach(v => { const k = `${v.id} (${v.impact})`; byRule[k] = byRule[k] || { pages: new Set(), help: v.help, ex: v.targets[0] }; byRule[k].pages.add(v.page + ' [' + v.viewport + ']'); });
  console.log(`Pages: ${PAGES.length} × 2 viewports`);
  console.log(`axe violations: ${report.axe.length}`); Object.entries(byRule).forEach(([k, v]) => console.log(`  - ${k}: ${v.help} — ${v.pages.size} page-views, e.g. ${[...v.pages][0]} → ${v.ex}`));
  console.log(`Reflow failures @320px: ${report.reflow.length}`); report.reflow.slice(0, 5).forEach(r => console.log('  - ' + r.page + ' ' + JSON.stringify(r.off)));
  console.log(`Hygiene issues: ${report.hygiene.length}`); report.hygiene.slice(0, 8).forEach(r => console.log('  - ' + r.page + ': ' + r.issues.join(', ')));
  console.log(`Keyboard checks: ${report.keyboard.filter(k => k.ok).length}/${report.keyboard.length} passed`); report.keyboard.filter(k => !k.ok).forEach(k => console.log('  ✗ ' + k.name + ' ' + k.detail));
  console.log(`Broken internal links: ${report.links.length}`); report.links.forEach(l => console.log('  - ' + l.href + ' ' + l.status));
})();
