# Jury MVP Setup Guide

This guide will walk you through setting up and running the Jury MVP application.

## Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14 or higher ([Download](https://www.postgresql.org/download/))
- **Git** (for version control)

## Step 1: Database Setup

### Install PostgreSQL
1. Download and install PostgreSQL from the official website
2. During installation, set a password for the `postgres` user
3. Remember this password - you'll need it later

### Create the Database
Open your PostgreSQL client (pgAdmin or command line) and run:

```sql
CREATE DATABASE jury_db;
```

## Step 2: Backend Setup

### 1. Navigate to backend folder
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
The `.env` file has been created for you. Update the following values:

**Required:**
- `DATABASE_URL`: Update with your PostgreSQL credentials
  - Format: `postgresql://username:password@localhost:5432/jury_db`
  - Example: `postgresql://postgres:mypassword@localhost:5432/jury_db`

- `JWT_SECRET`: Change to a secure random string (at least 32 characters)
  - You can generate one at: https://randomkeygen.com/

**Optional (for media upload):**
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

> **Note:** If you don't set up Cloudinary, media uploads won't work, but everything else will function normally.

### 4. Generate Prisma client
```bash
npm run prisma:generate
```

### 5. Run database migrations
```bash
npm run prisma:migrate
```

When prompted for a migration name, enter: `init`

### 6. Start the backend server
```bash
npm run dev
```

The backend should now be running on http://localhost:3001

You should see:
```
Server running on port 3001
Environment: development
```

## Step 3: Frontend Setup

### 1. Open a new terminal and navigate to frontend folder
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
The `.env` file has been created and configured. No changes needed unless you changed the backend port.

### 4. Start the frontend development server
```bash
npm run dev
```

The frontend should now be running on http://localhost:5173

## Step 4: Test the Application

1. Open your browser and go to http://localhost:5173
2. You should see the Jury homepage
3. Click "Sign Up" to create an account
4. After registering, you can:
   - Submit a case
   - Vote on cases
   - Comment on cases
   - View your profile

## Getting Cloudinary Credentials (Optional)

If you want to enable media uploads:

1. Go to https://cloudinary.com/
2. Sign up for a free account
3. After logging in, go to your Dashboard
4. Copy your Cloud Name, API Key, and API Secret
5. Update the `.env` file in the backend folder with these values
6. Restart the backend server

## Common Issues

### Database Connection Error
```
Error: Can't reach database server
```
**Solution:**
- Check that PostgreSQL is running
- Verify your DATABASE_URL is correct
- Ensure the database `jury_db` exists

### Port Already in Use
```
Error: Port 3001 is already in use
```
**Solution:**
- Change the PORT in `backend/.env` to a different number (e.g., 3002)
- Update `frontend/.env` VITE_API_URL to match the new port

### Prisma Client Error
```
Error: @prisma/client did not initialize yet
```
**Solution:**
```bash
cd backend
npm run prisma:generate
```

### Module Not Found
```
Error: Cannot find module 'xyz'
```
**Solution:**
```bash
# In the affected folder (frontend or backend)
rm -rf node_modules
npm install
```

## Development Workflow

### Backend Commands
```bash
npm run dev          # Start development server with hot reload
npm start            # Start production server
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run database migrations
npm run prisma:studio     # Open Prisma Studio (database GUI)
```

### Frontend Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Database Management

To view and manage your database:
```bash
cd backend
npm run prisma:studio
```

This opens a GUI at http://localhost:5555 where you can:
- View all tables
- Add/edit/delete records
- Explore relationships

## Testing User Flow

### 1. Create an account
- Go to http://localhost:5173/register
- Fill in email, username, password
- Click "Create account"

### 2. Submit a case
- Click "Submit Case" in the navbar
- Fill in the form
- (Optional) Upload images/videos if Cloudinary is configured
- Click "Submit Case"

### 3. Vote on a case
- Go to the homepage
- Click on any case
- Click one of the vote buttons
- See the updated vote percentages

### 4. Comment on a case
- Scroll to the comments section
- Type your comment
- Click "Post Comment"

## Next Steps

After confirming everything works:

1. **Customize branding**
   - Update colors in `frontend/tailwind.config.js`
   - Add your logo to the navbar

2. **Add more features**
   - Email notifications
   - User badges
   - Advanced moderation

3. **Deploy to production**
   - Frontend: Vercel, Netlify
   - Backend: Railway, Render, Heroku
   - Database: Railway, Supabase

## Getting Help

If you encounter issues:
1. Check the console for error messages
2. Review the logs in the terminal
3. Verify all environment variables are set correctly
4. Ensure PostgreSQL is running

## Project Structure

```
DebateMe/
├── backend/
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, upload, etc.
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Main server file
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── .env                # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── utils/          # Helper functions
│   │   └── App.jsx         # Main app component
│   ├── .env                # Environment variables
│   └── package.json
│
└── README.md
```

## Success!

If you see the homepage with no errors, congratulations! Your Jury MVP is up and running. 🎉
