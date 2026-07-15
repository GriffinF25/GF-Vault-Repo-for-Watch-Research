# Agent Tree & Verification Loops

**Purpose:** Operating doctrine for all multi-agent work in this workspace. Two patterns: delegate down a tree of progressively cheaper agents, and close every measurable task with a verification loop.

## Pattern 1 — The Agent Tree

The main session (highest-capability model, e.g. Fable/Opus) is the **orchestrator**. It owns the goal, plans, splits work, integrates results, and decides. It never burns top-model tokens on mechanical work — it delegates via the Agent tool to definitions in `.claude/agents/`:

| Tier | Agents | Model | Use for |
|------|--------|-------|---------|
| 0 — Orchestrator | main session | highest available | Planning, judgment, synthesis, decisions |
| 1 — Specialists | `analyst`, `builder`, `site-cloner`, `critic` | sonnet | Bounded multi-step tasks: research reports, implementing changes, site replication, independent verification |
| 2 — Workers | `scout` | haiku | Single lookups, file/web fact-finding, parallel fan-out |

**Model heuristic:** the more judgment, ambiguity, or synthesis a task needs, the higher the model; the more mechanical or narrow, the lower. Launch several scouts in parallel rather than one broad task.

**Delegation rules:**
1. Every delegation states: objective, exact inputs (paths/URLs), done-criteria, and required report format.
2. Keep the tree shallow: orchestrator → specialist → (optionally) workers. No deeper.
3. Reports flow **up**, always in this shape: **Result** (the answer/deliverable), **Evidence** (paths, sources, data), **Confidence** (high/med/low + why), **Open issues**. The orchestrator integrates — it never forwards raw dumps.
4. **Domain specs define the *what*; tree agents are the *who*.** GF Vault's watch-pricing-genius.md is a spec, not an executor — the orchestrator hands it to an `analyst` ("run a pricing analysis per gf-vault/agents/watch-pricing-genius.md for watch X"). New business = new specs, same tree.

## Pattern 2 — Verification Loops

A task is **loop-able** when an objective comparator exists: screenshot vs. design reference, tests pass/fail, estimate vs. verified comps, output vs. checklist. If a comparator exists, looping is mandatory — don't ship pass 1.

```
produce → measure → diff vs. target → fix the biggest gap → repeat
```

**Stop when:** target threshold met, OR two consecutive passes show no improvement (plateau), OR iteration cap hit (default 5). Then report the remaining gap honestly — never claim convergence that didn't happen.

For high-stakes work, close the loop with an independent gate: a `critic` agent verifies the done-criteria itself (producer self-verification has self-grading bias).

**Log every pass** (what changed, gap remaining) so progress is auditable and the next session can resume.

Workspace comparators available today: `visual-verify` skill (screenshot vs. design, automated capture via Playwright), test suites (`npm test`), pricing accuracy (estimated vs. actual in gf-vault [[pricing-transactions]]).

## Editing the Tree (leverage & modularity)

- **Add capability:** drop one file in `.claude/agents/` (frontmatter: `name`, `description`, `tools`, `model`; body = its instructions). It's immediately delegatable.
- **Remove capability:** move the file to `/Archive/`.
- **New business:** write domain specs in `[domain]/agents/` — no new tree agents needed unless the *kind* of work is new.
- Keep each agent single-purpose; if a definition grows beyond ~60 lines, it's doing too much — split or simplify.

---

**Created:** 2026-07-14 | **Owner:** Griffin Fletcher | Related: [[agents_system_architecture]]
