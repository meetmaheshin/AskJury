# Jury Backend API

Backend API for the Jury dispute resolution platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials and API keys

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user (requires authentication)

#### POST /api/auth/logout
Logout user

### Cases

#### GET /api/cases
Get all cases with filtering
- Query params: `sort` (hot, new, top), `category`, `limit`, `offset`

#### GET /api/cases/:id
Get single case by ID

#### POST /api/cases
Create new case (requires authentication)
```json
{
  "title": "Am I wrong for...",
  "description": "Full story here",
  "category": "ROOMMATE_DISPUTES",
  "sideALabel": "You're Right",
  "sideBLabel": "You're Wrong"
}
```
- Supports multipart/form-data for media upload

#### POST /api/cases/:id/vote
Vote on a case (requires authentication)
```json
{
  "side": "SIDE_A" // or "SIDE_B"
}
```

#### DELETE /api/cases/:id
Delete case (owner only, requires authentication)

### Comments

#### GET /api/comments/case/:caseId
Get all comments for a case

#### POST /api/comments
Create comment (requires authentication)
```json
{
  "caseId": "uuid",
  "content": "Comment text",
  "parentId": "uuid" // optional, for replies
}
```

#### POST /api/comments/:id/upvote
Upvote comment (requires authentication)

#### POST /api/comments/:id/downvote
Downvote comment (requires authentication)

#### DELETE /api/comments/:id
Delete comment (owner only, requires authentication)

### Users

#### GET /api/users/:id
Get user profile

#### GET /api/users/:id/cases
Get user's cases

#### PUT /api/users/:id
Update user profile (owner only, requires authentication)
```json
{
  "username": "newusername",
  "bio": "New bio"
}
```
- Supports multipart/form-data for avatar upload

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

## Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 3001)
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
