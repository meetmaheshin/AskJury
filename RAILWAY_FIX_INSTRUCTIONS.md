# URGENT FIX: Railway Backend Configuration

## 🔴 CONFIRMED ISSUE

Your Railway backend is serving **frontend HTML** instead of the **backend API**.

**Test Results:**
```
❌ https://askjury-production.up.railway.app/health
   Returns: HTML (frontend)
   Expected: JSON {"status":"ok"}

❌ https://askjury-production.up.railway.app/api/health
   Returns: HTML (frontend)
   Expected: JSON {"status":"ok","message":"Jury API is running"}
```

**Root Cause:**
Railway backend service is using the root directory, which has a `package.json` that points to frontend.

---

## ✅ FIX - Do This NOW in Railway Dashboard

### Step-by-Step Fix:

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Login to your account

2. **Select Your Project**
   - Click on project: **prolific-balance**

3. **Identify the Backend Service**
   - You should see 2 services:
     - One connected to PostgreSQL (this is your BACKEND)
     - One without database (this might be frontend)
   - Click on the one with **PostgreSQL** (AskJury service)

4. **Go to Settings Tab**
   - Look for **"Root Directory"** or **"Service Settings"**

5. **Set Root Directory**
   ```
   Root Directory: backend
   ```
   **Important**:
   - Type exactly: `backend` (lowercase, no slashes)
   - NOT `/backend` or `backend/` or `./backend`
   - Just: `backend`

6. **Add Environment Variables** (if not already there)
   Click on **Variables** tab and add:
   ```
   NODE_ENV=production
   ```

7. **Save and Redeploy**
   - Railway should automatically trigger a new deployment
   - If not, go to **Deployments** tab
   - Click **"Redeploy"** on the latest deployment

8. **Watch the Build Log**
   - Click on the deployment in progress
   - You should see:
     ```
     ✓ Building from: /backend
     ✓ Running npm install
     ✓ Running npx prisma generate
     ✓ Starting with: npm start
     ```
   - **Look for errors** in the log

9. **Wait for Deployment** (2-3 minutes)

10. **Verify the Fix**
    - Open: https://askjury-production.up.railway.app/api/health
    - Should see: `{"status":"ok","message":"Jury API is running"}`
    - NOT HTML!

---

## 📸 Visual Guide - What to Look For

### In Railway Settings:
```
┌─────────────────────────────────────┐
│ Service Settings                     │
├─────────────────────────────────────┤
│ Root Directory: [backend        ]   │  ← Type "backend" here
│                                      │
│ ☐ Watch Paths                       │
│                                      │
│ Start Command: [npm start       ]   │  ← Should be "npm start" or blank
│                                      │
└─────────────────────────────────────┘
```

### Expected Build Output:
```
Building...
==> Using Nixpacks
context: backend/                      ← Should say "backend/"
setup    │ nodejs_20
install  │ npm ci
build    │ npx prisma generate
start    │ npm start

Server running on port 8080
Environment: production
```

---

## 🧪 Test After Fix

Run this to verify:
```bash
node check-backend.js
```

Expected output:
```
✅ Backend is serving API (JSON response)
✅ API endpoint working correctly
✅ Valid JSON: { status: 'ok', message: 'Jury API is running' }
```

---

## 🚨 If Railway Settings Don't Have "Root Directory" Option

### Alternative: Use Service Variables

If you can't find "Root Directory" setting:

1. Go to **Variables** tab
2. Add this variable:
   ```
   RAILWAY_RUN_BUILD_COMMAND=cd backend && npm ci && npx prisma generate
   RAILWAY_RUN_START_COMMAND=cd backend && npm start
   ```

### Alternative: Create Separate Services

If nothing works, you may need to:
1. Delete current backend service
2. Create new service
3. When creating, select **"Deploy from GitHub"**
4. Choose your repo: meetmaheshin/AskJury
5. **Set Root Directory to: backend** during creation
6. Add all environment variables (DATABASE_URL, etc.)

---

## ⚠️ IMPORTANT: Don't Change Code Files

**DO NOT:**
- Modify package.json files
- Change nixpacks.toml
- Push new code

**The code is correct!**

The issue is purely **Railway service configuration**.

---

## 📋 Checklist

Before fixing:
- [ ] I can see the Railway dashboard
- [ ] I identified the backend service (with PostgreSQL)
- [ ] I opened Settings tab

During fix:
- [ ] Set Root Directory to `backend`
- [ ] Added NODE_ENV=production variable
- [ ] Saved changes
- [ ] Redeployed

After fix:
- [ ] Wait 3 minutes for deployment
- [ ] Test /api/health endpoint
- [ ] Verify JSON response (not HTML)
- [ ] Check browser console - CORS errors should be gone
- [ ] Test www.askjury.com - data should load

---

## 🆘 If You Get Stuck

Take screenshots of:
1. Railway service Settings tab (showing Root Directory field)
2. Railway deployment logs
3. The response from /api/health

Then I can help you further!

---

## Summary

**Problem**: Railway building from root → serving frontend
**Solution**: Set Root Directory to `backend` → serve API
**Result**: Backend works → CORS fixed → www.askjury.com loads data ✅
