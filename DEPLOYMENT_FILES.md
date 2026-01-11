# 📦 Deployment Files

File-file yang diperlukan untuk mendeploy Password Manager PWA ke production server.

## 📄 Daftar File Deployment

### 1. **Dockerfile**
Konfigurasi Docker container untuk aplikasi Next.js.

**Fitur:**
- Multi-stage build (optimasi size)
- Bun runtime (super fast)
- Production-ready configuration
- Standalone output mode
- Non-root user untuk security

**Usage:**
```bash
docker build -t password-manager .
```

---

### 2. **docker-compose.yml**
Docker Compose configuration untuk easy deployment.

**Fitur:**
- Single command deployment
- Automatic restart policy
- Health check configuration
- Environment variables
- Port mapping

**Usage:**
```bash
docker-compose up -d
```

---

### 3. **deploy.sh** ⭐
Interactive deployment script untuk berbagai deployment scenarios.

**Fitur:**
- 6 deployment options:
  1. Build and start (Development)
  2. Production deployment with rebuild
  3. Stop the application
  4. Restart the application
  5. View logs
  6. Update and redeploy
- Auto-detect Docker dan Docker Compose
- Colored output untuk readability
- Error handling

**Usage:**
```bash
chmod +x deploy.sh
./deploy.sh
```

---

### 4. **.env.production.example**
Template environment variables untuk production.

**Variables:**
```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_NAME=Password Manager
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**Usage:**
```bash
cp .env.production.example .env.production
nano .env.production
# Edit values sesuai kebutuhan
```

---

### 5. **nginx.conf**
Nginx configuration untuk production dengan SSL dan security headers.

**Fitur:**
- HTTP to HTTPS redirect
- SSL/TLS configuration
- Security headers (X-Frame-Options, CSP, dll)
- Gzip compression
- WebSocket support
- PWA-specific caching headers
- Health check endpoint
- Reverse proxy to Next.js app

**Usage:**
```bash
# Copy ke nginx config directory
sudo cp nginx.conf /etc/nginx/sites-available/password-manager

# Edit domain
sudo nano /etc/nginx/sites-available/password-manager
# Ganti 'your-domain.com' dengan domain Anda

# Enable site
sudo ln -s /etc/nginx/sites-available/password-manager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### 6. **setup-ssl.sh** 🔒
Script untuk setup SSL certificate menggunakan Let's Encrypt.

**Fitur:**
- Automatic SSL certificate generation
- Domain validation
- Email notification setup
- Nginx integration
- Auto-renewal configuration via cron
- Colored output dan error handling

**Requirements:**
- Root access or sudo
- Domain name already pointing to server
- Port 80 accessible

**Usage:**
```bash
chmod +x setup-ssl.sh
sudo ./setup-ssl.sh
# Follow prompts
```

---

### 7. **.dockerignore**
File yang di-exclude dari Docker image build untuk optimasi size dan security.

**Excludes:**
- node_modules
- .next
- dev files (.env, logs, etc.)
- git files
- documentation
- test files

---

## 📖 Deployment Documentation

### **QUICK_START.md**
Panduan deployment singkat dan langsung ke inti.

**Covers:**
- Vercel deployment (termudah)
- Docker deployment
- Docker + Nginx + HTTPS
- Railway deployment
- Quick troubleshooting

**Untuk:** User yang ingin cepat deploy

---

### **DEPLOYMENT.md**
Panduan deployment lengkap dan detail.

**Covers:**
- Prerequisites
- 4 deployment methods:
  1. Docker (Recommended)
  2. Docker + Nginx + SSL
  3. Cloud platforms (DigitalOcean, Railway, Vercel)
  4. Manual deployment
- Firewall configuration
- Monitoring & maintenance
- Security best practices
- Scaling strategies
- Troubleshooting guide
- Deployment checklist

**Untuk:** User yang ingin kontrol penuh dan production-grade setup

---

## 🗂️ Struktur File Deployment

```
password-manager/
├── Dockerfile                          # Docker image configuration
├── docker-compose.yml                  # Docker Compose configuration
├── .dockerignore                       # Docker build excludes
├── deploy.sh                           # Interactive deployment script
├── setup-ssl.sh                       # SSL certificate setup script
├── nginx.conf                         # Nginx configuration
├── .env.production.example           # Environment template
├── QUICK_START.md                    # Quick deployment guide
├── DEPLOYMENT.md                     # Complete deployment guide
└── DEPLOYMENT_FILES.md               # This file
```

---

## 🚀 Cara Menggunakan

### Opsi 1: Paling Mudah - Vercel

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

*Tidak perlu file-file deployment di atas. Vercel handle everything.*

### Opsi 2: Docker di VPS

```bash
# 1. Install Docker di server
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Upload code ke server
scp -r ./* user@server:/opt/password-manager/
ssh user@server

# 3. Deploy
cd /opt/password-manager
chmod +x deploy.sh
./deploy.sh
# Pilih: 2 (Production deployment)
```

### Opsi 3: Docker + Nginx + SSL (Production Grade)

```bash
# 1. Setup domain DNS (A record ke server IP)

# 2. Setup SSL
chmod +x setup-ssl.sh
sudo ./setup-ssl.sh

# 3. Configure Nginx
sudo cp nginx.conf /etc/nginx/sites-available/password-manager
sudo nano /etc/nginx/sites-available/password-manager
# Edit: 'your-domain.com' → domain Anda
sudo ln -s /etc/nginx/sites-available/password-manager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 4. Deploy app
./deploy.sh
# Pilih: 2
```

---

## 🔧 Common Commands

### Docker
```bash
# Build dan start
docker-compose up -d --build

# Cek status
docker-compose ps

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down

# Update dan redeploy
./deploy.sh
# Pilih: 6
```

### Nginx
```bash
# Test config
sudo nginx -t

# Reload config
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

### SSL
```bash
# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# View certificates
sudo certbot certificates
```

---

## ✅ Pre-Deployment Checklist

Sebelum deploy, pastikan:

- [ ] **Domain** sudah di-setup dan pointing ke server (jika pakai custom domain)
- [ ] **Server/VPS** sudah tersedia dengan minimal 1CPU/1GB RAM
- [ ] **Docker** dan **Docker Compose** sudah terinstall (untuk Docker deployment)
- [ ] **Environment variables** sudah dikonfigurasi di `.env.production`
- [ ] **Port 80** dan **443** sudah open di firewall (untuk HTTPS)
- [ ] **Git** repository sudah siap (jika deploy dari git)

---

## 🎯 Rekomendasi Deployment

### Untuk Pemula:
**Platform:** Vercel
**Waktu:** 2-3 menit
**Biaya:** Gratis (personal projects)
**Complexity:** ⭐ Very Easy

### Untuk Production dengan Full Control:
**Platform:** Docker + VPS (DigitalOcean, Linode, Vultr)
**Waktu:** 15-30 menit
**Biaya:** $5-10/bulan
**Complexity:** ⭐⭐⭐ Moderate

### Untuk Team Collaboration:
**Platform:** Railway atau DigitalOcean App Platform
**Waktu:** 5-10 menit
**Biaya:** $5-20/bulan
**Complexity:** ⭐⭐ Easy

---

## 📞 Bantuan

Jika mengalami masalah:

1. **Cek logs:**
   ```bash
   docker-compose logs -f
   ```

2. **Check deployment guides:**
   - `QUICK_START.md` - Quick solution
   - `DEPLOYMENT.md` - Detailed guide

3. **Check component status:**
   ```bash
   # Docker
   docker-compose ps

   # Nginx
   sudo systemctl status nginx

   # SSL
   sudo certbot certificates
   ```

4. **Test connectivity:**
   ```bash
   curl http://localhost:3000
   curl -I https://your-domain.com
   ```

---

## 🎉 Happy Deploying!

Dengan file-file ini, Anda punya semua yang diperlukan untuk deploy Password Manager PWA ke production server. Pilih metode deployment yang sesuai dengan kebutuhan dan skill level Anda.

**Best of luck! 🚀**
