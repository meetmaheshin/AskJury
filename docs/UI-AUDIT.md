# AskJury — UI Audit (Mobile + Tablet)

**Date:** 2026-05-31
**Method:** Real-browser render via Playwright/Chromium at three widths — mobile **390px**, tablet-portrait **768px**, tablet-landscape **1024px**. Every route loaded; horizontal-overflow and console errors detected programmatically (`document.scrollWidth` vs `innerWidth`); layout/intuitiveness assessed from screenshots.
**Routes covered:** `/` (home feed), `/case/:id` (JUDGE + VENT), `/login`, `/register`, `/submit`, `/profile/:id`.

## Headline result
- ✅ **No horizontal page overflow** and **no console errors** on any route at any width. The "text going out of the box" the investor saw is **internal clipping** (content overflowing inside `overflow-hidden` boxes) and **layout imbalance**, not document overflow.
- ❌ Several real defects make it feel unfinished on mobile/tablet (below).
- ⚠️ Strategic: the app reads as a generic dark **dashboard**, not an **intuitive, fun, single-focus feed** like Instagram / X / Facebook. See "Strategic" section.

Severity: **P0** = broken/blocks use · **P1** = clearly wrong, hurts trust · **P2** = polish · **P3** = nice-to-have.

---

## P0 — Broken / blocks use

### P0-1 · Fixed bottom nav covers page content (mobile)
- **Where:** all pages on mobile; worst on `/register` and `/login`.
- **Evidence:** On `/register` (390px) the "Continue with Google / GitHub" buttons sit **behind** the fixed bottom tab bar and can't be tapped. The bottom nav is `position: fixed` but pages have no matching bottom padding.
- **Fix:** Add bottom padding to the app's main content container on mobile equal to the nav height + safe area, e.g. `pb-[calc(64px+env(safe-area-inset-bottom))]` (or a `pb-20 md:pb-0` on the page wrapper). Apply globally so every route clears the nav.

### P0-2 · VENT cards look empty/broken
- **Where:** home feed + anywhere `CaseCard` renders a VENT post; all widths.
- **Evidence:** JUDGE cards fill the lower half with a vote bar; VENT cards show only a tiny reaction row (e.g. "😤 1") leaving a large empty band in the middle of the card. Side-by-side, vents look like a rendering bug.
- **Fix:** Redesign the VENT card body so it doesn't depend on the vote-bar height — e.g. show the 5 reaction chips inline (emoji + count) as the filler, give the card `min-height` based on content not a fixed 280px, or show a "React" call-to-action band. Make VENT and JUDGE cards visually balanced.

---

## P1 — Clearly wrong, hurts trust

### P1-1 · Tablet (768–1279px) loses all sidebars → bare, unbalanced feed
- **Where:** `/` on tablet portrait + landscape.
- **Evidence:** Categories / Trending / Top Judges sidebars are `hidden xl:block` (≥1280px), so the entire 768–1279px range shows only the centered feed. Tablet looks empty and under-designed; users lose category + trending navigation.
- **Fix:** Introduce a tablet layout: show at least one sidebar from `lg` (1024px), or a condensed horizontal "categories" strip + a "trending" row above the feed for `md`–`lg`. Don't jump straight from "mobile single column" to "desktop 3-pane."

### P1-2 · Empty / low-vote cards show 50% / 50% (and 0% / 100%)
- **Where:** feed + case detail; all widths.
- **Evidence:** Brand-new bot/seed cases with 0 votes render a 50/50 bar with "0 votes"; cards with 1–2 votes render 0%/100%. The feed reads as unconvincing ("nothing's happening").
- **Fix:** When `voteCount === 0`, replace the bar with a "⚖️ Be the first to vote" prompt; consider hiding the percentage split until a small threshold (e.g. ≥5 votes) and showing raw counts instead. Optionally default the feed sort to "Hot" so engaged cases lead.

### P1-3 · Aggressive handle/category truncation in card header
- **Where:** `CaseCard` header on tablet 2-col and mobile.
- **Evidence:** Handles truncate hard ("SpicyManager…") and the category chip ellipsizes ("Workplace Con…", "Burnout & Bala…"). Functional (the earlier overflow fix) but it now looks cramped because there are 3 elements competing (handle, JUDGE/VENT badge, category).
- **Fix:** Reduce header density — move the category chip out of the header onto its own line near the title, or drop the category chip on the card and keep only the JUDGE/VENT pill. Give the handle more room.

---

## P2 — Polish

- **P2-1 · Register still asks for "Username".** The product is anonymous-handle based; the username is internal/optional now. The field implies a public username. **Fix:** remove it from `/register` (or label "optional, private") since a handle is auto-assigned.
- **P2-2 · Reaction buttons wrap awkwardly on VENT detail (mobile).** "Run" lands alone on its own row. **Fix:** use a 2- or 3-up grid that balances, or `flex-wrap` with even sizing.
- **P2-3 · Hero stats are fake-specific ("50K+ Judges, 1M+ Verdicts").** On a new product an investor will clock these as fake. **Fix:** pull real totals from `/api/cases/stats` (already exists) or soften the copy.
- **P2-4 · Card vote-bar shows only side A fill on the marquee** (single green bar) while feed cards show both colors — inconsistent. **Fix:** make verdict/vote bars consistent across marquee and feed.
- **P2-5 · "Jury" logo in header vs "AskJury" brand name elsewhere.** Inconsistent naming. **Fix:** pick one (AskJury) everywhere.

## P3 — Nice-to-have
- Safe-area insets for the bottom nav on notched devices (`env(safe-area-inset-bottom)`), now that `viewport-fit=cover` is set.
- Skeleton loaders instead of a spinner for the feed.
- Pull-to-refresh on mobile feed.

---

## Strategic — "make it intuitive & fun like IG / FB / X"
The current UI is a competent **dark dashboard**: 3-pane desktop, dense multi-element cards, lots of chrome (sidebars, stats, earnings). The reference apps win on the opposite: **one thing at a time, big media, a single obvious action, motion/feedback.**

Concrete directions (to be detailed in a separate UI plan):
1. **Single-column, full-bleed feed** as the hero experience on every breakpoint (IG/X style), with the 3-pane only as a desktop enhancement — not the primary metaphor.
2. **One primary action per card** — make voting/reacting a big, satisfying, animated tap (haptic-like feedback, bar fills with spring animation), instead of a small bar + "Cast your verdict →" link.
3. **Swipeable cards / stories** — let users swipe through cases (Tinder/Stories pattern) to vote quickly; this is the "fun" loop investors recognize.
4. **Stronger visual hierarchy** — bigger titles, fewer chips, generous spacing, one accent color per state. Reduce the number of badges per card.
5. **Identity & delight** — reactions with micro-animations, confetti on a verdict, a "you were with the majority/minority" reveal after voting (the dopamine loop).
6. **Bottom-nav-first IA on mobile** (already have the bar) with a prominent center "post" button (already there) — lean into it.

These are design decisions, not bugs — recommend a short design spike before building.

---

## Suggested fix order
1. P0-1 (bottom nav padding) — quick, unblocks forms.
2. P0-2 (VENT card layout) — quick, removes the "broken" look.
3. P1-2 (0-vote prompt) + P1-3 (header density) — quick, makes the feed feel alive and clean.
4. P1-1 (tablet layout) — medium.
5. P2 polish batch.
6. Strategic redesign — separate plan + spike.
