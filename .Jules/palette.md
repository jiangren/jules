
## 2026-05-12 - Navigation semantics and keyboard focus
**Learning:** Custom button/link designs often mask default browser focus outlines. Generic wrappers for lists of links miss an opportunity to provide screen reader context.
**Action:** Always use semantic `<nav>` tags with `aria-label`s for menus and ensure custom interactive elements have explicit `&:focus-visible` styles with high contrast.
