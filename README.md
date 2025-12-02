# Jury - Community Dispute Resolution Platform

> A platform where people submit real-life disputes and the community votes on who's right.

![Status](https://img.shields.io/badge/status-MVP%20Ready-green)
![Node](https://img.shields.io/badge/node-18%2B-brightgreen)
![React](https://img.shields.io/badge/react-18-blue)

## 🚀 Quick Start

**New here? Start with [QUICK_START.md](QUICK_START.md) for the 5-minute setup guide!**

For detailed setup instructions, see [SETUP.md](SETUP.md)

## 📋 What's Included

This is a **complete, production-ready MVP** with:

- ✅ User authentication (register, login, JWT)
- ✅ Submit cases with media upload (images/videos)
- ✅ Community voting with real-time percentages
- ✅ Threaded comment system with upvotes
- ✅ User profiles with edit functionality
- ✅ Homepage feed with Hot/New/Top sorting
- ✅ Category filtering (7 categories)
- ✅ Responsive design (mobile-first)
- ✅ Database schema with Prisma ORM
- ✅ RESTful API with Express
- ✅ Modern React with hooks and context

See [MVP_COMPLETE.md](MVP_COMPLETE.md) for full feature list and documentation.

## 🏗️ Project Structure

```
DebateMe/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth, upload, etc.
│   │   └── utils/       # Helper functions
│   └── prisma/          # Database schema
│
├── frontend/            # React + Vite app
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page components
│       ├── contexts/    # React contexts (auth)
│       └── utils/       # API client, helpers
│
├── QUICK_START.md       # 5-minute setup guide
├── SETUP.md             # Detailed setup instructions
└── MVP_COMPLETE.md      # Full documentation
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma ORM** - Type-safe database client
- **JWT** - Authentication tokens
- **Cloudinary** - Media storage (optional)
- **bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Quick Setup
```bash
# 1. Create database
createdb jury_db

# 2. Backend setup
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev

# 3. Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 to see the app!

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/jury_db"
JWT_SECRET="your-secret-key-min-32-characters"
PORT=3001

# Optional: For media uploads
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 📚 Documentation

- [QUICK_START.md](QUICK_START.md) - Get up and running in 5 minutes
- [SETUP.md](SETUP.md) - Detailed setup and configuration
- [MVP_COMPLETE.md](MVP_COMPLETE.md) - Complete feature documentation
- [backend/README.md](backend/README.md) - API endpoint reference

## 🧪 Testing the App

1. **Create an account** at http://localhost:5173/register
2. **Submit a case** using the "Submit Case" button
3. **Vote on cases** from the homepage
4. **Comment** on any case
5. **View profiles** by clicking usernames

## 🚢 Deployment

### Recommended Stack
- **Frontend:** Vercel (free tier)
- **Backend:** Railway ($5/mo, includes PostgreSQL)
- **Media Storage:** Cloudinary (free tier)

### Alternative Options
- Backend: Render, Heroku, DigitalOcean
- Database: Supabase, Neon
- Frontend: Netlify, Cloudflare Pages

See [MVP_COMPLETE.md](MVP_COMPLETE.md#deployment-options) for detailed deployment guides.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Cases
- `GET /api/cases` - List cases (with filters)
- `GET /api/cases/:id` - Get single case
- `POST /api/cases` - Create case
- `POST /api/cases/:id/vote` - Vote on case

### Comments
- `GET /api/comments/case/:caseId` - Get comments
- `POST /api/comments` - Create comment
- `POST /api/comments/:id/upvote` - Upvote comment

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/cases` - Get user's cases
- `PUT /api/users/:id` - Update profile

Full API documentation: [backend/README.md](backend/README.md)

## 🎯 Features Ready for Phase 2

The MVP is designed to be easily extensible. Future features to consider:

- Email notifications
- Social login (Google, Apple)
- Anonymous posting
- Advanced moderation dashboard
- User reputation system
- Scheduled posting
- Mobile apps
- Premium features

## 🐛 Troubleshooting

### Database connection error?
- Ensure PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Verify jury_db exists

### Port already in use?
- Change PORT in backend/.env
- Update VITE_API_URL in frontend/.env

### Module not found?
```bash
rm -rf node_modules
npm install
```

More troubleshooting tips in [SETUP.md](SETUP.md)

## 📝 License

MIT

## 🤝 Contributing

This is an MVP. Feel free to fork and extend with new features!

## ⭐ Acknowledgments

Built with modern best practices:
- Clean architecture
- Type-safe database queries
- Secure authentication
- Responsive design
- Production-ready code

---

**Ready to launch?** Follow [QUICK_START.md](QUICK_START.md) to get started in 5 minutes! 🚀
