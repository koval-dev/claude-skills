# Layout and safe areas

Use fluid widths and reflow rather than shrinking controls. Check 320 CSS px portrait and short landscape. Avoid fixed-height shells with hidden overflow. For full-height regions, choose `dvh` when the region should follow browser chrome or `svh` when stable height matters; retain a fallback when the supported browser range needs it.

Fixed UI needs both a safe position and content clearance. Reserve its occupied height in the actual scroll container so the last item, focused field, and errors can scroll above it. Account for wrapping labels and larger text instead of assuming a single bar height. In short landscape, reducing persistent chrome or using an in-flow action can be appropriate if the product still supports the task.

## Choose a safe-area strategy

Inspect the existing viewport meta and supported browsers before changing them. `viewport-fit=cover` opts into drawing at the edges; use it only when the product intends that and handles the affected top, bottom, and side insets. A notch or toolbar is not reproduced by merely selecting a phone-sized desktop viewport.

For a bottom-anchored element, avoid a blanket `padding-bottom: env(safe-area-inset-bottom)` prescription. Chrome's dynamic bottom region changes the inset during scroll. Its [edge-to-edge migration guide](https://developer.chrome.com/docs/css-ui/edge-to-edge) warns that changing padding can repeatedly relayout the bar and prevent the region retracting.

Choose the strategy that fits the existing layout:

- To keep controls above the inset, position the bottom edge using `bottom: env(safe-area-inset-bottom, 0px)` and reserve sufficient scroll clearance.
- If the bar background must extend to the device edge, reserve a stable maximum inset, then move the bar with `bottom: calc(env(safe-area-inset-bottom, 0px) - var(--reserved-inset))`. The reserved inset can use `env(safe-area-max-inset-bottom, <supported-browser fallback>)`; content clearance includes the bar and reserved region. Choose and verify a fallback for the supported browsers instead of treating an example value as universal.
- In ordinary scrolling content or stable edge-to-edge contexts, inset padding may still be appropriate. Check the platform behavior and layout cost for that context.

Check both toolbar states, orientation changes, and the last scrollable content. Safari and Chrome can differ in viewport resizing and fixed-element behavior. State which device checks were unavailable instead of declaring a universal workaround successful.

Prefer capability checks and progressive enhancement to OS sniffing. Keep reading widths sensible at desktop breakpoints, and check that an attempted overflow fix does not clip content or disable scrolling.
