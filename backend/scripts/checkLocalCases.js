import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLocalCases() {
  try {
    const caseCount = await prisma.case.count();
    console.log(`📊 Total cases in local database: ${caseCount}`);

    if (caseCount > 0) {
      const cases = await prisma.case.findMany({
        include: {
          user: {
            select: { username: true, isBot: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      console.log('\n📋 Recent cases:');
      cases.forEach((c, i) => {
        console.log(`${i + 1}. "${c.title}" by ${c.user.username} ${c.user.isBot ? '🤖' : '👤'}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLocalCases();
