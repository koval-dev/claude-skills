---
name: art-directed-web-design
description: Redesign or visually polish an existing web page in place with art-directed typography and grid composition, using its real content and current design system. Use for restyling or layout recomposition; exclude greenfield UI and mobile-only usability fixes.
---

# Art Directed Web Design

Turn a working semantic page into an intentional visual composition. Choose a direction suited to its content and brand, then implement it in the existing project. Infer the target file, component, or route from the request and current context.

## Inspect and choose

Read the target page, global styles, theme tokens, relevant shared components, nearby brand examples, and available media. Use the project's existing typography, spacing, colours, and utilities as the working palette.

Identify the primary user goal, the content deserving the most weight, alignment anchors, section pacing, and the mobile transformation. Choose one coherent visual idea. Read [design-direction.md](references/design-direction.md) when a direction is not already established by the user or project.

Implement the chosen direction directly. Present concepts or mockups only when requested. Preserve real copy, facts, links, and working interactions; regroup content when it improves hierarchy. Match the user's requested scope: a polish pass may need fewer structural changes than a full redesign.

## Compose the page

Build hierarchy through typography, text measure, whitespace, media placement, and an explicit grid. Use CSS Grid for two-dimensional composition and Flexbox for one-dimensional alignment. Shared anchors should connect sections even when their column spans and density differ.

Give each section a role in the narrative. Combine related content, introduce supporting columns, or use selective full-bleed regions where they help. Let the content determine the variation; a quiet section can remain simple. Use a restrained motif such as a rule, caption style, or alignment relationship.

### Numbering needs meaning

Use unnumbered section headings by default. Introduce numbers only when they communicate a required order, a real ranking, or chapter navigation that readers can actually use. Before adding them, identify what the reader learns from the order. If rearranging the items would leave their meaning intact, use headings, spacing, or rules instead.

- **Default limit: one numbered group per page.** Keep it within a single coherent sequence, such as a process or ranked list. The group can have as many items as its content requires.
- Keep numbering local to that group. Surrounding sections such as benefits, testimonials, FAQs, and the closing CTA stay unnumbered.
- Whole-page chapter numbering is appropriate only for genuine chapter navigation, such as a long guide with a linked contents list, or an explicit user request. Decorative `01 / 02 / 03` section markers do not establish chapter navigation.
- Preserve existing meaningful ordered content. Multiple numbered groups are appropriate when the content already requires independent sequences or the user explicitly requests them; this limit governs newly introduced numbering.
- Statistics, dates, prices, and counts remain factual content. Treating a page as editorial or Swiss design does not itself justify section numbers.

## Implement in the project

Reuse components and tokens before adding styles. Keep page-specific composition local; introduce a shared utility or token only for a recurring gap in the existing system. Avoid arbitrary values that duplicate existing utilities and unnecessary client-side JavaScript.

Preserve semantic headings, logical DOM reading order, keyboard access, focus states, contrast, and reduced-motion behaviour. Keep media dimensions stable. In Astro, retain server-rendered components unless interactivity requires a client component.

Read [grid-and-typography.md](references/grid-and-typography.md) for detailed alignment, type, or mobile composition decisions. On narrow screens, adjust hierarchy, proportions, and media emphasis so the visual idea survives.

## Verify and finish

Run the relevant validation commands already used by the project. When browser tooling is available, inspect the running page at desktop and narrow widths, using screenshots for internal review when useful. Check:

- the opening viewport communicates the main value and next action;
- alignment, text measure, wrapping, and media crops work at both widths;
- section pacing varies where useful while preserving a coherent page;
- there is no horizontal overflow, media-induced layout shift, or broken interaction;
- keyboard focus remains visible and reading order remains logical;
- every added numbered group meets the meaning test and default limit above.

Fix the issues observed. Read [anti-patterns.md](references/anti-patterns.md) if the result feels generic, repetitive, or merely cosmetic. If visual inspection is unavailable, report that limit instead of claiming a visual pass.

Finish with the implemented direction, main files changed, validation performed, and a useful preview route or command. Mention any meaningful shared token added and any unresolved limitation. The deliverable is the working page unless the user requested another format.
