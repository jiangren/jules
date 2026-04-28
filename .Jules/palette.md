
## 2024-05-14 - Semantic Navigation and Focus States
**Learning:** Using generic div wrappers for collections of links creates accessibility barriers for screen readers. Default browser outlines for focus states can also be masked or insufficient on styled custom buttons.
**Action:** Always wrap navigation links in a `<nav>` element with an appropriate `aria-label`, and explicitly define `&:focus-visible` styles with high contrast to ensure keyboard navigation is visible and accessible.
