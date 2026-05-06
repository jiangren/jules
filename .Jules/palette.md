
## 2026-05-06 - Improve Game Menu Accessibility
**Learning:** In the games project, game menus wrapped in generic div tags lack proper screen reader support, and custom styled buttons lose default keyboard navigation outlines. Using semantic nav tags with Chinese aria-labels and explicit :focus-visible outlines solves this.
**Action:** Always wrap collection of navigation links in nav tags equipped with aria-labels and add &:focus-visible explicit styles in CSS Modules.
