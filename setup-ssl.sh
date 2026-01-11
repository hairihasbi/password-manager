#!/bin/bash

# SSL Setup Script for Password Manager PWA
# This script helps you set up SSL certificates using Let's Encrypt

set -e

echo "🔒 SSL Setup Script for Password Manager PWA"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root or with sudo"
    exit 1
fi

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "Certbot not found. Installing..."
    apt update
    apt install -y certbot python3-certbot-nginx
    print_success "Certbot installed"
fi

# Ask for domain
echo ""
read -p "Enter your domain name (e.g., example.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    print_error "Domain name cannot be empty"
    exit 1
fi

# Ask for email
read -p "Enter your email for Let's Encrypt notifications: " EMAIL

if [ -z "$EMAIL" ]; then
    print_error "Email cannot be empty"
    exit 1
fi

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "Nginx not found. Installing..."
    apt install -y nginx
    print_success "Nginx installed"
fi

echo ""
echo "Setting up SSL certificate for $DOMAIN..."

# Obtain SSL certificate
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "$EMAIL"

if [ $? -eq 0 ]; then
    print_success "SSL certificate obtained successfully!"
    echo ""
    echo "Certificate files location:"
    echo "  - Certificate: /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
    echo "  - Private Key: /etc/letsencrypt/live/$DOMAIN/privkey.pem"
    echo ""
    echo "Next steps:"
    echo "1. Copy nginx.conf to /etc/nginx/sites-available/password-manager"
    echo "2. Replace 'your-domain.com' with '$DOMAIN' in the config"
    echo "3. Create symlink: ln -s /etc/nginx/sites-available/password-manager /etc/nginx/sites-enabled/"
    echo "4. Test nginx: nginx -t"
    echo "5. Reload nginx: systemctl reload nginx"
    echo ""
    print_success "SSL setup completed!"
else
    print_error "Failed to obtain SSL certificate"
    exit 1
fi

# Set up auto-renewal
echo ""
echo "Setting up auto-renewal..."
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | crontab -
print_success "Auto-renewal configured (runs daily at 3 AM)"

echo ""
echo "=============================================="
echo "✨ SSL setup completed!"
echo ""
echo "Your SSL certificate will automatically renew every 90 days."
echo ""
