## 2024-04-04 - Explicit Focus Styles for Custom Links
**Learning:** Default browser focus outlines are often insufficient or masked when using custom CSS Modules for buttons/links. Explicit `&:focus-visible` styles are necessary for keyboard accessibility.
**Action:** Always include a high-contrast outline in `&:focus-visible` when styling custom buttons or links in `.less` files.
