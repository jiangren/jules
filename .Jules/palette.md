## 2024-05-24 - Focus Visibility for Custom Buttons
**Learning:** Custom styled links and buttons with complex box-shadows or gradients often mask the default browser focus outline, making keyboard navigation difficult to track for users relying on Tab navigation.
**Action:** Always add an explicit `&:focus-visible` pseudo-class (e.g. `outline: 3px solid #0984e3; outline-offset: 2px;`) to interactive elements, especially when default styles are overridden by custom CSS modules.
