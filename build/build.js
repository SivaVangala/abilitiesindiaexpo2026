/*
 * Abilities India Expo — static site build.
 *   npm run build   -> dist/ (pretty URLs: /programs/visitor/ -> dist/programs/visitor/index.html)
 * Content lives in /content, layout + components in build/lib.js. No runtime dependencies.
 */
const fs = require('fs');
const path = require('path');
const L = require('./lib');
const { SITE, CATEGORIES, TICKETS, EXPERIENCES, esc, icon, img, flag, nt, tel } = L;
const FAQ = require('../content/faq');

const DIST = path.join(L.ROOT, 'dist');
const pages = [];
const add = (p) => pages.push(p);
const HOME = ['Home', '/'];
const ev = SITE.event;

/* ======================================================================
   HOME
   ====================================================================== */
const audiences = [
  ['accessibility', 't-red', 'A person with a disability', 'Technology, jobs, culture and free on-site support', '/visitors/#pwd'],
  ['heart-pulse', 't-teal', 'A senior citizen', 'Elderly services, health and evening programmes', '/expo/elderly-services/'],
  ['users', 't-purple', 'A family member or caregiver', 'Seminars, care services and support', '/visitors/#families'],
  ['briefcase', 't-purple', 'Looking for a job', 'Meet employers at the Job Fair', '/programs/job-seeker/'],
  ['building-2', 't-ink', 'An employer', 'Hire talent at the Job Fair', '/programs/employer/'],
  ['store', 't-ink', 'An exhibitor or sponsor', 'Stalls, business meets and partnerships', '/exhibitors/'],
  ['palette', 't-red', 'An artist or filmmaker', 'Perform, screen your film or sell your work', '/programs/?cat=stage'],
  ['graduation-cap', 't-teal', 'A professional or NGO', 'Seminars, networking and awards', '/programs/seminar-delegate/'],
];
const expCard = (e) => `<article class="xcard ${e.tone}">
  ${icon(e.icon, 'xcard__ic')}
  <h3><a href="/expo/${e.slug}/">${e.name}</a></h3>
  <p>${e.summary}</p>
  <span class="xcard__grp">${e.group}</span>
</article>`;

add(require('./home-b')(L, FAQ)); // VERSION B home page

/* ======================================================================
   PROGRAMS & REGISTRATION hub + 15 ticket pages
   ====================================================================== */
const fixtureNote = TICKETS.some(x => x.fixture)
  ? `<div class="notice" role="note">${icon('info')}<p><b>Preview data.</b> These categories come from the live website’s registration paths. Final names, prices and registration links will be loaded from the official Tickets99 configuration before launch.</p></div>` : '';
add({ path: '/programs/', title: `Programs & Registration | ${SITE.name} 2026`,
  description: `All ${TICKETS.length} ways to take part in one event: visit, exhibit, Job Fair, Cultural and Short Film Fest, awards and more. 20–22 Dec 2026, KTPO Bengaluru.`,
  trail: [HOME, ['Programs & Registration']], ld: [L.eventLd()],
  body: `${L.pageHero({ kicker: 'One event · ' + TICKETS.length + ' registration categories', title: 'Programs &amp; Registration',
    lead: `Everything here belongs to <strong>one event</strong>: ${nt(SITE.name)} 2026, ${ev.datesLabel}, ${nt(ev.venue.short)}. Choose the category that matches what you want to do.`,
    trail: [HOME, ['Programs & Registration']] })}
<section class="sec sec--tight">
  <div class="wrap">
    ${fixtureNote}
    <form class="filters" role="search" aria-label="Filter registration categories" onsubmit="return false">
      <div class="filters__search">
        <label for="q">Search categories</label>
        <div class="field">${icon('search')}<input id="q" type="search" autocomplete="off" placeholder="e.g. job, film, exhibit"></div>
      </div>
      <fieldset class="filters__cats">
        <legend>Show</legend>
        <div class="chipset">
          <button type="button" data-filter="all" aria-pressed="true">All</button>
          ${CATEGORIES.map(c => `<button type="button" data-filter="${c.id}" aria-pressed="false">${c.label}</button>`).join('')}
        </div>
      </fieldset>
    </form>
    <p class="results" id="results" role="status" aria-live="polite">Showing all ${TICKETS.length} categories</p>
    ${CATEGORIES.map(c => `<section class="tgroup" data-group="${c.id}" aria-labelledby="g-${c.id}">
      <h2 id="g-${c.id}" class="tgroup__h">${icon(c.icon)} ${c.label}</h2>
      <div class="tgrid">${TICKETS.filter(x => x.category === c.id).map(x => L.ticketCard(x, 3)).join('')}</div>
    </section>`).join('')}
    <p class="empty" id="empty" hidden>No categories match. <button type="button" class="linkish" data-clear>Clear the search</button> or <a href="/contact/">ask us</a>.</p>
  </div>
</section>
<section class="sec sec--tight"><div class="wrap how">
  <h2>How registration works</h2>
  <ol class="steps">
    <li><b>Choose</b> the category that fits you.</li>
    <li><b>Read</b> who it is for and whether it is free or paid.</li>
    <li><b>Register</b> on Tickets99, our secure registration partner.</li>
    <li><b>Pay</b> if the category is paid. Free categories skip this step.</li>
    <li><b>Get confirmation</b> with your e-ticket or QR code.</li>
  </ol>
  <p>Need help? Call or WhatsApp <a href="tel:${tel}">${SITE.contact.phone}</a> — we can register with you.</p>
</div></section>`,
});

TICKETS.forEach(tk => {
  const c = L.catOf(tk.category);
  const url = L.bookingUrl(tk);
  const exps = EXPERIENCES.filter(e => e.tickets.includes(tk.slug));
  const related = TICKETS.filter(x => x !== tk && x.category === tk.category).slice(0, 3);
  const trail = [HOME, ['Programs & Registration', '/programs/'], [tk.name]];
  add({ path: `/programs/${tk.slug}/`, title: `${tk.name} | ${SITE.name} 2026`,
    description: `${tk.summary} Part of ${SITE.name} 2026, 20–22 Dec, KTPO Bengaluru.`.slice(0, 158),
    trail, ld: [L.eventLd({ url: `${SITE.baseUrl}/programs/${tk.slug}/` })],
    body: `${L.pageHero({ kicker: `${c.label} · part of ${nt(SITE.name)} 2026`, title: esc(tk.name), lead: esc(tk.summary), trail,
      extra: `<div class="tmeta">${L.priceBadge(tk)}<span class="badge">${icon('calendar-days')} ${ev.datesLabel}</span><span class="badge">${icon('map-pin')} ${nt(ev.venue.short)}</span></div>` })}
<section class="sec">
  <div class="wrap tdetail">
    <div class="prose">
      ${tk.fixture ? `<div class="notice" role="note">${icon('info')}<p><b>Preview.</b> This category is based on the current website. The organiser will confirm the final name, price and details in Tickets99.</p></div>` : ''}
      <h2>Who should register</h2>
      <ul class="ticks">${tk.whoFor.map(w => `<li>${esc(w)}</li>`).join('')}</ul>
      <h2>Highlights</h2>
      <ul class="ticks">${tk.highlights.map(w => `<li>${esc(w)}</li>`).join('')}</ul>
      ${tk.eligibility ? `<h2>Eligibility</h2><p>${esc(tk.eligibility)}</p>` : ''}
      <h2>Price and payment</h2>
      <p>${tk.priceType === 'free' ? 'This category is free.' : tk.priceType === 'paid' ? `Price: ₹${tk.price}. Payment is taken securely on Tickets99 (UPI, cards and other methods offered there). GST, where applicable, is shown before you pay.` : 'The price is shown on the registration form before you pay.'}</p>
      ${exps.length ? `<h2>Related experiences</h2><ul class="links">${exps.map(e => `<li><a href="/expo/${e.slug}/">${e.name}</a></li>`).join('')}</ul>` : ''}
    </div>
    <aside class="regbox" id="register" aria-labelledby="reg-h">
      <h2 id="reg-h">Register</h2>
      <dl>
        <div><dt>Event</dt><dd>${nt(SITE.name)} 2026</dd></div>
        <div><dt>Category</dt><dd>${esc(tk.name)}</dd></div>
        <div><dt>Dates</dt><dd>${ev.datesLabel}</dd></div>
        <div><dt>Venue</dt><dd>${nt(ev.venue.name)}, Bengaluru</dd></div>
        <div><dt>Price</dt><dd>${L.priceBadge(tk)}</dd></div>
      </dl>
      ${url ? L.registerAction(tk, { big: true }) + `<p class="regbox__note">You will continue on Tickets99, our registration partner.</p>`
        : `<p class="status status--soon">${icon('clock')} Online registration opens soon.</p><p>To register your interest now, call or WhatsApp <a href="tel:${tel}">${SITE.contact.phone}</a> or email <a href="mailto:${SITE.contact.emails[0]}?subject=${encodeURIComponent('Registration interest: ' + tk.name)}">${SITE.contact.emails[0]}</a>.</p>`}
      <p class="regbox__help">${icon('accessibility')} Need support at the venue? Tell us when you register.</p>
    </aside>
  </div>
</section>
${related.length ? `<section class="sec sec--mist"><div class="wrap"><h2>Other ${c.label.toLowerCase()} categories</h2><div class="tgrid">${related.map(x => L.ticketCard(x, 3)).join('')}</div><p class="mt"><a class="btn btn--line" href="/programs/">All ${TICKETS.length} categories ${icon('arrow-right')}</a></p></div></section>` : ''}`,
  });
});

/* Embedded checkout (only used when site.tickets99.mode === 'embed') */
add({ path: '/register/', title: `Register | ${SITE.name} 2026`, description: `Register for ${SITE.name} 2026 on Tickets99.`, noindex: true,
  trail: [HOME, ['Programs & Registration', '/programs/'], ['Register']],
  body: `${L.pageHero({ title: 'Register', lead: 'Complete your registration below. It is handled securely by Tickets99.', trail: [HOME, ['Programs & Registration', '/programs/'], ['Register']] })}
<section class="sec sec--tight"><div class="wrap">
  <div id="t99" data-tickets='${esc(JSON.stringify(TICKETS.map(x => ({ slug: x.slug, name: x.name, ti: x.ti }))))}' data-buy="${esc(SITE.tickets99.buyBase || '')}" data-origin="${esc(SITE.tickets99.embedOrigin || '')}">
    <p class="status status--soon">${icon('clock')} Choose a category on <a href="/programs/">Programs &amp; Registration</a> to begin.</p>
  </div>
</div></section>`,
});

/* ======================================================================
   EXPLORE THE EXPO hub + experience pages
   ====================================================================== */
add({ path: '/expo/', title: `Explore the Expo — Fests, Job Fair, Awards & More | ${SITE.name} 2026`,
  description: 'Assistive Technology, Accessible Tourism, Medical Tourism, Shopping, Cultural and Short Film Fests, Job Fair, Business Meets, Awards, Seminars and Elderly Services.',
  trail: [HOME, ['Explore the Expo']],
  body: `${L.pageHero({ kicker: "What's on", title: 'Explore the Expo', lead: `Everything that happens at ${nt(SITE.name)} 2026 — all in one event, ${ev.datesLabel}.`, trail: [HOME, ['Explore the Expo']] })}
<section class="sec"><div class="wrap">
  ${['Fests', 'Stage', 'Opportunities', 'Learn', 'Care'].map(g => `<section class="tgroup" aria-labelledby="eg-${g}"><h2 id="eg-${g}" class="tgroup__h">${g}</h2><div class="xgrid">${EXPERIENCES.filter(e => e.group === g).map(expCard).join('')}</div></section>`).join('')}
</div></section>
${L.ctaBand('Ready to take part?', 'All experiences are part of one registration journey.', '/programs/', 'Programs &amp; Registration')}`,
});

EXPERIENCES.forEach(e => {
  const trail = [HOME, ['Explore the Expo', '/expo/'], [e.name]];
  const tks = e.tickets.map(L.ticketBySlug).filter(Boolean);
  add({ path: `/expo/${e.slug}/`, title: `${e.name} | ${SITE.name} 2026, Bengaluru`, description: `${e.summary}`.slice(0, 158), trail,
    body: `${L.pageHero({ kicker: e.kicker, title: e.name, lead: e.summary, trail })}
<section class="sec"><div class="wrap pbody${e.image ? '' : ' pbody--single'}">
  <div class="prose">${e.body}${e.list ? `<h2>${e.list.title}</h2><ul class="ticks cols">${e.list.items.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}</div>
  ${e.image ? `<figure>${img(e.image, e.imageAlt || '')}</figure>` : ''}
</div></section>
${tks.length ? `<section class="sec sec--mist"><div class="wrap"><h2>Register for this</h2><div class="tgrid">${tks.map(x => L.ticketCard(x, 3)).join('')}</div></div></section>` : ''}`,
  });
});

/* ======================================================================
   INFORMATION PAGES
   ====================================================================== */
const simple = (p, title, description, hero, body, opts = {}) => add({ path: p, title: `${title} | ${SITE.name} 2026`, description, trail: [HOME, [hero.crumb || title]], ...opts,
  body: `${L.pageHero({ ...hero, title: hero.title || title, trail: [HOME, [hero.crumb || title]] })}\n${body}` });

simple('/visitors/', 'Visitors', 'Who should visit Abilities India Expo 2026, what you will experience, free on-site support and how to register.',
  { kicker: 'Plan your visit', lead: 'Persons with disabilities, senior citizens, families, professionals and organisations from many states will visit the expo.' },
  `<section class="sec"><div class="wrap prose-wide">
  <h2 id="pwd">If you have a disability</h2><p>Try assistive technology at the Assistive Technology Fest, meet employers at the Job Fair, enjoy the Cultural Fest every evening and use free on-site support — sign language interpreters, personal care, medical service and accessible restrooms.</p>
  <h2 id="families">For families and caregivers</h2><p>Attend free seminars on planning for special-needs children, accessible home design, respite and home care, and explore services for elderly relatives.</p>
  <h2>Who visits</h2>
  <div class="vgroups">
    <div><h3>People and families</h3><ul class="ticks"><li>Persons with disabilities, the elderly and their families</li><li>End users of disability products</li><li>Students, schools, colleges and universities</li></ul></div>
    <div><h3>Health and rehabilitation</h3><ul class="ticks"><li>Medical specialists, therapists and physiotherapists</li><li>Centres, clinics and hospitals for rehabilitation</li><li>Healthcare professionals, paramedical staff and consultants</li></ul></div>
    <div><h3>Community and government</h3><ul class="ticks"><li>NGOs and associations of persons with disabilities</li><li>Government, procurement officials and policy makers</li><li>Educators, social workers and volunteers</li></ul></div>
    <div><h3>Business and trade</h3><ul class="ticks"><li>Dealers, distributors and online/offline traders</li><li>Purchase managers from corporate India</li><li>Accessible and medical tourism companies</li></ul></div>
    <div><h3>Design and built environment</h3><ul class="ticks"><li>Engineers, architects and designers</li><li>Mall owners and facility managers</li></ul></div>
    <div><h3>Wellness and fitness</h3><ul class="ticks"><li>Fitness clubs, gyms, yoga and aerobics centres</li><li>Spas, salons and wellness studios</li><li>Dieticians, nutritionists and trainers</li></ul></div>
  </div>
  <h2>Before you come</h2>
  <ul class="ticks"><li>Register online — choose <a href="/programs/visitor/">Visitor Registration</a>.</li><li>Tell us about any access needs when you register.</li><li>Read <a href="/accessibility/">accessibility at the venue</a>.</li><li>Daily timings: to be announced ${flag('Organiser to confirm')}</li></ul>
</div></section>
${L.ctaBand('Register to visit', `${ev.datesLabel} · ${ev.venue.short}`, '/programs/visitor/', 'Visitor Registration')}`);

simple('/exhibitors/', 'Exhibitors', 'Exhibit at Abilities India Expo 2026: why exhibit, exhibitor categories, business meets and the MSME stall grant.',
  { kicker: 'Showcase success', lead: 'Show your technologies and services to visitors, buyers, distributors and partners — and to the people they are built for.' },
  `<section class="sec"><div class="wrap pbody">
  <div class="prose">
    <h2>Why exhibit</h2>
    <ul class="ticks cols"><li>Meet a large audience from many states</li><li>Gain consumer confidence</li><li>Increase brand awareness</li><li>Generate revenue</li><li>Strengthen bonds with existing customers</li><li>Network face to face with industry peers</li><li>Showcase new products</li><li>Increase sales through live demonstrations</li><li>Speak directly to your audience</li><li>Stay competitive in your market</li></ul>
    <h2>Exhibitor categories</h2>
    <div class="vgroups">
      <div><h3>Mobility &amp; daily living</h3><ul class="ticks"><li>Mobility products and orthopaedic aids</li><li>Accessible living</li><li>Household and nutrition</li><li>Personal hygiene and care</li><li>Clothing and protective aids</li></ul></div>
      <div><h3>Sensory &amp; communication</h3><ul class="ticks"><li>Hearing aids</li><li>Speech therapy</li><li>Optics and ophthalmology</li><li>Communication equipment and software</li></ul></div>
      <div><h3>Health &amp; therapy</h3><ul class="ticks"><li>Medical equipment</li><li>Hospitals and nursing homes</li><li>Physiotherapy and physical training</li><li>Nursing and medical care</li><li>Dental products and services</li><li>Addiction counselling services</li></ul></div>
      <div><h3>Fitness, sport &amp; wellness</h3><ul class="ticks"><li>Exercise, leisure and sports equipment</li><li>Fitness equipment and services</li><li>Yoga and wellness services</li></ul></div>
      <div><h3>Made by persons with disabilities</h3><ul class="ticks"><li>Paintings and handicrafts</li><li>Garments</li><li>Agricultural products</li><li>Other products</li></ul></div>
      <div><h3>Learning</h3><ul class="ticks"><li>Education, coaching and training</li></ul></div>
    </div>
    <h2 id="msme">MSME stall grant</h2>
    <p>The Office of the Development Commissioner (MSME) supported a previous edition with financial assistance on stall rent for eligible micro and small enterprises, applied for on the official MSME portal. ${flag('Organiser to confirm whether this applies to 2026, and the deadline')}</p>
    <p><a href="${SITE.msmePortal}">MSME portal application form</a></p>
  </div>
  <figure>${img('Trade-Show.webp', 'Busy exhibition hall with visitors walking between stalls')}</figure>
</div></section>
<section class="sec sec--mist"><div class="wrap"><h2>Exhibitor registrations</h2><div class="tgrid">${['exhibitor', 'assistive-tech-innovator', 'business-meet', 'shopping-fest-seller'].map(s => L.ticketCard(L.ticketBySlug(s), 3)).join('')}</div></div></section>`);

simple('/sponsors/', 'Sponsors & Partners', 'Sponsor or partner with Abilities India Expo 2026 and support inclusion, accessibility and opportunity.',
  { kicker: 'Partner with purpose', lead: 'Put your organisation behind inclusion — alongside the people, institutions and companies building a more accessible India.' },
  `<section class="sec"><div class="wrap prose-wide">
  <h2>Ways to partner</h2>
  <div class="vgroups">
    <div><h3>${icon('megaphone')} Sponsor</h3><p>Support the expo and reach visitors, exhibitors, media and decision makers.</p></div>
    <div><h3>${icon('handshake')} Associate with us</h3><p>NGOs, institutions, associations and government bodies can join as associate partners.</p></div>
    <div><h3>${icon('award')} Support the awards</h3><p>Help recognise achievers and assistive technology innovators.</p></div>
  </div>
  <p>Sponsorship packages are shared on enquiry. ${flag('Packages to be supplied by the organiser — none are published yet')}</p>
  <h2>Partners of the 1st Edition</h2>
  <ul class="partners">${[['partner1.png', 'MSME Development & Facilitation Office, Government of India'], ['partner2.png', 'Kerala Startup Mission'], ['partner3.png', 'K-DISC'], ['partner4.png', 'K Chittilappilly Foundation'], ['partner5.png', 'NCPEDP'], ['partner6.png', 'Aster Medcity']].map(([f, a]) => `<li>${img(f, a)}</li>`).join('')}</ul>
</div></section>
${L.ctaBand('Start a conversation', 'Tell us about your organisation and goals.', '/programs/sponsor/', 'Sponsor &amp; Associate Enquiry')}`);

simple('/accessibility/', 'Accessibility & Visitor Assistance', 'Accessibility at Abilities India Expo 2026: free on-site services, venue access at KTPO Bengaluru, and how to request support.',
  { kicker: 'Plan an accessible visit', crumb: 'Accessibility', lead: 'Support for visitors with disabilities is free and part of the plan. Here is what is available and how to ask for help.' },
  `<section class="sec"><div class="wrap prose-wide">
  <h2>Free services at the expo</h2>
  <div class="vgroups">
    <div><h3>${icon('hand')} Sign language interpreters</h3><p>Available at the venue for visitors who are deaf or hard of hearing.</p></div>
    <div><h3>${icon('hand-helping')} Personal care service</h3><p>Help with personal care during your visit.</p></div>
    <div><h3>${icon('cross')} Medical service</h3><p>Medical support on site throughout the expo.</p></div>
    <div><h3>${icon('accessibility')} Accessible restrooms</h3><p>Accessible restrooms at the venue.</p></div>
  </div>
  <h2 id="venue">The venue</h2>
  <p><strong>${nt(ev.venue.name)}</strong>, Bengaluru, Karnataka. <a href="${ev.venue.mapUrl}">Open in Google Maps</a>.</p>
  <p>${flag('Organiser to confirm with the venue')} Step-free routes and entrances, accessible parking and drop-off points, lifts, seating and rest areas, quiet space, assistance-animal policy and public transport options will be listed here.</p>
  <h2>Request support</h2>
  <ul class="ticks"><li>Tell us your access needs when you register.</li><li>Or call / WhatsApp <a href="tel:${tel}">${SITE.contact.phone}</a> or email <a href="mailto:${SITE.contact.emails[0]}">${SITE.contact.emails[0]}</a> before your visit.</li><li>Look for the help desk at the entrance on the day ${flag('Organiser to confirm')}</li></ul>
  <h2>This website</h2>
  <p>This website is designed to work with screen readers, keyboards, zoom and voice control. Read our <a href="/accessibility-statement/">accessibility statement</a>.</p>
</div></section>`);

simple('/about/', 'About the Expo', 'About Abilities India Expo and its founder Simon George — mission, journey and recognition.',
  { kicker: 'Our story', crumb: 'About', title: 'About the Expo', lead: `${SITE.name} is organised by ${nt(SITE.organiser.name)} and led by its founder, ${nt(SITE.organiser.founder)}.` },
  `<section class="sec"><div class="wrap journey">
  <div class="founder">
    <div class="founder__img">${img('simon-george.png', 'Simon George in his wheelchair')}</div>
    <div><h2 class="h3">Simon George</h2><p>Managing Director &amp; Chairman, ${nt(SITE.organiser.name)}</p></div>
  </div>
  <div class="prose">
    <h2>Mission</h2>
    <p>${SITE.motto}</p>
    <h2>Led by lived experience</h2>
    <p>Simon George was paralysed below the waist in 1986 while studying B.Tech at MA College of Engineering, Kothamangalam, Kerala. Since then he has worked for the empowerment of persons with disabilities. Governments have acted on his suggestions, and the High Court of Kerala and many offices made their buildings accessible following his efforts.</p>
    <ol class="tl">
      <li class="t-purple"><span class="yr">1986</span><div><h3>A turning point</h3><p>Paralysed below the waist while studying engineering.</p></div></li>
      <li class="t-teal"><span class="yr">2015</span><div><h3>National recognition</h3><p>NCPEDP-Mphasis Universal Design Award (New Delhi, 14 Aug 2015) and the Accessible India Award (Kochi, 12 Sep 2015).</p></div></li>
      <li class="t-purple"><span class="yr">2018</span><div><h3>Shaping policy</h3><p>Presentations on accessible tourism (Government of Kerala) and accessible road transport (New Delhi); memorandum on accessible tourism to the Union Minister for Tourism.</p></div></li>
      <li class="t-teal"><span class="yr">2022</span><div><h3>International</h3><p>Delegate from India at the Dubai Accessible Travel and Tourism International Summit.</p></div></li>
      <li class="t-red"><span class="yr">2025</span><div><h3>1st Edition</h3><p>${SITE.firstEdition.venue}, ${SITE.firstEdition.dates}.</p></div></li>
      <li class="t-red is-now"><span class="yr">2026</span><div class="card"><h3>2nd Edition</h3><p>${nt(ev.venue.name)}, Bengaluru, ${ev.datesLabel}.</p></div></li>
    </ol>
    <h2>Flywings Megashow</h2>
    <p>Simon George also founded the Flywings Megashow, a team of performing artists with disabilities — music, cinematic dance, comedy and more.</p>
    <p>A documentary about his work, made by film students from Norway, won international awards.</p>
  </div>
</div></section>`);

simple('/ambassadors/', 'Ambassadors', 'Meet the ambassadors of Abilities India Expo, including Kerala playback singer and Gayatriveena artist Vaikom Vijayalakshmi.',
  { kicker: 'Voices for ability', lead: 'People who champion the abilities of every person.' },
  `<section class="sec"><div class="wrap amb">
  ${img('ambassador.jpg', 'Vaikom Vijayalakshmi smiling')}
  <div><h2>Vaikom Vijayalakshmi</h2><p class="lead">Playback singer</p><p>Born on 7 October 1981, Vaikom Vijayalakshmi is a playback singer from Kerala and an expert in the rare musical instrument Gayatriveena. She received a special jury mention for her much-appreciated work in the 2013 film <i>Celluloid</i>.</p></div>
</div></section>`);

simple('/international-expo/', 'Abilities International Expo 2027', 'Abilities International Expo — planned for Pragati Maidan, New Delhi, in the last week of October 2027.',
  { kicker: 'Planned · 2027', crumb: 'International Expo 2027', lead: 'The organiser plans an international expo for people with disabilities at Pragati Maidan, New Delhi, in the last week of October 2027.' },
  `<section class="sec"><div class="wrap pbody">
  <div class="prose"><h2>Pragati Maidan, New Delhi</h2><p>Pragati Maidan is a venue for large exhibitions and conventions in New Delhi.</p><p>${flag('Planned event — details subject to confirmation')}</p><p><a class="btn" href="/contact/">Register your interest ${icon('arrow-right')}</a></p></div>
  <figure>${img('pragati-maidan.webp', 'Aerial view of the avenue leading to India Gate, New Delhi')}</figure>
</div></section>`);

simple('/gallery/', 'Gallery', 'Photo gallery from Abilities India Expo — moments from the 1st Edition in Kochi, with captions and descriptions for every image.',
  { kicker: 'Moments', lead: 'Highlights from the 1st Edition, Kochi 2025.' },
  `<section class="sec"><div class="wrap prose-wide"><p>${flag('Gallery awaiting approved photos with captions from the organiser')}</p><p>Every photo will have a caption and a text description, and the gallery will be fully usable by keyboard and screen reader.</p></div></section>`);

simple('/media/', 'Media Coverage', 'Media coverage and press information for Abilities India Expo.',
  { kicker: 'Press', crumb: 'Media Coverage', title: 'Media Coverage', lead: 'Print, broadcast and online media — state, national and international — cover the expo.' },
  `<section class="sec"><div class="wrap prose-wide"><h2>Media enquiries</h2><p>Email <a href="mailto:${SITE.contact.emails[1]}">${SITE.contact.emails[1]}</a> or call <a href="tel:${tel}">${SITE.contact.phone}</a>.</p><p>${flag('Press clippings and video links to be supplied by the organiser')}</p></div></section>`);

simple('/faq/', 'Frequently Asked Questions', 'Answers about dates, venue, registration, tickets, refunds and accessibility at Abilities India Expo 2026.',
  { kicker: 'Help', crumb: 'FAQs', lead: 'Quick answers. Can’t find yours? Call or WhatsApp us.' },
  `<section class="sec"><div class="wrap prose-wide">${L.faqList(FAQ, 2)}</div></section>`,
  { ld: [{ '@type': 'FAQPage', mainEntity: FAQ.flatMap(g => g.items.filter(i => !i.verify)).map(i => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })) }] });

const a = SITE.contact.address;
simple('/contact/', 'Contact', 'Contact Abilities India Expo — phone, WhatsApp, email and office address in Kochi.',
  { kicker: 'Get information', lead: 'Questions about visiting, exhibiting, sponsoring or accessibility? Reach us the way that suits you.' },
  `<section class="sec"><div class="wrap contact">
  <ul class="contact__ways">
    <li>${icon('phone')}<span><b>Call</b><a href="tel:${tel}">${SITE.contact.phone}</a></span></li>
    <li>${icon('message-circle')}<span><b>WhatsApp</b><a href="https://wa.me/${SITE.contact.whatsapp}">Chat on WhatsApp</a></span></li>
    <li>${icon('mail')}<span><b>Email</b>${SITE.contact.emails.map(e => `<a href="mailto:${e}">${e}</a>`).join('<br>')}</span></li>
    <li>${icon('map-pin')}<span><b>Address</b><address>${nt(SITE.organiser.name)},<br>${a.line},<br>${a.city} – ${a.postcode}, ${a.region}</address><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent('Valamkottil Towers, Judgemukku, Kakkanad, Kochi 682021')}" target="_blank" rel="noopener">Open in Google Maps</a></span></li>
  </ul>
  <form class="form" id="contact-form" novalidate data-mailto="${SITE.contact.emails[0]}">
    <p class="full kicker">Have questions?</p><h2 class="full">Send message</h2>
    <p class="full form__req">Fields marked <span aria-hidden="true">*</span><span class="sr-only">with an asterisk</span> are required.</p>
    <div class="full" id="form-errors" tabindex="-1" hidden></div>
    <div><label for="f-name">Your name <span aria-hidden="true">*</span></label><input id="f-name" name="name" autocomplete="name" required aria-describedby="e-name"><p class="err" id="e-name" hidden></p></div>
    <div><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"></div>
    <div class="full"><label for="f-email">Email <span aria-hidden="true">*</span></label><input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="e-email"><p class="err" id="e-email" hidden></p></div>
    <div class="full"><label for="f-address">Address</label><input id="f-address" name="address" autocomplete="street-address"></div>
    <div class="full"><label for="f-topic">Topic</label><select id="f-topic" name="topic"><option>Visiting</option><option>Exhibiting</option><option>Sponsoring or partnering</option><option>Accessibility support</option><option>Job Fair</option><option>Media</option><option>Something else</option></select></div>
    <div class="full"><label for="f-msg">Message <span aria-hidden="true">*</span></label><textarea id="f-msg" name="message" required aria-describedby="e-msg"></textarea><p class="err" id="e-msg" hidden></p></div>
    <div class="full"><button class="btn" type="submit">Send message ${icon('send')}</button><p class="hint">This opens your email app with the message ready to send. ${flag('Server-side form handler to be connected')}</p></div>
  </form>
</div></section>`);

const policy = (p, title, crumb, body) => simple(p, title, `${title} of ${SITE.name}, organised by ${SITE.organiser.name}.`, { kicker: 'Policy', crumb, lead: '' },
  `<section class="sec"><div class="wrap prose-wide">${body}</div></section>`, { noindex: true });
policy('/privacy/', 'Privacy Policy', 'Privacy', `<div class="notice" role="note">${icon('info')}<p><b>Draft for the organiser’s legal review.</b> The current live policy wrongly says the site is hosted on Wix and must be replaced.</p></div>
<h2>What this website collects</h2><p>This website does not use advertising or tracking cookies. If you change display options, your choices are stored only in your own browser (local storage) and are never sent to us.</p>
<h2>Registration and payments</h2><p>Registrations and payments are handled by Tickets99, our registration partner, under its own privacy policy. ${flag('Link to Tickets99 privacy policy')}</p>
<h2>Fonts and maps</h2><p>Fonts are loaded from Google Fonts, and venue links open Google Maps. ${flag('Organiser to decide whether to self-host fonts')}</p>
<h2>Translation</h2><p>Where pages are machine-translated, only the website’s own published text is sent to Google Cloud Translation when the site is built. Text you type into forms is never sent for translation.</p>
<h2>Contact</h2><p>${SITE.organiser.name}, ${a.line}, ${a.city} – ${a.postcode}. Email <a href="mailto:${SITE.contact.emails[1]}">${SITE.contact.emails[1]}</a>.</p>`);
policy('/terms/', 'Terms & Conditions', 'Terms', `<div class="notice" role="note">${icon('info')}<p><b>Awaiting organiser-approved text.</b> The live terms are dated 26 July 2023 and refer to the previous website.</p></div><p>${flag('Organiser / legal to supply')}</p>`);
policy('/refund/', 'Refund Policy', 'Refund policy', `<p>Summary of the organiser’s current refund policy for event tickets. ${flag('Organiser to confirm it still applies to Tickets99 registrations')}</p>
<ol class="steps steps--plain"><li><b>No refunds.</b> All ticket sales are final and are not refunded, including when a ticket holder cannot attend.</li><li><b>Transfers allowed.</b> You may transfer your ticket to another person. Tell the organiser the new attendee’s details.</li><li><b>If the event is cancelled,</b> all ticket holders are informed by email.</li><li><b>Accessibility.</b> The organiser is committed to an inclusive event. Please share your access needs in advance.</li></ol>`);

simple('/accessibility-statement/', 'Accessibility Statement', 'Accessibility statement for the Abilities India Expo website — standards, features, known limitations and how to report a problem.',
  { kicker: 'Our commitment', lead: 'We want everyone to be able to use this website, including people who use screen readers, keyboards, magnification, voice control or switch devices.' },
  `<section class="sec"><div class="wrap prose-wide">
  <h2>Standard</h2><p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. Conformance has not yet been independently verified. ${flag('Statement to be finalised after the QA report and organiser approval')}</p>
  <h2>What we have done</h2>
  <ul class="ticks"><li>Semantic structure: one main heading per page, landmarks and a working “Skip to main content” link.</li><li>Every feature works with a keyboard, with a clearly visible focus indicator.</li><li>Text contrast meets WCAG AA; colour is never the only way information is shown.</li><li>Pages reflow at 400% zoom and support 200% text size.</li><li>Forms have visible labels, clear errors and helpful instructions.</li><li>We respect your device’s reduced-motion setting.</li><li>Optional display settings: text size, contrast, spacing, underlined links and a simplified view.</li></ul>
  <h2>Known limitations</h2>
  <ul class="ticks"><li>Registration and payment take place on Tickets99. Its forms and payment providers are tested separately; see the QA report.</li><li>Some partner logos and older photos are awaiting full descriptions.</li><li>Languages other than English are in preparation.</li></ul>
  <h2>Report a problem</h2><p>If anything on this website is hard to use, tell us: call <a href="tel:${tel}">${SITE.contact.phone}</a> or email <a href="mailto:${SITE.contact.emails[0]}">${SITE.contact.emails[0]}</a>. We will respond and help you register another way.</p>
</div></section>`);

/* 404 */
add({ path: '/404.html', file: '404.html', title: `Page not found | ${SITE.name}`, description: 'Page not found.', noindex: true,
  body: `${L.pageHero({ title: 'We can’t find that page', lead: 'The page may have moved during our website update.', trail: [HOME, ['Page not found']] })}
<section class="sec sec--tight"><div class="wrap"><ul class="links big"><li><a href="/programs/">Programs &amp; Registration</a></li><li><a href="/expo/">Explore the Expo</a></li><li><a href="/accessibility/">Accessibility</a></li><li><a href="/contact/">Contact us</a></li></ul></div></section>` });

/* ======================================================================
   WRITE
   ====================================================================== */
require('./pages-b')(L, pages);
require('./pages-b2')(L, pages);
require('./pages-b3')(L, pages); // styled FAQ + policy pages
require('./pages-b4')(L, pages); // page audit fixes // Knowledge Day-style programme pages + venue, MSME, media, gallery, international, terms // VERSION B creative Exhibitors / Visitors
require('./pages-b5')(L, pages); // live-site parity: registration form details, full legal text, no pending notices
fs.rmSync(DIST, { recursive: true, force: true });
const copyDir = (src, dst) => { fs.mkdirSync(dst, { recursive: true }); for (const f of fs.readdirSync(src)) { const s = path.join(src, f), d = path.join(dst, f); fs.statSync(s).isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d); } };
copyDir(path.join(L.ROOT, 'assets'), path.join(DIST, 'assets'));
/* fonts.css is inlined at the top of the single stylesheet (one request, no third-party font host) */
fs.writeFileSync(path.join(DIST, 'assets/css/site.css'), fs.readFileSync(path.join(L.ROOT, 'assets/fonts/fonts.css'), 'utf8') + '\n' + fs.readFileSync(path.join(L.ROOT, 'assets/css/site.css'), 'utf8'));
fs.rmSync(path.join(DIST, 'assets/fonts/fonts.css'));

for (const p of pages) {
  const out = p.file ? path.join(DIST, p.file) : path.join(DIST, p.path, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, L.layout(p));
}
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter(p => !p.noindex).map(p => `  <url><loc>${SITE.baseUrl}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /register/\n\nSitemap: ${SITE.baseUrl}/sitemap.xml\n`);
fs.writeFileSync(path.join(DIST, 'pages.json'), JSON.stringify(pages.map(p => ({ path: p.path, title: p.title, description: p.description, noindex: !!p.noindex })), null, 2));
/* Translated pages (tools/translate.js cache + organiser overrides) for languages marked published */
const pageKey = (pp) => (pp === '/' ? 'index' : pp.replace(/^\/|\/$/g, '').replace(/\//g, '__').replace(/\.html$/, ''));
for (const lg of L.LANGS.filter(l => l.code !== 'en' && l.published)) {
  let n = 0;
  for (const p of pages.filter(x => !x.file && x.path !== '/register/')) {
    const ov = path.join(L.ROOT, 'i18n', 'overrides', lg.code, pageKey(p.path) + '.html');
    const cache = path.join(L.ROOT, 'i18n', 'content', lg.code, pageKey(p.path) + '.json');
    const main = fs.existsSync(ov) ? fs.readFileSync(ov, 'utf8') : fs.existsSync(cache) ? JSON.parse(fs.readFileSync(cache, 'utf8')).html : null;
    if (main == null) continue;
    let html = fs.readFileSync(path.join(DIST, p.path, 'index.html'), 'utf8')
      .replace('<html lang="en">', `<html lang="${lg.code}">`)
      .replace(/(<main id="main" tabindex="-1">)[\s\S]*(<\/main>)/, (m, a, z) => a + main + z)
      .replace(/<link rel="canonical" href="[^"]+">/, `<link rel="canonical" href="${SITE.baseUrl}/${lg.code}${p.path}">`)
      .replace(/ aria-current="true">English/, '>English')
      .replace(new RegExp(`(lang="${lg.code}" hreflang="${lg.code}")`), '$1 aria-current="true"');
    if (!lg.reviewed) html = html.replace('<meta name="description"', '<meta name="robots" content="noindex">\n<meta name="description"');
    const out = path.join(DIST, lg.code, p.path, 'index.html');
    fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html); n++;
  }
  console.log(`  ${lg.code}: ${n} translated page(s)${lg.reviewed ? '' : ' (unreviewed — noindex)'}`);
}

/* Pre-compressed copies (served by http-server -g -b; the .NET host compresses dynamically) */
const zlib = require('zlib');
const walk = (d) => fs.readdirSync(d).flatMap(f => { const p = path.join(d, f); return fs.statSync(p).isDirectory() ? walk(p) : [p]; });
walk(DIST).filter(f => /.(html|css|js|xml|txt|json|svg)$/.test(f)).forEach(f => { const buf = fs.readFileSync(f); fs.writeFileSync(f + '.gz', zlib.gzipSync(buf, { level: 9 })); fs.writeFileSync(f + '.br', zlib.brotliCompressSync(buf)); });
console.log(`Built ${pages.length} pages -> dist/`);
