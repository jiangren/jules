
## 2024-10-24 - Semantic Navigation and Focus States
**Learning:** In the `games` project, navigation link collections must use semantic `<nav>` elements with Chinese `aria-label`s (e.g., `aria-label="游戏菜单"`), and custom CSS Modules buttons require explicit `&:focus-visible` styles (e.g., `outline: 3px solid #0984e3;`) because default browser outlines can be masked.
**Action:** Always wrap lists of game links in `<nav>` and explicitly style focus indicators for custom Less buttons.
