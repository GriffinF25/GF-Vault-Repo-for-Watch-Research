# MEMORY — Auto-Memory Index & Format

**Updated:** 2026-07-13 | **See:** [CLAUDE.md](CLAUDE.md) | [WORKSPACE.md](WORKSPACE.md)

## Domain Memory Indexes

| Domain | Memory Index |
|--------|--------------|
| **GF Vault** | [`gf-vault/memory/MEMORY.md`](gf-vault/memory/MEMORY.md) |
| **Fletcher Holdings** | [`fletcher-holdings/memory/MEMORY.md`](fletcher-holdings/memory/MEMORY.md) |
| **Banking Career** | [`banking-career/memory/MEMORY.md`](banking-career/memory/MEMORY.md) |
| **Personal** | [`personal/memory/MEMORY.md`](personal/memory/MEMORY.md) |
| **Shared** | [`_shared/memory/MEMORY.md`](_shared/memory/MEMORY.md) |

Each domain's `memory/MEMORY.md` acts as an index pointing to actual memory files in that domain.

## Memory File Format

Every memory file uses this frontmatter:

```markdown
---
name: kebab-case-slug
description: One-line summary
metadata:
  type: user | feedback | project | reference
---

Content here.

**Why:** Context/motivation for this decision or learning

**How to apply:** When/where this guidance applies
```

## Memory Types

| Type | Purpose | Save When | Example |
|------|---------|-----------|---------|
| **user** | Role, preferences, knowledge | Learn about Griffin's expertise, communication style, preferences | "Expert in finance", "prefers terse responses" |
| **feedback** | How Claude should approach work | User corrects approach or confirms non-obvious approach works | "Don't mock databases" (from prior incident), "prefer bundled PRs" |
| **project** | Status, goals, timelines, decisions | Strategic decisions made, domain initiatives, multi-year goals | "GF Vault launching Q4", "Banking cert target: 2026-Q2" |
| **reference** | External resources, systems, contacts | Learn where info/tools live externally | "Bugs in Linear INGEST", "Grafana dashboard at grafana.internal/d/api-latency" |

## Cross-Domain Links

Link related memories with `[[domain-topic]]` syntax:

```markdown
See [[gf-vault-product-strategy]] for watch brand positioning  
Related: [[fletcher-holdings-financing]] for capital structure
```

**See:** Domain `memory/MEMORY.md` for domain-specific memory guidance

## Review Cadence

- **When to update:** After strategic decisions, significant learnings, or process changes
- **Monthly:** Quick review of domain memories
- **Quarterly:** Consolidate and refactor memories
- **Annually:** Full memory audit, archive old entries

## Memory Access Pattern

1. Claude reads all existing memories at session start
2. Domain memories are loaded when working in a domain
3. Workspace memories loaded when working across domains
4. Cross-domain links enable finding related context

**How to add memory:** See your domain's `memory/MEMORY.md` for instructions
