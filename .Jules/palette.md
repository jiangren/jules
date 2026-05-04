
## 2024-05-04 - Semantic Menus and Keyboard Accessibility
**Learning:** Navigation menus using generic div wrappers and missing focus-visible styles on custom buttons significantly degrade screen reader and keyboard accessibility.
**Action:** Always use semantic nav elements with appropriate Chinese aria-labels (e.g., aria-label="游戏菜单") for menus, and explicitly define &:focus-visible with high-contrast outlines for all interactive elements in the games project.
