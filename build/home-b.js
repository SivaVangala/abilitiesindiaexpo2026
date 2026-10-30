/* VERSION B home page (round 10).
   Order: hero → numbers → motto → I am… → explore → about → technology → partners → past edition → accessibility → find your registration.
   Section colours: about half white, half tinted. Every image used once. Short copy. */
module.exports = function homeB(L) {
  const { SITE, CATEGORIES, TICKETS, EXPERIENCES, icon, img, flag, nt } = L;
  const ev = SITE.event;

  const cardPhoto = {
    'assistive-technology-fest': ['assistive-tech.webp', 'A standing power wheelchair shown moving from sitting to standing'],
    'cultural-fest': ['flywings-1.webp', 'Performers with disabilities on stage at a cultural show'],
    'job-fair': ['job-fair.jpg', 'A candidate in a wheelchair handing his CV to a recruiter'],
    'accessible-tourism-fest': ['tourism-fest.jpg', 'Two wheelchair users raising their arms towards a sunset'],
    'awards': ['flywings-2.webp', 'An achiever being honoured on stage'],
    'short-film-fest': ['Film-show.webp', 'Audience watching a film screening'],
    'elderly-services': ['elderly-services-4.jpg', 'A caregiver supporting an elderly man as he walks'],
    'seminars': ['seminars.jpg', 'A speaker presenting at a seminar'],
  };
  const audiences = [
    ['accessibility', 't-red', 'A person with a disability', 'Technology, jobs and free support', '/visitors/#pwd'],
    ['heart-pulse', 't-teal', 'A senior citizen', 'Elderly services and health', '/expo/elderly-services/'],
    ['users', 't-purple', 'A family or caregiver', 'Seminars and care support', '/visitors/#families'],
    ['briefcase', 't-amber', 'Looking for a job', 'Meet employers at the Job Fair', '/programs/job-seeker/'],
    ['building-2', 't-blue', 'An employer', 'Hire talent at the Job Fair', '/programs/employer/'],
    ['store', 't-green', 'An exhibitor or sponsor', 'Stalls and business meets', '/exhibitors/'],
    ['palette', 't-pink', 'An artist or filmmaker', 'Perform or screen your film', '/programs/?cat=stage'],
    ['graduation-cap', 't-orange', 'A professional or NGO', 'Seminars and networking', '/programs/seminar-delegate/'],
  ];
  const tech = [
    ['accessible-vehicle.jpg', 'Accessible vehicles', 'Travel independently', 't-red'],
    ['Virtual-Reality.jpg', 'Virtual reality', 'Therapy and training', 't-purple'],
    ['Stair-Lift.jpg', 'Stair lifts', 'Move between floors safely', 't-teal'],
    ['accessible-construction.jpg', 'Accessible buildings', 'Ramps and barrier-free design', 't-amber'],
    ['Braille-Keyboard.jpg', 'Braille keyboards', 'Type and read by touch', 't-purple'],
    ['hearing-aid.jpg', 'Hearing aids', 'Hear the world clearly', 't-teal'],
  ];
  const gallery = [
    ['gallery-8.jpg', 'Two visitors in wheelchairs, one on a powered attachment, exploring the expo'], ['gallery-3.jpg', 'Visitors at the KELTRON stall'],
    ['gallery-7.jpg', 'Visitors meeting an artist beside her paintings'], ['gallery-4.jpg', 'An exhibitor demonstrating a mobility device'], ['gallery-1.jpg', 'Visitors browsing a handicraft stall'],
  ];
  const statIcons = ['users', 'store', 'presentation', 'mic'];

  const body = `
<!-- 1 · HERO -->
<section class="phhero" aria-labelledby="hero-title" data-speak-section="Introduction">
  <div class="phhero__bg" aria-hidden="true">${img('hero-ai.jpg', '', { eager: true })}</div>
  <div class="wrap phhero__inner">
    <p class="edition-tag">${SITE.edition}</p>
    <h1 id="hero-title"><span class="h1-kicker">${nt(SITE.name)} 2026</span>Every ability has a place here.</h1>
    <p class="lead">Multifaceted International Expo for People With Disabilities (Divyangjan) &amp; the Elderly.</p>
    <ul class="hfacts hfacts--plain">
      <li>${icon('calendar-days')}<span><small>Dates</small><b>${ev.datesLabel}</b></span></li>
      <li><a href="${ev.venue.mapUrl}" target="_blank" rel="noopener">${icon('map-pin')}<span><small>Venue · opens Google Maps</small><b>${nt(ev.venue.name)}, Bengaluru, Karnataka</b></span></a></li>
    </ul>
    <div class="hero__actions">
      <a class="btn btn--red btn--glow" href="/programs/">Register now ${icon('arrow-right')}</a>
      <a class="btn btn--white" href="/expo/">Explore programs</a>
    </div>
    <p class="phhero__credit">AI-generated illustrative image</p>
  </div>
</section>

<!-- 2 · NUMBERS -->
<section class="nband" aria-labelledby="nband-title">
  <h2 id="nband-title" class="sr-only">The expo in numbers</h2>
  <div class="wrap">
    <ul class="nband__list">
      ${SITE.stats.map((s, i) => `<li class="${['t-red', 't-purple', 't-teal', 't-amber'][i]}"><span class="nband__ic">${icon(statIcons[i])}</span><b>${s.value}</b><span>${s.label}</span></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<!-- 3 · OUR MOTTO (text only, highlighted) -->
<section class="motto-c" aria-labelledby="motto-title" data-speak-section="Our motto">
  <span class="motto-c__dot" aria-hidden="true"></span>
  <svg class="motto-c__arc" viewBox="0 0 200 120" aria-hidden="true" focusable="false"><path d="M10 10 C 20 110, 180 110, 190 10" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="14" stroke-linecap="round"/></svg>
  <div class="wrap motto-c__in motto-c__in--pic">
    <figure class="motto-c__pic">
      <span class="motto-c__disc" aria-hidden="true"></span>
      <img src="/assets/img/simon-george.png" alt="Simon George, Founder and Chairman, in his wheelchair" width="301" height="434" loading="lazy" decoding="async">
      <figcaption><b>${nt('Simon George')}</b><span>Founder &amp; Chairman</span></figcaption>
    </figure>
    <div class="motto-c__txt">
      <h2 id="motto-title" class="motto-c__label">${icon('quote')} Our motto</h2>
      <blockquote>
        <p>Empowering people with disabilities &amp; elderly people is the main objective of ${nt('Abilities India Expo')}. To take them out of the underprivileged and distressed life and help to start a new life.</p>
      </blockquote>
      <p class="motto-c__by">${nt('Simon George')} · Founder &amp; Chairman</p>
      <a class="btn btn--white" href="/about/">Our story ${icon('arrow-right')}</a>
    </div>
  </div>
</section>

<!-- 4 · I AM… -->
<section class="sec" aria-labelledby="who-title" data-speak-section="Start here">
  <div class="wrap">
    <div class="sec-head sec-head--center"><div><p class="kicker">Start here</p><h2 id="who-title">I am…</h2><p>Pick what fits you best.</p></div></div>
    <ul class="iam">
      ${audiences.map(([ic, tone, label, sub, href], i) => `<li class="${tone}" data-reveal style="--d:${i * 70}ms"><a href="${href}"><span class="iam__ic">${icon(ic)}</span><b>${label}</b><span class="iam__sub">${sub}</span><span class="iam__go">${icon('arrow-right')}</span></a></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<!-- 5 · EXPLORE THE EXPO -->
<section class="sec sec--lilac" aria-labelledby="explore-title" data-speak-section="Explore the Expo">
  <div class="wrap">
    <div class="sec-head">
      <div><p class="kicker">Explore the Expo</p><h2 id="explore-title">One event. Many ways to take part.</h2></div>
      <a class="btn btn--line" href="/expo/">All 12 experiences ${icon('arrow-right')}</a>
    </div>
    <div class="pgrid">
      ${EXPERIENCES.filter(e => cardPhoto[e.slug]).map((e, i) => { const [f, alt] = cardPhoto[e.slug]; return `<article class="pcard ${e.tone}" data-reveal style="--d:${i * 110}ms">
        <div class="pcard__img">${img(f, alt)}</div>
        <div class="pcard__body">
          <span class="pcard__tag">${icon(e.icon)}${e.group}</span>
          <h3><a href="/expo/${e.slug}/">${e.name}</a></h3>
          <p>${e.summary}</p>
          <span class="pcard__go" aria-hidden="true">Explore ${icon('arrow-right')}</span>
        </div>
      </article>`; }).join('\n      ')}
    </div>
  </div>
</section>

<!-- 6 · ABOUT -->
<section class="sec" aria-labelledby="intro-title" data-speak-section="About the expo">
  <div class="wrap about-c">
    <ul class="about-c__pics">
      <li>${img('gallery-9.jpg', 'Wheelchair users and families walking through the expo aisle')}</li>
      <li>${img('gallery-6.jpg', 'A wheelchair user talking with an exhibitor')}</li>
      <li>${img('gallery-5.jpg', 'An artist in a wheelchair at his painting stall')}</li>
      <li>${img('gallery-2.jpg', 'Visitors at a product stall')}</li>
    </ul>
    <div>
      <p class="kicker">About the expo</p>
      <h2 id="intro-title">A milestone for people waiting for an opportunity.</h2>
      <p>${nt('Abilities India Expo')} will be a milestone in the life of people with disabilities in India who are waiting for opportunities to overcome the limitations of their disability and to succeed in their lives. This expo will take care of elderly people and help them to find happiness in their life.</p>
      <p>The latest assistive technologies, products, services, workshops, live events and online resources can help to overcome the limitations of disabilities and succeed. This expo will help them to enter the mainstream of the society and become self-sufficient.</p>
      <a class="btn" href="/about/">About Us ${icon('arrow-right')}</a>
    </div>
  </div>
</section>

<!-- 7 · TECHNOLOGY: heading, then cards -->
<section class="sec sec--mint" aria-labelledby="tech-title" data-speak-section="Technology and innovation">
  <div class="wrap">
    <div class="sec-head sec-head--center"><div><p class="kicker">Technology and innovation</p><h2 id="tech-title">See it. Try it. Compare it.</h2><p>The latest assistive technology, all in one place.</p></div></div>
    <ul class="tcards">
      ${tech.map(([f, t, d, tone], i) => `<li class="${tone}" data-reveal style="--d:${i * 80}ms"><figure>${img(f, '')}</figure><div><h3>${t}</h3><p>${d}</p></div></li>`).join('\n      ')}
    </ul>
    <p class="center"><a class="btn" href="/expo/assistive-technology-fest/">Assistive Technology Fest ${icon('arrow-right')}</a></p>
  </div>
</section>

<!-- 8 · PARTNERS -->
<section class="sec" aria-labelledby="partners-title" data-speak-section="Partners">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">Exhibitors and partners</p><h2 id="partners-title">Partners of the 1st Edition</h2></div><a class="btn btn--line" href="/sponsors/">Associate with us · Become a sponsor ${icon('arrow-right')}</a></div>
    <p class="partners__lead">${nt('Abilities India Expo')} provides you with an ideal platform to showcase and present your latest solutions, explore growth opportunities for your company in the lucrative Indian market, and connect with key buyers and professionals from various states. ${nt('Abilities India Expo')} 2026 is expected to be the premier event for people with disabilities in India and their caregivers and families. We look forward to your participation in ${nt('Abilities India Expo')} 2026 so that you can join us in our efforts to provide the best services and technologies to improve the lives of people with disabilities.</p>
    <ul class="partners partners--b">
      ${[['partner1.png', 'MSME Development & Facilitation Office, Government of India'], ['partner2.png', 'Kerala Startup Mission'], ['partner3.png', 'K-DISC'], ['partner4.png', 'K Chittilappilly Foundation'], ['partner5.png', 'NCPEDP'], ['partner6.png', 'Aster Medcity'], ['associate.jpg', 'Muthoot Finance']].map(([f, a]) => `<li>${img(f, a)}</li>`).join('\n      ')}
    </ul>
  </div>
</section>

<!-- 9 · PAST EDITION (highlighted colour) -->
<section class="sec sec--past" aria-labelledby="gal-title" data-speak-section="Scenes from the 1st Edition">
  <div class="wrap">
    <div class="sec-head">
      <div><p class="kicker">Real moments</p><h2 id="gal-title">Scenes from the 1st Edition, Kochi 2025</h2></div>
      <a class="btn btn--white" href="/gallery/">Full gallery ${icon('arrow-right')}</a>
    </div>
    <ul class="pastfacts">
      <li>${icon('map-pin')}<span><small>Venue</small><b>Rajiv Gandhi Indoor Stadium, Kochi, Kerala, India</b></span></li>
      <li>${icon('calendar-days')}<span><small>Date</small><b>Jan 31 – Feb 02, 2025</b></span></li>
      <li>${icon('clock')}<span><small>Time</small><b>11 AM – 8 PM</b></span></li>
    </ul>
    <ul class="mosaic mosaic--tight">
      ${gallery.map(([f, alt], i) => `<li class="mosaic__i mosaic__i--${i + 1}"><figure>${img(f, '')}<figcaption>${alt}</figcaption></figure></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<!-- 10 · ACCESSIBILITY -->
<section class="sec" aria-labelledby="acc-title" data-speak-section="Accessibility at the venue">
  <div class="wrap acc">
    <div>
      <p class="kicker">Accessibility at the venue</p>
      <h2 id="acc-title">Support is free, and part of the plan.</h2>
      <p>Tell us what you need when you register.</p>
      <a class="btn" href="/accessibility/">Plan an accessible visit ${icon('arrow-right')}</a>
    </div>
    <ul class="acc__list acc__list--b">
      <li class="t-purple">${icon('hand')}<span><b>Sign language interpreters</b>Free, at the venue</span></li>
      <li class="t-red">${icon('hand-helping')}<span><b>Personal care service</b>Free help when you need it</span></li>
      <li class="t-teal">${icon('cross')}<span><b>Medical service</b>On site during the expo</span></li>
      <li class="t-amber">${icon('accessibility')}<span><b>Accessible restrooms</b>Available at the venue</span></li>
    </ul>
  </div>
</section>

<!-- 11 · FIND YOUR REGISTRATION: white section, one big gradient card with sub-cards -->
<section class="sec" aria-labelledby="final-title" data-speak-section="Find your registration">
  <div class="wrap">
    <div class="regcard">
      <p class="kicker">Register</p>
      <h2 id="final-title">Find your registration</h2>
      <p class="lead">One expo, ${TICKETS.length} ways to take part. Pick the one that fits you.</p>
      <ul class="regbtns regbtns--big">
        ${CATEGORIES.map(c => `<li><a class="regbtn ${c.tone === 't-ink' ? 't-amber' : c.tone}" href="/programs/?cat=${c.id}"><span class="regbtn__ic">${icon(c.icon)}</span><span><b>${c.label}</b><small>${TICKETS.filter(x => x.category === c.id).length} categories</small></span>${icon('arrow-right', 'regbtn__go')}</a></li>`).join('\n        ')}
      </ul>
      <a class="btn btn--red btn--xl btn--glow" href="/programs/">See all ${TICKETS.length} registration categories ${icon('arrow-right')}</a>
    </div>
  </div>
</section>`;

  return {
    path: '/', title: `${SITE.name} 2026 | Disability & Assistive Technology Expo, Bengaluru — 20–22 Dec`,
    description: 'India’s expo for people with disabilities and the elderly: assistive technology, jobs, culture and free support. 20–22 Dec 2026, KTPO Bengaluru.',
    ld: [L.eventLd({ url: SITE.baseUrl + '/' })], body,
  };
};
