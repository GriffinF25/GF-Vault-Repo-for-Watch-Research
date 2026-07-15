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

**2026-07-13 — System Finalization**
- Deleted SYSTEM-RULES.md (violated no-bloat rule)
- Compressed all root files to 13.8K (was 18.4K)
- Added learning recap system with monthly template
- Updated all dates & committed to git
- System is production-ready for agents/tasks
- Learnings: Clarity > absolute minimum size (kept readable)

**2026-07-14 — Continuity & Condensation Audit**
- Found the weekly cloud routine had fired against a near-empty GitHub repo (workspace was never pushed), had no WebSearch/WebFetch, and had Robinhood attached instead of Gmail — fixed routine + synced repo
- Lesson: a scheduled cloud agent's repo, tools, and connectors must be verified end-to-end at creation, not assumed from the spec doc
- Archived duplicative docs (setup summaries, QUICK-START, START_HERE, BUSINESS-REFERENCE); rewrote _shared/README to list only files that exist
- Consolidated 3 overlapping session memories into system_architecture.md
- Docs must state schedule facts once, accurately (was "Mon 8am UTC" in docs vs. actual Mon 14:00 UTC)

**Status:** Active | Review: Monthly | Next: Verify first valid weekly run (Mon 2026-07-20)
