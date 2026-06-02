# AskJury — UI Redesign Plan: "Intuitive & Fun" (IG / X / FB-grade)

**Goal:** turn a competent dark *dashboard* into an *addictive, single-focus, gesture-driven* product the investor instantly "gets" and enjoys.

> The P0/P1/P2 audit fixes (shipped) made the current UI **correct and clean**. This plan is about making it **delightful** — the part the investor said is missing.

---

## 1. Why it currently feels like a "dashboard," not a social app
| Current | What IG / X / TikTok do |
|---|---|
| 3-pane desktop layout is the primary metaphor | One **single column**, content-first, everywhere |
| Dense cards: avatar + 2 badges + category + title + body + bar + footer | **One idea per card**, huge type, minimal chrome |
| Voting = small bar + "Cast your verdict →" text link | The **primary action is the hero** — big, tactile, animated |
| Static feed, click to read | **Swipe / tap loops**, motion, instant feedback |
| Stats/earnings/leaderboard compete for attention | Secondary info is **tucked away**, one tap deep |
| No "reward" after acting | **Dopamine loop**: result reveal, streaks, confetti |

The content is great (global, spicy, real). The *interaction* is the gap.

---

## 2. The core loop to nail (this is the "fun")
**See a rant → take one satisfying action → get an instant, surprising reveal → next.**

1. **Card** = one rant, full-bleed, big title, optional image, minimal chrome.
2. **Action** = one giant tap:
   - JUDGE → two big tap zones ("You're valid" / "Overreacting") that fill with a spring animation.
   - VENT → a row of large reaction emojis that pop/scale on tap.
3. **Reveal** = immediately after voting, animate to "**You're with 72% of the jury**" (or "You're in the minority 🔥") — the payoff that makes people do it again.
4. **Next** = swipe up / auto-advance to the next rant.

This single loop is what makes it feel like X/TikTok rather than a forum.

---

## 3. Three directions (pick one)

### Option A — "Verdict Stack" (swipe cards, TikTok/Tinder-style) — **RECOMMENDED**
- Full-screen, one rant at a time. Swipe **up** = next, tap a side = vote, swipe down = comments.
- Voting triggers the % reveal animation before advancing.
- Best "wow" in a demo; most differentiated; most fun. Highest build effort.
- Risk: discovery/browse needs a secondary "grid" view.

### Option B — "Single-Column Feed 2.0" (IG/X-style) — **fastest, safe**
- Keep scrolling feed but redesign the card: full-width, big title, the vote/react action becomes the visual centerpiece with animation + inline result reveal (no page nav to vote).
- Desktop = same single column centered (max-w ~600px), optional right rail.
- Lowest risk, reuses current data; immediately feels more like X.

### Option C — "Stories + Feed" hybrid
- A top "trending verdicts" stories rail (tap through hot cases) + the Option B feed below.
- Familiar IG pattern; medium effort; good for surfacing the best content.

**Recommendation:** Ship **B** first (fast, de-risks the redesign, immediately more intuitive), then layer **A** as the signature "Verdict Stack" mode behind a toggle for the wow factor.

---

## 4. Design system upgrades (apply to any option)
- **Type scale:** bigger, fewer sizes. Titles ~22–26px, generous line-height. One bold weight for titles.
- **Spacing:** more whitespace; ≤ 2 chips per card; remove competing accents.
- **Color:** one accent for JUDGE (indigo), one for VENT (pink); green/red only inside results. Consistent across marquee + feed.
- **Motion (the fun):** Framer Motion —
  - vote bars fill with spring
  - reaction emojis scale-pop on tap
  - result reveal counts up ("0% → 72%")
  - subtle confetti / haptic on submit
  - card enter/exit transitions
- **Empty/loading:** skeletons, not spinners.
- **Mobile-native feel:** bottom-sheet comments, pull-to-refresh, safe-area aware, tap targets ≥ 44px.

---

## 5. Phased build plan
**Phase 0 — Foundations (0.5–1 day)**
- Add `framer-motion`. Define the type scale + spacing tokens in Tailwind config. Pick the two accent colors.

**Phase 1 — Card + action redesign (Option B) (1–2 days)**
- Rebuild `CaseCard` to full-width, big title, minimal chrome.
- Inline voting/reacting **on the card** (no nav): tap → optimistic update → animated result reveal ("You're with X%").
- Skeleton loaders; consistent bars.

**Phase 2 — Feed & shell polish (1 day)**
- Single-column centered feed (desktop max-w ~600px) with optional trending right-rail; collapse the 3-pane.
- Bottom-sheet comments on mobile; pull-to-refresh.

**Phase 3 — "Verdict Stack" mode (Option A) (2–3 days)**
- Full-screen swipeable deck; gesture nav; reveal animation; "grid" toggle for browse.

**Phase 4 — Delight & retention (ongoing)**
- Streaks, "you vs the jury" stats, share-a-verdict cards (great for growth), confetti, sounds (optional).

---

## 6. Quick wins to demo *this week* (before the full redesign)
These alone will move the "fun" needle for the next investor showing:
1. **Inline voting on the card** + animated **"You're with X% of the jury"** reveal. (Biggest single impact.)
2. **Framer Motion** on the vote bar fill + reaction pop.
3. **Single-column** feed on desktop (stop the dashboard feel).
4. **Bigger titles, fewer chips** (already started in the audit fixes).
5. A **share-a-verdict** image/button (growth + looks polished).

---

## 7. Open decisions for you
- Pick a direction: **A / B / C** (recommend B → A).
- Keep the "earn $ per 1000 upvotes" economy front-and-center, or tuck it into profile? (It currently adds dashboard clutter.)
- Keep 3-pane on large desktop as an enhancement, or go single-column everywhere?
- Brand: lock **AskJury** + the scales mark; want a quick logo/type refresh too?

Tell me the direction and I'll start Phase 0–1.
