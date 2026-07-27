import { ensureSession, isSupabaseConfigured, supabase } from "./supabase";
import type { Comp, Confidence, LiquidityRating, CheckPriceInput, PriceEstimate } from "../types";

export class FreeTierLimitError extends Error {
  constructor(public lookupsThisPeriod: number) {
    super("free_tier_limit_reached");
  }
}

export async function checkPrice(
  input: CheckPriceInput,
): Promise<{ estimate: PriceEstimate; cached: boolean; mock: boolean }> {
  if (!isSupabaseConfigured) {
    // Small delay so the loading state is visible — feels like a real lookup.
    await new Promise((resolve) => setTimeout(resolve, 900));
    return { estimate: mockEstimate(input), cached: false, mock: true };
  }

  const session = await ensureSession();
  if (!session) throw new Error("Could not establish a session");

  const { data, error } = await supabase.functions.invoke("check-price", {
    body: input,
    headers: { Authorization: `Bearer ${session.access_token}` },
  });

  if (error) {
    // supabase-js surfaces non-2xx as a generic error; re-check the status
    // to distinguish the paywall case from a real failure.
    const context = (error as { context?: Response }).context;
    if (context?.status === 402) {
      const body = await context.json().catch(() => ({ lookupsThisPeriod: 0 }));
      throw new FreeTierLimitError(body.lookupsThisPeriod ?? 0);
    }
    throw error;
  }

  const result = data as { estimate: PriceEstimate; cached: boolean };
  return { ...result, mock: false };
}

// Backend isn't configured yet — this stands in so the app is clickable
// end to end during local UI development. Never used once
// EXPO_PUBLIC_SUPABASE_URL / ANON_KEY are set. Deterministic per input (a
// simple string hash seeds the numbers) so the same search always returns
// the same mock result, and different watches look different from each other.
function mockEstimate(input: CheckPriceInput): PriceEstimate {
  const seed = hashString(`${input.brand}-${input.model}-${input.reference}`);
  const rand = mulberry32(seed);

  const base = 2000 + Math.floor(rand() * 18000);
  const spread = 0.08 + rand() * 0.1;
  const priceLow = Math.round((base * (1 - spread)) / 10) * 10;
  const priceHigh = Math.round((base * (1 + spread)) / 10) * 10;

  const confidences: Confidence[] = ["medium", "medium-high", "high", "medium"];
  const liquidities: LiquidityRating[] = ["average", "liquid", "very liquid", "liquid"];
  const sources = ["eBay", "Chrono24", "Private auction", "Dealer network"];
  const conditions = ["Like-new", "Excellent", "Very Good", "Good"];

  // Spread comps across ~5-7 months with a mild price drift (up or down,
  // picked per-seed) so the time-range toggle and trend stat have something
  // real to show instead of flat noise.
  const compCount = 7 + Math.floor(rand() * 4);
  const spreadDays = 150 + Math.floor(rand() * 60);
  const trendDirection = rand() > 0.5 ? 1 : -1;
  const trendStrength = 0.04 + rand() * 0.08;

  const comps: Comp[] = Array.from({ length: compCount }, (_, i) => {
    const daysAgo = 2 + Math.floor((i / (compCount - 1)) * spreadDays) + Math.floor(rand() * 6);
    const date = new Date(Date.now() - daysAgo * 86_400_000).toISOString().slice(0, 10);
    const recency = 1 - daysAgo / spreadDays;
    const drifted = base * (1 + trendDirection * recency * trendStrength);
    const price = Math.round((drifted * (0.93 + rand() * 0.14)) / 10) * 10;
    return {
      date,
      source: `${sources[Math.floor(rand() * sources.length)]} (mock)`,
      // First two comps are always "sold" so the price-history line always
      // has at least two points to draw a trend from.
      status: (i < 2 || rand() > 0.25 ? "sold" : "active") as "sold" | "active",
      price,
      condition: conditions[Math.floor(rand() * conditions.length)],
      notes: "Placeholder comp for local UI testing.",
    };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));

  return {
    brand: input.brand,
    model: input.model,
    reference: input.reference,
    price_low: priceLow,
    price_high: priceHigh,
    confidence: confidences[Math.floor(rand() * confidences.length)],
    liquidity_rating: liquidities[Math.floor(rand() * liquidities.length)],
    comps,
    sources: ["Mock data — no backend configured. Set up Supabase + Anthropic to go live."],
    fetched_at: new Date().toISOString(),
  };
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

// Small deterministic PRNG so mock results are stable per search.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
