# Visual QA

Date: 2026-07-23
Route: `/`
Browser: in-app browser

## Checked viewports

- 1280 × 720 — desktop hero, directions, case, process and materials.
- 768 × 1024 — two-column touch-friendly direction chapters.
- 430 × 932 — single-column mobile direction chapters and snap materials.
- 390 × 844 — hero, directions, horizontally scrollable case and materials.
- 320 × 568 — compact fallback and long Cyrillic wrapping.

## Results

- Page-level horizontal overflow: `0 px` at every checked viewport.
- Mobile directions use their own composition; the desktop switcher is hidden.
- Every mobile direction keeps its image immediately after its copy.
- Case interface preserves a readable working scale with native horizontal scroll.
- Materials use horizontal snap navigation and maintain opaque, high-contrast surfaces.
- Compact view disables opacity-based scroll reveal, preventing washed-out text and cards.
- Tablet directions use a two-column chapter layout; mobile uses one column.
- Navigation, form labels and interactive controls remain keyboard-addressable.
- Browser console: no errors or warnings.
- Typography revision: no loaded or referenced serif face; Manrope Variable is the only display and body family.
- Accent revision: `#0647FF` renders with high contrast on white and black surfaces at 1280 × 720 and 390 × 844.

## Artifacts

Screenshots are stored in `artifacts/visual-qa/`.

---

## Automation hub

Date: 2026-07-23
Route: `/automation` and `/insights/automation/request-automation-system`
Browser: in-app browser

### Checked

- 1440 × 960 — hierarchy, 3D arc spacing, readable labels and section rhythm.
- 768 × 1024 — intermediate layout, responsive copy and controls.
- 390 × 844 and 320 × 568 — compact header, Cyrillic title wrapping, touch carousel and form structure.
- Carousel controls — next button switches the selected direction; the selected card opens its article; browser-back restores the selected direction.
- Page-level horizontal overflow — `0 px` at 1440 × 960 and 390 × 844.
- Accessibility — semantic headings, visible keyboard focus, keyboard arrows, button labels, hidden cards removed from tab order, and a reduced-motion CSS fallback.
- Browser console — no errors or warnings observed.

### Artifacts

- `artifacts/visual-qa/automation-desktop-1440.png`
- `artifacts/visual-qa/automation-tablet-768.png`
- `artifacts/visual-qa/automation-mobile-390.png`
- `artifacts/visual-qa/automation-mobile-320.png`

---

## Automation hub revision

Date: 2026-07-23
Route: `/automation` and `/insights/automation/business-process-automation`
Browser: in-app browser

### Checked

- 1440 × 960, 768 × 1024, 390 × 844 and 320 × 568.
- First screen uses one local full-bleed AVIF image with readable text overlay; no small decorative labels remain.
- "Зачем нужна автоматизация" uses local image cards with readable dark-glass panels; hover enriches image scale and glass without hiding content on touch devices.
- 3D carousel: arrow keys switch cards while the carousel is visible; wheel input over the stage switches cards in a loop; visible arrow controls switch cards; the active card opens its article.
- Card copy is contained in a dark glass underlay; the previous details block beneath the carousel is removed.
- Articles render the complete source Markdown from the seven supplied 1.1–1.7 files without summarisation or rewriting.
- Page-level horizontal overflow: `0 px` at desktop and 390 px mobile.

### Artifacts

- `artifacts/visual-qa/automation-revision-desktop-1440.png`
- `artifacts/visual-qa/automation-revision-tablet-768.png`
- `artifacts/visual-qa/automation-revision-mobile-390.png`
- `artifacts/visual-qa/automation-revision-mobile-320.png`

---

## Automation hub refinement

Date: 2026-07-23
Route: `/automation` and `/insights/automation/information-systems-implementation`
Browser: in-app browser

### Checked

- 1440 × 960 — all three glass panels in the “Зачем нужна автоматизация” row have a matching `193 px` text-panel height; active carousel border is neutral white rather than blue.
- 390 × 844 — hero uses `word-break: keep-all`, `overflow-wrap: normal` and has no page-level horizontal overflow; each of the four service cards remains a full `350 px` high.
- First screen — the local image retains readable overlay copy while a restrained ambient light animation is present; reduced-motion CSS disables that animation.
- Article — hierarchy renders as `h1` / `h2` / `h3`, paragraphs, bold text, ordered and unordered lists, links, and source tables. The checked information-systems article contains 1 top-level heading, 12 second-level headings, 44 third-level headings, 15 lists and 2 tables.
- Build and lint pass with no errors. Existing `<img>` optimisation warnings remain unchanged.

### Artifacts

- `artifacts/visual-qa/automation-final-desktop-1440.png`
- `artifacts/visual-qa/automation-final-mobile-hero-390.png`
- `artifacts/visual-qa/automation-final-mobile-formats-390.png`
- `artifacts/visual-qa/automation-final-article-390.png`

---

## Hero video loop and scroll handoff

Date: 2026-07-23
Route: `/`
Browser: in-app browser

### Checked

- 1280 × 720 — heading overlay, ready video source, expansion to fullscreen and no horizontal overflow.
- 768 × 1024 — tablet menu, framed 28 px media corner and readable copy.
- 390 × 844 — compact menu, 14 px side insets, 22 px corners, video playback and `0 px` page-level overflow.
- The WebM source is selected before MP4 and video `readyState` reached 4 in desktop and mobile checks.
- ScrollTrigger drives only frame geometry, copy visibility and the handoff preview; it does not seek or pause the video.
- The reduced-motion CSS path leaves a static framed hero and removes the sticky scroll range.

### Artifacts

- `artifacts/visual-qa/hero-video-desktop-1280.png`
- `artifacts/visual-qa/hero-video-tablet-768.png`
- `artifacts/visual-qa/hero-video-mobile-390.png`

---

## Hero video visual revision

Date: 2026-07-23
Route: `/`
Browser: in-app browser

### Checked

- 1440 × 960 — white editorial first frame: only the main black headline and framed video; no supporting hero copy.
- 390 × 844 — headline, compact media frame and navigation fit without horizontal overflow; video reaches `readyState: 4`.
- The GSAP scene expands the frame to the viewport, introduces only the short white video message, then hands the scroll back to the existing statement section without a contraction phase.

### Artifacts

- `artifacts/visual-qa/hero-video-revision-desktop-1440.png`
- `artifacts/visual-qa/hero-video-revision-mobile-390.png`

---

## Hero video composition refinement

Date: 2026-07-23
Route: `/`
Browser: in-app browser

### Checked

- 1440 × 960 — video is centered; the two-line black headline sits independently in the lower-right corner.
- 390 × 844 — compact headline and media remain readable, with `0 px` horizontal overflow.
- Video uses `object-fit: cover` plus a uniform 1.16 scale inside the clipping frame, removing the empty top/bottom bands without stretching the source.

### Artifacts

- `artifacts/visual-qa/hero-video-refined-desktop-1440.png`
- `artifacts/visual-qa/hero-video-refined-mobile-390.png`

---

## Hero 16:7 crop

Date: 2026-07-23
Route: `/`

- The initial frame uses a centered `16 / 7` mask with `object-fit: cover`, removing the empty black top/bottom bands while preserving the video proportions.
- The original two-line hero statement remains at the lower-left; horizontal overflow is `0 px` at 1440 × 960.

Artifact: `artifacts/visual-qa/hero-video-16x7-desktop-1440.png`

---

## Realtime WebGL hero

Date: 2026-07-24
Route: `/hero-webgl`
Browser: in-app browser

### Checked

- 1440 × 960 — two-line desktop heading, clean left reading field, one realtime Canvas and a large surface extending beyond the top/right viewport edges.
- 768 × 1024 — medium quality tier, complete two-line heading, tablet menu and no clipped copy.
- 390 × 844 — copy and CTA precede the lower visual field, menu opens and closes with the correct `aria-expanded` state.
- Scroll — the membrane remains cohesive through the depth-opening state, releases the sticky scene into a normal white section and returns to the original state when scrolling back.
- Runtime — one Canvas, DPR capped by quality tier, 38k/22k/12k approximate point tiers, render loop switches to `demand` outside the observed hero range.
- Accessibility — HTML heading and actions remain above the decorative Canvas; visible focus states, touch targets, reduced-motion static fallback and WebGL-unavailable fallback are present.
- Page-level horizontal overflow: `0 px` at 1440, 768 and 390 px.
- Browser console: no errors or warnings.
- Validation: production build succeeds; the new route passes ESLint with zero warnings. The project-wide lint command retains 15 pre-existing `<img>` optimisation warnings outside `/hero-webgl`.

### Artifacts

- `artifacts/visual-qa/hero-webgl-desktop-1440.png`
- `artifacts/visual-qa/hero-webgl-tablet-768.png`
- `artifacts/visual-qa/hero-webgl-mobile-390.png`
- `artifacts/visual-qa/hero-webgl-handoff-1440.png`

### Material refinement — 2026-07-24

- Replaced the large grid-like points with antialiased circular particles while keeping the same bounded geometry tiers.
- Increased the particle range to roughly `1–4 CSS px` and restored cold silver-blue highlights; no warm white or yellow shader colour is used.
- Idle now carries part of the travelling-wave energy, so folds and luminous ridges move before scrolling. Scroll increases the same continuous wave system instead of separating the surface.
- Rechecked 1440 × 960, 768 × 1024 and 390 × 844: no page overflow and no browser console errors or warnings.
- Updated artifacts: `hero-webgl-desktop-1440.png`, `hero-webgl-tablet-768.png`, `hero-webgl-mobile-390.png`, `hero-webgl-wave-1440.png`.

### Cold membrane refinement — 2026-07-24

- Kept the route structure, copy, CTA, cursor response, scroll timeline and quality tiers unchanged; the revision is limited to shader colour, deformation, density and point rendering.
- Replaced the previous ramp with `#001447 → #315FBB → #0647FF → #C4D8F4` on a `#000104` field. The shader contains no warm, yellow, cream, green or violet colour input.
- Added two slow idle currents plus a foreground crest/valley pair. Scroll continues to amplify the same continuous wave field instead of triggering a separate transition.
- Added a fold-driven density field and stable per-point visibility variation: ridges remain dense and bright while valleys retain intentional dark gaps.
- Rechecked 1440 × 960, 768 × 1024, 430 × 932, 390 × 844 and 320 × 568. Page-level horizontal overflow is `0 px` at every measured viewport.
- One decorative Canvas is present, browser console reports no warnings or errors, and the existing DPR/segment caps remain unchanged.
- Reduced-motion and WebGL fallback code paths are preserved; the QA browser had reduced motion disabled.
- Updated artifacts: `hero-webgl-desktop-1440.png`, `hero-webgl-wave-1440.png`, `hero-webgl-tablet-768.png`, `hero-webgl-mobile-430.png`, `hero-webgl-mobile-390.png`, `hero-webgl-mobile-320.png`.

### Motion emphasis and variant 2 — 2026-07-24

- Increased the existing idle phase speeds and amplitudes; no new animation runtime or second simulation was added.
- Increased pointer radius/strength and local vertex lift, plus the bounded group tilt from `±2.5°` to `±4.1°`.
- Increased scroll-wave displacement while preserving the same `ScrollTrigger`, sticky range and handoff.
- Added `/hero-webgl-v2`, reusing the same Canvas and shader. The material covers the viewport; the hero has one centered heading, zero supporting paragraphs and zero hero links/buttons.
- Variant 2 compact mode adds vertical coverage and a small baseline density so an idle dark valley cannot remove the material from the whole screen.
- Rechecked 1440 × 960 and 390 × 844: one Canvas, `0 px` horizontal overflow, no browser console warnings/errors.
- Artifacts: `hero-webgl-v2-desktop-1440.png`, `hero-webgl-v2-mobile-390.png`, `hero-webgl-v2-pointer.png`, `hero-webgl-v2-scroll.png`, and two idle-state samples.

### Luminous network-node material — 2026-07-24

- Kept composition, HTML copy, CTA, responsive layout, pointer mapping, scroll timeline and handoff unchanged.
- Replaced the flat circular sprite with a layered `hot core → node body → restrained rim → local halo` profile inside the existing point shader; no post-processing or global bloom was introduced.
- Replaced discrete silver highlights with a continuous depth/density/ridge/network ramp: `#00113A → #123B82 → #0058FF → #B8C7DC`.
- Added a low-frequency, correlated node-intensity signal so neighboring particles imply an intelligent fabric without drawing lines or wireframe.
- Applied `timeScale: 0.8` to shader time, slowing all time-based idle deformation and luminous flow by 20%; pointer and scroll remain user-driven and unchanged.
- Checked `/hero-webgl` at 1440 × 960, 768 × 1024, 430 × 932, 390 × 844 and 320 × 568. Horizontal overflow is `0 px`; one Canvas is present; browser console has no warnings or errors.
- Artifacts: `hero-webgl-material-desktop-1440.png`, `hero-webgl-material-scroll-1440.png`, `hero-webgl-material-tablet-768.png`, `hero-webgl-material-mobile-430.png`, `hero-webgl-material-mobile-390.png`, `hero-webgl-material-mobile-320.png`.

### Resolution, glow and contrast refinement — 2026-07-24

- Increased far-layer point size by approximately `20%` and raised the compact/medium/expanded meshes to `144×106`, `196×144` and `252×188`; DPR remains capped per tier.
- Strengthened only the local electric-blue halo, kept silver-white as a crest/core accent and retained the no-postprocessing path.
- Removed the horizontal pointer offset so the local lift is centered directly under the cursor.
- Added a borderless radial contrast field behind the centered V2 heading and reduced the header glass fill to `38%` black.
- Checked `/hero-webgl` and `/hero-webgl-v2` at 1440 × 960 and 390 × 844; also measured 768 × 1024, 430 × 900 and 320 × 700. Every viewport has one Canvas and `0 px` horizontal overflow.
- Scroll reached `645.5 px` in the pinned story and visibly changed the same membrane; no runtime exception was logged. WebGL context-loss log entries occurred only when navigating/replacing the inspected Canvas during QA.
- Production build and route-scoped ESLint pass.
- Artifacts: `hero-webgl-resolution-desktop-1440.png`, `hero-webgl-pointer-centered-1440.png`, `hero-webgl-resolution-scroll-1440.png`, `hero-webgl-resolution-mobile-390.png`, `hero-webgl-v2-contrast-desktop-1440.png`, `hero-webgl-v2-contrast-mobile-390.png`.

---

## Сквозная навигация — 2026-07-24

Маршруты: `/`, `/automation`, `/insights/automation/business-process-automation`.

Браузер: in-app browser, production build на локальном сервере.

### Проверено

- Единое меню содержит переходы на главную, автоматизацию, список статей и оба WebGL-варианта на всех проверенных страницах.
- Карточки материалов на главной открывают соответствующие полные статьи.
- В compact-режиме меню открывается, ссылкой «Автоматизация» успешно переходит с главной на `/automation` и закрывается после перехода.
- Горизонтальный overflow отсутствует: `0 px` на 1440 × 900 (главная), 390 × 844 (автоматизация), 768 × 1024 (статья).

### Артефакты

- `artifacts/visual-qa/navigation-home-1440.png`
- `artifacts/visual-qa/navigation-automation-390.png`
- `artifacts/visual-qa/navigation-article-768.png`

---

## Mobile glass navigation and compact WebGL — 2026-07-24

Routes: `/automation`, `/hero-webgl`, `/hero-webgl-v2`.
Browser: local production server (`npm start -- --port 3003`).

### Checked

- `320 × 568`, `390 × 844`, `430 × 932`, `768 × 1024` — page-level horizontal overflow is `0 px`; every WebGL route keeps exactly one Canvas.
- `/hero-webgl` at 320 and 390 uses the new lower, portrait-oriented membrane after the copy and CTA; its scroll state changes the same surface without a second animation system.
- `/hero-webgl-v2` at 390 and 430 keeps the title readable in the radial dark field while the material fills the screen around it.
- Light mobile navigation (`/automation`) opens as a cold blue-silver translucent glass overlay; dark WebGL navigation uses a deep translucent blue-black glass. Neither surface is white.
- Menu has a working `aria-expanded` state, no horizontal overflow and large touch links.
- Browser console has no warnings or errors during the compact WebGL scroll check.

### Notes

- Reduced-motion behavior is covered by the WebGL code path: the shader freezes to its static phase, pointer motion is disabled and the sticky scroll range collapses to one viewport.
- Build passes. Existing chunk-size and duplicate-asset-name warnings remain unchanged.
