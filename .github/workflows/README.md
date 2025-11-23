# GitHub Actions Workflows

This directory contains automated workflows for CI/CD, dependency management, and PR automation.

## Workflows Overview

### 1. CI Pipeline (`ci.yml`)

**Triggers:**
- Push to any branch
- Pull requests to `main`

**Jobs:**
- **Test & Lint**
  - Installs dependencies with pnpm
  - Runs ESLint for code quality
  - Executes unit tests
  - Generates test coverage report
  - Builds production bundle

- **Build Information** (PRs only)
  - Posts deployment info comment on PR
  - Notifies about Netlify preview deployment

**Configuration:**
- Node.js: v20
- Package Manager: pnpm v10.9.0
- Caches dependencies for faster runs

### 2. PR Auto Labeler (`pr-labeler.yml`)

**Triggers:**
- PR opened, synchronized, or reopened

**Functionality:**
Automatically applies labels based on changed files:
- `dependencies` - package.json, pnpm-lock.yaml
- `documentation` - Markdown files
- `styling` - CSS/SCSS files
- `vue-components` - Component files
- `views` - View files
- `tests` - Test files
- `ci/cd` - Workflow and config files
- `assets` - Images and static files
- `config` - Configuration files

**Configuration:** See `.github/labeler.yml`

### 3. Dependabot (`dependabot.yml`)

**Schedule:** Weekly on Mondays at 09:00

**Updates:**
- npm/pnpm packages (max 5 PRs)
- GitHub Actions versions (max 3 PRs)

**Settings:**
- Versioning strategy: Increase (always upgrade)
- Commit prefix: `chore`
- Auto-assigned to: @mastersupakonkaranyawad
- Auto-labeled with `dependencies` and `automated`

## Netlify Configuration

**File:** `netlify.toml` (project root)

**Contexts:**
1. **Production** - `main` branch
   - Builds with: `pnpm run build`
   - Deploys to: getdeveloper.nl

2. **Deploy Preview** - Pull requests
   - Creates unique preview URL
   - Same build command as production

3. **Branch Deploy** - Feature branches
   - Each branch gets own URL
   - Format: `branch-name--portfolio.netlify.app`

**Features:**
- SPA redirect rules (Vue Router support)
- Security headers (XSS, Frame Options, etc.)
- Asset caching (1 year for static assets)
- Node 20 environment

## Required Permissions

All workflows use `GITHUB_TOKEN` with:
- `contents: read` - Read repository content
- `pull-requests: write` - Comment and label PRs

## Local Testing

Before pushing, run the same checks locally:

```bash
# Run all checks that CI will run
pnpm install
pnpm run lint
pnpm run test
pnpm run test:coverage
pnpm run build
```

## Troubleshooting

### CI Fails on Lint
```bash
# Fix auto-fixable issues
pnpm run lint --fix
```

### CI Fails on Tests
```bash
# Run tests locally with verbose output
pnpm run test -- --reporter=verbose
```

### Build Fails
```bash
# Check build locally
pnpm run build
# Check for TypeScript errors if using TS
```

### Dependabot PRs Failing
- Dependabot PRs run through CI
- Check CI logs for specific failures
- May need to update breaking changes manually

## Adding New Workflows

1. Create `.yml` file in `.github/workflows/`
2. Define trigger events (`on:`)
3. Add jobs and steps
4. Test with draft PRs first
5. Document in this README

## Status Badges

Add to main README.md:

```markdown
![CI](https://github.com/Thaiseboy/portfolio-thaiseboy/workflows/CI%20Pipeline/badge.svg)
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE/deploys)
```

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Netlify Build Configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
