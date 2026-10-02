# Verification Guide

Contents: 1 Choose the available path · 2 Viewport matrix · 3 Primary-task walkthrough · 4 Input and keyboard · 5 Touch · 6 Responsive and accessibility states · 7 Code validation · 8 Final diff review · 9 Completion threshold

Use the strongest verification path the repository already supports. Do not install a browser stack or test framework merely to satisfy this checklist.

## 1. Choose the available path

1. Read package scripts and project documentation.
2. Use the project's package manager lockfile.
3. Reuse existing local or containerized development commands.
4. Reuse Playwright, Cypress, Storybook, browser MCP, device emulation, screenshot tooling, visual regression, or accessibility tooling when already configured.
5. If no browser path exists, perform code-level and automated checks, then state that live visual verification was unavailable.

## 2. Representative viewport matrix

Treat these as CSS viewport profiles, not claims of exact hardware emulation:

| Profile | Width x height | Main risk |
|---|---:|---|
| Compact short | 320 x 568 | Compression, short-screen actions, overflow |
| Compact tall | 375 x 812 | Common narrow mobile flow |
| iOS-like modern | 390 x 844 | Safe areas, dynamic viewport, bottom actions |
| Android-like modern | 412 x 915 | Wider compact layout, 48 px target density |
| Landscape phone | 844 x 390 | Height pressure, keyboard and persistent chrome |

Use actual configured device profiles when the test suite already defines them. Add tablet or foldable checks only when the scoped changes affect larger breakpoints.

At each relevant profile, check:
- No page-level horizontal scrolling.
- Primary content and primary action are visible or reachable.
- Fixed and sticky UI does not cover content.
- Bottom and top safe areas are respected.
- Navigation remains clear and operable.
- Text wraps without clipping.
- Images and media keep their aspect ratio.
- Overlays fit the viewport and can be dismissed.
- The final scroll position reaches the last item.
- Orientation changes do not trap or lose state.

## 3. Primary-task walkthrough

Run the user task represented by the scope from entry to completion.

Check:
- Entry route and deep link.
- Forward navigation and browser Back.
- Form entry, autofill, validation, submission, and retry.
- Loading, empty, error, offline, success, and long-content states that can occur.
- Repeated taps and duplicate-submission protection.
- Modal, sheet, menu, drawer, and nested-route dismissal.
- Focus restoration after overlays close.

## 4. Input and keyboard checks

- Navigate all controls by keyboard.
- Confirm focus is visible and follows visual order.
- Open each modal surface with keyboard and close it with Escape when appropriate.
- Check the focused field is not hidden by sticky UI or the expected virtual-keyboard region.
- Check `inputmode`, `type`, `autocomplete`, and accessible labels.
- Check one-time codes, password managers, paste, and native input controls when relevant.
- Confirm icon-only controls have useful accessible names.

## 5. Touch checks

- Measure or inspect every interactive target in the scoped view.
- Aim for 44 by 44 CSS px; use 48 by 48 CSS px for frequent or icon-only actions when practical.
- Check spacing between small adjacent targets.
- Confirm the full intended area is clickable, not merely the icon glyph.
- Confirm pressed feedback appears immediately.
- Confirm gestures have a visible tap alternative.

## 6. Responsive and accessibility states

Check the states the component can enter:
- Default.
- Focus-visible.
- Pressed or active.
- Selected.
- Disabled.
- Loading.
- Validation error.
- Empty.
- Network or server error.
- Long translated text or user-generated content.
- Increased text size or browser zoom.
- Reduced motion.
- Dark mode when supported.
- High contrast or forced colors when the project supports them.

## 7. Code validation

Run the relevant subset of:
- Formatter or format check.
- Linter.
- Type checker.
- Unit tests.
- Component tests.
- Integration or end-to-end tests.
- Production build.
- Existing accessibility or visual-regression checks.

Do not run destructive database, deployment, publishing, or production commands as part of a UI verification pass.

When the full suite is too broad, run the closest scoped checks and name what was not run.

## 8. Final diff review

Before reporting completion, inspect the diff for:
- Files outside the stated scope.
- Unrelated formatting churn.
- New hardcoded colors, spacing, radii, shadows, z-indexes, or breakpoints that should use tokens.
- Duplicate responsive rules.
- `outline: none` without a replacement.
- Restricted zoom settings.
- `100vh` used without a mobile-safe strategy.
- Fixed bottom elements without safe-area and content-offset handling.
- `overflow: hidden` used to conceal a root layout problem.
- Divs or spans acting as buttons.
- User-agent layout branches.
- Desktop or tablet regressions from mobile overrides.
- New dependencies that are not justified.

## 9. Completion threshold

Pass the work when:
- The primary task works at every relevant tested viewport.
- P0 findings are gone.
- P1 findings are gone or have concrete external blockers.
- Tests and build checks affected by the change pass.
- No new horizontal overflow, focus trap, safe-area collision, or desktop regression appears.
- The report distinguishes verified behavior from assumptions.
