# Personal Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the approved bilingual personal homepage at `https://yuehuazhu.github.io/` with responsive navigation, an updated public CV, and verifiable content.

**Architecture:** Use a build-free GitHub Pages user site. `index.html` owns semantic content, `assets/css/site.css` owns presentation, and `assets/js/site.js` owns language and navigation behavior; only sanitized public assets enter `assets/`.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, Node.js built-in test runner, GitHub Pages.

---

### Task 1: Repository and acceptance tests

**Files:**
- Create: `package.json`
- Create: `tests/site-content.test.mjs`
- Create: `tests/language.test.mjs`
- Create: `.github/workflows/ci.yml`

- [x] Write content tests that require the five page sections, public links, bilingual names, `2026.01` quant period, the new Ant role, and absence of superseded phrases.
- [x] Write language-resolution tests covering query parameter, stored preference, browser preference, and Chinese fallback.
- [x] Run `npm test` and confirm it fails because production files do not exist.
- [x] Add a minimal CI workflow that runs `npm test` on pull requests and pushes to `main`.

### Task 2: Semantic page and public assets

**Files:**
- Create: `index.html`
- Create: `assets/images/profile.jpg`
- Create: `assets/docs/Yuehua_Zhu_CV_public.pdf`
- Create: `.nojekyll`

- [x] Build the five approved sections with semantic headings, anchor navigation, complete Chinese and English data attributes, metadata, Open Graph tags, and relative asset paths.
- [x] Generate a metadata-free 4:5 profile crop tightened by approximately 15 percent from `zyh2.jpg`.
- [x] Update the public CV from `Incoming Postdoctoral Researcher` to `Postdoctoral Researcher`, keep the QQ email and Shenzhen location, and copy only the sanitized version into `assets/docs/`.
- [x] Run the content tests and confirm only behavior/style-dependent assertions remain.

### Task 3: Responsive visual system

**Files:**
- Create: `assets/css/site.css`

- [x] Port the approved quiet academic/editorial design without the brainstorming wrapper.
- [x] Add stable desktop grids, mobile stacking, readable touch targets, and overflow protection at 390px.
- [x] Add a collapsed mobile navigation controlled by an icon button while preserving the language switch.
- [x] Add print and reduced-motion rules.

### Task 4: Language and navigation behavior

**Files:**
- Create: `assets/js/site.js`

- [x] Implement and export `resolveLanguage()` so `?lang=` overrides storage, storage overrides browser language, and Chinese is the fallback.
- [x] Apply translations to text and accessible labels, update `<html lang>`, and persist explicit user selection.
- [x] Implement mobile menu open/close, anchor navigation close, and active-section tracking.
- [x] Run `npm test` and confirm all automated tests pass.

### Task 5: Browser verification and publication

**Files:**
- Modify: `PLAN.md`
- Modify: `README.md`

- [x] Start a local HTTP server and verify page, CSS, JS, avatar, and CV return HTTP 200.
- [x] Use Chrome at 1440x1000 and 390x844 to verify no blank output, overlap, clipping, or horizontal overflow.
- [x] Verify Chinese/English switching, `?lang=en`, persistence, mobile navigation, anchor navigation, and CV download.
- [x] Update `PLAN.md` stages and README with the final repository workflow.
- [ ] Run local CI, create a PR linked to the implementation issue, merge using the documented workflow, enable GitHub Pages from `main` root, and verify the public URL returns HTTP 200.
