# Backup & Restore Guide

## ✅ Backup Created: December 2, 2025

Your working production code has been backed up in multiple ways.

---

## Backup Locations

### 1. Git Tag: `v1.0.0-production`
This is a permanent snapshot of the working production code.

**To view this backup:**
```bash
git show v1.0.0-production
```

**To restore from this tag:**
```bash
git checkout v1.0.0-production
# Create a new branch from this point
git checkout -b restore-from-production
```

### 2. Backup Branch: `backup/production-stable-2025-12-02`
A dedicated branch with the stable production code.

**To restore from this branch:**
```bash
git checkout backup/production-stable-2025-12-02
# Or merge it into main if needed
git checkout main
git merge backup/production-stable-2025-12-02
```

### 3. GitHub Repository
Everything is backed up on GitHub: https://github.com/meetmaheshin/AskJury

**Releases page:**
https://github.com/meetmaheshin/AskJury/releases

---

## What's Backed Up

### Backend (Railway)
- ✅ Working Dockerfile with OpenSSL
- ✅ Prisma schema and migrations
- ✅ Express API with CORS configured
- ✅ All routes and controllers
- ✅ Authentication system

### Frontend (Hostinger)
- ✅ React + Vite application
- ✅ All components and pages
- ✅ Production build configuration
- ✅ Environment variables setup
- ✅ .htaccess for React Router

### Configuration
- ✅ Railway nixpacks.toml
- ✅ Frontend and backend package.json
- ✅ All environment configurations

---

## How to Restore Production State

### Scenario 1: Something Broke, Need to Rollback

```bash
# Save your current work (if needed)
git stash

# Go back to stable version
git checkout v1.0.0-production

# Create a new branch
git checkout -b emergency-rollback

# Push to deploy
git push origin emergency-rollback
```

Then update Railway to deploy from this branch.

### Scenario 2: Compare Current vs Stable

```bash
# See what changed since backup
git diff v1.0.0-production

# See list of changed files
git diff --name-only v1.0.0-production
```

### Scenario 3: Restore Specific File

```bash
# Restore a specific file from backup
git checkout v1.0.0-production -- path/to/file.js
```

---

## Production Deployment Info

### Live URLs
- Frontend: https://askjury.com
- Backend: https://askjury-production.up.railway.app/api

### Backend Configuration (Railway)
- Root Directory: `backend`
- Node Version: 18
- Dockerfile: Uses node:18-alpine + openssl
- Environment: production

### Frontend Configuration (Hostinger)
- Location: public_html/
- Build: Static files from dist/
- API URL: https://askjury-production.up.railway.app/api

---

## Database Backup

### Current Database
Railway PostgreSQL - Automatically backed up by Railway

### To Export Database:
```bash
# From Railway CLI or Dashboard
railway run -- npx prisma db pull
# This creates a schema.prisma from current database

# To dump data
railway run -- pg_dump $DATABASE_URL > backup.sql
```

### To Restore Database:
```bash
# Import SQL dump
railway run -- psql $DATABASE_URL < backup.sql
```

---

## Environment Variables Backup

Make sure you have these saved somewhere secure (NOT in git):

### Backend (Railway)
- DATABASE_URL (auto-set by Railway)
- JWT_SECRET
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- NODE_ENV=production

### Frontend
- VITE_API_URL=https://askjury-production.up.railway.app/api

---

## Recovery Checklist

If something goes wrong:

- [ ] Check which version is deployed: `git log -1`
- [ ] Verify backup exists: `git tag` and `git branch -a`
- [ ] Checkout stable version: `git checkout v1.0.0-production`
- [ ] Test locally before redeploying
- [ ] Update Railway deployment (if needed)
- [ ] Rebuild frontend and upload to Hostinger
- [ ] Verify site is working

---

## Future Backups

Before making major changes:

```bash
# Create new tag
git tag -a v1.1.0-new-feature -m "Description of changes"
git push origin v1.1.0-new-feature

# Or create new backup branch
git checkout -b backup/before-major-change
git push origin backup/before-major-change
git checkout main
```

---

## Contact Info

- GitHub Repo: https://github.com/meetmaheshin/AskJury
- Backup created: December 2, 2025
- Status: ✅ Production stable and backed up
