/* VERSION B — styled FAQ, Privacy, Terms, Refund and Accessibility Statement pages (same content, designed layout). */
module.exports = function pagesB3(L, pages) {
  const { SITE, icon, flag, esc, tel } = L;
  const FAQ = require('../content/faq');
  const HOME = ['Home', '/'];
  const TONES = ['t-red', 't-purple', 't-teal', 't-amber', 't-blue', 't-green'];
  const put = (p) => { const i = pages.findIndex(x => x.path === p.path); if (i > -1) pages[i] = p; else pages.push(p); };
  const help = `<section class="sec sec--tight"><div class="wrap"><div class="pol-help">
    <div><h2>Still have a question?</h2><p>Our team is happy to help — by phone, WhatsApp or email.</p></div>
    <div class="pol-help__btns"><a class="btn btn--red" href="tel:${tel}">${icon('phone')} ${SITE.contact.phone}</a><a class="btn btn--white" href="https://wa.me/${SITE.contact.whatsapp}">${icon('message-circle')} WhatsApp</a><a class="btn btn--white" href="mailto:${SITE.contact.emails[0]}">${icon('mail')} Email us</a></div>
  </div></div></section>`;
  // policy page: left = jump list, right = numbered section cards
  const policyPage = ({ path, title, crumb, kicker, lead, desc, notice, sections, noindex = true }) => put({ path, title: `${title} | ${SITE.name}`, description: desc, noindex,
    trail: [HOME, [crumb]],
    body: `${L.pageHero({ kicker, title, lead, trail: [HOME, [crumb]] })}
<section class="sec"><div class="wrap pol">
  <nav class="pol__toc" aria-label="On this page"><p>On this page</p><ol>${sections.map((x, i) => `<li><a href="#s${i + 1}">${x[1]}</a></li>`).join('')}</ol>
    <p class="pol__upd">${icon('calendar-days')} Last reviewed: October 2026</p></nav>
  <div class="policy">
    ${notice ? `<div class="notice" role="note">${icon('info')}<p>${notice}</p></div>` : ''}
    ${sections.map(([ic, h, html], i) => `<article class="pol-card ${TONES[i % TONES.length]}" id="s${i + 1}"><span class="pol-card__ic">${icon(ic)}</span><div><h2><span class="pol-card__n">${i + 1}.</span> ${h}</h2>${html}</div></article>`).join('\n    ')}
  </div>
</div></section>
${help}` });

  /* ---------- FAQ ---------- */
  const GICON = ['calendar-days', 'ticket', 'accessibility', 'store'];
  put({ path: '/faq/', title: `Frequently Asked Questions | ${SITE.name} 2026`,
    description: 'Answers about dates, venue, registration, tickets, refunds, accessibility and exhibiting at Abilities India Expo 2026, KTPO Bengaluru.',
    trail: [HOME, ['FAQs']], ld: [{ '@type': 'FAQPage', mainEntity: FAQ.flatMap(g => g.items.filter(i => !i.verify)).map(i => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })) }],
    body: `${L.pageHero({ kicker: 'Help', title: 'Frequently Asked Questions', lead: 'Quick answers about the expo, registration and support.', trail: [HOME, ['FAQs']] })}
<section class="sec"><div class="wrap">
  <ul class="faq-cats">${FAQ.map((g, i) => `<li><a class="${TONES[i]}" href="#g${i + 1}"><span class="faq-cats__ic">${icon(GICON[i] || 'circle-help')}</span><b>${esc(g.group)}</b><small>${g.items.length} questions</small></a></li>`).join('')}</ul>
</div></section>
${FAQ.map((g, i) => `<section class="sec${i % 2 ? '' : ' sec--lilac'}" id="g${i + 1}" aria-labelledby="gh${i + 1}"><div class="wrap faq-wrap">
  <div><p class="kicker">${String(i + 1).padStart(2, '0')}</p><h2 id="gh${i + 1}">${esc(g.group)}</h2></div>
  <div class="faq faq--cards">${g.items.map(it => `<details><summary>${esc(it.q)}${icon('plus', 'faq__ic')}</summary><div class="faq__a"><p>${esc(it.a)}${it.verify ? ' ' + flag('Organiser to confirm') : ''}</p>${it.link ? `<p><a href="${it.link[1]}">${esc(it.link[0])} →</a></p>` : ''}</div></details>`).join('')}</div>
</div></section>`).join('\n')}
${help}` });

  /* ---------- Privacy ---------- */
  const a = SITE.contact.address;
  policyPage({ path: '/privacy/', title: 'Privacy Policy', crumb: 'Privacy', kicker: 'Policy', lead: 'How we handle your information — in plain language.',
    desc: `Privacy policy of ${SITE.name}: what this website collects, how registrations and payments are handled, and how to contact us.`,
    notice: '<b>Draft for the organiser’s legal review.</b> The current live policy wrongly says the site is hosted on Wix and must be replaced.',
    sections: [
      ['eye-off', 'What this website collects', '<p>No advertising or tracking cookies. If you change display options, your choices stay only in your own browser and are never sent to us.</p>'],
      ['ticket', 'Registration and payments', `<p>Registrations and payments are handled by Tickets99, our registration partner, under its own privacy policy. ${flag('Link to Tickets99 privacy policy')}</p>`],
      ['map', 'Maps and translation', '<p>Venue links open Google Maps. When you choose another language, the page text is translated by Google. Text you type into forms is never sent for translation.</p>'],
      ['mic', 'Voice and read-aloud', '<p>Read-aloud uses your device’s own voice. Voice commands use your browser’s speech service and only run when you press the microphone button.</p>'],
      ['mail', 'Contact us', `<p>${SITE.organiser.name}, ${a.line}, ${a.city} – ${a.postcode}. Email <a href="mailto:${SITE.contact.emails[1]}">${SITE.contact.emails[1]}</a>.</p>`],
    ] });

  /* ---------- Terms ---------- */
  policyPage({ path: '/terms/', title: 'Terms & Conditions', crumb: 'Terms', kicker: 'Policy', lead: 'A plain-language summary of the rules for using this website.',
    desc: `Terms and conditions for using the ${SITE.name} website, organised by ${SITE.organiser.name}.`,
    notice: `<b>Summary for review.</b> The organiser’s current terms are dated 26 July 2023. ${flag('Organiser / legal to approve the final text')}`,
    sections: [
      ['file-text', 'Agreement', '<p>By using this website or its services, you accept these terms. If you do not agree, please do not use the website.</p>'],
      ['copyright', 'Our content', `<p>The website and its content belong to ${SITE.organiser.name}, including copyrights, trademarks and other rights.</p>`],
      ['shield-check', 'Fair use', '<p>Do not use the website for anything unlawful — including harassment, fraud, violating anyone’s rights, or spreading harmful software.</p>'],
      ['ban', 'Right to refuse service', '<p>The organiser may refuse service to anyone, at any time, where needed.</p>'],
      ['ticket', 'Registrations', '<p>Registrations and payments are handled by Tickets99. Please read the <a href="/refund/">refund policy</a> before you pay.</p>'],
    ] });

  /* ---------- Refund ---------- */
  policyPage({ path: '/refund/', title: 'Refund Policy', crumb: 'Refund policy', kicker: 'Policy', lead: 'What happens if you cannot attend, or plans change.',
    desc: `Refund policy for ${SITE.name} event tickets: no refunds, ticket transfers allowed, and what happens if the event is cancelled.`,
    notice: `Summary of the organiser’s current refund policy. ${flag('Organiser to confirm it still applies to Tickets99 registrations')}`,
    sections: [
      ['ban', 'No refunds', '<p>All ticket sales are final and are not refunded — including when a ticket holder cannot attend.</p>'],
      ['repeat', 'Transfers are allowed', '<p>You can transfer your ticket to another person. Just tell the organiser the new attendee’s details.</p>'],
      ['calendar-x', 'If the event is cancelled', '<p>All ticket holders are informed by email.</p>'],
      ['accessibility', 'Accessibility needs', '<p>The organiser is committed to an inclusive event. Please share your access needs in advance so we can prepare.</p>'],
    ] });

  /* ---------- Accessibility statement ---------- */
  policyPage({ path: '/accessibility-statement/', title: 'Accessibility Statement', crumb: 'Accessibility statement', kicker: 'Our commitment', noindex: false,
    lead: 'Everyone should be able to use this website — including with screen readers, keyboards, magnifiers or voice.',
    desc: 'Accessibility statement for the Abilities India Expo website — the standard we follow, what we have built in, known limits and how to report a problem.',
    sections: [
      ['badge-check', 'Our standard', `<p>We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. ${flag('Statement to be finalised after independent testing')}</p>`],
      ['list-checks', 'What we have built in', '<ul class="ticks"><li>One clear heading per page and a working “Skip to main content” link.</li><li>Everything works with a keyboard, with a clearly visible focus.</li><li>Strong text contrast; colour is never the only signal.</li><li>Pages reflow at 400% zoom and support larger text.</li><li>Accessibility Tools, read aloud, voice commands and six languages on every page.</li><li>Your device’s “reduce motion” setting is respected.</li></ul>'],
      ['triangle-alert', 'Known limits', '<ul class="ticks"><li>Registration and payment happen on Tickets99, which is tested separately.</li></ul>'],
      ['message-circle', 'Report a problem', `<p>If anything is hard to use, tell us: call <a href="tel:${tel}">${SITE.contact.phone}</a> or email <a href="mailto:${SITE.contact.emails[0]}">${SITE.contact.emails[0]}</a>. We will help you register another way.</p>`],
    ] });
};
