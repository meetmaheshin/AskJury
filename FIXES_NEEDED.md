# Immediate Fixes Needed

## ✅ FIXED - Backend CORS
- **Status**: Fixed and pushed to GitHub
- **Action**: Railway will auto-deploy in ~2-3 minutes
- **Wait for**: Railway backend deployment to complete

---

## 🔴 ISSUE 1: askjury.com redirects to recourseai.com

### Problem:
Your domain `askjury.com` (without www) is pointing to someone else's website.

### Solution - Fix DNS Configuration:

1. **Login to your domain registrar** (where you bought askjury.com)
   - Could be: GoDaddy, Namecheap, Google Domains, etc.

2. **Go to DNS Management / DNS Settings**

3. **Add/Update these DNS records:**

   **For askjury.com (apex/root domain):**
   ```
   Type: A Record
   Host: @ (or leave blank)
   Points to: [Your Hostinger Server IP]
   TTL: 3600
   ```

   **For www.askjury.com:**
   ```
   Type: CNAME
   Host: www
   Points to: askjury.com
   TTL: 3600
   ```

4. **Get Your Hostinger IP Address:**
   - Login to Hostinger hPanel
   - Go to "Hosting" → Click on your hosting plan
   - Look for "Server IP" or "IP Address"
   - Copy that IP address
   - Use it in the A Record above

5. **Alternative - Use Hostinger Nameservers:**

   If you prefer, you can point your entire domain to Hostinger:

   - In your domain registrar, find "Nameservers" or "DNS Servers"
   - Change to Hostinger's nameservers:
     ```
     ns1.dns-parking.com
     ns2.dns-parking.com
     ```
   - Then manage DNS in Hostinger hPanel

### Important:
- DNS changes can take 5-60 minutes to propagate
- Clear your browser cache after changes
- Use incognito mode to test

---

## 🔴 ISSUE 2: Railway Backend Loading Frontend UI

### Problem:
`https://askjury-production.up.railway.app/api/health` is loading your frontend UI instead of returning API JSON response.

### Diagnosis:
This means Railway is deploying the wrong service or using the wrong project root.

### Solution:

#### Check Railway Backend Service Configuration:

1. **Go to Railway Dashboard**: https://railway.app
2. **Select your project**: prolific-balance
3. **Click on the BACKEND service** (AskJury - the one with PostgreSQL)
4. **Go to Settings tab**
5. **Check "Root Directory":**
   - Should be set to: `backend`
   - If it's empty or `/`, change it to `backend`

6. **Check "Start Command":**
   - Should be: `npm start`
   - Or blank (nixpacks will auto-detect)

7. **Go to Variables tab**
8. **Add these environment variables** if not present:
   ```
   NODE_ENV=production
   PORT=3001
   ```

9. **Important - Check Service Type:**
   - In Settings, under "Networking"
   - Make sure it's set to "Public" and has a domain generated

10. **Redeploy:**
    - Go to Deployments tab
    - Click "Deploy" button (or it should auto-deploy after git push)

#### Alternative: Delete and Recreate Backend Service

If the above doesn't work:

1. **Before deleting - Save these:**
   - All environment variables (DATABASE_URL, CLOUDINARY, JWT_SECRET, etc.)
   - Screenshot them or copy to notepad

2. **Delete the backend service**

3. **Create new service:**
   - Click "+ New Service"
   - Connect to your GitHub repo
   - Select "Deploy from a GitHub repo"
   - Choose: meetmaheshin/AskJury
   - **Set Root Directory**: `backend`
   - Add all environment variables back
   - Deploy

---

## 🔴 ISSUE 3: CORS Errors (Being Fixed)

### Status: ✅ FIXED - Waiting for deployment

I've already pushed a fix. Railway will auto-deploy in 2-3 minutes.

**To verify the fix worked:**

1. Wait 3-5 minutes for Railway deployment
2. Open: https://askjury-production.up.railway.app/api/health
3. Should see JSON: `{"status":"ok","message":"Jury API is running"}`
4. If you still see frontend HTML, Issue #2 needs fixing first

---

## 📋 ACTION CHECKLIST

Do these in order:

### Step 1: Fix Railway Backend (Most Important)
- [ ] Go to Railway backend service Settings
- [ ] Set Root Directory to `backend`
- [ ] Add `NODE_ENV=production` variable
- [ ] Verify `/api/health` returns JSON (not HTML)

### Step 2: Wait for CORS Fix Deployment
- [ ] Wait 3-5 minutes for auto-deployment
- [ ] Check Railway deployment logs for success
- [ ] Test: https://askjury-production.up.railway.app/api/health

### Step 3: Fix Domain DNS
- [ ] Get Hostinger server IP from hPanel
- [ ] Update DNS A record for askjury.com
- [ ] Wait 10-30 minutes for DNS propagation
- [ ] Test: https://askjury.com (should show your site, not recourseai)

### Step 4: Test Everything
- [ ] Visit https://www.askjury.com
- [ ] Open browser console (F12)
- [ ] Should see NO CORS errors
- [ ] Cases should load on homepage
- [ ] Try logging in

---

## 🆘 QUICK TESTS

### Test 1: Backend API Working
```
Visit: https://askjury-production.up.railway.app/api/health
Expected: {"status":"ok","message":"Jury API is running"}
Current: Shows HTML (frontend UI) ❌
```

### Test 2: CORS Working
```
1. Visit: https://www.askjury.com
2. Open Console (F12)
3. Look for CORS errors
Expected: No CORS errors
Current: CORS errors ❌ (fix deployed, waiting)
```

### Test 3: Domain Working
```
Visit: https://askjury.com (without www)
Expected: Your website loads
Current: Redirects to recourseai.com ❌
```

---

## 🎯 SUMMARY

**Priority Order:**
1. **Fix Railway backend service** (Root Directory = `backend`)
2. **Wait for CORS deployment** (automatic, 3-5 mins)
3. **Fix domain DNS** (point askjury.com to Hostinger IP)

**After all fixes:**
- askjury.com → Your site on Hostinger
- www.askjury.com → Your site on Hostinger
- Backend API → Working on Railway
- No CORS errors
- Everything connected properly!

---

## Need Help?

If you get stuck:
1. Take screenshots of Railway service settings
2. Check Railway deployment logs
3. Check browser console errors
4. Let me know which step failed
