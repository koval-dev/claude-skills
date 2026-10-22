# Usability heuristics: checks

Jakob Nielsen's ten usability heuristics, interpreted for what can be judged from a static design, a page, or its code. Assess only what is visible or clearly implied. If a heuristic depends on behaviour you can't see (what happens after submit), mention it as a question to check rather than a finding.

1. **Visibility of system status.** Does the user know where they are and what's happening? Look for an active nav state, progress indicators in multi-step flows, loading and empty states (in code), and confirmation after actions.
2. **Match with the real world.** Labels use the user's words, not internal jargon. Icons and metaphors are familiar. Information appears in a natural order.
3. **User control and freedom.** There are visible ways out: cancel, back, close, undo. Modals can be dismissed. Destructive actions aren't the default.
4. **Consistency and standards.** Platform conventions are followed: logo links home, underlined text is a link, the search icon is a magnifier. Internal consistency is covered in consistency.md.
5. **Error prevention.** Constraints are shown before input (formats, required fields, character limits). Dangerous actions are separated from safe ones and visually distinct.
6. **Recognition rather than recall.** Options are visible rather than remembered. Labels stay visible in forms (no placeholder-only labels). Navigation shows what's available.
7. **Flexibility and efficiency.** Shortcuts for frequent tasks where relevant: search, filters, sensible defaults.
8. **Aesthetic and minimalist design.** Every element earns its place, and secondary information doesn't compete with primary. This overlaps with Prägnanz and Figure/Ground; report it under whichever explains the problem best.
9. **Help users recognise and recover from errors.** Error messages (if visible in the design or code) say what went wrong and how to fix it, in plain language, next to the field.
10. **Help and documentation.** Help is findable where it's needed (inline hints, tooltips, a help link) without being required.

## Also check the main task
Ask: what is the single most important thing a user comes to this page to do? Then:
- Can they find how to do it within a few seconds?
- Is it the most prominent action?
- Is anything on the path to it distracting or confusing?

If the answer to any of these is no, that is usually the top finding of the whole audit.
