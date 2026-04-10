## 2026-04-10 - Focus-visible styles on custom links
**Learning:** In the `games` project, CSS Modules are used for custom styled links and buttons. The default browser focus outlines are sometimes insufficient or masked by custom shadows and border radii.
**Action:** Always add explicit `&:focus-visible` styles (e.g., a high-contrast `outline` with `outline-offset`) to interactive elements like `.linkButton` to ensure strong keyboard navigation accessibility.
