# Layout and spacing: checks

Layout is where Proximity, Continuity and Prägnanz become measurable. Spacing that comes from a system reads as calm and intentional; improvised spacing reads as messy even when the viewer can't say why.

## Spacing scale
- **Use a scale.** Spacing values should come from a small set, often multiples of 4 or 8 (4, 8, 12, 16, 24, 32, 48, 64). `measure.js` `spacingValues` lists every margin, padding and gap value in use. Values like 13px, 17px or 22px scattered among them indicate no system.
- **Inside vs. between.** Spacing inside a component is smaller than spacing between components, which is smaller than spacing between sections. Roughly double at each level. This is Proximity made concrete.
- **Heading spacing.** A heading should sit closer to the content it introduces than to the content above it.

## Grid and alignment
- **Shared edges.** Content should align to a small number of vertical lines. `measure.js` `leftEdges` groups element left edges. Many edges within a few pixels of each other means near-miss alignment, which looks like a mistake.
- **Consistent container widths.** Sections whose content width changes from one to the next (1100px, then 1180px, then 960px) break the column the eye follows.
- **Consistent internal alignment** in repeated items: in a row of cards, titles, prices and buttons should line up across all cards, even when content length differs. Pinning buttons to the bottom of each card is a common fix.

## White space
- **Room to breathe.** Crowded layouts make grouping impossible to see. The fix is usually *removing* elements or *adding* space, not adding dividers.
- **Uneven distribution.** A large empty area in one place and cramping in another suggests the layout wasn't designed as a whole.
- **Margins.** Content shouldn't touch viewport edges. On mobile, at least 16px of side padding.

## Responsive behaviour (live pages and code)
- Check at a phone width (about 375–400px) as well as desktop if you can render the page. `audit_url.mjs --mobile` captures a phone-sized screenshot.
- **From code, even without rendering:** check the `<head>` for `<meta name="viewport" content="width=device-width, initial-scale=1">`. Without it, phones lay the page out about 980px wide and shrink it, so text and tap targets become tiny. Report it as at least Medium. Also look for fixed pixel widths on containers and for multi-column flex or grid layouts with no `@media` query to stack them.
- Look for horizontal scrolling, overlapping elements, text that doesn't wrap, and multi-column layouts that don't stack.
- Hierarchy should survive the change: the primary action is still prominent on mobile.

## Common fixes
- Define and apply a spacing scale; replace one-off values.
- Tighten inside groups and widen between groups.
- Align to a 12-column (or simpler) grid with a single content max-width.
- Pin repeated-item actions to a common baseline.
