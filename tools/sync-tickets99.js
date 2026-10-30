/*
 * Build-time sync of ticket metadata from Tickets99 (the system of record). Nothing runs in the browser.
 *
 *   T99_API_BASE=https://<tickets99-api-host> node tools/sync-tickets99.js            (dry run: prints the mapping)
 *   T99_API_BASE=https://<tickets99-api-host> node tools/sync-tickets99.js --write    (writes content/tickets99.snapshot.json)
 *
 * Endpoint (confirmed in Tickets99 source, [AllowAnonymous], no secret needed):
 *   GET {T99_API_BASE}/v1/purchase/geteventdatesforticketpurchase?uniquecode={UniqueCode}&ticketid=&type=
 *   -> { StatusId, StatusMessage, CurrencySign, TicketGroups: [ { Tickets: [ { TicketId, TicketName, TicketDescription,
 *        Price, FullPrice, TaxPercentage, CurrencySign, SoldOut, AvailableQuantity, PromotionEndDate } ] } ] }
 *   StatusId 0 = "ticket sale is not live yet". Tickets outside their sale window are omitted by Tickets99 itself.
 *
 * Mapping: content/tickets99-map.json links each website category slug to a Tickets99 TicketId and the encrypted
 * `ti` booking token copied from the Tickets99 admin ("ticket URL"). The `ti` cannot be computed here.
 *   { "visitor": { "ticketId": 12345, "ti": "nRTPg...==" }, ... }
 *
 * Rules: never fabricates prices or availability; unmapped categories stay as "to be announced".
 */
const fs = require('fs');
const path = require('path');
const SITE = require('../content/site');
const ROOT = path.join(__dirname, '..');
const base = process.env.T99_API_BASE;
const code = process.env.T99_UNIQUE_CODE || SITE.tickets99.uniqueCode;
const write = process.argv.includes('--write');

(async () => {
  if (!base || !code) {
    console.error('Set T99_API_BASE and content/site.js tickets99.uniqueCode (or T99_UNIQUE_CODE). Nothing fetched.');
    process.exit(1);
  }
  const mapFile = path.join(ROOT, 'content', 'tickets99-map.json');
  const map = fs.existsSync(mapFile) ? JSON.parse(fs.readFileSync(mapFile, 'utf8')) : {};
  const url = `${base.replace(/\/$/, '')}/v1/purchase/geteventdatesforticketpurchase?uniquecode=${encodeURIComponent(code)}&ticketid=&type=`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Tickets99 responded ${res.status}`);
  const data = await res.json();
  const all = (data.TicketGroups || []).flatMap(g => g.Tickets || []);
  console.log(`StatusId=${data.StatusId} (${data.StatusMessage || ''}) · ${all.length} ticket(s) returned for ${code}`);
  const byId = Object.fromEntries(all.map(t => [String(t.TicketId), t]));
  const snapshot = { fetchedAt: new Date().toISOString(), uniqueCode: code, statusId: data.StatusId, currencySign: data.CurrencySign, tickets: {} };
  for (const [slug, m] of Object.entries(map)) {
    const t = byId[String(m.ticketId)];
    if (!t) { console.warn(`  ! ${slug}: TicketId ${m.ticketId} not returned (not on sale yet, or wrong id)`); continue; }
    snapshot.tickets[slug] = { ticketId: t.TicketId, ti: m.ti || null, name: t.TicketName, description: t.TicketDescription,
      price: Number(t.Price), fullPrice: Number(t.FullPrice), taxPercentage: t.TaxPercentage, soldOut: !!t.SoldOut, saleEnds: t.PromotionEndDate || null };
    console.log(`  ✓ ${slug} -> ${t.TicketName} · ${t.CurrencySign}${t.Price}${t.SoldOut ? ' · SOLD OUT' : ''}`);
  }
  const unmapped = all.filter(t => !Object.values(map).some(m => String(m.ticketId) === String(t.TicketId)));
  unmapped.forEach(t => console.log(`  ? unmapped Tickets99 ticket ${t.TicketId}: ${t.TicketName}`));
  if (write) { fs.writeFileSync(path.join(ROOT, 'content', 'tickets99.snapshot.json'), JSON.stringify(snapshot, null, 2)); console.log('Wrote content/tickets99.snapshot.json — run npm run build.'); }
  else console.log('Dry run. Add --write to save the snapshot.');
})().catch(e => { console.error(e.message); process.exit(1); });
