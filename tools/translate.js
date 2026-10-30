/*
 * Build-time machine translation with Google Cloud Translation (Basic v2 REST). Runs on the build machine only.
 * The API key is NEVER shipped to browsers. Visitor-typed text is never sent anywhere.
 *
 *   npm run build
 *   GOOGLE_TRANSLATE_API_KEY=... node tools/translate.js hi ml kn ta te
 *   then set `published: true` for those languages in i18n/languages.js and run npm run build again.
 *
 * - Translates each page's <main> as HTML (tags preserved). Elements marked translate="no" (proper names,
 *   venue, organiser, Tickets99) are left untouched by the API.
 * - Cache: i18n/content/<lang>/<page>.json  { sourceHash, html, machine: true }. Only changed pages are re-sent.
 * - Organiser-approved text: i18n/overrides/<lang>/<page>.html replaces the machine output for that page.
 * - A language is indexed (hreflang + no noindex) only when `reviewed: true` in i18n/languages.js.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.join(__dirname, '..');
const KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const langs = process.argv.slice(2);
const pageKey = (p) => (p === '/' ? 'index' : p.replace(/^\/|\/$/g, '').replace(/\//g, '__').replace(/\.html$/, ''));
const mainOf = (html) => (html.match(/<main id="main" tabindex="-1">([\s\S]*)<\/main>/) || [])[1] || '';

async function translateHtml(html, target) {
  // v2 accepts up to ~30k chars per request; split on section boundaries
  const parts = html.split(/(?=<section)/);
  const chunks = []; let cur = '';
  for (const p of parts) { if ((cur + p).length > 25000 && cur) { chunks.push(cur); cur = ''; } cur += p; }
  if (cur) chunks.push(cur);
  const out = [];
  for (const c of chunks) {
    const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(KEY)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: c, source: 'en', target, format: 'html' }),
    });
    if (!res.ok) throw new Error(`Translation API ${res.status}: ${await res.text()}`);
    out.push((await res.json()).data.translations[0].translatedText);
  }
  return out.join('');
}

(async () => {
  if (!KEY) { console.error('GOOGLE_TRANSLATE_API_KEY not set. Nothing translated.'); process.exit(1); }
  if (!langs.length) { console.error('Usage: node tools/translate.js hi ml kn ta te'); process.exit(1); }
  const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist', 'pages.json'), 'utf8')).filter(p => p.path !== '/404.html' && p.path !== '/register/');
  for (const lang of langs) {
    const dir = path.join(ROOT, 'i18n', 'content', lang);
    fs.mkdirSync(dir, { recursive: true });
    let sent = 0;
    for (const p of pages) {
      const file = p.path.endsWith('.html') ? path.join(ROOT, 'dist', p.path) : path.join(ROOT, 'dist', p.path, 'index.html');
      const src = mainOf(fs.readFileSync(file, 'utf8'));
      const hash = crypto.createHash('sha256').update(src).digest('hex').slice(0, 16);
      const cacheFile = path.join(dir, pageKey(p.path) + '.json');
      if (fs.existsSync(cacheFile) && JSON.parse(fs.readFileSync(cacheFile, 'utf8')).sourceHash === hash) continue;
      const html = await translateHtml(src, lang);
      fs.writeFileSync(cacheFile, JSON.stringify({ sourceHash: hash, machine: true, translatedAt: new Date().toISOString(), html }, null, 1));
      sent++;
    }
    console.log(`${lang}: ${sent} page(s) translated, ${pages.length - sent} unchanged`);
  }
})().catch(e => { console.error(e.message); process.exit(1); });
