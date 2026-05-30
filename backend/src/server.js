import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import session from 'express-session';
import passport from './config/passport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import authRoutes from './routes/auth.js';
import casesRoutes from './routes/cases.js';
import commentsRoutes from './routes/comments.js';
import usersRoutes from './routes/users.js';
import oauthRoutes from './routes/oauth.js';
import botsRoutes from './routes/bots.js';
import pushRoutes from './routes/push.js';
import { PrismaClient } from '@prisma/client';
import { autoCloseCases } from './jobs/autoCloseCases.js';
import { generateBotUsers } from './jobs/userGeneratorBot.js';
import { runMultipleBotActivities } from './jobs/botActivityManager.js';

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

// Behind Railway's proxy — needed for correct client IPs (rate limiting).
app.set('trust proxy', 1);

// Security headers. CSP is left off (this is a JSON API served cross-origin to
// the SPA); CORP set to cross-origin so the frontend domain can call it.
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Middleware
app.use(cors({
  origin: ['https://askjury.com', 'https://www.askjury.com', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limiting: strict on auth (brute-force), looser global cap on the API.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
});
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// Session middleware for Passport
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Jury API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Jury API is running' });
});

// Database debug endpoint
app.get('/api/db-debug', async (req, res) => {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    // Try to count users
    let userCount = 0;
    try {
      userCount = await prisma.user.count();
    } catch (e) {
      // Table might not exist
    }
    
    res.json({
      status: 'ok',
      database: 'connected',
      tables: tables,
      tableCount: tables.length,
      userCount: userCount,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'failed',
      error: error.message,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    });
  }
});

// Manual migration endpoint (for debugging only)
app.post('/api/db-migrate', async (req, res) => {
  try {
    // Import exec for running shell commands
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    // Run migration
    const result = await execAsync('npx prisma migrate deploy');
    
    res.json({
      status: 'ok',
      message: 'Migration completed',
      output: result.stdout,
      error: result.stderr || null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Migration failed',
      error: error.message
    });
  }
});

// Database seeding endpoint (for debugging only)
app.post('/api/db-seed', async (req, res) => {
  try {
    // Import exec for running shell commands
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    // Run seed script
    const result = await execAsync('node prisma/seed.js');
    
    res.json({
      status: 'ok',
      message: 'Database seeded successfully',
      output: result.stdout,
      error: result.stderr || null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Seeding failed',
      error: error.message
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes); // OAuth routes under /api/auth
app.use('/api/cases', casesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/bots', botsRoutes);
app.use('/api/push', pushRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Cloudinary configured: ${process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloudinary-name' ? 'Yes ✓' : 'No ✗'}`);

  // Schedule auto-close job to run every hour
  cron.schedule('0 * * * *', () => {
    console.log('[CRON] Running auto-closure job');
    autoCloseCases();
  });

  // Schedule bot user generation - spread throughout the day
  // Creates 1-2 users every 6 hours for gradual growth
  cron.schedule('0 */6 * * *', async () => {
    console.log('[CRON] Creating new bot users');
    const count = Math.floor(Math.random() * 2) + 1; // 1-2 users
    await generateBotUsers(count);
  });

  // Schedule bot activity - every 15 minutes for active feel
  // Bots post cases, vote, and comment throughout the day
  cron.schedule('*/15 * * * *', async () => {
    console.log('[CRON] Running bot activity');
    const activityCount = Math.floor(Math.random() * 4) + 3; // 3-6 activities
    await runMultipleBotActivities(activityCount);
  });

  // Run auto-closure check once on startup
  console.log('[CRON] Running initial auto-closure check');
  autoCloseCases();
});
