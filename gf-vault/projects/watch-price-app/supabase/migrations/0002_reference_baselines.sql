-- GF Vault Watch Price Checker — reference baselines
-- Grounds check-price/analyze-watch in GF Vault's own accumulated pricing
-- intelligence (currently in memory/watch-pricing-knowledge.md) instead of
-- answering from zero context on every request. Joins to price_estimates
-- via the same normalized_reference key/algorithm (_shared/pricing-methodology.ts).

create table if not exists reference_baselines (
  id uuid primary key default gen_random_uuid(),
  normalized_reference text not null unique,
  brand text not null,
  model text not null,
  reference text not null,
  typical_ask_low numeric,
  typical_ask_high numeric,
  realistic_sold_low numeric,
  realistic_sold_high numeric,
  liquidity_rating text check (liquidity_rating in ('very slow', 'slow', 'average', 'liquid', 'very liquid')),
  negotiation_notes text,
  service_notes text,
  -- Reserved for GF Vault's own completed transactions once
  -- memory/pricing-transactions.md has real entries — not populated yet.
  -- Denormalized here (not a separate `transactions` table) because no
  -- write path or real data exists today; a normalized table is a
  -- follow-up once there's something to write.
  recent_transactions jsonb not null default '[]'::jsonb,
  source text not null default 'manual' check (source in ('manual', 'weekly_research')),
  updated_at timestamptz not null default now()
);

-- No separate index on normalized_reference: the `unique` constraint above
-- already creates one (price_estimates_lookup_idx in 0001_init.sql repeats
-- this redundantly for price_estimates; deliberately not repeated here).

alter table reference_baselines enable row level security;

-- Same sensitivity class as price_estimates (aggregate price ranges/liquidity
-- already surfaced to consumers via check-price) — readable by authenticated
-- clients (incl. anonymous app sessions); writes are service-role only
-- (Edge Functions + supabase/scripts/sync-baselines.ts).
create policy "reference_baselines readable by authenticated users"
  on reference_baselines for select
  to authenticated
  using (true);
