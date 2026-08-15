// GF Vault watch-pricing methodology — single source of truth, shared by
// check-price and analyze-watch. gf-vault/agents/watch-pricing-genius.md
// points here rather than duplicating this prose, so there is exactly one
// copy of the source-hierarchy/confidence-rubric/acquisition-tier rules in
// the repo. Deployed independently into each function's own bundle (Supabase
// resolves relative imports at deploy time) — no runtime coupling between
// check-price and analyze-watch from sharing this file.

export const SOURCE_HIERARCHY = `Data source hierarchy (highest weight first):
1. GF Vault's own accumulated baseline and transaction history for this exact reference, if provided below — this is real outcome data, weight it above fresh web search results when the two conflict.
2. Verified completed/sold listings with a visible price (eBay sold, Chrono24 sold, auction results)
3. Reputable auction house results
4. r/Watchexchange and similar community marketplaces (real peer-to-peer sales, but self-reported — weight below verified marketplace sold listings)
5. Watch market index/tracking services
6. Dealer asking prices
7. Active listings on Chrono24 or eBay, or general Reddit discussion of prices (lowest weight — asking prices or anecdotal, not confirmed sales)`;

export const CONFIDENCE_RUBRIC = `Confidence scoring:
- high (85-100%): 3+ recent exact-match sold comps, consistent pricing
- medium-high (70-84%): good but imperfect matches, mostly exact, recent enough
- medium (55-69%): adequate but mixed evidence, some variation matches
- low (<55%): sparse or conflicting evidence, uncertain identification
Never claim high confidence without the evidence to back it.`;

export const NO_FABRICATION_RULES = `Never fabricate a source, URL, price, or date. Never present an asking price as a sold price — label every comp's status as "sold" or "active" explicitly. If evidence is thin, say so and lower confidence rather than filling the gap.`;

export const ACQUISITION_TIERS = `Acquisition rating tiers:
| Rating | Criteria |
|--------|----------|
| Steal | Excellent downside protection, strong liquidity, unusually favorable profit, wide margin for error |
| Great Buy | Clearly exceeds profit target (~$500), acceptable risk, good liquidity |
| Good Buy | Meets minimum profit target (~$300), reasonable confidence |
| Borderline | Profit depends on optimistic scenarios, slow liquidity, higher risk |
| Pass | Insufficient profit, weak evidence, authenticity concerns, poor liquidity |
Protect capital first — recommend Pass if the evidence or profit case is unclear, even if the watch is desirable.`;

// Moved from check-price/index.ts unchanged, so existing price_estimates
// cache rows and new reference_baselines rows key identically.
export function normalizeReference(brand: string, model: string, reference: string): string {
  return `${brand}-${model}-${reference}`
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export interface ReferenceBaseline {
  normalized_reference: string;
  brand: string;
  model: string;
  reference: string;
  typical_ask_low: number | null;
  typical_ask_high: number | null;
  realistic_sold_low: number | null;
  realistic_sold_high: number | null;
  liquidity_rating: string | null;
  negotiation_notes: string | null;
  service_notes: string | null;
  recent_transactions: { date: string; type: "buy" | "sell"; price: number; notes: string }[];
  source: "manual" | "weekly_research";
  updated_at: string;
}

// Renders the baseline row (if any) as a plain-text block for the per-request
// user message — NOT the system prompt, since it's request-time data,
// matching how check-price already appends req.year/condition/notes.
// Returns "" when there's no baseline, so callers can .filter(Boolean).
export function formatBaselineContext(baseline: ReferenceBaseline | null): string {
  if (!baseline) return "";
  const lines = [
    `GF Vault internal baseline for this reference (updated ${baseline.updated_at}, source: ${baseline.source}):`,
    baseline.realistic_sold_low != null
      ? `- Realistic sold range: $${baseline.realistic_sold_low}-$${baseline.realistic_sold_high}`
      : null,
    baseline.typical_ask_low != null
      ? `- Typical asking range: $${baseline.typical_ask_low}-$${baseline.typical_ask_high}`
      : null,
    baseline.liquidity_rating ? `- Liquidity: ${baseline.liquidity_rating}` : null,
    baseline.negotiation_notes ? `- Negotiation notes: ${baseline.negotiation_notes}` : null,
    baseline.service_notes ? `- Service notes: ${baseline.service_notes}` : null,
    baseline.recent_transactions.length > 0
      ? `- GF Vault's own recent transactions: ${baseline.recent_transactions
          .map((t) => `${t.date} ${t.type} $${t.price} (${t.notes})`)
          .join("; ")}`
      : null,
    "Treat this as top-weight evidence per the source hierarchy; use live search to confirm/update it, not replace it wholesale.",
  ].filter((line): line is string => line !== null);
  return lines.join("\n");
}

// Single indexed lookup against reference_baselines. Fails open (returns
// null) on any error — including the table not existing yet — so both
// callers silently fall back to their pre-baseline behavior instead of
// breaking a live request.
export async function lookupBaseline(
  adminClient: { from: (table: string) => any },
  normalizedReference: string,
): Promise<ReferenceBaseline | null> {
  try {
    const { data, error } = await adminClient
      .from("reference_baselines")
      .select("*")
      .eq("normalized_reference", normalizedReference)
      .maybeSingle();
    if (error) {
      console.error("Baseline lookup failed:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Baseline lookup threw:", err);
    return null;
  }
}
