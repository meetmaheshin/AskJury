import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    const email = 'meet.maheshin@gmail.com';

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

makeAdmin();
