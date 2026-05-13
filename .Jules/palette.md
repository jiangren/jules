
## 2024-05-13 - Semantic Navigation & Keyboard Focus
**Learning:** The H5 game center menu relied on generic `<div>` wrappers instead of semantic `<nav>` elements, hiding the primary navigation landmark from screen readers. Additionally, custom styling on interactive elements without explicit `:focus-visible` rules can mask default browser focus rings, degrading keyboard accessibility.
**Action:** Always use `<nav>` with descriptive, localized `aria-label`s (e.g., `aria-label="游戏菜单"`) for main link collections, and include high-contrast `&:focus-visible` styles on custom buttons and links to ensure a fully accessible, keyboard-friendly navigation experience.
