import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin(email) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin: true }
    });

    console.log(`✅ User ${user.username} (${user.email}) is now an admin!`);
  } catch (error) {
    console.error('❌ Error making user admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/makeAdmin.js <email>');
  process.exit(1);
}

makeAdmin(email);
