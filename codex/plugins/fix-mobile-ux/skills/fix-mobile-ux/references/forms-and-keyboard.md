# Forms and keyboard reach

Associate each input with a persistent visible label. Preserve existing input names, values, validation, and submit behavior. Supply suitable `type`, `inputmode`, and `autocomplete`: email and telephone types, numeric input modes for card/CVC where appropriate, and standard name, email, telephone, postal-code, and payment autofill tokens. Use native controls when they already meet the need. Do not replace working accessible date or select components merely for platform styling.

Keep field text readable; 16 CSS px often avoids automatic input zoom on iOS. Keep page zoom, paste, password managers, and autofill available. If a new input type introduces native validation that conflicts with the existing contract, retain a text field with an appropriate input mode and autofill hints. Expose errors near their fields, preserve entered values after failure, and use the existing status/submission pattern to prevent duplicate actions.

Ensure every field, error, and next action has a scroll path when space is reduced. Account for sticky headers/actions with scroll padding or margins and real content clearance. Do not assume a simulated shorter viewport opens a virtual keyboard.

Keyboard behavior differs across browsers. `interactive-widget` can influence viewport resizing in supporting browsers but is not a universal Safari fix. The VirtualKeyboard API and keyboard inset environment values are optional progressive enhancements, not required dependencies. See [viewport metadata](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport).

On a real device, focus fields near the bottom, enter data, trigger validation, move between inputs, dismiss the keyboard, rotate, and reach the action. In responsive browser tests, check labels, attributes, focus, scroll reach, and form association; report that keyboard occlusion and native autofill remain unverified if no device path exists.
