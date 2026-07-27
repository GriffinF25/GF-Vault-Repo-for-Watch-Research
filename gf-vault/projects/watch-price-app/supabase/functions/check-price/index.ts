// GF Vault Watch Price Checker — check-price Edge Function
//
// Flow: normalize the query -> check usage limit -> check price_estimates
// cache (<24h) -> on miss, ask Claude (with web search) for a fresh estimate
// -> cache it -> return it to the app.

import Anthropic from "npm:@anthropic-ai/sdk@^0.71.0";
import { createClient } from "npm:@supabase/supabase-js@^2.45.0";

const CACHE_TTL_HOURS = 24;
const FREE_TIER_MONTHLY_LOOKUPS = 3;
// Sonnet 5 + low effort + a capped search budget instead of Opus + medium +
// 8 searches — search-result content is the dominant cost driver per pull,
// and the 24h cache (above) already absorbs repeat lookups.
const MODEL = "claude-sonnet-5";
const MAX_SEARCH_USES = 4;
const MAX_OUTPUT_TOKENS = 2048;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESULT_SCHEMA = {
  type: "object",
  properties: {
    brand: { type: "string" },
    model: { type: "string" },
    reference: { type: "string" },
    price_low: { type: "number" },
    price_high: { type: "number" },
    confidence: { type: "string", enum: ["low", "medium", "medium-high", "high"] },
    liquidity_rating: {
      type: "string",
      enum: ["very slow", "slow", "average", "liquid", "very liquid"],
    },
    comps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          date: { type: "string" },
          source: { type: "string" },
          status: { type: "string", enum: ["sold", "active"] },
          price: { type: "number" },
          condition: { type: "string" },
          notes: { type: "string" },
          listing_url: { type: "string", description: "URL of this specific listing/sale, or empty string if none" },
          image_url: { type: "string", description: "Direct image URL from this exact listing, or empty string if unknown" },
        },
        required: ["date", "source", "status", "price", "condition", "notes", "listing_url", "image_url"],
        additionalProperties: false,
      },
    },
    sources: { type: "array", items: { type: "string" } },
  },
  required: [
    "brand",
    "model",
    "reference",
    "price_low",
    "price_high",
    "confidence",
    "liquidity_rating",
    "comps",
    "sources",
  ],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `You are the pricing engine behind GF Vault's consumer watch price-check tool.
A user gives you a watch brand, model, and reference number, and optionally its production year,
condition, box/papers completeness, and free-text notes on other factors (service history,
aftermarket parts, discontinued dial variants, damage, etc). Search the web for real market data
and produce a structured price estimate.

When the user provides year, condition, set completeness, or notes, weigh them directly:
- Year matters most for discontinued/vintage references (production era, dial/bezel generation)
  and matters little for current-production references — use judgment.
- Full set (box & papers) typically commands a premium over watch-only; reflect this in the range.
- Explicit notes (aftermarket parts, damage, service due) should pull the estimate down and be
  called out in the notes of the closest matching comp or reflected in a wider/lower range.

Data source hierarchy (highest weight first):
1. Verified completed/sold listings with a visible price (eBay sold, Chrono24 sold, auction results)
2. Reputable auction house results
3. r/Watchexchange and similar community marketplaces (real peer-to-peer sales, but self-reported —
   weight below verified marketplace sold listings)
4. Watch market index/tracking services
5. Dealer asking prices
6. Active listings on Chrono24 or eBay, or general Reddit discussion of prices (lowest weight —
   asking prices or anecdotal, not confirmed sales)

Rules:
- Never present an asking price as a sold price. Label each comp's status as "sold" or "active".
- Prefer sales from the last 90 days; widen the window only for rare/slow-moving references and say so in a comp's notes.
- price_low and price_high should bracket the realistic resold value range for the given condition, not the optimistic retail asking price.
- confidence: "high" only with 3+ recent exact-match sold comps; "medium-high" with good but imperfect matches; "medium" with adequate but mixed evidence; "low" with sparse or conflicting evidence. Never claim high confidence without the evidence to back it.
- liquidity_rating reflects how quickly this reference typically sells based on what you find.
- Include 3-6 of the strongest comps, most recent first. Include real source names and dates — never fabricate a source, price, or date.
- Every comp needs listing_url and image_url keys. Set listing_url to the URL of that specific listing/post if you have one, else "". Set image_url to a direct image URL ONLY if you are confident it belongs to that exact listing (e.g. an eBay/Chrono24/Reddit-hosted photo you actually saw in search results) — never guess, construct, or repurpose an image from a different listing. Leave "" when unsure; a missing photo is fine, a wrong one is not.
- If you cannot find adequate data, still return your best estimate but set confidence to "low" and explain the gap in a comp's notes field.
- Be search-efficient: 2-4 well-targeted queries (exact reference number, then broaden only if needed) is usually enough. Don't keep searching once you have 3+ solid comps — stop and answer.`;

interface CheckPriceRequest {
  brand: string;
  model: string;
  reference: string;
  condition?: string;
  setCompleteness?: string;
  year?: string;
  notes?: string;
  forceRefresh?: boolean;
}

function normalizeReference(req: CheckPriceRequest): string {
  return `${req.brand}-${req.model}-${req.reference}`
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// Cache bucket now spans every factor that changes the answer — condition,
// set completeness, and year all shift realistic resale value, so a
// "full set 2019" lookup shouldn't share a cache row with "watch only 2005".
function conditionBucket(req: CheckPriceRequest): string {
  const parts = [req.condition, req.setCompleteness, req.year]
    .map((v) => (v ?? "").toLowerCase().trim())
    .filter(Boolean);
  return parts.length > 0 ? parts.join("|") : "any";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing Authorization header" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Scoped to the caller's JWT — respects RLS, used for usage tracking.
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    // Admin client — bypasses RLS, used only for the shared price cache.
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) {
      return jsonResponse({ error: "Invalid or expired session" }, 401);
    }
    const userId = userData.user.id;

    const body = (await req.json()) as CheckPriceRequest;
    if (!body.brand || !body.model || !body.reference) {
      return jsonResponse({ error: "brand, model, and reference are required" }, 400);
    }

    const usageCheck = await checkAndIncrementUsage(userClient, userId);
    if (!usageCheck.allowed) {
      return jsonResponse(
        { error: "free_tier_limit_reached", lookupsThisPeriod: usageCheck.lookupsThisPeriod },
        402,
      );
    }

    const normalizedReference = normalizeReference(body);
    const bucket = conditionBucket(body);

    if (!body.forceRefresh) {
      const { data: cached } = await adminClient
        .from("price_estimates")
        .select("*")
        .eq("normalized_reference", normalizedReference)
        .eq("condition_bucket", bucket)
        .maybeSingle();

      if (cached) {
        const ageHours = (Date.now() - new Date(cached.fetched_at).getTime()) / 3_600_000;
        if (ageHours < CACHE_TTL_HOURS) {
          return jsonResponse({ estimate: cached, cached: true });
        }
      }
    }

    const estimate = await fetchEstimateFromClaude(body);

    const { data: upserted, error: upsertError } = await adminClient
      .from("price_estimates")
      .upsert(
        {
          normalized_reference: normalizedReference,
          condition_bucket: bucket,
          brand: estimate.brand,
          model: estimate.model,
          reference: estimate.reference,
          price_low: estimate.price_low,
          price_high: estimate.price_high,
          confidence: estimate.confidence,
          liquidity_rating: estimate.liquidity_rating,
          comps: estimate.comps,
          sources: estimate.sources,
          fetched_at: new Date().toISOString(),
        },
        { onConflict: "normalized_reference,condition_bucket" },
      )
      .select()
      .single();

    if (upsertError) {
      console.error("Cache upsert failed:", upsertError);
      return jsonResponse({ estimate, cached: false });
    }

    return jsonResponse({ estimate: upserted, cached: false });
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "internal_error", message: String(err) }, 500);
  }
});

async function checkAndIncrementUsage(
  userClient: ReturnType<typeof createClient>,
  userId: string,
): Promise<{ allowed: boolean; lookupsThisPeriod: number }> {
  const { data: existing } = await userClient
    .from("usage")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const now = new Date();

  if (!existing) {
    await userClient.from("usage").insert({
      user_id: userId,
      lookups_this_period: 1,
      period_start: now.toISOString(),
      tier: "free",
    });
    return { allowed: true, lookupsThisPeriod: 1 };
  }

  if (existing.tier === "premium") {
    await userClient
      .from("usage")
      .update({ lookups_this_period: existing.lookups_this_period + 1 })
      .eq("user_id", userId);
    return { allowed: true, lookupsThisPeriod: existing.lookups_this_period + 1 };
  }

  const periodAgeDays = (now.getTime() - new Date(existing.period_start).getTime()) / 86_400_000;
  const lookupsThisPeriod = periodAgeDays > 30 ? 0 : existing.lookups_this_period;
  const periodStart = periodAgeDays > 30 ? now.toISOString() : existing.period_start;

  if (lookupsThisPeriod >= FREE_TIER_MONTHLY_LOOKUPS) {
    await userClient
      .from("usage")
      .update({ lookups_this_period: lookupsThisPeriod, period_start: periodStart })
      .eq("user_id", userId);
    return { allowed: false, lookupsThisPeriod };
  }

  await userClient
    .from("usage")
    .update({ lookups_this_period: lookupsThisPeriod + 1, period_start: periodStart })
    .eq("user_id", userId);
  return { allowed: true, lookupsThisPeriod: lookupsThisPeriod + 1 };
}

async function fetchEstimateFromClaude(req: CheckPriceRequest) {
  const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

  const userQuery = [
    `Brand: ${req.brand}`,
    `Model: ${req.model}`,
    `Reference: ${req.reference}`,
    req.year ? `Year: ${req.year}` : null,
    req.condition ? `Condition: ${req.condition}` : null,
    req.setCompleteness ? `Set completeness: ${req.setCompleteness}` : null,
    req.notes ? `Other factors noted by the user: ${req.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  let messages: Anthropic.MessageParam[] = [{ role: "user", content: userQuery }];
  let response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: MAX_OUTPUT_TOKENS,
    thinking: { type: "adaptive" },
    output_config: { effort: "low", format: { type: "json_schema", schema: RESULT_SCHEMA } },
    system: SYSTEM_PROMPT,
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: MAX_SEARCH_USES }],
    messages,
  });

  // Server-side web search runs its own internal loop; if it hits the
  // internal iteration cap we get pause_turn and must resend to continue.
  while (response.stop_reason === "pause_turn") {
    messages = [...messages, { role: "assistant", content: response.content }];
    response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      thinking: { type: "adaptive" },
      output_config: { effort: "low", format: { type: "json_schema", schema: RESULT_SCHEMA } },
      system: SYSTEM_PROMPT,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: MAX_SEARCH_USES }],
      messages,
    });
  }

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude returned no text content");
  }

  return JSON.parse(textBlock.text);
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
