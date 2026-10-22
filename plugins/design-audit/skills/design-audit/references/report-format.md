# Report format

Write the report in Markdown with these sections, in this order. If the user asks for the report as a file, save it as `design-audit.md` (or the name they give); otherwise put it in the chat.

```markdown
# Design audit: <what was audited>

**Input:** <screenshot | code: path(s) | URL> · **Measured:** <yes, via measure.js / audit_url.mjs | no, visual estimate only>
**Assumed goal:** <the page's main task, e.g. "get visitors to start a free trial"> · **Assumed users/device:** <...>

## First impression
<2–4 sentences: what the eye lands on first, second, third; what the page seems to be for; whether that matches the goal. This is the Emergence check.>

## What's working
- **<Principle>:** <what the design does well and where>. <One sentence on why this helps the user.>
- (2–4 items)

## Findings

### 1. <Short title that names the problem> — <High | Medium | Low>
**Principle:** <Name>: <one-sentence plain explanation, first time this principle appears>
**Where:** <specific location: region, element, selector, file:line>
**What's happening:** <the evidence. Include measured values when you have them, e.g. "gap inside card 24px, gap between cards 16px".>
**Why it matters:** <the effect on a real user>
**Suggested fix:** <specific change; include a CSS/markup snippet for code input>

### 2. ...
(at most 10, most important first)

## Principles at a glance
| Principle | Status | Note |
|---|---|---|
| Similarity | ✅ Good / ⚠️ Issue (#n) / ❌ Problem (#n) / — Not assessed | <few words> |
| Proximity | | |
| Continuity | | |
| Closure | | |
| Figure/Ground | | |
| Symmetry & Order (Prägnanz) | | |
| Common Fate | | |
| Common Region | | |
| Uniform Connectedness | | |
| Emergence | | |
| Invariance | | |
| Multistability | | |
| Hierarchy & typography | | |
| Colour & accessibility | | |
| Layout & spacing | | |
| Usability heuristics | | |
| Consistency | | |

## Top 3 next steps
1. <the one change with the biggest effect>
2. ...
3. ...

## More findings
- <Low-priority items that didn't make the top 10, one line each>

<If relevant: "Not covered: this is a design review, not a full WCAG conformance audit / usability test.">
```

## Notes on the format

- Use ⚠️ for Medium/Low issues and ❌ for High issues, and reference the finding number so the table links back to the details.
- Use "— Not assessed" with a reason ("static screenshot, no motion") rather than guessing. Common Fate, Invariance (needs several sizes or contexts of a logo) and Multistability often end up here, and that's fine.
- Keep each finding short: 4–7 lines. The table and next steps give the overview; the findings give the depth.
- When the input is a screenshot, write "appears" for estimated values.
- Leave out "More findings" if there are none.
