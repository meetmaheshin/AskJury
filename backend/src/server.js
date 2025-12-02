import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import authRoutes from './routes/auth.js';
import casesRoutes from './routes/cases.js';
import commentsRoutes from './routes/comments.js';
import usersRoutes from './routes/users.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://askjury.com', 'https://www.askjury.com', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/cases', casesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/users', usersRoutes);

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
});
