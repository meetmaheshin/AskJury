# Local Development & Testing Workflow

## 🎯 Goal
Test all changes locally before deploying to production (Hostinger + Railway).

---

## Setup Local Environment

### 1. Backend Local Setup

#### Start Local PostgreSQL Database
You need a local PostgreSQL database. Options:

**Option A: Use Railway Database (Recommended for development)**
```bash
cd backend
# Copy DATABASE_URL from Railway and add to .env
echo "DATABASE_URL=postgresql://..." > .env
```

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL locally if not installed
# Then create database
createdb askjury_dev

# Add to backend/.env
echo "DATABASE_URL=postgresql://localhost:5432/askjury_dev" > .env
```

#### Install Dependencies
```bash
cd backend
npm install
```

#### Run Migrations
```bash
npx prisma migrate dev
npx prisma generate
```

#### Seed Database (Optional)
```bash
node prisma/seed.js
```

#### Start Backend Server
```bash
npm run dev
```

Backend should be running at: http://localhost:3001

---

### 2. Frontend Local Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Configure Environment
The frontend already has `.env` file pointing to localhost:

Check `frontend/.env`:
```
VITE_API_URL=http://localhost:3001/api
```

#### Start Frontend Dev Server
```bash
npm run dev
```

Frontend should be running at: http://localhost:5173

---

## Development Workflow

### Step 1: Make Changes

Edit files in your code editor (VS Code, etc.)

### Step 2: Test Locally

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Open browser**: http://localhost:5173

3. **Test your changes:**
   - Does it work as expected?
   - Check browser console (F12) for errors
   - Test all functionality

### Step 3: Build Frontend (Production Test)

Before deploying, test the production build locally:

```bash
cd frontend
npm run build
npm run preview
```

This opens http://localhost:4173 with production build.

### Step 4: Commit Changes

```bash
git add .
git commit -m "Description of changes"
```

**DON'T PUSH YET** if you want to test more!

### Step 5: When Ready to Deploy

```bash
# Push to GitHub (triggers Railway auto-deploy for backend)
git push

# Build frontend for Hostinger
cd frontend
npm run build

# Upload dist/ contents to Hostinger
# (Manual upload via File Manager)
```

---

## Testing Checklist

Before deploying to production:

### Backend Tests
- [ ] Server starts without errors
- [ ] Database connection works
- [ ] API endpoints respond correctly
- [ ] No console errors in backend terminal

Test endpoints:
```bash
# Health check
curl http://localhost:3001/api/health

# Get cases
curl http://localhost:3001/api/cases
```

### Frontend Tests
- [ ] App loads without errors
- [ ] All pages render correctly
- [ ] API calls work
- [ ] No console errors in browser
- [ ] Forms submit correctly
- [ ] Navigation works
- [ ] Images/assets load

### Production Build Tests
- [ ] `npm run build` succeeds
- [ ] `npm run preview` works
- [ ] Production build has no errors
- [ ] All features work in production build

---

## Common Development Commands

### Backend
```bash
cd backend

# Start dev server (with nodemon auto-restart)
npm run dev

# Start production mode
npm start

# Database commands
npx prisma studio              # Database GUI
npx prisma migrate dev         # Run migrations
npx prisma generate            # Generate Prisma Client
npx prisma db push             # Push schema to database
```

### Frontend
```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Environment Variables

### Backend `.env` (Create if doesn't exist)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/askjury_dev"
JWT_SECRET="your-secret-key-for-development"
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NODE_ENV="development"
```

### Frontend `.env` (Already exists)
```env
VITE_API_URL=http://localhost:3001/api
```

### Frontend `.env.production` (For production builds)
```env
VITE_API_URL=https://askjury-production.up.railway.app/api
```

---

## Debugging Tips

### Backend Issues

**Server won't start:**
```bash
# Check if port 3001 is already in use
netstat -ano | findstr ":3001"

# Kill process if needed
taskkill //PID <PID_NUMBER> //F
```

**Database connection issues:**
```bash
# Test database connection
npx prisma db pull

# Reset database (WARNING: Deletes all data!)
npx prisma migrate reset
```

### Frontend Issues

**Build errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API not connecting:**
- Check `.env` file exists
- Verify backend is running on port 3001
- Check browser Network tab (F12) for API calls

---

## Hot Reloading

Both frontend and backend support hot reloading:

- **Frontend**: Changes auto-refresh in browser
- **Backend**: Nodemon restarts server on file changes

No need to manually restart while developing!

---

## Creating New Features Workflow

1. **Create feature branch:**
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Develop and test locally** using steps above

3. **Commit regularly:**
   ```bash
   git add .
   git commit -m "Add feature XYZ"
   ```

4. **When done and tested:**
   ```bash
   git checkout main
   git merge feature/new-feature-name
   git push
   ```

5. **Deploy:**
   - Backend: Automatic (Railway)
   - Frontend: Build and upload to Hostinger

---

## Rollback if Something Breaks

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Restore from backup
git checkout v1.0.0-production
```

---

## Next Steps

Now you're ready to:
1. Make changes locally
2. Test thoroughly
3. Deploy with confidence!

See [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) for planned features.
