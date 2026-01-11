#!/bin/bash

# Password Manager PWA Deployment Script
# This script helps you deploy the application to a server

set -e

echo "🚀 Password Manager PWA - Deployment Script"
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi
print_success "Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi
print_success "Docker Compose is installed"

# Ask for deployment type
echo ""
echo "Select deployment type:"
echo "1) Build and start (Development)"
echo "2) Production deployment with rebuild"
echo "3) Stop the application"
echo "4) Restart the application"
echo "5) View logs"
echo "6) Update and redeploy"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo "Building and starting Docker containers..."
        docker-compose up --build -d
        print_success "Application started successfully!"
        echo ""
        echo "🌐 Access your app at: http://localhost:3000"
        ;;
    2)
        echo ""
        echo "Production deployment..."
        echo "Stopping existing containers..."
        docker-compose down
        echo ""
        echo "Building production image..."
        docker-compose build --no-cache
        echo ""
        echo "Starting production containers..."
        docker-compose up -d
        print_success "Production deployment successful!"
        echo ""
        echo "🌐 Access your app at: http://localhost:3000"
        ;;
    3)
        echo ""
        echo "Stopping containers..."
        docker-compose down
        print_success "Application stopped!"
        ;;
    4)
        echo ""
        echo "Restarting containers..."
        docker-compose restart
        print_success "Application restarted!"
        echo ""
        echo "🌐 Access your app at: http://localhost:3000"
        ;;
    5)
        echo ""
        echo "Viewing logs (Press Ctrl+C to exit)..."
        docker-compose logs -f
        ;;
    6)
        echo ""
        echo "Updating and redeploying..."
        echo "Pulling latest changes..."
        git pull || print_warning "Not a git repository or no changes to pull"
        echo ""
        echo "Stopping existing containers..."
        docker-compose down
        echo ""
        echo "Building new image..."
        docker-compose build --no-cache
        echo ""
        echo "Starting containers..."
        docker-compose up -d
        print_success "Update and redeployment successful!"
        echo ""
        echo "🌐 Access your app at: http://localhost:3000"
        ;;
    *)
        print_error "Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "=============================================="
echo "✨ Deployment completed!"
echo ""
echo "Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop app: docker-compose down"
echo "  - Restart app: docker-compose restart"
echo "  - View status: docker-compose ps"
echo ""
