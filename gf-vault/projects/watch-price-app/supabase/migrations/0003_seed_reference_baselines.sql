-- Seed reference_baselines from the entries already curated in
-- memory/watch-pricing-knowledge.md, so check-price/analyze-watch have real
-- grounding data from day one instead of an empty table.
--
-- normalized_reference values below were computed by actually running
-- _shared/pricing-methodology.ts's normalizeReference(brand, model,
-- reference) against each row's exact brand/model/reference strings (node
-- -e, not hand-derived) — a mismatch here would silently make a row
-- unreachable by any real lookup. If you add rows later, do the same:
-- compute, don't guess — the Omega row's dotted reference number in
-- particular strips down to a very different-looking string
-- (210.30.42.20.01.001 -> 21030422001001) than it looks like it should.

insert into reference_baselines
  (normalized_reference, brand, model, reference, typical_ask_low, typical_ask_high,
   realistic_sold_low, realistic_sold_high, liquidity_rating, negotiation_notes, service_notes, source)
values
  ('rolex-submariner-116610', 'Rolex', 'Submariner', '116610', 8500, 12000, 7800, 9500, 'very liquid',
   'Asking to opening: -10% to -15%. Glidelock bracelet loss: -$800-$1,200 vs link bracelet.',
   'Bezel insert replacement $400-$600.', 'manual'),
  ('tudor-black-bay-79230b', 'Tudor', 'Black Bay', '79230B', 4200, 5200, 3800, 4600, 'liquid',
   'Asking to opening: -12% to -20%. Box and papers: +$300-$500.', null, 'manual'),
  ('tudor-black-bay-chrono-79360n', 'Tudor', 'Black Bay Chrono', '79360N', 4800, 5200, 4380, 4950, 'liquid',
   'Asking to opening: -5% to -15%. Opening to strong: +3% to +7%.',
   'Service cost $600-$800 (chronograph). Box/papers +$250-$400.', 'manual'),
  ('tudor-black-bay-54-79000b', 'Tudor', 'Black Bay 54', '79000B', null, null, 3655, 3655, 'liquid',
   'Insufficient data — single confirmed sale (no-reserve auction) as of 2026-07-12.', null, 'manual'),
  ('omega-seamaster-diver-300m-21030422001001', 'Omega', 'Seamaster Diver 300M', '210.30.42.20.01.001',
   5200, 6000, 4800, 5500, 'very liquid', null, 'Service ~$800-$1,200.', 'manual')
on conflict (normalized_reference) do update set
  typical_ask_low = excluded.typical_ask_low,
  typical_ask_high = excluded.typical_ask_high,
  realistic_sold_low = excluded.realistic_sold_low,
  realistic_sold_high = excluded.realistic_sold_high,
  liquidity_rating = excluded.liquidity_rating,
  negotiation_notes = excluded.negotiation_notes,
  service_notes = excluded.service_notes,
  updated_at = now();
