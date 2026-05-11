
## 2024-05-11 - Semantic Navigation and Keyboard Focus for H5 Games Center
**Learning:** Custom styled links in React often lack sufficient native focus outlines when navigated via keyboard. Furthermore, grouping game links in a generic `<div>` obscures the structure for screen reader users.
**Action:** Always wrap main collections of navigational links in `<nav>` with appropriate `aria-label` (in Chinese, like `aria-label="游戏菜单"`). Always provide explicit `&:focus-visible` outlines (e.g., `outline: 3px solid #0984e3; outline-offset: 2px;`) for custom interactive elements in CSS Modules.
