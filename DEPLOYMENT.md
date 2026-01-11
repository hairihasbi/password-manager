# 🚀 Password Manager PWA - Deployment Guide

Panduan lengkap untuk mendeploy Password Manager PWA ke production server agar bisa diakses oleh banyak orang.

## 📋 Prasyarat (Requirements)

### Untuk Semua Metode Deployment:
- **Server/VPS** dengan minimal:
  - 1 CPU Core
  - 1GB RAM
  - 20GB Storage
  - Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- **Domain name** (contoh: passwordmanager.com)
- **Akses root** atau **sudo** privileges
- **Basic knowledge** tentang terminal/command line

## 🔧 Metode Deployment

### Metode 1: Docker Deployment (Recommended) ⭐

Paling mudah dan direkomendasikan untuk production.

#### 1.1 Persiapan Server

```bash
# Update server
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user to docker group (optional but recommended)
sudo usermod -aG docker $USER

# Logout dan login kembali untuk apply group changes
```

#### 1.2 Deploy Aplikasi

```bash
# Clone atau upload kode ke server
git clone <repository-url> /opt/password-manager
cd /opt/password-manager

# Atau upload file manual
scp -r ./* user@server:/opt/password-manager/
```

```bash
# Deploy dengan script (cara termudah)
chmod +x deploy.sh
./deploy.sh
# Pilih opsi 2 untuk production deployment

# Atau deploy manual
docker-compose up -d --build
```

#### 1.3 Verifikasi Deployment

```bash
# Cek status container
docker-compose ps

# Lihat logs
docker-compose logs -f

# Test aplikasi
curl http://localhost:3000
```

### Metode 2: VPS Deployment dengan Docker & Nginx + SSL 🔒

Untuk production dengan domain dan SSL (HTTPS).

#### 2.1 Setup Docker (seperti Metode 1.1)

#### 2.2 Setup Domain DNS

1. Buka DNS manager di provider domain Anda (GoDaddy, Namecheap, dll)
2. Tambah **A Record**:
   - Type: A
   - Host: @ (atau www)
   - Value: IP address server Anda
   - TTL: 3600 (atau default)

#### 2.3 Setup SSL Certificate

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Gunakan script SSL yang sudah disediakan
chmod +x setup-ssl.sh
sudo ./setup-ssl.sh
# Masukkan domain dan email Anda

# Atau manual
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com
```

#### 2.4 Configure Nginx

```bash
# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/password-manager

# Edit config sesuai domain
sudo nano /etc/nginx/sites-available/password-manager
# Ganti 'your-domain.com' dengan domain Anda

# Enable site
sudo ln -s /etc/nginx/sites-available/password-manager /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

#### 2.5 Update Application URL

Edit `.env.production`:

```bash
# Copy example
cp .env.production.example .env.production

# Edit file
nano .env.production

# Update domain
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

#### 2.6 Deploy

```bash
# Build dan start
chmod +x deploy.sh
./deploy.sh
# Pilih opsi 2

# Atau manual
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### 2.7 Auto-Renew SSL

SSL dari Let's Encrypt berlaku 90 hari dan perlu diperbarui. Setup script sudah mengonfigurasi auto-renewal.

```bash
# Cek auto-renewal
sudo crontab -l
# Harusnya ada: 0 3 * * * certbot renew --quiet && systemctl reload nginx

# Test renew
sudo certbot renew --dry-run
```

### Metode 3: Cloud Platform Deployment ☁️

#### 3.1 DigitalOcean App Platform

1. Login ke DigitalOcean
2. Buat **App** baru
3. Connect repository (GitHub/GitLab/Bitbucket)
4. Configure:
   - Build Command: `bun run build`
   - Run Command: `bun run start`
   - HTTP Port: 3000
5. Add domain dan enable automatic HTTPS
6. Deploy!

#### 3.2 Railway

1. Login ke [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select repository
4. Railway otomatis mendeteksi Next.js
5. Add domain di settings
6. Deploy!

#### 3.3 Vercel (Easiest) ⭐⭐

Vercel adalah platform terbaik untuk Next.js apps.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

Atau via web:
1. Login ke [vercel.com](https://vercel.com)
2. New Project → Import repository
3. Configure environment variables
4. Deploy!

Vercel otomatis:
- CDN global
- Automatic HTTPS
- Auto-scaling
- Custom domain support

### Metode 4: Manual Deployment (Bare Metal)

Tanpa Docker, langsung di server.

#### 4.1 Install Dependencies

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Atau install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

#### 4.2 Setup Application

```bash
# Clone/upload code
git clone <repository-url> /opt/password-manager
cd /opt/password-manager

# Install dependencies
bun install

# Build application
bun run build

# Start production server
NODE_ENV=production bun run start
```

#### 4.3 Setup PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start app dengan PM2
pm2 start npm --name "password-manager" -- start

# Setup auto-restart on boot
pm2 startup
pm2 save

# View status
pm2 status
pm2 logs password-manager
```

## 🔥 Firewall Configuration

### UFW (Ubuntu)

```bash
# Enable firewall
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Check status
sudo ufw status
```

### firewalld (CentOS/RHEL)

```bash
# Enable ports
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Check status
sudo firewall-cmd --list-all
```

## 📊 Monitoring & Maintenance

### Docker Environment

```bash
# Check container status
docker-compose ps

# View real-time logs
docker-compose logs -f

# Restart container
docker-compose restart

# Stop container
docker-compose down

# Update and redeploy
./deploy.sh
# Pilih opsi 6

# Resource usage
docker stats
```

### PM2 Environment

```bash
# Status
pm2 status

# Logs
pm2 logs

# Restart
pm2 restart password-manager

# Stop
pm2 stop password-manager

# Restart app on file changes (development)
pm2 start npm --name "password-manager" -- start --watch

# Monitor
pm2 monit
```

### Health Check

```bash
# Basic health check
curl http://localhost:3000

# Check HTTP status
curl -I http://localhost:3000

# Detailed info
curl http://localhost:3000/health
```

## 🔐 Security Best Practices

### 1. SSL/HTTPS (Wajib untuk Production)
```bash
# Selalu gunakan HTTPS di production
# Let's Encrypt menyediakan SSL gratis
```

### 2. Firewall
```bash
# Hanya buka port yang diperlukan
# - 22 (SSH)
# - 80 (HTTP)
# - 443 (HTTPS)
```

### 3. Regular Updates
```bash
# Update system regularly
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d
```

### 4. Backup
```bash
# Backup application data
# Untuk Password Manager, data tersimpan di client (localStorage)
# Tapi backup kode dan config:

tar -czf password-manager-backup-$(date +%Y%m%d).tar.gz \
  /opt/password-manager \
  /etc/nginx/sites-available/password-manager \
  /etc/letsencrypt/live/your-domain.com
```

### 5. Rate Limiting (Opsional)
```nginx
# Tambah di nginx.conf
limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;

location / {
    limit_req zone=one burst=20 nodelay;
    # ... rest of config
}
```

## 🧪 Testing Production

### 1. Functionality Test

- Buka aplikasi di browser
- Coba tambah akun baru
- Test kirim ke WhatsApp
- Test backup & restore
- Test PWA install (di Android)

### 2. PWA Install Test (Mobile)

1. Buka app di Chrome Android
2. Klik menu (tiga titik)
3. Tap "Add to Home Screen" atau "Install"
4. Buka app dari home screen
5. Test semua fitur

### 3. SSL Test

```bash
# Check SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Atau online test
# https://www.ssllabs.com/ssltest/
```

### 4. Performance Test

```bash
# Basic load test
ab -n 100 -c 10 http://your-domain.com/
```

## 📈 Scaling

### Horizontal Scaling (Multiple Instances)

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app1:
    build: .
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production

  app2:
    build: .
    ports:
      - "3002:3000"
    environment:
      - NODE_ENV=production

  app3:
    build: .
    ports:
      - "3003:3000"
    environment:
      - NODE_ENV=production
```

Konfigurasi Nginx sebagai load balancer:

```nginx
upstream password_manager {
    least_conn;
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}
```

## 🚨 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs

# Check resource usage
docker stats

# Rebuild image
docker-compose build --no-cache
docker-compose up -d
```

### SSL Certificate Issues
```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew

# Check logs
sudo journalctl -u certbot.timer
```

### 502 Bad Gateway
```bash
# Check if app is running
docker-compose ps

# Check nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### PWA Won't Install
- Pastikan menggunakan HTTPS
- Check manifest.json accessibility
- Verify service worker registration
- Check browser console for errors

## 📞 Support & Resources

### Documentation:
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/docs/)

### Useful Tools:
- [SSL Labs Test](https://www.ssllabs.com/ssltest/)
- [GTmetrix](https://gtmetrix.com/) - Performance test
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - PWA test

## ✅ Deployment Checklist

Sebelum menganggap deployment selesai:

- [ ] App accessible di production URL
- [ ] SSL/HTTPS configured dan working
- [ ] All features tested (add, share, backup, restore)
- [ ] PWA installable di Android
- [ ] Firewall configured
- [ ] Auto-restart configured (Docker restart policy atau PM2)
- [ ] SSL auto-renewal configured
- [ ] Monitoring setup (logs, health check)
- [ ] Backup strategy in place
- [ ] Documentation updated

## 🎉 Selamat!

Aplikasi Password Manager PWA Anda sekarang sudah live dan bisa diakses oleh banyak orang di seluruh dunia!

---

**Catatan Penting:**
- Password Manager ini menyimpan data di client (browser localStorage)
- Setiap user memiliki data tersendiri
- Tidak ada server-side storage (lebih secure)
- PWA app bekerja offline dan sync saat online

**Need Help?**
- Check logs: `docker-compose logs -f`
- Check status: `docker-compose ps`
- Restart: `docker-compose restart`
