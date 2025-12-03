# Deploy Frontend to Hostinger

## Prerequisites
- Hostinger hosting account with file manager or FTP access
- Your domain (askjury.com) configured in Hostinger

## Deployment Steps

### Option 1: Using Hostinger File Manager (Easiest)

1. **Login to Hostinger Control Panel**
   - Go to hPanel (Hostinger Control Panel)
   - Navigate to **Files > File Manager**

2. **Navigate to public_html**
   - Open the `public_html` folder (this is your website's root directory)
   - Delete any existing files in this folder (or backup first)

3. **Upload Your Built Files**
   - On your local computer, go to: `C:\Users\LENOVO\DebateMe\frontend\dist`
   - Select ALL files and folders inside the `dist` folder
   - Upload them to the `public_html` folder in Hostinger

   Files to upload:
   - `index.html`
   - `assets/` folder (containing CSS and JS files)
   - Any other files in the dist folder

4. **Important: Upload Structure**
   ```
   public_html/
   ├── index.html          <- Main file
   ├── assets/
   │   ├── index-DIW_9Du5.css
   │   └── index-dzxZCfaO.js
   └── (other files)
   ```

5. **Configure .htaccess for React Router**
   - Create a new file in `public_html` called `.htaccess`
   - Add this content:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### Option 2: Using FTP (Alternative)

1. **Get FTP Credentials**
   - In Hostinger hPanel, go to **Files > FTP Accounts**
   - Note your FTP hostname, username, and password

2. **Use an FTP Client**
   - Download FileZilla (https://filezilla-project.org/)
   - Connect using your FTP credentials
   - Upload files from `C:\Users\LENOVO\DebateMe\frontend\dist` to `public_html/`

### Option 3: Using GitHub Actions (Advanced - Automated)

If you want automatic deployment on every git push, we can set up GitHub Actions.

## Verification

After deployment:

1. Visit **https://askjury.com** or **https://www.askjury.com**
2. The website should load your frontend
3. It should connect to your backend at: `https://askjury-production.up.railway.app/api`

## Troubleshooting

### Issue: Website shows 404 or blank page
- Make sure all files from `dist/` are directly in `public_html/`
- The `index.html` must be at `public_html/index.html`

### Issue: Routes don't work (404 on refresh)
- Make sure `.htaccess` file is created and has the correct content
- Check if mod_rewrite is enabled in Hostinger (it usually is by default)

### Issue: API calls failing
- Check browser console (F12) for CORS errors
- Verify backend is running: https://askjury-production.up.railway.app/api/health
- Check if backend has correct CORS settings for askjury.com

## Backend API Configuration

Your backend is already configured to accept requests from:
- `https://askjury.com`
- `https://www.askjury.com`

Make sure your Railway backend service is running and accessible.

## Need to Rebuild?

If you make changes to the code:

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Rebuild:
   ```bash
   npm run build
   ```

3. Re-upload the contents of the `dist/` folder to Hostinger

## Current Configuration

- **Backend URL**: https://askjury-production.up.railway.app/api
- **Frontend Domain**: askjury.com / www.askjury.com
- **Built files location**: `frontend/dist/`
