# Colour and accessibility: checks

Colour creates emphasis and grouping (it's one of the strongest Similarity cues), but it also decides whether people can read the page at all. Accessibility findings that block reading or use are always **High** severity.

## Contrast (WCAG 2.x, level AA)
| Content | Minimum contrast ratio |
|---|---|
| Body text (under 24px regular, or under about 18.66px bold) | **4.5 : 1** |
| Large text (24px+ regular, or about 18.66px+ bold) | **3 : 1** |
| UI components and meaningful graphics (input borders, icons, focus rings, chart lines) | **3 : 1** against adjacent colours |
| Disabled controls, pure decoration, logos | No requirement |

*Detect:*
- From code or a live page, use `measure.js` `contrastFailures`. It computes the ratio for each visible text element against its nearest solid background. It can't see through background images or gradients; check those visually.
- For a single pair, run `python3 scripts/contrast.py <fg> <bg>`.
- From a screenshot alone, estimate. Grey-on-grey, light text on pastel, and text on photos are the usual failures. Say "appears to fall below 4.5:1" unless you could read the exact colours.

Placeholder text in inputs is a frequent failure, and so is light grey "secondary" text.

## Colour as the only signal
- Status, errors, required fields, chart series or links must not rely on colour alone. About 1 in 12 men has some colour vision deficiency.
- Links in body text need an underline or another non-colour cue, unless their contrast against the surrounding text is at least 3:1.
- Errors need an icon or text, not just a red border.

## Palette use
- **Dominance:** one dominant neutral, one or two supporting colours, and one accent reserved for the primary action and key highlights. An accent used for decoration as well loses its pull.
- **Meaning stays fixed:** if red means "error", don't use it for a promotional badge. If the brand colour means "clickable", don't use it on non-interactive headings.
- **Count the colours:** `measure.js` `colors` lists text and background colours with counts. Many near-identical greys or blues usually means there is no defined palette (see consistency.md).

## Other accessibility checks visible in a design
- **Focus states:** a visible focus indicator on every interactive element. In code, look for `outline: none` or `outline: 0` without a replacement style.
- **Tap targets:** at least 24×24 CSS px (WCAG 2.2 AA), and preferably 44×44 on touch devices. `measure.js` `smallTargets` lists offenders.
- **Text in images:** text baked into images can't be resized, translated or read by screen readers.
- **Form labels:** visible labels, not placeholder-only labels that disappear on input.
- **Motion:** large animations should respect `prefers-reduced-motion`.
- **Heading structure** (code only): headings in a logical order (`h1` → `h2` → `h3`), with heading levels chosen for structure rather than for their default size.
- **Alt text** (code only): meaningful images have `alt` text, and decorative images use `alt=""`.

Keep these findings visual and design-level. This is not a full accessibility conformance audit, and the report should say so if someone needs one.
