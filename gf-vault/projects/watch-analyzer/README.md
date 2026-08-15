# GF Vault Watch Analyzer

A standalone tool for Griffin's own acquisition research — separate from the
consumer-facing [watch-price-app](../watch-price-app/). Paste watch photos
and/or a description of a listing you're considering buying; get back an
identification, live market research, and a buy/pass recommendation using the
same methodology as [`watch-pricing-genius`](../../agents/watch-pricing-genius.md).

**Live URL:** https://ndjgvmvfgtiuchwlpqed.supabase.co/functions/v1/analyze-watch

No login, no account — the page and the analysis are served from a single
Supabase Edge Function deployed with `--no-verify-jwt`, so the link works for
anyone who has it with zero setup. That also means don't share this link
publicly — it has no rate limiting or usage cap (unlike the consumer app),
and every request costs real Anthropic API spend.

## How it works

- The function's `GET` response is the page itself (HTML/CSS/JS inlined in
  `supabase/functions/analyze-watch/index.ts` — no separate frontend build or
  deploy).
- The page resizes photos client-side (max 1280px, JPEG ~0.82 quality) before
  base64-encoding them, then `POST`s `{ description, images }` back to the
  same URL.
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
