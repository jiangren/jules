
## 2026-05-09 - Accessible Navigation and Focus States
**Learning:** In the `games` project, game selection menus were structured using generic `<div>` tags which screen readers don't recognize as navigation landmarks, and custom styled links often lack explicit keyboard focus indicators when browser defaults are masked or insufficient.
**Action:** Always use semantic `<nav>` elements with Chinese `aria-label`s (like `aria-label="游戏菜单"`) for link collections, and include explicit `&:focus-visible` outline styles in CSS modules to ensure keyboard accessibility.
