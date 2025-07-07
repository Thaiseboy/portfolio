# Portfolio - Master Supakon Karanyawad (Get)

> Modern portfolio website showcasing front-end development skills and projects

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)

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
npm install
cp .env.example .env  # Configure your Sanity CMS variables
npm run dev

# Docker (Production)
cp .env.example .env  # Configure your Sanity CMS variables
./docker-scripts.sh prod

# Docker (Development)
./docker-scripts.sh dev
```

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
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

## Contact

**Master Supakon Karanyawad (Get)**

- **Email**: get_sarun@hotmail.com
- **LinkedIn**: [Get MS Karanyawad](https://www.linkedin.com/in/get-ms-karanyawad)
- **GitHub**: [Thaiseboy](https://github.com/Thaiseboy)

---

Built with Vue.js • TypeScript • Docker • Sanity CMS