
## 2024-05-24 - Semantic Navigation & Focus Styles
**Learning:** Default browser outlines are masked by custom styling on interactive links, and screen readers fail to identify `div`-based link containers as navigation sections.
**Action:** Always use `<nav aria-label="游戏菜单">` (with Chinese labels) for menus and add explicit `&:focus-visible` to custom styled buttons/links to maintain keyboard accessibility.
