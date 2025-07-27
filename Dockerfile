# Multi-stage build for production optimization
FROM node:20-alpine AS build-stage

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ autoconf automake libtool

# Set working directory
WORKDIR /app

# Copy package files for dependency caching
COPY package*.json ./

# Install dependencies (including dev for build)
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Set build-time environment variables
ARG VUE_APP_SANITY_PROJECT_ID
ARG VUE_APP_SANITY_DATASET  
ARG VUE_APP_SANITY_API_VERSION
ARG VUE_APP_SANITY_USE_CDN

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