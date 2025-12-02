import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

// Use Railway's database URL directly
const DATABASE_URL = "postgresql://postgres:ZUoKCLqNxOTsvQsSEcKFeSbhLQNnVFtr@postgres.railway.internal:5432/railway";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function debugDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Check if tables exist
    console.log('\n📊 Checking existing tables...');
    const result = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Existing tables:', result);
    
    if (result.length === 0) {
      console.log('\n❌ No tables found! Need to run migrations.');
      
      // Try to run migrations
      console.log('\n🚀 Running Prisma migrations...');
      execSync('npx prisma migrate deploy', { 
        cwd: './backend',
        env: { ...process.env, DATABASE_URL },
        stdio: 'inherit' 
      });
      
      console.log('✅ Migrations completed!');
      
      // Check tables again
      const newResult = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      console.log('Tables after migration:', newResult);
      
    } else {
      console.log('✅ Tables already exist!');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await prisma.$disconnect();
  }
}

debugDatabase();