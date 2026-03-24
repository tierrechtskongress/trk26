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
