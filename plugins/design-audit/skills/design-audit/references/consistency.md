# Consistency: checks

Consistency is Similarity at the scale of a whole product: same thing, same look, same behaviour, everywhere. It lowers what users have to learn and makes a product feel trustworthy. Accidental variation is one of the most common findings in real audits because it builds up gradually over time.

## Components
- **Buttons:** count the variants. Typically you need a primary, a secondary, a tertiary or text button, and a destructive variant. More than that, or near-duplicates differing by a few pixels of padding or radius, signals drift. `measure.js` `buttonStyles` groups buttons and links styled as buttons by their visual signature.
- **Form fields:** same height, border, radius, label position and error style across forms.
- **Cards and containers:** same radius, shadow, padding and border treatment for the same kind of content.
- **Corner radius:** pick a few values (for example 4 / 8 / 16 / full) and use them consistently.
- **Shadows and elevation:** a few defined levels, used to mean the same thing (for example raised card vs. floating menu).

## Visual language
- **Icons:** one style (outline *or* filled), one stroke weight, and a consistent size grid. Mixing icon sets is very noticeable.
- **Imagery:** consistent photo treatment, illustration style and aspect ratios.
- **Colour tokens:** near-duplicate colours (`#333`, `#343434`, `#2f2f2f`) used for the same role should collapse into one token.

## Content and tone
- Consistent capitalisation (Title Case vs. Sentence case) for buttons, headings and nav.
- Consistent terms: don't call the same thing "Cart", "Basket" and "Bag".
- Consistent date, number and currency formats.

## Detect
- *Screenshot:* list each component type and compare the instances side by side.
- *Code:* look for hard-coded values instead of tokens or variables, duplicated component implementations, and inline styles overriding the system.

## Fix
Name the canonical version of each component or token, list the deviating instances, and suggest consolidating them. If the project has a design system or token file, point to the token that should be used.
