## 2024-04-24 - Semantic Navigation & Focus States
**Learning:** The application's main navigation relies on generic `div` wrappers instead of semantic `nav` elements, and custom button styles (like `.linkButton`) lack explicit `:focus-visible` outlines, hiding keyboard focus.
**Action:** Always wrap main navigation links in a `<nav aria-label="游戏菜单">` element and add `&:focus-visible { outline: 3px solid #0984e3; outline-offset: 2px; }` to interactive CSS modules to support screen readers and keyboard navigation.
