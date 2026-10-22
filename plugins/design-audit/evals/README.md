# design-audit evals

Each case copies `_fixture/` (a cluttered pricing page, a clean signup page, and a screenshot of the signup page) into the eval workspace through its `scaffold.sh`. The skill only reports, so every positive case allows Edit and Write and fails if either is used.

| Case | Checks |
| --- | --- |
| `pricing-page-code` | Ranked findings on `messy-pricing.html`: measured 1.9:1 price-label contrast, competing CTAs, nested boxes, removed focus outline, missing viewport, all 12 Gestalt principles; page unchanged |
| `signup-screenshot` | Gestalt analysis of `clean-signup.png`: no High findings on a good page, spacing called a visual estimate, Common Fate not assessed |
| `neg-restyle-request` | A restyle-in-place request does not trigger the skill |

Run from the repository root (`--scaffold` runs the case's own `scaffold.sh`):

```
claude plugin eval plugins/design-audit --scaffold --allow-tools Bash Edit Write --judge-model sonnet
```

Add `--ablation none` to skip the no-plugin baseline arm.

On 2026-10-22, at three runs per case, every case passed 3 of 3 with the plugin. A full run including the baseline arm costs about $5.
