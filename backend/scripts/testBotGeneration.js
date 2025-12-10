import { generateBotUsers, getBotStats } from '../src/jobs/userGeneratorBot.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  const count = process.argv[2] ? parseInt(process.argv[2]) : 5;

  console.log(`\n🧪 Testing bot generation (${count} users)...\n`);

  try {
    const results = await generateBotUsers(count);
    const stats = await getBotStats();

    console.log('📈 Current Bot Statistics:');
    console.log(`   Total bots: ${stats.totalBots}`);
    console.log(`   Bots created today: ${stats.botsCreatedToday}\n`);

    // Show sample of bot users
    const sampleBots = await prisma.user.findMany({
      where: { isBot: true },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        username: true,
        email: true,
        bio: true,
        createdAt: true
      }
    });

    console.log('👥 Sample of recent bot users:');
    sampleBots.forEach((bot, i) => {
      console.log(`   ${i + 1}. ${bot.username} (${bot.email})`);
      console.log(`      Bio: ${bot.bio}`);
      console.log(`      Created: ${bot.createdAt.toLocaleString()}`);
    });

    console.log('\n✅ Test completed!\n');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
