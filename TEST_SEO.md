# Quick SEO Testing Guide

## 🚀 Start Testing Now!

### Step 1: Start Dev Server
```bash
cd frontend
npm run dev
```

### Step 2: Open Your Browser
Visit: http://localhost:5173

### Step 3: Quick Checks

#### ✅ Favicon Test
Look at the browser tab - you should see a blue icon with a gavel and scales.

#### ✅ Meta Tags Test
1. Right-click → View Page Source
2. Search for (Ctrl+F):
   - `<title>Ask Jury`
   - `og:title`
   - `twitter:card`
3. Should find multiple meta tags!

#### ✅ SEO Files Test
Visit these URLs:
- http://localhost:5173/robots.txt
- http://localhost:5173/sitemap.xml

Both should load!

---

## 🏗️ Build for Production

### Build Command
```bash
cd frontend
npm run build
```

### Verify Build
Check `frontend/dist/` folder contains:
- `index.html` (with all meta tags)
- `favicon.svg`
- `robots.txt`
- `sitemap.xml`
- `assets/` folder

### Test Production Build
```bash
npm run preview
```
Visit: http://localhost:4173

Test everything again!

---

## 📤 Ready to Deploy?

If all tests pass:

1. **Upload `dist/` contents** to Hostinger `public_html/`
2. **Visit** https://askjury.com
3. **Check**:
   - Favicon appears ✅
   - View source shows meta tags ✅
   - /robots.txt works ✅
   - /sitemap.xml works ✅

---

## 🎉 Success Criteria

- [ ] Favicon shows in browser tab
- [ ] Meta tags in page source
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Social sharing preview looks good

All checked? **You're done!** 🚀
