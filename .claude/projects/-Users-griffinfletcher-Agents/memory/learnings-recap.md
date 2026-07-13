---
name: learnings-recap
description: Periodic recap of learnings and where they should live
metadata: 
  node_type: memory
  type: project
  originSessionId: 1f391c44-6fe4-41e6-9f8b-5d8578bf2215
---

# Learnings Recap System

**Purpose:** Capture learnings as we work, then verify they're in the correct files during periodic reviews.

**Cadence:** 
- Weekly: Quick note of learnings
- Monthly: Full recap + verify placement
- Quarterly: Consolidate & refactor

## How It Works

### During Work (Weekly)
When a learning emerges:
1. Note: What was learned
2. Note: Which file/memory it belongs in
3. Add to that file/memory immediately
4. Link related memories with `[[domain-topic]]`

**Don't create new files** — add to existing or adjust current text per [No-Bloat Rule](../../../CLAUDE.md#no-bloat-rule)

### Monthly Recap Checklist

Run this each month (around the 12th):

```
[ ] Review workspace root files (CLAUDE.md, WORKSPACE.md, MEMORY.md)
    - Any learnings not yet captured?
    - Any contradictions to fix?
    - Any redundant text to compress?

[ ] Review each domain:
    - Check domain/CLAUDE.md — still accurate?
    - Check domain/memory/MEMORY.md — all decisions recorded?
    - Any patterns to move to /_shared/?

[ ] Review /_shared:
    - Any cross-domain patterns emerged?
    - Any templates that should be formalized?

[ ] Compression pass:
    - Can any line be shortened?
    - Can any concept be combined with existing?
    - Any files to archive?

[ ] Update this file with findings
```

### Quarterly Consolidation

Every 3 months:
1. Consolidate similar learnings
2. Refactor memories that have grown
3. Move proven patterns to /_shared/
4. Archive obsolete decisions
5. Update all CLAUDE.md/MEMORY.md indexes

## Learnings Log

**2026-07-12 — Workspace Launch**
- Created fully linked reference system (no duplication)
- Established No-Bloat Rule
- All domains reference root docs instead of copying
- Memory indexes point to actual memories instead of repeating

**Status:** Active | Review: Monthly
