## 2025-02-13 - Semantic navigation and focus states
**Learning:** In the `games` project, game menus are lists of links within generic divs without clear keyboard focus outlines. Screen readers need semantic `<nav>` elements with Chinese `aria-label`s, and keyboard users need explicit `&:focus-visible` outlines due to custom CSS modules.
**Action:** Always use `<nav aria-label="游戏菜单">` for navigation menus and include explicit `&:focus-visible { outline: 3px solid #0984e3; outline-offset: 2px; }` styles for custom link buttons.
