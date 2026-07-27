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
- No maintained pricing database — instead, each lookup triggers a live Claude call with the web search tool (`web_search_20260209`), using a system prompt adapted from the pricing genius methodology (source hierarchy, never present asking as sold, confidence scoring, liquidity rating), returned as structured JSON via `output_config.format`
- Results cached 24h per normalized reference+condition to control cost/latency
- Free tier: 3 lookups/month; premium tier deferred (RevenueCat/IAP wiring not yet built — Paywall screen is a stub)

**How to apply:** This is the active build — code lives at `gf-vault/projects/watch-price-app/`. See its `README.md` for setup/run instructions. Not yet done: RevenueCat subscriptions, store listing assets, privacy policy, actual App Store/Play Store submission — those need the user's Apple/Google developer accounts (flagged, not yet created as of 2026-07-26).

**Related:** [[watch-pricing-genius]], [[watch-pricing-knowledge]], [[comparable-research]]
