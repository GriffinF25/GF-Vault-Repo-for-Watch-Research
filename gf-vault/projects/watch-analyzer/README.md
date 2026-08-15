# GF Vault Watch Analyzer

A standalone tool for Griffin's own acquisition research — separate from the
consumer-facing [watch-price-app](../watch-price-app/). Paste watch photos
and/or a description of a listing you're considering buying; get back an
identification, live market research, and a buy/pass recommendation using the
same methodology as [`watch-pricing-genius`](../../agents/watch-pricing-genius.md).

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
- The page resizes photos client-side (max 1280px, JPEG ~0.82 quality) before
  base64-encoding them, then `POST`s `{ description, brand, model, reference, images }`
  to the Supabase function URL above (hardcoded in the page's `ANALYZE_URL`
  constant, since the page and API no longer share an origin).
- The function calls Claude (`claude-opus-4-8`, adaptive thinking, high
  effort, web search) with a system prompt mirroring the Watch Pricing Genius
  methodology, and returns the final report as markdown, which the page
  renders with a small inline markdown renderer.
- Runs a fresh live web search on every request — no caching, since this
  backs real-time purchase decisions where a stale answer is actively wrong,
  not just imprecise.

Expect **60–120 seconds** per analysis (Opus + high effort + up to 6 search
rounds) — the page shows an elapsed-time indicator while it works.

## Why Opus here but Sonnet in the consumer app

The consumer app runs Sonnet 5 at low effort with a search cap, because it's
free-tier, high-volume, and a rough price range is the whole product. This
tool runs at much lower volume and backs real purchase-or-pass calls where
being wrong costs real money — worth the extra cost and latency for better
reasoning.

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
