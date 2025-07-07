#!/bin/bash

# Portfolio Docker Scripts

case "$1" in
  "build")
    echo "🔨 Building production Docker image..."
    docker-compose build portfolio
    ;;
  "dev")
    echo "🚀 Starting development environment..."
    docker-compose --profile dev up portfolio-dev
    ;;
  "prod")
    echo "🚀 Starting production environment..."
    docker-compose up -d portfolio
    echo "Portfolio running on: http://localhost:3000"
    ;;
  "stop")
    echo "⏹️ Stopping all containers..."
    docker-compose down
    ;;
  "logs")
    echo "📋 Showing logs..."
    docker-compose logs -f portfolio
    ;;
  "clean")
    echo "🧹 Cleaning up..."
    docker-compose down --volumes --rmi all
    ;;
  *)
    echo "🐳 Portfolio Docker Commands:"
    echo "  ./docker-scripts.sh build  - Build production image"
    echo "  ./docker-scripts.sh dev    - Start development (localhost:8080)"
    echo "  ./docker-scripts.sh prod   - Start production (localhost:3000)"
    echo "  ./docker-scripts.sh stop   - Stop containers"
    echo "  ./docker-scripts.sh logs   - Show logs"
    echo "  ./docker-scripts.sh clean  - Clean up all"
    ;;
esac