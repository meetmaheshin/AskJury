# Environment Variables Management Guide

## 📋 Overview

This project uses environment variables to store sensitive configuration data. **Never commit actual `.env` files to GitHub!**

## 🔧 Setup Instructions

### 1. Backend Environment Variables

Copy the example file and fill in your values:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your actual values:

```env
# Database Configuration
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/jury_db"

# Server Configuration
JWT_SECRET="generate-a-secure-64-character-random-string"
PORT=3001
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 2. Frontend Environment Variables

Copy the example file and fill in your values:

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env` with your actual values:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
```

## 🔒 Security Guidelines

### ✅ DO:
- Keep `.env` files in `.gitignore`
- Use `.env.example` files to document required variables
- Generate strong JWT secrets (64+ characters)
- Use different secrets for development and production
- Store production secrets securely (Railway, Vercel, etc.)

### ❌ DON'T:
- Commit actual `.env` files to version control
- Share environment variables in chat/email
- Use weak or default secret keys
- Hardcode sensitive data in source code

## 🚀 Deployment Environment Variables

### For Railway.app:

1. **Backend Service Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=your-production-secret-64-chars-min
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
   (DATABASE_URL is provided automatically by Railway)

2. **Frontend Service Variables:**
   ```
   VITE_API_URL=https://your-backend.up.railway.app/api
   ```

### For VPS Deployment:

Create `.env` files manually on the server (don't upload them):

```bash
# On your VPS
nano /var/www/askjury/backend/.env
# Paste production values

nano /var/www/askjury/frontend/.env
# Paste production values
```

## 🔑 Generating Secure Secrets

### JWT Secret Generation:

**PowerShell (Windows):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

**Linux/Mac:**
```bash
openssl rand -base64 48
```

**Online (use with caution):**
- https://generate-secret.vercel.app/64

## 📁 File Structure

```
project/
├── backend/
│   ├── .env              # Your actual secrets (NEVER commit)
│   └── .env.example      # Template file (commit this)
├── frontend/
│   ├── .env              # Your actual config (NEVER commit)
│   └── .env.example      # Template file (commit this)
└── .gitignore            # Excludes .env files
```

## 🔍 Troubleshooting

### Environment Variables Not Loading?

1. **Check file location:**
   - Backend: `backend/.env`
   - Frontend: `frontend/.env`

2. **Check file format:**
   ```env
   # Correct format
   KEY=value
   
   # Wrong format
   KEY = value  (no spaces around =)
   KEY="value with spaces"  (quotes when needed)
   ```

3. **Check if variables are accessed correctly:**
   - Backend: `process.env.JWT_SECRET`
   - Frontend: `import.meta.env.VITE_API_URL`

### Common Errors:

- `JWT_SECRET is undefined` → Check backend/.env file
- `VITE_API_URL is undefined` → Check frontend/.env file
- `Database connection failed` → Check DATABASE_URL format
- `Cloudinary not configured` → Check Cloudinary credentials

## 📞 Support

If you need help with environment variables:
1. Check this guide first
2. Verify your `.env` file format
3. Make sure you're not committing sensitive data
4. Generate new secrets if they were exposed

---

**Remember: Keep your secrets secret! 🔐**