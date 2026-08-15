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

**Chat redesign (2026-08-15):** Rebuilt from a single-shot form into a real chat thread, per Griffin's request ("more like a chatbot type deal and less of a field based thing") — he chose true multi-turn conversation over a chat-styled-but-still-single-shot option, so he can ask follow-ups ("what if it's missing papers", "fair counter offer") without resubmitting. The function is still stateless: the page keeps the full message history client-side and resends it every turn; the baseline lookup and optional brand/model/reference fields only apply to the opening message.

**Cost optimization (2026-08-15):** Hit an Anthropic "credit balance too low" error testing the chat redesign, prompting a cost pass across both this and [[watch-price-app]]'s backend. Model/effort/search-cap now tier by turn: only the opening message runs Opus at high effort with a 4-search budget (that's the one backing the real buy/pass call, worth the cost); follow-ups drop to Sonnet, medium effort, a 3-search cap, 1536-token ceiling — they're grounded in context already established, so a cheaper model is plenty. Also added ephemeral prompt caching to both functions' system prompts, and to the growing conversation prefix here specifically, since every follow-up was re-billing full price for all prior images/text on top of the new question before this.

**Why:** Multi-turn chat without caching means cost grows with every reply in a thread (each call resends the whole conversation). Tiering + caching keeps a long back-and-forth cheap while keeping the one call that matters most (initial identification) at full quality.

**Platform constraint — Supabase Edge Function 150s wall-clock kill (2026-08-15):** A long/detailed first message (lots of text, several photos) hit an opaque "Something went wrong: Request failed" in the UI with no useful detail. Root cause: Supabase Edge Functions on the free tier hard-kill an invocation at 150s wall-clock — when that happens mid-request, our own catch block never runs, so the client gets a bare platform response with no `error` key, and the frontend's fallback message was uselessly generic. Fixed two ways: (1) the function now self-imposes a 125s deadline and bails out of the `pause_turn` search loop with whatever partial answer it has (flagged as such) rather than risking the silent platform kill, and trimmed the first-turn search cap 6→4 to make hitting it less likely; (2) the frontend now surfaces the real HTTP status + response body on any failure instead of a hardcoded string, so a future variant of this is actually diagnosable from a screenshot.

**How to apply:** Any future timeout-prone Edge Function call on this project (free-tier Supabase) needs the same self-imposed-deadline pattern — don't rely on the platform's own timeout to fail cleanly.

**Live URL (page):** https://griffinf25.github.io/GF-Vault-Repo-for-Watch-Research/ — not rate-limited, don't share publicly.
**API URL (analysis only, POST):** https://ndjgvmvfgtiuchwlpqed.supabase.co/functions/v1/analyze-watch

**How to apply:** See `gf-vault/projects/watch-analyzer/README.md` for full details and deploy instructions. Editing the page only needs `docs/index.html` pushed (GitHub Pages auto-redeploys); editing the analysis logic needs `npx supabase functions deploy analyze-watch --no-verify-jwt`. Note the Supabase project (`ndjgvmvfgtiuchwlpqed`) is free-tier and auto-pauses after inactivity — if the API stops resolving, check `npx supabase projects list` for a `COMING_UP`/`RESTORING` status rather than assuming it's broken.

**Related:** [[watch-pricing-genius]], [[watch-price-app]]
