---
name: agents_system_architecture
description: "Multi-domain agent organization system for watch company, banking career, personal projects, and business ventures"
metadata: 
  node_type: memory
  type: project
  originSessionId: fe8deb2e-e91c-4ade-a848-fdb6d8872d1f
---

## System Architecture for Agents

Created 2026-07-12 as professional, enterprise-grade agent organization system for Griffin Fletcher.

**Problem addressed:** One person managing multiple business domains (watch company, banking career, personal growth, business ventures) needed a scalable, professional structure that keeps domains independent while allowing shared resources and frameworks.

**Solution:** Multi-domain agent system with modular independence, shared resources, and clear handoff documentation.

### Structure

```
/Agents/
├── SYSTEM.md                 # Meta-instructions & principles
├── INDEX.md                  # Master registry of all domains
├── MEMORY.md                 # Quick index to domain memories
├── /watch-company/           # Domain 1: Watch brand development
├── /banking-career/          # Domain 2: Finance career advancement
├── /personal/                # Domain 3: Life goals & learning
├── /business-ventures/       # Domain 4: New business evaluation
└── /_shared/                 # Core templates & frameworks (hybrid model)
```

Each domain folder contains:
- `CLAUDE.md` — Domain-specific instructions and workflows
- `README.md` — Quick overview
- `/agents/` — Agent definitions
- `/memory/` — Persistent context
- `/docs/` — Reference materials
- `/resources/` — Templates and assets
- `/projects/` — Active work

### Key Principles

1. **Modular Independence** — Each domain operates autonomously
2. **Enterprise Structure** — Professional organization, lightweight execution
3. **Hybrid Shared Resources** — Core frameworks in `/_shared/`, domain-specific extensions in each domain
4. **Clear Handoffs** — Explicit documentation when domains intersect
5. **Persistent Memory** — Each domain maintains its own memory system

### Why Hybrid Approach Works

User chose **hybrid** for shared resources (core templates in `_shared/`, domain-specific extensions per domain) because:
- Avoids duplication across domains
- Allows each domain to adapt frameworks to its needs
- Creates a reusable library as patterns emerge
- Prevents over-engineering while maintaining structure

### Use Pattern

1. **Identify domain** of work
2. **Read that domain's CLAUDE.md** for context
3. **Check domain memory** for prior decisions
4. **Execute using domain-specific tools**
5. **Log outcomes** to domain memory

### Memory System

Each domain has persistent memory at `/[domain]/memory/` storing:
- Strategic decisions and rationale
- Learnings and insights
- Relevant data and research
- Relationships and contacts
- Progress on long-term goals

**Cross-domain:** When work affects multiple domains, document in both domain memories using `[[domain-name-topic]]` links.

### For Claude Code Going Forward

1. Always check `INDEX.md` to understand which domain a task belongs to
2. Read the domain's `CLAUDE.md` before starting work
3. Check domain memory for context
4. Respect domain independence — don't pull in unrelated domains
5. Update memory when significant work completes
