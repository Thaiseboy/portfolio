# Portfolio - Master Supakon Karanyawad (Get)

> Modern portfolio website showcasing front-end development skills and projects

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)
![CI Pipeline](https://img.shields.io/github/actions/workflow/status/Thaiseboy/portfolio-thaiseboy/ci.yml?label=CI%20Pipeline&style=for-the-badge)
[![Netlify](https://img.shields.io/netlify/8dbb517f-9dce-4444-b7f0-d584c169b03d?style=for-the-badge)](https://app.netlify.com/sites/portfolio-thaiseboy/deploys)

**[Live Demo →](https://getdeveloper.nl)**

## Features

- **Vue 3 Composition API** with TypeScript support
- **Responsive Design** - Mobile-first approach
- **Docker Ready** - Production and development containers
- **Headless CMS** - Dynamic content with Sanity.io
- **Performance Optimized** - Fast loading and SEO ready

## Tech Stack

- **Frontend**: Vue.js 3, TypeScript, Bootstrap 5, GSAP
- **CMS**: Sanity.io
- **DevOps**: Docker, Nginx
- **Deployment**: Netlify

## CI/CD Pipeline & Workflow

This project uses GitHub Actions and Netlify for automated testing, building, and deployment.

### Branch Strategy

- **`main`** - Production branch, auto-deploys to [getdeveloper.nl](https://getdeveloper.nl)
- **Feature branches** - Create from `main` for new features
- **Pull Requests** - Required for merging to `main`

### Automated Workflows

#### CI Pipeline
Every push and PR triggers:
- ESLint code quality checks
- Unit tests with coverage
- Production build verification

#### Deployment Environments

1. **Production** (main branch)
   - URL: https://getdeveloper.nl
   - Auto-deploys on merge to `main`

2. **Deploy Preview** (Pull Requests)
   - Netlify creates unique preview URL for each PR
   - Preview URL posted automatically in PR comments
   - Perfect for reviewing changes before merge

3. **Branch Deploys** (Feature branches)
   - Each feature branch gets its own deployment
   - Format: `branch-name--portfolio.netlify.app`
   - Great for testing features in isolation

#### PR Auto-Labeling
Pull requests are automatically labeled based on changed files:
- `dependencies` - package.json or pnpm-lock.yaml changes
- `documentation` - Markdown file changes
- `styling` - CSS/SCSS changes
- `vue-components` - Component changes
- `views` - View changes
- `tests` - Test file changes
- `ci/cd` - Workflow or config changes

#### Dependency Updates
Dependabot automatically:
- Checks for updates weekly (Monday 9:00)
- Creates PRs for npm package updates
- Updates GitHub Actions versions
- Limits to 5 open PRs max

## Contact

**Master Supakon Karanyawad (Get)**

- **Email**: get_sarun@hotmail.com
- **LinkedIn**: [Get MS Karanyawad](https://www.linkedin.com/in/get-ms-karanyawad)
- **GitHub**: [Thaiseboy](https://github.com/Thaiseboy)

---

Built with Vue.js • TypeScript • Docker • Sanity CMS
