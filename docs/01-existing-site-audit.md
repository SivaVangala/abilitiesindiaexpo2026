# 01 — Existing Website Audit: abilitiesindiaexpo.com

**Audited:** 28 Oct 2026 · **Method:** fetched the WordPress sitemap (87 URLs) and the HTML of every public content page, then extracted headings, copy, links, forms and images. An earlier accessibility and translation assessment (22 Sep 2026, `ABILITIESINDIAEXPO_ASSESSMENT_2026-09-22.md` in the Tickets99 repo) is referenced, not repeated.

> Rule used throughout: nothing below is invented. Anything that needs the organiser's confirmation is marked **⚠ VERIFY**.

## 1. Platform

| Area | Finding |
|---|---|
| CMS | WordPress 6.9 + Elementor / Elementor Pro, **Exhibz** event theme |
| Ticketing today | WooCommerce "Event" products **and** the "Ticktify" plugin pages (`/ticktify-*`, `/tickets-*`), so two ticket systems sit side by side |
| Forms | Elementor Pro Forms + Contact Form 7. The FAQ page shows "Error: Contact form not found." |
| Translation | GTranslate (10 languages); the switcher can't be used with a keyboard |
| Accessibility | "One Click Accessibility" overlay toolbar |
| Chat | Chaty WhatsApp button |
| SEO | Meta description is literally `Abilities India Expo - ` on the pages checked; **no Open Graph tags; no structured data (JSON-LD)** |
| Images | 76 unique uploaded images; **337 of 376 `<img>` tags have empty alt** (≈90%), including the logo |

## 2. Verified event facts (from the live site)

| Fact | Value | Status |
|---|---|---|
| Edition | Abilities India Expo **2nd Edition**, both B2B and B2C, "Marketed by Trade India" | Live home page |
| Dates | **20–22 December 2026** | Home + KTPO page agree |
| Venue | **KTPO International Exhibition and Convention Centre, Bengaluru, Karnataka** | Home + KTPO page |
| Daily timings (2026) | **Not published** | ⚠ VERIFY |
| 1st Edition | Rajiv Gandhi Indoor Stadium, Kochi · 31 Jan – 2 Feb 2025 · 11 AM – 8 PM | Home page footer block |
| International Expo | Pragati Maidan, New Delhi · last week of October 2027 ("We plan to…") | Planned, not confirmed |
| Organiser | Walshal Abilities And Assistive Technologies Pvt Ltd, Kochi | Footer |
| Contact | +91 8848367546 · abilitiesindiaexpo@gmail.com · info@abilitiesindiaexpo.com · No. 4/461, 2nd Floor, Suite #1995, Valamkottil Towers, Judgemukku, Kakkanad, Kochi 682021 | Footer |
| Counters | 100000+ visitors · 1000+ exhibitors · 30+ sessions · 50+ speakers | Home. **Conflicts with the Visitors page ("more than 50,000")** ⚠ VERIFY. These are forward-looking claims, so present them as "expected" |
| Ticket products | 5 WooCommerce "Day N Pass" products, ₹100 each, dated **13–17 December** (an older edition, not 2026) | **Outdated** — must not be reused |

## 3. Page inventory and verdicts

Legend: **K** keep · **R** rewrite · **M** merge · **X** remove/replace (template demo or outdated)

| Live URL | Content summary | Verdict | Notes / barriers |
|---|---|---|---|
| `/` | Hero, upcoming event, motto, counters, about copy, 1st-edition logos, associate/sponsor, 1st-edition venue | **R** | Duplicate "Our Motto" block; no H1; logos unlabelled |
| `/about-us/` | Founder Simon George: biography, awards (Mphasis 2015, Accessible India 2015), Norway documentary, presentations, Flywings Megashow, Dubai summit 2022 | **K/R** | Rich but unstructured; spelling errors ("Documentory", "Memorandom"); 9 untitled award photos |
| `/ambassadors/` | Vaikom Vijayalakshmi, playback singer | **K** | Single ambassador |
| `/visitors/` | 50,000+ visitors; 45-item visitor-profile list | **R** | Wall of bullets; group it into 6 audiences |
| `/exhibitors/` | Why exhibit (10 benefits), ~45 exhibitor categories | **R** | Group categories; add an enquiry path |
| `/elderly-services/` | 6 services with photos | **K** | Good content |
| `/palace_ground/` | KTPO venue, Dec 20–22 2026 | **R → `/venue/`** | Slug mismatch (palace_ground); needs 301 |
| `/venue/` | **Exhibz demo: "Brighton Waterfront Hotel, London"** | **X** | Replace with the real KTPO accessibility and travel page |
| `/faq/` | **Demo: "When does Exhibit Conference 2020…", lorem ipsum, broken form** | **X** | Write a real FAQ |
| `/schedule-list/`, `/schedule-tab/`, `/schedule-tab-ii/` | **Demo speakers ("James Killer…"), 14–15 Feb** | **X** | Replace when the organiser supplies a schedule |
| `/blog/` + 3 posts | **Demo posts (Jan 2019)** | **X** | Remove; drop from sitemap |
| `/speaker-style-3/` | Theme demo | **X** | Remove |
| `/assistive-technology-fest/` | 15 technology themes, 6 example photos; startups and colleges may exhibit | **K/R** | |
| `/accessible-tourism-fest/` | One paragraph | **R** | Thin |
| `/medical-tourism-fest/` | Allopathic / Ayurveda / Homeopathy / Naturopathy | **R** | Avoid medical claims |
| `/shopping-fest/` | Products made by PwDs: 7 craft types | **K** | |
| `/cultural-fest/` | Every evening: wheelchair dance and more + registration form | **K** | Form needs labels/errors |
| `/short-film-fest/` | **Not in the main menu.** Films by/for PwDs; team 5+2; max 5 min; topics; registration form | **K — add to IA** | Was missing from our v1/v2 |
| `/job-fair/` | Job seekers + employers | **K** | |
| `/job-seekers-registration/` | Long form (education dropdown etc.) | **→ Tickets99** | Candidate ticket type ⚠ |
| `/employer-registration/` | Long employer form | **→ Tickets99** | Candidate ticket type ⚠ |
| `/awards/` | Achievement Awards (8 categories) + AT Awards | **K** | |
| `/achievement-award/` | Entry form incl. disability-type list (RPwD Act categories) | **→ Tickets99** | ⚠ |
| `/assistive-technology-registration/` | AT Award entry, **"2023"**, 9+ award categories, invoice mention | **→ Tickets99** | Year outdated |
| `/matrimonial-meet/` | Registration form | **→ Tickets99** | Sensitive data: privacy notice needed |
| `/seminars/` | 9 seminar topics | **K** | No dates/speakers |
| `/workshops/` | Demonstrations | **M** with Seminars into "Conferences & Workshops" | |
| `/business-meets/`, `/media-coverage/`, `/services/` | One paragraph each | **M** | Business Meets → Exhibitors; Services → Accessibility page |
| `/gallery/` | 10 images, no captions | **K** | Needs captions/alt text |
| `/apply-for-msme-stall-grant/` | **2023** approval, deadline **04.12.2023**, 80%/100% space-rent assistance, max 60 applications | **R ⚠** | Must not show 2023 terms as current |
| `/registration/` | Generic expo registration form | **→ Tickets99** | |
| `/abilities-international-expo/` | 2027 New Delhi plan | **K** | Label as planned |
| `/privacy-policy/` | **States the site is "hosted on the Wix.com platform"** (false: WordPress) | **R ⚠** | Legal review |
| `/terms-and-conditions/` | Effective 26 Jul 2023 | **R ⚠** | Legal review |
| `/refund-policy/` | No refunds; transfers allowed; disability accommodation clause | **K ⚠** | Check against Tickets99 refund behaviour |
| `/shop/`, `/cart/`, `/checkout/`, `/tickets/*`, `/ticktify-*`, `/tickets-*`, `/my-account/`, `/transactions/` | WooCommerce + Ticktify flows | **X → Tickets99** | 301 everything to `/programs/` |
| `/contact/` | Contact information | **R** | Add an accessible form |

## 4. Content to retain (core message)

- Mission: *Empowering people with disabilities and elderly people to leave an underprivileged, distressed life and start a new one.*
- Positioning: *Multifaceted International Expo for People With Disabilities (Divyangjan) & the Elderly*; B2B + B2C.
- Programs: Assistive Technology Fest, Accessible Tourism Fest, Medical Tourism Fest, Shopping Fest, Cultural Fest, **Short Film Fest**, Job Fair, Business Meets, Matrimonial Meet, Seminars, Workshops, Awards (Achievement + AT), Elderly Services, free on-site Services, Media Coverage, Gallery.
- Founder story and ambassador.

## 5. Accessibility barriers (summary; details in the 22 Sep 2026 assessment)

1. Language switcher and main drop-down can't be used by keyboard.
2. The skip link points to a missing `#content` target.
3. No H1 on most pages; the first headings are "Call Now" / "Email Us".
4. ~90% of images have empty alt text, including the logo and partner logos.
5. Focus outline removed by the theme; the form focus state is a red border only (colour-only signal).
6. Low-contrast pink buttons; mobile menu button announced as "hamburger-icon".
7. An overlay toolbar is used instead of native accessibility.
8. Demo content (London venue, 2020 FAQ) misleads every user, especially screen-reader users who can't scan visually.

## 6. Duplications and inconsistencies

- "Our Motto" rendered twice on the home page.
- Visitor count: 100,000+ (home) vs 50,000+ (visitors page).
- Two ticket systems (WooCommerce + Ticktify) plus several separate registration forms → **all consolidate into one Tickets99 parent event**.
- Old dates appear in three places: day passes (13–17 Dec), AT Award form (2023), MSME page (2023).

## 7. New components required

Audience chooser · program/ticket card · ticket detail template · Free/Paid badge (text + icon, never colour alone) · filter bar with live result count · FAQ accordion (native `<details>`) · accessibility preferences panel · language selector · venue accessibility block · breadcrumb · sticky mobile Register bar that never covers content · status banner for "registration not yet open".

## 8. Redirect map (to configure at go-live)

`/palace_ground/` → `/venue/` · `/registration/`, `/shop/`, `/tickets/*`, `/ticktify-*`, `/tickets-*`, `/cart/`, `/checkout/` → `/programs/` · `/job-seekers-registration/`, `/employer-registration/` → `/programs/job-fair/` · `/achievement-award/`, `/assistive-technology-registration/` → `/programs/awards/` · `/schedule-*`, `/speaker-style-3/` → `/programs/` · `/blog/*` and demo posts → `/` (410 Gone preferred) · `/apply-for-msme-stall-grant/` → `/exhibitors/#msme`.
