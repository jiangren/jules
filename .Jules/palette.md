
## 2024-05-15 - Navigation and Keyboard Focus Accessibility
**Learning:** Custom CSS modules in the `games` project define hover and active states but often mask default browser focus outlines without providing explicit `:focus-visible` fallbacks, making keyboard navigation difficult. Furthermore, generic `<div>` wrappers are used for navigation link collections instead of semantic `<nav>` elements.
**Action:** Always include explicit `&:focus-visible` styles with high-contrast outlines (e.g., `outline: 3px solid #0984e3;`) for custom buttons and links in `.less` files. Use semantic `<nav>` elements equipped with appropriate Chinese `aria-label`s (e.g., `aria-label="游戏菜单"`) for link collections.
