# Navigation, controls, and overlays

Keep destinations and actions recognizable. Reuse existing navigation rather than introducing bottom tabs for every mobile page. Give controls accessible names, selected states when relevant, visible focus, and immediate pressed feedback. Make hover-revealed actions available to touch and keyboard users.

Aim for 44–48 CSS px touch targets when density permits. The [WCAG 2.2 minimum target criterion](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) is 24 CSS px with defined exceptions; it is a floor, not a default mobile size. Check target spacing and the actual clickable area.

## Modal and non-modal surfaces

Inspect existing accessible components first. A working dialog or popover need not become a bottom sheet to feel mobile. Preserve non-modal interactions when they do not need modal focus containment.

For modal surfaces, verify an accessible title, deliberate initial focus, containment, explicit close control, Escape dismissal where appropriate, background scroll behavior, and focus restoration to the opener (or a sensible successor if removed). Keep content and actions reachable on short screens. A `<dialog>` tag alone proves none of the runtime behavior: check that it is opened modally and can actually close. See [dialog behavior](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog).

Do not rely on drag, outside click, or browser-specific light-dismiss attributes as the sole dismissal path. Preserve entered state on dismissal when the product requires it.

## Back and router behavior

Understand the router and existing history state before changing them. Browser Back should leave a normal page or follow its existing route history. Do not add a synthetic history entry to every page or every modal.

When the scoped interaction specifically requires Back to dismiss an open surface, integrate with the router's established mechanism. Without a router, a local history entry may be appropriate if it is owned by the surface and consumed exactly once. Preserve unrelated history state. Explicit close, Apply, and Escape must also clean up that entry so they do not leave an extra Back step. A `popstate` handler must not re-push the entry unconditionally.

Test Back while open, Back again after closing, and Back after each explicit dismissal. Also test repeated opening/closing and forward history when affected. Verify focus returns and navigation can leave the page. Respect the user's scoped behavior instead of universalizing a fixture's Back requirement.
