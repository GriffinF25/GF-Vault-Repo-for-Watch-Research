# GF Vault Watch Price Checker

Consumer mobile app (iOS + Android via Expo): enter a watch reference, get an AI-researched
live price estimate, with a "Sell to us" lead-gen CTA feeding GF Vault's sourcing pipeline.

See [gf-vault/memory/watch-price-app.md](../memory/watch-price-app.md) for the architecture
decisions behind this build, and `.claude/plans/typed-yawning-pinwheel.md` (in the workspace
root's Claude config) for the original approved plan.

## What's here

```
watch-price-app/
├── app/            Expo (React Native + TypeScript) mobile app
└── supabase/       Database migrations + the check-price Edge Function
```

**Not yet done:** store listing assets, privacy policy, RevenueCat/IAP wiring (Paywall screen
is a stub), and actual App Store / Play Store submission. Those come after this runs locally
and you've set up the accounts below.

## One-time setup

### 1. Accounts you'll need

| Account | Cost | Needed for |
|---|---|---|
| [Supabase](https://supabase.com) | Free tier is enough to start | Database, auth, Edge Functions |
| [Anthropic Console](https://console.anthropic.com) | Pay-as-you-go API billing | The AI price-search backend |
| Apple Developer Program | $99/yr | iOS App Store submission (later phase) |
| Google Play Developer | $25 one-time | Play Store submission (later phase) |

### 2. Create and link the Supabase project

```bash
cd gf-vault/projects/watch-price-app/supabase
npx supabase login
npx supabase link --project-ref <your-project-ref>   # find this in your Supabase dashboard URL
npx supabase db push                                   # applies migrations/0001_init.sql
```

In the Supabase dashboard, enable **Authentication → Providers → Anonymous Sign-Ins** — the
app signs users in anonymously so free-tier usage and leads can be tracked without a signup
wall.

### 3. Set the Edge Function's secrets

The Anthropic API key must never ship in the app bundle — it lives only here, server-side:

```bash
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically
into Edge Functions by Supabase — no need to set those yourself.

### 4. Deploy the Edge Function

```bash
npx supabase functions deploy check-price
```

### 5. Configure the app

```bash
cd ../app
cp .env.example .env
# edit .env with your Supabase project URL + anon key (Project Settings > API)
npm install
```

## Running it

```bash
cd app
npx expo start
```

Scan the QR code with Expo Go (iOS/Android), or press `i` / `a` for a simulator if you have
Xcode / Android Studio installed.

## Verifying it works end to end

1. Launch the app — it should sign in anonymously without error (check `supabase.auth.getSession()`
   in the dashboard's Auth panel if you want to confirm a user was created).
2. Enter a real watch — e.g. brand "Rolex", model "Submariner", reference "116610" — and tap
   **Check Price**. The first lookup calls Claude live (web search + synthesis), which takes
   several seconds; you should get back a price range, confidence badge, liquidity rating, and
   sourced comps, not mock data.
3. Run the same lookup again — it should return instantly from the `price_estimates` cache
   (`cached: true`).
4. From a result, tap **Sell this watch to us**, fill the form, attach a photo, submit — check
   the `leads` table in the Supabase dashboard for the new row and the `lead-photos` storage
   bucket for the uploaded photo.
5. Submit 4 lookups in a row (free tier is 3/month) — the 4th should route to the Paywall stub
   screen instead of erroring.

## Cost note

This defaults to `claude-sonnet-5` for the price-search calls (see
`supabase/functions/check-price/index.ts`). If maximum research quality matters more than
per-lookup API cost for your margins, `claude-opus-4-8` is a swap-in with deeper research —
same web search and structured-output support, higher per-token price.

## Architecture recap

- **App → Edge Function → Claude (web search) → cache → App.** See
  `supabase/functions/check-price/index.ts` for the full flow, including the free-tier usage
  gate and the 24-hour cache TTL.
- **Auth:** Supabase anonymous auth — no signup wall for the free tier, but every user still has
  a stable `user_id` for usage limits and lead attribution.
- **Sell-to-us leads:** written directly from the app to the `leads` table under RLS (insert +
  read own rows only); no separate backend function needed for that path.
