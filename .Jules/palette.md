
## 2024-05-08 - Semantic Navigation and Focus States
**Learning:** Custom link buttons in the games project using CSS Modules lack native focus visibility. Menus are wrapped in generic `<div>` tags, which hides the navigation structure from screen readers.
**Action:** Always use `<nav aria-label="游戏菜单">` for game menus and explicitly define `&:focus-visible` with high-contrast outlines (e.g., `outline: 3px solid #0984e3;`) for custom links.
