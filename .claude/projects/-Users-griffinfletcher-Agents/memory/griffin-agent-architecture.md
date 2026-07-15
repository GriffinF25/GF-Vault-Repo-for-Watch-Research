---
name: griffin-agent-architecture
description: "Griffin's preferred multi-agent architecture — top-model orchestrator over cheap subagent tree, plus mandatory verification loops on measurable tasks"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 49701677-239f-4ab8-9a84-fc5c302bf2d2
---

Griffin wants all substantial work run as an **agent tree**: the main session on the highest model orchestrates; narrow tasks go to the cheapest capable subagents (`.claude/agents/`: scout=haiku; analyst/builder/site-cloner/critic=sonnet) who report up in a fixed Result/Evidence/Confidence/Open-issues shape. Any task with an objective comparator (screenshot vs. design, tests, price comps) must run a produce→measure→fix loop rather than shipping pass 1. He also wants the system highly leverageable but easily editable — one file per agent, domain specs separate from tree agents, so pieces can be added/removed as his businesses change.

**Why:** Maximum quality per token — top-model reasoning only where judgment matters, volume work on cheap models, accuracy from iteration instead of hope (stated 2026-07-14). Long-term goal: daily compounding of both knowledge and *capability* — the AI Practice Scout routine (Thursdays 14:00 UTC) harvests external techniques into `_shared/memory/upgrade-candidates.md`, which get tested then promoted or rejected with a logged decision. Build capability when a real task demands it, not speculatively.

**How to apply:** Follow `_shared/frameworks/agent-patterns.md` (the doctrine doc) when planning multi-step work in this workspace. Delegate fan-out to parallel scouts; hand domain specs (e.g. watch-pricing-genius) to an analyst rather than executing inline when the task is bounded. Loop with the [[visual-verify]] skill for UI work. Related: [[agents_system_architecture]].
