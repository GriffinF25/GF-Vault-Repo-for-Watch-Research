---
name: agents_system_architecture
description: "Griffin's multi-domain agent workspace at /Users/griffinfletcher/Agents — structure, autonomy grant, and use pattern"
metadata: 
  node_type: memory
  type: project
  originSessionId: 49701677-239f-4ab8-9a84-fc5c302bf2d2
---

## Agents Workspace Architecture

**Workspace:** `/Users/griffinfletcher/Agents` (local git repo; origin = github.com/GriffinF25/GF-Vault-Repo-for-Watch-Research, which the weekly cloud routine reads — keep it pushed).

One person (Griffin) runs multiple ventures through domain folders, each independent with its own `CLAUDE.md`, `README.md`, `/memory/`, `/agents/`, `/projects/`, `/docs/`, `/resources/`, `/archive/`:

- `/gf-vault/` — watch trading (Active; two agents: Watch Pricing Genius on-demand, Watch Market Research cloud routine Mondays 14:00 UTC)
- `/fletcher-holdings/` — real estate (Planning)
- `/banking-career/` — finance career (Active)
- `/personal/` — life goals (Active)
- `/_shared/` — hybrid shared resources: core templates in `_shared/`, domain-specific extensions per domain (chosen to avoid duplication without over-engineering)

Root docs: `CLAUDE.md` (rules + autonomy grant), `INDEX.md` (registry/quick start), `WORKSPACE.md` (workflows), `MEMORY.md` (memory format), `RECAP.md` (monthly checklist). Superseded root docs (AGENTS.md, SYSTEM.md, START_HERE.md, BUSINESS-REFERENCE.md) live in `/Archive/`. A `/website/` dir exists outside the domain structure (Next.js; build artifacts gitignored).

**Autonomy:** Root CLAUDE.md grants full autonomy inside the workspace — read/write/organize/run commands without approval; don't modify files outside it, don't store credentials/SSNs/bank docs, archive instead of delete.

**Use pattern:** identify domain via INDEX.md → read domain CLAUDE.md + memory/MEMORY.md → execute autonomously → record decisions in domain memory with `[[domain-topic]]` cross-links. Related: [[learnings-recap]].
