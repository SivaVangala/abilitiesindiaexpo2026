/* VERSION B — page audit fixes (28 Oct 2026). Adds sections that were missing, using verified facts only:
   Visitors + Exhibitors: questions & answers and a help band · About: mission and organiser · Contact: who to contact
   Venue: no day count (dates still being confirmed) · Registration category pages: a photo in the register box. */
module.exports = function pagesB4(L, pages) {
  const { SITE, icon, img, flag, esc, tel, TICKETS, EXPERIENCES } = L;
  const FAQ = require('../content/faq');
  const get = (p) => pages.find(x => x.path === p);
  const a = SITE.contact.address;
  const helpBand = (title, line) => `<section class="sec sec--tight"><div class="wrap"><div class="pol-help">
    <div><h2>${title}</h2><p>${line}</p></div>
    <div class="pol-help__btns"><a class="btn btn--red" href="tel:${tel}">${icon('phone')} ${SITE.contact.phone}</a><a class="btn btn--white" href="https://wa.me/${SITE.contact.whatsapp}">${icon('message-circle')} WhatsApp</a><a class="btn btn--white" href="mailto:${SITE.contact.emails[0]}">${icon('mail')} Email us</a></div>
  </div></div></section>`;
  const qa = (title, items, tint) => `<section class="sec${tint ? ' sec--lilac' : ''}" aria-labelledby="qa-h"><div class="wrap faq-wrap">
    <div><p class="kicker">Questions</p><h2 id="qa-h">${title}</h2><p><a class="btn btn--line btn--sm" href="/faq/">All FAQs ${icon('arrow-right')}</a></p></div>
    <div class="faq faq--cards">${items.map(it => `<details><summary>${esc(it.q)}${icon('plus', 'faq__ic')}</summary><div class="faq__a"><p>${esc(it.a)}${it.verify ? ' ' + flag('Organiser to confirm') : ''}</p></div></details>`).join('')}</div>
  </div></section>`;
  const group = (name) => (FAQ.find(g => g.group === name) || { items: [] }).items;
  const insertBefore = (page, marker, html) => { const i = page.body.lastIndexOf(marker); page.body = i > -1 ? page.body.slice(0, i) + html + page.body.slice(i) : page.body + html; };

  /* Visitors: questions + help */
  const v = get('/visitors/');
  if (v) v.body += qa('Before you visit', [group('The event')[0], group('The event')[1], group('Registration and tickets')[2], group('Accessibility and support')[0], group('Accessibility and support')[2]].filter(Boolean), true)
    + helpBand('Planning your visit?', 'Tell us what you need — we will help you plan the day.');

  /* Exhibitors: questions + help */
  const ex = get('/exhibitors/');
  if (ex) ex.body += qa('Exhibitor questions', group('Exhibitors and partners'), true)
    + helpBand('Talk to us about a stall', 'Ask about space, location and packages.');

  /* About: mission and organiser */
  const ab = get('/about/');
  if (ab) insertBefore(ab, '<section class="sec sec--lilac" aria-labelledby="tl-h">', `<section class="sec sec--peach" aria-labelledby="mi-h"><div class="wrap">
  <div class="sec-head sec-head--center"><div><p class="kicker">Why we exist</p><h2 id="mi-h">Our mission</h2></div></div>
  <ul class="khl">
    <li class="t-red"><span class="khl__ic">${icon('target')}</span><h3>Mission</h3><p>Empowering people with disabilities and elderly people — taking them out of an underprivileged, distressed life and helping them start a new one.</p></li>
    <li class="t-purple"><span class="khl__ic">${icon('eye')}</span><h3>Vision</h3><p>An India where people with disabilities join the mainstream of society and live self-sufficient lives.</p></li>
    <li class="t-teal"><span class="khl__ic">${icon('building-2')}</span><h3>Organiser</h3><p>${SITE.organiser.name}, ${a.city}, ${a.region}. <a href="${SITE.organiser.url}" target="_blank" rel="noopener">walshal.com</a></p></li>
  </ul></div></section>
`);

  /* Contact: who to contact for what */
  const ct = get('/contact/');
  if (ct) ct.body = ct.body.replace('<section class="sec"><div class="wrap contact">', `<section class="sec sec--lilac" aria-labelledby="who-h"><div class="wrap">
  <div class="sec-head sec-head--center"><div><p class="kicker">Who to contact</p><h2 id="who-h">We can help with</h2></div></div>
  <ul class="khl">
    <li class="t-red"><span class="khl__ic">${icon('ticket')}</span><h3>Visiting</h3><p>Registration, timings and directions.</p></li>
    <li class="t-purple"><span class="khl__ic">${icon('store')}</span><h3>Exhibiting</h3><p>Stalls, business meets and the MSME grant.</p></li>
    <li class="t-teal"><span class="khl__ic">${icon('accessibility')}</span><h3>Access support</h3><p>Sign language, personal care and assistance.</p></li>
    <li class="t-amber"><span class="khl__ic">${icon('megaphone')}</span><h3>Sponsors & media</h3><p>Partnerships, interviews and press.</p></li>
  </ul></div></section>
<section class="sec"><div class="wrap contact">`);

  /* Venue: avoid stating a day count while the dates are being confirmed */
  const vn = get('/venue/');
  if (vn) vn.body = vn.body.replace('Three days at KTPO, Bengaluru.', 'See you at KTPO, Bengaluru.');

  /* Registration category pages: add a photo to the register box */
  const fallback = { visit: 'gallery-9.jpg', business: 'Trade-Show.webp', work: 'job-fair.jpg', stage: 'cult-hero.jpg', awards: 'award-memento-1.png' };
  TICKETS.forEach(tk => {
    const pg = get(`/programs/${tk.slug}/`); if (!pg) return;
    const exp = EXPERIENCES.find(e => e.tickets && e.tickets[0] === tk.slug);
    const f = tk.image || (exp && exp.image) || fallback[tk.category];
    if (f) pg.body = pg.body.replace('<aside class="regbox" id="register" aria-labelledby="reg-h">', `<aside class="regbox" id="register" aria-labelledby="reg-h"><figure class="regbox__img">${img(f, '')}</figure>`);
  });
};
