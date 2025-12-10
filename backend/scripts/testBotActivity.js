import { runMultipleBotActivities } from '../src/jobs/botActivityManager.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  const count = process.argv[2] ? parseInt(process.argv[2]) : 10;

  console.log(`\n🧪 Testing bot activity (${count} activities)...\n`);

  try {
    await runMultipleBotActivities(count);

    // Show statistics
    const totalCases = await prisma.case.count();
    const totalVotes = await prisma.vote.count();
    const totalComments = await prisma.comment.count();

    console.log('\n📊 Platform Statistics:');
    console.log(`   Cases: ${totalCases}`);
    console.log(`   Votes: ${totalVotes}`);
    console.log(`   Comments: ${totalComments}\n`);

    // Show recent activity
    const recentCases = await prisma.case.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { username: true, isBot: true }
        },
        _count: {
          select: { votes: true, comments: true }
        }
      }
    });

    console.log('📋 Recent Cases:');
    recentCases.forEach((c, i) => {
      const bot = c.user.isBot ? '🤖' : '👤';
      console.log(`   ${i + 1}. ${bot} "${c.title}"`);
      console.log(`      By: ${c.user.username}`);
      console.log(`      Votes: ${c._count.votes} | Comments: ${c._count.comments}\n`);
    });

    console.log('✅ Test completed!\n');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
