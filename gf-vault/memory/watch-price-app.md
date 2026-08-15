---
name: watch-price-app
description: Consumer mobile app (Expo) that productizes the pricing genius methodology into an AI-powered live price checker with lead-gen and premium tiers
metadata:
  type: project
---

**Decision (2026-07-26):** Build a consumer-facing mobile app — brand/model/reference in, AI-researched price estimate out — as a second GF Vault revenue line, dual-purpose as a "sell to us" lead-gen funnel and a freemium/premium product.

**Why:** GF Vault's Watch Pricing Genius methodology ([[watch-pricing-genius]]) already does this analysis manually for acquisitions. Consumers doing the same lookup (curious owners, potential sellers) are an underserved audience — free price checks build trust and traffic, then the CTA on every result feeds real sellers into the sourcing pipeline.

**Architecture:**
- Expo (React Native) app + Supabase (Postgres, anonymous auth, Edge Functions)
- Each lookup triggers a live Claude call with the web search tool (`web_search_20260209`), grounded first in GF Vault's own `reference_baselines` table (seeded from [[watch-pricing-knowledge]], refreshed by the weekly research routine) via a system prompt shared with `analyze-watch` and [[watch-pricing-genius]] (source hierarchy, never present asking as sold, confidence scoring, liquidity rating — canonical copy in `supabase/functions/_shared/pricing-methodology.ts`), returned as structured JSON via `output_config.format`
- Results cached 24h per normalized reference+condition to control cost/latency
- Free tier: 3 lookups/month; premium tier deferred (RevenueCat/IAP wiring not yet built — Paywall screen is a stub)
- Second Edge Function, `analyze-watch` (Opus, photo-capable, `--no-verify-jwt`): Griffin's internal buy/pass tool, implementing [[watch-pricing-genius]] machine-callably, now on the same shared methodology/baseline foundation as the consumer function above. See README's "Internal tool" section.

**How to apply:** This is the active build — code lives at `gf-vault/projects/watch-price-app/`. See its `README.md` for setup/run instructions. Not yet done: RevenueCat subscriptions, store listing assets, privacy policy, actual App Store/Play Store submission — those need the user's Apple/Google developer accounts (flagged, not yet created as of 2026-07-26).

**Decision (2026-08-15):** Unified `check-price`, `analyze-watch`, and [[watch-pricing-genius]] onto one shared methodology module instead of three independently-maintained copies of the same source-hierarchy/confidence/acquisition-tier text, and grounded both Edge Functions in GF Vault's own `reference_baselines` table instead of answering from zero context every request.

**Why:** Analysis found `analyze-watch` (Griffin's internal Opus-based photo buy/pass tool) was fully undocumented and silently drifting from `check-price`'s prompt, and neither function could reach [[watch-pricing-knowledge]]'s curated baselines or ever benefit from GF Vault's own transaction history — the pricing-genius spec's "search GF Vault's own data first" rule had no actual implementation path from a deployed Edge Function.

**How to apply:** `supabase/functions/_shared/pricing-methodology.ts` is now canonical for source hierarchy/confidence rubric/acquisition tiers/`normalizeReference`/baseline lookup — edit it there, not in either function or in `watch-pricing-genius.md`. `reference_baselines` has no live transaction data yet (`recent_transactions` reserved, not populated — [[pricing-transactions]] is still empty); don't build a parallel `transactions` table until real transactions exist to justify it. Weekly research routine's `RemoteTrigger` stored prompt still needs a separate update to actually emit the new `.baselines.json` sidecar — spec doc alone doesn't change what the scheduled routine runs.

**Related:** [[watch-pricing-genius]], [[watch-pricing-knowledge]], [[comparable-research]]
