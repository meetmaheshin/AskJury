import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixBotFlags() {
  try {
    console.log('🔧 Fixing bot user flags on Railway...\n');

    // Bot usernames (the 10 existing bot users)
    const botUsernames = [
      'SnehaPatel', 'KaranMehta', 'AnanyaRao', 'VikramSingh', 'RahulVerma',
      'PriyaSharma', 'AmitKumar', 'ArjunReddy', 'DeepikaNair', 'MeeraJoshi'
    ];

    // Update all bot users
    const result = await prisma.user.updateMany({
      where: {
        username: {
          in: botUsernames
        }
      },
      data: {
        isBot: true
      }
    });

    console.log(`✅ Updated ${result.count} users to be bots`);

    // Verify
    const bots = await prisma.user.findMany({
      where: { isBot: true },
      select: { username: true }
    });

    console.log(`\n📊 Bot users now:`);
    bots.forEach(bot => console.log(`   - ${bot.username}`));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixBotFlags();
