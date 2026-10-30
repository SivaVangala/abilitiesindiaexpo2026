# 02 — Competitive Benchmarking Report

**Project:** Abilities India Expo (AIE) redesign — 2nd edition, 20–22 Dec 2026, KTPO Bengaluru
**Date of research:** 28 Oct 2026
**Method:** I fetched each site's raw HTML and inspected it for skip links, landmarks, headings, ARIA on menus, language handling, accessibility tools, and image alt text. I also read the visible text of the event and registration pages. I did not take screenshots or test in a browser. Visual points such as photography style are therefore drawn from alt text and copy only, and are marked as inferred. Anything I could not fetch is marked as such.

---

## 1. Sites studied

| # | Site | Type | Pages fetched |
|---|------|------|---------------|
| 1 | abilities.com (Abilities Expo, US) | Disability expo, 6 cities | Home, `/los-angeles`, `/los-angeles/register`, and its embedded third-party form |
| 2 | naidex.co.uk (Naidex, UK) | Disability expo | Home, `/visit`, `/visit/pre-register-2027` |
| 3 | rehacare.com (REHACARE, Germany) | Trade fair for rehab and care | Home, `/en/visit` (the tickets page URL I guessed returned 404) |
| 4 | atia.org (ATIA conference, US) | AT conference | Home, `/registration-information/`, `/course-registration-pricing/` |
| 5 | kidzexhibitions.co.uk (Kidz to Adultz, UK) | Free disability exhibitions | Home (`/our-events/` was fetched but not analysed in depth) |
| 6 | abilitynet.org.uk | Charity, also runs the TechShare Pro event | Home, `/TechSharePro` |
| 7 | rnib.org.uk | Sight-loss charity | Home, challenge-events listing |
| 8 | scope.org.uk | Disability charity | Home, `/events` |
| 9 | w3.org/WAI | Standards body | **Blocked for curl (Cloudflare 403).** Home read through a fetch tool, so the analysis is text only and no HTML was inspected |
| 10 | un.org/en/webaccessibility | UN guidelines site | Home |
| — | CSUN AT Conference (csun.edu/cod/conference) | AT conference | **Not fetchable (HTTP 403 from both tools).** Excluded |
| — | overlayfactsheet.com | Expert statement on overlay widgets | Home, used for section 4(c) |
| — | abilitiesindiaexpo.com (current site) | Baseline | Home, `/registration/` |

---

## 2. Per-site findings

### 2.1 Abilities Expo — abilities.com (closest analogue)
- **Homepage UX:** The page is event-led. The H1 is a short benefit line, followed straight away by a "Next expo" block with city and dates, then a list of all six cities. Content sections (sports, assistive tech, caregivers) sit below.
- **Accessibility seen in the HTML:** `lang="en-US"`, a "Skip to content" link, and one each of `header`/`nav`/`main`/`footer`. The CSS includes `:focus-visible` and `prefers-reduced-motion`. Headings are mostly H2s, with the H1 appearing after about 15 city and menu H2s, so the heading order is weak. Alt text is unusually good: descriptive and identity-affirming (for example, it names who is doing what and says the dancers have developmental disabilities). Decorative images use `alt=""`. There is no overlay widget.
- **Mobile nav:** The WordPress core responsive navigation block (an overlay menu).
- **Event page (`/los-angeles`):** One clear block holding the date, venue and hall, opening hours **per day**, and an **"Early Access Hour for Sensory Disabilities"**. The primary CTA is "Register · It's free!". Secondary actions are "Get updates", "Download flyer", "Register for Industry Conference", and transport info. A "What's happening" grid shows features as short tiles (loaner scooters, wheelchair repair, AT showcase, and others). "Plan your visit" splits into Agenda, On-site services, Show info, and Exhibitors & floorplan.
- **Registration:** One page with a third-party iframe form (events.tpni.com) set to a fixed `min-height:3700px`. The form is long: name, full address, a country list of about 240 entries, email, and SMS opt-in. Its best feature is an **accommodation request** (ASL interpreter, real-time captioning, large print, other) captured *during* registration with a deadline. It also asks "Are you a person with a disability?" and a disability-type checklist, and accepts adult household members as guests without separate registration. There is a separate Spanish registration page. **Free vs paid is very clear:** consumers are free, and the professional conference is a separate CTA.
- **Trust signals:** sponsors, named headliners, speakers, ambassadors, and "200+ exhibitors". It also advises a scent-free environment, a thoughtful practical note.

### 2.2 Naidex — naidex.co.uk
- **Homepage UX:** Countdown, then "Welcome", then a "The events that form Naidex" grid of four sub-events (children, inclusive workplaces, neuro rehab, dementia). After that come "Get Involved" cards (Visit / Exhibit / What's On), a social-proof headline (12,000+ attendees), and testimonials.
- **Accessibility seen:** `lang="en"`, `main` present, `aria-label="Select Event"` on an event-switcher `nav`. **There is no skip link on the homepage.** The primary `nav` has `tabindex="0"`, an anti-pattern that adds a pointless tab stop. There is no H1 (the first heading is an H2 countdown). Alt text is present but mixed. No overlay.
- **Mobile nav:** A "Main Menu" button opening an overlay nav (`nav-overlay`).
- **Registration:** The Visit page states "Registration is Free". The form is a HubSpot embed rendered by JavaScript, so I could not inspect its fields. **CTA labels are inconsistent across pages:** "Free Tickets", "Pre-Register 2027", "Register Free", "Register for 2027", and "Register your interest". That is five names for one action.
- **Simplifying complexity:** a sub-brand per audience or condition, each a card with one line and "Find Out More".

### 2.3 REHACARE — rehacare.com
- **Homepage UX:** Exhibitor-sales-first. The H1 is "Become an exhibitor now", followed by a **Stand Cost Calculator**, a recap, networking, and the programme. The top-level nav is audience-split: **Visit / Press / Exhibit / About**.
- **Accessibility seen:** a skip link ("Skip to main content"), `nav aria-label="Main navigation"`, and good use of `aria-expanded`/`aria-controls` (23 each) on the mega menu. However, many H2s are **duplicated** (rendered twice for mobile and desktop), there are empty H2s, and there is a second H1 reading "This page requires JavaScript". Some alt text on the English page is in German ("Foto: REHACARE Eingang Sued"). No overlay.
- **Visit page:** A good "at a glance" paragraph (dates, venue, audience, topics), then six cards: Good reasons, Exhibitor list, Preparation, Tickets, Arrival, Programme.
- **Not fetched:** the ticket shop and language-switcher markup (I could not locate a DE/EN link in the static HTML).

### 2.4 ATIA — atia.org (best model for many ticket types)
- **Accessibility seen:** a skip link, `nav aria-label="Primary navigation"` and a separate `"Mobile navigation"`, and `aria-current`. The homepage has two H1s and H5s used for footer labels. No overlay.
- **Registration information page:** A single, scannable page with one H2 block **per registration type**: Full Conference, Single-Day, Group (5+), Speaker, Parent, Student, **FREE Exhibit Hall**, and virtual bundles. Each block follows the same structure:
  1. the type name,
  2. a one-line "Includes…" statement,
  3. what is **not** included ("CEUs require an additional fee"),
  4. eligibility proof where needed (a letter for parents, student status), and
  5. dated price tiers (Early Bird, Regular, Late, with date ranges).
- The free option is explicitly labelled "FREE" and sits among the paid types rather than being hidden. A single "Register Now" goes to the checkout. **This is the clearest pattern I found for presenting more than 10 participation types under one event.** Its weakness is that the page is long and has no comparison table or "which one is for me?" filter.

### 2.5 Kidz to Adultz — kidzexhibitions.co.uk
- **Homepage UX:** Short. The two CTAs are "Find an event" and "Exhibit with us". A section titled **"Who is Kidz to Adultz for?"** says everyone is welcome and that *assistance dogs are welcome*. A second list, **"Who else visits?"**, names professionals (OTs, SEN teachers, social workers, foster carers, and others). Short testimonials follow, then partners. The footer offers three clear paths: Attend / Exhibit / Advertise.
- **Accessibility seen:** `lang="en-GB"` and a skip link, but **no `header`/`nav`/`main`/`footer` elements**, five H1s on one page, and testimonial names marked up as H5. Some alt text describes the *shape* rather than the content ("Semi circle image with boy in the center"). It uses the **GTranslate** machine-translation widget. No overlay.

### 2.6 AbilityNet — abilitynet.org.uk (and TechShare Pro)
- **Homepage UX:** One H1 with a clear mission, the event (TechShare Pro) promoted second, then four service cards organised **by need** (Free Tech Support / Digital Accessibility Services / Workplace / Resources). The heading hierarchy is clean (H1, then H2, then H3). The mega menu is built from `button`s with `aria-expanded`/`aria-controls`. There is a skip link and a separate mobile `nav`. A "Call our helpline" section adds trust.
- **Event ticketing (TechShare Pro):** Free vs paid is stated in two plain sentences: online is free; in-person costs £500 + VAT (for-profit) or £350 + VAT (non-profit/freelancer); early-bird is 10% off until a date. A bulleted "The in-person ticket includes…" list follows. Pricing is by **audience type**, not by feature bundle. Sponsor/exhibitor information is a single downloadable pack.
- **Notable absence:** AbilityNet, a digital-accessibility consultancy, ships **no** read-aloud or overlay toolbar. It runs the "My Computer My Way" guide instead, which teaches people to use the accessibility features already built into their own devices.

### 2.7 RNIB — rnib.org.uk
- **Accessibility seen:** "Skip to main content", `nav aria-label="Main menu"` plus labelled footer navs, 139 `aria-label`s, and 117 `aria-expanded`. There is an **"Appearance" control offering Light / Dark / Yellow colour modes** in the header and menus, built as buttons with `aria-pressed`. It is a native site feature, not a third-party overlay. Proper `hreflang` alternates exist for English and Welsh (`/cy/`). Alt text is rich and person-centred. Several H3 "Appearance" headings appear before the H1, which is a heading-order flaw.
- **UX:** The helpline number appears as a heading ("Call our Helpline on 0303 …"). The content is organised by life stage (your eyes, then diagnosis, then support), which is a good model for "I am newly…" journeys.

### 2.8 Scope — scope.org.uk
- **Accessibility seen:** **Three skip links** (to main content, to search, to navigation), `lang="en-gb"`, `focus-visible`, and a single H1. Mobile nav is a "Menu" button.
- **Event discovery (`/events`):** a keyword search, an "Event type" filter with plain category chips (Running, Cycling, Community, Social event, …), and a "37 matches found" result count. Each card shows **category, title, one-line description, date, and location**, which is consistent and scannable.

### 2.9 W3C WAI — w3.org/WAI (text only; HTML not inspectable)
- Skip to Content is present. Six task-based top sections (Fundamentals, Planning & Policies, Design & Develop, Test & Evaluate, Teach & Advocate, Standards).
- **"Get Resources for…" audience navigation** lists Content Writers, Designers, Developers, Evaluators, Managers, Policy Makers, Trainers, "Web Users, People with Disabilities, Advocates", Everyone, and Other Languages. This is the canonical "I am a…" pattern, presented as a plain link list.
- **Language:** no dropdown. A text link reads "All Translations", which leads to a page of languages.

### 2.10 UN Web Accessibility — un.org/en/webaccessibility
- Two skip links (navigation, content), `lang="en"`, and landmarks via `role="navigation"`/`role="main"`. The language switch is shown as **written-out language names ("English", "Français")**, not flags. Mobile nav is a Bootstrap "Toggle navigation" button. The hero alt text describes the photo ("A blind person using a braille terminal"). The content is dense but chunked under H2s ("How to use these guidelines").

### 2.11 Baseline: current abilitiesindiaexpo.com (for contrast)
- Has a skip link. Has **no** `header`/`main`/`footer` landmarks. There is no H1, and the first headings are "Call Now" and "Email Us".
- The registration page is a generic contact form (name, email, phone, address, message) beneath a menu of more than 20 items.
- Runs the **Pojo / "One Click Accessibility" toolbar** (increase/decrease text, grayscale, high and negative contrast, light background, underline links, readable font). Its buttons are `<a href="javascript:void(0)" role="button" tabindex="-1">`. **"Ally – Web Accessibility & Usability (formerly Pojo)" is named in the Overlay Fact Sheet's list of overlay products.**
- Runs the GTranslate floating machine-translation widget.

---

## 3. Cross-site observations

| Theme | Strongest examples | Common weaknesses |
|---|---|---|
| Skip links | Scope (three), UN (two), RNIB, AbilityNet, REHACARE, ATIA | Naidex has none |
| Heading structure | AbilityNet, Scope (one H1, logical) | No H1 (Naidex, AIE); multiple H1s (ATIA, Kidz, REHACARE); duplicated or empty H2s (REHACARE) |
| Menu ARIA | AbilityNet, REHACARE, RNIB (`aria-expanded`/`aria-controls` on buttons) | `tabindex="0"` on a `<nav>` (Naidex); fake link-buttons (AIE toolbar) |
| Display preferences | RNIB's native Light/Dark/Yellow with `aria-pressed` | Third-party overlay toolbar (current AIE) |
| Overlays | **None of the nine benchmark sites I could inspect use one** | — |
| Free vs paid | Abilities Expo ("It's free!" in the CTA), ATIA ("FREE Exhibit Hall"), AbilityNet (two sentences) | Naidex uses five CTA names for one action |
| Event facts | Abilities Expo (per-day hours, sensory early-access hour), REHACARE "at a glance" | — |
| Alt text | Abilities Expo, RNIB (person-centred, descriptive) | Shape-only (Kidz); wrong language (REHACARE) |

---

## 4. Synthesis — ADOPT / IMPROVE / AVOID for Abilities India Expo

### 4(a) Many ticket and participation types under one event

AIE has one event with up to 15 ticket types. These will mix free visitor passes, workshop or seminar passes, job-seeker and employer registrations, cultural and tourism activities, exhibitor stalls, sponsors, and possibly matrimonial-meet or MSME-grant applicants.

| Action | Pattern | Source |
|---|---|---|
| **ADOPT** | Give every ticket type an identical "card" anatomy: **name, who it's for, price (or "Free"), what's included, what's not included, what proof is needed, and the deadline.** | ATIA |
| **ADOPT** | Put "Free" in the CTA text itself ("Register free — Visitor pass"), so the cost is clear before anyone clicks. | Abilities Expo |
| **ADOPT** | State pricing by audience in plain sentences ("Free for visitors with disabilities and one companion; ₹X for professionals"). | AbilityNet |
| **ADOPT** | Capture **accessibility accommodation needs in the registration form** (ISL interpreter, captions, wheelchair or loaner, large print, quiet space, companion), with a deadline. Feed them to on-site operations. | Abilities Expo |
| **ADOPT** | Allow a free companion or carer on the same registration rather than requiring a separate form. | Abilities Expo |
| **IMPROVE** | ATIA's single long list has no filter. **Group the 15 types into 3–4 buckets that match the "I am a…" audiences** (Visit, Learn, Work, Exhibit/Sponsor). Show only the relevant bucket first, and offer a "Compare all passes" table as a real `<table>` with `<th scope>`. | ATIA (improved) |
| **IMPROVE** | Exhibitors and sponsors should not go through the visitor ticket flow. Keep them in a separate "Exhibit" path with a downloadable pack or stall-cost guidance (REHACARE's calculator idea). Use ticket types for them only where the platform requires it. | REHACARE, AbilityNet |
| **IMPROVE** | Keep the form short. Abilities Expo's form requires a full postal address and a list of about 240 countries. For AIE, ask only for name, mobile, email, city or state, pass type, and accessibility needs. Make demographics optional. | — |
| **AVOID** | Several labels for the same action (Naidex's five). Use **one verb** sitewide: "Register" (free) and "Book" (paid). | Naidex |
| **AVOID** | Fixed-height iframes (`min-height:3700px`), which break zoom and reflow. If the ticketing platform is embedded, give it a title, let it resize, and offer a direct link to open it full-page. | Abilities Expo |
| **AVOID** | Hiding the free option among paid ones or behind "Contact us". The current AIE registration page is a contact form. | AIE baseline |

### 4(b) Audience-based "I am a…" navigation

| Action | Pattern | Source |
|---|---|---|
| **ADOPT** | A plain-language audience link list directly under the hero, with ~6 options: *Person with disability · Elderly / senior citizen · Family or carer · Job seeker · Employer / recruiter · Exhibitor / sponsor · Professional / NGO*. Each option leads to a landing page with its own pass(es) and schedule highlights. | W3C WAI "Get Resources for…", Kidz to Adultz "Who is it for?" |
| **ADOPT** | Top-level navigation split by intent: **Visit / Exhibit / Programme / About** (plus Media in the footer). | REHACARE, Kidz footer |
| **ADOPT** | A "Plan your visit" hub covering hours per day, transport to KTPO, on-site services (wheelchair loan, repair desk, accessible toilets, quiet room, assistance animals), and a floor plan. | Abilities Expo, REHACARE |
| **ADOPT** | A dedicated sensory-friendly or quiet hour, and a clear statement that assistance animals are welcome. | Abilities Expo, Kidz |
| **IMPROVE** | Replace the current menu of more than 20 sub-fests with a "What's on" grid of short tiles (one line each), like Naidex's sub-event cards and Abilities Expo's features grid, with a filter by category as on Scope's events page. | Naidex, Scope |
| **AVOID** | Interactive "I am a…" sentence-builder dropdowns and quizzes. Plain links are faster for keyboard and screen-reader users and work without JavaScript. | (WAI uses plain links) |

### 4(c) Accessibility-preference and read-aloud tools vs native support

| Action | Pattern | Source |
|---|---|---|
| **ADOPT** | **Native accessibility first:** semantic landmarks, one H1, logical headings, multiple skip links, `:focus-visible` styles, `prefers-reduced-motion`, text that reflows at 200–400% zoom, and minimum 18px body text for elderly users. | Scope, AbilityNet, Abilities Expo |
| **ADOPT** | If a preference control is wanted, build a **small native "Display" control** in the header: text size (A / A+ / A++), colour mode (Light / Dark / High-contrast yellow), and a link-underline toggle. Use real `<button aria-pressed>`, persist the choice, and honour `prefers-color-scheme` and `prefers-contrast`. | RNIB "Appearance" |
| **ADOPT** | An **Accessibility page** that explains on-site *and* online access, and teaches visitors to use their own device's read-aloud and zoom (AbilityNet's "My Computer My Way" approach). Offer human-produced formats: ISL video summaries, Easy Read PDF, and an audio guide for key pages. | AbilityNet |
| **REMOVE / AVOID** | **The current Pojo / One Click Accessibility toolbar.** The Overlay Fact Sheet (signed by several hundred accessibility practitioners; the signatory figure varies by source) lists it as an overlay. Its position is that overlay widgets duplicate tools users already have, can conflict with assistive technology, and cannot make a site compliant. **None of the benchmark sites I inspected uses an overlay**, including the two whose core business is accessibility (AbilityNet, RNIB). The current toolbar's buttons are also `tabindex="-1"` fake links. | overlayfactsheet.com; observed HTML |
| **AVOID** | Third-party read-aloud plug-ins (BrowseAloud/ReachDeck-style). Screen-reader users already have speech, and low-vision and elderly users are better served by large default text, high contrast, and good zoom. If audio is genuinely needed for low-literacy visitors, offer **recorded human audio** of key information (dates, venue, how to register) as a normal `<audio>` element with a transcript. | Overlay Fact Sheet (history of read-aloud add-ons) |

### 4(d) Multilingual selectors

| Action | Pattern | Source |
|---|---|---|
| **ADOPT** | Write language names in their own script ("English", "ಕನ್ನಡ", "हिन्दी", "தமிழ்", "മലയാളം", "తెలుగు"), as a plain list or a `<details>` button, each with the correct `lang` and `hreflang` attributes. **No flags.** | UN (names, not flags); RNIB (`hreflang` en/cy) |
| **ADOPT** | Human-translated versions of the **critical pages only** (Home, Plan your visit, Register, Accessibility), with their own URLs (`/kn/`, `/hi/`) and `hreflang` alternates. | RNIB `/cy/`; Abilities Expo's separate Spanish registration |
| **ADOPT** | A plain "All languages" link in both header and footer. | W3C WAI |
| **IMPROVE** | If machine translation is kept for long-tail pages, label it as automatic and keep the human-translated core pages separate. | — |
| **AVOID** | Floating machine-translation widgets (GTranslate, now on AIE and on Kidz) as the *only* multilingual route. They are typically JavaScript-only, tend to set no `lang` on the translated content, and are not reliable for registration terms or refund policy. | AIE baseline, Kidz |

---

## 5. General patterns (homepage, CTAs, trust, imagery)

- **ADOPT:** An event fact block above the fold: dates, per-day hours, venue and hall, "Free for visitors", plus one primary and one secondary CTA (Abilities Expo, REHACARE "at a glance").
- **ADOPT:** Trust signals: organiser identity, partner and government logos (with meaningful alt text), 1st-edition numbers *only if verifiable*, short attributed testimonials, and a phone or WhatsApp helpline displayed prominently (RNIB, AbilityNet).
- **ADOPT:** Person-centred photography of real attendees doing things (trying equipment, dancing, at stalls), with descriptive alt text that names the activity (Abilities Expo, RNIB). Use real AIE 1st-edition photos, not stock.
- **AVOID:** Exhibitor-sales hero copy on a visitor-first site (REHACARE's H1). Put the sponsor and exhibitor pitch in its own path.
- **AVOID:** Countdown timers as the first heading (Naidex). They are noisy for screen readers and give no information.
- **AVOID:** Duplicated mobile and desktop markup that repeats headings (REHACARE), and shape-only alt text (Kidz).

---

## 6. Sources

- https://www.abilities.com/ , /los-angeles , /los-angeles/register , events.tpni.com registration iframe
- https://www.naidex.co.uk/ , /visit , /visit/pre-register-2027
- https://www.rehacare.com/ , /en/visit
- https://www.atia.org/ , /registration-information/ , /course-registration-pricing/
- https://www.kidzexhibitions.co.uk/
- https://abilitynet.org.uk/ , /TechSharePro
- https://www.rnib.org.uk/ , /get-involved/fundraise/challenge-events/
- https://www.scope.org.uk/ , /events
- https://www.w3.org/WAI/ (text only; curl blocked by Cloudflare)
- https://www.un.org/en/webaccessibility/
- https://overlayfactsheet.com/en/
- CSUN AT Conference — **not fetchable (403)**
