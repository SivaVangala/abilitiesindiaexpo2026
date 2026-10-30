# 06 — Handover, Organiser Approvals & Acceptance Checklist

## A. Information the organiser must supply or confirm (blocks launch)

Every item is flagged on the pages with a yellow "Organiser to confirm" label. Add `?clean` to any URL to preview without the labels.

| # | Item | Where it shows | Current state |
|---|---|---|---|
| 1 | **The 15 Tickets99 ticket types** (names, prices, free/paid, `TicketId` and the encrypted `ti` link token for each) | Programs, all category pages | Development fixtures built from the live site's registration paths |
| 2 | Tickets99 event `UniqueCode` and booking host (`www.tickets99.com/buy/{code}/ticket` or a custom subdomain/CNAME) | `content/site.js → tickets99` | Not set, so every Register button reads "Registration opening soon" |
| 3 | Daily timings for 20–22 Dec 2026 | Home, Visitors, FAQ | Not published anywhere |
| 4 | Visitor figure: 1,00,000+ (live home page) vs 50,000+ (live visitors page); also 1,000+ exhibitors, 30+ sessions, 50+ speakers | Home | Shown with a confirmation flag |
| 5 | Venue accessibility facts (step-free routes, parking/drop-off, lifts, quiet room, assistance animals, help desk) | Accessibility page, FAQ | Placeholder text, flagged |
| 6 | Companion/carer policy; eligibility or age policy | FAQ, category pages | Flagged |
| 7 | Whether the MSME stall grant applies in 2026, and its deadline | Exhibitors `#msme`, FAQ | The live page shows 2023 terms |
| 8 | Sponsorship packages (if they are to be published) | Sponsors | "Shared on enquiry" |
| 9 | Partner names for each logo (alt text) and 2026 partners | Home, Sponsors | Read from the logo images: MSME DFO, Kerala Startup Mission, K-DISC, K Chittilappilly Foundation, NCPEDP, Aster Medcity — confirm |
| 10 | Gallery photos with captions and usage rights; **inclusive hero photography of 1st-edition visitors with disabilities** | Gallery, Home hero | The hero currently uses the live site's elderly-services photo |
| 11 | Seminar schedule and speakers | Seminars & Workshops | Flagged |
| 12 | Privacy policy and terms (legal review). The live privacy policy wrongly says the site is "hosted on Wix" | `/privacy/`, `/terms/` | Draft / placeholder, `noindex` |
| 13 | Refund policy still valid for Tickets99 registrations? | `/refund/` | Summary of the live policy |
| 14 | Launch languages (proposed: hi, kn, ml, ta, te), a Cloud Translation API key with billing, and named reviewers | Language menu | All marked "coming soon" |
| 15 | Social media accounts | Footer | None verified, so none shown |

## B. Open engineering items

1. **Tickets99:** fill `content/tickets99-map.json`, run `tools/sync-tickets99.js --write`, rebuild. Optional: embed mode needs abilitiesindiaexpo.com added to Tickets99 `frame-ancestors` (**a Tickets99 deploy; needs permission**).
2. **Contact form:** currently validates and then opens the visitor's email app. Connect a server endpoint (an ASP.NET minimal API in `host/` + SES/SMTP, with reCAPTCHA or a honeypot) if the organiser wants submissions without an email app.
3. **Translations:** add UI-string dictionaries (`i18n/{lang}.json`) for the header and footer; self-host Noto Sans Indic subsets when a language goes live.
4. **Images:** convert JPEG/PNG to WebP/AVIF with `srcset` once final photography arrives (the current images are small, 5–140 KB).
5. **Manual accessibility testing:** NVDA, JAWS, VoiceOver, TalkBack, voice control and forced colours (doc 05 §4). Then finalise the accessibility statement.
6. **Tickets99 booking-flow accessibility audit** with a test event and a test payment mode. Payment gateway limitations must be reported to Tickets99.
7. **Analytics:** none installed. If wanted, use a privacy-respecting option and update the privacy policy.
8. **Old site:** after DNS cutover, check the 301 map in `host/…/Program.cs` against Search Console crawl errors.

## C. Deployment

```bash
npm ci                         # dev tools only (playwright-core, axe-core, lighthouse, http-server)
npm run build                  # -> dist/
# optional: T99_API_BASE=... node tools/sync-tickets99.js --write && npm run build
# optional: GOOGLE_TRANSLATE_API_KEY=... node tools/translate.js hi kn && npm run build
```

- **Visual Studio:** open `host/AbilitiesIndiaExpo.slnx` and press F5. It runs on http://localhost:5320 and serves `../../dist`.
- **IIS / EC2:** `dotnet publish host/AbilitiesIndiaExpo.Web -c Release -o out/`, copy `dist/` alongside, and set `Site:Root` to the dist path.
- **Any static host (S3+CloudFront, Azure Static Web Apps, Netlify):** upload `dist/` as is. The `.br`/`.gz` files are pre-built. Port the 301 map and security headers to that host's configuration.
- **Do not deploy without the organiser's approval of section A** (and the team's go-ahead).

### Environment variables

| Name | Used by | Secret? |
|---|---|---|
| `T99_API_BASE` | `tools/sync-tickets99.js` (build machine) | No — anonymous public endpoint |
| `T99_UNIQUE_CODE` | same (overrides `site.js`) | No |
| `GOOGLE_TRANSLATE_API_KEY` | `tools/translate.js` (build machine only) | **Yes — never commit; restrict the key to the Translation API** |
| `Site__Root`, `Site__Tickets99FrameOrigin` | .NET host (appsettings / env) | No |
| `QA_BASE`, `CHROME_PATH` | QA scripts | No |

## D. Asset manifest (`assets/`)

| File | Source | Rights |
|---|---|---|
| `img/logo.png`, `img/favicon.png` | Live site | Organiser's brand |
| `img/partner1–6.png` | Live site (1st Edition partners) | Use as published by the organiser; confirm |
| `img/simon-george.png`, `img/ambassador.jpg` | Live site | Confirm consent/usage |
| `img/elderly-services-*.jpg`, `img/job-fair.jpg`, `img/Trade-Show.webp`, `img/assistive-tech.webp`, `img/pragati-maidan.webp`, `img/ktpo.webp` | Live site | **Usage rights unknown — likely stock; organiser to confirm or replace** |
| `img/og-default.png` | Generated by `tools/make-og.js` from the logo and photo | Derived |
| `fonts/*.woff2` | Atkinson Hyperlegible (Braille Institute) and Bricolage Grotesque, via Google Fonts | SIL Open Font License |
| Icons (inline SVG) | Lucide 0.453.0 (`build/vendor/lucide.min.js`) | ISC License |

No AI-generated imagery is used.

## E. Content editing guide

- **Facts** (dates, venue, contact, Tickets99 settings): `content/site.js`
- **Registration categories:** `content/tickets.js` (or the Tickets99 snapshot)
- **Experiences / program pages:** `content/experiences.js`. **FAQ:** `content/faq.js`
- **Information pages** (visitors, exhibitors, about…): `build/build.js`, section "INFORMATION PAGES"
- **Approved translations:** `i18n/overrides/{lang}/{page}.html`
- Then run `npm run build && npm run serve && npm run qa`. Every check must stay green.

## F. Final acceptance checklist

- [ ] Section A items 1–4 and 12 supplied, and all yellow flags resolved (`?clean` shows nothing missing)
- [ ] Each of the 15 Register buttons opens the correct Tickets99 ticket (ticket preselected) under the **one** parent event
- [ ] Free registration end to end (test event)
- [ ] Paid registration end to end in a test payment mode; failed and abandoned payments behave correctly; test orders are clearly marked and voided
- [ ] Confirmation email/WhatsApp and the QR ticket are received
- [ ] `npm run qa`: 0 axe violations, 0 reflow failures, all keyboard checks pass, 0 broken links
- [ ] `npm run qa:lighthouse`: every category ≥ 90 / 95 / 95 / 95
- [ ] Manual screen-reader passes (NVDA, VoiceOver iOS, TalkBack) on Home → Programs → a category → Tickets99
- [ ] Mobile check on a small Android phone and an iPhone
- [ ] Accessibility statement finalised; privacy policy and terms approved
- [ ] 301 redirects verified on the production host; sitemap submitted to Search Console
