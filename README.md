# Tierrechtskongress Leipzig

This repository contains the static 11ty site for the Tierrechtskongress Leipzig.

- Live site: <https://tierrechtskongress.org/>
- Repository: <https://github.com/veganinleipzig/TRK26>

## Project Shape

- Source content, templates, styles, and assets live under `src/`.
- The root-hostable preview and deploy output is generated into `output/site/`.
- Pages CMS content structure is defined in `.pages.yml`.

## Local Development

Start the local preview workflow:

```bash
npm run dev
```

The site is then available at `http://localhost:4000/`.

## Build

Build the site into `output/site/`:

```bash
npm run build
```

## Deployment

Deployment runs via GitHub Pages using `.github/workflows/deploy.yaml`.
Pushes to `main` trigger a build and deploy from `output/site/`.

## License

Project-specific code, content, configuration, and documentation are provided under MIT.
Inherited theme-derived assets from HTML5 UP Stellar remain under CC BY 3.0.
See [LICENSE](LICENSE) for details.

## Notes

- `output/` is intentionally ignored by Git.
- UI-facing changes should be checked with Playwright before shipping.
