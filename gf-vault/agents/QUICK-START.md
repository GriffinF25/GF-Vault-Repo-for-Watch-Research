# Watch Pricing Genius — Quick Start Guide

**Agent Location:** `watch-pricing-genius.md`  
**Memory:** `memory/watch-pricing-knowledge.md`, `memory/pricing-transactions.md`, `memory/comparable-research.md`  
**Reference:** `docs/marketplace-fees.md`

---

## What This Agent Does

The Watch Pricing Genius analyzes watch acquisitions to help you:
- Evaluate if a watch is a good deal **for profit**, not just for price
- Calculate realistic net proceeds after all marketplace fees
- Identify the best purchase price and walk-away price
- Develop negotiation strategy
- Track completed transactions for future reference

---

## How to Use It

### Step 1: Gather Watch Information

Have this ready before asking for pricing analysis:

```
- **Reference & Model:** Exact model number and name
- **Size:** Case diameter (e.g., 40mm)
- **Dial & Bezel:** Color, material, variations
- **Bracelet/Strap:** What's included
- **Condition:** Description (see: Excellent/Very Good/Good/Fair)
- **Set Status:** Box? Papers? Warranty card? Links?
- **Service History:** When was it serviced?
- **Seller's Asking Price:** What are they asking?
- **Images/Description Link:** Photos or detailed listing
- **Any Known Issues:** Scratches, polishing, defects?
```

### Step 2: Ask for Pricing Analysis

**Simple request:**
```
"Analyze this watch for me:
Reference: Rolex Submariner 116610
Size: 40mm
Condition: Very Good (light polishing)
Set: Full (box, papers, warranty 2023)
Asking price: $9,200
Any issues: Glidelock bracelet, normal wear"
```

**With photos:**
```
"I found this watch. Here are the photos [attach/describe].
The seller is asking $[price].
Can you evaluate if this is a good buy?"
```

### Step 3: Receive Analysis

You'll get:
- **Watch Identification** — Confirms exact model and spot any issues
- **Market Snapshot** — Why this reference matters, demand factors
- **Best Comparables** — Recent sold prices (with sources and dates)
- **Realistic Resale Values** — What you can expect on eBay, Chrono24, private sale
- **Purchase Tiers** — Price recommendations:
  - Steal (if asking is well below market)
  - Great Buy (strong profit expected)
  - Good Buy (meets minimum profit target)
  - Borderline (risky, slow liquidity)
  - Pass (insufficient profit)
- **Deal Math** — Exact numbers: profit, ROI, break-even price
- **Recommendation** — Buy or Pass? At what price?
- **Confidence Score** — How certain is this analysis (85% = high confidence)

---

## Example Request & Response

### Your Request:
```
"I'm looking at a Tudor Black Bay 79230B for $4,100 asking price. 
It's steel, 41mm, black dial, on the bracelet with box and papers. 
Condition looks very good—light polishing on the case.
Is this a good deal?"
```

### Agent's Response (example format):

**Watch Identification**
- Tudor Black Bay 79230B | 41mm steel | Black dial | Bracelet
- Set: Full (box, papers, complete links)
- Condition: Very Good
- Confidence: 95% (High)

**Market Snapshot**
- Strong current demand; consistent liquidity across platforms
- Key drivers: Current production model with retail availability; strong collector interest; strap/bracelet configuration matters

**Best Comparables**
| Date | Source | Status | Price | Condition | Notes |
|------|--------|--------|-------|-----------|-------|
| 2026-06-28 | eBay | Sold | $4,350 | Excellent | Bracelet, papers |
| 2026-06-15 | Chrono24 | Sold | $4,100 | Very Good | Bracelet, full set |
| 2026-06-05 | eBay | Sold | $3,950 | Good | Polished, strap |

**Realistic Resale Values**
- Chrono24 gross (likely): $4,400–$4,700
- Chrono24 net proceeds (8% fees + 1.5% payment): $4,180–$4,500
- eBay gross (likely): $4,200–$4,500
- eBay net proceeds (16% total fees): $3,600–$3,780
- Private sale (likely): $4,000–$4,300

**Purchase Tiers**
- **Steal:** Below $3,600
- **Great Buy:** $3,600–$3,900
- **Good Buy:** $3,900–$4,200
- **Borderline:** $4,200–$4,400
- **Pass:** Above $4,400

**Deal Math at $4,100 Asking**
- Total invested (including inbound shipping ~$50): $4,150
- Expected Chrono24 net: $4,350 (mid-range)
- Expected net profit: $200
- ROI: 4.8%
- Liquidity: Liquid (2–4 weeks typical)
- Break-even sale price: $4,160

**Recommendation**
- **Suggested opening offer:** $3,600–$3,700 (12–10% discount)
- **Strong purchase price:** $3,850–$3,950
- **Absolute maximum:** $4,150 (barely profitable)
- **Verdict:** **Borderline Buy** — Meets minimum profit at asking price but leaves little margin for error
- **Liquidity:** Liquid
- **Confidence:** High (95%)

**Key Risks**
- Small margin for error ($200 profit)
- Polishing history affects future value; not a major concern for this reference but note it
- Market timing: Not the best entry point; might see better opportunities

**Negotiation Message**
"Hi, I'm interested in your Black Bay. I'd like to get a sense of your flexibility. Would you consider $3,700–$3,850? I'm ready to move quickly."

---

## When to Request Deep Analysis

Ask for deeper research when:
- The reference is rare or uncommon
- The watch is expensive ($5,000+)
- Reference identification is uncertain
- You see conflicting price evidence
- Authenticity concerns exist
- You explicitly want maximum confidence

**Request example:**
```
"Please do a thorough analysis. I want to be very confident before committing $7,000."
```

---

## After You Buy: Recording the Transaction

Once you complete a purchase **and** subsequent sale, record it:

1. Open `/memory/pricing-transactions.md`
2. Add your actual transaction details
3. Include actual costs, actual sale price, and lessons learned

**Format:**
```markdown
### Rolex Submariner 116610 - 2026-06-15

**PURCHASE**
- Seller: [Private/dealer/marketplace]
- Asking: $X | Negotiated: $X | Shipping: $X | Total: $X

**SALE**
- Marketplace: [eBay/Chrono24/Private]
- Gross: $X | Fees: $X | Net: $X
- Days held: X
- **Profit: $X** ✅ or ❌

**KEY OBSERVATIONS**
- [What did you learn?]
- [Did pricing estimate match reality?]
- [What would you do differently?]
```

This data becomes your most valuable evidence for future pricing decisions.

---

## Common Questions

**Q: How accurate are these recommendations?**  
A: High confidence (85%+) when good comparable data exists. Lower confidence (55–70%) when the reference is rare. Agent always states its confidence score.

**Q: Should I always follow the recommendation?**  
A: The agent's purpose is to protect capital. If it says "Pass," that's usually good advice. If you strongly disagree, ask why and request more research.

**Q: What if I find a watch not in the knowledge base?**  
A: The agent will research it for you. This takes more time and tokens but will still provide solid analysis. After you complete a transaction with that reference, record it—that data improves future analyses.

**Q: Can the agent guarantee authenticity?**  
A: No. The agent can flag red flags but cannot verify authenticity from photos/description alone. For expensive watches ($3,000+), professional authentication is recommended.

**Q: How do I know if a comparable is good?**  
A: The agent prioritizes: (1) Your own completed sales first, (2) Verified sold prices second, (3) Asking prices last. Always check the "source" and "sold/active" status.

---

## What the Agent Needs to Improve

Help it improve by:
1. **Recording transactions** in `/memory/pricing-transactions.md` — actual data beats predictions
2. **Noting estimation accuracy** — when predictions miss, note why
3. **Updating marketplace fees** in `/docs/marketplace-fees.md` — if fees change
4. **Adding reference knowledge** in `/memory/watch-pricing-knowledge.md` — share patterns you discover

Each transaction recorded makes future analyses more accurate for that reference.

---

## Key Files

| File | Purpose |
|------|---------|
| `watch-pricing-genius.md` | Full agent documentation |
| `memory/watch-pricing-knowledge.md` | Reference specs, market behavior |
| `memory/pricing-transactions.md` | Your actual buy/sell history |
| `memory/comparable-research.md` | Cached research to avoid repeating searches |
| `docs/marketplace-fees.md` | eBay, Chrono24, auction fees; business assumptions |

---

**Ready?** Ask the agent to analyze your first watch opportunity.

Example: "I found a Rolex Submariner 116610 for $8,800. Here's what I know... [details]. Is this worth buying?"
