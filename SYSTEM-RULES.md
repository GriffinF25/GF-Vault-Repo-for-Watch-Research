# System Rules & Principles

**See:** [CLAUDE.md](CLAUDE.md) | [WORKSPACE.md](WORKSPACE.md) | [Learnings Recap](./.claude/projects/-Users-griffinfletcher-Agents/memory/learnings-recap.md)

## Core Rules

### 1. No-Bloat Rule
**Source:** [CLAUDE.md](CLAUDE.md#no-bloat-rule)

- Do NOT create new rules/files unless explicitly needed
- Can new guidance fit into existing lines with slight alteration? Use that instead
- Compress everything—reuse, link, don't duplicate
- When in doubt, add to existing file rather than create new one

### 2. Link Everything
**Source:** [MEMORY.md](MEMORY.md#cross-domain-links)

- Reference instead of repeat
- Use `[[domain-topic]]` for cross-domain connections
- Every principle lives once; everything else points to it
- Update source → all references automatically reflect it

### 3. Learn & Recap
**Source:** [Learnings Recap](./.claude/projects/-Users-griffinfletcher-Agents/memory/learnings-recap.md)

**Weekly:** Note learnings → add to relevant files immediately  
**Monthly:** Run [RECAP.md](RECAP.md) checklist  
**Quarterly:** Consolidate → move patterns to `/_shared/` → refactor

### 4. Autonomy Within Scope
**Source:** [CLAUDE.md](CLAUDE.md#autonomy--operations)

- Operate independently within domain scope
- Make reasonable decisions—no approval needed
- Document decisions in domain memory
- Escalate only when genuinely ambiguous or cross-domain strategic

## File Hierarchy

```
Root (source of truth for principles)
├── CLAUDE.md          # Workspace autonomy, no-bloat rule
├── WORKSPACE.md       # Workflows, review cadence
├── MEMORY.md          # Memory system, types, format
├── INDEX.md           # Domain registry
│
├── [domain]/CLAUDE.md # Domain strategy (links to root)
│   └── memory/MEMORY.md # Domain memory index (links to root)
│
└── Learnings Recap    # Ensures learnings get in right place
```

## How It All Works

### During Work
1. Read relevant CLAUDE.md (domain or root)
2. Check memory for prior decisions
3. Work autonomously
4. **Add learnings directly to relevant memory/file**
5. Link with `[[other-memory]]` if related

### Monthly Recap
1. Open [RECAP.md](RECAP.md)
2. Check each domain—any learnings not yet captured?
3. Verify everything is in the right place
4. Compress if possible (No-Bloat Rule)
5. Move patterns to `/_shared/` if cross-domain
6. Log in [Learnings Recap](./.claude/projects/-Users-griffinfletcher-Agents/memory/learnings-recap.md#learnings-log)

### Quarterly Consolidation
1. Review all memories
2. Consolidate similar concepts
3. Refactor if grown too large
4. Archive obsolete decisions
5. Update all MEMORY.md indexes

## Result

✅ **Zero duplication** — every concept defined once  
✅ **Always learnable** — learnings captured immediately  
✅ **Self-validating** — recaps verify placement  
✅ **Efficient** — compress instead of expand  
✅ **Linked** — navigate from concept to implementation  

---

**Status:** Active | Next Review: Monthly via [RECAP.md](RECAP.md)
