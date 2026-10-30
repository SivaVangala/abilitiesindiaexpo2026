/*
 * Verified site facts. Source for every value: the live abilitiesindiaexpo.com (audited 28 Oct 2026).
 * Anything marked verify:true MUST be confirmed by the organiser before launch (shown on pages as a review flag).
 */
module.exports = {
  baseUrl: 'https://abilitiesindiaexpo.com',      // canonical origin for SEO tags and the sitemap
  name: 'Abilities India Expo',
  edition: '2nd Edition',
  tagline: 'Transforming Disability into Ability Through Innovation, Inclusion and Opportunity',
  positioning: 'Multifaceted International Expo for People With Disabilities (Divyangjan) & the Elderly',
  motto: 'Empowering people with disabilities and elderly people — to take them out of an underprivileged and distressed life and help them start a new one.',
  format: 'Both B2B and B2C',
  marketedBy: 'Trade India',

  event: {
    startDate: '2026-12-20',
    endDate: '2026-12-22',
    datesLabel: '20 – 22 December 2026',
    timings: null,                     // NOT published on the live site
    timingsVerify: true,
    venue: {
      name: 'KTPO International Exhibition and Convention Centre',
      short: 'KTPO, Bengaluru',
      locality: 'Whitefield, Bengaluru',
      region: 'Karnataka',
      country: 'IN',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=KTPO+International+Exhibition+and+Convention+Centre+Bengaluru',
    },
    eligibility: null,                 // who may attend / age policy — not published
  },

  firstEdition: { venue: 'Rajiv Gandhi Indoor Stadium, Kochi, Kerala', dates: '31 January – 2 February 2025', time: '11 AM – 8 PM' },
  international: { venue: 'Pragati Maidan, New Delhi', when: 'last week of October 2027', status: 'planned' },

  // Forward-looking figures from the live home page. Visitors page says 50,000+ — conflict flagged.
  stats: [
    { value: '1,00,000+', label: 'Expected visitors', verify: true },
    { value: '1,000+', label: 'Exhibitors', verify: true },
    { value: '30+', label: 'Sessions', verify: true },
    { value: '50+', label: 'Speakers', verify: true },
  ],

  organiser: {
    name: 'Walshal Abilities And Assistive Technologies Private Limited',
    url: 'https://www.walshal.com/',
    founder: 'Simon George',
  },
  contact: {
    phone: '+91 8848367546',
    whatsapp: '918848367546',
    emails: ['abilitiesindiaexpo@gmail.com', 'info@abilitiesindiaexpo.com'],
    address: {
      line: 'No. 4/461, 2nd Floor, Suite # 1995, Valamkottil Towers, Judgemukku, Kakkanad',
      city: 'Kochi', postcode: '682021', region: 'Kerala', country: 'IN',
    },
  },
  msmePortal: 'https://my.msme.gov.in/MyMsme/Reg/COM_MatuDomAppForm.aspx',

  /* Tickets99 — ONE parent event. All values are public (no secrets in the browser).
   *  - uniqueCode: the event's Tickets99 UniqueCode (URL slug)            -> organiser/Tickets99 admin
   *  - buyBase:    booking page. Main site form:  https://www.tickets99.com/buy/{uniqueCode}/ticket
   *                Subdomain / CNAME form:        https://{code}.tickets99.com/buy/ticket
   *  - mode:       'link'  -> open Tickets99 (works today, no Tickets99 change)
   *                'embed' -> iframe on /register/ (needs this domain in Tickets99 frame-ancestors = a Tickets99 deploy)
   * Per-ticket `ti` (encrypted TicketDetailId) is copied from the Tickets99 admin "ticket URL" — it cannot be computed here.
   */
  tickets99: {
    uniqueCode: null,
    buyBase: null,
    mode: 'link',
    embedOrigin: null,
  },

  // verified on the live abilitiesindiaexpo.com header/footer (28 Oct 2026)
  social: [
    { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/profile.php?id=100089079331446' },
    { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/abilitiesindiaexpo' },
    { name: 'X (Twitter)', icon: 'twitter', url: 'https://twitter.com/AbilitiesIndia' },
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/company/abilities-india-expo/' },
  ],
};
