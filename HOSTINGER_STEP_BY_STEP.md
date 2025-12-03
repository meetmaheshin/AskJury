# Hostinger Deployment - Step by Step Guide

## ✅ PREPARATION (Already Done)
- ✅ Frontend built successfully
- ✅ Backend running on Railway
- ✅ `.htaccess` file created
- ✅ Domain configured (askjury.com)

## 📂 FILES READY TO UPLOAD

Location: `C:\Users\LENOVO\DebateMe\frontend\dist\`

Files you'll upload:
```
dist/
├── index.html
├── .htaccess          (React Router support)
├── assets/
│   ├── index-DIW_9Du5.css
│   └── index-dzxZCfaO.js
```

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Login to Hostinger
1. Go to https://hpanel.hostinger.com
2. Login with your Hostinger account credentials
3. You should see your hosting dashboard

### Step 2: Open File Manager
1. In the Hostinger control panel (hPanel)
2. Look for **"Files"** section in the left sidebar
3. Click on **"File Manager"**
4. A new tab will open with the file manager interface

### Step 3: Navigate to public_html
1. In the File Manager, you'll see folders on the left
2. Click on **"public_html"** folder
3. This is where your website files go

### Step 4: Backup (Optional but Recommended)
1. If there are any files already in `public_html`:
   - Select all files (checkbox at top)
   - Click "Compress" button
   - Name it `backup_old_site.zip`
   - Download this backup to your computer

### Step 5: Clean public_html
1. Select all existing files in `public_html`
2. Click the **"Delete"** button (trash icon)
3. Confirm deletion
4. Now `public_html` should be empty

### Step 6: Upload Your Files
1. Click the **"Upload"** button at the top
2. A file upload dialog will appear

**IMPORTANT - Upload these files:**

**Method A: Upload All at Once (Easier)**
1. Navigate to: `C:\Users\LENOVO\DebateMe\frontend\dist\`
2. Select ALL files:
   - `index.html`
   - `.htaccess`
   - `assets` folder
3. Drag and drop into the upload area
4. Wait for upload to complete

**Method B: Upload One by One (If Method A doesn't work)**
1. First, upload `index.html`
2. Then upload `.htaccess`
3. Click "New Folder" and create folder named `assets`
4. Open the `assets` folder
5. Upload all files from your local `dist/assets/` folder

### Step 7: Verify File Structure
After upload, your `public_html` should look like:
```
public_html/
├── index.html          ← Must be here
├── .htaccess           ← Must be here
└── assets/             ← Folder
    ├── index-DIW_9Du5.css
    └── index-dzxZCfaO.js
```

**CRITICAL:**
- `index.html` must be directly in `public_html/`
- NOT in a subfolder like `public_html/dist/`

### Step 8: Set File Permissions (Usually not needed, but just in case)
1. Right-click on `index.html`
2. Click "Permissions"
3. Set to `644` (Read/Write for owner, Read for others)
4. Do the same for `.htaccess`

### Step 9: Test Your Website
1. Open a new browser tab (or incognito window)
2. Go to: **https://askjury.com**
3. The site should load!

---

## ✅ VERIFICATION CHECKLIST

After deployment, check these:

- [ ] Website loads at https://askjury.com
- [ ] Website loads at https://www.askjury.com
- [ ] Click around - pages should work (Home, Login, etc.)
- [ ] Press F12 (Developer Tools) → Console tab
- [ ] Check for errors (ignore warnings in yellow)
- [ ] Try to login/signup (to test backend connection)

---

## 🔧 TROUBLESHOOTING

### Problem: Website shows "Not Found" or default Hostinger page
**Solution:**
- Make sure `index.html` is directly in `public_html/`
- NOT in `public_html/dist/` or any subfolder
- Clear browser cache (Ctrl+F5)

### Problem: Home page works, but other pages show 404
**Solution:**
- Make sure `.htaccess` file exists in `public_html/`
- Check if the file uploaded correctly
- The filename must be exactly `.htaccess` (starts with a dot)

### Problem: Website loads but shows errors "Failed to load cases"
**Solution:**
- Open browser console (F12)
- Check if you see CORS errors
- Verify backend is running: https://askjury-production.up.railway.app/api/health
- If backend is down, go to Railway and check deployment logs

### Problem: Can't see .htaccess file in File Manager
**Solution:**
- In File Manager, click "Settings" (gear icon)
- Enable "Show hidden files"
- `.htaccess` should now be visible

### Problem: CSS/Styling not loading
**Solution:**
- Check if `assets` folder uploaded correctly
- Clear browser cache (Ctrl+F5)
- Right-click → Inspect Element → Network tab
- Reload page and check if CSS files are loading (status 200)

---

## 🗑️ DELETE RAILWAY FRONTEND (After Successful Hostinger Deployment)

1. Go to Railway dashboard: https://railway.app
2. Select your project (prolific-balance)
3. Click on the **frontend** service
4. Go to **Settings** tab
5. Scroll down to **Danger Zone**
6. Click **"Delete Service"**
7. Type the service name to confirm
8. Click Delete

**Keep the backend service running!** Only delete the frontend.

---

## 📊 YOUR FINAL SETUP

After completion:
```
Frontend (Hostinger)
  ↓
  askjury.com
  │
  └─→ Calls Backend API
      │
      Railway Backend
      ↓
      askjury-production.up.railway.app/api
      │
      └─→ Railway Database (PostgreSQL)
```

---

## 🆘 NEED HELP?

If something doesn't work:
1. Check the Troubleshooting section above
2. Open browser console (F12) and screenshot any errors
3. Check Railway backend logs for errors
4. Let me know what error you're seeing

---

## 📝 NOTES

- Your backend URL is: `https://askjury-production.up.railway.app/api`
- This is already configured in your frontend build
- No need to change anything in Hostinger settings
- Just upload the files as instructed

---

Good luck! 🚀
