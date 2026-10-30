/* VERSION B — live-site parity (29 Oct 2026).
   1. Registration pages list every field and option of the live website's registration forms
      (the same questions are set up on the Tickets99 registration form).
   2. Privacy, Refund and Terms pages carry the live website's full text, word for word.
   3. No "pending" notices on any page. */
module.exports = function pagesB5(L, pages) {
  const { SITE, icon, esc, tel } = L;
  const LEGAL = require('../content/legal');
  const HOME = ['Home', '/'];
  const TONES = ['t-red', 't-purple', 't-teal', 't-amber', 't-blue', 't-green'];
  const get = (p) => pages.find(x => x.path === p);
  const link = (t) => esc(t).replace(/(https?:\/\/[^\s<]+?)([.,)]?)(?=\s|$)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>$2')
    .replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>');

  /* ---------- 1. registration form details ---------- */
  const ADDRESS = ['Street Address', 'Street Address Line 2', 'City', 'Region/State/Province', 'Postal / Zip code', 'Country'];
  const DISABILITY = ['Blindness', 'Low-vision', 'Leprosy Cured persons', 'Hearing Impairment (deaf and hard of hearing)', 'Locomotor Disability', 'Dwarfism', 'Intellectual Disability', 'Mental Illness', 'Autism Spectrum Disorder', 'Cerebral Palsy', 'Muscular Dystrophy', 'Chronic Neurological conditions', 'Specific Learning Disabilities (Dyslexia)', 'Multiple Sclerosis', 'Speech and language disability', 'Thalassemia', 'Hemophilia', 'Sickle cell disease', 'Multiple Disabilities including deaf-blindness', 'Acid Attack Victim', 'Parkinson’s disease'];
  const QUALS = ['B.A', 'B.B.A', 'B.Com', 'BCA', 'B.Arch', 'B.Ed', 'BDS', 'BHM', 'B.Pharm', 'B.Sc', 'B.Tech/B.E', 'MBBS', 'LLB', 'Diploma', 'BVSC', 'CA', 'CS', 'ICWA', 'LLM', 'Integrated PG', 'M.A', 'M.Arch', 'M.Com', 'M.Ed', 'M.Pharm', 'M.Sc', 'M.Tech', 'MBA/PGDM', 'MCA', 'MS', 'PG Diploma', 'MVSC', 'MCM', 'MSW'];
  const FIELDS_OF_WORK = ['Developer', 'Product Manager', 'Graphic Designer', 'UX Design & Architecture', 'IT & Information Security', 'Engineering - Hardware & Network', 'Teaching & Training', 'Data Science & Analytics', 'Project & Program Management', 'Consulting', 'Production & Manufacturing', 'Human Resources', 'Healthcare & Life Sciences', 'BFSI Investments & Trading', 'Marketing & Communication', 'Finance & Accounting', 'Customer Service & Operations', 'Food', 'Research & Development', 'Administration & Facilities', 'Content', 'Construction & Site Engineering', 'Procurement & Supply Chain', 'Product Management', 'Media Production & Entertainment', 'Sales & Business Development', 'Engineering - Software & QA', 'Other'];
  const FORMS = {
    visitor: { title: 'Expo registration form', groups: [['Your details', ['First Name', 'Last Name', 'Email', 'Phone', 'Address', 'Message']]] },
    exhibitor: { title: 'Exhibitor registration form', groups: [
      ['Your details', ['Company/ NGO', 'First Name', 'Last Name', 'Email', 'Phone', 'Website', ...ADDRESS]],
      ['Stall category', ['ABA Therapy', 'Adaptive Sports and Recreation', 'Counseling and Psychology Services', 'Educational Services / Support', 'Healthcare Equipments and Services', 'Rehabilitation Services', 'SLP, PT, OT and Rec Therapy', 'Universal Standard Guide', 'Mobile App', 'Family Nutrition Support and Guidance', 'Adaptive Equipments', 'Visually impaired/ Low vision Services', 'Hearing Speech services', 'Disability Advocacy', 'Job Fair', 'Accessible Vehicles', 'Financial Assistance', 'Accessible Tourism', 'Medical Services - Allopathy, Ayurveda, Homeopathy etc.', 'Insurance and Insurance services', 'Yoga and wellness Related services', 'Nursing & Medical Care', 'Fitness Equipment & Services', 'Paintings and Handicrafts', 'Accessible home equipments', 'Any other category, please fill']],
      ['Vendor option', ['Standard Vendor', 'Sponsor']],
      ['Stall size', ['2m x 2m', '3m x 2m', '3m x 3m', 'Table Space', 'Any other stall size, please mention']],
      ['Agreement', ['I accept Terms & Conditions']]] },
    'achievement-award': { title: 'Achievement Award registration form', groups: [
      ['Your details', ['Company', 'First Name', 'Last Name', 'Email', 'Phone', ...ADDRESS]],
      ['Types of disability', DISABILITY],
      ['Documents and awards', ['Upload disability certificate', 'Any Awards Earlier']]] },
    'assistive-technology-award': { title: 'Assistive Technology Awards registration form',
      intro: ['Please fill out the form below to enter the Assistive Technology Awards.', 'The Winners: The winners receive a customised trophy award in the post and digital badge, are mentioned in an article which is sent out on our social media channels and in our e-newsletter.', 'If you are having issues with the form, please contact us at: abilitiesindiaexpo@gmail.com with your submission and we will issue your invoice.'],
      groups: [
      ['Your details', ['Company', 'First Name', 'Last Name', 'Email', 'Phone', ...ADDRESS]],
      ['Choose your category', ['Best Assistive Technology Solution of the Year', 'Best New Assistive Technology Solution of the Year', 'Best Innovative project of the year', 'Best solution for safety', 'Best solution for emergencies', 'Best solution for memory', 'Best Mental health solution', 'Best communication solution', 'Best solution for comfort', 'Best solution for monitoring', 'Best Telecare solution', 'Best telehealth solution', 'Best Assistive Technology App', 'Best Sensory Solution', 'Best Personal care solution', 'Best Mobility solution', 'Best Transport solution', 'Best Rehabilitation solution', 'Best software solution', 'Best Elderly Care Solution', 'Best Solution for children']],
      ['About your entry', ['Solution name to go on the award if successful', 'Overview of your solution/project', 'Details of how your solution has been implemented', 'The result and impact the solution has had on end users / customers', 'Short description of your entry that can be used publicly in materials and promotions', 'Upload an image of your project', 'Upload your logo', 'Agree Privacy Policy & Terms And Conditions']]] },
    employer: { title: 'Employer registration form', groups: [
      ['Company details', ['Company/ Organisation Name', 'Year of establishment', 'Email', 'Phone', 'Type', 'Website', 'No. of Employees', ...ADDRESS]],
      ['Job details', ['Job Title', 'Description', 'Reference Email', 'Reference Phone Number', 'Salary', 'Qualification', 'Key Skills', 'Time — Full Time / Part Time / Other', 'Experience', 'Gender Preference — Male / Female', 'Vacancy']]] },
    'job-seeker': { title: 'Job Seeker registration form', kicker: 'Unlocking opportunities', groups: [
      ['Your details', ['First Name', 'Last Name', 'Email', 'Phone', ...ADDRESS]],
      ['Educational Qualification', [...QUALS, 'If others specify']],
      ['Position for which you are applying for?', [...FIELDS_OF_WORK, 'If other, kindly specify']],
      ['Work and documents', ['Preferred working mode — Full Time / Part Time', 'Have you previously worked — Yes / No', 'Year of Experience', 'Upload your CV', 'Upload your disability certificate']]] },
    'cultural-fest-performer': { title: 'Registration form for the Inclusive Cultural Fest', kicker: 'Celebrating abilities and artistry', groups: [
      ['Team details', ['Name of Organisation/ Individual', 'Team Leader Name', 'Participant Name', 'Phone', 'Email', 'No: of team Members', 'Name of Program', 'Team Details', ...ADDRESS]],
      ['Choose programme', ['Battle of band', 'Group dance (bubble dance, LED dance, magic dance)', 'Music', 'Instrumental special', 'Comedy Show', 'Fashion Show', 'Wheelchair Dance', 'Kathak', 'Classical dance', 'Cinematic Dance', 'Magic Show']],
      ['More details', ['Hotel Accommodation (including charges for accommodation, food and travelling) — Yes / No', 'Any Awards', 'Upload Programme Sample', 'Upload disability certificate']]] },
    'short-film-entry': { title: 'Registration form for the Short Film Fest', kicker: 'Celebrating abilities and artistry', groups: [
      ['Film details', ['Short Film Name', 'Director Name', 'Email', 'Contact Number', 'WhatsApp Number', ...ADDRESS, 'Film Synopsis', 'Producer / Production Name', 'Artists List', 'Technicians List']],
      ['A few questions', ['Is this your first time registering? — Yes / No', 'What sessions do you plan on participating in? — Session 1 / Session 2 / Session 3', 'Do you have any questions or comments?']]] },
    'matrimonial-meet': { title: 'Registration form for the Matrimonial Meet', kicker: 'Matrimonial', groups: [
      ['Profile', ['Profile created for — Myself / Son / Brother / Sister / Friend / Relative / Daughter', 'Candidate Name', 'Surname', 'Upload Passport Size Photo Only', 'Upload Full Size Photo Only', 'Date Of Birth', 'Gender — Male / Female', 'Complexion — Fair / Very Fair / Whitish / Whitish medium / Whitish brown / Dark', 'Height — Below 4ft to Above 7ft', 'Weight — 31kg to 111kg and above', 'Mother Tongue']],
      ['Education and work', ['Educational Qualification (' + QUALS.filter(q => q !== 'MSW').join(', ') + ')', 'Upload Educational Certificate (Highest Degree)', 'If other please specify', 'Occupation — Profession / Business / Service / Not Working', 'Industry (' + FIELDS_OF_WORK.join(', ') + ')', 'Annual Income — Under Rs. 1,00,000 up to Rs. 20,00,001 - 25,00,000']],
      ['Types of Disabilities', [...DISABILITY, 'Upload Disability Certificate']],
      ['Contact and family', [...ADDRESS, 'Phone', 'Email', 'Hobbies', 'Partner Preference', 'Family Information', 'How many members in your family?', 'Fathers Name', 'Mothers Name']]] },
  };
  Object.entries(FORMS).forEach(([slug, f]) => {
    const pg = get(`/programs/${slug}/`); if (!pg) return;
    const html = `<section class="sec sec--lilac" id="form-details" aria-labelledby="fd-h"><div class="wrap">
  <div class="sec-head"><div><p class="kicker">${f.kicker || 'Registration form'}</p><h2 id="fd-h">${f.title}</h2><p>These are the details you will be asked for when you register. Keep them ready.</p></div></div>
  ${(f.intro || []).map(p => `<p class="fd-intro">${link(p)}</p>`).join('')}
  <div class="fd">${f.groups.map(([h, items], i) => `<div class="fd__g ${TONES[i % TONES.length]}"><h3>${h}</h3><ul>${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div>
</div></section>`;
    const i = pg.body.indexOf('<section class="sec sec--mist">');
    pg.body = i > -1 ? pg.body.slice(0, i) + html + '\n' + pg.body.slice(i) : pg.body + html;
  });

  /* ---------- 2. legal pages, full live text ---------- */
  const help = `<section class="sec sec--tight"><div class="wrap"><div class="pol-help">
    <div><h2>Questions about this policy?</h2><p>Our team is happy to help — by phone, WhatsApp or email.</p></div>
    <div class="pol-help__btns"><a class="btn btn--red" href="tel:${tel}">${icon('phone')} ${SITE.contact.phone}</a><a class="btn btn--white" href="https://wa.me/${SITE.contact.whatsapp}">${icon('message-circle')} WhatsApp</a><a class="btn btn--white" href="mailto:${SITE.contact.emails[0]}">${icon('mail')} Email us</a></div>
  </div></div></section>`;
  const ICONS = ['file-text', 'shield-check', 'eye', 'ban', 'scale', 'mail', 'lock', 'globe', 'clock', 'info'];
  const legalPage = ({ path, title, crumb, lead, desc, heading, intro, sections, outro }) => {
    const i = pages.findIndex(x => x.path === path);
    const page = { path, title: `${title} | ${SITE.name}`, description: desc, noindex: true, trail: [HOME, [crumb]],
      body: `${L.pageHero({ kicker: 'Policy', title, lead, trail: [HOME, [crumb]] })}
<section class="sec"><div class="wrap pol">
  <nav class="pol__toc" aria-label="On this page"><p>On this page</p><ol>${sections.map((x, n) => `<li><a href="#s${n + 1}">${esc(x[0])}</a></li>`).join('')}</ol></nav>
  <div class="policy">
    ${heading ? `<p class="pol-title">${esc(heading)}</p>` : ''}
    ${intro.map(p => `<p>${link(p)}</p>`).join('\n    ')}
    ${sections.map(([h, paras], n) => `<article class="pol-card ${TONES[n % TONES.length]}" id="s${n + 1}"><span class="pol-card__ic">${icon(ICONS[n % ICONS.length])}</span><div><h2>${esc(h)}</h2>${paras.map(p => `<p>${link(p)}</p>`).join('')}</div></article>`).join('\n    ')}
    ${(outro || []).map(p => `<p>${link(p)}</p>`).join('')}
  </div>
</div></section>
${help}` };
    if (i > -1) pages[i] = page; else pages.push(page);
  };
  const P = LEGAL.privacy, R = LEGAL.refund, T = LEGAL.terms;
  legalPage({ path: '/privacy/', title: 'Privacy Policy', crumb: 'Privacy', lead: 'How your personal information is collected, used and shared.',
    desc: `Privacy policy of ${SITE.organiser.name} for the ${SITE.name} website.`, heading: P.title, intro: P.intro, sections: P.sections });
  legalPage({ path: '/refund/', title: 'Refund Policy', crumb: 'Refund policy', lead: 'Event ticket sales: refunds, transfers and cancellations.',
    desc: `Refund policy for ${SITE.name} event tickets: no refunds, ticket transfers, event cancellation and accessibility.`, heading: R.title, intro: R.intro, sections: R.sections, outro: R.outro });
  const tcase = h => h.replace(/^\d+\)\s*/, '').toLowerCase().replace(/(^|[\s&,-])([a-z])/g, (m, a, b) => a + b.toUpperCase());
  legalPage({ path: '/terms/', title: 'Terms & Conditions', crumb: 'Terms', lead: 'The terms for using this website and its services.',
    desc: `Terms and conditions for using the ${SITE.name} website, organised by ${SITE.organiser.name}.`,
    intro: T.intro, sections: T.sections.map(x => [tcase(x.h), x.paras]) });

  /* ---------- 3. no pending notices ---------- */
  pages.forEach(p => {
    p.body = p.body
      .replace(/<div class="notice" role="note">[^]*?<b>Preview\.<\/b>[^]*?<\/div>/g, '')
      .replace(/<p class="status status--soon">[^]*?<\/p><p>To register your interest now, call or WhatsApp/g, '<p>To register, call or WhatsApp')
      .replace(/<li>Daily timings: to be announced\s*<\/li>/g, '');
  });
};
