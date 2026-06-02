# AskJury — Security Audit

**Date:** 2026-05-31
**Scope:** Backend API (Express + Prisma/PostgreSQL on Railway), frontend (React SPA on Hostinger), auth (JWT + Google/GitHub OAuth), bot/admin endpoints, file uploads, deployment/secrets.
**Method:** Manual source review of routes, middleware, auth, config, and deployment scripts; OWASP Top 10 lens.

Severity: **Critical** · **High** · **Medium** · **Low**. Status: **FIXED** (this pass) · **OPEN** (needs your action) · **OK** (already sound).

---

## Critical

### SEC-1 · Unauthenticated admin/abuse endpoints — **FIXED**
- `POST /api/bots/populate-now` had **no auth** — anyone could trigger 50 bot activities (mass content + Perplexity API cost).
- `POST /api/bots/fix-flags` had **no auth** and **granted admin** (`isAdmin=true`) to a hardcoded email, plus flipped `isBot` flags. A privilege-escalation backdoor reachable by anyone.
- **Action taken:** both endpoints removed. Remaining bot endpoints (`/generate`, `/trigger-activity`, `/delete-duplicates`, `/stats`) are behind `authenticate + requireAdmin`.

### SEC-2 · Hardcoded fallback JWT secret — **FIXED**
- `jwt.js` fell back to a public default secret (`'your-secret-key-here-min-32-chars'`) when `JWT_SECRET` was unset. With a known secret, anyone can **forge a valid token for any user** → full account takeover.
- **Action taken:** fail closed — throws in production if `JWT_SECRET` is missing or < 32 chars; warns in dev. **OPEN follow-up:** confirm a strong `JWT_SECRET` is set in Railway.

---

## High

### SEC-3 · No rate limiting — **FIXED**
- No throttling on login/register (credential brute-force) or on votes/comments (spam).
- **Action taken:** `express-rate-limit` added — 40 req / 15 min on `/api/auth`, 150 req / min across `/api`; `trust proxy` set for correct client IPs behind Railway.

### SEC-4 · Missing security headers — **FIXED**
- No `helmet`; responses lacked `X-Content-Type-Options`, frame options, HSTS, etc.
- **Action taken:** `helmet` enabled (CSP off for the cross-origin JSON API; CORP set to cross-origin so the SPA can call it). Body size capped at 1 MB.

### SEC-5 · Exposed credentials — **OPEN (your action)**
- The Railway Postgres password was pasted into a chat session. **Good news:** `backend/.env` was **never committed** to git (verified) and is now git-ignored, so secrets are not in history.
- **Action:** rotate the **Railway DB password** (Railway → Postgres → regenerate), then update `DATABASE_URL` locally and in the backend service variables. Also set a dedicated strong `SESSION_SECRET` (see SEC-7).

---

## Medium

### SEC-6 · OAuth/session secret fallback — **OPEN**
- `server.js` session secret falls back to `process.env.JWT_SECRET || 'fallback-secret-key'`. Reusing the JWT secret for sessions, or the literal fallback, is weak.
- **Action:** add a separate strong `SESSION_SECRET` env var and use it; never ship the literal fallback to prod.

### SEC-7 · Content / abuse moderation — **OPEN (product)**
- User-generated cases/comments are stored and shown verbatim (now intentionally salty). No profanity/abuse filter, no report-review workflow surfaced, no spam/anti-bot on real-user signups.
- **Action:** add a moderation queue (the `Report` model exists), basic rate/content checks on case+comment creation, and CAPTCHA or email verification on registration before launch.

### SEC-8 · File upload hardening — **OK / minor**
- Multer enforces type allowlist (images + mp4/webm/mov) and limits (50 MB, 3 files) — good. Uploads go to Cloudinary (not local disk) — good.
- **Minor:** 50 MB is large; relies on `mimetype` (client-declared) — consider server-side content sniffing for stricter validation, and lower the video cap.

---

## Low / Informational

- **SEC-9 · XSS:** React escapes by default and there is no `dangerouslySetInnerHTML` in the rendered content paths — **OK**. Keep it that way; never inject raw HTML from user content.
- **SEC-10 · SQL injection:** all DB access is via Prisma (parameterized) — **OK** (no raw queries found).
- **SEC-11 · CORS:** restricted to `askjury.com`, `www.askjury.com`, and localhost dev — **OK**.
- **SEC-12 · AuthZ on mutations:** case close/delete and profile update check ownership (`userId === req.user.id`) — **OK**.
- **SEC-13 · PII exposure:** public payloads return `anonymousHandle` only; email/internal username are not exposed (recently fixed) — **OK**.
- **SEC-14 · JWT lifetime:** 7-day non-revocable tokens. Acceptable for now; consider shorter TTL + refresh, or a token-version/`tokenInvalidatedAt` for logout-everywhere later.
- **SEC-15 · Error handling:** errors are caught and generic messages returned; stack traces are not leaked to clients — **OK**.
- **SEC-16 · Dependencies:** run `npm audit` periodically; enable Dependabot on the repo.

---

## Open items checklist (your action)
- [ ] Rotate Railway DB password; update `DATABASE_URL` everywhere (SEC-5).
- [ ] Confirm strong `JWT_SECRET` set in Railway (SEC-2).
- [ ] Add `SESSION_SECRET` (SEC-6).
- [ ] Set `VAPID_*` in Railway (push) — not security-critical.
- [ ] Plan moderation + signup anti-abuse before public launch (SEC-7).

## Already deployed this pass
Removed unauth endpoints · secured JWT · helmet · rate limiting · body-size cap · trust proxy. Commit: `a161329`.
