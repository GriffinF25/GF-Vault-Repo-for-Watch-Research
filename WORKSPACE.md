# WORKSPACE — Principles & Workflows

**Updated:** 2026-07-14 | **See:** [CLAUDE.md](CLAUDE.md) autonomy rules

## Core Principles

**Modular Independence** → Each domain: [CLAUDE.md](CLAUDE.md), memory, projects, resources  
**Strategic Memory** → See [MEMORY.md](MEMORY.md) for types & format  
**Shared Resources** → Templates in `/_shared/` adapted per domain  
**Cross-Domain Links** → Use `[[domain-topic]]` syntax ([see MEMORY.md](MEMORY.md#memory-file-format))  
**Professional Quality** → Organized, documented, discoverable, maintainable

## Standard Workflow

```
1. Identify domain → [INDEX.md](INDEX.md)
2. Read domain/CLAUDE.md + domain/memory/MEMORY.md
3. Check /_shared/ for templates
4. Execute autonomously (see [CLAUDE.md](CLAUDE.md) Autonomy section)
5. Record decisions in domain/memory/ (see [MEMORY.md](MEMORY.md))
6. Clean up & organize files
```

## File Structure (Per Domain)

```
/[domain]/
├── README.md          # Status & overview
├── CLAUDE.md          # Domain instructions
├── /memory/           # See MEMORY.md format
├── /projects/         # Active work
├── /resources/        # Templates & assets
├── /docs/             # Reference materials
└── /archive/          # Completed work
```

## Memory System

**See:** [MEMORY.md](MEMORY.md) for types (user/feedback/project/reference), format, and cadence.

## When to Escalate

Ask for clarification only if:
- Task intent is genuinely ambiguous
- Work conflicts with domain strategy (see domain `CLAUDE.md`)
- Multi-domain bridge needs strategic decision

Otherwise: [CLAUDE.md](CLAUDE.md) authorizes autonomous decisions.

## Learning & Review Cadence

**Weekly:** Note learnings as they emerge → add directly to relevant domain memory/files  
**Monthly:** Run [learnings recap](file:./.claude/projects/-Users-griffinfletcher-Agents/memory/learnings-recap.md) checklist  
**Quarterly:** Consolidate patterns → move to `/_shared/` → refactor memories  

**See:** [No-Bloat Rule](CLAUDE.md#no-bloat-rule) — don't create new files, compress into existing ones
