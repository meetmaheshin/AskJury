import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        isBot: true,
        isAdmin: true,
        authProvider: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    console.log(`\n📋 Users in database (${users.length} shown):\n`);
    users.forEach((user, i) => {
      const bot = user.isBot ? '🤖' : '👤';
      const admin = user.isAdmin ? '⭐' : '';
      console.log(`${i + 1}. ${bot} ${user.username} ${admin}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Provider: ${user.authProvider || 'local'}`);
      console.log(`   Created: ${user.createdAt.toLocaleString()}\n`);
    });

    const totalUsers = await prisma.user.count();
    const totalBots = await prisma.user.count({ where: { isBot: true } });
    const totalAdmins = await prisma.user.count({ where: { isAdmin: true } });

    console.log('📊 Statistics:');
    console.log(`   Total users: ${totalUsers}`);
    console.log(`   Bots: ${totalBots}`);
    console.log(`   Admins: ${totalAdmins}`);
    console.log(`   Real users: ${totalUsers - totalBots}\n`);
  } catch (error) {
    console.error('❌ Error listing users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
