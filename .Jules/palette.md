## 2024-05-20 - Semantic Navigation and Keyboard Focus in H5 Games
**Learning:** In the `games` project, custom links styled with CSS Modules often mask default browser focus outlines, making keyboard navigation inaccessible. Furthermore, wrapping a collection of links in a generic `<div>` hides its structure from screen readers.
**Action:** Always use semantic HTML tags like `<nav>` equipped with appropriate Chinese `aria-label`s (e.g., `aria-label="游戏菜单"`) instead of generic wrappers, and include explicit `&:focus-visible` styles with high-contrast outlines for all interactive elements.
