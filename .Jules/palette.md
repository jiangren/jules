## 2025-04-08 - Accessible Link/Button Outlines
**Learning:** React Router `Link` components shaped as buttons in `games/src/pages/Home.jsx` lack `:focus-visible` outlines, hiding keyboard navigation accessibility.
**Action:** Always add `&:focus-visible` styling (like `outline: 2px solid #0984e3; outline-offset: 2px;`) to `.linkButton` in `Home.module.less` to ensure keyboard focus is visible.
