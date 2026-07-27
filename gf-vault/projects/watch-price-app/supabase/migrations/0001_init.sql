-- GF Vault Watch Price Checker — initial schema
-- Tables: price_estimates (cache), usage (free-tier limits), leads (sell-to-us), subscriptions (RevenueCat sync)

create extension if not exists "pgcrypto";

-- Cached AI-generated price estimates, keyed by normalized reference + condition bucket.
create table if not exists price_estimates (
  id uuid primary key default gen_random_uuid(),
  normalized_reference text not null,
  condition_bucket text not null default 'any',
  brand text not null,
  model text not null,
  reference text not null,
  price_low numeric not null,
  price_high numeric not null,
  confidence text not null check (confidence in ('low', 'medium', 'medium-high', 'high')),
  liquidity_rating text not null check (liquidity_rating in ('very slow', 'slow', 'average', 'liquid', 'very liquid')),
  comps jsonb not null default '[]'::jsonb,
  sources jsonb not null default '[]'::jsonb,
  fetched_at timestamptz not null default now(),
  unique (normalized_reference, condition_bucket)
);

create index if not exists price_estimates_lookup_idx
  on price_estimates (normalized_reference, condition_bucket);

-- Free-tier usage tracking, one row per user (anonymous or authenticated).
create table if not exists usage (
  user_id uuid primary key references auth.users (id) on delete cascade,
  lookups_this_period integer not null default 0,
  period_start timestamptz not null default now(),
  tier text not null default 'free' check (tier in ('free', 'premium'))
);

-- Sell-to-us lead submissions, feeding the GF Vault sourcing pipeline.
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  brand text not null,
  model text not null,
  reference text not null,
  condition text,
  photos jsonb not null default '[]'::jsonb,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  notes text,
  status text not null default 'new' check (status in ('new', 'contacted', 'offer_made', 'closed_won', 'closed_lost')),
  submitted_at timestamptz not null default now()
);

-- Subscription state synced from RevenueCat webhook (server-side only writes).
create table if not exists subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  tier text not null default 'free' check (tier in ('free', 'premium')),
  renews_at timestamptz,
  updated_at timestamptz not null default now()
);

-- Row Level Security
alter table price_estimates enable row level security;
alter table usage enable row level security;
alter table leads enable row level security;
alter table subscriptions enable row level security;

-- price_estimates: readable by any authenticated (incl. anonymous) client; writes are service-role only (Edge Function).
create policy "price_estimates readable by authenticated users"
  on price_estimates for select
  to authenticated
  using (true);

-- usage: users can read/upsert only their own row.
create policy "usage readable by owner"
  on usage for select
  to authenticated
  using (auth.uid() = user_id);

create policy "usage insertable by owner"
  on usage for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "usage updatable by owner"
  on usage for update
  to authenticated
  using (auth.uid() = user_id);

-- leads: users can submit and read their own submissions only.
create policy "leads insertable by owner"
  on leads for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "leads readable by owner"
  on leads for select
  to authenticated
  using (auth.uid() = user_id);

-- subscriptions: users can read their own row; writes are service-role only (RevenueCat webhook).
create policy "subscriptions readable by owner"
  on subscriptions for select
  to authenticated
  using (auth.uid() = user_id);

-- Storage bucket for sell-to-us photos.
insert into storage.buckets (id, name, public)
values ('lead-photos', 'lead-photos', false)
on conflict (id) do nothing;

create policy "lead photos uploadable by authenticated users"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'lead-photos');

create policy "lead photos readable by owner"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'lead-photos' and owner = auth.uid());
