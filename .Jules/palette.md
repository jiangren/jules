## 2026-04-25 - Semantic Navigation and Focus States
**Learning:** Generic div wrappers for links and default browser focus outlines are insufficient for screen readers and keyboard users in the games platform.
**Action:** Always use semantic <nav> tags with Chinese aria-labels (like aria-label="游戏菜单") for menus, and explicit &:focus-visible styles (like outline: 3px solid #0984e3;) for custom CSS Modules buttons.
