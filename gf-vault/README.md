# GF Vault

**Status:** Active | **Focus:** Premium watch secondary-market trading | **Owner:** Griffin Fletcher

Acquires premium watches at wholesale/below-market prices and resells for profit — systematic, data-driven, capital-protective. Strategy and workflows: [CLAUDE.md](CLAUDE.md).

## Agents

- **Watch Pricing Genius** ([agents/watch-pricing-genius.md](agents/watch-pricing-genius.md)) — On-demand deal analysis: identification, comparables, resale values, purchase tiers, buy/pass verdict with confidence score.
- **Watch Market Research** ([agents/watch-market-research-agent.md](agents/watch-market-research-agent.md)) — Cloud routine, Mondays 9am CT (14:00 UTC). Scans Rolex/Tudor/Omega/Breitling/TAG/Cartier/Panerai/Grand Seiko for below-market opportunities; saves report to `/reports/` and emails a summary.

## File Map

| Path | Purpose |
|------|---------|
| [memory/MEMORY.md](memory/MEMORY.md) | Memory index (pricing knowledge, transactions, cached research) |
| [docs/marketplace-fees.md](docs/marketplace-fees.md) | eBay/Chrono24/auction fees; update quarterly |
| `/projects/` | Completed analyses (incl. Grand Seiko test analysis) |
| `/reports/` | Weekly market research reports |
| `/archive/` | Superseded docs |

## Current Status

- ✓ Both agents specified; memory system initialized; test analysis done
- ✓ Weekly research routine scheduled (first valid run: Mon 2026-07-20 — the 2026-07-13 run fired before the repo was synced)
- Next: review first real weekly report → run first deal end-to-end → record transaction in memory

---

**Last Updated:** 2026-07-14 | **Review:** 2026-08-13
