
## 2024-05-20 - Semantic Navigation and Keyboard Focus
**Learning:** The games platform navigation relied on generic `<div>` wrappers and lacked explicit keyboard focus styles for CSS Modules links, making screen reader navigation difficult and keyboard navigation invisible.
**Action:** Always use `<nav aria-label="游戏菜单">` for game menus and append explicit `&:focus-visible { outline: 3px solid #0984e3; outline-offset: 2px; }` styles to `.less` components to ensure a11y standards.
