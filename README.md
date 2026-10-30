# Abilities India Expo — Website

An accessible, mobile-first event website for **Abilities India Expo 2026** (2nd Edition, 20–22 Dec 2026, KTPO Bengaluru), organised by Walshal Abilities And Assistive Technologies Pvt Ltd. Registration and payment are handled by **Tickets99**: **one parent event** with up to **15 ticket types**.

> **Status:** release candidate for organiser review. All automated QA passes (below). The site is **not launched**: ticket data, timings and several facts await the organiser (`docs/06`). Nothing has been deployed.

## Quick start

```bash
npm install
npm run build        # generates dist/ (47 pages + sitemap, robots, pre-compressed files)
npm run serve        # http://localhost:5310
npm run qa           # axe (WCAG 2.2 AA) ×2 viewports, 320px reflow, keyboard flows, links
npm run qa:lighthouse
```

Visual Studio: open `host/AbilitiesIndiaExpo.slnx` → F5 → http://localhost:5320 (serves `dist/`, so run `npm run build` first).

## What's where

| Path | Purpose |
|---|---|
| `content/` | **Edit here.** Verified facts (`site.js`), 15 registration categories (`tickets.js`), expo experiences, FAQ |
| `build/` | Static generator: layout, SEO and JSON-LD, components, inline SVG icons |
| `assets/` | Design system CSS, ~12 KB JS, images, self-hosted fonts |
| `i18n/` | Languages, translation cache, organiser-approved overrides |
| `tools/` | `sync-tickets99.js` (ticket metadata), `translate.js` (Cloud Translation), `make-og.js` |
| `qa/` | Automated test suite and reports |
| `host/` | ASP.NET Core 10 static host: compression, CSP, 301s from old URLs, 404 |
| `docs/` | 01 audit · 02 benchmark · 03 architecture & Tickets99 · 04 SEO · 05 accessibility & QA · 06 handover & acceptance |
| `_v2_backup/` | Earlier design drafts (v1, v2), kept for reference only |

## QA snapshot (28 Oct 2026)

- **axe-core:** 0 violations across 47 pages × 2 viewports
- **Reflow at 320px:** 0 failures
- **Keyboard:** 15/15 scripted flows pass
- **Focus not obscured:** 0 of 420 Tab steps
- **Internal links:** 0 broken
- **Lighthouse (mobile):** Performance 98–99, Accessibility 100, Best Practices 100, SEO 100

Manual screen-reader testing and the Tickets99 booking flow are **not yet tested**; see `docs/05` §4.

## Principles

- Accessibility is built into the HTML. There is no overlay widget.
- No invented event data. Anything unverified is flagged on the page.
- Tickets99 is the system of record. The site never simulates a booking, and no secrets ship to the browser.

## VERSION B (demo copy)
Colourful light theme, photo-led homepage, motto band, right-side sticky dock (Accessibility Tools / Language / Audio), back-to-top, colour-vision modes (red-green, blue-yellow, black & white). Runs on http://localhost:5321 (host/AbilitiesIndiaExpo.slnx).
**Language switching in this demo uses Google's on-page website translator** (loaded only after a visitor picks a language). For production, use reviewed pre-built pages (tools/translate.js) - see docs/03 section 4.

