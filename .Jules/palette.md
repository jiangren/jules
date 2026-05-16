
## 2024-05-16 - Semantic Navigation and Focus Styles
**Learning:** In the games project, custom links built with CSS Modules lack explicit :focus-visible styles and are grouped in generic div wrappers instead of semantic nav elements, hindering keyboard and screen reader accessibility.
**Action:** Always use nav with aria-label for menus and include &:focus-visible with high-contrast outlines for interactive elements.
