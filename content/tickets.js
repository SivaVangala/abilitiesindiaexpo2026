/*
 * ONE Tickets99 parent event (site.tickets99.uniqueCode) with up to 15 ticket types.
 *
 * ⚠ DEVELOPMENT FIXTURES. These 15 participation categories are derived from the registration paths that
 * exist on the live site today (each `source` is the live page it came from). They are NOT the approved
 * Tickets99 ticket list. Replace names, prices and `ti` with the organiser's Tickets99 configuration
 * (tools/sync-tickets99.js can pull names/prices/availability from the public Tickets99 read endpoint).
 *
 * Field → Tickets99 mapping (see docs/03-architecture-and-tickets99.md):
 *   ti          → EncryptTicketDetailId (booking deep link ?ti=…&autoselect=1)   — from Tickets99 admin
 *   name        → TicketName           description → TicketDescription
 *   price       → Price (0 = free)     currency    → CurrencySign / CurrencyId
 *   soldOut     → SoldOut              saleEnds    → PromotionEndDate (sale window enforced by Tickets99)
 */
const CATEGORIES = [
  { id: 'visit', label: 'Visit the expo', tone: 't-teal', icon: 'ticket' },
  { id: 'business', label: 'Exhibit & business', tone: 't-ink', icon: 'store' },
  { id: 'work', label: 'Jobs & careers', tone: 't-purple', icon: 'briefcase' },
  { id: 'stage', label: 'Perform & showcase', tone: 't-red', icon: 'music' },
  { id: 'awards', label: 'Awards', tone: 't-purple', icon: 'award' },
];

const base = { fixture: true, priceType: 'tbc', price: null, currency: 'INR', ti: null, soldOut: false, schedule: null };

const TICKETS = [
  { ...base, id: 'T01', slug: 'visitor', category: 'visit', icon: 'ticket', image: 'elderly-services-6.jpg',
    name: 'Visitor Registration',
    summary: 'Entry to the expo halls, all fests, free seminars, workshops and evening cultural programmes.',
    whoFor: ['Persons with disabilities and their families', 'Senior citizens and caregivers', 'Students, educators and volunteers', 'Professionals, NGOs and government officials'],
    highlights: ['Assistive Technology, Accessible Tourism, Medical Tourism and Shopping Fests', 'Free seminars and live product demonstrations', 'Cultural Fest every evening', 'Free on-site support: sign language, personal care, medical help'],
    eligibility: null, source: '/registration/' },
  { ...base, id: 'T02', slug: 'exhibitor', category: 'business', icon: 'store', image: 'Trade-Show.webp',
    name: 'Exhibitor Stall Booking',
    summary: 'Showcase products and services to visitors, buyers, distributors and partners from across India.',
    whoFor: ['Assistive technology and mobility manufacturers', 'Healthcare, rehabilitation and wellness providers', 'Accessible tourism and living solution providers', 'Startups, NGOs and institutions'],
    highlights: ['Face-to-face demonstrations to end users', 'Business Meets with buyers and distributors', 'Eligible MSEs may apply for the MSME stall grant'],
    eligibility: null, source: '/exhibitors/' },
  { ...base, id: 'T03', slug: 'assistive-tech-innovator', category: 'business', icon: 'cpu', image: 'assistive-tech.webp',
    name: 'Assistive Technology Fest — Startup & College Exhibit',
    summary: 'Startups and engineering colleges exhibit their inventions for people with disabilities.',
    whoFor: ['Startups building assistive technology', 'Engineering colleges and student teams', 'Researchers and innovators'],
    highlights: ['Show prototypes to real users', 'Meet industry, investors and media', 'Eligible for the Assistive Technology Awards'],
    eligibility: null, source: '/assistive-technology-fest/' },
  { ...base, id: 'T04', slug: 'business-meet', category: 'business', icon: 'handshake', image: 'Trade-Show.webp',
    name: 'Business Meet',
    summary: 'Pre-arranged meetings between exhibitors and their clients, buyers and distributors.',
    whoFor: ['Dealers and distributors', 'Procurement and purchase managers', 'Hospitals, clinics and rehabilitation centres'],
    highlights: ['Meet exhibitors in a focused setting', 'Explore partnerships and supply deals'],
    eligibility: null, source: '/business-meets/' },
  { ...base, id: 'T05', slug: 'shopping-fest-seller', category: 'business', icon: 'shopping-bag', image: null,
    name: 'Shopping Fest — Maker Stall',
    summary: 'Sell products made by persons with disabilities: paintings, crafts, jewellery, garments and more.',
    whoFor: ['Individual makers with disabilities', 'NGOs and self-help groups', 'Startups in the disability sector'],
    highlights: ['Reach thousands of visitors directly', 'Flower making, pot painting, paper pens, paintings, jewellery and crafts'],
    eligibility: null, source: '/shopping-fest/' },
  { ...base, id: 'T06', slug: 'sponsor', category: 'business', icon: 'megaphone', image: null,
    name: 'Sponsor & Associate Enquiry',
    summary: 'Partner with the expo as a sponsor or associate organisation.',
    whoFor: ['Corporates and CSR teams', 'Foundations, NGOs and institutions', 'Government bodies'],
    highlights: ['Packages are shared on enquiry'],
    eligibility: null, source: '/contact/ (Become a Sponsor / Associate with Us)' },
  { ...base, id: 'T07', slug: 'job-seeker', category: 'work', icon: 'briefcase', image: 'job-fair.jpg',
    name: 'Job Fair — Job Seeker',
    summary: 'Job seekers with disabilities meet the companies taking part in the Job Fair.',
    whoFor: ['Job seekers with disabilities', 'Graduates, diploma holders and experienced professionals'],
    highlights: ['Meet employers who hire inclusively', 'Interviews at the venue'],
    eligibility: null, source: '/job-seekers-registration/' },
  { ...base, id: 'T08', slug: 'employer', category: 'work', icon: 'building-2', image: 'job-fair.jpg',
    name: 'Job Fair — Employer',
    summary: 'Take part in the Job Fair and meet skilled job seekers with disabilities.',
    whoFor: ['Companies and HR teams', 'Recruitment agencies', 'Government and PSU employers'],
    highlights: ['List your openings', 'Meet candidates face to face'],
    eligibility: null, source: '/employer-registration/' },
  { ...base, id: 'T09', slug: 'cultural-fest-performer', category: 'stage', icon: 'music', image: null,
    name: 'Cultural Fest — Performer',
    summary: 'Perform on the evening stage: wheelchair dance, classical, bubble, LED and magic dance, music, comedy and magic.',
    whoFor: ['Artists and teams with disabilities', 'Cultural organisations and institutions'],
    highlights: ['A stage every evening of the expo', 'Teams and individuals welcome'],
    eligibility: null, source: '/cultural-fest/' },
  { ...base, id: 'T10', slug: 'short-film-entry', category: 'stage', icon: 'clapperboard', image: null,
    name: 'Short Film Fest — Film Entry',
    summary: 'Short films made by and for persons with disabilities, screened at the expo.',
    whoFor: ['Filmmaking teams of up to 5 + 2 members, with and without disabilities'],
    highlights: ['Films up to 5 minutes', 'Topics: human rights of PwDs, survival, mobility, accessibility, self-sufficiency', 'No abusive or exploitative content'],
    eligibility: 'Team of up to 5 + 2 members; film maximum 5 minutes (live-site rules, confirm for 2026).', source: '/short-film-fest/' },
  { ...base, id: 'T11', slug: 'matrimonial-meet', category: 'stage', icon: 'gem', image: null,
    name: 'Matrimonial Meet',
    summary: 'A respectful opportunity to find and select life partners for differently-abled men and women.',
    whoFor: ['Differently-abled individuals', 'Parents and family members registering on their behalf'],
    highlights: ['Profiles can be created by self or family'],
    eligibility: null, source: '/matrimonial-meet/' },
  { ...base, id: 'T12', slug: 'seminar-delegate', category: 'visit', icon: 'presentation', image: null,
    name: 'Seminars — Delegate',
    summary: 'Free seminars on accessible homes, special-needs planning, home care, respite and emergency preparedness.',
    whoFor: ['Families and caregivers', 'Professionals, educators and social workers'],
    highlights: ['Planning for special-needs children', 'Accessible home design', 'Home care for PwDs, elderly and sick people', 'Emergency preparedness and rescue'],
    eligibility: null, source: '/seminars/' },
  { ...base, id: 'T13', slug: 'workshop', category: 'visit', icon: 'wrench', image: null,
    name: 'Workshops & Demonstrations',
    summary: 'Hands-on product and service demonstrations by exhibitors throughout the day.',
    whoFor: ['End users and families', 'Therapists and rehabilitation professionals'],
    highlights: ['Live demonstrations of equipment and services'],
    eligibility: null, source: '/workshops/' },
  { ...base, id: 'T14', slug: 'achievement-award', category: 'awards', icon: 'award', image: null,
    name: 'Achievement Award — Nomination',
    summary: 'Nominate persons with disabilities for their achievements. Winners are selected by a jury.',
    whoFor: ['Persons with disabilities (self-nomination)', 'Organisations nominating an achiever'],
    highlights: ['Self employed', 'Human-rights work for PwDs', 'Role model', 'Lifetime achievement', 'Research or innovation', 'Accessible environment / equipment', 'Art, craft, literature, culture, sports and games'],
    eligibility: null, source: '/achievement-award/' },
  { ...base, id: 'T15', slug: 'assistive-technology-award', category: 'awards', icon: 'trophy', image: null,
    name: 'Assistive Technology Award — Entry',
    summary: 'Enter inventions that help people with disabilities overcome limitations, in any disability category.',
    whoFor: ['Companies, startups and researchers', 'Colleges and individual inventors'],
    highlights: ['Best Assistive Technology Solution of the Year', 'Best New Assistive Technology Solution', 'Best Innovative Project', 'Solutions for safety, emergencies, memory, mental health, communication and comfort'],
    eligibility: null, source: '/assistive-technology-registration/' },
];

module.exports = { CATEGORIES, TICKETS };

/* Merge the Tickets99 snapshot (tools/sync-tickets99.js --write) over the fixtures, when present. */
const fs = require('fs');
const snapFile = require('path').join(__dirname, 'tickets99.snapshot.json');
if (fs.existsSync(snapFile)) {
  const snap = JSON.parse(fs.readFileSync(snapFile, 'utf8'));
  TICKETS.forEach(tk => {
    const s = snap.tickets[tk.slug];
    if (!s) return;
    Object.assign(tk, { fixture: false, name: s.name || tk.name, ti: s.ti, price: s.price, soldOut: s.soldOut,
      priceType: s.price === 0 ? 'free' : 'paid', summary: s.description ? s.description.replace(/<[^>]+>/g, '').slice(0, 220) : tk.summary });
  });
}
