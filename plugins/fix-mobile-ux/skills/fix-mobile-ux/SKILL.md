---
name: fix-mobile-ux
description: Audits and repairs a defined web UI scope for mobile usability and a credible iOS and Android native feel. Use when a route, component, folder, screen, or user flow needs responsive layout fixes, safe-area handling, touch targets, mobile navigation, sheets and dialogs, keyboard behavior, interaction states, accessibility, or mobile polish. It inspects the existing design system, changes the code, and verifies the result without redesigning unrelated areas.
argument-hint: [file-route-component-or-flow]
---

# Fix Mobile UX

## Contract

Treat `$ARGUMENTS` as the requested scope and any focus notes.

Accepted scope forms:
- File or directory: `src/pages/checkout` or `src/components/MobileNav.tsx`
- Route or screen: `/account/settings` or `checkout screen`
- User flow: `sign-up -> verification -> profile`
- Feature: `mobile filters on search results`

Default to **fix mode**: audit, edit the code, verify, and report. Support these explicit modifiers:
- `audit-only`: inspect and report without editing.
- `plan-only`: produce a prioritized implementation plan without editing.
- `strict-scope`: do not edit files outside the named scope.

If no modifier is present, do not stop at recommendations when code access exists.

The expected output is:
1. Working code changes inside the requested scope.
2. Validation through the project's existing checks and, when available, a running browser.
3. A concise report naming changes, validation, files touched, and remaining risks.

No external connector is required. Use repository files, project scripts, and browser or test tooling already available in the environment.

## Invocation examples

```text
/fix-mobile-ux src/pages/checkout
/fix-mobile-ux route /account/settings; focus: keyboard, sticky actions, safe areas
/fix-mobile-ux flow: sign-up -> verification -> profile
/fix-mobile-ux audit-only src/components/MobileNav.tsx
/fix-mobile-ux strict-scope apps/web/src/routes/search
```

When `$ARGUMENTS` is empty, use the target named in the current request. If no target can be inferred, ask for one route, component, directory, screen, or flow. Never turn an unclear request into a repository-wide redesign.

## Required workflow

Track this sequence and complete it in order:

1. Define the boundary.
2. Inspect the current implementation and design conventions.
3. Establish a mobile baseline.
4. Rank defects by user impact.
5. Apply focused fixes.
6. Verify behavior, layout, accessibility, and code quality.
7. Review the final diff and report.

### 1. Define the boundary

- Parse `$ARGUMENTS` into scope, mode, focus, and constraints.
- Treat the named scope as a hard boundary.
- Read project instructions such as `CLAUDE.md`, package scripts, local conventions, and relevant design-system files.
- Follow dependencies only far enough to understand and repair the scoped UI.
- Edit a shared primitive outside the scope only when the scoped fix cannot be made safely without it. Check affected call sites and name the wider impact in the final report.
- In `strict-scope` mode, do not edit outside the boundary. Report the blocking shared change instead.

### 2. Inspect before editing

- Identify the framework, styling method, component library, tokens, routing, state management, and test setup.
- Find the source of truth for spacing, typography, colors, radii, shadows, motion, breakpoints, and z-index values.
- Reuse existing components and tokens. Do not create a competing mini design system.
- Map the primary user task, primary action, navigation path, scroll containers, overlays, fixed elements, and form behavior.
- Look for existing mobile-specific rules before adding new ones.
- Record the baseline with screenshots or notes when a browser is available.

### 3. Audit against the mobile quality bar

Read [references/platform-criteria.md](references/platform-criteria.md) before ranking issues.

Inspect at least these areas when they exist in scope:
- Content fit, reflow, safe areas, browser chrome, and landscape behavior.
- Touch targets, target spacing, pressed states, focus states, and disabled states.
- Primary-action placement, thumb reach, navigation clarity, and browser history.
- Forms, autofill, validation, virtual keyboard behavior, and sticky actions.
- Bottom sheets, dialogs, menus, drawers, focus management, and scroll locking.
- Loading, empty, error, offline, success, and long-content states.
- Screen-reader names, focus order, contrast, text resizing, and reduced motion.
- Performance risks such as layout shifts, heavy effects, oversized assets, or animation jank.

Rank findings:
- **P0 — blocked:** A core task cannot be completed, content or actions are hidden, or input is trapped.
- **P1 — serious:** High-friction usability, accessibility, navigation, keyboard, or target-size defect.
- **P2 — quality:** The UI works but feels awkward, inconsistent, or unlike a polished mobile product.
- **P3 — polish:** Minor spacing, alignment, motion, or visual-state refinement.

Fix P0 and P1 first. Fix P2 issues inside the requested scope. Apply P3 changes only when they do not broaden the task.

### 4. Apply focused fixes

- Preserve product behavior, data flow, URLs, analytics hooks, and desktop behavior unless the request says otherwise.
- Use semantic HTML and the project's established component patterns.
- Prefer CSS layout, logical properties, media or container queries, and capability queries over JavaScript layout branching.
- Keep brand styling consistent across platforms. Borrow native interaction expectations without copying an operating system skin.
- Make every interactive control usable by touch, keyboard, pointer, and assistive technology.
- Keep browser history and the Back action predictable.
- Add or update tests when the change affects logic, navigation, focus, or a recurring responsive rule.
- Make the smallest coherent change that solves the root cause. Do not hide broken layout with clipping or arbitrary offsets.

### 5. Verify the result

Read [references/verification.md](references/verification.md) before final verification.

- Use the project's package manager and existing scripts.
- Run the most relevant lint, typecheck, unit, integration, and build commands.
- Run the scoped UI in a browser when tooling permits.
- Check representative compact, tall, Android-like, iOS-like, and landscape viewports.
- Exercise the primary task from start to finish.
- Test focus, pressed, disabled, loading, validation, empty, error, long-content, and overlay states that exist in scope.
- Check virtual-keyboard risk, fixed or sticky UI, safe-area padding, scroll reach, and horizontal overflow.
- Review the final diff for unrelated edits, accidental token drift, duplicated CSS, and desktop regressions.
- Do not claim visual verification when no browser or screenshot path was available. State the limitation plainly.

### 6. Completion rule

The task is complete only when:
- All discovered P0 issues in scope are fixed or blocked by a named constraint.
- All discovered P1 issues in scope are fixed or documented with a concrete blocker.
- The primary mobile task can be completed at the tested viewports.
- Changed code passes the relevant available checks.
- The final diff stays within scope, apart from clearly named shared dependencies.

## Non-negotiable guardrails

- Do not redesign unrelated screens.
- Do not replace the existing design language with generic mobile styling.
- Do not make the Android version imitate iOS or the iOS version imitate Android.
- Do not use hover as the only signal or the only way to reveal an action.
- Do not remove focus outlines without an equally clear replacement.
- Do not disable page zoom or use `user-scalable=no`.
- Do not intercept browser Back without a strong product reason and a tested fallback.
- Do not rely on a fixed phone height or `100vh` alone for full-height mobile layouts.
- Do not use user-agent sniffing for layout when CSS capabilities or viewport features can solve it.
- Do not add a new UI framework, animation library, or testing package for a local repair unless the project already needs it and the benefit is clear.
- Do not change copy, business rules, or data models merely to make the layout easier.
- Do not conceal overflow to mask clipped content.
- Do not invent haptic feedback for the web. Use it only when the project already has a supported, optional implementation.

## Final report

Use this compact structure:

```text
Mobile UX fix complete

Scope: <route, component, directory, screen, or flow>
Mode: <fix | audit-only | plan-only>

Fixed:
- <user-visible fix and reason>

Validated:
- <viewport, browser, test, build, lint, or manual check>

Files changed:
- <path>

Remaining:
- <only unresolved blockers, risks, or unverified checks; write "None" when empty>
```

For `audit-only`, replace `Fixed` with `Findings` and group findings by P0 through P3. For `plan-only`, replace it with `Plan`, ordered by dependency and impact.

## Skill maintenance

Use [references/evals.json](references/evals.json) only when testing or revising this skill. Do not load it during ordinary mobile UI work.
