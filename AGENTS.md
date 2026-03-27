# AGENTS

This file is the single source of truth for repository-specific working rules. It replaces the former `docs/` directory.

## Repo Rules

- This repository is a static 11ty site with no backend and no infrastructure concerns.
- Use the existing build and preview workflows instead of introducing new toolchains.
- Treat `.nvmrc` as the authoritative Node.js version for the repo and keep local tooling, CI, and any secondary version files aligned with it.
- Keep changes small, traceable, and close to established 11ty conventions.
- Work mobile-first and always check layout changes for small viewports.
- After relevant site changes, refresh `output/site` so preview and deployment stay in sync.
- Verify UI-affecting changes with Playwright before closing the task, especially for mobile or responsive fixes.

## Content Model

- Page content should primarily live in Markdown files, JSON files, or template-specific data files such as `*.11tydata.json`.
- Prefer content in Markdown, JSON, or template-specific data files such as `*.11tydata.json` instead of putting it directly in templates.
- Templates in `src/_includes/` should render content, not define it.
- Keep templates in `src/_includes/` presentation-focused; avoid maintaining content there.
- Repeated content blocks should be modeled as structured arrays or objects, not HTML strings.
- Only store freeform HTML in data when the alternative structure would be disproportionately complex.
- Keep `.pages.yml` aligned with the current `src/index.11tydata.json` structure so Pages CMS remains usable.
- Treat `.pages.yml` as a curated editing surface for Pages CMS; it should stay aligned with the live content model, but it does not need to expose every field from `*.11tydata.json` one-to-one.

## Current Project Pattern

- `src/index.md` remains the thin page shell for the German page.
- `src/index.11tydata.json` contains the German page content.
- `src/en/index.md` and `src/en/index.11tydata.json` contain the English page variant.
- `.pages.yml` mirrors the editable content structure for Pages CMS.
- Components in `src/_includes/` expect structured data for navigation items, quick facts, talks, FAQ items, and supporting program entries.
- Shared labels, URLs, or metadata should move into `src/_data/` only when they are reused across multiple places.

## Editing Workflow

- First determine whether a change is content, structure, or styling.
- Prefer editing content in Markdown or data files.
- Only change templates when structure or reuse needs to change.
- Add CSS or JS afterwards in a targeted way.
- Use the data cascade intentionally.
- Includes and macros should encapsulate rendering, not store content.
- Do not reintroduce editable site copy into templates when it already belongs in data files.
- Do not introduce backend or infrastructure abstractions.
- Do not add unnecessary frameworks or extra build steps.
- Only change existing paths, includes, or data structures when the benefit clearly outweighs the migration cost.

## Design Rules

- The project is mobile-first. Every layout decision should work on phones first and then scale up deliberately for tablets and desktops.
- The current visual language is editorial and poster-like. Preserve that direction unless there is an explicit redesign.
- Keep line lengths controlled on desktop; avoid overly long text rows.
- Sections should be clearly separated without heavy or dominant dividers.
- Desktop enhancements should be progressive, not desktop-first layouts patched later for mobile.
- Evolve existing components consistently instead of creating new variants for similar problems.
- Cards, FAQ boxes, and info elements should stay compact and avoid unnecessary vertical bulk.
- Use overlay effects sparingly and always validate readability.
- Preserve the editorial character: strong typography, restrained accents, and image-led composition should feel intentional rather than corporate.
- Use accent colors with restraint; they should guide, not dominate.
- Prioritize strong text contrast, especially on images and semi-transparent surfaces.
- Create visual hierarchy through size, weight, and spacing, not only through saturated color blocks.
- Do not introduce glossy or generic SaaS-style components that clash with the existing palette and type system.
- Review tablet behavior explicitly; do not treat it as a passive fallback between mobile and desktop.
- Avoid horizontal overflow in navigation, hero, talk cards, and FAQ sections.
- Desktop sticky navigation may use full-bleed background treatment, but its interactive content should stay aligned to the main content width.

## Accessibility

- Keep the heading hierarchy logical.
- Do not rely on color alone to communicate meaning.
- Link and button text must make their purpose clear.
- Text needs sufficient contrast against its background.
- Only place text on images or glass surfaces when readability is stable.
- Choose paragraph spacing and line lengths that keep longer content easy to scan.
- Jump navigation and expandable FAQ items must remain keyboard-accessible.
- Interactive elements need visible hover and focus states.
- Smooth scrolling must not make navigation feel slow or imprecise.
- Hover-only affordances such as hero tooltips must fail gracefully on touch devices and must not get stuck after click or focus changes.
- No horizontal scrolling should appear in normal usage.
- Keep touch targets large enough in mobile layouts.
- Sticky navigation must not cover target sections when jumping to anchors.
- Content-relevant images need meaningful alt text.
- Purely decorative images should not add unnecessary screen reader noise.
- Tooltip images should add useful context instead of duplicating visible text without purpose.

## Assets

- Prefer local fonts, images, and other assets over remote runtime dependencies.
- Local images live under `src/images/`.
- Styles live under `src/assets/css/` and `src/assets/sass/`.
- Local fonts live under `src/assets/fonts/`.
- JavaScript for static theme behavior lives under `src/assets/js/`.
- Generated preview output lives under `output/site/`.
- Let 11ty passthrough copy handle static theme assets such as `src/assets/js/` and `src/assets/webfonts/` instead of reintroducing extra copy scripts.
- Keep file names clear and stable.
- Add new assets with descriptive names instead of generic copies such as `final-new-new.jpg`.
- Hero images must work on both mobile and desktop; the important crop should not only read well at one breakpoint.
- Keep source images and intermediate working files understandable.
- Remove unused assets during larger cleanup work when it is clear they are no longer referenced.
- Do not reorganize existing theme assets without a clear reason.
- If a new asset becomes part of editor-managed content, ensure `.pages.yml` exposes it correctly through the existing media settings.

## Verification And Deployment

- Run the build after changes.
- Build the preview into `output/site/` and check changes there afterwards.
- Review responsive behavior at least for mobile and tablet.
- If content editing is expected in Pages CMS, keep `.pages.yml` aligned with the current data structure so the online editor matches the live 11ty content model.
- Keep deployment output rooted in `output/site/` and avoid duplicate copy or sync stages when 11ty passthrough can handle static assets directly.
- GitHub Pages consumes the same root-hostable site output via `.github/workflows/deploy.yaml`.
- The local preview should use root-relative paths and must not depend on a `/TRK26/` prefix.
- After deployment-related changes, verify that generated HTML in `output/site/` uses root-relative paths such as `/assets/...`.
