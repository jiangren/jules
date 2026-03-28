# Palette's Journal

## UX Learnings
## 2024-05-24 - Focus Visible States for Custom Buttons
**Learning:** When styling custom buttons or links in React applications (like `games`) using CSS Modules (.less), it's important to include explicit `&:focus-visible` styles (e.g., high-contrast outlines) to ensure keyboard navigation accessibility, as default browser outlines may be insufficient or masked by custom styles.
**Action:** Always verify keyboard navigation and focus indicators when implementing custom styled interactive elements. Include `&:focus-visible` in the base component styles.
