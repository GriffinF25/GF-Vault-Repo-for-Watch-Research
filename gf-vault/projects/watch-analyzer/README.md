# GF Vault Watch Analyzer

A standalone tool for Griffin's own acquisition research — separate from the
consumer-facing [watch-price-app](../watch-price-app/). A chat interface:
send watch photos and/or a description of a listing you're considering
buying, get back an identification, live market research, and a buy/pass
recommendation using the same methodology as
[`watch-pricing-genius`](../../agents/watch-pricing-genius.md) — then keep
asking follow-ups ("what if it's missing papers", "fair counter offer") in
the same thread.

**Live URL (page):** https://griffinf25.github.io/GF-Vault-Repo-for-Watch-Research/
**API (analysis only):** https://ndjgvmvfgtiuchwlpqed.supabase.co/functions/v1/analyze-watch

No login, no account — the page is a static file served free via GitHub
Pages, and it calls the Supabase Edge Function (deployed with
`--no-verify-jwt`) for the analysis. Split across two hosts because Supabase
Edge Functions on the free tier force any `text/html` response down to
`text/plain` (an anti-abuse platform restriction — not fixable from function
code, confirmed with a throwaway Storage bucket test). That also means don't
share the link publicly — it has no rate limiting or usage cap (unlike the
consumer app), and every request costs real Anthropic API spend.

## How it works

- The page lives at `docs/index.html` in this repo, served by GitHub Pages
  (repo Settings → Pages → Deploy from branch → `main` / `/docs`).
- The page keeps the whole conversation client-side (`history`, an array of
  `{ role, text, images? }`) and resends the full thread on every message —
  the function itself is stateless, no conversation table. Photos are resized
  client-side (max 1280px, JPEG ~0.82 quality) and base64-encoded before
  attaching to whichever message they were dropped on.
- The optional brand/model/reference fields only apply to the opening
  message — they hide from the composer after the first send, and the
  function only runs the baseline lookup (`reference_baselines`, shared with
  `check-price`, see
  `../watch-price-app/supabase/functions/_shared/pricing-methodology.ts`)
  when the incoming history has exactly one message.
- The function calls Claude with a system prompt mirroring the Watch Pricing
  Genius methodology for the opening report, then switches to a shorter
  conversational instruction for follow-up turns — same live-search
  grounding, no repeated structured report. Each reply is rendered
  client-side as a chat bubble with a small inline markdown renderer.
- Model/effort/search budget are tiered by turn (see `FIRST_TURN_*` /
  `FOLLOWUP_*` constants in `index.ts`): the opening message runs
  `claude-opus-4-8` at high effort with up to 6 searches, since that's the
  one backing the real buy/pass call. Follow-ups drop to `claude-sonnet-5`,
  medium effort, a 3-search cap, and a smaller output ceiling — they're
  grounded in context the opening turn already established, so the cheaper
  model is plenty.
- Every fresh live search still runs on every message — no *answer* caching,
  since this backs real-time purchase decisions where a stale answer is
  actively wrong, not just imprecise. What's cached (via Anthropic's
  ephemeral `cache_control`) is the static system prompt and the growing
  conversation prefix — otherwise every follow-up would re-bill full price
  for all prior images and text on top of the new question, since the
  function is stateless and resends the whole thread each time.

Expect **30–120 seconds** for the opening message, faster for follow-ups —
the composer shows a typing indicator with elapsed time while it works.

## Deploying changes

Same linked Supabase project as watch-price-app (`ndjgvmvfgtiuchwlpqed`):

```bash
cd gf-vault/projects/watch-price-app/supabase
npx supabase functions deploy analyze-watch --no-verify-jwt
```

The `--no-verify-jwt` flag matters — without it, requests need a valid
Supabase auth token and the zero-friction "just open the link" property goes
away.

Changes to the page itself just need `docs/index.html` edited and pushed —
GitHub Pages redeploys automatically, no CLI step.
