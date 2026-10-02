# Mobile UX and Native-Feel Criteria

Contents: 1 Layout, viewport, and safe regions · 2 Touch targets · 3 Navigation and thumb reach · 4 Forms and the virtual keyboard · 5 Sheets, dialogs, menus · 6 Visual hierarchy and states · 7 Platform feel (iOS, Android) · 8 Accessibility · 9 Motion and performance · 10 Priority examples · Reference anchors

Use this file as a decision guide, not as a visual template. The goal is a polished mobile web product that respects iOS and Android expectations without pretending to be a native binary.

## 1. Layout, viewport, and safe regions

- The scoped UI must work at 320 CSS px wide without horizontal page scrolling, clipped controls, or unreadable compression.
- Use fluid layout rules. Avoid fixed widths and fixed device-height assumptions.
- Use `min-height: 100dvh` for full-height application shells; use `svh` for a height that must not change as browser chrome moves, and `lvh` for the largest. Keep a `100vh` fallback declaration only when the project supports browsers from before 2022. Do not rely on `100vh` alone.
- Use `viewport-fit=cover` only when the product intentionally draws edge to edge and the layout accounts for `env(safe-area-inset-top)`, `env(safe-area-inset-right)`, `env(safe-area-inset-bottom)`, and `env(safe-area-inset-left)` where needed. On iOS 26 Safari and Chrome 135+ on Android the browser bars are translucent or retract on scroll, so test fixed bottom UI both with and without `cover` before choosing.
- Add safe-area padding to fixed bottom navigation, sticky action bars, sheets, media controls, and full-screen overlays.
- Add content padding or scroll padding equal to the occupied height of fixed UI so the last item and focused controls remain reachable.
- Account for notches, rounded corners, home indicators, gesture-navigation regions, status bars, and display cutouts.
- Test short screens and landscape. A layout that works only on tall portrait phones is not complete.
- Reflow content instead of shrinking it until it becomes illegible.
- Keep reading widths controlled on wider screens; do not stretch text across the full viewport merely because space exists.
- Avoid `width: 100vw` inside normal document flow when it creates scrollbar overflow. Prefer `width: 100%` unless viewport width is required.
- Check nested scrolling. Use one primary scroll container whenever practical.

## 2. Touch targets and interaction feedback

- For web controls, target at least 44 by 44 CSS px. Use 48 by 48 CSS px for frequent, primary, or icon-only controls when density permits.
- Treat 24 by 24 CSS px as the WCAG 2.2 minimum floor, subject to its spacing and other exceptions. Do not use that floor as the default mobile design target.
- A visible icon may be 20–24 px inside a larger interactive hit area.
- Keep dense adjacent controls separated. An 8 px gap is a sound default when the design system permits it.
- Give every custom interactive element a clear enabled, pressed, focus-visible, selected, loading, and disabled state when those states apply.
- Press feedback should begin immediately. Do not wait for navigation or a network response before showing that the tap registered.
- Never depend on hover for discovery or operation. Hover may add detail for pointer users.
- Do not require a double tap, long press, swipe, or drag when a clear single-tap alternative can perform the same task.
- Provide buttons for reorder, reveal, dismiss, or move actions when gestures are supported.
- Keep destructive and primary actions visually distinct and far enough apart to reduce accidental activation.
- Make a whole row tappable only when the row has one clear action. Preserve separate controls for secondary actions.

## 3. Navigation, hierarchy, and thumb reach

- Make the current location and the route back clear.
- Preserve browser history and deep links. A mobile web application should not trap users inside a custom navigation stack.
- Use bottom navigation only for a small, stable set of top-level destinations. Include clear labels and a persistent selected state.
- Do not place transient actions in primary navigation.
- Pad bottom navigation for the safe area and reserve enough content space so it never covers the last item.
- Put frequent primary actions within comfortable reach when the task permits it. A bottom action area often works well for sequential forms, checkout, and creation flows.
- Do not move every action to the bottom. Top-bar actions remain suitable when they match the information architecture or platform convention.
- Keep one visually dominant primary action per view or step.
- In landscape or short-height layouts, reduce persistent chrome before compressing content into an unusable region.
- Make drawers, menus, and sheets easy to dismiss by an explicit control. Back or Escape should work when the component is modal.
- Restore focus to the opener after a modal surface closes.

## 4. Forms and the virtual keyboard

- Use semantic `label`, `input`, `textarea`, `select`, `button`, and form elements.
- Associate every input with a persistent visible label. A placeholder is not a label.
- Use correct `type`, `inputmode`, `autocomplete`, and related attributes so the browser can provide the right keyboard and autofill behavior.
- Keep input text readable enough to avoid browser zoom surprises and eye strain.
- Do not block password managers, one-time-code paste, copy and paste, or browser autofill without a security requirement.
- When the keyboard opens, keep the focused field, its error message, and the next action reachable.
- Use scroll margins or scroll padding so focus movement does not place a field behind a sticky header or action bar.
- A sticky action bar must not cover fields, validation text, or browser keyboard controls.
- Preserve entered values when validation fails.
- Place errors near their field and provide a summary when many fields fail at once.
- Move focus to the first invalid field or error summary only when it helps the user recover; do not create a focus loop.
- Keyboard resize behavior differs by browser. Chrome on Android honors `interactive-widget` in the viewport meta (`resizes-visual`, `resizes-content`, `overlays-content`); do not rely on it in Safari. The VirtualKeyboard API (`navigator.virtualKeyboard.overlaysContent`, `env(keyboard-inset-height)`) is Chromium-only and experimental, so use it only as progressive enhancement.
- Use loading and submission guards to prevent duplicate actions.
- Prefer native date, time, file, and select controls when they meet the product need. A custom control carries a much higher accessibility and keyboard burden.
- Give password visibility, clear, increment, and decrement controls full touch targets and accessible names.

## 5. Sheets, dialogs, menus, and overlays

- On compact phones, a bottom sheet or full-screen sheet often fits contextual tasks better than a small centered dialog. Keep the component consistent with the existing product.
- On wider screens, adapt the same task to a centered dialog, side sheet, or two-pane layout when that improves readability.
- A drag handle is a visual cue, not a substitute for a named close control.
- Modal content needs a clear title, initial focus, focus containment, Escape or Back handling, and focus restoration.
- Lock background scrolling without causing the page to jump or lose its prior position.
- Keep sheet headers and actions visible only when doing so does not hide too much content.
- Apply bottom safe-area padding to sheet content and actions.
- Avoid nested scroll areas unless the interaction truly needs them.
- Menus must remain inside the visible viewport and expose the same actions to touch and keyboard users.
- Confirm destructive actions when recovery is difficult. Do not add confirmations to harmless, easy-to-undo actions.
- Prefer native `<dialog>` opened with `showModal()` for modal surfaces: it provides focus containment, Escape to close, and top-layer stacking. `closedby="any"` gives light dismiss in Chromium and Firefox but not in Safari, so keep an explicit close control and a click-outside fallback.
- Use the `popover` attribute for menus and other non-modal surfaces before reaching for a script-positioned overlay.

## 6. Visual hierarchy, density, and content states

- Reuse the project's spacing, typography, color, radius, shadow, and motion tokens.
- Create hierarchy with spacing, typography, grouping, and placement before adding more containers or decoration.
- Avoid wrapping every section in a card. Cards should communicate a real boundary or interaction.
- Keep primary text comfortably readable and secondary text large enough for mobile use.
- Use short, action-led labels. Icon-only controls need accessible names and should use familiar symbols.
- Design loading, empty, error, offline, success, disabled, and long-content states when the scoped feature can reach them.
- Prevent layout shifts when content, images, errors, or loading indicators appear.
- Keep dark mode readable when the product supports it. Check elevation, borders, disabled states, and system-bar contrast.
- Do not use color as the only state indicator.
- Avoid excessive blur, translucent layers, shadows, or gradients that lower contrast or scrolling performance.

## 7. Platform feel without operating-system cosplay

### Shared mobile-web baseline

- Keep native browser abilities intact: history, zoom, text selection, copy and paste, autofill, link previews, and long-press context where the browser provides it.
- Use semantic controls so iOS and Android browsers can supply platform-appropriate behavior.
- Match the product brand across platforms. Change behavior only when the platform, viewport, input method, or product requirement calls for it.
- Prefer capability detection and CSS environment features over operating-system sniffing.

### iOS-aware checks

- Account for the home-indicator region and top safe areas in edge-to-edge layouts.
- Check dynamic browser chrome and changing viewport height during scroll and keyboard use.
- Keep bottom actions above the safe area.
- Verify text inputs do not cause an unexpected zoom or hide the current task.
- Use sheet-like motion and layering only when it matches the product's component system.
- Do not place critical controls where browser or system edge gestures make them hard to use.
- In iOS 26 Safari the toolbar and tab bar float translucently over the page. Developers report that `theme-color` is no longer used for the bar tint, which comes from the page or from a fixed element's background, and that safe-area values for fixed elements do not always account for the toolbar. Set the `html`/`body` background to the color the bars should show, and check fixed bottom actions, dialogs, and sheets in the iOS Simulator or on a device; desktop emulation does not reproduce this.

### Android-aware checks

- Favor generous 48 px-class hit areas for interactive elements when the layout has room.
- Preserve browser or system Back behavior across routes and modal surfaces.
- Chrome 135+ on Android draws web content edge to edge on phones. Without `viewport-fit=cover`, a bottom "chin" retracts on scroll and `env(safe-area-inset-bottom)` changes as it moves; for fixed bottom elements combine `env(safe-area-inset-bottom, 0px)` with `--safe-area-max-inset-bottom` as described in the Chrome edge-to-edge guide.
- Give taps a clear pressed-state layer or equivalent immediate feedback.
- Do not intercept overscroll, edge gestures, or Back merely to mimic another platform.
- Test a slightly wider compact viewport and varied aspect ratios; Android phones are not one fixed size.

## 8. Accessibility baseline

- Meet WCAG 2.2 AA for the scoped interface.
- Use landmarks, a logical heading order, semantic controls, accessible names, and sensible focus order.
- Keep interactive targets at the 44–48 px design target where practical and never below the WCAG floor without a valid exception.
- Verify keyboard operation, including opening, operating, and closing overlays.
- Keep visible focus styling with enough contrast.
- Support text resizing and reflow. Content should remain usable at narrow widths and increased text size.
- Respect `prefers-reduced-motion` and avoid motion that is required to understand state.
- Provide non-drag alternatives for drag interactions.
- Do not lock orientation unless the experience cannot function in the alternate orientation.
- Do not use `user-scalable=no` or a restrictive maximum scale.
- Announce async status changes when they affect task completion.
- Avoid duplicate or noisy screen-reader labels.

## 9. Motion and performance

- Use motion to explain spatial change, state, or continuity; do not animate every property.
- Keep tap feedback fast. Use longer transitions only when they help users follow a sheet, route, or layout change.
- Prefer transform and opacity animation over properties that trigger repeated layout.
- Respect reduced-motion preferences with a static or greatly shortened alternative.
- Avoid large animation libraries for a small local fix.
- Reserve image and media dimensions to reduce layout shift.
- Lazy-load noncritical media and split heavy code only through patterns already used by the project.
- Check scrolling for sticky-element repaints, large blur regions, and expensive fixed backgrounds.

## 10. Priority examples

### P0 — blocked

- Primary CTA is behind the home indicator or browser toolbar.
- Keyboard covers the focused field and no scroll path reaches it.
- Modal focus cannot escape or the modal cannot be dismissed.
- Horizontal overflow hides required controls.
- Browser Back exits the application instead of closing a modal or returning to the prior route as expected.

### P1 — serious

- Frequent controls have tiny hit areas.
- Form labels, validation, or focus order are broken.
- Bottom navigation covers content or has no selected state.
- A core action exists only on hover or swipe.
- Fixed UI breaks on short screens or landscape.

### P2 — quality

- Primary action is hard to reach during a repeated mobile task.
- Pressed, loading, empty, and error states feel incomplete.
- Sheet or menu behavior is inconsistent with the rest of the product.
- Spacing and hierarchy make the interface feel like a shrunken desktop page.

### P3 — polish

- Small alignment drift, inconsistent icon sizing, or slightly awkward animation timing.
- Noncritical spacing refinements that do not affect comprehension or operation.

## Reference anchors

These sources define the baseline behind this checklist (checked 2026-10-02):

- Apple UI Design Dos and Don'ts: https://developer.apple.com/design/tips/
- Apple Human Interface Guidelines, Buttons: https://developer.apple.com/design/human-interface-guidelines/buttons
- Android accessibility guidance: https://developer.android.com/guide/topics/ui/accessibility/apps
- Android system bars and edge-to-edge guidance: https://developer.android.com/design/ui/mobile/guides/foundations/system-bars
- Android posture and orientation guidance: https://developer.android.com/design/ui/mobile/guides/layout-and-content/postures-and-orientation
- Material 3 interaction states: https://m3.material.io/foundations/interaction/states/overview
- WCAG 2.2 target size minimum: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Chrome edge-to-edge on Android: https://developer.chrome.com/docs/css-ui/edge-to-edge
- Viewport meta (`viewport-fit`, `interactive-widget`): https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport
- `<dialog>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
