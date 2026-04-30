
## 2024-05-15 - Navigation and Focus Patterns
**Learning:** The application uses generic `<div>` wrappers for navigation menus and custom CSS modules that mask default focus styles, hindering keyboard and screen reader accessibility.
**Action:** Always use semantic `<nav>` elements with appropriate `aria-label` attributes for menus, and explicitly define `&:focus-visible { outline: 3px solid #0984e3; outline-offset: 2px; }` for custom buttons and links.
