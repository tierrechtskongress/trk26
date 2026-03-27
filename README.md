# Tierrechtskongress Leipzig

This repository contains the static 11ty site for the Tierrechtskongress Leipzig.

- Live site: <https://tierrechtskongress.org/>
- Repository: <https://github.com/tierrechtskongress/trk26>

## Local Development

Start the local preview workflow:

```bash
npm run dev
```

The site is then available at `http://localhost:4000/`.

To mirror the GitHub CI checks before you push, run:

```bash
npm run check:ci
```

If you want that to happen automatically on every commit, install the repo hook once per clone:

```bash
npm run hooks:install
```

That enables the versioned [`pre-commit` hook](.githooks/pre-commit), which runs Prettier, the production build, and the full Playwright suite before the commit is created.

## Build

Build the site into `output/site/`:

```bash
npm run build
```

## Deployment

Deployment runs via GitHub Pages using `.github/workflows/deploy.yaml`.
Pushes to `main` trigger a build and deploy from `output/site/`.

## Content Management

Content is updated using PagesCMS.

## License

Project-specific code, content, configuration, and documentation are provided under MIT.
Inherited theme-derived assets from HTML5 UP Stellar remain under CC BY 3.0.
See [LICENSE](LICENSE) for details.
