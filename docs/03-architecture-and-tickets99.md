# 03 — Architecture, Sitemap & Tickets99 Integration

## 1. Technology decision

| Option | Verdict |
|---|---|
| WordPress rebuild | Rejected. The current theme stack is the source of most accessibility defects (see 01 audit) |
| React / Next.js SPA or SSR | Rejected for v1. No measurable accessibility, SEO or maintenance benefit for a ~50-page event site; it would add a Node runtime to hosting |
| **Static generator (Node, zero runtime dependencies) + tiny ASP.NET Core host** | **Chosen.** Semantic HTML rendered at build time, so it is SEO-perfect and fast (Lighthouse 98–99 mobile). Works without JavaScript. Hosts on IIS/EC2 like the team's other sites (HITEX, Poultry India), runs with F5 in Visual Studio, and keeps no secrets in the browser |

Bootstrap was not used. The design system (`assets/css/site.css`) is written directly on CSS grid and flex with design tokens, so it ships one 11 KB (Brotli) stylesheet instead of a framework. Bootstrap components can be dropped in later if the team wants them; nothing conflicts.

```
content/            verified facts, tickets, experiences, FAQ (edit here)
build/build.js      page definitions -> dist/  (pretty URLs, sitemap, robots, translations, .br/.gz)
build/lib.js        layout, SEO head, JSON-LD, components, inline SVG icons (Lucide, ISC)
assets/             css, js (≈12 KB), images, self-hosted fonts (OFL)
i18n/               languages.js, UI strings, machine-translation cache, organiser overrides
tools/              sync-tickets99.js, translate.js, make-og.js
qa/                 run-qa.js (axe/reflow/keyboard/links), run-lighthouse.js, console-check.js
host/               ASP.NET Core 10 static host (compression, CSP, 301 map, 404)
```

## 2. Sitemap (47 pages)

- `/` — Home
- `/programs/` — Programs & Registration (search, filter, compare table), plus `/programs/{slug}/` × 15 ticket-category pages
- `/register/` — embedded Tickets99 checkout (embed mode only; noindex)
- `/expo/` — Explore the Expo, plus `/expo/{slug}/` × 12: Assistive Technology, Accessible Tourism, Medical Tourism, Shopping, Cultural and Short Film Fests; Job Fair; Business Meets; Matrimonial Meet; Awards; Seminars & Workshops; Elderly Services
- `/visitors/`, `/exhibitors/` (incl. `#msme`), `/sponsors/`, `/accessibility/` (incl. `#venue`)
- `/about/`, `/ambassadors/`, `/international-expo/`, `/gallery/`, `/media/`, `/faq/`, `/contact/`
- `/privacy/`, `/terms/`, `/refund/`, `/accessibility-statement/`, `/404.html`
- Language trees `/{hi|kn|ml|ta|te}/…` are generated only for languages marked published

## 3. One event, fifteen ticket types

There is **one** Tickets99 parent event, identified by its `UniqueCode` and stored in `content/site.js → tickets99.uniqueCode`. Every category card and page states "part of Abilities India Expo 2026" with the same dates and venue. The Programs page heading reads "One event · 15 registration categories".

The 15 categories in `content/tickets.js` are **development fixtures** taken from the registration paths on the live site, and each one records its source URL. The organiser must supply the real Tickets99 list.

### Field mapping (confirmed against Tickets99 source code)

| Website field | Tickets99 | Notes |
|---|---|---|
| parentEventId | `UniqueCode` (URL slug); internal `EventId` | `tickets99.uniqueCode` |
| ticketTypeId | `TicketId` (= TicketDetailId) | in `content/tickets99-map.json` |
| booking token | `ti` = `EncryptTicketDetailId` | **copy from the Tickets99 admin ticket URL**; AES-encrypted server-side, cannot be computed |
| ticketName / description | `TicketName` / `TicketDescription` | |
| price / currency | `Price` (`FullPrice`, `TaxPercentage`) / `CurrencySign` | free = `Price == 0` (inferred; there is no flag) |
| availability | `SoldOut`, `AvailableQuantity`, top-level `StatusId` (0 = sale not live) | |
| registrationStart/End | not returned; Tickets99 omits tickets outside their sale window | `PromotionEndDate` only |
| bookingURL | `https://www.tickets99.com/buy/{UniqueCode}/ticket?ti={ti}&autoselect=1` or `https://{code}.tickets99.com/buy/ticket?ti={ti}&autoselect=1` | `tickets99.buyBase` |

Note that Tickets99 also has a field called `TicketTypeId`, but it is the ticket *class* (General / Exhibitor / Sponsor…), not a ticket. Don't confuse the two.

### Handoff modes (`content/site.js → tickets99.mode`)

1. **`link` (default — works today, no Tickets99 change).** "Register" opens the Tickets99 booking page with that ticket preselected. Screen-reader text says it opens the registration site.
2. **`embed`.** `/register/?t={slug}` shows the Tickets99 page in an iframe. Height is synced through `postMessage` (`tickets99-resize`, `tickets99-scrolltop`, the same protocol the Poultry India site uses), checked against `tickets99.embedOrigin`. **This requires adding abilitiesindiaexpo.com to Tickets99's `frame-ancestors` allow-list in the subdomain Web.config, which is a Tickets99 deploy.** It also needs `Site:Tickets99FrameOrigin` set in the host's CSP.

While a ticket has no `ti`, the site shows "Registration opening soon" with phone, WhatsApp and email routes. **It never simulates a booking or a confirmation.**

### Metadata sync (build time, no secrets)

`tools/sync-tickets99.js` calls the anonymous public endpoint `GET {api}/v1/purchase/geteventdatesforticketpurchase?uniquecode=…`. It maps the results through `content/tickets99-map.json` and writes `content/tickets99.snapshot.json`, which the build merges over the fixtures (name, price, free/paid, sold out). The API host isn't in the Tickets99 repo, so supply `T99_API_BASE`. Re-run the sync and rebuild to refresh prices and availability; schedule it in CI if wanted.

### After the handoff (all inside Tickets99, the system of record)

Login/verification → attendee form → payment (Razorpay, Stripe, PhonePe, UPI; free tickets skip payment) → order confirmation → QR ticket page (`/ticket/…`) → invoice PDF (GST where configured) → email/WhatsApp confirmation.

**Recommendation for the organiser:** configure Tickets99 attendee questions to capture **access needs** (wheelchair, sign-language interpreter, companion/carer pass, quiet space). The benchmark found this is standard practice.

## 4. Multilingual architecture

- **Proposed launch languages:** English, हिन्दी, ಕನ್ನಡ, മലയാളം, தமிழ், తెలుగు (organiser to confirm). They are listed in their own scripts, with no flags, in an accessible disclosure menu that links to the same page in the other language.
- **`tools/translate.js`:** Google Cloud Translation (Basic v2, HTML mode) at build time. The key comes from the environment and is never shipped. Elements marked `translate="no"` (organiser, venue, brand) are preserved. Results are cached per page by source hash.
- **`i18n/overrides/{lang}/{page}.html`:** organiser-approved text that replaces the machine output.
- **Publishing:** a language gets built pages once `published: true`. It gets **hreflang** and becomes indexable only when `reviewed: true`; until then those pages carry `noindex`.
- **Not done yet:**
  - The header, footer and menus are still English on translated pages (UI-string dictionaries `i18n/{lang}.json` are planned).
  - No API key was available, so no language is published.
  - Indic font rendering relies on system fonts (Noto Sans is on Android, iOS and Windows). Add self-hosted Noto Sans Devanagari/Kannada/Malayalam/Tamil/Telugu subsets when a language goes live.
- **Privacy:** only the site's own published text is sent to Google. Form input is never sent.

## 5. Security

- The site is static. There are no secrets in the browser and no database.
- The host sets a strict CSP (`default-src 'self'`; frames blocked unless embed is configured), plus `nosniff`, Referrer-Policy and Permissions-Policy. HSTS and the HTTPS redirect apply in production.
- Fonts and icons are self-hosted, so pages make no third-party requests (Google Maps is a plain link).
- The contact form validates on the client, then opens the visitor's email app (`mailto:`). A server-side form handler is an open item; see doc 06.
