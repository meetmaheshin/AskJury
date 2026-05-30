import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { calculateVerdict } from '../src/utils/verdictCalculator.js';
import { findOrCreateCompany } from '../src/utils/companies.js';
import {
  ALL_CASE_TEMPLATES,
  WORKPLACE_COMMENTS,
  WORK_CATEGORIES,
  COMPANY_POOL,
} from '../src/jobs/botActivityManager.js';
import { LIFE_COMMENTS } from '../src/jobs/lifeTemplates.js';

const prisma = new PrismaClient();

// ---- Tunables (matches the "realistic / established" backfill) ----
const NUM_BOTS = 80;
const TARGET_CASES = 500;
const TARGET_COMMENTS = 1500;
const LAUNCH = new Date('2025-12-02T00:00:00Z'); // first deploy
const NOW = new Date();
const DAY_MS = 24 * 60 * 60 * 1000;
const SPAN_DAYS = Math.max(1, Math.floor((NOW - LAUNCH) / DAY_MS));

const ADJ = ['Silent', 'Burnt', 'Caffeinated', 'Underpaid', 'Overworked', 'Grumpy', 'Salty', 'Ghosted', 'Micromanaged', 'Disgruntled', 'Quiet', 'Furious', 'Tired', 'Jaded', 'Bored', 'Sneaky', 'Remote', 'Midnight', 'Corporate', 'Rogue', 'Spicy', 'Restless'];
const NOUN = ['Penguin', 'Intern', 'Analyst', 'Manager', 'Panda', 'Otter', 'Raccoon', 'Engineer', 'Walrus', 'Llama', 'Falcon', 'Badger', 'Koala', 'Ninja', 'Wombat', 'Phoenix', 'Yeti', 'Ferret', 'Mongoose', 'Whale', 'Slacker', 'Survivor', 'Wanderer', 'Insider'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

// Recent-weighted date between LAUNCH and NOW (squared random clusters near "now").
function weightedRecentDate() {
  const r = Math.random();
  const daysAgo = Math.floor(SPAN_DAYS * r * r);
  return new Date(NOW.getTime() - daysAgo * DAY_MS - randInt(0, 23) * 60 * 60 * 1000);
}

function shuffled(arr) {
  return [...arr].sort(() => 0.5 - Math.random());
}

async function main() {
  console.log('🚀 Starting seed...');

  await prisma.comment.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.case.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  console.log('🗑️ Cleared existing data');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 8 named demo users (real-style) + NUM_BOTS bot users.
  const named = [
    { email: 'aanya@example.com', username: 'aanya_demo', anonymousHandle: 'QuietKoala2048', bio: 'Just here for the drama 🍿' },
    { email: 'rohan@example.com', username: 'rohan_demo', anonymousHandle: 'SaltyEngineer3310', bio: 'Verdict enjoyer' },
    { email: 'meera@example.com', username: 'meera_demo', anonymousHandle: 'TiredOtter7782', bio: 'Team "you are valid"' },
    { email: 'sam@example.com', username: 'sam_demo', anonymousHandle: 'RemoteLlama1190', bio: 'WFH forever' },
    { email: 'priya@example.com', username: 'priya_demo', anonymousHandle: 'JadedFalcon5521', bio: 'Seen it all' },
    { email: 'dev@example.com', username: 'dev_demo', anonymousHandle: 'GrumpyPanda8806', bio: 'Devil\'s advocate' },
    { email: 'nina@example.com', username: 'nina_demo', anonymousHandle: 'SpicyFerret4417', bio: 'Hot takes only' },
    { email: 'omar@example.com', username: 'omar_demo', anonymousHandle: 'CorporateYeti6093', bio: 'Surviving Q4' },
  ];

  const users = [];
  for (const u of named) {
    users.push(await prisma.user.create({ data: { ...u, passwordHash, isVerified: true } }));
  }
  for (let i = 0; i < NUM_BOTS; i++) {
    const handle = `${pick(ADJ)}${pick(NOUN)}${1000 + i}`;
    users.push(await prisma.user.create({
      data: {
        email: `bot${i}@bots.askjury.local`,
        username: `bot_${i}_${handle.toLowerCase()}`.slice(0, 30),
        anonymousHandle: handle,
        passwordHash,
        isBot: true,
        isVerified: true,
        createdAt: weightedRecentDate(),
      },
    }));
  }
  console.log(`👥 Created users: ${users.length} (${NUM_BOTS} bots + ${named.length} demo)`);

  // Companies people rant about.
  const companies = {};
  for (const name of COMPANY_POOL) {
    const c = await findOrCreateCompany(prisma, name);
    if (c) companies[name] = c;
  }
  console.log('🏢 Created companies:', Object.keys(companies).length);

  // Build the case list from the shared template pool.
  const createdCases = [];
  for (let i = 0; i < TARGET_CASES; i++) {
    const block = pick(ALL_CASE_TEMPLATES);
    const tpl = pick(block.templates);
    const category = block.category;
    const isWork = WORK_CATEGORIES.has(category);
    const postType = Math.random() < 0.55 ? 'JUDGE' : 'VENT';

    const data = {
      userId: pick(users).id,
      title: tpl.title,
      description: tpl.description,
      category,
      postType,
      mediaUrls: JSON.stringify([]),
      createdAt: weightedRecentDate(),
    };

    // ~30% of workplace cases tag a company.
    if (isWork && Math.random() < 0.3) {
      const name = pick(COMPANY_POOL);
      if (companies[name]) {
        data.companyId = companies[name].id;
        data.targetType = 'COMPANY';
        data.targetName = name;
      }
    }

    createdCases.push(await prisma.case.create({ data }));
  }
  console.log('📋 Created cases:', createdCases.length);

  // Votes (JUDGE) + reactions (VENT).
  const reactionTypes = ['RELATABLE', 'BOSS_WRONG', 'OVERREACTING', 'SAME_HERE', 'RUN'];
  const votesData = [];
  const reactionsData = [];
  for (const c of createdCases) {
    const voters = shuffled(users.filter((u) => u.id !== c.userId)).slice(0, randInt(4, 45));
    if (c.postType === 'JUDGE') {
      for (const u of voters) votesData.push({ caseId: c.id, userId: u.id, side: Math.random() < 0.55 ? 'SIDE_A' : 'SIDE_B' });
    } else {
      for (const u of voters.slice(0, randInt(3, 30))) reactionsData.push({ caseId: c.id, userId: u.id, type: pick(reactionTypes) });
    }
  }
  for (let i = 0; i < votesData.length; i += 1000) await prisma.vote.createMany({ data: votesData.slice(i, i + 1000), skipDuplicates: true });
  for (let i = 0; i < reactionsData.length; i += 1000) await prisma.reaction.createMany({ data: reactionsData.slice(i, i + 1000), skipDuplicates: true });
  console.log(`🗳️ Created ${votesData.length} votes and ${reactionsData.length} reactions`);

  // Comments spread across cases.
  const commentsData = [];
  for (let i = 0; i < TARGET_COMMENTS; i++) {
    const c = pick(createdCases);
    const pool = WORK_CATEGORIES.has(c.category) ? WORKPLACE_COMMENTS : LIFE_COMMENTS;
    const offset = Math.random() * (NOW.getTime() - new Date(c.createdAt).getTime());
    commentsData.push({
      caseId: c.id,
      userId: pick(users).id,
      content: pick(pool),
      upvotes: randInt(0, 240),
      downvotes: randInt(0, 40),
      createdAt: new Date(new Date(c.createdAt).getTime() + offset),
    });
  }
  for (let i = 0; i < commentsData.length; i += 1000) await prisma.comment.createMany({ data: commentsData.slice(i, i + 1000) });
  console.log('💬 Created comments:', commentsData.length);

  // Close ~40% of older JUDGE cases with verdicts (for the marquee + history).
  console.log('🏛️ Closing older JUDGE cases with verdicts...');
  let closed = 0;
  for (const c of createdCases) {
    if (c.postType !== 'JUDGE') continue;
    const ageDays = (NOW - new Date(c.createdAt)) / DAY_MS;
    if (ageDays < 7 || Math.random() > 0.4) continue;

    const vc = await prisma.vote.groupBy({ by: ['side'], where: { caseId: c.id }, _count: true });
    const a = vc.find((v) => v.side === 'SIDE_A')?._count || 0;
    const b = vc.find((v) => v.side === 'SIDE_B')?._count || 0;
    const { verdict, margin, ownerReward } = calculateVerdict(a, b);
    const closedAt = new Date(new Date(c.createdAt).getTime() + randInt(2, 6) * DAY_MS);

    await prisma.case.update({
      where: { id: c.id },
      data: {
        status: 'CLOSED',
        closedAt: closedAt > NOW ? NOW : closedAt,
        closureType: Math.random() > 0.7 ? 'MANUAL_OWNER' : 'AUTO_VOTE_THRESHOLD',
        verdict,
        verdictMargin: margin,
        ownerReward,
      },
    });
    if (ownerReward > 0) {
      await prisma.user.update({
        where: { id: c.userId },
        data: { caseEarnings: { increment: ownerReward }, totalEarnings: { increment: ownerReward } },
      });
    }
    closed++;
  }
  console.log(`🏛️ Closed ${closed} cases with verdicts`);

  console.log('\n✅ Seed completed successfully! 🎉');
  console.log('   Demo login (password: password123): aanya@example.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
