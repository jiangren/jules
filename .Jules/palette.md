
## 2024-04-19 - Semantic Navigation and Focus Management
**Learning:** In the games project, collections of navigation links often use generic div wrappers without sufficient screen reader context or keyboard focus indicators due to custom CSS button styles overriding defaults.
**Action:** Always use semantic <nav aria-label="游戏菜单"> (matching the platform's primary language) for main navigation blocks and include explicit &:focus-visible styles (e.g., high-contrast outlines) in CSS modules to ensure keyboard accessibility.
