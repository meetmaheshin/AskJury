# 🤖 Private Bot System Documentation

**⚠️ CONFIDENTIAL - DO NOT COMMIT TO GIT**

This document explains the automated bot system that keeps AskJury active and engaging.

## Overview

The bot system creates realistic user activity throughout the day to make the platform appear active when real users visit. This is crucial for user retention and engagement.

## Current Status

✅ **100 bot users** created in database
✅ **Bot activity running** every 30 minutes
✅ **New users generated** every 3 hours (1-2 users)
✅ **Organic-looking activity** - spread throughout the day

## How It Works

### 1. User Generation
- **Location**: `backend/src/jobs/userGeneratorBot.js`
- **Frequency**: Every 3 hours
- **Amount**: 1-2 new users per cycle
- **Features**:
  - Realistic usernames (e.g., "BraveWolf123", "SharpNinja769")
  - Random email domains (gmail, yahoo, outlook, proton.me, icloud)
  - Varied bios from 15 templates
  - Marked with `is_bot: true` in database

### 2. Bot Activity
- **Location**: `backend/src/jobs/botActivityManager.js`
- **Frequency**: Every 30 minutes
- **Amount**: 2-4 random activities per cycle
- **Activity Types**:
  - **30% chance**: Create new case
  - **40% chance**: Vote on existing case
  - **30% chance**: Comment on existing case

### 3. Content Templates

**Cases**: 18+ realistic scenarios across 6 categories:
- Roommate Disputes
- Relationship Issues
- Workplace Conflicts
- Family Drama
- Friend Disagreements
- Money/Payments

**Comments**: 15 varied responses like:
- "You're definitely right in this situation."
- "Have you tried talking to them about it?"
- "Been in a similar situation..."

### 4. Cron Schedule

```javascript
// New users: Every 3 hours
cron.schedule('0 */3 * * *', async () => {
  const count = Math.floor(Math.random() * 2) + 1; // 1-2 users
  await generateBotUsers(count);
});

// Bot activity: Every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  const count = Math.floor(Math.random() * 3) + 2; // 2-4 activities
  await runMultipleBotActivities(count);
});
```

## Admin Access

### Make User Admin (Railway Production)

Option 1 - SQL Query:
```sql
UPDATE users
SET is_admin = true
WHERE email = 'meet.maheshin@gmail.com';
```

Option 2 - Railway CLI:
```bash
railway run node scripts/makeAdmin.js meet.maheshin@gmail.com
```

### Admin API Endpoints

**Generate Bots Manually**
```bash
POST /api/bots/generate
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "count": 10
}
```

**Get Bot Statistics**
```bash
GET /api/bots/stats
Authorization: Bearer <admin_token>
```

## Database Schema

```prisma
model User {
  isBot    Boolean @default(false) @map("is_bot")
  isAdmin  Boolean @default(false) @map("is_admin")
  // ... other fields
}
```

## Management Scripts

All scripts located in `backend/scripts/`:

1. **testBotGeneration.js** - Generate test bots
   ```bash
   node scripts/testBotGeneration.js 10
   ```

2. **testBotActivity.js** - Test bot posting/voting/commenting
   ```bash
   node scripts/testBotActivity.js 15
   ```

3. **makeAdmin.js** - Grant admin privileges
   ```bash
   node scripts/makeAdmin.js user@example.com
   ```

4. **listUsers.js** - View all users and statistics
   ```bash
   node scripts/listUsers.js
   ```

## Files (Not in Git)

These files are excluded from Git via `.gitignore`:

- `backend/scripts/` - All management scripts
- `backend/src/jobs/userGeneratorBot.js` - User generation
- `backend/src/jobs/botActivityManager.js` - Activity simulation
- `backend/src/routes/bots.js` - Admin API endpoints
- `backend/README-BOTS.md` - Technical documentation
- `client_secret*.json` - OAuth credentials
- `*credentials*.json` - Any credential files

## Deployment

### Railway Setup

1. **Environment Variables** (already set):
   - `DATABASE_URL` - PostgreSQL connection
   - `JWT_SECRET` - Token signing
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`

2. **Database Schema**:
   ```bash
   npx prisma db push
   ```

3. **Deploy**:
   - Push code to GitHub (bot files are excluded)
   - Railway auto-deploys from GitHub
   - Cron jobs start automatically

4. **Initial Bot Population** (one-time):
   ```bash
   railway run node scripts/testBotGeneration.js 100
   ```

## Monitoring

### Check Bot Activity

**View Logs**:
```
[CRON] Creating new bot users
[CRON] Running bot activity
✅ Bot BraveWolf123 created case: "..."
✅ Bot SharpNinja456 voted SIDE_A on case: "..."
```

**Database Queries**:
```sql
-- Total bots
SELECT COUNT(*) FROM users WHERE is_bot = true;

-- Bots created today
SELECT COUNT(*) FROM users
WHERE is_bot = true
AND created_at >= CURRENT_DATE;

-- Bot activity today
SELECT
  (SELECT COUNT(*) FROM cases WHERE user_id IN
    (SELECT id FROM users WHERE is_bot = true)) as bot_cases,
  (SELECT COUNT(*) FROM votes WHERE user_id IN
    (SELECT id FROM users WHERE is_bot = true)) as bot_votes,
  (SELECT COUNT(*) FROM comments WHERE user_id IN
    (SELECT id FROM users WHERE is_bot = true)) as bot_comments;
```

## Expected Results

With this system running:

- **100+ active users** at launch
- **5-10 new cases daily** from bots
- **50-100 votes daily** spread across cases
- **30-50 comments daily** on various cases
- **New users joining** throughout the day (8 per day average)

## User Experience

When a real user visits:

1. ✅ Sees active community (100+ members)
2. ✅ Finds engaging discussions (multiple cases)
3. ✅ Posts a case → Gets votes/comments within hours
4. ✅ Returns next day → Sees new activity
5. ✅ Feels the platform is alive and growing

## Security

- ✅ Bot code NOT in Git repository
- ✅ `.env` files excluded from Git
- ✅ OAuth credentials protected
- ✅ Bot users clearly marked in database
- ✅ Admin endpoints require authentication
- ✅ Bot activity appears organic (randomized timing)

## Maintenance

**Weekly**:
- Check bot user count: Should grow by ~50/week
- Review bot-generated content quality
- Monitor for any patterns real users notice

**Monthly**:
- Add new case templates if needed
- Update comment variations
- Adjust activity frequency if needed

## Future Enhancements

Consider adding:
- Bot replies to comments (conversations)
- Bot profiles with different personalities
- Seasonal/trending topics in cases
- Bot upvoting/downvoting comments
- Bot following other users
- Time-zone aware activity (more active during US/India hours)

---

**Remember**: This system is private and proprietary. Keep all documentation and code local.
