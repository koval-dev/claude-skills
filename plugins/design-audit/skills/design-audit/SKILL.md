---
name: design-audit
description: Audit the visual and UX design of a screen, web page, or UI code and explain what to improve, grounded in Gestalt principles (similarity, proximity, continuity, closure, figure/ground, Prägnanz, common fate, common region, uniform connectedness, emergence, invariance, multistability) plus visual hierarchy, typography, colour and accessibility, layout and spacing, usability heuristics, and consistency. Use this whenever someone shares a screenshot, mockup, slide, poster, live URL, or HTML/CSS/JSX/Vue/Svelte component and asks for a design review, UI/UX feedback, a critique, "does this look right", "why does this feel off", "how can I make this cleaner", a Gestalt analysis, or an accessibility/contrast check, even if they don't say "audit". Produces a teaching-oriented report with suggested fixes and never edits files. When the user wants the page changed in place, use art-directed-web-design for a visual restyle or fix-mobile-ux for mobile repairs.
metadata:
  last-reviewed: "2026-10-22"
  reviewed-against: "Claude Code 2.1.308; code.claude.com/docs/en/skills; developers.openai.com/plugins/build/plugins; code.visualstudio.com/docs/agent-customization/agent-skills; WCAG 2.2"
---

# Design audit

Review a design the way a good design mentor would: notice what works, find what gets in the user's way, explain *why* using named principles, and suggest a concrete fix for each problem. The reader is often someone learning design, so every finding should leave them understanding a principle a little better, not just holding a to-do list.

This skill **reports and suggests; it does not modify files.** If the input is code, include the CSS/markup change in the suggestion so the reader can apply it themselves.

## 1. Identify the input and gather evidence

Work out which kind of input you have, because it decides how confident you can be.

| Input | How to gather evidence | Confidence |
|---|---|---|
| **Screenshot / image** | Look at it carefully. Estimate spacing and alignment visually; sample colours if you can read them. | Visual judgement. Say "appears to" for anything you can't measure. |
| **Web UI code** (HTML, CSS, JSX, Tailwind, etc.) | Read the markup and styles. Pull out real values: spacing, font sizes, colours, breakpoints, and whether a page has a viewport meta tag. If you can render it (see below), do. | Measured values for anything defined in code. |
| **Live URL** or renderable local HTML | Render it, take a screenshot, and run the measurement script (below). Look at the screenshot *and* the numbers. | Best: you see it and you can measure it. |

**Rendering and measuring.** If you have any way to run a browser, use it, because exact numbers turn opinions into evidence:

- If you have a browser tool that can execute JavaScript in a page, run the contents of `scripts/measure.js` in the page. It returns JSON with text contrast failures, the font-size and spacing values in use, distinct left edges, small tap targets, and more.
- Otherwise, if Node and Playwright are available, run:
  `node scripts/audit_url.mjs <url-or-local-html-path> --out <dir>`
  It saves `screenshot.png` (full page) and `measurements.json`. If Playwright is missing it prints how to install it; ask before installing anything.
- For a single colour pair, `python3 scripts/contrast.py "#777" "#fff"` prints the WCAG ratio and pass/fail.

If nothing can render the page, audit from code and say so in the report.

Ask for missing context only when it would change your conclusions. It helps to know who the users are, what the page's main goal is (sign up, read, buy), and the target device. Otherwise, infer reasonable answers and state your assumptions in the report.

## 2. First impression before details (Emergence)

Before checking anything, look at the whole design for a few seconds, as a user would. Squint, or picture it blurred. Write down:

- What the eye lands on first, second, and third.
- What the page seems to be *for*, in one sentence.
- Whether that matches the page's actual goal.

If you can't summarise the hierarchy in one sentence, that is the first and most important finding. People perceive the whole before the parts, so a muddled overall shape costs more than any detail.

## 3. Review through six lenses

Read the reference file for each lens as you get to it. Each one lists concrete checks, how to detect problems from a screenshot or from code, and typical fixes.

1. **Gestalt principles:** `references/gestalt.md`. This is the core lens and always runs. Go through all 12 principles. Some can't be judged from every input (Common Fate needs motion), so mark those "not assessed" and don't guess.
2. **Visual hierarchy and typography:** `references/hierarchy-typography.md`
3. **Colour and accessibility:** `references/color-accessibility.md`
4. **Layout and spacing:** `references/layout-spacing.md`
5. **Usability heuristics:** `references/usability.md`. Judge only what is visible or implied by the design. Don't speculate about backend behaviour.
6. **Consistency:** `references/consistency.md`

The lenses overlap: a cramped card can be both a Proximity problem and a spacing-scale problem. Report each problem **once**, under the principle that best explains *why* it hurts. Use the other lenses only to strengthen the fix. Gestalt goes first when it's a fair explanation, since that's the vocabulary the reader is learning.

Also check how the principles interact. The most common real-world problem is **competing cues**: colour says two items are related, but spacing says they aren't. When cues disagree, users fall back on whichever is strongest (usually a visible connector or enclosing box, then proximity, then similarity), and that may not be what the designer meant.

## 4. Decide what matters

A good audit is selective. Rank findings by their effect on a real user trying to do the page's main task:

- **High:** blocks or misleads the user: unreadable contrast, the main action is hard to find, ambiguous grouping that causes wrong choices, missing error or feedback states.
- **Medium:** slows the user or makes the page feel untrustworthy: weak hierarchy, inconsistent spacing, competing cues, misalignment that breaks scanning.
- **Low:** polish: small inconsistencies, slightly tight spacing, minor typographic issues.

Put **at most 10 findings** in the main report, most important first. Everything else goes in a short "More findings" list at the end. A reader who gets 40 items of equal weight fixes none of them.

Be honest about strengths too. Name 2–4 things the design does well, each tied to a principle. Learners pick up as much from seeing a principle working as from seeing it broken.

Never invent problems to fill the list. If the design is strong, a short report is the right report.

## 5. Write the report

Follow `references/report-format.md` exactly. It defines the sections, the finding format, and the at-a-glance table. Write in plain language: introduce each principle in a single sentence the first time it appears, then use its name.

Point at things so the reader can find them: "the three pricing cards in the middle of the page", "`.card__footer` in `Pricing.tsx`", or a region of the screenshot ("top-right, the grey 'Learn more' link"). Vague locations make findings impossible to act on.

When suggesting a fix, be specific: give a measurement ("increase the gap between groups from 16px to 32px and reduce the gap inside each group to 8px"), name the token, or include a CSS snippet. "Improve spacing" teaches nothing.
