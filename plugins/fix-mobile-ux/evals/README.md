# fix-mobile-ux evals

Each case copies `_fixture/` (a small static shop with planted mobile defects) into the eval workspace through its `scaffold.sh`, so the run has real files to audit and fix. `about/index.html` is out of scope in every case and must come back unchanged.

| Case | Checks |
| --- | --- |
| `checkout-safe-area-and-keyboard` | Fix mode: safe-area pay bar, zoom unlocked, labels, autocomplete, scope kept |
| `mobile-navigation-and-back` | Fix mode: safe-area nav, no hover-only actions, Back closes the sheet without trapping |
| `audit-only-component` | Audit mode: ranked findings on `BookingForm.tsx`, no edits |
| `neg-desktop-restyle` | A desktop restyle request does not trigger the skill |

Run from the repository root (`--scaffold` runs the case's own `scaffold.sh`):

```
claude plugin eval plugins/fix-mobile-ux --scaffold --allow-tools Bash Edit Write --judge-model sonnet
```

Add `--ablation none` to skip the no-plugin baseline arm. A full run at three runs per case cost about $5 on 2026-10-02, with every case passing 3 of 3.
