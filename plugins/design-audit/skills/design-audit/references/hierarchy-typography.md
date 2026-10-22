# Visual hierarchy and typography: checks

Hierarchy is the order in which the eye takes things in. Typography carries most of the content, so it does most of the hierarchy work. Good hierarchy means a user can tell what matters most within a second or two and can scan the rest without reading every word.

## Hierarchy
- **One clear entry point per view.** There should be a single most-prominent element (usually the headline or primary action). Two or three equally loud elements means no entry point.
- **Three to four levels are enough.** For example: primary (headline, main CTA), secondary (section titles), body, and supporting (captions, meta). More levels than that and the differences become too subtle to see.
- **Primary action stands out.** The main call to action should be the most prominent interactive element. Secondary actions should be visibly quieter (outline or text style), not a second filled button of equal weight.
- **Emphasis is scarce.** Bold, colour, uppercase and size used everywhere stop meaning anything. Count how many different things are emphasised in one view.

*Detect:* blur test on the screenshot. Rank the top five elements by visual weight and compare that ranking with their actual importance.

## Type scale
- **Clear size steps.** Adjacent levels should differ noticeably. A ratio of about 1.2–1.333 between steps is common; differences of 1–2px between levels are invisible and look like mistakes.
- **Few sizes.** Typically 4–7 distinct font sizes across a whole page. `measure.js` `fontSizes` lists every size in use with counts; many sizes used only once or twice usually means an inconsistent scale.
- **Body text size.** At least 16px on the web for body copy (14px is acceptable for dense UI like tables). Smaller than 12px is hard to read and should be limited to non-essential captions.
- **Weight contrast.** Headings rely on size *and* weight. Too many weights (for example, 300, 400, 500, 600 and 700 all on one page) muddy the hierarchy. Two or three weights is usually plenty.

## Readability
- **Line length:** about 45–75 characters per line for body text. Full-width paragraphs on a wide screen are tiring to read. Fix with `max-width: 65ch` or similar.
- **Line height:** about 1.4–1.6 for body text, tighter (1.1–1.3) for large headings.
- **Alignment:** left-aligned body text (in left-to-right languages). Centred text works for short headings and single lines, but centred paragraphs are hard to scan because every line starts somewhere new (a Continuity problem).
- **Typefaces:** one or two families is usually enough. Each additional family needs a clear job.
- **All caps:** fine for short labels with some letter-spacing, but hard to read for sentences.

## Common fixes
- Enlarge or embolden the one primary element and quieten the rest.
- Collapse near-duplicate sizes onto a defined scale (for example 12 / 14 / 16 / 20 / 24 / 32 / 40).
- Constrain paragraph width; left-align body copy.
- Turn secondary buttons into outline or text buttons.
