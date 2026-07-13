# Claude Code Instructions — [DOMAIN NAME]

**Version:** 1.0  
**Domain:** [DOMAIN NAME]  
**Owner:** Griffin Fletcher  
**Last Updated:** [DATE]

---

## Overview

[1-2 sentence summary of what this domain does and what agents operate here]

**See also:** `../../INDEX.md` (master system overview), `../../SYSTEM.md` (system principles)

---

## Core Workflows

### Workflow 1: [Name]
**Purpose:** [What this accomplishes]  
**When to use:** [When you'd invoke this]  
**Key steps:**
1. [Step]
2. [Step]
3. [Step]

**Output:** [What you get]

### Workflow 2: [Name]
[Repeat above structure]

---

## Tools & Resources

### Tools
- [Tool name] — [What it does / when to use]
- [Tool name] — [What it does / when to use]

### Templates
- See `../../_shared/templates/` for reusable templates
- See `./resources/` for domain-specific templates

### Documentation
- `./docs/` — Reference materials, strategy, research
- `./memory/` — Persistent context from prior work

---

## Code Style & Conventions

### Writing
- [Style preference: e.g., "Concise, action-oriented", "Formal/professional", "Collaborative/personal"]
- [Tone examples if needed]

### Formatting
- [Any naming conventions for files, projects, etc.]

### Decision-Making
- [How decisions should be made in this domain]
- [Any constraints or guardrails]

---

## Agent Types in This Domain

### [Agent Type 1]: [Agent Name / Description]
**Purpose:** [What this agent does]  
**When to use:** [When to invoke this agent]  
**Input:** [What it needs from you]  
**Output:** [What it produces]

### [Agent Type 2]: [Agent Name / Description]
[Repeat above]

---

## Memory & Context

**Memory location:** `./memory/`

### What to save
- [Type of info that should be remembered]
- [Type of info that should be remembered]

### What not to save
- [Ephemeral work, temp outputs, etc.]

### How to access
- Check `./memory/MEMORY.md` for an index of existing context
- When starting work, read relevant memory files
- Update memory at the end of significant work

---

## Current Projects

See `./projects/` for active work. Each project should have:
- Clear goal/scope
- Status (planning/in-progress/blocked/completed)
- Owner/primary agent(s)
- Next steps

---

## Constraints & Guardrails

- [Any hard constraints for this domain]
- [Any resources that should/shouldn't be used]
- [Any stakeholders or dependencies to consider]

---

## How Claude Code Should Operate Here

1. **Before starting:** Read this file, check memory, understand domain context
2. **During work:** Respect workflows, use domain tools, log progress
3. **On decisions:** Follow decision-making style above; escalate if unclear
4. **When done:** Update memory, update project status, commit with clear message

---

## Quick Commands

```bash
# View domain overview
cat README.md

# Check memory
cat memory/MEMORY.md

# View active projects
ls -la projects/

# Access shared frameworks
ls -la ../../_shared/frameworks/
```

---

## Contact & Questions

**Domain Owner:** Griffin Fletcher  
**Email:** griff.fletcher@gmail.com  
**See:** ../../INDEX.md for cross-domain questions
