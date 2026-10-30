/* Renders assets/img/og-default.png (1200×630 social preview) from HTML using local Chrome. node tools/make-og.js */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright-core');
const img = (f) => 'data:image/' + (f.endsWith('.png') ? 'png' : 'jpeg') + ';base64,' + fs.readFileSync(path.join(__dirname, '..', 'assets', 'img', f)).toString('base64');
const html = `<!doctype html><html><head><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700..800&family=Atkinson+Hyperlegible:wght@700&display=swap" rel="stylesheet">
<style>body{margin:0;width:1200px;height:630px;background:#fff;font-family:'Atkinson Hyperlegible',sans-serif;color:#16132a;position:relative;overflow:hidden}
.l{position:absolute;left:72px;top:64px;height:92px}.h{position:absolute;left:72px;top:210px;font:800 76px/1 'Bricolage Grotesque';letter-spacing:-2px;width:640px}
.h em{font-style:normal;color:#b8231b}.m{position:absolute;left:72px;bottom:70px;font-size:30px;font-weight:700}.m span{color:#4f4185}
.p{position:absolute;right:90px;top:150px;width:360px;height:360px;border-radius:50%;overflow:hidden;background-size:cover;background-position:center}
.d{position:absolute;right:205px;top:40px;width:130px;height:130px;border-radius:50%;background:#64559c}.r{position:absolute;right:0;top:0;width:140px;height:140px;background:#e5352b;border-radius:0 0 0 100%}
svg{position:absolute;right:40px;top:250px}</style></head><body>
<img class="l" src="${img('logo.png')}"><div class="h">Every ability has a <em>place</em> here.</div>
<div class="m">20–22 Dec 2026 · <span>KTPO, Bengaluru</span></div><div class="r"></div><div class="d"></div>
<div class="p" style="background-image:url(${img('elderly-services-6.jpg')})"></div>
<svg width="460" height="330" viewBox="0 0 100 72"><path d="M5 10 C 5 60, 72 84, 95 3" fill="none" stroke="#3fa7a8" stroke-width="6" stroke-linecap="round"/></svg></body></html>`;
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(html, { waitUntil: 'networkidle' });
  await p.screenshot({ path: path.join(__dirname, '..', 'assets', 'img', 'og-default.png') });
  await b.close();
  console.log('og-default.png written');
})();
