---
name: visual-verify
description: Screenshot-based visual verification for 100% design accuracy
---

# Visual Verification Loop

Use this workflow to achieve pixel-perfect accuracy between your implementation and a design reference.

## Setup (First Time Only)

1. **Paste your design reference**: Share a screenshot, Figma export, or design image of what the website should look like
2. **I'll examine it** and create a checklist of visual requirements (spacing, colors, typography, layout)
3. **Ensure dev server is running**: `npm run dev` on http://localhost:3000

## The Verification Loop

Repeat this cycle until your implementation matches the design:

### 1. Take Screenshot
```bash
# Manual screenshot (VSCode/web browser)
# - Press Cmd+Shift+4 (Mac) to capture a region
# - Or use browser DevTools screenshot feature
# - Save to your project root as: screenshot.png
```

### 2. Show Me Results
Paste the screenshot here and I will:
- Compare it to the design reference
- List visual gaps (spacing off, colors wrong, text misaligned, etc.)
- Prioritize by impact (critical vs. polish)

### 3. Fix Issues
I'll update the CSS/component code to match the design, addressing:
- Layout & spacing (margins, padding, gaps)
- Colors & backgrounds
- Typography (font size, weight, line-height)
- Responsiveness across viewports
- Hover/active states (if applicable)

### 4. Re-screenshot & Iterate
Take another screenshot and paste it. I'll compare again and iterate until ✅ design matches implementation.

## Viewport Sizes to Test
Once the main viewport looks correct, verify across:
- **Mobile**: 375px wide (iPhone SE)
- **Tablet**: 768px wide (iPad)
- **Desktop**: 1440px wide (full screen)

## Tips for Faster Convergence

- **Clear design reference first**: Paste the design image at the start—I'll use it for all comparisons
- **Specific feedback**: Tell me if something should be "tighter," "more centered," or point to specific spacing
- **One feature at a time**: Build and verify page sections sequentially, not all at once
- **Browser DevTools**: Use Inspect Element to check computed styles if colors/sizes look off

## Example Workflow

```
You: [Paste design image]
Me: Here's what I see in the design:
    - Hero section: 80px top/bottom padding
    - Button: 12px border radius, #0066FF background
    - Text: Roboto 16px, line-height 1.5
    
    Let me implement this...

You: [Paste screenshot of your implementation]
Me: Visual comparison:
    ✓ Layout matches
    ✗ Button has 8px radius (should be 12px)
    ✗ Text color is too light
    
    Fixing...

You: [Paste updated screenshot]
Me: Much better! Small tweak needed: padding needs 5px more on sides. Fixed.

You: [Final screenshot]
Me: ✅ Matches design perfectly. Ready to commit!
```

## When Precision Matters Most

Focus pixel-perfect accuracy on:
1. **Hero sections** (first thing users see)
2. **CTAs/buttons** (must be exact for brand consistency)
3. **Typography hierarchy** (headings, body text)
4. **Color accuracy** (brand colors especially)

Polish-level details (subtle shadows, micro-interactions) can be refined iteratively later.