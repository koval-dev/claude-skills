---
name: art-directed-web-design
description: Redesigns an existing web page in place as an art-directed, typography-led, CSS Grid editorial composition, with no mockups or design options. Use for restyle, redesign, visual polish, layout recomposition, or "looks plain, generic, or unfinished" requests on a page that already has semantic sections and real content (Astro, HTML, JSX/TSX, Vue, Svelte, Tailwind). Reuses the project's existing tokens, components, and accessibility. Prefer frontend-design for greenfield UI or choosing an aesthetic from scratch, and fix-mobile-ux for mobile-only usability, touch targets, and native feel.
argument-hint: [page-file-or-route]
metadata:
  last-reviewed: "2026-10-02"
  reviewed-against: "Claude Code 2.1.285; code.claude.com/docs/en/skills"
---

# Art-Directed Web Design

Turn a working semantic page into an intentional visual composition. Treat the existing project as the medium: inspect its tokens, utilities, components, content, and assets, choose the strongest suitable design direction internally, and implement it.

When invoked with `/art-directed-web-design $ARGUMENTS`, treat `$ARGUMENTS` as the target page file, component, or route. If no argument is supplied, infer the target from the current request and files already under discussion.

## Operating mode

- Work on the existing page in place.
- Make the design decision internally. Do not stop to present multiple concepts unless the user asks.
- Implement the strongest direction directly.
- Do not generate mockups or screenshots as the deliverable.
- Leave the page running correctly and ready for the user to inspect.
- Preserve real content unless a small structural edit materially improves hierarchy.

## Workflow

### 1. Read the page before styling

Inspect:

- the target page and its semantic section structure;
- `global.css` and other global styles;
- Tailwind theme variables and `@theme` declarations, if the project uses Tailwind, and other project utilities;
- existing typography, container, spacing, colour, radius, border, and layout conventions;
- shared components that can be reused;
- nearby pages that represent the current brand;
- available image, illustration, icon, and video assets relevant to the page.

Do not create a parallel design system. Treat existing tokens and utilities as the working palette.

### 2. Identify the page's visual idea

Before editing code, determine internally:

- the primary user goal;
- the content that deserves the greatest visual weight;
- the page's dominant alignment anchors;
- the grid structure;
- the relationship between type, media, and whitespace;
- one repeated visual motif;
- how section pacing should change from top to bottom;
- how the composition should transform on narrow screens.

Choose one clear idea. Do not combine unrelated visual styles.

Read `references/design-direction.md` when choosing the direction.

### 3. Recompose instead of decorating

The semantic sections are not a fixed visual template. Improve their presentation through composition.

Permitted actions include:

- grouping closely related sections;
- introducing supporting side columns;
- varying text measure and section width;
- creating selective full-bleed regions;
- using controlled asymmetry;
- adding section labels, numbers, rules, captions, or metadata;
- placing media and text in a deliberate relationship;
- changing visual order without damaging DOM reading order;
- using overlap or offset placement when robust and restrained;
- alternating dense and open sections to create rhythm;
- using sticky positioning only where it improves comprehension.

Do not give every section the same container, padding, heading placement, and column pattern.

### 4. Use typography as composition

Use existing typography utilities creatively rather than replacing them with arbitrary values.

Control:

- scale contrast;
- line length;
- line breaks;
- alignment;
- leading and paragraph rhythm;
- heading-to-body relationships;
- labels, captions, metadata, and pull quotes;
- relationships between typography and nearby media.

Prefer a few strong typographic relationships over many slightly different styles.

### 5. Build an explicit grid

Use CSS Grid for page-level and two-dimensional composition. Use Flexbox for one-dimensional alignment.

Define a coherent grid, commonly 6, 8, or 12 columns, with recognizable anchors across sections. Sections may span different columns, but their edges should relate to the same underlying system.

On mobile, redesign the hierarchy rather than mechanically stacking every desktop column.

Read `references/grid-and-typography.md` for the composition rules.

### 6. Implement with project-native code

- Reuse project components and utilities when they serve the concept.
- Prefer semantic project classes over long strings of arbitrary Tailwind values.
- Add a new global utility or token only when it is reusable and the existing system cannot express the design cleanly.
- Keep page-specific composition local to the page or component when it is not reusable.
- Preserve semantic HTML, keyboard access, focus states, reduced-motion preferences, contrast, and logical reading order.
- Avoid unnecessary client-side JavaScript.
- In Astro, keep components server-rendered unless interactivity requires otherwise.

### 7. Check the result in the running site

Run the normal local development or validation commands available in the project. Open the resulting page when browser tooling is available and inspect the actual result at desktop and narrow widths.

Fix visible problems directly, then leave the working implementation for the user to review.

At minimum, check:

- no overflow or broken wrapping;
- useful hierarchy in the opening viewport;
- varied but coherent section silhouettes;
- visible grid alignment;
- readable text measure;
- intentional mobile hierarchy;
- no missing focus or hover states;
- no layout shift caused by unsized media;
- no generic generated-UI patterns.

## Quality bar

A redesign is incomplete when the new page has nearly the same silhouette as the original and only adds spacing, colours, cards, or larger headings.

Reject these defaults unless the content clearly calls for them:

- a card around every content item;
- repeated rounded rectangles;
- decorative gradients or blobs without a concept;
- a generic three-column feature row;
- identical vertical padding on every section;
- alternating white and pale-grey bands as the main design idea;
- centred headings and body text across most sections;
- arbitrary shadows;
- icons added merely to fill space;
- huge display text with weak supporting hierarchy;
- desktop columns simply stacked on mobile;
- one-off arbitrary Tailwind values that duplicate existing utilities.

Read `references/anti-patterns.md` when the first implementation feels generic or cosmetic.

## Completion response

Give the user a short summary containing:

- the design direction implemented;
- the main files changed;
- any meaningful new reusable utility or token added;
- the command or route needed to view the page, when useful.
