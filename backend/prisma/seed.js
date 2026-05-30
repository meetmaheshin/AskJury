import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { calculateVerdict } from '../src/utils/verdictCalculator.js';
import { findOrCreateCompany } from '../src/utils/companies.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting seed...');

  // Clear existing data (children first to respect FKs).
  await prisma.comment.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.case.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  console.log('🗑️ Cleared existing data');

  const passwordHash = await bcrypt.hash('password123', 10);

  // Demo users. anonymousHandle is the only public identity; email/username stay internal.
  const demoUsers = [
    { email: 'burnt@example.com', username: 'burnt_intern', anonymousHandle: 'BurntIntern4821', bio: 'Surviving one standup at a time ☕' },
    { email: 'salty@example.com', username: 'salty_analyst', anonymousHandle: 'SaltyAnalyst1399', bio: 'Spreadsheets and spite 📊' },
    { email: 'ghosted@example.com', username: 'ghosted_pm', anonymousHandle: 'GhostedManager7740', bio: 'Reply-all survivor' },
    { email: 'quiet@example.com', username: 'quiet_dev', anonymousHandle: 'QuietEngineer2055', bio: 'Shipping in silence 🤫' },
    { email: 'tired@example.com', username: 'tired_designer', anonymousHandle: 'TiredOtter6610', bio: 'Pixel pusher, deeply exhausted' },
    { email: 'rogue@example.com', username: 'rogue_hr', anonymousHandle: 'RogueRaccoon3127', bio: 'Ex-HR, telling the truth now' },
    { email: 'monday@example.com', username: 'monday_hater', anonymousHandle: 'MondayWalrus9004', bio: 'It is always Monday somewhere' },
    { email: 'corporate@example.com', username: 'corporate_drone', anonymousHandle: 'CorporateDrone5582', bio: 'Synergizing my way to burnout' },
    { email: 'remote@example.com', username: 'remote_llama', anonymousHandle: 'RemoteLlama4416', bio: 'RTO refusenik 🏠' },
    { email: 'jaded@example.com', username: 'jaded_lead', anonymousHandle: 'JadedFalcon8830', bio: 'Seen three reorgs, trust no roadmap' },
  ];

  const users = await Promise.all(
    demoUsers.map((u) => prisma.user.create({ data: { ...u, passwordHash, isVerified: true } }))
  );
  console.log('👥 Created users:', users.length);

  // A few companies people rant about.
  const companyNames = ['Amazon', 'Google', 'Infosys', 'Accenture', 'Tesla'];
  const companies = {};
  for (const name of companyNames) {
    const c = await findOrCreateCompany(prisma, name);
    if (c) companies[name] = c;
  }
  console.log('🏢 Created companies:', Object.keys(companies).length);

  const getRandomPastDate = (maxDaysAgo = 30) => {
    const daysAgo = Math.floor(Math.random() * maxDaysAgo);
    const hoursAgo = Math.floor(Math.random() * 24);
    return new Date(Date.now() - (daysAgo * 24 + hoursAgo) * 60 * 60 * 1000);
  };

  // Workplace cases — a mix of JUDGE (two-sided vote) and VENT (reactions only).
  const caseSeeds = [
    {
      userId: users[0].id, category: 'TOXIC_MANAGEMENT', postType: 'JUDGE', targetType: 'PERSON', targetName: 'my manager',
      title: 'My manager takes credit for my work in every leadership meeting',
      description: 'I build the decks, run the numbers, ship the projects. In front of the VPs my manager says "I put this together." I raised it 1:1 and got called "not a team player." Do I escalate to skip-level or just document everything and move on?',
      sideALabel: 'Escalate it', sideBLabel: 'Let it go',
    },
    {
      userId: users[1].id, category: 'PAY_AND_PROMOTION', postType: 'JUDGE', targetType: 'GENERAL',
      title: 'Found out a junior on my team makes more than me after 4 years here',
      description: 'A pay sheet leaked. Someone hired last year, less scope, makes 12% more than me. The loyalty tax is real. Do I walk into my manager with this number, or pretend I never saw it and just start interviewing?',
      sideALabel: 'Confront the boss', sideBLabel: 'Quietly job hunt',
    },
    {
      userId: users[2].id, category: 'RETURN_TO_OFFICE', postType: 'JUDGE', targetType: 'COMPANY', companyName: 'Amazon',
      title: 'RTO mandate, but I commute 90 minutes to sit on video calls all day',
      description: 'Everyone I work with is in other cities. I drive three hours round-trip to take the exact same Zoom calls I took from home, just in a louder room. How is this productivity? Am I wrong to push back hard on this mandate?',
      sideALabel: 'Push back hard', sideBLabel: 'Just comply',
    },
    {
      userId: users[3].id, category: 'WORK_LIFE_BALANCE', postType: 'VENT', targetType: 'GENERAL',
      title: 'Took my first real vacation in two years and got called twice on day one',
      description: 'Approved leave. Handover doc written. Backup assigned. Day one of the trip — two "just one quick thing" calls. And I answered. I hate that I answered. I do not know how to actually disconnect anymore.',
    },
    {
      userId: users[4].id, category: 'COWORKER_DRAMA', postType: 'JUDGE', targetType: 'PERSON', targetName: 'my coworker',
      title: 'Coworker microwaves fish at their desk every single day',
      description: 'Open-plan office. Every lunch, fish. The whole floor reeks. Three of us asked nicely, HR sent a "be considerate" email, nothing changed. They say they "have a right to eat." Who is being unreasonable here?',
      sideALabel: 'They are wrong', sideBLabel: "You're too sensitive",
    },
    {
      userId: users[5].id, category: 'HR_ISSUES', postType: 'VENT', targetType: 'GENERAL',
      title: 'I reported a real issue to HR and somehow I became the problem',
      description: 'Filed a complaint with evidence. Two weeks later I am the one in a "coaching conversation" about being "negative." Lesson learned the hard way: HR exists to protect the company, not me.',
    },
    {
      userId: users[6].id, category: 'BAD_BOSS', postType: 'JUDGE', targetType: 'PERSON', targetName: 'my boss',
      title: 'My boss texts me on weekends and expects replies within the hour',
      description: 'No on-call rotation, no overtime, just a manager who treats Saturday like a workday. I ignored a 9pm message and got a passive-aggressive "noticed you went dark" on Monday. Setting a boundary, or being difficult?',
      sideALabel: 'Boundary is fair', sideBLabel: 'You should reply',
    },
    {
      userId: users[7].id, category: 'JOB_SECURITY', postType: 'VENT', targetType: 'COMPANY', companyName: 'Google',
      title: 'Layoffs by email at 6am, then a "business as usual" all-hands at 9',
      description: 'Half the team got the email. The survivors got a peppy all-hands telling us to "stay focused and energized." I cannot focus. I am updating my resume between meetings and pretending to smile on camera.',
    },
    {
      userId: users[8].id, category: 'WORK_CULTURE', postType: 'JUDGE', targetType: 'GENERAL',
      title: 'Every Friday is "mandatory fun" and skipping it is held against you',
      description: 'Forced happy hours, themed dress days, a Slack channel of forced enthusiasm. Opt out once and suddenly you are "not a culture fit." I just want to do my job and go home. Am I the problem here?',
      sideALabel: 'Opting out is fine', sideBLabel: 'Just show up',
    },
    {
      userId: users[9].id, category: 'OFFICE_POLITICS', postType: 'VENT', targetType: 'GENERAL',
      title: 'The loudest person on my team gets credit while the quiet ones carry it',
      description: 'Visibility is everything here. Whoever talks most in meetings is "high performing"; those of us actually shipping get overlooked at review time. I am tired of playing a game I never signed up for.',
    },
    {
      userId: users[0].id, category: 'PAY_AND_PROMOTION', postType: 'JUDGE', targetType: 'GENERAL',
      title: 'Promised a promotion "next quarter" for two years running',
      description: 'Every review: "you are basically there, let us formalize next quarter." Three next-quarters have come and gone. I keep doing the senior work for the junior pay. Do I give an ultimatum or just leave?',
      sideALabel: 'Give an ultimatum', sideBLabel: 'Walk quietly',
    },
    {
      userId: users[2].id, category: 'RETURN_TO_OFFICE', postType: 'VENT', targetType: 'COMPANY', companyName: 'Infosys',
      title: 'They cut remote work but did not add enough desks for everyone',
      description: 'Mandatory four days in office. There are not enough seats, so we hot-desk and fight over monitors. I spent 20 minutes today just finding somewhere to sit before my first call. Peak corporate theater.',
    },
    {
      userId: users[4].id, category: 'TOXIC_MANAGEMENT', postType: 'JUDGE', targetType: 'PERSON', targetName: 'my manager',
      title: 'Boss publicly criticizes people in the team channel',
      description: 'Our manager posts call-outs in the public team channel — names, mistakes, the works. Morale is on the floor. HR says "give direct feedback to your manager," which is impossible when the manager IS the problem. Do I go over their head?',
      sideALabel: 'Go over their head', sideBLabel: 'Try direct feedback first',
    },
    {
      userId: users[6].id, category: 'WORK_LIFE_BALANCE', postType: 'VENT', targetType: 'GENERAL',
      title: 'Burnt out so badly I cried in the office bathroom today',
      description: 'Back-to-back meetings, lunch at the desk, work bleeding into every evening. Today it just broke me. Everyone acts like this grind is the baseline. Please tell me I am not crazy for thinking it should not be.',
    },
  ];

  const createdCases = [];
  for (const seed of caseSeeds) {
    const { companyName, ...rest } = seed;
    const data = {
      ...rest,
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(20),
    };
    if (companyName && companies[companyName]) {
      data.companyId = companies[companyName].id;
      data.targetType = 'COMPANY';
      data.targetName = companyName;
    }
    const c = await prisma.case.create({ data });
    createdCases.push(c);
  }
  console.log('📋 Created cases:', createdCases.length);

  // Votes on JUDGE cases; reactions on VENT cases.
  const reactionTypes = ['RELATABLE', 'BOSS_WRONG', 'OVERREACTING', 'SAME_HERE', 'RUN'];
  for (const caseItem of createdCases) {
    const others = users.filter((u) => u.id !== caseItem.userId);
    for (const u of others) {
      if (Math.random() > 0.75) continue; // ~75% engage
      try {
        if (caseItem.postType === 'JUDGE') {
          await prisma.vote.create({
            data: { caseId: caseItem.id, userId: u.id, side: Math.random() > 0.42 ? 'SIDE_A' : 'SIDE_B' },
          });
        } else {
          await prisma.reaction.create({
            data: { caseId: caseItem.id, userId: u.id, type: reactionTypes[Math.floor(Math.random() * reactionTypes.length)] },
          });
        }
      } catch (e) {
        // ignore duplicates
      }
    }
  }
  console.log('🗳️ Created votes and reactions');

  // A handful of on-theme comments spread across cases.
  const commentPool = [
    'Document everything. Dates, screenshots, emails. You will want the paper trail.',
    'NTA. This is exactly how good people get pushed out. Protect yourself.',
    'Been there. Set the boundary once, in writing, and hold the line.',
    'Honestly? Start applying. A culture that does this will not change for you.',
    'Take it to skip-level. Your manager will not fix the thing they created.',
    'You are not overreacting. This is textbook burnout fuel.',
    'HR works for the company, not for you. Loop in a neutral senior person instead.',
    'The fastest raise is almost always a new offer. Go get the market number.',
    'Respectfully — did you tell them directly, or just hint? Be explicit first.',
    'Log off. You owe them work, not your evenings.',
  ];
  let commentCount = 0;
  for (const caseItem of createdCases) {
    const n = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const commenter = users[Math.floor(Math.random() * users.length)];
      try {
        await prisma.comment.create({
          data: {
            caseId: caseItem.id,
            userId: commenter.id,
            content: commentPool[Math.floor(Math.random() * commentPool.length)],
            upvotes: Math.floor(Math.random() * 200),
            downvotes: Math.floor(Math.random() * 40),
          },
        });
        commentCount++;
      } catch (e) {
        // ignore
      }
    }
  }
  console.log('💬 Created comments:', commentCount);

  // Close a few JUDGE cases with verdicts for the marquee.
  console.log('\n🏛️ Closing some cases with verdicts...');
  const judgeCases = createdCases.filter((c) => c.postType === 'JUDGE').slice(0, 4);
  let closedCount = 0;
  for (const caseItem of judgeCases) {
    const voteCounts = await prisma.vote.groupBy({
      by: ['side'],
      where: { caseId: caseItem.id },
      _count: true,
    });
    const sideAVotes = voteCounts.find((v) => v.side === 'SIDE_A')?._count || 0;
    const sideBVotes = voteCounts.find((v) => v.side === 'SIDE_B')?._count || 0;
    const { verdict, margin, ownerReward } = calculateVerdict(sideAVotes, sideBVotes);

    const closedAt = new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000);
    await prisma.case.update({
      where: { id: caseItem.id },
      data: {
        status: 'CLOSED',
        closedAt,
        closureType: Math.random() > 0.7 ? 'MANUAL_OWNER' : 'AUTO_VOTE_THRESHOLD',
        verdict,
        verdictMargin: margin,
        ownerReward,
      },
    });
    if (ownerReward > 0) {
      await prisma.user.update({
        where: { id: caseItem.userId },
        data: { caseEarnings: { increment: ownerReward }, totalEarnings: { increment: ownerReward } },
      });
    }
    closedCount++;
  }
  console.log(`🏛️ Closed ${closedCount} cases with verdicts`);

  console.log('\n✅ Seed completed successfully! 🎉');
  console.log('\n📝 Demo accounts (password: password123):');
  console.log('   • burnt@example.com');
  console.log('   • salty@example.com');
  console.log('   • ghosted@example.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
