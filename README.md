# Portfolio - Master Supakon Karanyawad (Get)

> Modern portfolio website showcasing front-end development skills and projects

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)

![CI Pipeline](https://github.com/Thaiseboy/portfolio-thaiseboy/workflows/CI%20Pipeline/badge.svg)
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-NETLIFY-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-NETLIFY-SITE-NAME/deploys)

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

## Quick Start

```bash
# Development
pnpm install
cp .env.example .env  # Configure your Sanity CMS variables
pnpm run dev

# Docker (Production)
cp .env.example .env  # Configure your Sanity CMS variables
./docker-scripts.sh prod

# Docker (Development)
./docker-scripts.sh dev
```

## Development

```bash
pnpm run dev      # Start development server
pnpm run build    # Build for production
pnpm run lint     # Run ESLint
pnpm run test     # Run tests
```

## Docker Commands

```bash
# Production (localhost:3000)
docker-compose up -d portfolio

# Development with hot reload (localhost:8080)
docker-compose --profile dev up portfolio-dev

# Stop containers
docker-compose down
```

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

### Working with Feature Branches

```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push to GitHub
git push -u origin feature/your-feature-name

# Create Pull Request on GitHub
# - CI will run automatically
# - Netlify will create preview deployment
# - Review the preview URL before merging

# After PR approval, merge to main
# - Production will deploy automatically
```

### Environment Variables

For Netlify deployment, configure these in Netlify dashboard:
- `NODE_VERSION` - Set to "20" (configured in netlify.toml)
- Any Sanity.io API keys needed for builds

## Contact

**Master Supakon Karanyawad (Get)**

- **Email**: get_sarun@hotmail.com
- **LinkedIn**: [Get MS Karanyawad](https://www.linkedin.com/in/get-ms-karanyawad)
- **GitHub**: [Thaiseboy](https://github.com/Thaiseboy)

---

Built with Vue.js • TypeScript • Docker • Sanity CMS