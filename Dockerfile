# Multi-stage build for production optimization
FROM node:20-alpine AS build-stage

# Install build dependencies for native modules and pnpm
RUN apk add --no-cache python3 make g++ autoconf automake libtool && \
    corepack enable && \
    corepack prepare pnpm@10.9.0 --activate

# Set working directory
WORKDIR /app

# Copy package files for dependency caching
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies (including dev for build)
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Set build-time environment variables
ARG VUE_APP_SANITY_PROJECT_ID
ARG VUE_APP_SANITY_DATASET  
ARG VUE_APP_SANITY_API_VERSION
ARG VUE_APP_SANITY_USE_CDN

# Create production build
RUN pnpm run build

# Production stage with Nginx
FROM nginx:alpine AS production-stage

# Copy Vue build files to Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy Nginx configuration for Vue Router (SPA)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]