/* Tabs through a page and reports any focused element hidden behind the sticky header or mobile bar. */
const { chromium } = require('playwright-core');
const BASE = process.env.QA_BASE || 'http://localhost:5311';
(async () => {
  const b = await chromium.launch({ channel: 'chrome' }); let bad = 0, n = 0;
  for (const [w, h] of [[1280, 800], [390, 760]]) for (const u of ['/', '/programs/', '/programs/visitor/']) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(BASE + u, { waitUntil: 'networkidle' });
    for (let i = 0; i < 70; i++) {
      await p.keyboard.press('Tab'); n++;
      const r = await p.evaluate(() => {
        const a = document.activeElement; if (!a || a === document.body || a.closest('.hdr, .mbar, .a11y, .skip')) return null;
        const b = a.getBoundingClientRect(), hd = document.querySelector('.hdr').getBoundingClientRect(), mb = document.querySelector('.mbar');
        const mbTop = mb && getComputedStyle(mb).display !== 'none' ? mb.getBoundingClientRect().top : innerHeight;
        return (b.bottom <= hd.bottom + 1 || b.top >= mbTop - 1) ? a.outerHTML.slice(0, 80) : null;
      });
      if (r) { bad++; console.log(`${w}px ${u}: obscured -> ${r}`); }
    }
    await p.close();
  }
  console.log(`${n} focus steps checked, ${bad} fully obscured`); await b.close();
})();
