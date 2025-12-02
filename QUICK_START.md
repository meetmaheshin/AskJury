# 🚀 Jury - Quick Start Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+

## First Time Setup (5 minutes)

### 1. Create Database
```sql
CREATE DATABASE jury_db;
```

### 2. Configure Backend
Edit `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/jury_db"
JWT_SECRET="change-this-to-a-long-random-string-at-least-32-characters"
```

### 3. Initialize Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
```

When asked for migration name, enter: `init`

### 4. Initialize Frontend
```bash
cd frontend
npm install
```

## Running the App

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
✅ Backend running at: http://localhost:3001

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
✅ Frontend running at: http://localhost:5173

## Test It

1. Open http://localhost:5173
2. Click "Sign Up"
3. Create an account
4. Submit a case
5. Vote on cases
6. Add comments

## Common Commands

### Backend
```bash
npm run dev              # Start dev server
npm run prisma:studio    # Open database GUI
npm run prisma:migrate   # Run new migration
```

### Frontend
```bash
npm run dev     # Start dev server
npm run build   # Build for production
```

## Troubleshooting

### Can't connect to database?
- Check PostgreSQL is running
- Verify DATABASE_URL in backend/.env
- Ensure jury_db exists

### Port already in use?
- Change PORT in backend/.env
- Update VITE_API_URL in frontend/.env

### Module not found?
```bash
rm -rf node_modules
npm install
```

## Optional: Cloudinary Setup

For image/video uploads:

1. Sign up at https://cloudinary.com/
2. Get your credentials from Dashboard
3. Update backend/.env:
```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```
4. Restart backend server

## Default URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001/api
- **Database GUI:** http://localhost:5555 (run `npm run prisma:studio`)
- **Health Check:** http://localhost:3001/health

## File Structure

```
DebateMe/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite app
├── SETUP.md          # Detailed setup instructions
└── MVP_COMPLETE.md   # Feature documentation
```

## Need Help?

1. Check SETUP.md for detailed instructions
2. Review MVP_COMPLETE.md for feature list
3. Look at console errors in terminal
4. Verify .env files are configured

## Success Indicators

✅ Backend terminal shows: "Server running on port 3001"
✅ Frontend terminal shows build success
✅ Browser opens to Jury homepage
✅ No console errors

That's it! You're ready to go! 🎉
