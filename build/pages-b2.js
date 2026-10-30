/* VERSION B — programme pages in the Knowledge Day layout, plus venue, MSME grant, media, gallery,
   international expo and terms. Every live-site page has a page here. */
module.exports = function pagesB2(L, pages) {
  const { SITE, EXPERIENCES, icon, img, flag, nt, esc, tel } = L;
  const HOME = ['Home', '/'];
  const ev = SITE.event;
  const TONES = ['t-red', 't-purple', 't-teal', 't-amber', 't-blue', 't-green'];

  const ribbon = (third) => `<section class="ribbon" aria-label="Event details">
  <div class="wrap ribbon__row">
    <div class="t-red">${icon('calendar-days')}<span><small>Dates</small><b>${ev.datesLabel}</b></span></div>
    <a class="t-purple" href="${ev.venue.mapUrl}" target="_blank" rel="noopener">${icon('map-pin')}<span><small>Venue · opens Google Maps</small><b>${nt('KTPO')}, Bengaluru</b></span></a>
    <div class="t-teal">${icon(third[0])}<span><small>${third[1]}</small><b>${third[2]}</b></span></div>
    <a class="t-amber" href="/accessibility/">${icon('hand-helping')}<span><small>On site</small><b>Free support</b></span></a>
  </div>
</section>`;
  const subnav = (items) => `<nav class="subnav" aria-label="On this page"><div class="wrap"><ul>${items.map(([id, ic, l]) => `<li><a href="#${id}">${icon(ic)}${l}</a></li>`).join('')}</ul></div></nav>`;
  const faqBlock = (faq) => `<div class="faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}${icon('plus', 'faq__ic')}</summary><div class="faq__a"><p>${esc(a)}</p></div></details>`).join('')}</div>`;
  const faqLd = (faq) => ({ '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  const gal = (list) => `<ul class="kgal">${list.map(([f, a]) => `<li><figure>${img(f, a)}</figure></li>`).join('')}</ul>`;
  const put = (p) => { const i = pages.findIndex(x => x.path === p.path); if (i > -1) pages[i] = p; else pages.push(p); };

  /* ---------------- Programme pages ---------------- */
  EXPERIENCES.forEach(e => {
    const path = `/expo/${e.slug}/`;
    const trail = [HOME, ['Explore the Expo', '/expo/'], [e.name]];
    const tks = e.tickets.map(L.ticketBySlug).filter(Boolean);
    const first = tks[0];
    const links = [['about', 'info', 'About']];
    if (e.highlights.length) links.push(['highlights', 'sparkles', 'Highlights']);
    if (e.details) links.push(['details', 'layout-list', 'In detail']);
    if (e.fullList) links.push(['list', 'list-checks', 'Full list']);
    links.push(['benefits', 'star', 'Benefits']);
    links.push(['take-part', 'ticket', 'Take part']);
    if (e.gallery.length) links.push(['gallery', 'images', 'Gallery']);
    links.push(['faq', 'circle-help', 'FAQ']);
    put({ path, title: e.title, description: e.summary, trail, ld: [L.eventLd({ url: SITE.baseUrl + path }), faqLd(e.faq)],
      body: `${L.pageHero({ kicker: e.kicker, title: e.name, lead: e.headline, trail,
        extra: `<div class="hero__actions">${first ? `<a class="btn btn--red" href="/programs/${first.slug}/">Register ${icon('arrow-right')}</a>` : ''}<a class="btn btn--white" href="#about">Learn more</a></div>` })}
${ribbon(['users', 'Part of', `${nt(SITE.name)} 2026`])}
${subnav(links)}
<section class="sec" id="about" aria-labelledby="ab-h">
  <div class="wrap kabout">
    <div>
      <p class="kicker">About</p>
      <h2 id="ab-h">${e.headline}</h2>
      ${e.intro.map(p => `<p>${p}</p>`).join('')}
      <p class="kabout__who-h">Who it’s for</p>
      <ul class="kwho">${e.who.map(w => `<li>${icon('check')}${w}</li>`).join('')}</ul>
    </div>
    <figure class="kabout__img ${e.tone}">${img(e.image, e.imageAlt || e.name)}</figure>
  </div>
</section>
${e.video ? `<section class="sec sec--tight" aria-labelledby="vd-h"><div class="wrap kvideo"><h2 id="vd-h" class="sr-only">${e.video.title}</h2><video controls preload="none" playsinline poster="/assets/img/${e.video.poster}" aria-label="${e.video.title}"><source src="/assets/media/${e.video.src}" type="video/mp4"></video></div></section>` : ''}
${e.highlights.length ? `` : '<!--'}<section class="sec sec--lilac" id="highlights" aria-labelledby="hl-h">
  <div class="wrap">
    <div class="sec-head sec-head--center"><div><p class="kicker">Highlights</p><h2 id="hl-h">${e.highlightsTitle || 'What you’ll find'}</h2></div></div>
    <ul class="khl">${e.highlights.map(([ic, h, p], i) => `<li class="${TONES[i % TONES.length]}"><span class="khl__ic">${icon(ic)}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}</ul>
  </div>
</section>${e.highlights.length ? `` : '-->'}
${e.details ? `<section class="sec" id="details" aria-labelledby="dt-h"><div class="wrap"><div class="sec-head sec-head--center"><div><p class="kicker">In detail</p><h2 id="dt-h">${e.details.title}</h2></div></div><ul class="kdet">${e.details.items.map(([f, h, p], i) => `<li class="${TONES[i % TONES.length]}"><figure>${img(f, h)}</figure><div><h3>${h}</h3><p>${p}</p></div></li>`).join('')}</ul></div></section>` : ''}
${e.fullList ? `<section class="sec${e.details ? ' sec--mint' : ''}" id="list" aria-labelledby="ls-h"><div class="wrap"><div class="sec-head sec-head--center"><div><p class="kicker">Full list</p><h2 id="ls-h">${e.fullList.title}</h2></div></div><ul class="klist">${e.fullList.items.map((x, i) => `<li class="${TONES[i % TONES.length]}">${icon('check')}${x}</li>`).join('')}</ul></div></section>` : ''}
<section class="kout" id="benefits" aria-labelledby="out-h">
  <div class="wrap">
    <p class="kicker kicker--light kout__k">Benefits</p>
    <h2 id="out-h" class="kout__h">Your benefits</h2>
    <ol class="kout__list">${e.outcomes.map(([h, p]) => `<li><b>${h}</b><span>${p}</span></li>`).join('')}</ol>
  </div>
</section>
<section class="sec" id="take-part" aria-labelledby="tp-h">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">Take part</p><h2 id="tp-h">How to take part</h2></div></div>
    <ol class="ksteps">${e.steps.map(([h, p], i) => `<li class="${TONES[i % 3]}"><span class="ksteps__n" aria-hidden="true">${i + 1}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>
    ${tks.length ? `<div class="tgrid tgrid--k">${tks.map(x => L.ticketCard(x, 3)).join('')}</div>` : ''}
  </div>
</section>
${e.gallery.length ? `<section class="sec sec--mint" id="gallery" aria-labelledby="gl-h"><div class="wrap"><div class="sec-head"><div><p class="kicker">Gallery</p><h2 id="gl-h">Moments</h2></div><a class="btn btn--line" href="/gallery/">Full gallery ${icon('arrow-right')}</a></div>${gal(e.gallery)}</div></section>` : ''}
<section class="sec" id="faq" aria-labelledby="fq-h">
  <div class="wrap faq-wrap">
    <div><p class="kicker">Questions</p><h2 id="fq-h">Good to know</h2><p><a class="btn btn--line btn--sm" href="/faq/">All FAQs ${icon('arrow-right')}</a></p></div>
    ${faqBlock(e.faq)}
  </div>
</section>
${L.ctaBand(`Be part of the ${e.name}`, `${ev.datesLabel} · ${ev.venue.short}`, first ? `/programs/${first.slug}/` : '/programs/', 'Register now')}` });
  });

  /* ---------------- Explore the Expo hub ---------------- */
  const groups = ['Fests', 'Stage', 'Opportunities', 'Learn', 'Care'];
  put({ path: '/expo/', title: `Explore the Expo — Fests, Job Fair, Awards, Seminars & More | ${SITE.name} 2026`,
    description: 'Every programme at Abilities India Expo 2026: technology, tourism and shopping fests, cultural evenings, job fair, awards, seminars, workshops and care services.',
    trail: [HOME, ['Explore the Expo']],
    body: `${L.pageHero({ kicker: "What’s on", title: 'Explore the Expo', lead: `${EXPERIENCES.length} programmes. One event. ${ev.datesLabel}.`, trail: [HOME, ['Explore the Expo']] })}
${ribbon(['layout-grid', 'Programmes', `${EXPERIENCES.length} in one expo`])}
${groups.map((g, gi) => `<section class="sec${gi % 2 ? ' sec--lilac' : ''}" aria-labelledby="eg-${g}"><div class="wrap"><div class="sec-head"><div><p class="kicker">${g === 'Stage' ? 'On stage' : g}</p><h2 id="eg-${g}">${{ Fests: 'Fests to explore', Stage: 'Evening stage', Opportunities: 'Opportunities', Learn: 'Learn and try', Care: 'Care and support' }[g]}</h2></div></div>
<div class="pgrid">${EXPERIENCES.filter(e => e.group === g).map(e => `<article class="pcard ${e.tone}"><div class="pcard__img">${img(e.image, e.imageAlt || '')}</div><div class="pcard__body"><span class="pcard__tag">${icon(e.icon)}${g}</span><h3><a href="/expo/${e.slug}/">${e.name}</a></h3><p>${e.headline}</p><span class="pcard__go" aria-hidden="true">Explore ${icon('arrow-right')}</span></div></article>`).join('')}</div></div></section>`).join('\n')}
${L.ctaBand('Ready to take part?', 'Every programme is part of one registration.', '/programs/', 'Find your registration')}` });

  /* ---------------- KTPO venue ---------------- */
  put({ path: '/venue/', title: `Venue — KTPO International Exhibition and Convention Centre, Bengaluru | ${SITE.name}`,
    description: 'Abilities India Expo 2026 takes place at KTPO International Exhibition and Convention Centre, Bengaluru, 20–22 December 2026. Directions and visitor support.',
    trail: [HOME, ['Venue']],
    body: `${L.pageHero({ kicker: 'Expo details', title: 'The Venue', lead: `${nt(ev.venue.name)}, Bengaluru.`, trail: [HOME, ['Venue']],
      extra: `<div class="hero__actions"><a class="btn btn--red" href="${ev.venue.mapUrl}" target="_blank" rel="noopener">${icon('map-pin')} Open in Google Maps</a></div>` })}
${ribbon(['handshake', 'Format', 'Both B2B and B2C'])}
<section class="sec" aria-labelledby="v-h"><div class="wrap kabout">
  <div><p class="kicker">Expo details</p><h2 id="v-h">${nt(ev.venue.name)}</h2>
    <p>The ${nt(SITE.name)} will take place from December 20 – 22, 2026 at the ${nt(ev.venue.name)} Bengaluru, Karnataka.</p>
    <p><b>Both B2B and B2C</b></p>
    <p>${nt(SITE.name)} 2026 in Bengaluru, India.</p></div>
  <figure class="kabout__img t-purple">${img('ktpo.webp', 'KTPO International Exhibition and Convention Centre, Bengaluru')}</figure>
</div></section>
<section class="sec sec--lilac" aria-labelledby="g-h"><div class="wrap">
  <div class="sec-head sec-head--center"><div><p class="kicker">Getting there</p><h2 id="g-h">Plan your arrival</h2></div></div>
  <ul class="khl">
    <li class="t-red"><span class="khl__ic">${icon('navigation')}</span><h3>Directions</h3><p><a href="https://share.google/fsICWG0DNoR5gCULs" target="_blank" rel="noopener">Get directions to the venue</a> or <a href="${ev.venue.mapUrl}" target="_blank" rel="noopener">open it in Google Maps</a>.</p></li>
    <li class="t-purple"><span class="khl__ic">${icon('handshake')}</span><h3>Both B2B and B2C</h3><p>Open to businesses and to the public.</p></li>
    <li class="t-teal"><span class="khl__ic">${icon('hand-helping')}</span><h3>Free services</h3><p><a href="/expo/services/">Personal care, sign language interpreters, medical service and accessible rest rooms</a>.</p></li>
    <li class="t-amber"><span class="khl__ic">${icon('phone')}</span><h3>Need help?</h3><p>Call <a href="tel:${tel}">${SITE.contact.phone}</a> before your visit.</p></li>
  </ul></div></section>
${L.ctaBand('See you at KTPO', ev.datesLabel, '/programs/visitor/', 'Register to visit')}` });

  /* ---------------- MSME stall grant (full text from the live page) ---------------- */
  put({ path: '/msme-stall-grant/', title: `Apply for MSME Stall Grant | ${SITE.name}`,
    description: 'Financial assistance on stall rent for eligible MSEs through the Procurement Marketing Support Scheme of the Ministry of MSME: eligibility, limits and how to apply.',
    trail: [HOME, ['Exhibitors', '/exhibitors/'], ['MSME Stall Grant']],
    body: `${L.pageHero({ kicker: 'For exhibitors', title: 'Apply for MSME Stall Grant', lead: 'Financial assistance on stall rent for eligible micro and small enterprises (MSEs).', trail: [HOME, ['Exhibitors', '/exhibitors/'], ['MSME Stall Grant']],
      extra: `<div class="hero__actions"><a class="btn btn--red" href="${SITE.msmePortal}" target="_blank" rel="noopener">Apply on the MSME portal ${icon('external-link')}</a></div>` })}
<section class="sec" aria-labelledby="m-h"><div class="wrap kabout">
  <div><p class="kicker">About the grant</p><h2 id="m-h">Approved by the Ministry of MSME</h2>
    <p>Office of Development Commissioner (MSME), Ministry of MSME, Govt of India, New Delhi has accorded administrative approval to ‘${nt(SITE.name)} 2023, Adlux International Exhibition and Convention Centre, Angamaly from 13/12/2023 to 17/12/2023 under the component ‘Domestic Trade Fair’ (5 I A) of Procurement Marketing Support Scheme, hence the eligible MSEs exhibiting their products in the above said Exhibition through stalls will get financial assistance as per the criteria of Scheme Guidelines.</p>
    <p>The interested MSEs may be directed to submit the online applications well in advance, ie. at least by 04.12.2023.</p>
    <p class="msme-stop">${icon('circle-alert')} NO APPLICATIONS CAN BE SUBMITTED AFTER THE LAST DATE.</p></div>
  <figure class="kabout__img t-amber">${img('msme.png', 'Ministry of MSME logo')}</figure>
</div></section>
<section class="sec sec--lilac" aria-labelledby="mb-h"><div class="wrap">
  <div class="sec-head sec-head--center"><div><p class="kicker">Scheme guidelines</p><h2 id="mb-h">Applications and eligibility</h2></div></div>
  <div class="pol-grid">
    <article class="pol-card t-red"><span class="pol-card__ic">${icon('users')}</span><div><h3>Maximum Number of Applications</h3><p>As per the revised guidelines, maximum number of applications from across the country is 60 Numbers for online submission per Trade Fair.</p></div></article>
    <article class="pol-card t-purple"><span class="pol-card__ic">${icon('badge-check')}</span><div><h3>Eligibility</h3><p>The financial assistance for the eligible MSEs will be as: 80% of space rent paid for General category units and 100% for SC/ST/women/NER/PH units. The space rent will subject to the minimum booth/stall size. And 100% contingency expenditure for all categories of units subject to maximum Rs.25,000/- or actual, whichever is less.</p><p>One representative from each participating unit may travel limiting to AC II tier train fair/ Economy Class Air Fare. Local participants will be paid Rs 12/Km as freight charges (transportation of goods charges) up to 50 Kms.</p><p>As per the above clause, the maximum Budgetary Support (including contingency expenditure) is Rs. 80,000 (incl. all taxes) maximum or actual, whichever is less for a participating enterprise in the event.</p></div></article>
  </div>
</div></section>
<section class="sec" aria-labelledby="ms-h"><div class="wrap">
  <div class="sec-head"><div><p class="kicker">Apply through</p><h2 id="ms-h">How to apply</h2></div></div>
  <ol class="ksteps">
    <li class="t-red"><span class="ksteps__n" aria-hidden="true">1</span><h3>Udyam Registration</h3><p>Register on the Udyam Registration portal:<br><a href="https://udyamregistration.gov.in/Government-India/Ministry-MSME-registration.htm" target="_blank" rel="noopener">udyamregistration.gov.in</a> and <a href="http://www.msmedatabank.in/" target="_blank" rel="noopener">www.msmedatabank.in</a></p></li>
    <li class="t-purple"><span class="ksteps__n" aria-hidden="true">2</span><h3>Apply online</h3><p>The interested MSEs can apply for the financial assistance through the link:<br><a href="${SITE.msmePortal}" target="_blank" rel="noopener">my.msme.gov.in/MyMsme/Reg/COM_MatuDomAppForm.aspx</a></p></li>
    <li class="t-teal"><span class="ksteps__n" aria-hidden="true">3</span><h3>Book your stall</h3><p>Complete <a href="/programs/exhibitor/">Exhibitor Stall Booking</a>.</p></li>
  </ol>
  <p class="note">Kindly note that the registrations of Udyam Registration and MSME Databank are entirely free and no agency has been appointed by the Ministry for the said registrations. The detail user manual for applying for reimbursement is attached herewith for the reference.</p>
  <p><a class="btn btn--red" href="/assets/docs/MSME-User-Manual-Domestic-Trade-Fair.pdf" download>${icon('download')} Download PDF — User manual (PDF, 1.4 MB)</a></p>
</div></section>` });

  /* ---------------- Media coverage ---------------- */
  put({ path: '/media/', title: `Media Coverage & Press | ${SITE.name} 2026`,
    description: 'Print, broadcast and online media — state, national and international — cover Abilities India Expo. Press enquiries, interviews and photos.',
    trail: [HOME, ['Media Coverage']],
    body: `${L.pageHero({ kicker: 'Media', title: 'Media Coverage', lead: 'State, national and international media cover the expo.', trail: [HOME, ['Media Coverage']] })}
<section class="sec" aria-labelledby="md-h"><div class="wrap kabout">
  <div><p class="kicker">In the news</p><h2 id="md-h">Stories worth telling.</h2>
    <p>All print, visual and online medias in (State, National and International) will cover this Expo.</p>
    <p>The founder’s earlier pre-marital meets and mass marriages for persons with disabilities were covered by BBC and CNN.</p></div>
  <figure class="kabout__img t-red">${img('media-coverage.jpg', 'A reporter with a microphone')}</figure>
</div></section>
<section class="sec sec--lilac" aria-labelledby="mp-h"><div class="wrap">
  <div class="sec-head sec-head--center"><div><p class="kicker">For journalists</p><h2 id="mp-h">How we can help</h2></div></div>
  <ul class="khl">
    <li class="t-red"><span class="khl__ic">${icon('mic')}</span><h3>Interviews</h3><p>Speak with the founder, achievers and exhibitors.</p></li>
    <li class="t-purple"><span class="khl__ic">${icon('camera')}</span><h3>Photos & visits</h3><p>Coverage access during the expo.</p></li>
    <li class="t-teal"><span class="khl__ic">${icon('mail')}</span><h3>Press enquiries</h3><p><a href="mailto:${SITE.contact.emails[1]}">${SITE.contact.emails[1]}</a></p></li>
    <li class="t-amber"><span class="khl__ic">${icon('phone')}</span><h3>Call us</h3><p><a href="tel:${tel}">${SITE.contact.phone}</a></p></li>
  </ul></div></section>` });

  /* ---------------- Gallery ---------------- */
  const GSETS = [
    ['1st Edition, Kochi 2025', 'Visitors, exhibitors and moments from the expo floor.', [['gallery-8.jpg', 'Visitors in wheelchairs exploring the expo'], ['gallery-9.jpg', 'Families and wheelchair users in the aisle'], ['gallery-6.jpg', 'A visitor talking with an exhibitor'], ['gallery-5.jpg', 'An artist at his painting stall'], ['gallery-3.jpg', 'Visitors at the KELTRON stall'], ['gallery-7.jpg', 'Visitors with an artist and her paintings'], ['gallery-4.jpg', 'An exhibitor demonstrating a device'], ['gallery-2.jpg', 'Visitors at a product stall'], ['gallery-1.jpg', 'Visitors at a handicraft stall'], ['gallery-10.jpg', 'Visitors at a product stall']]],
    ['On stage', 'Cultural evenings and the Flywings Megashow.', [['cult-1.webp', 'Artists performing'], ['cult-2.webp', 'Artists performing'], ['cult-3.webp', 'Artists performing'], ['flywings-1.webp', 'Flywings artists on stage'], ['flywings-3.webp', 'Flywings performance'], ['flywings-4.webp', 'Flywings performance']]],
    ['Made by persons with disabilities', 'Products from the Shopping Fest.', [['shop-1.webp', 'Handmade product'], ['shop-2.webp', 'Handmade product'], ['shop-3.webp', 'Handmade product'], ['shop-4.webp', 'Handmade product'], ['shop-5.webp', 'Handmade product'], ['shop-6.webp', 'Handmade product']]],
  ];
  put({ path: '/gallery/', title: `Gallery — Photos from Abilities India Expo | ${SITE.name}`,
    description: 'Photos from Abilities India Expo: the 1st Edition in Kochi, cultural evenings, the Flywings Megashow and products made by persons with disabilities.',
    trail: [HOME, ['Gallery']],
    body: `${L.pageHero({ kicker: 'Moments', title: 'Gallery', lead: 'Real people. Real moments.', trail: [HOME, ['Gallery']] })}
${subnav(GSETS.map((g, i) => ['set-' + i, 'images', g[0]]))}
${GSETS.map(([h, p, list], i) => `<section class="sec${i % 2 ? ' sec--lilac' : ''}" id="set-${i}" aria-labelledby="gs-${i}"><div class="wrap"><div class="sec-head"><div><p class="kicker">Gallery</p><h2 id="gs-${i}">${h}</h2><p>${p}</p></div></div>${gal(list)}</div></section>`).join('\n')}` });

  /* ---------------- International expo ---------------- */
  put({ path: '/international-expo/', title: `Abilities International Expo 2027 — Pragati Maidan, New Delhi | ${SITE.name}`,
    description: 'The organiser plans the Abilities International Expo for people with disabilities at Pragati Maidan, New Delhi, in the last week of October 2027.',
    trail: [HOME, ['International Expo 2027']],
    body: `${L.pageHero({ kicker: 'Expo hall', title: 'Abilities International Expo', lead: 'Taking the movement to the world stage.', trail: [HOME, ['International Expo 2027']],
      extra: `<div class="hero__actions"><a class="btn btn--red" href="/contact/">Register your interest ${icon('arrow-right')}</a></div>` })}
${ribbon(['globe', 'Scale', 'International'])}
<section class="sec" aria-labelledby="ie-h"><div class="wrap kabout">
  <div><p class="kicker">New Delhi · October 2027</p><h2 id="ie-h">Next stop: Pragati Maidan.</h2>
    <p>We plan to organize an International Expo at New Delhi in 2027 October last week for people with disabilities.</p>
    <h3>Pragati Maidan, New Delhi</h3>
    <p>Pragati Maidan is a venue for large exhibitions and conventions in the city of New Delhi, India.</p>
    <p><a class="btn btn--line" href="https://www.google.com/maps/search/?api=1&amp;query=Pragati+Maidan+New+Delhi" target="_blank" rel="noopener">${icon('map-pin')} Get direction to the Expo Hall</a></p></div>
  <figure class="kabout__img t-teal">${img('pragati-maidan.webp', 'Aerial view of New Delhi')}</figure>
</div></section>
<section class="sec sec--lilac" aria-labelledby="ij-h"><div class="wrap">
  <div class="sec-head sec-head--center"><div><p class="kicker">The journey</p><h2 id="ij-h">Three editions</h2></div></div>
  <ol class="ksteps">
    <li class="t-red"><span class="ksteps__n" aria-hidden="true">1</span><h3>Kochi · 2025</h3><p>1st Edition, Rajiv Gandhi Indoor Stadium.</p></li>
    <li class="t-purple"><span class="ksteps__n" aria-hidden="true">2</span><h3>Bengaluru · 2026</h3><p>2nd Edition, KTPO, ${ev.datesLabel}.</p></li>
    <li class="t-teal"><span class="ksteps__n" aria-hidden="true">3</span><h3>New Delhi · 2027</h3><p>Abilities International Expo (planned).</p></li>
  </ol></div></section>` });

  /* ---------------- Terms (summary) ---------------- */
  put({ path: '/terms/', title: `Terms & Conditions | ${SITE.name}`, description: `Terms and conditions for using the ${SITE.name} website, organised by ${SITE.organiser.name}.`, noindex: true,
    trail: [HOME, ['Terms']],
    body: `${L.pageHero({ kicker: 'Policy', title: 'Terms & Conditions', lead: 'A plain-language summary.', trail: [HOME, ['Terms']] })}
<section class="sec"><div class="wrap prose-wide">
  <div class="notice" role="note">${icon('info')}<p><b>Summary for review.</b> The organiser’s current terms are dated 26 July 2023. ${flag('Organiser / legal to approve the final text')}</p></div>
  <h2 class="sr-only">Summary of terms</h2>
  <ul class="khl khl--plain">
    <li class="t-purple"><span class="khl__ic">${icon('file-text')}</span><h3>Agreement</h3><p>Using this website means you accept these terms.</p></li>
    <li class="t-teal"><span class="khl__ic">${icon('copyright')}</span><h3>Our content</h3><p>Website content belongs to ${nt(SITE.organiser.name)}.</p></li>
    <li class="t-red"><span class="khl__ic">${icon('shield-check')}</span><h3>Fair use</h3><p>No unlawful use, harassment, fraud or harmful software.</p></li>
    <li class="t-amber"><span class="khl__ic">${icon('ticket')}</span><h3>Registrations</h3><p>Registrations and payments are handled by Tickets99. See the <a href="/refund/">refund policy</a>.</p></li>
  </ul>
</div></section>` });
};
