/* Lighthouse (mobile, simulated throttling) on key templates. Requires the dist server on :5310. Writes qa/reports/lighthouse-*.json */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const BASE = process.env.QA_BASE || 'http://localhost:5310';
const PAGES = ['/', '/programs/', '/programs/visitor/', '/expo/assistive-technology-fest/', '/accessibility/', '/contact/'];
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const outDir = path.join(__dirname, 'reports');
fs.mkdirSync(outDir, { recursive: true });
const rows = [];
for (const p of PAGES) {
  const out = path.join(outDir, 'lighthouse-' + (p.replace(/\//g, '_') || 'home') + '.json');
  execFileSync(process.execPath, [require.resolve('lighthouse/cli/index.js'), BASE + p, '--quiet', '--output=json', '--output-path=' + out,
    '--chrome-flags=--headless=new', '--only-categories=performance,accessibility,best-practices,seo'], { env: { ...process.env, CHROME_PATH: chrome }, stdio: 'ignore' });
  const r = JSON.parse(fs.readFileSync(out, 'utf8'));
  const s = (k) => Math.round(r.categories[k].score * 100);
  rows.push({ page: p, performance: s('performance'), accessibility: s('accessibility'), bestPractices: s('best-practices'), seo: s('seo'),
    LCP: r.audits['largest-contentful-paint'].displayValue, CLS: r.audits['cumulative-layout-shift'].displayValue, TBT: r.audits['total-blocking-time'].displayValue,
    failing: Object.values(r.audits).filter(a => a.score !== null && a.score < 0.9 && a.scoreDisplayMode === 'binary').map(a => a.id) });
}
fs.writeFileSync(path.join(outDir, 'lighthouse-summary.json'), JSON.stringify(rows, null, 2));
console.table(rows.map(({ failing, ...r }) => r));
rows.forEach(r => r.failing.length && console.log(r.page, 'failing:', r.failing.join(', ')));
