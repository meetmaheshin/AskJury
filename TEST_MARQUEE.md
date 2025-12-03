# Quick Marquee Testing Guide

## 🚀 Start Testing Now!

### Step 1: Start Dev Server
```bash
cd frontend
npm run dev
```

### Step 2: Open Browser
Visit: http://localhost:5173

### Step 3: Look for Marquee
**Location**: Below the hero section (below "The Internet's Courtroom")

Should see:
- 🔥 "Trending Now" label
- Horizontal scrolling case cards
- Smooth left-to-right animation

---

## ✅ Quick Checks

### 1. Is it Visible?
- [ ] Marquee appears on page
- [ ] Cases are scrolling
- [ ] "Trending Now" label visible

### 2. Does it Scroll?
- [ ] Cases move left to right
- [ ] Animation is smooth (no jittering)
- [ ] Loops seamlessly (no gap)

### 3. Does Hover Work?
- [ ] Move mouse over marquee
- [ ] Animation pauses
- [ ] Move mouse away
- [ ] Animation resumes

### 4. Are Cases Clickable?
- [ ] Click on a case card
- [ ] Opens case detail page
- [ ] Back button returns to home

### 5. Is it Responsive?
- [ ] Resize browser window
- [ ] Cards adapt to screen size
- [ ] Still readable on mobile size (320px)

---

## 🎨 What You Should See

### Desktop View:
```
🔥 Trending Now
─────────────────────────────────────
┌────────┐  ┌────────┐  ┌────────┐
│ Case 1 │  │ Case 2 │  │ Case 3 │ →
│  Title │  │  Title │  │  Title │
│ ▓▓░░░░ │  │ ▓░░░░░ │  │ ▓▓▓░░░ │
└────────┘  └────────┘  └────────┘
```

### Features Per Card:
- Category badge (e.g., "POLITICS")
- Case title (2 lines max)
- Voting bar (green vs red)
- Vote count
- Comment count
- HOT badge (if applicable)

---

## 🐛 Common Issues

### Don't See Marquee?
**Check**: Are there trending cases?
- Need at least 1 case in `trending` array
- Check console for errors
- Verify API is returning data

### Not Scrolling?
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check CSS loaded (F12 → Elements → Styles)

### Hover Not Working?
- Try different browser
- Check JavaScript enabled
- Look for console errors

---

## 📱 Mobile Testing

**Use Chrome Dev Tools:**
1. Press F12
2. Click device icon (top-left)
3. Select iPhone or Android
4. Refresh page

**Or use real phone:**
- Visit your local IP (e.g., http://192.168.1.x:5173)
- Test touch scrolling
- Verify responsive design

---

## 🏗️ Ready for Production?

If all checks pass:

```bash
cd frontend
npm run build
npm run preview
```

Test again at http://localhost:4173

Then deploy to Hostinger!

---

## 🎉 Success = All Green!

- ✅ Marquee visible
- ✅ Smooth scrolling
- ✅ Pause on hover
- ✅ Cases clickable
- ✅ Responsive design
- ✅ No errors

**All done?** Deploy it! 🚀
