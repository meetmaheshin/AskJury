# Frontend Deployment Instructions for Hostinger

## What's New
- ✅ **Pagination Feature**: Load More button to browse all 100+ cases
- ✅ **Sorting**: Latest cases first (works with Hot/New/Top tabs)
- ✅ **100 cases** are now live on the backend!

## Files to Upload

The production build is ready in: `frontend/dist/`

You can also use the compressed archive: `askjury-frontend-build.tar.gz` (121 KB)

## Deployment Steps for Hostinger

### Option 1: Using File Manager (Recommended)

1. **Login to Hostinger**
   - Go to hPanel (Hostinger control panel)
   - Navigate to **File Manager**

2. **Navigate to your public_html folder**
   - Usually: `public_html/` or `domains/yourdomain.com/public_html/`

3. **Backup current files** (important!)
   - Select all files in public_html
   - Right-click → "Compress" → Create backup.zip
   - Download the backup to your computer

4. **Clear old files**
   - Delete all files in public_html (except .htaccess if present)

5. **Upload new build**
   - Click "Upload" button
   - Upload `askjury-frontend-build.tar.gz`
   - Right-click the uploaded file → "Extract"
   - Delete the .tar.gz file after extraction

### Option 2: Using FTP

1. **Connect via FTP**
   - Host: Your domain or ftp.yourdomain.com
   - Username: Your Hostinger username
   - Password: Your Hostinger password
   - Port: 21

2. **Navigate to public_html**

3. **Backup** - Download all current files first!

4. **Upload contents of `frontend/dist/`**
   - Upload ALL files from `frontend/dist/` to public_html
   - Overwrite existing files

## Verify Deployment

1. Visit your website URL
2. Open browser DevTools (F12) → Network tab
3. Refresh the page
4. Check that `index-jVLD9AiU.js` is loaded (new bundle with pagination)
5. Scroll down - you should see **"Load More Cases"** button after 20 cases
6. Click it to load next 20 cases

## Files Included

```
index.html                    - Main HTML file
assets/index-jVLD9AiU.js     - JavaScript bundle (372KB) - NEW!
assets/index-QiYSMq9p.css    - Styles (41KB)
manifest.json                 - PWA manifest
sw.js                        - Service worker
favicon.svg                   - Favicon
robots.txt                    - SEO
sitemap.xml                   - SEO
```

## Rollback Plan

If something goes wrong:
1. Use the backup.zip you created
2. Extract it back to public_html
3. Your old version will be restored

## What Users Will See

### Before Pagination (Old):
- Only 20 cases visible
- No way to see more cases

### After Pagination (New):
- First 20 cases load immediately
- **"Load More Cases"** button appears at bottom
- Click to load next 20 cases
- Button shows loading spinner while fetching
- After 5 clicks, all 100 cases visible
- Message: "You've seen all cases in this category"

## Sorting Confirmation

✅ **"New" tab** - Shows latest cases first (sorted by createdAt descending)
✅ **"Hot" tab** - Shows popular recent cases
✅ **"Top" tab** - Shows highest engagement cases

---

**Build Date**: December 12, 2025
**Backend URL**: https://askjury-production.up.railway.app/api
**Total Cases Available**: 100+
