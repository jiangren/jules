
## 2026-05-08 - Semantic Navigation & Focus Visibility
**Learning:** The games platform's main menu utilized generic div wrappers without explicit keyboard focus outlines, making it difficult for screen readers and keyboard users to navigate the game list.
**Action:** Replaced generic div wrappers with semantic <nav aria-label="游戏菜单"> and enforced explicit &:focus-visible outlines on interactive CSS module links.
