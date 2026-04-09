## 2026-04-09 - Missing focus-visible on Custom CSS Module Links
**Learning:** Custom buttons and links in the games project use CSS Modules but lack explicit `&:focus-visible` styles, which degrades keyboard navigation accessibility as default browser outlines may be insufficient or masked.
**Action:** Add explicit `&:focus-visible` styles (e.g., high-contrast outlines) to all custom interactive elements, starting with `.linkButton` in Home.module.less.
