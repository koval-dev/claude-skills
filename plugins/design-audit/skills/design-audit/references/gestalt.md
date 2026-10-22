# Gestalt principles: checks

Gestalt ("form" or "pattern") psychology describes how the brain turns separate marks into meaningful wholes. The whole is perceived as something other than the sum of its parts. In UI, these principles decide what users think belongs together, where they look, and in what order they read.

Each principle below has: a one-line explanation you can reuse in the report, what to look for, how to detect problems from a screenshot and from code or measurements, the typical fix, and the over-use trap. The over-use trap matters as much as the check: a principle applied too heavily is a problem too.

## Contents
1. Similarity
2. Proximity
3. Continuity
4. Closure
5. Figure/Ground
6. Symmetry and Order (Prägnanz)
7. Common Fate
8. Common Region
9. Uniform Connectedness
10. Emergence
11. Invariance
12. Multistability
13. How the principles interact

---

## 1. Similarity
**Explain as:** Things that look alike are seen as related, and things that look different are seen as different.

**Look for**
- Items of equal importance or function that look different (three nav links in two styles; a set of cards where one has a different radius for no reason).
- Items with *different* functions that look identical. The classic case is a link styled like plain body text, or a heading styled like a button.
- One attribute changed to signal a difference (the "featured" plan uses the accent colour). This is good use; note it as a strength.

**Detect**
- *Screenshot:* group elements by role (buttons, links, card titles, labels) and compare colour, size, weight, shape and radius within each group.
- *Code/measurements:* count the distinct style combinations per role. Several `button` variants with nearly identical but different padding or radius usually means accidental variation. In `measure.js` output, `buttonStyles` and `fontSizes` show this.

**Fix:** make same-role elements identical. Change exactly one attribute (colour, weight or size) to mark the one that should stand out.

**Over-use trap:** if everything looks the same, nothing stands out and the hierarchy flattens. Similarity has to be balanced by deliberate contrast.

## 2. Proximity
**Explain as:** Things close together are seen as a group, and space separates groups.

**Look for**
- Labels equidistant between two fields, so it's unclear which one they belong to.
- Headings closer to the section *above* than to the content they introduce.
- Uniform spacing everywhere, so nothing reads as a group.
- Groups separated by lines or boxes when space alone would do it.

**Detect**
- *Screenshot:* for each visual group, compare the space *inside* the group to the space *between* groups.
- *Code/measurements:* compare margin/gap values. **Rule of thumb:** the gap between groups should be at least roughly twice the largest gap inside a group. A heading's space above should be clearly larger than its space below.

**Fix:** tighten spacing inside groups and open it up between them, before reaching for borders or boxes.

**Over-use trap:** inconsistent, improvised spacing blurs relationships even when each individual gap looks fine.

## 3. Continuity
**Explain as:** The eye follows lines, edges and paths, and prefers to keep going in the same direction.

**Look for**
- A clear reading path through the page (headline → supporting image or text → call to action) or the lack of one.
- Elements that almost share an edge but are a few pixels off. This breaks the line the eye wants to follow.
- Rows of cards or steps whose content doesn't line up across items (titles at different heights).
- A strong directional element (arrow, a person's gaze, a diagonal) pointing *away* from the important content.

**Detect**
- *Screenshot:* trace the left edges of text blocks. Count distinct starting positions; many near-identical ones signal misalignment.
- *Code/measurements:* `measure.js` reports `leftEdges` with counts. Edges within 1–6px of each other are almost certainly meant to be the same.

**Fix:** align to a small number of shared edges (a grid). Arrange the main path so it ends on the primary action.

**Over-use trap:** a path that is too rigid or too long becomes monotonous. Continuity guides; it doesn't need to touch every element.

## 4. Closure
**Explain as:** The brain fills in gaps and completes incomplete shapes into a whole.

**Look for**
- Icons and logos built from partial shapes or negative space: do they still read?
- Cropped images or carousels where the partially visible next item signals "there's more". That's good use.
- Over-abstracted icons the user can't identify without the label.

**Detect:** this is mostly visual. Check icons at their actual rendered size. If an icon is ambiguous without its label, it fails closure *for this audience*.

**Fix:** simplify, but keep enough of the form to be recognisable. Pair ambiguous icons with text labels.

**Over-use trap:** too abstract, and users can't tell what they are seeing.

## 5. Figure/Ground
**Explain as:** We separate what we're looking at (the figure) from what's behind it (the ground). The design has to make that separation obvious.

**Look for**
- Text over busy photos or patterns.
- Low-contrast text or controls.
- Modals and overlays: is the background dimmed enough to step back?
- Several elements competing to be the focal point.

**Detect**
- *Screenshot:* is there an unambiguous focal element? Is text readable against its background everywhere?
- *Code/measurements:* use `contrastFailures` from `measure.js`, or `contrast.py` for specific pairs. For text on images, contrast can't be computed from CSS alone, so check the screenshot and look for an overlay or scrim.

**Fix:** strengthen contrast (colour, size, weight), add a scrim behind text on images, quieten the background, and reduce the number of elements competing for attention.

**Over-use trap:** if every element shouts for attention, nothing stands out from the background.

## 6. Symmetry and Order (Prägnanz)
**Explain as:** People interpret what they see in the simplest, most orderly way they can, so simple structures are understood fastest.

**Look for**
- A visible underlying grid, or its absence.
- Decorative elements that don't earn their place (extra borders, shadows, ornaments, gradients).
- Repeated content (features, plans, team members) laid out in a consistent repeating structure.

**Detect:** count the different column widths and container widths. Ask of each decorative element: "What does removing this lose?"

**Fix:** reduce to the simplest structure that works: a clear grid, a consistent repeating unit, and fewer decorative layers.

**Over-use trap:** perfect symmetry everywhere feels rigid and flat. Asymmetry used deliberately creates emphasis.

## 7. Common Fate
**Explain as:** Elements that move or point in the same direction are seen as one group.

**Look for**
- Animations: do items that belong together animate together, and do unrelated items stay still?
- Static implied motion: shared tilts, arrows, or a trail pointing the same way.
- Parallax or scroll effects that make unrelated elements appear grouped.

**Detect:** needs motion. From a static screenshot you can only judge implied direction. Mark the principle **not assessed** for motion unless you can see animation code (CSS `transition`/`animation`, JS animation libraries) or a recording.

**Fix:** animate grouped items with the same timing and direction; keep unrelated items independent.

**Over-use trap:** too much movement competes with the content, and unrelated elements that move together confuse users.

## 8. Common Region
**Explain as:** Elements inside the same boundary (a card, panel or coloured band) are seen as a group, even if they're not close together.

**Look for**
- Cards and panels that group related content: good use.
- Boxes inside boxes inside boxes ("card-ception").
- A boundary that cuts through a group, or a group split across two regions.

**Detect**
- *Screenshot:* count nesting levels of visible containers.
- *Code/measurements:* `measure.js` reports `maxBoxNesting`. More than two levels of visibly bordered or filled containers is usually clutter.

**Fix:** use one level of containers where possible. Replace inner borders with spacing or a subtle background tint.

**Over-use trap:** too many boxes clutter the hierarchy and make everything look equally important.

## 9. Uniform Connectedness
**Explain as:** Elements joined by a line, bracket or shared bar are seen as most strongly related. It beats proximity and similarity.

**Look for**
- Steppers, timelines, breadcrumbs and flow diagrams: do the connectors match the real sequence?
- Connectors that imply relationships that don't exist (for example, a divider that visually attaches a footer link to the wrong section).
- Places where a relationship *needs* a stronger cue than spacing gives (a total that summarises a list, or a tooltip pointing to its trigger).

**Detect:** mostly visual. Trace every line, arrow and bracket and check that what it connects really belongs together.

**Fix:** add a connector where a relationship is important and ambiguous. Remove decorative connectors that imply false links.

**Over-use trap:** needless connectors imply relationships that don't exist.

## 10. Emergence
**Explain as:** We recognise the overall shape first, before we read any of the parts.

**Look for:** this is the first-impression step in SKILL.md. Does the overall layout read at a glance? Is the big shape (hero, then content, then action) obvious when the page is blurred?

**Detect:** squint or blur test on the screenshot. Without a screenshot, sketch the block structure from the code (major containers and their order).

**Fix:** design the big structure first. Reduce the number of top-level blocks competing at the same visual weight.

**Over-use trap:** overly complex visuals delay recognition of the whole.

## 11. Invariance
**Explain as:** We recognise familiar objects even when they're scaled, recoloured or rotated, provided their core shape survives.

**Look for**
- The logo and icon set across sizes, colours and backgrounds (light and dark, favicon size, mobile header).
- Brand elements distorted too far (stretched logos, recoloured to the point of losing identity).

**Detect:** check the logo and icons at their smallest rendered size and on every background they appear on.

**Fix:** build marks around a strong core shape; provide approved variants (mono, reversed, small-size).

**Over-use trap:** drift too far from what people expect and recognition breaks.

## 12. Multistability
**Explain as:** An ambiguous image can flip between two readings, like the classic vase/faces. The brain sees one reading at a time.

**Look for**
- Deliberate double readings in logos or illustrations (a clever hidden shape). These can be a strength if the primary reading is still clear.
- *Accidental* ambiguity: is that element a button or a label? A tab or a heading? Is that shape the foreground or a hole?

**Detect:** ask what each interactive-looking element is. If you can argue for two answers, users will too.

**Fix:** remove accidental ambiguity with stronger cues (affordances, contrast, labels). Keep deliberate ambiguity only where the primary reading is unmistakable.

**Over-use trap:** ambiguity is rarely the goal in interface design.

---

## 13. How the principles interact

The principles rarely act alone. Check these combinations:

- **Competing cues.** Colour, spacing and alignment pull in different directions. Example: two cards share a colour (similarity says "group") but sit far apart (proximity says "separate"). Users resolve conflicts roughly in this order of strength: connectedness → common region → proximity → similarity. Make the cues agree.
- **Similarity + proximity working together.** Similarity gives repeated items their identity, and proximity shows what belongs together. When both agree, scanning is fast. This is a common strength worth naming.
- **Over-symmetry.** Balanced but flat: everything is equal, so there is no entry point. Introduce one deliberate point of emphasis.
- **Too much movement.** Common Fate overused. Animation competes with content.

Overall guidance: use a light touch. These principles should guide the eye, not decorate the page. Less is more.
