// GF Vault Watch Analyzer — standalone tool, separate from the consumer
// price-checker. This function is the analysis API only (POST) — the page
// itself is a static file at docs/index.html served via GitHub Pages, since
// Supabase Edge Functions on the free tier force any text/html response to
// text/plain (anti-abuse platform restriction, not fixable from code here).
// Deployed --no-verify-jwt for zero-friction access (no login).
//
// This mirrors gf-vault/agents/watch-pricing-genius.md's methodology:
// identify from photos/description, research real market comps via live web
// search, and give Griffin a buy/pass-style recommendation — not a consumer
// price estimate. The opening message of each conversation runs on Opus at
// high effort (this backs real purchase decisions, worth the cost); follow-up
// questions run cheaper on Sonnet since they're grounded in context that's
// already established. See FIRST_TURN_*/FOLLOWUP_* constants below.

import Anthropic from "npm:@anthropic-ai/sdk@^0.71.0";
import { createClient } from "npm:@supabase/supabase-js@^2.45.0";
import {
  SOURCE_HIERARCHY,
  NO_FABRICATION_RULES,
  ACQUISITION_TIERS,
  normalizeReference,
  lookupBaseline,
  formatBaselineContext,
} from "../_shared/pricing-methodology.ts";

// Only the opening message (full identification + report) needs Opus at high
// effort with a generous search budget — follow-ups are grounded in context
// that's already established, so they run cheaper: Sonnet, less thinking
// effort, a smaller search cap, and a shorter output ceiling.
const FIRST_TURN_MODEL = "claude-opus-4-8";
const FIRST_TURN_MAX_OUTPUT_TOKENS = 4096;
const FIRST_TURN_MAX_SEARCH_USES = 4;
const FOLLOWUP_MODEL = "claude-sonnet-5";
const FOLLOWUP_MAX_OUTPUT_TOKENS = 1536;
const FOLLOWUP_MAX_SEARCH_USES = 3;

// Supabase Edge Functions on the free tier hard-kill the invocation at 150s
// wall-clock with no chance for our own catch block to run — the caller just
// gets a bare platform error, not our JSON shape. A detailed first message
// (long description, several photos) can legitimately need more than one
// pause_turn round-trip, and those add up, so we self-impose a deadline well
// under the platform's and bail out with whatever we have rather than
// risking a silent kill.
const DEADLINE_MS = 125_000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are GF Vault's Watch Pricing & Research assistant, backing Griffin Fletcher's real acquisition decisions. Your only job is watch identification, market research, and price/deal analysis.

Griffin will send photos and/or a text description of a specific watch he's considering buying (condition, box/papers, asking price, seller notes). Give him back an identification, a real current market price estimate, and a clear recommendation.

Run a fresh live web search every time — never answer from memory or training data alone. State the date you searched so he knows how current this is.

${SOURCE_HIERARCHY}

${NO_FABRICATION_RULES}

Your final message must be ONLY the report below — no "let me search for a few more comps" or "I have enough to analyze now" narration. Search first, then write the complete report in one final message starting with "## Identification".

This is a running conversation — Griffin may ask follow-up questions after the first report ("what if it's missing papers", "what's a fair counter offer", "check if there's a cheaper one on Chrono24 right now"). For follow-ups, don't repeat the full structured report — answer conversationally, running a fresh live search only if the question needs new/current data, and stay grounded in the identification and comps already established earlier in the conversation unless Griffin gives you a different watch.

For the first message in a conversation, respond in this structure (markdown, skip sections that genuinely don't apply rather than padding them out):

## Identification
Exact reference, variation, size, movement, dial/bezel/bracelet, production era. Confidence in the ID and what supports it. Flag anything in the photos that looks off (mismatched parts, wrong engravings, suspicious finishing) — never confirm authenticity from photos alone, only flag red flags.

## Market snapshot
Current demand, liquidity rating (very liquid → very slow) with evidence, any recent price trend.

## Comparables
A table: date | source | sold/active | price | condition | notes. Most recent first. Real sources and dates only — never fabricate one.

## Valuation
Fast liquidation value, realistic private-party value, optimistic retail ask. Net proceeds by venue if relevant.

## Deal math (only if Griffin gave an asking price)
Opening offer, strong offer, absolute maximum. Expected net profit and ROI if he buys at each tier.

## Recommendation
${ACQUISITION_TIERS}
State which tier applies, with the reasoning, plus a confidence score (high/medium-high/medium/low) tied to how much real comp evidence you actually found.

## Key risks
Only material ones.

Rules: never fabricate a source, URL, price, or date — if evidence is thin, say so and lower confidence rather than filling the gap. Label every number verified vs. estimated.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method === "POST") {
    return handleAnalyze(req);
  }

  return jsonResponse({
    message: "This is the Watch Analyzer API. Use the page at https://griffinf25.github.io/GF-Vault-Repo-for-Watch-Research/",
  });
});

interface ChatImage {
  media_type: string;
  data: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  images?: ChatImage[];
}

interface AnalyzeRequest {
  messages: ChatMessage[];
  brand?: string;
  model?: string;
  reference?: string;
}

async function handleAnalyze(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as AnalyzeRequest;
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return jsonResponse({ error: "Provide at least one message." }, 400);
    }
    const lastMessage = body.messages[body.messages.length - 1];
    if (lastMessage.role !== "user") {
      return jsonResponse({ error: "The last message must be from the user." }, 400);
    }
    if (!lastMessage.text?.trim() && (!lastMessage.images || lastMessage.images.length === 0)) {
      return jsonResponse({ error: "Provide at least a description or a photo." }, 400);
    }

    const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

    // Optional — Griffin doesn't always know brand/model/reference up front
    // (e.g. photos-only submissions). Only relevant to the opening message of
    // a conversation, so this is a single conditional lookup on the first
    // turn, not a repeated round-trip on every follow-up.
    let baselineContext = "";
    const isFirstTurn = body.messages.length === 1;
    if (isFirstTurn && body.brand && body.model && body.reference) {
      const adminClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      const normalizedReference = normalizeReference(body.brand, body.model, body.reference);
      const baseline = await lookupBaseline(adminClient, normalizedReference);
      baselineContext = formatBaselineContext(baseline);
    }

    let messages: Anthropic.MessageParam[] = body.messages.map((m, i) => {
      if (m.role === "assistant") {
        return { role: "assistant", content: [{ type: "text", text: m.text }] };
      }
      const content: Anthropic.MessageParam["content"] = [];
      for (const img of m.images ?? []) {
        content.push({
          type: "image",
          source: { type: "base64", media_type: img.media_type as never, data: img.data },
        });
      }
      if (i === body.messages.length - 1 && baselineContext) {
        content.push({ type: "text", text: baselineContext });
      }
      content.push({
        type: "text",
        text: m.text?.trim() || "No description provided — identify and analyze from the photos alone.",
      });
      return { role: "user", content };
    });

    // Cache everything through the end of the prior turn. Each new message
    // resends the whole conversation (this function is stateless), so
    // without this every follow-up would re-bill the full image + prior-turn
    // token cost at full price on top of the new question.
    if (messages.length > 1) {
      const priorTurn = messages[messages.length - 2];
      const blocks = priorTurn.content as Anthropic.ContentBlockParam[];
      if (blocks.length > 0) {
        blocks[blocks.length - 1] = { ...blocks[blocks.length - 1], cache_control: { type: "ephemeral" } };
      }
    }

    const model = isFirstTurn ? FIRST_TURN_MODEL : FOLLOWUP_MODEL;
    const effort: "high" | "medium" = isFirstTurn ? "high" : "medium";
    const maxTokens = isFirstTurn ? FIRST_TURN_MAX_OUTPUT_TOKENS : FOLLOWUP_MAX_OUTPUT_TOKENS;
    const maxSearchUses = isFirstTurn ? FIRST_TURN_MAX_SEARCH_USES : FOLLOWUP_MAX_SEARCH_USES;
    const system: Anthropic.MessageCreateParams["system"] = [
      { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
    ];

    const startedAt = Date.now();
    let response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      thinking: { type: "adaptive" },
      output_config: { effort },
      system,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: maxSearchUses }],
      messages,
    });

    let hitDeadline = false;
    while (response.stop_reason === "pause_turn") {
      if (Date.now() - startedAt > DEADLINE_MS) {
        hitDeadline = true;
        break;
      }
      messages = [...messages, { role: "assistant", content: response.content }];
      response = await anthropic.messages.create({
        model,
        max_tokens: maxTokens,
        thinking: { type: "adaptive" },
        output_config: { effort },
        system,
        tools: [{ type: "web_search_20260209", name: "web_search", max_uses: maxSearchUses }],
        messages,
      });
    }

    // Text blocks between web searches are Claude narrating progress
    // ("let me check a few more comps...") — only the last text block is the
    // complete, self-contained report. Concatenating all of them (the old
    // behavior) leaked that narration into the top of the final report.
    const textBlocks = response.content.filter((b): b is Anthropic.TextBlock => b.type === "text");
    let text = textBlocks.length > 0 ? textBlocks[textBlocks.length - 1].text : "";

    if (hitDeadline) {
      text +=
        "\n\n---\n_Hit the time budget with research still in progress — the above may be incomplete. Ask a follow-up to fill in a specific gap, or resend with fewer photos/a shorter description for a faster first pass._";
    }

    return jsonResponse({ markdown: text });
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: String(err) }, 500);
  }
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
