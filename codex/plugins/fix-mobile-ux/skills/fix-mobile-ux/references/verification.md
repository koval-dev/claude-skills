# Verification and evidence

Use existing package scripts and browser/test tools. Do not install a test stack merely for this checklist. If browser access is unavailable, run applicable code checks and report the missing live verification. An unavailable check is neither passed nor a reason to claim no problems exist.

## Responsive browser checks

For responsive changes, exercise at least narrow portrait (for example 320 × 568), short landscape (844 × 390), and desktop (1280 × 800). Add a typical taller phone or existing project profiles when useful. These are CSS viewports, not evidence of actual iOS or Android behavior.

At each affected breakpoint:

- Complete the primary task. Check horizontal overflow, text wrapping, last-item scroll reach, fixed/sticky overlap, and desktop behavior.
- Use touch-equivalent clicks and keyboard navigation. Check target sizes, names, focus visibility, and selected/disabled states.
- For forms, inspect labels and input attributes, enter values, trigger validation, and reach the submit action. Confirm the action belongs to the intended form.
- For overlays, open, operate, dismiss, reopen, and restore focus. Check Escape, explicit controls, containment when modal, and background scrolling. Test Back and subsequent route departure where required.
- Exercise relevant long-content, loading, error, and reduced-motion states, using existing fixtures or test patterns.

Screenshots support layout review; they do not prove focus or history behavior. CSS keywords and a `<dialog>` element do not prove runtime interaction. Prefer the existing runtime tests for changed logic.

## Device checks

Use an actual device or suitable simulator when available to check virtual-keyboard occlusion, native autofill, moving browser chrome, edge gestures, safe-area values, and orientation. Desktop viewport resizing and browser engines alone do not reproduce those conditions. Report unavailable device checks explicitly, including after passing responsive tests.

## Code and scope

Run the relevant available lint, build, type, and interaction checks, choosing those affected by the change. Inspect shared callers when a dependency changed. Review the final diff for unrelated edits and token drift. In strict-scope, name the shared repair required without editing it. For audit-only and plan-only, keep project files unchanged and report the requested deliverable without a fix-completion claim.

## Report

Name actual commands, browsers, viewports, outcomes, files touched, and remaining blockers. Separate observed results from inferred risks. A source inspection can establish that zoom is enabled or a label exists; it cannot establish that an iPhone keyboard leaves the action visible.
