---
name: visual-verify
description: Screenshot-based visual verification loop for design accuracy — automated capture via Playwright, manual paste as fallback
---

# Visual Verification Loop

Converge an implementation on a design reference by looping: **capture → compare → fix → repeat**. Used by the `site-cloner` agent and any UI work with a visual target.

## Setup

- **Reference:** a design image from Griffin, or a screenshot of a live site:
  `npx playwright screenshot --viewport-size=1440,900 --full-page <url> reference.png`
  (first time: `npx playwright install chromium`)
- **Dev server running** for the implementation (e.g. `npm run dev`, or `npx serve <dir>` for static HTML).
- From the reference, write a **visual checklist**: layout regions, spacing, exact colors, typography (family/size/weight/line-height), imagery, hover/active states.

## The Loop (cap 5 passes)

1. **Capture** the implementation the same way, same viewport:
   `npx playwright screenshot --viewport-size=1440,900 --full-page http://localhost:3000 pass-N.png`
2. **Compare** — Read both image files (never diff from memory) and list concrete gaps against the checklist, biggest visual impact first.
3. **Fix** the top gaps in CSS/components.
4. **Log** the pass: `#N — fixed: …, remaining: …` — then repeat.

**Stop when:** checklist fully matches ✅, OR two passes with no improvement (plateau), OR pass cap hit — then report the remaining gap honestly.

## Viewports

Converge desktop (1440px) first, then one verification pass each at **375px** (mobile) and **768px** (tablet): `--viewport-size=375,812` / `--viewport-size=768,1024`.

## Manual fallback (no Playwright / interactive session)

Griffin pastes screenshots (Cmd+Shift+4) and Claude compares each against the reference, lists gaps, fixes, and asks for the next capture — same loop, human-driven camera.

## Priorities

Pixel-accuracy matters most on: hero sections, CTAs/buttons, typography hierarchy, brand colors. Subtle shadows and micro-interactions are polish — iterate later.
