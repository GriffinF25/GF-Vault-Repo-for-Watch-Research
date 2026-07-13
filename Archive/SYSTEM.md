# SYSTEM.md — Principles, Workflows & Conventions

**Workspace:** `/Users/griffinfletcher/Agents`  
**Owner:** Griffin Fletcher  
**Updated:** 2026-07-12

## Core Operating Principles

### 1. Modular Domain Independence
Each domain (watch company, banking, real estate, personal) operates autonomously with:
- Its own CLAUDE.md with domain-specific instructions
- Its own memory system for decisions and learnings
- Its own project tracking and resources
- Clear boundaries to prevent cross-contamination

**When to bridge domains:** Only when strategic alignment or resource-sharing is explicitly required. Document these connections in both domain memories.

### 2. Enterprise-Grade Organization
Professional structure that scales without overhead:
- Clear naming conventions and file hierarchy
- Consistent documentation across domains
- Repeatable workflows and decision-making
- Professional memory that captures strategic context

### 3. Hybrid Shared Resources
Maximize code reuse without coupling:
- `/_shared/` contains templates, frameworks, and utilities
- Domains adapt shared resources to their specific needs
- Common patterns are gradually formalized in `/_shared/`
- Each domain maintains its own extensions

### 4. Memory as Strategic Asset
Persistent memory captures what matters:
- **Why** decisions were made (not just what)
- Strategic learnings and insights
- Key relationships and contacts
- Progress on multi-year goals

Non-goals for memory:
- Temporary task tracking (use domain project folders)
- Debugging solutions (they live in code/git)
- Ephemeral work from single sessions
- Information better stored elsewhere

### 5. Clear Handoffs & Decisions
Work across multiple domains requires explicit bridging:
- Document which domains are affected
- Update memory in all affected domains
- Use cross-domain links (`[[domain-topic]]`)
- Ensure strategic consistency

## Workflow Patterns

### Standard Task Execution
1. **Identify the domain** — Which domain does this work belong to?
2. **Read domain CLAUDE.md** — Understand domain-specific context and rules
3. **Check domain memory** — What prior decisions affect this work?
4. **Consult /_shared/** — Use templates and frameworks if applicable
5. **Execute autonomously** — Make decisions within domain scope
6. **Update memory** — Record learnings and progress before finishing
7. **Maintain organization** — Keep files and folders clean

### Cross-Domain Work
1. List all affected domains
2. Review each domain's CLAUDE.md and memory
3. Make decisions that respect all domain strategies
4. Update memory in each affected domain with cross-domain links
5. Document the bridge/connection in workspace memory

### New Projects or Decisions
1. What domain does it belong to?
2. What's the strategic value or goal?
3. What similar work has been done before? (Check memory)
4. What resources exist in `/_shared/`?
5. What are the key success metrics?
6. Document the decision and rationale in domain memory

## File Organization Conventions

### Naming
- **Folders:** kebab-case, descriptive (e.g., `market-research`, `contract-templates`)
- **Files:** kebab-case with relevant extension (e.g., `q3-strategy.md`, `ui-components.tsx`)
- **Dates:** YYYY-MM-DD format when used (e.g., `2026-07-12-meeting-notes.md`)

### Folder Structure (Per Domain)
```
/[domain-name]/
├── README.md              # Domain overview & status
├── CLAUDE.md              # Domain-specific instructions
├── /memory/               # Persistent strategic memory
├── /agents/               # Domain-specific agents (if any)
├── /docs/                 # Reference materials & guides
├── /resources/            # Templates, assets, utilities
├── /projects/             # Active & completed work
│   ├── /[project-name]/
│   │   ├── README.md
│   │   ├── /docs/
│   │   ├── /assets/
│   │   └── /outputs/
└── /archive/              # Completed or inactive projects
```

### File Standards
- **README.md** — Quick overview, status, key contacts/resources
- **CLAUDE.md** — Domain-specific instructions, workflows, conventions, constraints
- **Memory files** — `[topic].md` with frontmatter (name, description, metadata)
- **Project docs** — Clear structure, searchable, version-dated when important

## Memory Organization

### Memory File Frontmatter
```markdown
---
name: kebab-case-slug
description: One-line summary of what this memory is about
metadata:
  type: user | feedback | project | reference
---

[Content...]
```

### Memory Types (See `/memory/MEMORY.md`)
- **user** — Information about Griffin's role, preferences, knowledge
- **feedback** — Guidance on how to approach work (what to do/avoid)
- **project** — Project status, goals, timelines, stakeholder info
- **reference** — Pointers to external systems and resources

### Cross-Domain Links
Use `[[domain-name-topic]]` to link related memories:
- `[[gf-vault-product-strategy]]` links to watch company product decisions
- `[[fletcher-holdings-financing]]` links to real estate finance approach
- Creates navigable memory network without tight coupling

## Communication & Handoffs

### Session Summaries
At end of meaningful work:
- What changed? (files created/modified/deleted)
- What was learned? (update memory)
- What's next? (context for future sessions)
- Any blockers or decisions needed?

### Domain Transitions
When switching between domains:
1. Finish one domain's work (update memory, clean up)
2. Read target domain's CLAUDE.md and recent memory
3. Understand domain context before proceeding
4. Record which domain you're working in (for context clarity)

### Escalation
Ask for clarification only if:
- Task intent is genuinely ambiguous
- Work conflicts with documented domain strategy
- Multi-domain bridge requires strategic decision (not just organizational)

Otherwise: Make reasonable assumptions and proceed.

## Review & Improvement

### Monthly Review (Around the 12th)
- Review each domain's progress against strategy
- Update domain README.md with current status
- Archive completed projects to `/archive/`
- Identify patterns for `/_shared/` templates

### Quarterly Review (Every 3 months)
- Assess domain strategy alignment
- Update CLAUDE.md if principles/constraints changed
- Consolidate learnings in domain memory
- Refactor `/_shared/` based on patterns from active work

## Quality Standards

All work in this workspace should be:
- **Organized** — Clear structure, logical naming
- **Documented** — README files explain what/why
- **Discoverable** — Memory links enable finding prior work
- **Professional** — Quality proportional to domain importance
- **Maintainable** — Others could understand and continue the work

---

**Last Updated:** 2026-07-12  
**Next Review:** 2026-08-12
