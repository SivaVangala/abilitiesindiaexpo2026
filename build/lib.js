/* Shared helpers, layout and components for the static build. */
const fs = require('fs');
const path = require('path');
const SITE = require('../content/site');
const { CATEGORIES, TICKETS } = require('../content/tickets');
const EXPERIENCES = require('../content/experiences');
const LANGS = require('../i18n/languages');
const STRINGS = { en: require('../i18n/en.json') };

const ROOT = path.join(__dirname, '..');
// cache-busting: new id every build so browsers always load the latest CSS/JS
const BUILD_ID = Date.now().toString(36);

/* ---------- primitives ---------- */
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/* Icons: Lucide (ISC licence) rendered to inline SVG at build time — no icon JavaScript ships to the browser. */
const LUCIDE = require('./vendor/lucide.min.js');
const pascal = (n) => n.replace(/(^|-)([a-z0-9])/g, (m, a, c) => c.toUpperCase());
const attrs = (o) => Object.entries(o).map(([k, v]) => `${k}="${v}"`).join(' ');
function icon(name, cls = '') {
  if (name === 'universal-access') return `<svg class="lucide lucide-universal-access${cls ? ' ' + cls : ''}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="6.6" r="1.4" fill="currentColor" stroke="none"/><path d="M6.5 9.2 12 10.2l5.5-1"/><path d="M12 10.2v3.6"/><path d="m9.4 18.2 2.6-4.4 2.6 4.4"/></svg>`;
  const node = LUCIDE[pascal(name)];
  if (!node) throw new Error('Unknown icon: ' + name);
  const kids = node[2].map(([tag, a]) => `<${tag} ${attrs(a)}/>`).join('');
  return `<svg class="lucide lucide-${name}${cls ? ' ' + cls : ''}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${kids}</svg>`;
}
const t = (key, lang = 'en') => (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key;
const tel = SITE.contact.phone.replace(/\s/g, '');
const flag = () => ''; // review notes are kept in docs, never shown on pages
const nt = (s) => `<span translate="no">${s}</span>`; // proper names: never machine-translate

/* Intrinsic image size (PNG / JPEG / WebP) so every <img> gets width/height — prevents layout shift. */
const sizeCache = {};
function imgSize(file) {
  if (sizeCache[file]) return sizeCache[file];
  const b = fs.readFileSync(path.join(ROOT, 'assets', 'img', file));
  let w = 0, h = 0;
  if (b[0] === 0x89) { w = b.readUInt32BE(16); h = b.readUInt32BE(20); }
  else if (b[0] === 0xff) {
    let i = 2;
    while (i < b.length) { const m = b[i + 1], len = b.readUInt16BE(i + 2); if (m >= 0xc0 && m <= 0xc3) { h = b.readUInt16BE(i + 5); w = b.readUInt16BE(i + 7); break; } i += 2 + len; }
  } else if (b.toString('ascii', 8, 12) === 'WEBP') {
    const k = b.toString('ascii', 12, 16);
    if (k === 'VP8X') { w = 1 + b.readUIntLE(24, 3); h = 1 + b.readUIntLE(27, 3); }
    else if (k === 'VP8 ') { w = b.readUInt16LE(26) & 0x3fff; h = b.readUInt16LE(28) & 0x3fff; }
    else if (k === 'VP8L') { const v = b.readUInt32LE(21); w = (v & 0x3fff) + 1; h = ((v >> 14) & 0x3fff) + 1; }
  }
  return (sizeCache[file] = { w, h });
}
function img(file, alt, { cls = '', eager = false, sizes = '' } = {}) {
  const { w, h } = imgSize(file);
  return `<img src="/assets/img/${file}" alt="${esc(alt)}" width="${w}" height="${h}"${cls ? ` class="${cls}"` : ''}${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}${sizes ? ` sizes="${sizes}"` : ''}>`;
}

/* ---------- Tickets99 handoff ---------- */
const T99 = SITE.tickets99;
const catOf = (id) => CATEGORIES.find(c => c.id === id);
const ticketBySlug = (s) => TICKETS.find(x => x.slug === s);
function bookingUrl(tk) {
  if (!T99.buyBase || !tk.ti) return null;
  return `${T99.buyBase}?ti=${encodeURIComponent(tk.ti)}&autoselect=1`;
}
function registerAction(tk, { big = false } = {}) {
  const url = bookingUrl(tk);
  const cls = `btn btn--red${big ? '' : ' btn--sm'}`;
  if (tk.soldOut) return `<span class="status status--closed">${icon('circle-slash')} Sold out</span>`;
  if (!url) return `<a class="${cls}" href="/programs/${tk.slug}/#register" aria-describedby="st-${tk.slug}">Registration opening soon ${icon('arrow-right')}</a><span class="sr-only" id="st-${tk.slug}">Online registration for ${esc(tk.name)} is not open yet. See how to register your interest.</span>`;
  if (T99.mode === 'embed') return `<a class="${cls}" href="/register/?t=${tk.slug}">Register — ${esc(tk.name)} ${icon('arrow-right')}</a>`;
  const free = tk.priceType === 'free' || tk.price === 0;
  return `<a class="${cls}" href="${esc(url)}" rel="noopener">${free ? 'Register free' : 'Register'} <span class="sr-only">for ${esc(tk.name)} on Tickets99 (opens the registration site)</span>${icon('external-link')}</a>`;
}
function priceBadge(tk) {
  if (tk.priceType === 'free' || tk.price === 0) return `<span class="badge badge--free">${icon('circle-check')} Free</span>`;
  if (tk.priceType === 'paid' && tk.price != null) return `<span class="badge badge--paid">${icon('indian-rupee')} Paid · ₹${Number(tk.price).toLocaleString('en-IN')}</span>`;
  return `<span class="badge badge--tbc">${icon('ticket')} Price shown at registration</span>`;
}

/* ---------- components ---------- */
function ticketCard(tk, headingLevel = 3) {
  const c = catOf(tk.category);
  const H = `h${headingLevel}`;
  return `<article class="tcard ${c.tone}" data-cat="${tk.category}" data-search="${esc((tk.name + ' ' + tk.summary + ' ' + tk.whoFor.join(' ') + ' ' + c.label).toLowerCase())}">
  <div class="tcard__top">${icon(tk.icon, 'tcard__ic')}<span class="tcard__cat">${c.label}</span></div>
  <${H} class="tcard__title"><a href="/programs/${tk.slug}/">${esc(tk.name)}</a></${H}>
  <p>${esc(tk.summary)}</p>
  <div class="tcard__meta">${priceBadge(tk)}<span class="badge">${icon('calendar-days')} 20–22 Dec 2026</span></div>
  <div class="tcard__actions">${registerAction(tk)}<a class="more" href="/programs/${tk.slug}/">Details<span class="sr-only"> about ${esc(tk.name)}</span></a></div>
</article>`;
}

function crumbs(list) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${list.map(([l, h], i) => i === list.length - 1 ? `<li aria-current="page">${esc(l)}</li>` : `<li><a href="${h}">${esc(l)}</a></li>`).join('')}</ol></nav>`;
}

const PHERO_ART = `<svg class="phero__art" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
  <circle cx="200" cy="70" r="58" fill="var(--purple)"/>
  <path d="M52 168 Q200 420 348 168" fill="none" stroke="var(--teal)" stroke-width="46" stroke-linecap="round"/>
  <path d="M400 400 L400 270 A130 130 0 0 0 270 400 Z" fill="var(--red)"/>
</svg>`;

function pageHero({ kicker, title, lead, trail, extra = '' }) {
  return `<section class="phero"><!--PHERO_PIC-->
  ${PHERO_ART}
  <div class="wrap">
    ${crumbs(trail)}
    ${kicker ? `<p class="kicker"><span>${kicker}</span></p>` : ''}
    <h1>${title}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
    ${extra}
    ${listenBtn()}
  </div>
</section>`;
}
const listenBtn = () => `<div class="listen-ctl" data-speech hidden>
  <button class="listen" type="button" data-speak="main" aria-pressed="false"><span class="ring">${icon('volume-2')}</span><span class="speak-label">Listen to this page</span></button>
  <button class="icon-btn speech-pause" type="button" data-speak-pause hidden>${icon('pause')}<span class="speak-pause-label">Pause</span></button>
</div>`;

function faqList(groups, headingLevel = 2) {
  const H = `h${headingLevel}`;
  return groups.map(g => `<${H} class="faq__group">${esc(g.group)}</${H}>
<div class="faq">${g.items.map(it => `
  <details>
    <summary>${esc(it.q)}${icon('plus', 'faq__ic')}</summary>
    <div class="faq__a"><p>${esc(it.a)}${it.verify ? ' ' + flag('Organiser to confirm') : ''}</p>${it.link ? `<p><a href="${it.link[1]}">${esc(it.link[0])}</a></p>` : ''}</div>
  </details>`).join('')}
</div>`).join('\n');
}

function ctaBand(title, text, href, label) {
  return `<section class="sec sec--tight"><div class="wrap"><div class="cta-band"><div><h2>${title}</h2>${text ? `<p>${text}</p>` : ''}</div><a class="btn" href="${href}">${label} ${icon('arrow-right')}</a></div></div></section>`;
}

/* ---------- navigation (new IA) ---------- */
// Menu = live-site menu + the pages the master prompt adds (Programs & Registration, Sponsors, Accessibility, FAQs)
const NAV = [
  { label: 'Abilities India Expo 2nd Edition', id: 'mega-expo', mega: true },
  { label: 'Programs & Registration', href: '/programs/' },
  { label: 'Elderly Services', href: '/expo/elderly-services/' },
  { label: 'Exhibitors', href: '/exhibitors/' },
  { label: 'Visitors', href: '/visitors/' },
  { label: 'Accessibility', href: '/accessibility/' },
  { label: 'About Us', id: 'menu-about', items: [['About Us', '/about/'], ['Ambassadors', '/ambassadors/'], ['Abilities International Expo', '/international-expo/'], ['FAQs', '/faq/']] },
  { label: 'Contact', href: '/contact/' },
];

function header(current) {
  const isCur = (h) => current === h || (h !== '/' && current.startsWith(h));
  const groups = {};
  EXPERIENCES.forEach(e => (groups[e.group] = groups[e.group] || []).push(e));
  const dots = { Fests: 'var(--red)', Stage: 'var(--red)', Opportunities: 'var(--purple)', Learn: 'var(--teal)', Care: 'var(--teal)' };
  // Dropdown in the Version A style: intro on the left, one clean list of all items with small icons
  const EDITION = [
    ['KTPO International Exhibition', '/venue/', 'map-pin'], ['Shopping Fest', '/expo/shopping-fest/', 'shopping-bag'], ['Accessible Tourism Fest', '/expo/accessible-tourism-fest/', 'plane'],
    ['Assistive Technology Fest', '/expo/assistive-technology-fest/', 'cpu'], ['Job Fair', '/expo/job-fair/', 'briefcase'], ['Seminars', '/expo/seminars/', 'presentation'],
    ['Workshops', '/expo/workshops/', 'wrench'], ['Medical Tourism Fest', '/expo/medical-tourism-fest/', 'stethoscope'], ['Cultural Fest', '/expo/cultural-fest/', 'music'],
    ['Short Film Fest', '/expo/short-film-fest/', 'clapperboard'], ['Matrimonial Meet', '/expo/matrimonial-meet/', 'heart'], ['Gallery', '/gallery/', 'image'],
    ['Business Meets', '/expo/business-meets/', 'handshake'], ['Media Coverage', '/media/', 'newspaper'], ['Services', '/expo/services/', 'hand-helping'],
    ['Awards', '/expo/awards/', 'award'], ['MSME Stall Grant', '/msme-stall-grant/', 'badge-indian-rupee'],
  ];
  const mega = `<div class="mega" id="mega-expo" hidden><div class="wrap mega__grid">
      <div class="mega__intro"><b>Abilities India Expo 2026</b><p>${SITE.event.datesLabel} · ${SITE.event.venue.short}. Both B2B and B2C.</p><a class="btn btn--sm" href="/expo/">See all programs ${icon('arrow-right')}</a></div>
      <ul class="mega__list">${EDITION.map(([l, h, ic]) => `<li><a href="${h}"${isCur(h) ? ' aria-current="page"' : ''}>${icon(ic)}<span>${l}</span></a></li>`).join('')}</ul>
    </div></div>`;
  const items = NAV.map(n => {
    if (n.mega) return `<li><button class="nav__toggle" type="button" aria-expanded="false" aria-controls="${n.id}">${n.label} ${icon('chevron-down')}</button>${mega}</li>`;
    if (n.items) return `<li class="nav__dd"><button class="nav__toggle" type="button" aria-expanded="false" aria-controls="${n.id}">${n.label} ${icon('chevron-down')}</button><ul class="dd" id="${n.id}" hidden>${n.items.map(([l, h]) => `<li><a href="${h}"${isCur(h) ? ' aria-current="page"' : ''}>${l}</a></li>`).join('')}</ul></li>`;
    return `<li><a href="${n.href}"${isCur(n.href) ? ' aria-current="page"' : ''}>${n.label}</a></li>`;
  }).join('\n        ');
  return `
<a class="skip" href="#main">${t('skip')}</a>
<header class="hdr hdr--v8 hdr--v9 hdr--a">
  <div class="hdr__top">
    <div class="wrap">
      <p class="hdr__when">${icon('calendar-days')}<span>${SITE.event.datesLabel}</span><span class="hdr__dot" aria-hidden="true"></span>${icon('map-pin')}<span>${SITE.event.venue.short}</span></p>
      <div class="hdr__info">
        <a href="tel:${tel}">${icon('phone')}${SITE.contact.phone}</a>
        <a href="mailto:${SITE.contact.emails[0]}">${icon('mail')}${SITE.contact.emails[0]}</a>
      </div>
      ${socialLinks('social--top')}
    </div>
  </div>
  <div class="wrap hdr__main">
    <a class="brand" href="/"><img src="/assets/img/logo.png" alt="${SITE.name} — home" width="320" height="120"></a>
    <button class="icon-btn menu-btn" type="button" aria-controls="site-nav" aria-expanded="false">${icon('menu')}<span>${t('menu')}</span></button>
    <nav class="nav" id="site-nav" aria-label="Main">
      <button class="icon-btn nav__close" type="button">${icon('x')}<span class="sr-only">Close menu</span></button>
      <ul>
        ${items}
      </ul>
      <div class="nav__mobile-cta">
        <a class="btn btn--red" href="/programs/">${t('register')} ${icon('arrow-right')}</a>
        <a class="btn btn--line" href="tel:${tel}">${icon('phone')} Call ${SITE.contact.phone}</a>
      </div>
    </nav>
    <a class="btn btn--red btn--sm hdr__reg hdr__reg--main" href="/programs/">${t('register')}</a>
  </div>
</header>
<div class="scrim" hidden></div>
${a11yPanel()}`;
}

/* Social profiles in the header top bar (Version A layout) */
function socialLinks(cls = '') {
  if (!SITE.social || !SITE.social.length) return '';
  return `<ul class="social ${cls}">${SITE.social.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${icon(s.icon)}<span class="sr-only" translate="no">${s.name} (opens in a new tab)</span></a></li>`).join('')}</ul>`;
}

function langMenu(cur, p = '/') {
  return `<div class="lang">
        <button class="icon-btn lang__btn" type="button" aria-expanded="false" aria-controls="lang-list">${icon('languages')}<span class="lang__cur">${LANGS.find(l => l.code === cur).native}</span><span class="sr-only"> — change language</span></button>
        <ul class="lang__list" id="lang-list" hidden>
          ${langButtons()}
        </ul>
      </div>`;
}
/* VERSION B: every language is selectable (demo uses on-page translation; production uses reviewed pages — see README) */
const langButtons = () => LANGS.map(l => `<li><button type="button" class="langopt" data-lang="${l.code}" lang="${l.code}" aria-pressed="${l.code === 'en'}">${l.native}<span>${l.english}</span></button></li>`).join('\n          ');

/* VERSION B: right-side sticky dock (Accessibility Tools · Language · Audio) + back to top */
function dock() {
  return `
<div class="dock" role="region" aria-label="Accessibility tools, language and audio">
  <button class="dock__btn dock__btn--a11y" type="button" data-a11y-open aria-controls="a11y" aria-expanded="false">${icon('universal-access')}<span class="dock__tip">Accessibility Tools</span></button>
  <div class="dock__lang">
    <button class="dock__btn dock__btn--lang lang__btn" type="button" aria-expanded="false" aria-controls="dock-lang">${icon('languages')}<span class="dock__tip">Change language</span></button>
    <ul class="lang__list dock__list" id="dock-lang" hidden>
      ${langButtons()}
    </ul>
  </div>
  <button class="dock__btn dock__btn--audio" type="button" data-speak="main" aria-pressed="false">${icon('volume-2')}<span class="dock__tip speak-label">Listen to this page</span></button>
  <button class="dock__btn dock__btn--mic" type="button" data-voice aria-pressed="false" aria-expanded="false" aria-controls="voice-panel" hidden>${icon('mic')}<span class="dock__tip voice-label">Speak to the website</span></button>
  <button class="dock__btn dock__btn--pause" type="button" data-speak-pause hidden>${icon('pause')}<span class="dock__tip speak-pause-label">Pause</span></button>
</div>
<div class="vpanel" id="voice-panel" role="dialog" aria-labelledby="vp-h" hidden>
  <div class="vpanel__head"><h2 id="vp-h">${icon('mic')} Speak to the website</h2><button class="icon-btn" type="button" data-vclose>${icon('x')}<span class="sr-only">Close</span></button></div>
  <p class="vpanel__status" data-vstatus role="status" aria-live="polite">Listening… speak now.</p>
  <p class="vpanel__heard" data-vheard></p>
  <p class="vpanel__tip">Try: “Open exhibitors”, “Make it black and white”, “Bigger text”, “High contrast”, “Change language to Hindi”, “Help”</p>
  <form class="vpanel__form"><label for="vp-in">Prefer typing?</label><div><input id="vp-in" type="text" autocomplete="off" placeholder="e.g. register"><button class="btn btn--sm" type="submit">Go</button></div></form>
</div>
<button class="totop" type="button" hidden>${icon('arrow-up')}<span class="sr-only">Back to top of page</span></button>
<div id="gt-el" hidden></div>`;
}

function a11yPanel() {
  const tgl = (key, ic, label, hint) => `<button class="tgl" type="button" data-toggle="${key}" aria-pressed="false"><span>${icon(ic)}<span>${label}${hint ? `<small>${hint}</small>` : ''}</span></span><i class="sw" aria-hidden="true"></i></button>`;
  return `
<div class="a11y" id="a11y" role="dialog" aria-modal="true" aria-labelledby="a11y-title" hidden>
  <div class="a11y__head">
    <h2 id="a11y-title">Accessibility Tools</h2>
    <button class="icon-btn" type="button" data-a11y-close>${icon('x')}<span class="sr-only">Close Accessibility Tools</span></button>
  </div>
  <p>These options only change this website, on this device. Your browser and screen reader settings always come first. Shortcut: <kbd>Alt</kbd> + <kbd>A</kbd>.</p>
  <div class="a11y__group" role="group" aria-labelledby="lg">
    <p class="a11y__label" id="lg">Language</p>
    <ul class="langgrid">
      ${langButtons()}
    </ul>
  </div>
  <div class="a11y__group" role="group" aria-labelledby="cv">
    <p class="a11y__label" id="cv">Colour vision</p>
    <p class="a11y__note">Everything here already uses words and icons, not colour alone. These options change the colours to suit your eyes.</p>
    <div class="cvset">
      <button type="button" data-cv="" aria-pressed="true"><span class="sw4" aria-hidden="true"><i class="c1"></i><i class="c2"></i><i class="c3"></i></span><span>Standard colours</span></button>
      <button type="button" data-cv="rg" aria-pressed="false"><span class="sw4 sw4--rg" aria-hidden="true"><i class="c1"></i><i class="c2"></i><i class="c3"></i></span><span>Red–green safe<small>Protanopia · Deuteranopia</small></span></button>
      <button type="button" data-cv="by" aria-pressed="false"><span class="sw4 sw4--by" aria-hidden="true"><i class="c1"></i><i class="c2"></i><i class="c3"></i></span><span>Blue–yellow safe<small>Tritanopia</small></span></button>
      <button type="button" data-cv="mono" aria-pressed="false"><span class="sw4 sw4--mono" aria-hidden="true"><i class="c1"></i><i class="c2"></i><i class="c3"></i></span><span>Black &amp; white<small>Monochromacy (greyscale)</small></span></button>
    </div>
  </div>
  <div class="a11y__group" role="group" aria-labelledby="ts">
    <p class="a11y__label" id="ts">Text size</p>
    <div class="seg">
      <button type="button" data-text="0" aria-pressed="true">A<span class="sr-only"> standard</span></button>
      <button type="button" data-text="1" aria-pressed="false" style="font-size:1.1rem">A+<span class="sr-only"> large</span></button>
      <button type="button" data-text="2" aria-pressed="false" style="font-size:1.2rem">A++<span class="sr-only"> larger</span></button>
      <button type="button" data-text="3" aria-pressed="false" style="font-size:1.3rem">A+++<span class="sr-only"> largest</span></button>
    </div>
  </div>
  <div class="a11y__group" role="group" aria-labelledby="dr">
    <p class="a11y__label" id="dr">Display and reading</p>
    ${tgl('contrast', 'contrast', 'Higher contrast')}
    ${tgl('spacing', 'text', 'More line and letter spacing')}
    ${tgl('links', 'link-2', 'Underline all links')}
    ${tgl('simple', 'layout-list', 'Simplified reading view', 'Hides decorative graphics and animations')}
    ${tgl('motion', 'pause', 'Reduce motion')}
  </div>
  <div class="a11y__group" data-speech hidden>
    <p class="a11y__label">Listen</p>
    <p class="a11y__note">Uses your device’s built-in voice. It does not replace a screen reader.</p>
    <div class="a11y__foot">
      <button class="btn btn--sm" type="button" data-speak="main" aria-pressed="false">${icon('volume-2')}<span class="speak-label">Read this page aloud</span></button>
      <button class="btn btn--line btn--sm" type="button" data-speak-pause hidden>${icon('pause')}<span class="speak-pause-label">Pause</span></button>
    </div>
  </div>
  <div class="a11y__group a11y__foot">
    <button class="btn btn--line btn--sm" type="button" data-a11y-reset>${icon('rotate-ccw')} Reset all</button>
    <a class="btn btn--sm" href="/accessibility-statement/">Accessibility statement</a>
  </div>
</div>
<p class="sr-only" id="live" role="status" aria-live="polite"></p>
${dock()}`;
}

function footer() {
  /* VERSION B footer: logo (left) · navigation (middle) · Register (right) — then a coloured band:
     social icons under the logo · legal in the middle · phone and email under Register. */
  const cols = [
    ['Expo', [['Programs & Registration', '/programs/'], ['Explore the Expo', '/expo/'], ['Exhibitors', '/exhibitors/'], ['Visitors', '/visitors/']]],
    ['About', [['About Us', '/about/'], ['Ambassadors', '/ambassadors/'], ['International Expo 2027', '/international-expo/'], ['Gallery', '/gallery/']]],
    ['Help', [['Venue', '/venue/'], ['Accessibility', '/accessibility/'], ['FAQs', '/faq/'], ['Contact', '/contact/']]],
  ];
  return `
<footer class="ftr3">
  <div class="ftr3__main">
    <div class="wrap ftr3__top">
      <a class="ftr3__logo" href="/"><img src="/assets/img/logo.png" alt="${SITE.name} — home" width="320" height="120" loading="lazy"></a>
      <nav class="ftr3__nav" aria-label="Footer">
        ${cols.map(([h, links]) => `<div><h2>${h}</h2><ul>${links.map(([l, u]) => `<li><a href="${u}">${l}</a></li>`).join('')}</ul></div>`).join('')}
      </nav>
      <div class="ftr3__cta">
        <a class="btn btn--red btn--glow" href="/programs/">Register now ${icon('arrow-right')}</a>
      </div>
    </div>
  </div>
  <div class="ftr3__band">
    <div class="wrap ftr3__bottom">
      <ul class="ftr3__social" aria-label="Follow us">
        ${(SITE.social || []).map(x => `<li><a href="${x.url}" target="_blank" rel="noopener">${icon(x.icon)}<span class="sr-only">${x.name} (opens in a new tab)</span></a></li>`).join('')}
      </ul>
      <div class="ftr3__contact">
        <a href="tel:${tel}">${icon('phone')}${SITE.contact.phone}</a>
        <a href="mailto:${SITE.contact.emails[0]}">${icon('mail')}${SITE.contact.emails[0]}</a>
      </div>
    </div>
  </div>
  <p class="ftr3__copy">© 2026 ${SITE.name} · <a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a> · <a href="/refund/">Refund</a></p>
</footer>
<div class="mbar" role="region" aria-label="Quick actions">
  <a class="btn btn--red" href="/programs/">${t('register')}</a>
  <a class="icon-btn" href="tel:${tel}">${icon('phone')}<span class="sr-only">Call ${SITE.contact.phone}</span></a>
  <a class="icon-btn" href="https://wa.me/${SITE.contact.whatsapp}">${icon('message-circle')}<span class="sr-only">WhatsApp us</span></a>
</div>`;
}

/* ---------- document ---------- */
function orgLd() {
  const a = SITE.contact.address;
  return { '@type': 'Organization', '@id': SITE.baseUrl + '/#organiser', name: SITE.organiser.name, url: SITE.organiser.url,
    email: SITE.contact.emails[0], telephone: SITE.contact.phone,
    address: { '@type': 'PostalAddress', streetAddress: a.line, addressLocality: a.city, postalCode: a.postcode, addressRegion: a.region, addressCountry: a.country } };
}
function eventLd(extra = {}) {
  const v = SITE.event.venue;
  return { '@type': 'Event', '@id': SITE.baseUrl + '/#event', name: `${SITE.name} 2026 — ${SITE.edition}`,
    description: SITE.positioning, startDate: SITE.event.startDate, endDate: SITE.event.endDate,
    eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: v.name, address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressRegion: v.region, addressCountry: v.country } },
    image: [SITE.baseUrl + '/assets/img/og-default.png'], organizer: { '@id': SITE.baseUrl + '/#organiser' }, ...extra };
}
function breadcrumbLd(trail) {
  return { '@type': 'BreadcrumbList', itemListElement: trail.map(([n, h], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE.baseUrl + (h || '') })) };
}

const PAGE_PIC = {
  '/programs/': ['ai-registration.jpg', 'Illustration: a visitor in a wheelchair receiving her badge at an accessible registration counter', 1],
  '/exhibitors/': ['ai-exhibitors.jpg', 'Illustration: an exhibitor demonstrating a wheelchair and hearing device to visitors', 1],
  '/visitors/': ['ai-visitors.jpg', 'Illustration: families and visitors with disabilities walking through the expo hall', 1],
  '/about/': ['ai-awards.jpg', 'Illustration: an achiever in a wheelchair receiving a trophy on stage', 1],
  '/accessibility/': ['ai-access.jpg', 'Illustration: a volunteer using sign language with a visitor at the help desk', 1],
  '/contact/': ['ai-support.jpg', 'Illustration: a support desk team helping visitors', 1],
  '/faq/': ['ai-support.jpg', 'Illustration: a support desk team helping visitors', 1],
  '/ambassadors/': ['ambassador.jpg', 'Vaikom Vijayalakshmi', 0],
  '/expo/': ['gallery-9.jpg', 'Visitors in wheelchairs and families exploring the expo', 0],
  '/sponsors/': ['gallery-3.jpg', 'Visitors at an exhibitor stall', 0],
  '/international-expo/': ['pragati-maidan.webp', 'Aerial view of New Delhi', 0],
  '/gallery/': ['gallery-8.jpg', 'Visitors in wheelchairs at the expo', 0],
  '/media/': ['media-coverage.jpg', 'A reporter with a microphone', 0],
};
const FALLBACK_PICS = ['gallery-6.jpg', 'gallery-1.jpg', 'gallery-7.jpg', 'gallery-2.jpg', 'gallery-4.jpg', 'gallery-5.jpg'];
function heroPicFor(p) {
  if (PAGE_PIC[p]) return PAGE_PIC[p];
  const exp = EXPERIENCES.find(e => p === '/expo/' + e.slug + '/');
  if (exp && exp.image) return [exp.image, exp.imageAlt || '', 0];
  const tk = TICKETS.find(t => p === '/programs/' + t.slug + '/');
  if (tk && tk.image) return [tk.image, '', 0];
  let h = 0; for (const ch of p) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return [FALLBACK_PICS[h % FALLBACK_PICS.length], '', 0];
}
function layout({ path: p, title, description, body, trail, ld = [], noindex = false }) {
  if (body.includes('<!--PHERO_PIC-->')) { const [f, a, ai] = heroPicFor(p); body = body.replace('<section class="phero"><!--PHERO_PIC-->', `<section class="phero phero--pic phero--plain"><div class="phero__deco" aria-hidden="true"><span class="g1"></span><span class="g2"></span><span class="g3"></span><svg viewBox="0 0 400 400" focusable="false"><circle cx="200" cy="90" r="56" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="10"/><path d="M60 170 Q200 420 340 170" fill="none" stroke="rgba(63,167,168,.55)" stroke-width="30" stroke-linecap="round"/></svg></div>`); }
  const url = SITE.baseUrl + p;
  const graph = [orgLd(), ...ld];
  if (trail && trail.length > 1) graph.push(breadcrumbLd(trail.map(([n, h], i) => [n, i === trail.length - 1 ? p : h])));
  const published = LANGS.filter(l => l.published && l.reviewed);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
${published.length > 1 ? published.map(l => `<link rel="alternate" hreflang="${l.code}" href="${SITE.baseUrl}${l.code === 'en' ? '' : '/' + l.code}${p}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${url}">` : ''}
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE.baseUrl}/assets/img/og-default.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${SITE.name} 2026 — ${SITE.event.datesLabel}, ${SITE.event.venue.short}">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="/assets/img/favicon.png" type="image/png">
<link rel="preload" href="/assets/fonts/atkinson-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/bricolage-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css?v=${BUILD_ID}">
<script>(function(d){try{var s=localStorage;['contrast','spacing','links','simple','motion'].forEach(function(k){if(s.getItem('aie-'+k)==='1')d.setAttribute('data-a11y-'+k,'')});var t=s.getItem('aie-text');if(t)d.setAttribute('data-a11y-text',t);var c=s.getItem('aie-cv');if(c)d.setAttribute('data-cv',c)}catch(e){}d.classList.add('js')})(document.documentElement)</script>
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
</head>
<body class="dark-hero${p === "/" ? " is-home" : ""}">
${header(p)}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
<script src="/assets/js/site.js?v=${BUILD_ID}" defer></script>
</body>
</html>
`;
}

module.exports = { SITE, CATEGORIES, TICKETS, EXPERIENCES, LANGS, esc, icon, t, img, imgSize, flag, nt, tel,
  bookingUrl, registerAction, priceBadge, ticketCard, ticketBySlug, catOf, crumbs, pageHero, listenBtn, faqList, ctaBand, layout, eventLd, ROOT };
