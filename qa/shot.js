/* Screenshot helper: node qa/shot.js <path> <width> <outfile> [fullPage=1] */
const { chromium } = require('playwright-core');
(async () => {
  const [p = '/', w = '1440', out = 'shot.png', full = '1'] = process.argv.slice(2);
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: +w, height: +w < 600 ? 860 : 900 }, deviceScaleFactor: 1 });
  await page.goto((process.env.QA_BASE || 'http://localhost:5311') + p, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(500);
  await page.screenshot({ path: out, fullPage: full === '1' });
  await browser.close();
})();
