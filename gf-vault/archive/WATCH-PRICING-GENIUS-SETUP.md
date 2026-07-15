# Watch Pricing Genius — Setup Complete ✓

**Setup Date:** 2026-07-12  
**Status:** Ready to use  
**Version:** 1.0

---

## System Overview

The **Watch Pricing Genius** is a specialized agent that helps you analyze watch acquisitions, negotiate prices, and calculate realistic resale profit. It's integrated into your GF Vault workspace and uses the workspace's memory system to continuously improve.

**Core Philosophy:** Protect capital first. Distinguish between fair market value and profitable acquisition price.

---

## What's Been Created

### 1. Agent Specification
- **File:** `/gf-vault/agents/watch-pricing-genius.md`
- **Purpose:** Complete agent documentation, capabilities, behavioral standards, confidence scoring system
- **Use:** Reference documentation; describes exactly what the agent does and how

### 2. Supporting Memory Files

#### Watch Pricing Knowledge
- **File:** `/gf-vault/memory/watch-pricing-knowledge.md`
- **Purpose:** Reference-specific market behavior, liquidity patterns, negotiation ranges
- **Example entries:** Rolex Submariner 116610, Tudor Black Bay 79230B, Omega Seamaster Diver 300M
- **Grows over time** as you analyze more references

#### Pricing Transactions
- **File:** `/gf-vault/memory/pricing-transactions.md`
- **Purpose:** Record your actual buys and sales with costs, margins, and learnings
- **Why it matters:** Your completed transactions become the highest-weight evidence for future analyses
- **Format included:** Template for recording each transaction

#### Comparable Research
- **File:** `/gf-vault/memory/comparable-research.md`
- **Purpose:** Cache verified comparable sales to avoid re-researching the same references
- **Grows over time** with each pricing analysis you complete
- **Example entries:** Recent sales data for key references

### 3. Business Reference
- **File:** `/gf-vault/docs/marketplace-fees.md`
- **Purpose:** Current eBay, Chrono24, and auction house fees; business assumptions (profit targets, conditions grading)
- **Update frequency:** Quarterly or when fees change
- **Includes:** Net proceeds calculations, fee comparison table

### 4. Quick Start Guide
- **File:** `/gf-vault/agents/QUICK-START.md`
- **Purpose:** How to request an analysis, what information to gather, what to expect
- **Best for:** Getting started quickly without reading full agent documentation

### 5. Test Analysis
- **File:** `/gf-vault/projects/test-analysis-grand-seiko-spring-drive.md`
- **Purpose:** Demonstration of agent output format; shows the complete analysis framework in action
- **Use:** Reference to understand the quality and depth of analysis you'll receive

---

## How to Use the Agent

### Quick Request

Ask in conversation:

```
"I'm looking at a [watch model]. Here are the details:
- Reference: [reference number]
- Size: [size]
- Condition: [condition]
- Set: [box/papers/links]
- Asking price: $[price]

Is this a good deal? What should I offer?"
```

### What You'll Get Back

1. **Watch Identification** — Confirms exact model, spots any issues
2. **Market Snapshot** — Why this watch matters, current demand
3. **Best Comparables** — Recent verified sales with sources
4. **Realistic Resale Values** — Expected net proceeds per marketplace
5. **Purchase Tiers** — Price levels (Steal → Great Buy → Good Buy → Borderline → Pass)
6. **Deal Math** — Exact profit/loss calculations
7. **Recommendation** — Buy or Pass, with negotiation strategy
8. **Confidence Score** — How certain (85% = High, 55% = Low)

### Example (See Full Version)

Complete analysis example: `/gf-vault/projects/test-analysis-grand-seiko-spring-drive.md`

This fictional Grand Seiko analysis shows:
- How the agent evaluates a watch at different price points
- The math behind profit calculations
- When to recommend "Pass" even for a nice watch
- How to develop negotiation strategy

---

## Integration with Your Workspace

### Memory System

The agent uses GF Vault's memory system automatically:

1. **Reads** existing knowledge from `/gf-vault/memory/` before analyzing
2. **Caches** new research findings in `comparable-research.md`
3. **Uses** your actual transaction history from `pricing-transactions.md` (highest weight evidence)
4. **Tracks** reference-specific patterns in `watch-pricing-knowledge.md`

### Over Time, the System Improves

Each transaction you record makes future analyses more accurate:

| Time | Data Available | Analysis Quality |
|------|-----------------|-----------------|
| **Now (startup)** | Initial references, market data | Good (reliable sources) |
| **After 3 months** | 5–10 completed transactions | Better (your own data validated) |
| **After 6 months** | 15–20 transactions, patterns evident | Excellent (personalized to your market) |

---

## Key Files & Where They Live

| Purpose | File | Access |
|---------|------|--------|
| Agent documentation | `/gf-vault/agents/watch-pricing-genius.md` | Reference |
| Quick start | `/gf-vault/agents/QUICK-START.md` | Read before first use |
| Market data | `/gf-vault/memory/watch-pricing-knowledge.md` | Grows over time |
| Your transactions | `/gf-vault/memory/pricing-transactions.md` | Update after each buy/sell |
| Cached research | `/gf-vault/memory/comparable-research.md` | Auto-populated |
| Fees & assumptions | `/gf-vault/docs/marketplace-fees.md` | Update quarterly |
| GF Vault overview | `/gf-vault/README.md` | Updated with agent info |
| Memory index | `/gf-vault/memory/MEMORY.md` | Reference only |

---

## How to Get Started

### Step 1: Understand the Framework
- Read `/gf-vault/agents/QUICK-START.md` (5 min)
- Review test analysis: `/gf-vault/projects/test-analysis-grand-seiko-spring-drive.md` (10 min)

### Step 2: Prepare Your First Analysis
Gather information about a watch you're considering:
- Model and reference number
- Size, dial, bezel
- Condition (use: Excellent/Very Good/Good/Fair)
- Set status (box, papers, warranty)
- Asking price
- Any photos or detailed description

### Step 3: Request Analysis
Ask Claude:
```
"Analyze this watch for me using the Watch Pricing Genius framework:
[your watch details]"
```

### Step 4: After Buying & Selling
Record your actual transaction in `/gf-vault/memory/pricing-transactions.md`:
- Actual purchase price
- Actual sale price
- Time held
- Any surprises vs. estimate
- Lessons learned

This data improves all future analyses.

---

## Important Notes

### The Agent Will Not...
- **Guarantee authenticity** from photos alone (recommends professional verification for expensive watches)
- **Fabricate sources** or make up prices
- **Claim false precision** when evidence is limited
- **Ignore capital protection** (will recommend Pass when profit is uncertain)

### The Agent Will...
- **Search your own data first** before external research (your completed transactions are highest weight)
- **Use verified sold prices**, not asking prices, for valuation
- **Calculate realistic net proceeds** after all marketplace fees
- **Recommend conservative interpretations** when evidence supports multiple views
- **State its confidence score** and explain what would improve it
- **Complete the analysis** rather than just explain how to do it

### Best Practices

1. **Provide clear information:** Better data = better analysis
2. **Use eBay/Chrono24 for research:** Most reliable sold-price data
3. **Record completed transactions:** This becomes your best evidence
4. **Update marketplace fees** if they change (quarterly review)
5. **Ask for confidence score** if you're unsure; low confidence = ask for deeper research

---

## Brands & References Covered

### Immediate Expertise
- Rolex (Submariner, Daytona, GMT, Datejust, Air-King, Explorer)
- Tudor (Black Bay, Submariner, Pelagos, Day-Date, Prince)
- Omega (Seamaster, Speedmaster, De Ville, Constellation)
- Grand Seiko (Sport, Heritage, Professional, Elegance)
- Breitling (Navitimer, Chronomat, Superocean, Avenger)
- TAG Heuer (Carrera, Aquaracer, Monaco, Formula 1)
- Cartier (Santos, Tank, Ballon Bleu, Panthere, Drive)
- Panerai (Luminor, Radiomir, Submersible, Due)

### Learning Continuously
- Will analyze any legitimate watch brand
- Builds reference knowledge as you ask about new models
- Stores learnings in `watch-pricing-knowledge.md` for future reuse

---

## Token & Efficiency Notes

The agent is designed to be token-efficient:

- **Searches your memory first** before external research
- **Uses cached comparables** to avoid re-researching
- **Stops researching** once the decision is clear (doesn't waste tokens on marginal refinements)
- **Performs deeper analysis** only when the watch's value or risk justifies it

Example:
- **Fast analysis** (high-confidence reference): 2–3 searches, 5–10 min
- **Normal analysis** (adequate data): 3–5 searches, 10–15 min
- **Deep analysis** (rare/expensive/uncertain): 8–12 searches, 20–30 min

---

## Maintenance & Updates

### Monthly
- Review any completed transactions
- Note new references you've analyzed

### Quarterly
- Update `/gf-vault/docs/marketplace-fees.md` if fees change
- Consolidate `/gf-vault/memory/comparable-research.md` (keep organized)
- Review `/gf-vault/memory/watch-pricing-knowledge.md` for accuracy

### As Needed
- Update agent behavior via CLAUDE.md if preferences change
- Add new brand/reference expertise as discovered
- Refine confidence thresholds based on your own results

---

## Success Metrics

You'll know the system is working when:

✓ You consistently identify watches that **sell profitably**  
✓ You **rarely overpay** due to better market intelligence  
✓ Your **negotiation success rate** improves  
✓ **Estimated vs. actual profit** converges over time  
✓ You **pass on marginal deals** confidently  
✓ Your **holding periods** are efficient (4–6 weeks typical)  

---

## Support & Troubleshooting

### Questions About the Agent?
- Read `/gf-vault/agents/watch-pricing-genius.md` (complete documentation)
- Check `/gf-vault/agents/QUICK-START.md` (FAQ section)
- Review test analysis (see how it works in practice)

### The Analysis Seems Off?
- **Request deeper research:** "Please do a thorough analysis; I want high confidence"
- **Provide more photos:** Better visual data = better condition assessment
- **Add marketplace context:** "I'm planning to sell on Chrono24" (helps venue analysis)

### Confidence Score Too Low?
- **This is good:** Low confidence means the agent is being conservative (capital protection)
- **Provide better data:** More recent comparables, clearer photos, detailed description
- **Ask for specific research:** "Research completed sales for this reference in the past 60 days"

### Prices Have Changed?
- **Update `/gf-vault/docs/marketplace-fees.md`** if eBay/Chrono24 fees change
- **Update `/gf-vault/memory/comparable-research.md`** if you see major market shifts
- **Request a refresh:** "I know prices have shifted; can you re-analyze with fresh research?"

---

## Next Steps

1. **Read the Quick Start:** `/gf-vault/agents/QUICK-START.md`
2. **Review the test analysis:** `/gf-vault/projects/test-analysis-grand-seiko-spring-drive.md`
3. **Prepare your first watch:** Gather details on a reference you're considering
4. **Request analysis:** Ask the agent to evaluate it
5. **Record results:** After buy/sell, update `/gf-vault/memory/pricing-transactions.md`

---

## Contact & Feedback

This agent was created for your GF Vault domain with:
- Capital protection as first principle
- Your workspace's memory system integrated
- Token efficiency built in
- Continuous improvement through learning

As you use it, the system learns and improves. Your completed transactions become the most valuable training data.

**Ready?** Start with a real watch opportunity or review the test analysis first.

---

**System Status:** ✅ Ready to use  
**Last Updated:** 2026-07-12  
**Maintenance:** Quarterly review recommended
