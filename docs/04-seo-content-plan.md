# 04 — SEO Strategy & Page-by-Page Metadata

## Approach
**Search intent first:**
- **Navigational:** "Abilities India Expo", dates, tickets → Home, FAQ, Programs.
- **Informational:** "assistive technology exhibition India", "mobility aids exhibition" → Explore the Expo pages.
- **Transactional:** "register", "exhibit", "job fair for PwD" → Programs and the category pages.

No keyword stuffing: each page targets one cluster with plain-language copy.

**Keyword research note:** the volumes below are not from a keyword tool. No Search Console or keyword-tool access was available, so the clusters come from the program inventory, the benchmark sites' terminology and search phrasing observed on SERPs. **Validate in Google Search Console after launch.**

## Implemented on every page
- unique `<title>` and meta description (50–160 chars, checked automatically by `qa/run-qa.js`)
- one H1; logical H2/H3; descriptive link text (screen-reader suffixes on repeated "Register" / "Details" links)
- canonical URL; Open Graph and Twitter card, with a 1200×630 `og-default.png` generated from the brand
- JSON-LD `@graph`: **Organization** (organiser), **Event** (home, programs, category pages — verified dates and venue; **no `offers` until Tickets99 prices are confirmed**, so no fabricated prices), **BreadcrumbList** (inner pages), **FAQPage** (only answers not awaiting confirmation)
- `sitemap.xml` (indexable pages only) and `robots.txt` (disallows `/register/`)
- `hreflang` only for languages marked **reviewed** (see doc 03 §4)
- image `alt`, `width`/`height` (CLS 0), lazy loading below the fold
- the 301 map from every old WordPress URL (host `Program.cs`) preserves link equity

## Page-by-page
| URL | Target cluster | Title | Meta description (chars) | Index |
|---|---|---|---|---|
| `/` | Abilities India Expo; disability expo India; assistive technology exhibition India; disability expo Bengaluru | Abilities India Expo 2026 · Disability & Assistive Technology Expo, Bengaluru — 20–22 Dec | India’s expo for people with disabilities and the elderly: assistive technology, jobs, culture and free support. 20–22 Dec 2026, KTPO Bengaluru. (144) | index |
| `/programs/` | Abilities India Expo registration; disability expo tickets; register disability exhibition | Programs & Registration · Abilities India Expo 2026 | All 15 ways to take part in one event: visit, exhibit, Job Fair, Cultural and Short Film Fest, awards and more. 20–22 Dec 2026, KTPO Bengaluru. (143) | index |
| `/programs/visitor/` | Abilities India Expo + category name (long tail) | Visitor Registration · Abilities India Expo 2026 | Entry to the expo halls, all fests, free seminars, workshops and evening cultural programmes. Part of Abilities India Expo 2026, 20–22 Dec, KTPO Bengaluru. (155) | index |
| `/programs/exhibitor/` | Abilities India Expo + category name (long tail) | Exhibitor Stall Booking · Abilities India Expo 2026 | Showcase products and services to visitors, buyers, distributors and partners from across India. Part of Abilities India Expo 2026, 20–22 Dec, KTPO Bengaluru. (158) | index |
| `/programs/assistive-tech-innovator/` | Abilities India Expo + category name (long tail) | Assistive Technology Fest — Startup & College Exhibit · Abilities India Expo 2026 | Startups and engineering colleges exhibit their inventions for people with disabilities. Part of Abilities India Expo 2026, 20–22 Dec, KTPO Bengaluru. (150) | index |
| `/programs/business-meet/` | Abilities India Expo + category name (long tail) | Business Meet · Abilities India Expo 2026 | Pre-arranged meetings between exhibitors and their clients, buyers and distributors. Part of Abilities India Expo 2026, 20–22 Dec, KTPO Bengaluru. (146) | index |
| `/programs/shopping-fest-seller/` | Abilities India Expo + category name (long tail) | Shopping Fest — Maker Stall · Abilities India Expo 2026 | Sell products made by persons with disabilities: paintings, crafts, jewellery, garments and more. Part of Abilities India Expo 2026, 20–22 Dec, KTPO Bengaluru (158) | index |
| `/programs/sponsor/` | Abilities India Expo + category name (long tail) | Sponsor & Associate Enquiry · Abilities India Expo 2026 | Partner with the expo as a sponsor or associate organisation. Part of Abilities India Expo 2026, 20–22 Dec, KTPO Bengaluru. (123) | index |
| `/programs/job-seeker/` | Abilities India Expo + category name (long tail) | Job Fair — Job Seeker · Abilities India Expo 2026 | Job seekers with disabilities meet the companies taking part in the Job Fair. Part of Abilities India Expo 2026, 20–22 Dec, KTPO Bengaluru. (139) | index |
| `/programs/employer/` | Abilities India Expo + category name (long tail) | Job Fair — Employer · Abilities India Expo 2026 | Take part in the Job Fair and meet skilled job seekers with disabilities. Part of Abilities India Expo 2026, 20–22 Dec, KTPO Bengaluru. (135) | index |
| `/programs/cultural-fest-performer/` | Abilities India Expo + category name (long tail) | Cultural Fest — Performer · Abilities India Expo 2026 | Perform on the evening stage: wheelchair dance, classical, bubble, LED and magic dance, music, comedy and magic. Part of Abilities India Expo 2026, 20–22 Dec, (158) | index |
| `/programs/short-film-entry/` | Abilities India Expo + category name (long tail) | Short Film Fest — Film Entry · Abilities India Expo 2026 | Short films made by and for persons with disabilities, screened at the expo. Part of Abilities India Expo 2026, 20–22 Dec, KTPO Bengaluru. (138) | index |
| `/programs/matrimonial-meet/` | Abilities India Expo + category name (long tail) | Matrimonial Meet · Abilities India Expo 2026 | A respectful opportunity to find and select life partners for differently-abled men and women. Part of Abilities India Expo 2026, 20–22 Dec, KTPO Bengaluru. (156) | index |
| `/programs/seminar-delegate/` | Abilities India Expo + category name (long tail) | Seminars — Delegate · Abilities India Expo 2026 | Free seminars on accessible homes, special-needs planning, home care, respite and emergency preparedness. Part of Abilities India Expo 2026, 20–22 Dec, KTPO B (158) | index |
| `/programs/workshop/` | Abilities India Expo + category name (long tail) | Workshops & Demonstrations · Abilities India Expo 2026 | Hands-on product and service demonstrations by exhibitors throughout the day. Part of Abilities India Expo 2026, 20–22 Dec, KTPO Bengaluru. (139) | index |
| `/programs/achievement-award/` | Abilities India Expo + category name (long tail) | Achievement Award — Nomination · Abilities India Expo 2026 | Nominate persons with disabilities for their achievements. Winners are selected by a jury. Part of Abilities India Expo 2026, 20–22 Dec, KTPO Bengaluru. (152) | index |
| `/programs/assistive-technology-award/` | Abilities India Expo + category name (long tail) | Assistive Technology Award — Entry · Abilities India Expo 2026 | Enter inventions that help people with disabilities overcome limitations, in any disability category. Part of Abilities India Expo 2026, 20–22 Dec, KTPO Benga (158) | index |
| `/register/` | — | Register · Abilities India Expo 2026 | Register for Abilities India Expo 2026 on Tickets99. (52) | noindex |
| `/expo/` | disability events India; inclusive technology conference; disability workshops and events | Explore the Expo — Fests, Job Fair, Awards & More · Abilities India Expo 2026 | Assistive Technology, Accessible Tourism, Medical Tourism, Shopping, Cultural and Short Film Fests, Job Fair, Business Meets, Awards, Seminars and Elderly Services. (164) | index |
| `/expo/assistive-technology-fest/` | assistive technology expo Bengaluru; mobility aids exhibition; rehabilitation equipment expo | Assistive Technology Fest · Abilities India Expo 2026, Bengaluru | Mobility devices, hardware, software and inventions that help people with disabilities live, work and use technology independently. (131) | index |
| `/expo/accessible-tourism-fest/` | accessible tourism India; wheelchair accessible travel India | Accessible Tourism Fest · Abilities India Expo 2026, Bengaluru | Tour operators, accessible vehicles, coordinators and guides who are friendly to travellers with disabilities. (110) | index |
| `/expo/medical-tourism-fest/` | medical tourism India disability; Ayurveda rehabilitation | Medical Tourism Fest · Abilities India Expo 2026, Bengaluru | Explore travel for treatment and wellness, across several systems of care, in one place. (88) | index |
| `/expo/shopping-fest/` | program name + "Abilities India Expo" | Shopping Fest · Abilities India Expo 2026, Bengaluru | Buy paintings, crafts, jewellery, garments and more — made by persons with disabilities. (88) | index |
| `/expo/cultural-fest/` | program name + "Abilities India Expo" | Cultural Fest · Abilities India Expo 2026, Bengaluru | Wheelchair dance, classical, bubble, LED and magic dance, music, comedy and magic shows by artists with disabilities. (117) | index |
| `/expo/short-film-fest/` | disability short film festival India | Short Film Fest · Abilities India Expo 2026, Bengaluru | Short films made by and for persons with disabilities. (54) | index |
| `/expo/job-fair/` | job fair for persons with disabilities; PwD jobs Bengaluru; inclusive hiring India | Job Fair · Abilities India Expo 2026, Bengaluru | Job seekers with disabilities meet employers who hire inclusively. (66) | index |
| `/expo/business-meets/` | program name + "Abilities India Expo" | Business Meets · Abilities India Expo 2026, Bengaluru | Exhibitors meet their clients, buyers and distributors face to face. (68) | index |
| `/expo/matrimonial-meet/` | program name + "Abilities India Expo" | Matrimonial Meet · Abilities India Expo 2026, Bengaluru | A respectful opportunity to find life partners for differently-abled men and women. (83) | index |
| `/expo/awards/` | disability achievement awards India; assistive technology awards | Awards · Abilities India Expo 2026, Bengaluru | Achievement Awards and Assistive Technology Awards, each selected by a jury. (76) | index |
| `/expo/seminars-workshops/` | disability seminars India; disability workshops and events | Seminars & Workshops · Abilities India Expo 2026, Bengaluru | Free seminars on everyday challenges, plus live product and service demonstrations throughout the day. (102) | index |
| `/expo/elderly-services/` | senior citizen assistive technology; elderly care services India | Elderly Services · Abilities India Expo 2026, Bengaluru | Care, nutrition, health checks, transport and social activities for senior citizens — and support for caregivers. (113) | index |
| `/visitors/` | visit disability expo Bengaluru; accessible living solutions | Visitors · Abilities India Expo 2026 | Who should visit Abilities India Expo 2026, what you will experience, free on-site support and how to register. (111) | index |
| `/exhibitors/` | exhibit at disability expo; assistive technology exhibitors India; MSME stall grant expo | Exhibitors · Abilities India Expo 2026 | Exhibit at Abilities India Expo 2026: why exhibit, exhibitor categories, business meets and the MSME stall grant. (113) | index |
| `/sponsors/` | sponsor disability event India; CSR disability inclusion | Sponsors & Partners · Abilities India Expo 2026 | Sponsor or partner with Abilities India Expo 2026 and support inclusion, accessibility and opportunity. (103) | index |
| `/accessibility/` | accessible event Bengaluru; KTPO accessibility; sign language interpreter event | Accessibility & Visitor Assistance · Abilities India Expo 2026 | Accessibility at Abilities India Expo 2026: free on-site services, venue access at KTPO Bengaluru, and how to request support. (126) | index |
| `/about/` | — | About the Expo · Abilities India Expo 2026 | About Abilities India Expo and its founder Simon George — mission, journey and recognition. (91) | index |
| `/ambassadors/` | — | Ambassadors · Abilities India Expo 2026 | Meet the ambassadors of Abilities India Expo, including Kerala playback singer and Gayatriveena artist Vaikom Vijayalakshmi. (124) | index |
| `/international-expo/` | — | Abilities International Expo 2027 · Abilities India Expo 2026 | Abilities International Expo — planned for Pragati Maidan, New Delhi, in the last week of October 2027. (103) | index |
| `/gallery/` | — | Gallery · Abilities India Expo 2026 | Photo gallery from Abilities India Expo — moments from the 1st Edition in Kochi, with captions and descriptions for every image. (128) | index |
| `/media/` | — | Media Coverage · Abilities India Expo 2026 | Media coverage and press information for Abilities India Expo. (62) | index |
| `/faq/` | Abilities India Expo dates; Abilities India Expo tickets | Frequently Asked Questions · Abilities India Expo 2026 | Answers about dates, venue, registration, tickets, refunds and accessibility at Abilities India Expo 2026. (106) | index |
| `/contact/` | — | Contact · Abilities India Expo 2026 | Contact Abilities India Expo — phone, WhatsApp, email and office address in Kochi. (82) | index |
| `/privacy/` | — | Privacy Policy · Abilities India Expo 2026 | Privacy Policy of Abilities India Expo, organised by Walshal Abilities And Assistive Technologies Pvt Ltd. (106) | noindex |
| `/terms/` | — | Terms & Conditions · Abilities India Expo 2026 | Terms & Conditions of Abilities India Expo, organised by Walshal Abilities And Assistive Technologies Pvt Ltd. (110) | noindex |
| `/refund/` | — | Refund Policy · Abilities India Expo 2026 | Refund Policy of Abilities India Expo, organised by Walshal Abilities And Assistive Technologies Pvt Ltd. (105) | noindex |
| `/accessibility-statement/` | — | Accessibility Statement · Abilities India Expo 2026 | Accessibility statement for the Abilities India Expo website — standards, features, known limitations and how to report a problem. (130) | index |
| `/404.html` | — | Page not found · Abilities India Expo | Page not found. (15) | noindex |

## After launch
1. Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools; verify both domains (`www` and apex) and pick one canonical host.
2. Ask partners (KSUM, K-DISC, NCPEDP, Aster) to link to `/` or `/exhibitors/`.
3. Add `offers` to the Event JSON-LD once Tickets99 prices are synced (`price`, `priceCurrency: INR`, `availability`, `url` = booking URL).
4. Publish reviewed Hindi/Kannada pages first (Bengaluru audience), then Malayalam (organiser's home state), Tamil and Telugu.
