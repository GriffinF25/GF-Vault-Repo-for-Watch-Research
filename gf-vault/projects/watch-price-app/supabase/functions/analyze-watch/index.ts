// GF Vault Watch Analyzer — standalone tool, separate from the consumer
// price-checker. Serves its own page (GET) and runs the analysis (POST) from
// the same function, so the whole tool is one permanent Supabase URL with no
// separate frontend deploy and no auth friction (deployed --no-verify-jwt).
//
// This mirrors gf-vault/agents/watch-pricing-genius.md's methodology:
// identify from photos/description, research real market comps via live web
// search, and give Griffin a buy/pass-style recommendation — not a consumer
// price estimate. Uses Opus (not the cheaper Sonnet the consumer app uses)
// because this backs real purchase decisions and runs at much lower volume.

import Anthropic from "npm:@anthropic-ai/sdk@^0.71.0";

const MODEL = "claude-opus-4-8";
const MAX_OUTPUT_TOKENS = 4096;
const MAX_SEARCH_USES = 6;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are GF Vault's Watch Pricing & Research assistant, backing Griffin Fletcher's real acquisition decisions. Your only job is watch identification, market research, and price/deal analysis.

Griffin will send photos and/or a text description of a specific watch he's considering buying (condition, box/papers, asking price, seller notes). Give him back an identification, a real current market price estimate, and a clear recommendation.

Run a fresh live web search every time — never answer from memory or training data alone. State the date you searched so he knows how current this is.

Research hierarchy (highest trust first):
1. Verified completed/sold listings with a visible price (eBay sold, Chrono24 sold, auction results)
2. Reputable auction house results
3. r/Watchexchange and similar peer-to-peer marketplaces (real sales, self-reported)
4. Watch market index/tracking services (WatchCharts etc.)
5. Dealer asking prices
6. Active listings (Chrono24, eBay) or general Reddit/forum discussion — lowest trust, asking prices or anecdotes, not confirmed sales

Never present an asking price as a sold price — label every comp sold vs. active explicitly.

Your final message must be ONLY the report below — no "let me search for a few more comps" or "I have enough to analyze now" narration. Search first, then write the complete report in one final message starting with "## Identification".

Respond in this structure (markdown, skip sections that genuinely don't apply rather than padding them out):

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
One of: Steal / Great Buy / Good Buy / Borderline / Pass, with the reasoning. Protect capital first — recommend Pass if the evidence or profit case is unclear, even if the watch is desirable. Confidence score (high/medium-high/medium/low) tied to how much real comp evidence you actually found.

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

  return new Response(PAGE_HTML, {
    headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
  });
});

interface AnalyzeRequest {
  description: string;
  images: { media_type: string; data: string }[];
}

async function handleAnalyze(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as AnalyzeRequest;
    if (!body.description?.trim() && (!body.images || body.images.length === 0)) {
      return jsonResponse({ error: "Provide at least a description or a photo." }, 400);
    }

    const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

    const content: Anthropic.MessageParam["content"] = [];
    for (const img of body.images ?? []) {
      content.push({
        type: "image",
        source: { type: "base64", media_type: img.media_type as never, data: img.data },
      });
    }
    content.push({
      type: "text",
      text: body.description?.trim() || "No description provided — identify and analyze from the photos alone.",
    });

    let messages: Anthropic.MessageParam[] = [{ role: "user", content }];
    let response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      thinking: { type: "adaptive" },
      output_config: { effort: "high" },
      system: SYSTEM_PROMPT,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: MAX_SEARCH_USES }],
      messages,
    });

    while (response.stop_reason === "pause_turn") {
      messages = [...messages, { role: "assistant", content: response.content }];
      response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: MAX_OUTPUT_TOKENS,
        thinking: { type: "adaptive" },
        output_config: { effort: "high" },
        system: SYSTEM_PROMPT,
        tools: [{ type: "web_search_20260209", name: "web_search", max_uses: MAX_SEARCH_USES }],
        messages,
      });
    }

    // Text blocks between web searches are Claude narrating progress
    // ("let me check a few more comps...") — only the last text block is the
    // complete, self-contained report. Concatenating all of them (the old
    // behavior) leaked that narration into the top of the final report.
    const textBlocks = response.content.filter((b): b is Anthropic.TextBlock => b.type === "text");
    const text = textBlocks.length > 0 ? textBlocks[textBlocks.length - 1].text : "";

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

const PAGE_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>GF Vault — Watch Analyzer</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 0;
    background: #0a0e14; color: #f3f5f8;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  .wrap { max-width: 900px; margin: 0 auto; padding: 32px 20px 80px; }
  header { margin-bottom: 28px; }
  .badge {
    display: inline-block; background: #1a222e; border: 1px solid #2f3a4a;
    border-radius: 20px; padding: 5px 12px; font-size: 12px; font-weight: 800;
    letter-spacing: 1.5px; color: #3b82f6; margin-bottom: 14px;
  }
  h1 { font-size: 26px; font-weight: 800; margin: 0 0 6px; }
  .sub { color: #a9b3c1; font-size: 14px; line-height: 1.5; margin: 0; }
  .card {
    background: #131922; border: 1px solid #232c3a; border-radius: 16px;
    padding: 20px; margin-top: 22px;
  }
  label { display: block; font-size: 13px; font-weight: 600; color: #a9b3c1; margin-bottom: 6px; }
  textarea {
    width: 100%; min-height: 110px; background: #1a222e; color: #f3f5f8;
    border: 1px solid #232c3a; border-radius: 10px; padding: 12px 14px;
    font-size: 15px; font-family: inherit; resize: vertical;
  }
  textarea:focus, #dropzone:focus-within { outline: 2px solid #3b82f6; outline-offset: 1px; }
  #dropzone {
    margin-top: 18px; border: 1.5px dashed #2f3a4a; border-radius: 10px;
    padding: 22px; text-align: center; cursor: pointer; color: #6b7686; font-size: 13px;
  }
  #dropzone.drag { border-color: #3b82f6; color: #3b82f6; }
  #fileInput { display: none; }
  #thumbs { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
  .thumb { position: relative; width: 76px; height: 76px; border-radius: 8px; overflow: hidden; border: 1px solid #232c3a; }
  .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .thumb button {
    position: absolute; top: 2px; right: 2px; background: rgba(10,14,20,0.85);
    color: #f3f5f8; border: none; border-radius: 4px; width: 18px; height: 18px;
    font-size: 11px; cursor: pointer; line-height: 1;
  }
  button#analyzeBtn {
    margin-top: 20px; width: 100%; background: #3b82f6; color: #0a0e14;
    border: none; border-radius: 10px; padding: 15px; font-size: 16px; font-weight: 700;
    cursor: pointer;
  }
  button#analyzeBtn:disabled { opacity: 0.6; cursor: default; }
  #status { margin-top: 14px; font-size: 13px; color: #6b7686; text-align: center; min-height: 18px; }
  #result { margin-top: 22px; line-height: 1.6; font-size: 15px; }
  #result h2 { font-size: 17px; font-weight: 800; margin: 24px 0 8px; color: #f3f5f8; }
  #result h2:first-child { margin-top: 0; }
  #result table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
  #result th, #result td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #232c3a; }
  #result th { color: #a9b3c1; font-weight: 600; }
  #result strong { color: #f3f5f8; }
  #result ul { padding-left: 20px; }
  #result p { color: #d7dce3; margin: 8px 0; }
  #error { color: #f87171; margin-top: 14px; font-size: 14px; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div class="badge">GF VAULT</div>
    <h1>Watch Analyzer</h1>
    <p class="sub">Photos + description in, live market research and a buy/pass call out. Runs a fresh web search every time.</p>
  </header>

  <div class="card">
    <label for="description">Description</label>
    <textarea id="description" placeholder="Brand, model, reference if known, condition, box/papers, asking price, seller notes..."></textarea>

    <div id="dropzone" tabindex="0">Click or drag photos here (up to 6)</div>
    <input type="file" id="fileInput" accept="image/*" multiple />
    <div id="thumbs"></div>

    <button id="analyzeBtn">Analyze</button>
    <div id="status"></div>
    <div id="error"></div>
  </div>

  <div id="result"></div>
</div>

<script>
const MAX_IMAGES = 6;
const MAX_DIMENSION = 1280;
let images = []; // { media_type, data, previewUrl }

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const thumbs = document.getElementById('thumbs');
const statusEl = document.getElementById('status');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');
const analyzeBtn = document.getElementById('analyzeBtn');

dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('drag');
  handleFiles(e.dataTransfer.files);
});
fileInput.addEventListener('change', () => handleFiles(fileInput.files));

async function handleFiles(fileList) {
  for (const file of Array.from(fileList)) {
    if (images.length >= MAX_IMAGES) break;
    if (!file.type.startsWith('image/')) continue;
    const resized = await resizeImage(file);
    images.push(resized);
  }
  renderThumbs();
}

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const scale = MAX_DIMENSION / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve({ media_type: 'image/jpeg', data: dataUrl.split(',')[1], previewUrl: dataUrl });
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderThumbs() {
  thumbs.innerHTML = '';
  images.forEach((img, i) => {
    const div = document.createElement('div');
    div.className = 'thumb';
    div.innerHTML = '<img src="' + img.previewUrl + '" /><button type="button" aria-label="Remove">✕</button>';
    div.querySelector('button').addEventListener('click', () => {
      images.splice(i, 1);
      renderThumbs();
    });
    thumbs.appendChild(div);
  });
}

analyzeBtn.addEventListener('click', async () => {
  const description = document.getElementById('description').value;
  if (!description.trim() && images.length === 0) {
    errorEl.textContent = 'Add a description or at least one photo.';
    return;
  }
  errorEl.textContent = '';
  resultEl.innerHTML = '';
  analyzeBtn.disabled = true;
  const start = Date.now();
  const timer = setInterval(() => {
    statusEl.textContent = 'Researching live market data... (' + Math.round((Date.now() - start) / 1000) + 's)';
  }, 1000);
  statusEl.textContent = 'Researching live market data...';

  try {
    const resp = await fetch(window.location.href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, images: images.map(({ media_type, data }) => ({ media_type, data })) }),
    });
    const json = await resp.json();
    if (!resp.ok || json.error) throw new Error(json.error || 'Request failed');
    resultEl.innerHTML = renderMarkdown(json.markdown);
  } catch (err) {
    errorEl.textContent = 'Something went wrong: ' + err.message;
  } finally {
    clearInterval(timer);
    statusEl.textContent = '';
    analyzeBtn.disabled = false;
  }
});

// Minimal markdown renderer — headers, bold, tables, bullet lists, paragraphs.
function renderMarkdown(md) {
  const lines = md.split('\\n');
  let html = '';
  let inTable = false, tableRows = [];
  let inList = false;

  function flushTable() {
    if (!inTable) return;
    const [header, , ...rows] = tableRows;
    html += '<table><thead><tr>' + header.map(c => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>';
    for (const row of rows) html += '<tr>' + row.map(c => '<td>' + inline(c) + '</td>').join('') + '</tr>';
    html += '</tbody></table>';
    inTable = false; tableRows = [];
  }
  function flushList() { if (inList) { html += '</ul>'; inList = false; } }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function inline(s) {
    return esc(s).replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('|')) {
      flushList();
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (cells.every(c => /^-+$/.test(c))) continue;
      inTable = true;
      tableRows.push(cells);
      continue;
    }
    flushTable();
    if (line.startsWith('## ')) { flushList(); html += '<h2>' + inline(line.slice(3)) + '</h2>'; }
    else if (line.startsWith('# ')) { flushList(); html += '<h2>' + inline(line.slice(2)) + '</h2>'; }
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += '<li>' + inline(line.slice(2)) + '</li>';
    }
    else if (line === '') { flushList(); }
    else { flushList(); html += '<p>' + inline(line) + '</p>'; }
  }
  flushTable(); flushList();
  return html;
}
</script>
</body>
</html>`;
