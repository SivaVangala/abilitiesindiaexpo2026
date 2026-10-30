/* VERSION B — Exhibitors (feature rows), Visitors (photo tiles), About Us (year timeline),
   Accessibility (creative service page), Ambassadors (large portrait).
   Copy rule from the client: simple headings and one simple line — no long paragraphs. */
module.exports = function pagesB(L, pages) {
  const { SITE, icon, img, flag, nt } = L;
  const HOME = ['Home', '/'];
  const ev = SITE.event;

  /* ---------------- EXHIBITORS — style 1: image + points rows ---------------- */
  const ZONES = [
    { id: 'zone-pwd', name: 'Made by persons with disabilities', icon: 'palette', tone: 't-red', img: 'gallery-5.jpg', alt: 'An artist in a wheelchair at his painting stall',
      items: ["Paintings by PWDs","Handicrafts by PWDs","Garments by PWDs","Other products by PWDs","Agricultural Products by PWDs"] },
    { id: 'zone-mobility', name: 'Mobility & daily living', icon: 'accessibility', tone: 't-purple', img: 'Stair-Lift.jpg', alt: 'A stair lift fitted to a staircase',
      items: ["Mobility products","Orthopedic aids","Wheelchairs, scooters and walkers","Ramps/Lifts","Accessible living","Household and nutrition","Personal hygiene and care","Clothing and aids for personal protection","Travel aids for persons with disabilities and the elderly","Aids for children","Automobiles, vans/conversions","Bathroom equipment","Shower Capsules","Beds, furnishings and accessories","Chairs and accessories","Seating/storage systems and accessories","Clothing and apparel","Aids for daily living","Incontinence products","Interior Decoration","Accessibility Products / Services & Facilities","Equipments for persons with intellectual disability","Building Automation & Facility Management","Electrical & Lighting Solutions","Innovative electronic gadgets","Artificial intelligence and robotics","Virtual Reality"] },
    { id: 'zone-sense', name: 'Hearing, vision & communication', icon: 'ear', tone: 't-teal', img: 'hearing-aid.jpg', alt: 'A hearing aid being fitted',
      items: ["Speech therapy","Communication equipments and softwares","Hearing aids, audiometers","Artificial electronic ear","Artificial electronic larynxes and spare parts for them","Optics & Ophthalmology","Sound and Lighting","Braille writers and Braille writing devices","Braille paper for the production of braille books","Devices for mechanical or computerized production of Braille and recorded material","Canes and electronic aids such as the Sonic Guide","Optical, environmental sensors","Arithmetic aids, geometric aids, electronic measuring devices","Drafts, drawing aids, tactile displays","Specially adapted watches and wristwatches","Talking books and large print books, talking calculators, talking thermometers","Material devices, including articles, instruments and apparatus specially designed for the visually impaired","Aids for improving the mobility of the visually impaired","Technical aids for education, rehabilitation, vocational training and employment of the visually impaired"] },
    { id: 'zone-medical', name: 'Medical & hospital', icon: 'stethoscope', tone: 't-red', img: 'elderly-services-3.jpg', alt: 'A health worker checking an elderly man',
      items: ["Nursing and medical care","Medical equipment","Hospitals & nursing homes","Rehabilitative care/services","Rehabilitation Products","Physiotherapy and Orthopaedics","Orthopedic devices and shoes","Foot and ankle supports and products","Products for the treatment of plantar fasciitis","Instruments and implants for severely physically handicapped patients","Joint replacement and spinal instruments and implants","Implants","External catheters, special jelly cushions to prevent bedsores, urine collection bags","Preventive care, post-operative care, diabetes care, offloading and wound care","Wound Care Products","Pediatric care","Diagnostic products","Dental Products and Services","Patient Monitoring Systems","Life Support systems","OT & ICU Equipments","Endoscopy Equipments","Radiology Equipments","Laboratory Equipments","Surgical Instruments","Sterilisers","Medical Disposables","Consumables","Hospital Beds, Furniture & Floorings","Refurbished Equipments","HVAC and Medical Gas","Laundry Equipments","Housekeeping Solutions","Recycling and Hospital Waste Management","Mannequins and Teaching Equipments","Healthcare Consultants","Healthcare IT Solutions","Telemedicine"] },
    { id: 'zone-fitness', name: 'Fitness, sport & wellness', icon: 'dumbbell', tone: 't-amber', img: 'Virtual-Reality.jpg', alt: 'A person using a virtual reality headset',
      items: ["Equipment and services for exercise, leisure and sports","Physical training, physiotherapy","Yoga and wellness related services","Fitness Equipment","Fitness Services","Pilates Equipment","Vibration Training Equipment","Weight Lifting Equipment","Heart Rate Monitors","Sporting Goods, Athletics, Gymnastics accessories","Sports and Gym flooring","Lockers","Sports training institutes","Leading Gym Chains","Gym/ Fitness Centres","Gym Consultants","Fitness Academies","Alternate therapy clinics","Steam bath and spa","Massage Equipment","Skin Clinics","Fitness Mobile Apps","Fitness and Nutrition Magazines","Workout and Nutritional Guides","Fitness Goal Tracking Software","Body Fat and Workout Tracking Software","Fitness Music and Audio for fitness centres","Fashion accessories","Sports shoes","Branded sporting apparels","Bikes"] },
    { id: 'zone-nutrition', name: 'Nutrition & health food', icon: 'apple', tone: 't-teal', img: 'elderly-services-5.jpg', alt: 'A nutritious meal being served',
      items: ["Sports Nutrition Products","Energy Bars, Gels and Energy Drinks","Dietary and Nutritional Supplements","Health and Organic Food Manufacturers"] },
    { id: 'zone-services', name: 'Services, learning & support', icon: 'graduation-cap', tone: 't-purple', img: 'Trade-Show.webp', alt: 'A busy exhibition hall with visitors at the stalls',
      items: ["Education, coaching and training","Training Institutions","Addiction counseling services (drugs, alcohol)","Insurance and insurance services","Legal services","Industry Consultants","Associations, institutions, organizations","Government Departments","Publications","Residential programme","Accessible tourism services"] },
  ];
  const totalCats = ZONES.reduce((n, z) => n + z.items.length, 0);
  const frow = (g, i) => `<article class="frow ${g.tone}${i % 2 ? ' frow--rev' : ''}" id="${g.id}">
    <figure class="frow__img">${img(g.img, g.alt)}</figure>
    <div class="frow__body">
      <div class="frow__head"><span class="frow__ic">${icon(g.icon)}</span><div><h3>${g.name}</h3><p class="frow__count">${g.items.length} categories</p></div></div>
      <ul class="frow__list">${g.items.map(x => `<li>${x}</li>`).join('')}</ul>
    </div>
  </article>`;
  const exhibitors = {
    path: '/exhibitors/', title: `Exhibitors — Zones, Categories & Stall Booking | ${SITE.name} 2026`,
    description: `Exhibit at ${SITE.name} 2026 in Bengaluru: ${totalCats} categories across 7 zones, business meets and the MSME stall grant.`,
    trail: [HOME, ['Exhibitors']],
    body: `${L.pageHero({ kicker: 'Showcase success', title: 'Exhibitors', trail: [HOME, ['Exhibitors']],
      lead: 'Show your products to the people they are built for.',
      extra: `<div class="hero__actions"><a class="btn btn--red" href="/programs/exhibitor/">Book a stall ${icon('arrow-right')}</a></div>` })}
<section class="sec" aria-labelledby="why-ex">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">Showcase success</p><h2 id="why-ex">Why exhibit with us</h2></div></div>
    <div class="exwhy">
      <p>The presentation of the latest and best products and services in the Expo interested in what our country has to offer them. The successful participation and hope to close deals and communicate well with industry players and meet people with disabilities and potential buyers.</p>
      <p><b>The best exhibit opportunities:</b> Showcase your coveted technologies and valued services to a wide audience of buyers, distributors and potential business partners. At this Expo, key sectors come together to give people the opportunity to discover the products and solutions that help people with disabilities make the most of their lives.</p>
    </div>
    <ul class="klist exben">${['Exhibiting products/services by more than 1000 exhibitors from different states of India', 'Gain consumer confidence in your products/services', 'Increase awareness of your brand', 'Generate revenue', 'Strengthen the bond with your existing customers', 'Network face-to-face with industry peers', 'Showcase new developments and products', 'Increase sales rate through face-to-face demonstrations', 'Speak directly to your audience', 'Stay competitive in your market'].map((x, i) => `<li class="${['t-red', 't-purple', 't-teal', 't-amber'][i % 4]}">${icon('check')}${x}</li>`).join('')}</ul>
    <div class="trio">
      <article class="trio__c t-red"><span class="trio__n" data-n="01" aria-hidden="true"></span>${icon('users')}<h3>Meet your audience</h3><p>Users, families, therapists and buyers in one place.</p></article>
      <article class="trio__c t-purple"><span class="trio__n" data-n="02" aria-hidden="true"></span>${icon('hand')}<h3>Demonstrate live</h3><p>Let visitors try your product face to face.</p></article>
      <article class="trio__c t-teal"><span class="trio__n" data-n="03" aria-hidden="true"></span>${icon('trending-up')}<h3>Grow your business</h3><p>Meet dealers, distributors and partners.</p></article>
    </div>
  </div>
</section>
<section class="sec sec--lilac" id="zones" aria-labelledby="zones-h">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">Our exhibitors</p><h2 id="zones-h">List of exhibitors — ${totalCats} categories in 7 zones</h2></div></div>
    <div class="frows">${ZONES.map(frow).join('\n    ')}</div>
  </div>
</section>
<section class="sec" aria-labelledby="reg-ex">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">Take part</p><h2 id="reg-ex">Ways to exhibit</h2><p>Those who are interested to exhibit your products, please contact us.</p></div><a class="btn btn--line" href="/contact/">Contact us ${icon('arrow-right')}</a></div>
    <div class="tgrid tgrid--4">${['exhibitor', 'assistive-tech-innovator', 'business-meet', 'shopping-fest-seller'].map(s => L.ticketCard(L.ticketBySlug(s), 3)).join('')}</div>
  </div>
</section>
<section class="sec sec--peach" id="msme" aria-labelledby="msme-h">
  <div class="wrap msme">
    <span class="msme__ic">${icon('badge-indian-rupee')}</span>
    <div><h2 id="msme-h">MSME stall grant</h2><p>Eligible MSEs can apply for financial assistance on stall rent through the Ministry of MSME portal.</p></div>
    <a class="btn" href="/msme-stall-grant/">How the grant works ${icon('arrow-right')}</a>
  </div>
</section>`,
  };

  /* ---------------- VISITORS — style 2: photo tiles ---------------- */
  const GROUPS = [
    { id: 'pwd', name: 'People & families', icon: 'heart-handshake', tone: 't-red', img: 'gallery-9.jpg', alt: 'Wheelchair users and families walking through the expo aisle', line: 'Persons with disabilities, elders and their families.',
      items: ["Persons with disabilities, Elderly and sick people & their Families","End Users of disability products","Residents associations","Different clubs","General fitness","Wellness and beauty enthusiasts"] },
    { id: 'health', name: 'Health & rehabilitation', icon: 'stethoscope', tone: 't-teal', img: 'elderly-services-1.jpg', alt: 'A caregiver with an elderly person', line: 'Doctors, therapists and care centres.',
      items: ["Medical Specialists, Therapists, Physicians","Doctors – Physicians & Surgeons","Physiotherapists and doctors","Healthcare Professionals and paramedical staff","Healthcare Consultants","Crews of Centres, Clinics and Hospitals for disabilities and rehabilitation","Hospitals & Nursing home owners & Decision Makers","Owners of Diagnostic & other Healthcare Centers","Medical Directors","Biomedical Engineers"] },
    { id: 'families', name: 'Government & community', icon: 'landmark', tone: 't-purple', img: 'seminars.jpg', alt: 'A speaker presenting at a seminar', line: 'Officials, NGOs, schools and educators.',
      items: ["Government officials","Key policy makers from the governmental sectors","Procurement Officials","NGOs","Associations for disabled People","Educators, Social Workers, Volunteers","Schools, Colleges & Universities","Academicians","Influencers, Decision makers"] },
    { id: 'trade', name: 'Trade & business', icon: 'briefcase', tone: 't-amber', img: 'business-meets.jpg', alt: 'A business meeting that includes a wheelchair user', line: 'Buyers, dealers and distributors.',
      items: ["Online and offline traders of disability products","Dealers Distributors & Manufacturers of Medical Equipments","Retailers","Importers","Exporters","Merchant associations","Purchase Managers","Purchase managers and fitness facilitators from Corporate India","Consultants & Professionals","Mall owners","Accessible tourism and Medical tourism companies"] },
    { id: 'design', name: 'Design & sport', icon: 'drafting-compass', tone: 't-teal', img: 'accessible-construction.jpg', alt: 'An accessible ramp at a building entrance', line: 'Architects, designers and sports bodies.',
      items: ["Engineers, Architects and designers in disabled people environment","Administrators of Public Sports Facilities","Sports Authorities","Athletic Federation & Clubs","Sports Associations"] },
    { id: 'fitness', name: 'Fitness & wellness', icon: 'dumbbell', tone: 't-red', img: 'tourism-fest.jpg', alt: 'Two wheelchair users raising their arms towards a sunset', line: 'Gyms, yoga, spas and nutrition experts.',
      items: ["Fitness clubs","Gyms","Aerobics & Yoga Centres","Salons","Spas & Wellness studios","Training Institutions for martial arts and fitness","Dance institutions","Fitness Trainers","Dieticians","Nutritionists","Beauticians","Spa Therapists"] },
  ];
  const visitors = {
    path: '/visitors/', title: `Visitors — Who Visits & Plan Your Visit | ${SITE.name} 2026`,
    description: 'Who visits Abilities India Expo 2026 and how to plan your visit: register, tell us your needs, explore the zones and enjoy the evening Cultural Fest.',
    trail: [HOME, ['Visitors']],
    body: `${L.pageHero({ kicker: 'Our visitors', title: 'Visitors', trail: [HOME, ['Visitors']],
      lead: 'More than 50,000 people from different states of India will visit this expo.',
      extra: `<div class="hero__actions"><a class="btn btn--red" href="/programs/visitor/">Register to visit ${icon('arrow-right')}</a></div>` })}
<section class="sec" aria-labelledby="meet-h">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">Who you’ll meet</p><h2 id="meet-h">Six communities, one expo</h2></div></div>
    <div class="ptiles">
      ${GROUPS.map(g => `<article class="ptile ${g.tone}" id="${g.id}">
        <div class="ptile__img">${img(g.img, g.alt)}<span class="ptile__ic">${icon(g.icon)}</span></div>
        <div class="ptile__body">
          <h3>${g.name}</h3>
          <p>${g.line}</p>
          <details><summary><span class="sa-open">See all ${g.items.length}</span><span class="sa-close">Close list</span> ${icon('chevron-down')}</summary><ul>${g.items.map(i => `<li>${i}</li>`).join('')}</ul></details>
        </div>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>
<section class="sec sec--mint" id="journey" aria-labelledby="jr-h">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">Your visit</p><h2 id="jr-h">Five easy steps</h2></div></div>
    <ol class="journey-b">
      <li class="t-red">${icon('ticket')}<h3>Register</h3><p>Choose <a href="/programs/visitor/">Visitor Registration</a>.</p></li>
      <li class="t-purple">${icon('hand-helping')}<h3>Tell us your needs</h3><p>We prepare support for you.</p></li>
      <li class="t-teal">${icon('map-pin')}<h3>Arrive at KTPO</h3><p><a href="${ev.venue.mapUrl}" target="_blank" rel="noopener">Open in Google Maps</a></p></li>
      <li class="t-amber">${icon('compass')}<h3>Explore</h3><p>Technology, jobs and free seminars.</p></li>
      <li class="t-red">${icon('music')}<h3>Enjoy the evening</h3><p>Cultural Fest every evening.</p></li>
    </ol>
  </div>
</section>`,
  };

  /* ---------------- ABOUT US — year timeline (all years from the live site) ---------------- */
  const YEARS = [
    ['1986', 't-purple', 'A turning point', 'Paralyzed below his waist down while studying for B Tech at MA College of Engineering Kothamangalam, Ernakulam district, Kerala.', null],
    ['1990', 't-teal', 'Work begins', 'Working for the empowerment of persons with disabilities since 1990 — pre matrimonial meets, mass marriages, job fairs, exhibitions, seminars, cultural programs and campaigns for accessibility. Covered by BBC and CNN.', null],
    ['2008', 't-red', 'Accessible hotels', 'India Government ordered that accessible rooms with toilets are mandatory for 3 star and above category hotels, on his request in 2008.', null],
    ['2015', 't-purple', 'Mphasis Award', 'Simon George was honoured for his accessible India campaign with the NCPEDP-Mphasis Universal Design Award 2015 by Hon’ble Indian Railway Minister Mr. Suresh Prabhu in an award ceremony function at Indian International Centre New Delhi (14/08/2015).', 'award-mphasis.webp'],
    ['2015', 't-teal', 'Accessible India Award', 'Mr. Simon George was honoured for his accessible India Campaign (To make India accessible) by Mr. Oommen Chandy, Hon. Chief Minister of Kerala on 12th September 2015 at Kochi.', 'award-accessible-india.webp'],
    ['2018', 't-red', 'Presentation on accessible road transport', 'He had done a power point presentation on accessible road transport in New Delhi on 30th May 2018. India Government accepted his many suggestions. The India Government is trying to implement it.', 'presentation-transport.webp'],
    ['2018', 't-amber', 'Memorandum for accessible tourism', 'He gave a memorandum to Hon. Union Minister for tourism Mr. K. J. Alphons on 30th May 2018 at New Delhi for bringing accessible tourism in India at international level. According to his suggestions India government is trying to implement accessible tourism in India.', 'memorandum.webp'],
    ['2018', 't-purple', 'Presentation & workshops', 'Simon George had done a PowerPoint presentation on accessible tourism for government of Kerala on 27th June 2018 at Thiruvananthapuram. Through his consistent efforts Government of Kerala is introducing ‘Accessible Tourism’ as a special service to promote tourism of persons with disabilities in the State. He conducted workshops for government officials and university students on accessible tourism.', 'workshop.png'],
    ['2022', 't-teal', 'Access Abilities Expo in Dubai', 'Attended Dubai Accessible Travel and Tourism International Summit in November 2022 as a delegate from India.', 'dubai-4.jpg'],
    ['2025', 't-red', '1st Edition', 'Abilities India Expo 1st Edition, Rajiv Gandhi Indoor Stadium, Kochi, Kerala · Jan 31 – Feb 02, 2025.', 'gallery-6.jpg'],
    ['2026', 't-amber', '2nd Edition', `${ev.venue.name}, Bengaluru · ${ev.datesLabel}. Both B2B and B2C.`, null],
  ];
  const about = {
    path: '/about/', title: `About Us — Simon George & Our Story | ${SITE.name}`,
    description: 'The story behind Abilities India Expo: founder Simon George, work for persons with disabilities since 1990, national awards and the Flywings Megashow.',
    trail: [HOME, ['About Us']],
    body: `${L.pageHero({ kicker: 'Our story', title: 'About Us', trail: [HOME, ['About Us']], lead: 'Experience in empowering persons with disabilities.' })}
<section class="sec" aria-labelledby="bio-h">
  <div class="wrap bio">
    <figure class="bio__img">${img('simon-george.png', 'Simon George in his wheelchair')}<figcaption><b>${nt('Simon George')}</b>Managing Director &amp; Chairman, ${nt('Walshal Abilities And Assistive Technologies Pvt Ltd')}</figcaption></figure>
    <div class="bio__text">
      <p class="kicker">Our founder</p>
      <h2 id="bio-h">Simon George</h2>
      <p class="lead">Experience in empowering persons with disabilities.</p>
      <p>SIMON GEORGE is a person paralyzed below his waist down while he was studying for B Tech in 1986 at MA College of Engineering Kothamangalam, Ernakulam district, Kerala, India. After surviving his disability with positive mind, he was working for the empowerment of persons with disabilities since 1990. He organized many events like pre matrimonial meets for selecting life partners, mass marriages, job fairs, exhibitions, seminars, cultural programs, campaign for accessibility etc. Pre-marital meets and mass marriages of persons with disabilities were covered by BBC and CNN.</p>
      <p>He gave many suggestions to government for the empowerment of persons with disabilities and the government implemented it. He worked for bringing accessibility everywhere. High Court of Kerala and many offices brought accessibility in their buildings on his request. India Government ordered that accessible rooms with toilets are mandatory for 3 star and above category hotels, on his request in 2008. And the government brought accessibility in public places and railways.</p>
      <p class="bio__connect"><b>Connect me!</b> <a href="https://www.facebook.com/people/Simon-George/100076405826632/" target="_blank" rel="noopener">${icon('facebook')} Facebook</a> <a href="https://www.linkedin.com/in/simon-george-02156870" target="_blank" rel="noopener">${icon('linkedin')} LinkedIn</a></p>
    </div>
  </div>
</section>
<section class="sec sec--mint" aria-labelledby="doc-h">
  <div class="wrap kabout">
    <div><p class="kicker">Documentary film</p><h2 id="doc-h">A film from Norway</h2>
      <p>The film students from Norway came to Kochi and made a documentary film about him and his activities. They got international awards for that.</p></div>
    <figure class="kabout__img t-teal">${img('norway-students.webp', 'Film students from Norway with Simon George')}</figure>
  </div>
</section>
<section class="sec sec--lilac" aria-labelledby="tl-h">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">Year by year</p><h2 id="tl-h">The journey</h2></div></div>
    <ol class="ytl">
      ${YEARS.map(([y, tone, h, p, pic]) => `<li class="${tone}"><span class="ytl__y">${y}</span><div class="ytl__card">${pic ? `<figure>${img(pic, h)}</figure>` : ''}<div><h3>${h}</h3><p>${p}</p></div></div></li>`).join('\n      ')}
    </ol>
  </div>
</section>
<section class="sec" aria-labelledby="fly-h">
  <div class="wrap fly">
    <div>
      <p class="kicker">Flywings Megashow</p>
      <h2 id="fly-h">Flywings Megashow Team</h2>
      <p>Simon George started a mega show team of artists among persons with disabilities. There are so many artists among specially abled. But many of them don’t have opportunities. Flywings Megashow is promoting them. They can perform music, cinematic dance, comedy, drama, magic show, wheelchair dance, classical dance, classical music etc. They can sing songs in many languages in the world.</p>
      <a class="btn" href="/expo/cultural-fest/">Cultural Fest ${icon('arrow-right')}</a>
    </div>
    <ul class="fly__grid fly__grid--9">${['flywings-1.webp', 'flywings-2.webp', 'flywings-3.webp', 'flywings-4.webp', 'flywings-5.webp', 'flywings-6.webp', 'flywings-7.webp', 'flywings-8.webp', 'flywings-9.webp'].map((f, i) => `<li>${img(f, i === 0 ? 'Flywings Megashow artists performing on stage' : '')}</li>`).join('')}</ul>
  </div>
</section>
<section class="sec sec--peach" aria-labelledby="dxb-h">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">November 2022</p><h2 id="dxb-h">Access Abilities Expo in Dubai</h2><p>Attended Dubai Accessible Travel and Tourism International Summit in November 2022 as a delegate from India.</p></div></div>
    <ul class="kgal kgal--6">${['dubai-1.jpg', 'dubai-2.jpg', 'dubai-3.jpg', 'dubai-4.jpg', 'dubai-5.jpg', 'dubai-6.jpg'].map((f, i) => `<li><figure>${img(f, i === 0 ? 'Simon George and other delegates at the AccessAbilities Expo and summit in Dubai' : '')}</figure></li>`).join('')}</ul>
  </div>
</section>
<section class="sec" aria-labelledby="co-h">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">The company</p><h2 id="co-h">${nt('Walshal Abilities And Assistive Technologies Private Limited')}</h2><p>CIN – U82300KL2023PTC080913</p></div></div>
    <div class="co">
      <div>
        <p>Empowering people with disabilities and services for the elderly in India are the main objective of ${nt('Walshal Abilities and Assistive Technologies Private Limited')}. To take them out of the underprivileged and distressed life and help them to start a new life.</p>
        <p>Launching of ${nt('Walshal Abilities and Assistive Technologies Private Limited')} will be a milestone in the life of people with disabilities in India who are waiting for opportunities and assistive technologies to overcome the limitations of their disability and succeed in their lives. The latest assistive technology products, services and digital resources can help them to overcome the limitations of disabilities and succeed. Our company will help them to enter the mainstream of the society and become self-sufficient. Our company will find solutions for disability, mobility, accessibility and self-sufficiency by introducing new assistive technologies and creating unlimited opportunities.</p>
      </div>
      <div class="co__obj"><h3>Our Objectives</h3>
        <ul class="klist klist--1">${['Organizing Abilities India Expos', 'Research, manufacture and market different equipments using assistive technology for people with disabilities, elderly and sick people', 'Providing accessible tourism services', 'Accessible cab services', 'Services for the elderly', 'Constructing accessible homes and buildings', 'Marketing products made by people with disabilities', 'Consulting services related to people with disabilities for startups, companies, local government bodies and government departments'].map((x, i) => `<li class="${['t-red', 't-purple', 't-teal', 't-amber'][i % 4]}">${icon('check')}${x}</li>`).join('')}</ul>
      </div>
    </div>
  </div>
</section>`,
  };

  /* ---------------- ACCESSIBILITY — creative service page ---------------- */
  const accessibility = {
    path: '/accessibility/', title: `Accessibility & Visitor Assistance | ${SITE.name} 2026`,
    description: 'Free support at Abilities India Expo 2026: sign language interpreters, personal care, medical service and accessible restrooms. How to ask for help.',
    trail: [HOME, ['Accessibility']],
    body: `${L.pageHero({ kicker: 'Plan an accessible visit', title: 'Accessibility', trail: [HOME, ['Accessibility']], lead: 'Free support for every visitor. Just ask.',
      extra: `<div class="hero__actions"><a class="btn btn--red" href="#ask">Ask for support ${icon('arrow-right')}</a></div>` })}
<section class="sec" aria-labelledby="svc-h">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">Free at the venue</p><h2 id="svc-h">Our free services</h2></div></div>
    <ul class="svc">
      <li class="t-purple"><span class="svc__ic">${icon('hand')}</span><h3>Sign language</h3><p>Interpreters at the venue.</p></li>
      <li class="t-red"><span class="svc__ic">${icon('hand-helping')}</span><h3>Personal care</h3><p>Help whenever you need it.</p></li>
      <li class="t-teal"><span class="svc__ic">${icon('cross')}</span><h3>Medical service</h3><p>On site, all day.</p></li>
      <li class="t-amber"><span class="svc__ic">${icon('accessibility')}</span><h3>Accessible restrooms</h3><p>Across the venue.</p></li>
    </ul>
  </div>
</section>
<section class="sec sec--mint" aria-labelledby="venue-h" id="venue">
  <div class="wrap venue-b">
    <figure class="venue-b__img">${img('ktpo.webp', 'KTPO International Exhibition and Convention Centre, Bengaluru')}</figure>
    <div>
      <p class="kicker">The venue</p>
      <h2 id="venue-h">${nt('KTPO')}, Bengaluru</h2>
      <p class="lead">${nt(ev.venue.name)}</p>
      <ul class="checks">
        <li>${icon('hand-helping')}Free personal care service</li>
        <li>${icon('hand')}Sign language interpreters</li>
        <li>${icon('accessibility')}Accessible rest rooms</li>
      </ul>
      <a class="btn" href="${ev.venue.mapUrl}" target="_blank" rel="noopener">${icon('map-pin')} Open in Google Maps</a>
    </div>
  </div>
</section>
<section class="sec" aria-labelledby="ask" id="ask">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">Need help?</p><h2>Ask for support</h2></div></div>
    <div class="ask">
      <a class="ask__c t-red" href="tel:${L.tel}">${icon('phone')}<b>Call</b><span>${SITE.contact.phone}</span></a>
      <a class="ask__c t-teal" href="https://wa.me/${SITE.contact.whatsapp}">${icon('message-circle')}<b>WhatsApp</b><span>Chat with us</span></a>
      <a class="ask__c t-purple" href="mailto:${SITE.contact.emails[0]}">${icon('mail')}<b>Email</b><span>${SITE.contact.emails[0]}</span></a>
      <a class="ask__c t-amber" href="/programs/visitor/">${icon('ticket')}<b>Register</b><span>Tell us your needs</span></a>
    </div>
  </div>
</section>
<section class="sec sec--lilac" aria-labelledby="site-h">
  <div class="wrap web-a11y">
    <div><p class="kicker">This website</p><h2 id="site-h">Use it your way</h2><p>Buttons on the right side of every page:</p></div>
    <ul>
      <li>${icon('universal-access')}<b>Accessibility Tools</b><span>Text size, contrast, colours</span></li>
      <li>${icon('languages')}<b>Language</b><span>6 Indian languages</span></li>
      <li>${icon('volume-2')}<b>Listen</b><span>Read the page aloud</span></li>
      <li>${icon('mic')}<b>Speak</b><span>Say “I want to register”</span></li>
    </ul>
  </div>
</section>`,
  };

  /* ---------------- AMBASSADORS — large portrait ---------------- */
  const ambassadors = {
    path: '/ambassadors/', title: `Ambassadors | ${SITE.name}`,
    description: 'Meet the ambassadors of Abilities India Expo, including Kerala playback singer and Gayatriveena artist Vaikom Vijayalakshmi.',
    trail: [HOME, ['Ambassadors']],
    body: `${L.pageHero({ kicker: 'Voices for ability', title: 'Ambassadors', trail: [HOME, ['Ambassadors']], lead: 'People who champion every ability.' })}
<section class="sec" aria-labelledby="amb-h">
  <div class="wrap amb-b">
    <figure>${img('ambassador.jpg', 'Vaikom Vijayalakshmi smiling')}</figure>
    <div>
      <p class="kicker">Ambassador</p>
      <h2 id="amb-h">Vaikom Vijayalakshmi</h2>
      <p class="lead">Play Back Singer</p>
      <p>Vaikom Vijayalakshmi was born on 7 October 1981. She is an Indian playback singer from Kerala, India and an expert in a rare musical instrument called Gayatriveena. She won special jury mention for her much appreciated work in the 2013 film <i>Celluloid</i>. She was honoured with Kerala Sree Award, third highest civilian award given by the Government of Kerala.</p>
      <ul class="bio__facts">
        <li>${icon('music')}Expert in the rare instrument Gayatriveena</li>
        <li>${icon('award')}Special jury mention for the 2013 film <i>Celluloid</i></li>
        <li>${icon('calendar-days')}Born 7 October 1981</li>
        <li>${icon('medal')}Kerala Sree Award, third highest civilian award of the Government of Kerala</li>
      </ul>
    </div>
  </div>
</section>`,
  };

  for (const p of [exhibitors, visitors, about, accessibility, ambassadors]) { const i = pages.findIndex(x => x.path === p.path); if (i > -1) pages[i] = p; }
};
