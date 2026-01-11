# ⚡ Quick Start Deployment

Cara tercepat untuk deploy Password Manager PWA ke production server.

## 🚀 Cara Termudah: Vercel (Recommended)

Vercel adalah platform hosting terbaik untuk Next.js apps. Gratis, mudah, dan otomatis HTTPS.

### 1. Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy dari root project
vercel

# Production deploy
vercel --prod
```

### 2. Atau via Web Browser

1. Buka [vercel.com](https://vercel.com)
2. Sign up / Login
3. Klik "New Project"
4. Import dari GitHub/GitLab/Bitbucket
5. Vercel akan otomatically:
   - Detect Next.js
   - Build app
   - Deploy globally
   - Setup HTTPS

6. Selesai! App live dalam 2-3 menit

### 3. Setup Custom Domain (Opsional)

Di Vercel dashboard:
1. Settings → Domains
2. Add your domain (contoh: passwordmanager.com)
3. Update DNS records di domain provider
4. Vercel otomatis setup SSL

## 🐳 Cara Kedua: Docker (Untuk VPS)

### 1. Persiapan Server

```bash
# SSH ke server
ssh user@your-server-ip

# Update dan install Docker
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install docker-compose -y
```

### 2. Upload Code

```bash
# Clone dari git (jika ada)
git clone <repo-url> /opt/password-manager
cd /opt/password-manager

# ATAU upload manual dari komputer lokal
scp -r ./* user@your-server:/opt/password-manager/
ssh user@your-server
cd /opt/password-manager
```

### 3. Deploy

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
# Pilih: 2 (Production deployment)

# Atau manual
docker-compose up -d --build
```

### 4. Test

```bash
# Cek status
docker-compose ps

# Test aplikasi
curl http://localhost:3000
```

App sekarang accessible di: `http://your-server-ip:3000`

## 🔒 Docker + Nginx + HTTPS (Production Grade)

Untuk production dengan domain dan SSL.

### 1. Setup Domain DNS

Di DNS provider Anda, tambah A Record:
- Host: @ (atau www)
- Value: your-server-ip
- TTL: 3600

### 2. Setup SSL

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Setup SSL dengan script
chmod +x setup-ssl.sh
sudo ./setup-ssl.sh
# Masukkan domain dan email
```

### 3. Configure Nginx

```bash
# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/password-manager

# Edit config
sudo nano /etc/nginx/sites-available/password-manager
# Ganti 'your-domain.com' dengan domain Anda

# Enable site
sudo ln -s /etc/nginx/sites-available/password-manager /etc/nginx/sites-enabled/

# Test dan reload
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Deploy App

```bash
# Update .env.production
cp .env.production.example .env.production
nano .env.production
# Set: NEXT_PUBLIC_APP_URL=https://your-domain.com

# Deploy
./deploy.sh
# Pilih: 2 (Production deployment)
```

Selesai! App accessible di: `https://your-domain.com`

## 🌐 Railway (Alternatif Mudah)

Railway adalah platform PaaS yang sangat mudah.

1. Login ke [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Railway otomatis detect Next.js
4. Deploy!
5. Add custom domain di Settings

## 💰 Biaya Perbandingan

| Platform | Biaya Bulanan | Difficulty | Setup Time |
|----------|--------------|------------|------------|
| Vercel | $0-20 | ⭐ Very Easy | 2-3 menit |
| Railway | $5-20 | ⭐ Very Easy | 5 menit |
| Docker + VPS | $5-10 | ⭐⭐⭐ Moderate | 15-30 menit |

**Rekomendasi:**
- Untuk pemula: **Vercel** (gratis untuk personal projects)
- Untuk full control: **Docker + VPS**
- Untuk deployment cepat: **Railway**

## 📱 Test PWA di Production

Setelah deploy:

1. **Di Android:**
   - Buka app di Chrome
   - Ketik production URL
   - Klik menu (tiga titik)
   - Tap "Add to Home Screen" atau "Install App"
   - Buka dari home screen

2. **Test Fitur:**
   - Tambah akun baru
   - Kirim ke WhatsApp
   - Backup data
   - Restore data
   - Test offline (matikan internet, app tetap jalan)

## 🆘 Masalah?

```bash
# Cek logs
docker-compose logs -f

# Restart app
docker-compose restart

# Cek status
docker-compose ps

# View resource usage
docker stats
```

## ✅ Checklist

- [ ] App deployed dan accessible
- [ ] HTTPS enabled (opsional tapi direkomendasikan)
- [ ] PWA installable di Android
- [ ] All features tested

## 🎉 Selesai!

Aplikasi Password Manager PWA Anda sekarang live!

**Need More Details?**
- Baca `DEPLOYMENT.md` untuk panduan lengkap
- Check `deploy.sh` untuk deployment options
- Check `nginx.conf` untuk production setup
