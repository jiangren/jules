
## 2024-05-05 - Semantic Nav and Focus Visible
**Learning:** When using CSS Modules (.less) for custom buttons/links, default browser outlines for keyboard navigation might be missing or insufficient. Also, grouping links inside a generic div removes semantic meaning for screen readers.
**Action:** Always wrap navigation menus in a `<nav>` tag with an appropriate `aria-label` (e.g. in Chinese for this platform), and explicitly define `&:focus-visible` styles with high contrast outlines on interactive elements.
