# 05 — Accessibility Strategy & QA Report

**Target:** WCAG 2.2 Level AA (https://www.w3.org/TR/WCAG22/). **Status:** the automated checks below pass on every page. **Conformance is not claimed.** Manual assistive-technology testing (section 4) is still outstanding.

## 1. Strategy: built in, not bolted on

The benchmark (doc 02) and expert guidance agree: overlay widgets do not make a site accessible. The live site's "One Click Accessibility" toolbar has been **removed**. Accessibility now lives in the markup itself:

| WCAG area | Implementation |
|---|---|
| Structure (1.3.1, 2.4.6, 2.4.10) | Landmarks (`header`, `nav[aria-label=Main]`, `main`, `footer`), one H1 per page, ordered H2/H3, breadcrumbs as `nav > ol`, valid `dl` and tables with `th[scope]` |
| Bypass blocks (2.4.1) | "Skip to main content" is the first focusable element; `main` takes focus |
| Keyboard (2.1.1, 2.1.2, 2.4.3) | Every control is a native `button`, `a` or `input`. Menus are disclosure buttons with `aria-expanded` and close on Escape with focus returned. Dialogs (display options, mobile menu) trap focus and restore it on close. No keyboard traps |
| Focus visible (2.4.7, 2.4.11, 2.4.13) | 3px ink outline plus a 6px white and red halo on every focusable element; never removed; sticky header and mobile bar never cover the focused element (`scroll-padding`) |
| Contrast (1.4.3, 1.4.11) | Logo colours are used as fills; text uses darker "ink" shades (red `#b8231b`, teal `#1b6b6c`, purple `#64559c`, all ≥ 4.5:1 on white) |
| Use of colour (1.4.1) | Categories always carry a text label and an icon. Free/Paid/TBC badges carry text and an icon. Form errors use text, an icon and a thicker border. Selected filter chips show a ✓ |
| Colour-vision deficiency | No information depends on red/green distinctions; the free badge is labelled "Free" |
| Reflow / resize (1.4.4, 1.4.10, 1.4.12) | Fluid layout down to 320 CSS px, no horizontal scrolling, `rem`-based type, the comparison table stacks on small screens, user text-spacing honoured |
| Target size (2.5.8) | Interactive targets ≥ 44×44 px (most 48–56 px) |
| Motion (2.3.3) | `prefers-reduced-motion` respected; no autoplay; a "Reduce motion" option |
| Forms (3.3.1–3.3.3, 3.3.7) | Visible labels, required fields marked in text, an error summary that takes focus with links to each field, `aria-invalid` and `aria-describedby` |
| Language (3.1.1, 3.1.2) | `<html lang>`; language names marked `lang=` in the selector; translated pages set their own `lang` |
| Name, role, value (4.1.2) | Toggles use `aria-pressed`; disclosures use `aria-expanded`/`aria-controls`; the dialog uses `aria-modal` and `aria-labelledby`; status messages go through a polite live region (filter counts, setting changes) |
| Cognitive | Plain language, short paragraphs, the same layout on every page, an "I am…" entry point, identical structure on all 15 category cards, a 5-step "How registration works", a phone/WhatsApp fallback on every booking path |

**Optional display options (Alt + A):** text size ×4, higher contrast, more spacing, underlined links, simplified reading view and reduced motion. They change only this site and never override browser or OS settings. **Read-aloud** uses the device's built-in voice with Start, Pause, Resume and Stop. It is labelled as *not* a replacement for a screen reader, and it is hidden on browsers without speech support.

## 2. Automated results — 28 Oct 2026 (`npm run qa`, `npm run qa:lighthouse`)

| Check | Scope | Result |
|---|---|---|
| axe-core 4.10 (wcag2a, wcag2aa, wcag21a/aa, wcag22aa, best-practice) | 47 pages × desktop 1280 + mobile 390 = 94 page views | **0 violations** |
| Reflow at 320 CSS px (= 400% zoom) | 47 pages | **0 failures** |
| Page hygiene (one H1, lang, title, description length, canonical) | 47 pages | **0 issues** |
| Keyboard scenarios | 15 scripted flows | **15 / 15 pass** |
| Focus not obscured (2.4.11) by sticky header / mobile bar (`qa/focus-obscured.js`) | 420 Tab steps on 3 templates × 2 viewports | **0 obscured** |
| Internal links | every same-origin href | **0 broken** |
| Console / CSP errors on the .NET host | 6 key pages + interactions | **0** |

Keyboard scenarios: Tab reaches `main` on `/` and `/programs/` and reaches the footer (no trap) · skip link is first and moves focus to main · Alt+A opens the dialog with focus inside · focus stays trapped after 25 Tabs · Escape closes it and restores focus · mega menu opens with Enter and closes with Escape, returning focus · filter state is restored from the URL (`?cat=work`) · search finds "film" · the empty contact form shows a focused error summary with 3 invalid fields · the mobile menu opens with focus inside · Escape closes the mobile menu and returns focus.

**Lighthouse 12** (mobile, simulated slow 4G, compressed host):

| Page | Perf | A11y | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` | 98 | 100 | 100 | 100 | 2.3 s | 0 |
| `/programs/` | 99 | 100 | 100 | 100 | 1.9 s | 0 |
| `/programs/visitor/` | 99 | 100 | 100 | 100 | 1.9 s | 0 |
| `/expo/assistive-technology-fest/` | 99 | 100 | 100 | 100 | 2.1 s | 0 |
| `/accessibility/` | 99 | 100 | 100 | 100 | 2.0 s | 0 |
| `/contact/` | 99 | 100 | 100 | 100 | 2.0 s | 0 |

The performance fixes made during QA moved the score from 66 to 98–99:
- icons rendered as inline SVG at build time, removing 355 KB of JavaScript
- fonts self-hosted, removing two third-party round trips
- pre-compressed Brotli/gzip

Raw reports are in `qa/reports/`.

## 3. Defects found and fixed during QA

1. Footer CTA contrast: white on logo red is 4.0:1 → switched to the red ink shade (`color-contrast`).
2. Home "at a glance" `dl` contained wrapper divs around `dt`/`dd`, so screen readers could mis-associate them → restructured (`definition-list`, `dlitem`).
3. Two regions on `/programs/` shared the same name → the table region got its own label (`landmark-unique`).
4. The off-canvas mobile menu widened the page to 780 px on phones → `overflow-x: clip` at the root.
5. The comparison table needed sideways scrolling at 320 px → it stacks into labelled rows below 700 px.
6. Long email addresses overflowed at 320 px → `overflow-wrap: anywhere`.
7. Header buttons collided at 320 px → compact header; the "Menu" label becomes screen-reader-only below 380 px.
8. Meta descriptions too long or too short on 8 pages → rewritten.
9. **Critical — keyboard trap (2.1.2):** the mobile-menu focus trap was also active on desktop, where the menu is inline, so Tab cycled through the navigation forever and keyboard users could not reach page content. The 12 scripted checks passed because none of them tabbed *out of* the header. Fixed (trap only while the dialog is open) and covered by 3 new regression checks.
10. `scroll-behavior: smooth` animated every focus scroll, which slows keyboard users → removed. Focus-not-obscured is now verified at 0 of 420 steps.

## 4. Not yet tested — must be done before claiming conformance

| Test | Status | Owner |
|---|---|---|
| NVDA + Firefox/Chrome (Windows) | **Not performed** | QA team |
| JAWS (Windows) | **Not performed** (licence needed) | QA team |
| VoiceOver macOS Safari / iOS Safari | **Not performed** (no Apple device in this environment) | QA team |
| TalkBack (Android Chrome) | **Not performed** | QA team |
| Voice control (Dragon / Voice Access) | **Not performed** | QA team |
| Colour-vision simulation (protanopia, deuteranopia, tritanopia) | Design-reviewed only (no colour-only information); simulated screenshots **not produced** | Design |
| Windows High Contrast / forced colours | CSS support added (`forced-colors`); **not visually verified** | QA |
| Tickets99 booking flow (ticket select → login/OTP → attendee form → Razorpay/Stripe/PhonePe/UPI → confirmation → QR) | **Not tested.** The real ticket ids aren't configured yet. It's an external system; accessibility must be audited separately, with test transactions in a non-production payment mode | Tickets99 team |
| Translated pages | **Not tested** — no language published | — |
| Usability testing with disabled and elderly participants | **Recommended** (5–8 participants: screen reader, low vision, motor, cognitive, senior) | Organiser |

**Known risk:** the Tickets99 booking pages (login/OTP, payment gateway iframes) are outside this codebase. Any barrier there blocks registration however good this site is. Recommended: an axe and keyboard audit of `/buy/…/ticket` with a test event, plus an access-needs question in the attendee form.
