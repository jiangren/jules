## 2026-04-21 - Navigation Semantic Wrappers and Focus Indicators
**Learning:** Custom styled links in CSS Modules often mask default browser focus outlines, and grouping links in `<div>`s instead of `<nav>` with `aria-label`s harms screen reader navigation.
**Action:** Always wrap menu link collections in `<nav aria-label="...">` and explicitly define `&:focus-visible` styles with high contrast outlines for custom buttons/links.
