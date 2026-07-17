# Anti-Patterns and Corrections

## Card grid reflex

**Symptom:** Every benefit, statistic, quote, or link becomes a rounded card.

**Correct by:** Using typography, rules, shared backgrounds, column spans, or sequential numbering. Reserve cards for truly discrete interactive objects.

## Cosmetic redesign

**Symptom:** The DOM silhouette is unchanged; only padding, colour, radius, and heading size changed.

**Correct by:** Revisit section relationships, column spans, media placement, text measure, visual order, and transitions.

## Repeated section template

**Symptom:** Every section has eyebrow, heading, paragraph, then three columns.

**Correct by:** Assign each section a role in the page narrative. Combine minor sections and let important sections use different proportions.

## Arbitrary-value drift

**Symptom:** Many `text-[...]`, `mt-[...]`, custom hex values, and nearly duplicated dimensions appear.

**Correct by:** Map the design back to existing project tokens. Add one reusable token only when a recurring gap is real.

## Meaningless asymmetry

**Symptom:** Elements are offset at random and alignment feels accidental.

**Correct by:** Tie offsets to grid columns, baselines, media edges, or a repeated motif.

## Weak mobile result

**Symptom:** Desktop columns become an undifferentiated vertical list.

**Correct by:** Restore hierarchy through ordering, compact labels, selective dividers, scale changes, and varied section density.

## Excessive visual effects

**Symptom:** Gradients, shadows, blur, animations, and overlays compensate for weak composition.

**Correct by:** Remove effects and strengthen scale, alignment, contrast, and whitespace first.

## Hero without purpose

**Symptom:** Very large text, vague supporting copy, and a generic image consume the opening viewport.

**Correct by:** Make the hero communicate the page's primary value, key context, and next action through a deliberate grid relationship.
