## 2024-04-12 - Missing Keyboard Navigation Focus Styles
**Learning:** In the `games` project, custom buttons and links styled with CSS Modules (.less) lack explicit `&:focus-visible` styles. Because default browser outlines are either insufficient or masked by custom styles (like box-shadow or backgrounds), keyboard-only users cannot easily see which element has focus.
**Action:** When styling custom interactive elements (buttons, links), always include explicit `&:focus-visible` styles (e.g., high-contrast outlines and offsets) to ensure keyboard accessibility.
