/*
 * FAQ. Answers use only verified facts. `verify: true` = organiser must confirm/complete before launch
 * (rendered with a visible review flag in development builds).
 */
module.exports = [
  { group: 'The event', items: [
    { q: 'When and where is Abilities India Expo 2026?',
      a: 'The 2nd Edition takes place on 20, 21 and 22 December 2026 at the KTPO International Exhibition and Convention Centre, Bengaluru, Karnataka.' },
    { q: 'What are the opening hours?', verify: true,
      a: 'Daily timings are shared on your registration confirmation. The 1st Edition was open from 11 AM to 8 PM.' },
    { q: 'Who is the expo for?',
      a: 'Persons with disabilities, senior citizens, families and caregivers, professionals, exhibitors, employers, NGOs, institutions and government bodies. It is both a business (B2B) and a public (B2C) event.' },
    { q: 'Is this the same as the 1st Edition in Kochi?',
      a: 'No. The 1st Edition was held from 31 January to 2 February 2025 at the Rajiv Gandhi Indoor Stadium, Kochi. The 2nd Edition is in Bengaluru.' },
  ]},
  { group: 'Registration and tickets', items: [
    { q: 'Why are there several registration categories?',
      a: 'There is one Abilities India Expo event. Inside it, you choose the category that fits what you want to do — for example visiting, exhibiting, taking part in the Job Fair, performing or entering an award. All categories belong to the same event and the same dates.' },
    { q: 'Is registration free?', verify: true,
      a: 'Each category shows whether it is free or paid before you register. Prices, where applicable, are confirmed on the Tickets99 registration page before you pay.' },
    { q: 'How do I register?',
      a: 'Choose your category on the Programs & Registration page and select Register. You will continue on Tickets99, our registration partner, where you confirm your details and — for paid categories — pay securely. Your confirmation is sent by the contact method you provide.' },
    { q: 'Can I get a refund?',
      a: 'Under the current refund policy, ticket sales are final and are not refunded, but tickets can be transferred to another person. If the event is cancelled, ticket holders are informed by email. Please read the full refund policy.', link: ['Refund policy', '/refund/'] },
    { q: 'I need help registering. Who can I contact?',
      a: 'Call or WhatsApp +91 8848367546, or email abilitiesindiaexpo@gmail.com. We can help you complete registration.' },
  ]},
  { group: 'Accessibility and support', items: [
    { q: 'What free support is available at the venue?',
      a: 'The organiser provides free services for differently-abled visitors, including personal care, sign language interpreters, medical service and accessible restrooms.' },
    { q: 'Is the venue wheelchair accessible?', verify: true,
      a: 'The expo is planned for persons with disabilities. Free services include personal care, sign language interpreters, medical service and accessible rest rooms. Tell us your access needs when you register and our team will be ready for you.', link: ['Accessibility at the venue', '/accessibility/'] },
    { q: 'Can I bring a companion or caregiver?', verify: true,
      a: 'If you are coming with a companion or caregiver, please tell us when you register or contact us in advance.' },
    { q: 'How do I use this website with a screen reader or keyboard?',
      a: 'The website is built to work with screen readers and keyboards. Use “Skip to main content” at the top of every page. The Accessibility button (or Alt + A) lets you change text size, contrast and spacing.', link: ['Accessibility statement', '/accessibility-statement/'] },
  ]},
  { group: 'Exhibitors and partners', items: [
    { q: 'How can my organisation exhibit?',
      a: 'Choose Exhibitor Stall Booking on the Programs & Registration page, or contact the team. Stall sizes and prices are shared by the organiser.', verify: true },
    { q: 'Is the MSME stall grant available?', verify: true,
      a: 'The Ministry of MSME approved financial assistance on stall rent for eligible MSEs at a previous edition. Applications are made on the official MSME portal — see the MSME Stall Grant page for eligibility and how to apply.' },
    { q: 'How can we sponsor the expo?',
      a: 'Choose Sponsor & Associate Enquiry or contact the team. Sponsorship options are shared on enquiry.' },
  ]},
];
