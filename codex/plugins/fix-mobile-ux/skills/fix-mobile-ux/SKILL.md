---
name: fix-mobile-ux
description: Repair mobile web usability in a route, component, or flow when phone layouts clip content, controls are hard to use, or navigation, overlays, and forms fail on small screens. Also supports scoped mobile audits and repair plans. Excludes purely visual desktop redesigns.
---

# Fix Mobile UX

Repair the requested mobile task while preserving the product's design language, business behavior, and desktop usability. Explicit user instructions take precedence over these defaults. No premium design skill or external connector is required.

## Establish scope and mode

Infer the target from the current request and established conversation context: a file, directory, route, screen, feature, or user flow. Resolve routes and components to their source files. If no target can be inferred, ask for one target and wait; do not start a repository-wide audit.

Default to **fix**: inspect, repair, verify, and report. Honor explicit modifiers:

- **audit-only:** inspect and deliver ranked findings without editing project files.
- **plan-only:** inspect and deliver actionable repair steps without editing project files.
- **strict-scope:** restrict edits to the named files or directory; it can accompany any mode. Inspect necessary shared dependencies, but report a required shared change rather than modifying it or working around it with a competing local primitive.

If audit-only and plan-only are both requested, provide findings followed by a plan without edits. In ordinary fix mode, change a shared dependency only when necessary for the scoped repair, after inspecting affected callers. Verify those callers and disclose the wider impact. Unrelated screens remain outside the task.

Example requests:

```text
Use $fix-mobile-ux on src/pages/checkout; focus on fields and the payment action.
Audit mobile usability of the booking form, audit-only.
Use $fix-mobile-ux plan-only for the search filters.
Use $fix-mobile-ux strict-scope on src/pages/dashboard.
```

## Inspect and rank

Read applicable project instructions, package scripts, the scoped sources, and their relevant dependencies. Identify existing tokens, accessible components, routing, state, and test conventions before choosing a repair. Map the primary task, scroll containers, fixed actions, inputs, and overlays. Capture baseline observations or screenshots when available.

Load only the references relevant to the affected controls:

- For reflow, fixed or sticky UI, orientation, viewport height, and safe areas, read [layout-and-safe-areas.md](references/layout-and-safe-areas.md).
- For labels, autofill, validation, submission, and keyboard reach, read [forms-and-keyboard.md](references/forms-and-keyboard.md).
- For touch targets, navigation, sheets, menus, focus, and Back, read [navigation-and-overlays.md](references/navigation-and-overlays.md).

Rank evidence-backed findings as **P0** (blocked core task), **P1** (serious usability or accessibility defect), **P2** (working but awkward or inconsistent), or **P3** (minor polish). Name the source and the user-visible consequence. Separate observed defects from device risks that have not been tested. Cover reachable loading, empty, error, disabled, and long-content states when they affect the scoped task.

In audit-only, finish with ranked findings, suggested remedies, and verification limitations. In plan-only, finish with prioritized steps naming files, dependencies, acceptance checks, and blockers. These modes are complete when that deliverable is ready; repaired code is not a condition of completion.

## Repair in fix mode

Fix P0 and P1 first; address P2 within the requested task and P3 only when it adds no scope. Solve the root cause with the smallest coherent change.

- Reuse the project's tokens and accessible components before introducing a dialog, sheet, bottom navigation, platform styling, or dependency. Choose interaction patterns from the existing product and task, not a preferred operating-system skin.
- Preserve URLs, data flow, copy, analytics hooks, and business rules unless the request calls for a change.
- Prefer semantic controls and responsive CSS to user-agent detection or scripted layout. Keep touch, keyboard, pointer, and assistive-technology access.
- Preserve zoom and visible focus. Do not conceal overflow to hide clipped controls, rely on hover alone, or assume a fixed phone height.
- Respect existing router and modal history. Add Back handling only when the scoped interaction needs it; never re-push history unconditionally to keep the user on a page.
- Use existing tooling. Add tests where changed navigation, focus, or submission logic needs regression coverage; avoid adding a framework for a local repair.

## Verify and report

Read [verification.md](references/verification.md) before verification. Run relevant existing checks and exercise the scoped task when browser tooling is available. Include narrow portrait, short landscape, and desktop widths for responsive changes; inspect shared callers when modified.

Review the diff against scope. Fix mode is complete when discovered P0/P1 defects are repaired or have concrete blockers, the primary task works in the tested conditions, and relevant available checks pass. If tooling or scope prevents that conclusion, report partial repairs and the blocker instead of claiming completion.

Report the scope and mode, user-visible changes or findings/plan, every changed file including tests and shared dependencies (none in read-only modes), checks actually run and their outcomes, and unresolved limitations. Distinguish responsive viewport tests from real-device keyboard, browser chrome, and safe-area tests. Never claim device or visual verification from code inspection alone.
