## 2024-04-03 - Improve Home Menu Navigation
**Learning:** Adding explicit `focus-visible` styles to CSS Modules is essential for custom styled link buttons to ensure keyboard accessibility. Also, semantic landmarks like `<nav>` with Chinese `aria-label`s improve local screen reader experiences.
**Action:** Always include `&:focus-visible` states when styling custom links/buttons in this project, and ensure wrapper elements for lists of links use `<nav>` with appropriate translated ARIA labels.
