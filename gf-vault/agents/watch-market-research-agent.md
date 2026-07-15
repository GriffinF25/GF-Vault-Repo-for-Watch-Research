---
name: watch-market-research-agent
description: Weekly scheduled research agent tracking wholesale/below-market watch opportunities
metadata:
  type: reference
  agent_type: scheduled
  schedule: Weekly (Monday 14:00 UTC / 9am CT)
  created: 2026-07-13
---

# Watch Market Research Agent

**Purpose:** Weekly market scan for wholesale/below-market watch opportunities, liquidity shifts, and deal windows across target models.

**Schedule:** Cloud routine "GF Vault Weekly Watch Market Research" — every Monday 14:00 UTC (9am CT). Runs against the GitHub repo (`GriffinF25/GF-Vault-Repo-for-Watch-Research`), commits the report, and emails a summary to griff.fletcher@gmail.com via Gmail. Manage at https://claude.ai/code/routines  
**Output:** Markdown report saved to `/gf-vault/reports/weekly-market-research-[YYYY-MM-DD].md`  
**Status:** Active

---

## Coverage & Search Strategy

### Rolex (Popular, below $20k)
- **Submariner 116610** (ceramic, most liquid)
- **Submariner 114060** (no-date)
- **GMT-Master II 116710** (current, steel)
- **Datejust 41mm (current steel)** 
- **Explorer 124270**
- **Air-King 126900**
- **Any other steel sports models actively trading below $20k**

### Tudor (All models)
- Black Bay 79230B, 79250B (all variants)
- Black Bay Chrono 79360N (Reverse Panda)
- Black Bay '54 79000B (new)
- Pelagos 25610TNL
- Submariner 79090
- Prince (if available on secondary)
- Day-Date (if available)

### Omega (Below $15k)
- Seamaster Diver 300M (all current variants)
- Seamaster PloProf 
- Speedmaster Professional
- De Ville (if below threshold)
- Constellation (if below threshold)
- Aqua Terra (if below threshold)

### Heavy Hitters (All Popular Brands)
- **Breitling:** Navitimer, Chronomat, Superocean (all variants)
- **TAG Heuer:** Carrera, Aquaracer, Monaco
- **Cartier:** Santos, Tank, Ballon Bleu
- **Panerai:** Luminor, Radiomir, Submersible
- **Grand Seiko:** Sport models, Heritage, Professional

---

## Research Process

### For Each Reference:

1. **Recent Completed Sales** (last 7-14 days)
   - eBay: Sort by "sold" listings
   - Chrono24: Verify actual sale prices (not asking)
   - Auction results: Major auction houses
   - Private sales: Reddit r/Watchexchange, WatchUSeek sales section
   - Document: Date, platform, condition, price, notes

2. **Below-Market Opportunities** (flagged for Griffin)
   - Compare realized price vs. knowledge base baseline
   - Identify any deals >5-10% below expected
   - Note urgency (if watch is still active listing)
   - Add context: Why was it cheap? (Condition? Urgency? Platform variance?)

3. **Liquidity Snapshot**
   - Count active listings per reference (spot check)
   - Estimate days on market (if data visible)
   - Note any seasonal/marketplace patterns
   - Flag if liquidity shifted vs. last week

4. **Market Shifts**
   - Price direction (up/stable/down)
   - Demand signals (sell-through rate)
   - New production vs. used pricing spread
   - Marketplace performance variance (eBay vs. Chrono24 gap)

### Valid Sources Only
- eBay completed listings (with verified prices)
- Chrono24 confirmed sold prices
- Major auction results (Christie's, Sotheby's, Bonhams)
- Reddit r/Watchexchange (verified sales only)
- WatchUSeek Forum Sales section (established members)
- Official brand announcements (new models, discontinued)
- **Exclude:** Guesses, asking-price-as-sold, unverified forum posts, speculation

---

## Output Format

### Weekly Report Structure

```
# Weekly Watch Market Research — [Date Range]

## Executive Summary
- Key deals found (top 3 below-market opportunities)
- Market conditions (trending up/down/stable)
- Liquidity snapshot (any changes)
- Action items for Griffin

## Deals Found This Week

### [Brand Model Reference] — Wholesale Opportunity
**Asking/Sold:** $X,XXX | **Baseline:** $Y,YYY | **Gap:** -Z%
**Condition:** [Excellent/Very Good/etc]
**Set:** [Box/Papers/etc]
**Source:** [Platform + link if applicable]
**Why it's cheap:** [Analysis]
**Action:** [Negotiate? Immediate purchase? Pass?]

## Market Snapshots by Brand

### Rolex Submariner 116610
- Baseline: $9,000–$9,500
- This week sold: $8,800–$9,400 (N sales)
- Trend: Stable
- Time on market: 1–3 weeks
- Platform gap: eBay averages -$400 vs. Chrono24

### [Brand Model...]
- [Same structure]

## Liquidity & Trends
- **Increasing demand:** [Models seeing faster sales]
- **Softening:** [Models moving slower]
- **Seasonal shifts:** [Any patterns emerging]
- **Marketplace variance:** [Platform performance differences]

## New Production / Discontinued
- [Brand Announcements]
- Impact on secondary market pricing

## Data Notes
- Sources: eBay, Chrono24, [Auction House], [Reddit/Forum]
- Date range: [Monday–Sunday]
- Sample size: [N] completed sales across all references
- Confidence: [High/Medium/Low based on data freshness]

## For Next Week
- [Follow-ups, emerging patterns to watch]
```

---

## Agent Behavior & Standards

**Capital Protection First**
- Flag deals < $500 profit potential as "educational only"
- Only highlight true wholesale opportunities (>=15% below baseline or price + significant upside)

**Source Validation**
- Never cite prices without verifiable source
- Distinguish "sold price" from "asking price"
- Include dates (prices age quickly in this market)
- Link directly to listings when possible

**Deal Quality**
- Focus on items still actively available (actionable)
- Include "shelf life" (if this is a quick window)
- Estimate time to negotiate + close
- Identify any red flags (condition, authenticity concerns, etc.)

**Market Intelligence**
- Track emerging references (new production demand shifts)
- Note platform performance (does Chrono24 beat eBay for this reference?)
- Identify seasonal patterns (Q4 strength, summer softness)
- Highlight any unusual market moves

**Efficiency**
- Reuse prior week's baseline prices from [[watch-pricing-knowledge]]
- Stop researching once decision threshold is clear
- Prioritize recent sales over speculation
- Focus on actionable opportunities (not "watch this reference" unless shift is significant)

---

## Integration with Memory

**Update These Files:**
- `watch-pricing-knowledge.md` — New baseline prices, liquidity ratings, seasonal patterns
- `comparable-research.md` — Recent completed sales, sources, pricing evidence
- `pricing-transactions.md` — If any deals from the report are actioned

**Link in Report:** 
- Reference relevant [[watch-pricing-knowledge]] entries
- Cross-link to [[comparable-research]] source documentation

---

## How to Use This Report

**For Griffin:**
1. Check "Deals Found This Week" first — actionable opportunities
2. Review "Market Snapshots" for pricing/liquidity context
3. Use "Data Notes" to assess confidence
4. Update [[pricing-transactions]] if any deals are pursued

**For Watch Pricing Genius:**
- Reference this report's comparables during pricing analysis
- Use updated baselines from snapshots
- Note marketplace variance insights for venue-specific valuations

---

## Scheduled Execution

- **Trigger:** Every Monday 14:00 UTC (9am CT) via cloud routine
- **Output:** `/gf-vault/reports/weekly-market-research-[date].md` committed to the repo + email summary to Griffin
- **Failure handling:** If a run fails, trigger manually from https://claude.ai/code/routines or run the research locally from this spec

**Agent Instructions:**
Perform this research systematically, one brand at a time. Prioritize completed sales over speculation. Focus on identifying deals that are 15%+ below baseline or showing strong margin potential. Fill the weekly report template above, save the report, commit and push, then email the summary.

---

**Last Updated:** 2026-07-14 | **Status:** Scheduled & active
