# Multi-stage build for production optimization
FROM node:18-alpine AS build-stage

# Set working directory
WORKDIR /app

# Copy package files for dependency caching
COPY package*.json ./

# Install dependencies (including dev for build)
RUN npm ci

# Copy source code
COPY . .

# Set build-time environment variables
ARG VITE_SANITY_PROJECT_ID
ARG VITE_SANITY_DATASET  
ARG VITE_SANITY_API_VERSION
ARG VITE_SANITY_USE_CDN

# Create production build
RUN npm run build

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