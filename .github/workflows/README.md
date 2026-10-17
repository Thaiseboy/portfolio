# GitHub Actions

## CI Pipeline (`ci.yml`)

**Runs on:** every push to a pull request targeting `main`, and every push to `main`.
Feature branches without a pull request do not start a run. A newer push cancels
a run that is still in progress for the same PR or branch.

**One job, "Test & Lint":**

1. Install dependencies with pnpm (version from `packageManager` in `package.json`)
2. `pnpm run lint`
3. `pnpm run test:coverage` (all tests, once, with coverage)
4. `pnpm run build:all` (site and Sanity Studio)

Node.js 22. The public Sanity project ID, dataset and API version are set in the
workflow; no secrets are needed to build.

## Dependabot (`../dependabot.yml`)

- **Schedule:** monthly
- **npm:** minor and patch updates bundled into one PR; major updates as separate PRs (max 3 open)
- **GitHub Actions:** all updates bundled into one PR
- Commit prefix `chore`, label `dependencies`

## Netlify

Netlify builds and deploys by itself (see `netlify.toml` in the project root):

- **Production:** `main` deploys to [getdeveloper.nl](https://getdeveloper.nl)
- **Deploy Preview:** every pull request gets its own preview URL, posted by the Netlify bot
- **Studio:** served at `/studio`, built by `pnpm run build:all`
- **Contact form:** the Netlify Function in `netlify/functions/contact.mjs` (`/api/contact`)

## Run the same checks locally

```bash
pnpm install
pnpm run lint
pnpm run test:coverage
pnpm run build:all
```
