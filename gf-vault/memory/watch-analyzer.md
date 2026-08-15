---
name: watch-analyzer
description: Standalone personal tool (separate from the consumer app) — paste watch photos/description, get identification + live market research + buy/pass recommendation
metadata:
  type: project
---

**Decision (2026-08-15):** Built as a separate standalone tool from the consumer watch-price-app, not a page inside it — Griffin's own acquisition research (buy/pass calls) shouldn't be mixed into a consumer-facing pricing product.

**Why:** Griffin wanted "Claude but focused on watch pricing and research" accessible via an independent external link, always running fresh live searches ("up to the second," never answering from memory). A claude.ai Project was considered first but rejected in favor of a real standalone link.

**Architecture:** One Supabase Edge Function (`gf-vault/projects/watch-price-app/supabase/functions/analyze-watch/`) serves both the page (GET, inlined HTML/CSS/JS) and the analysis (POST) — no separate frontend deploy. Deployed with `--no-verify-jwt` for zero-friction access (no login). Uses `claude-opus-4-8` at high effort with web search, mirroring [[watch-pricing-genius]]'s methodology, unlike the consumer app which uses Sonnet at low effort for cost control at higher volume.

**Live URL:** https://ndjgvmvfgtiuchwlpqed.supabase.co/functions/v1/analyze-watch — not rate-limited, don't share publicly.

**How to apply:** See `gf-vault/projects/watch-analyzer/README.md` for full details and deploy instructions. Note the Supabase project (`ndjgvmvfgtiuchwlpqed`) is free-tier and auto-pauses after inactivity — if this link stops resolving, check `npx supabase projects list` for a `COMING_UP`/`RESTORING` status rather than assuming it's broken.

**Related:** [[watch-pricing-genius]], [[watch-price-app]]
