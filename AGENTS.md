# AGENTS

## General Agent Workflow

- Classify each task first: content, structure, styling, testing, or deployment.
- Stay close to established 11ty patterns, keep changes small and traceable, and avoid new abstractions unless they clearly simplify the existing site.
- Work mobile-first, verify UI changes with playwright-cli skill, and refresh `output/site` after relevant site changes so local preview, CI, and deployment stay aligned.

## Editing Conventions

### Repo And Files

- This is a static 11ty site with no backend or infrastructure layer.
- Use the existing build, preview, and CI workflows; do not introduce extra toolchains, frameworks, or backend-style abstractions.
- Treat `.nvmrc` as the source of truth for Node locally and in CI.

### 11ty Patterns And Content Model

- `src/index.md` and `src/en/index.md` stay thin page shells; page content belongs primarily in `*.11tydata.json`, Markdown, or other template-scoped data files.
- `src/index.11tydata.json` contains the German content and `src/en/index.11tydata.json` the English variant.
- `src/_includes/` should render content, not store it; keep includes presentation-focused and let includes/macros encapsulate rendering rather than authorable copy.
- Components under `src/_includes/` expect structured data for navigation, quick facts, talks, FAQ items, and supporting program entries.
- Model repeated content as arrays or objects, not HTML strings; only use freeform HTML in data when a structured alternative would be disproportionately complex.
- Move shared labels, URLs, or metadata into `src/_data/` only when they are genuinely reused across multiple places.
- When editing, decide whether the change is content, structure, or styling first: prefer data/Markdown edits, change templates only when structure or reuse needs it, and add CSS or JS afterwards in a targeted way.

### Pages CMS

- `.pages.yml` is the curated Pages CMS editing surface and should stay aligned with the live 11ty content model.
- Keep `.pages.yml` consistent with the current `src/index.11tydata.json` structure, but it does not need to expose every field one-to-one.
- If content is expected to be editor-managed, make sure both the data model and any referenced assets are represented correctly in `.pages.yml`.

### Assets

- Prefer local fonts, images, and other assets over remote runtime dependencies.
- Use the existing asset locations: `src/images/`, `src/assets/css/`, `src/assets/sass/`, `src/assets/fonts/`, and `src/assets/js/`.
- Let 11ty passthrough copy handle static theme assets such as JS and webfonts instead of adding duplicate copy stages.
- Keep asset names clear and stable, avoid generic copies, and do not reorganize theme assets without a clear reason.
- Hero images must crop well on mobile and desktop; remove unused assets during larger cleanup when it is clearly safe.

### Playwright Verification While Editing

- Use Playwright-cli for all UI-affecting changes and check at least mobile and tablet; include desktop when the header, hero, navigation, or other full-width layout is affected.
- Confirm there is no normal-use horizontal overflow
- If Playwright verification cannot be completed, record the blocker clearly.

### Playwright Verification After Editing

- In addition to playwright-cli run the playwright test suite against the built site served from `output/site`,
- If necessary, update intentional visual snapshots in the same change.
- For accessibility work, keep the page passing `tests/e2e/accessibility.spec.ts`, which currently runs Axe with `wcag2a`, `wcag2aa`, and `best-practice` tags and disables `color-contrast`.

### Build And Deployment

- Run the build after changes, build the preview into `output/site/`, and review the generated output there.
- Keep deployment output rooted in `output/site`, use root-relative paths rather than a `/TRK26/` prefix, and verify generated HTML still points to `/assets/...` after deployment-related changes.
- Review responsive behavior at least on mobile and tablet before considering the work finished.

### GitHub CI

- Keep local verification aligned with `.github/workflows/ci.yaml`, which runs formatting, builds the site, runs the full Playwright suite, uploads `output/site` for Pages, and deploys on `main`.
- After deploys on `main`, CI also runs the production smoke test via `npm run test:e2e:prod-smoke`.
- Dependabot automation is already covered by `.github/workflows/dependabot-automerge.yaml` and `.github/workflows/dependabot-refresh.yaml`; do not add parallel workflows for the same jobs.

## Frontend Conventions

### Design

- Preserve the existing editorial, poster-like visual language unless the task is an explicit redesign.
- Mobile-first layout decisions should scale deliberately to tablet and desktop; treat tablet as a first-class breakpoint, not a passive in-between state.
- Keep desktop line lengths controlled, sections clearly separated without heavy dividers, cards and FAQ/info elements compact, and full-bleed sticky-nav treatments aligned to the main content width.
- Build hierarchy through typography, spacing, and restrained accents rather than saturated blocks, and avoid glossy or generic SaaS-style components that clash with the current type and palette.
- Use overlays sparingly and review hero, navigation, talk cards, and FAQ sections for overflow or awkward density.

### Accessibility

- Do not rely on color alone to communicate meaning, and review text contrast manually when changing palettes or overlays even though automated Axe currently skips `color-contrast`.
- Only place text on images or glass-like surfaces when readability is stable, keep long-form text easy to scan through spacing and line length, and make touch targets work comfortably on mobile.
- Sticky navigation must not cover anchor targets, hover-only affordances must degrade cleanly on touch, and tooltip imagery should add context rather than duplicate visible text.
- Align markup with those checks: prefer native semantics over ARIA, keep landmarks valid and clearly named, maintain a logical heading structure with a clear page-level heading, give interactive controls discernible names, use correct alt text, keep ARIA roles/states/IDs valid, and preserve keyboard access plus visible focus states.
