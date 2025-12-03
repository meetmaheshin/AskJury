# Development Roadmap

## Current Status: v1.0.0-production ✅

Production site is live and working!

---

## Planned Features (Next Phase)

### 1. Site Branding & SEO
- [ ] Add favicon/site icon
- [ ] Implement meta tags for SEO
- [ ] Add Open Graph tags for social sharing
- [ ] Create sitemap.xml
- [ ] Add robots.txt

### 2. Progressive Web App (PWA)
- [ ] Add PWA manifest
- [ ] Implement service worker
- [ ] Add "Install App" prompt for mobile users
- [ ] Enable offline support
- [ ] Add app icons for different platforms

### 3. Trending Cases Marquee
- [ ] Create marquee component (horizontal scrolling)
- [ ] Position below hero banner
- [ ] Auto-scroll trending cases left-to-right
- [ ] Make clickable to open case details
- [ ] Add animation/smooth scrolling

### 4. UI/UX Improvements
- [ ] Mobile responsive design review
- [ ] Loading states for API calls
- [ ] Error handling UI
- [ ] Toast notifications
- [ ] Skeleton loaders

---

## Implementation Plan

### Phase 1: Favicon & Basic SEO (Quick Wins)
**Estimated Time**: 1-2 hours
**Impact**: High (Professional look, better SEO)

Tasks:
1. Create/add favicon files
2. Add meta tags to index.html
3. Implement dynamic meta tags per page
4. Test on various devices

### Phase 2: PWA Setup
**Estimated Time**: 2-3 hours
**Impact**: High (Mobile app experience)

Tasks:
1. Configure vite-plugin-pwa
2. Create manifest.json
3. Add service worker
4. Test install prompt on mobile
5. Add app icons

### Phase 3: Trending Marquee
**Estimated Time**: 2-3 hours
**Impact**: Medium (Better UX)

Tasks:
1. Design marquee component
2. Fetch trending cases
3. Implement auto-scroll animation
4. Make responsive
5. Add click handlers

---

## Technical Approach

### Favicon Implementation
```
frontend/public/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
└── android-chrome-192x192.png
```

### SEO Meta Tags
```html
<head>
  <title>AskJury - The Internet's Courtroom</title>
  <meta name="description" content="...">
  <meta property="og:title" content="...">
  <meta property="og:description" content="...">
  <meta property="og:image" content="...">
  <meta name="twitter:card" content="...">
</head>
```

### PWA Manifest
```json
{
  "name": "AskJury",
  "short_name": "AskJury",
  "description": "The Internet's Courtroom",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3B82F6",
  "background_color": "#0F172A",
  "icons": [...]
}
```

### Trending Marquee Component
```jsx
<TrendingMarquee>
  {trendingCases.map(case => (
    <CaseCard key={case.id} {...case} />
  ))}
</TrendingMarquee>
```

---

## Development Workflow

For each feature:

1. **Create feature branch**
   ```bash
   git checkout -b feature/favicon-and-seo
   ```

2. **Develop locally**
   - Test at http://localhost:5173
   - Verify functionality works

3. **Build and test production**
   ```bash
   npm run build
   npm run preview
   ```

4. **Commit and merge**
   ```bash
   git add .
   git commit -m "Add favicon and SEO meta tags"
   git checkout main
   git merge feature/favicon-and-seo
   ```

5. **Deploy**
   - Push to GitHub
   - Build frontend
   - Upload to Hostinger

---

## Priority Order

### High Priority (Do First)
1. ✅ Favicon (Quick, professional look)
2. ✅ Basic SEO meta tags
3. ✅ Trending marquee (User-facing feature)

### Medium Priority
4. PWA functionality
5. Enhanced SEO (sitemap, robots.txt)
6. Social sharing optimization

### Low Priority (Nice to have)
7. Offline support
8. Advanced PWA features
9. Analytics integration

---

## Dependencies to Install

### For PWA:
```bash
npm install -D vite-plugin-pwa
npm install -D workbox-window
```

### For SEO:
```bash
npm install react-helmet-async
```

### For Marquee Animation:
```bash
npm install framer-motion
# Or use CSS animations (no dependency)
```

---

## Testing Plan

### Favicon Testing
- [ ] Test in Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Verify in browser tabs
- [ ] Check bookmarks appearance

### SEO Testing
- [ ] Use Google's Rich Results Test
- [ ] Check meta tags with browser inspector
- [ ] Test social sharing previews
- [ ] Validate with SEO tools

### PWA Testing
- [ ] Test install prompt on Android
- [ ] Test install prompt on iOS (Safari)
- [ ] Verify app works after installation
- [ ] Test offline functionality
- [ ] Check app icons display correctly

### Marquee Testing
- [ ] Test on different screen sizes
- [ ] Verify smooth animation
- [ ] Test click interactions
- [ ] Check performance (no lag)
- [ ] Test with different numbers of cases

---

## Files to Modify

### Favicon & SEO
- `frontend/index.html` - Add meta tags, favicon links
- `frontend/public/` - Add favicon files
- Create `frontend/src/components/SEO.jsx` - Dynamic meta tags

### PWA
- `frontend/vite.config.js` - Add PWA plugin
- Create `frontend/public/manifest.json`
- Create `frontend/public/sw.js` (service worker)
- `frontend/src/main.jsx` - Register service worker

### Trending Marquee
- Create `frontend/src/components/TrendingMarquee.jsx`
- Modify `frontend/src/pages/Home.jsx` - Add marquee below hero
- Add CSS animations or use framer-motion

---

## Success Criteria

### Favicon ✅
- Icon appears in browser tab
- Icon appears when site is bookmarked
- Icon appears in mobile home screen

### SEO ✅
- Google can crawl the site
- Meta descriptions appear in search results
- Social media previews look good

### PWA ✅
- "Add to Home Screen" prompt appears on mobile
- App icon appears after installation
- App opens in standalone mode (no browser UI)
- App works when installed

### Trending Marquee ✅
- Cases scroll smoothly left to right
- Marquee is responsive on mobile
- Click on case opens case detail page
- Looks good with hero banner

---

## Ready to Start?

Let's begin with Phase 1: Favicon & SEO!

Would you like me to:
1. Start implementing these features?
2. Create the components and test locally first?
3. Help you create a favicon/icon first?

Let me know which feature you want to tackle first! 🚀
