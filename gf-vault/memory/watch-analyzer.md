---
name: watch-analyzer
description: Standalone personal tool (separate from the consumer app) — paste watch photos/description, get identification + live market research + buy/pass recommendation
metadata:
  type: project
---

**Decision (2026-08-15):** Built as a separate standalone tool from the consumer watch-price-app, not a page inside it — Griffin's own acquisition research (buy/pass calls) shouldn't be mixed into a consumer-facing pricing product.

**Why:** Griffin wanted "Claude but focused on watch pricing and research" accessible via an independent external link, always running fresh live searches ("up to the second," never answering from memory). A claude.ai Project was considered first but rejected in favor of a real standalone link.

**Architecture:** Split across two hosts as of 2026-08-15. The page is a static file (`docs/index.html` at repo root) served free via GitHub Pages. The analysis runs on a Supabase Edge Function (`gf-vault/projects/watch-price-app/supabase/functions/analyze-watch/`, POST-only now, deployed `--no-verify-jwt`) that the page calls directly. Uses `claude-opus-4-8` at high effort with web search, mirroring [[watch-pricing-genius]]'s methodology, unlike the consumer app which uses Sonnet at low effort for cost control at higher volume.

**Why split:** Originally one Edge Function served both the page (GET) and analysis (POST). Discovered Supabase Edge Functions (and Storage) force any `text/html` response to `text/plain` on the free tier — a hard anti-abuse platform restriction, confirmed via WebSearch and an independent throwaway-bucket test, not fixable from function code. Chose GitHub Pages (free) over Supabase Pro ($25/mo) to fix it.

**Live URL (page):** https://griffinf25.github.io/GF-Vault-Repo-for-Watch-Research/ — not rate-limited, don't share publicly.
**API URL (analysis only, POST):** https://ndjgvmvfgtiuchwlpqed.supabase.co/functions/v1/analyze-watch

**How to apply:** See `gf-vault/projects/watch-analyzer/README.md` for full details and deploy instructions. Editing the page only needs `docs/index.html` pushed (GitHub Pages auto-redeploys); editing the analysis logic needs `npx supabase functions deploy analyze-watch --no-verify-jwt`. Note the Supabase project (`ndjgvmvfgtiuchwlpqed`) is free-tier and auto-pauses after inactivity — if the API stops resolving, check `npx supabase projects list` for a `COMING_UP`/`RESTORING` status rather than assuming it's broken.

**Related:** [[watch-pricing-genius]], [[watch-price-app]]
