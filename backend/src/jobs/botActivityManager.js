import { PrismaClient } from '@prisma/client';
import { generateAICase } from '../services/perplexityCaseGenerator.js';
import { findOrCreateCompany } from '../utils/companies.js';
import { CATEGORY_VALUES, REACTION_TYPES } from '../utils/constants.js';

const prisma = new PrismaClient();

// Workplace-rant case templates, keyed by the CaseCategory enum in schema.prisma.
// Each post is either a JUDGE (two-sided vote) or a VENT (reactions only).
const caseTemplates = [
  {
    category: 'TOXIC_MANAGEMENT',
    templates: [
      { title: 'My manager takes credit for my work in every leadership meeting', description: 'I build the decks, run the numbers, and ship the projects. In front of the VPs my manager says "I put this together." When I raised it 1:1 they called me "not a team player." Do I escalate to skip-level or just start documenting everything?' },
      { title: 'Manager schedules "urgent" calls 10 minutes before end of day, daily', description: 'Every single day around 5:50pm my manager drops a "quick sync" that runs 40 minutes. It is never urgent. I have stopped making evening plans entirely. Am I overreacting for wanting to log off on time?' },
      { title: 'Boss publicly criticizes people in the team channel', description: 'Our manager posts call-outs in the public team channel — names, mistakes, the works. Morale is in the floor. HR says "give direct feedback to your manager." How is that supposed to work when the manager IS the problem?' },
    ],
  },
  {
    category: 'BAD_BOSS',
    templates: [
      { title: 'My boss texts me on weekends and expects replies within the hour', description: 'No on-call rotation, no overtime, just a manager who treats Saturday like a workday. Last weekend I ignored a 9pm message and got a passive-aggressive "noticed you went dark" on Monday. Setting boundaries or being difficult?' },
      { title: 'Boss denied my leave then posted from the same resort I asked off for', description: 'I requested 3 days off months ago. Denied, "too busy." Then my boss is on Instagram at the exact beach resort I mentioned, during my denied dates. I am fuming. Worth bringing up or let it go?' },
      { title: 'New boss reversed every process and blames us when it breaks', description: 'Six weeks in, our new boss scrapped the workflows that worked, pushed their own, and now that things are missing deadlines it is somehow "the team executing poorly." Vent. I am so tired.' },
    ],
  },
  {
    category: 'COWORKER_DRAMA',
    templates: [
      { title: 'Coworker microwaves fish at their desk every single day', description: 'Open-plan office. Every lunch, fish. The whole floor smells. Three people asked nicely, HR sent a "be considerate" email, nothing changed. They say they "have a right to eat." Who is being unreasonable here?' },
      { title: 'A coworker keeps "borrowing" my ideas in standup before I can speak', description: 'We sit next to each other. I mention an approach, and in standup they say it first, framed as theirs. I have started messaging ideas to my manager first with timestamps. Petty or smart?' },
      { title: 'Coworker plays music out loud and gets offended when asked to use headphones', description: 'Low volume but constant, all day. I asked once, politely. They said "the office allows it" and now act cold toward me. Am I the difficult one for wanting quiet to focus?' },
    ],
  },
  {
    category: 'PAY_AND_PROMOTION',
    templates: [
      { title: 'I trained the new hire who got promoted above me six months later', description: 'I onboarded them, reviewed their work, covered their mistakes. They got the senior title and the raise in the last cycle. I got "keep it up." I am still here doing the same job for less. Should I just leave?' },
      { title: 'Found out a junior on my team makes more than me after 4 years here', description: 'Pay transparency leak in a shared sheet. Someone hired last year, less scope, makes 12% more than me. Loyalty tax is real. Do I walk into my manager with this or pretend I never saw it?' },
      { title: 'Promised a promotion "next quarter" for two years running', description: 'Every review: "you are basically there, let us formalize next quarter." Three next-quarters have passed. I keep taking on the senior work without the senior pay. Venting before I do something dramatic.' },
    ],
  },
  {
    category: 'JOB_SECURITY',
    templates: [
      { title: 'Layoffs announced by email at 6am, then a "business as usual" all-hands at 9', description: 'Half the team got the email. The survivors got a peppy all-hands telling us to "stay focused and energized." I cannot focus. I am updating my resume between meetings. Anyone else just numb?' },
      { title: 'Should I tell my teammate their role is being cut before HR does?', description: 'I accidentally saw the reorg doc. My closest work friend is on the cut list and has no idea, they just signed a lease. If I warn them I could get fired. If I do not, I feel like a coward. What would you do?' },
      { title: 'They replaced laid-off staff with contractors and call it "efficiency"', description: 'Same work, half the people, now propped up by contractors who do not know the systems. Leadership calls it a "leaner model." It is just us doing three jobs. Pure vent.' },
    ],
  },
  {
    category: 'WORK_LIFE_BALANCE',
    templates: [
      { title: 'I took my first real vacation in two years and got called twice on day one', description: 'Approved leave, handover doc written, backup assigned. Day one of the trip, two "just one quick thing" calls. I answered. I hate that I answered. How do you actually disconnect?' },
      { title: 'Burnt out so badly I cried in the office bathroom — is this normal now?', description: 'Back-to-back meetings, lunch at the desk, work bleeding into every evening. Today it just broke me. Everyone acts like this grind is the baseline. Tell me I am not crazy for thinking it should not be.' },
      { title: 'Team treats taking lunch away from the desk like a personal insult', description: 'I block 30 minutes to actually eat. I get "must be nice" comments and meeting invites dropped right on it. Defending my lunch break should not be this hard. Vent.' },
    ],
  },
  {
    category: 'HR_ISSUES',
    templates: [
      { title: 'I reported a real issue to HR and somehow I became the problem', description: 'Filed a complaint with evidence. Two weeks later I am the one in a "coaching conversation" about being "negative." HR is there to protect the company, not me. How do I protect myself now?' },
      { title: 'HR scheduled my "confidential" complaint review with the person I complained about', description: 'I raised something about my manager. HR set up a "resolution meeting" — and invited the manager. So much for confidential. I have lost all trust. What are my options?' },
      { title: 'Return-to-office mandate dropped the week after I relocated with HR approval', description: 'HR approved my remote move in writing. I relocated. Seven days later: "everyone back 4 days a week." Now I am the exception nobody will own. Am I wrong to demand they honor the agreement?' },
    ],
  },
  {
    category: 'OFFICE_POLITICS',
    templates: [
      { title: 'The loudest person on my team gets credit while the quiet ones carry it', description: 'Visibility is everything here. The person who talks most in meetings is "high performing"; those of us actually shipping get overlooked. Do I learn to play the game or find a place that values output?' },
      { title: 'Two senior managers are feuding and my project is the battleground', description: 'Their personal turf war means every decision gets reversed depending on who is in the room. My project has restarted three times. I just want to do the work. Vent.' },
      { title: 'Excluded from the meeting where my own project was decided', description: 'A "small group" met about the project I lead and made calls without me, then forwarded the notes. This is the third time. Am I being pushed out or am I being paranoid?' },
    ],
  },
  {
    category: 'RETURN_TO_OFFICE',
    templates: [
      { title: 'RTO mandate, but I commute 90 minutes to sit on video calls all day', description: 'Everyone I work with is in other cities. I drive 3 hours round-trip to take the same Zoom calls I took from home, just in a louder room. How is this productivity? Am I wrong to push back hard?' },
      { title: 'They cut remote work but did not add enough desks for everyone', description: 'Mandatory 4 days in office. There are not enough seats, so we hot-desk and fight for monitors. I spent 20 minutes today just finding somewhere to sit. Pure vent.' },
      { title: 'Manager counts "badge swipes" but ignores what we actually deliver', description: 'Performance is now measured by how often my badge hits the door, not output. People badge in and work from the cafe. The metric is theater. Should I just play along?' },
    ],
  },
  {
    category: 'WORK_CULTURE',
    templates: [
      { title: 'Every Friday is "mandatory fun" and skipping it is held against you', description: 'Forced happy hours, themed dress days, a Slack channel of forced enthusiasm. Opt out once and you are "not a culture fit." I just want to do my job and go home. Am I the problem?' },
      { title: '"We are a family here" — until you ask about overtime pay', description: 'Family rhetoric all over the walls and onboarding. The moment you set a boundary or ask about comp, suddenly it is strictly business. The double standard is exhausting. Vent.' },
      { title: 'New CEO sent a "work harder" memo from their third vacation home', description: 'Company-wide email about "hunger" and "doing whatever it takes," signed off from what is visibly a luxury getaway. The room read is catastrophic. Tell me I am right to be annoyed.' },
    ],
  },
];

// Companies bots occasionally tag a rant at (created on-demand via findOrCreateCompany).
const COMPANY_POOL = [
  'Amazon', 'Google', 'Meta', 'Microsoft', 'Tesla', 'Infosys', 'TCS', 'Wipro',
  'Accenture', 'Deloitte', 'IBM', 'Oracle', 'Salesforce', 'Uber', 'Netflix',
  'Cognizant', 'Capgemini', 'JPMorgan', 'Goldman Sachs', 'PwC',
];

// Free-text targets for PERSON-aimed rants.
const PERSON_TARGETS = ['my manager', 'my boss', 'my coworker', 'my team lead', 'HR', 'my skip-level'];

// Workplace-themed comments bots leave on cases.
const commentTemplates = [
  'Document everything. Dates, screenshots, emails. You will want a paper trail.',
  'This is a classic case of a manager protecting themselves. You are not wrong.',
  'Been there. Set the boundary once, clearly, in writing, and hold it.',
  'Honestly? Start applying. A culture that does this will not change for you.',
  'Take it to skip-level. Your manager is not going to fix the thing they created.',
  'You are not overreacting. This is exactly the kind of thing that burns people out.',
  'HR works for the company, not for you. Protect yourself first.',
  'I would loop in a neutral senior person before going to HR.',
  'Quiet quitting was invented for situations exactly like this.',
  'Your output is not the problem here. The visibility game is rigged.',
  'NTA. Reply-all the next time they take credit, politely, with the receipts.',
  'Respectfully, you might be reading too much into one bad week. Give it a beat.',
  'Counterpoint: did you actually tell them directly, or just hint? Be explicit first.',
  'This screams "leave before it gets worse." Update the resume tonight.',
  'Set an auto-responder after 6pm and just... stop replying. They will adapt.',
  'Comp transparency exists for this exact reason. Walk in with market data.',
  'RTO with no desks is peak corporate theater. You are valid.',
  'Loyalty tax is real. The fastest raise is usually a new offer.',
  'Keep it professional, keep it documented, and keep your options open.',
  'I have seen this exact thing end in a constructive-dismissal claim. Know your rights.',
  'Take the PTO. Turn off notifications. The work will survive without you.',
  'Sounds like a manager problem, not a you problem.',
  'Play the game just enough to stay safe while you line up the exit.',
  'You owe them work, not your evenings. Log off.',
  'Talk to a couple of trusted peers — bet you are not the only one feeling this.',
];

/** Get random bot users for activity. */
async function getRandomBots(count = 1) {
  const bots = await prisma.user.findMany({
    where: { isBot: true },
    select: { id: true, username: true },
  });

  if (bots.length === 0) return [];

  const shuffled = bots.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, bots.length));
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Generate a random workplace case from templates. */
function getRandomCaseTemplate() {
  const categoryData = pick(caseTemplates);
  const template = pick(categoryData.templates);
  return { ...template, category: categoryData.category };
}

/** Decide post shape (VENT vs JUDGE) and who/what it targets. */
function decorateCase(caseData) {
  // Honor an AI-chosen postType; otherwise ~55% JUDGE, ~45% VENT.
  const postType = caseData.postType === 'VENT' || caseData.postType === 'JUDGE'
    ? caseData.postType
    : Math.random() < 0.55 ? 'JUDGE' : 'VENT';

  // Target: 30% a named company, 25% a person, rest general.
  const roll = Math.random();
  let targetType = 'GENERAL';
  let targetName = null;
  let companyName = null;
  if (roll < 0.3) {
    targetType = 'COMPANY';
    companyName = pick(COMPANY_POOL);
    targetName = companyName;
  } else if (roll < 0.55) {
    targetType = 'PERSON';
    targetName = pick(PERSON_TARGETS);
  }

  return { ...caseData, postType, targetType, targetName, companyName };
}

/** Bot creates a new workplace case (AI-generated when possible, else a template). */
async function botCreateCase() {
  try {
    const [bot] = await getRandomBots(1);
    if (!bot) {
      console.log('⚠️  No bots available to create case');
      return null;
    }

    // 70% chance: AI-generated workplace rant. 30%: template fallback.
    const useAI = Math.random() < 0.7;
    let caseData = null;

    if (useAI && process.env.PERPLEXITY_API_KEY) {
      console.log('🤖 Generating AI workplace case...');
      caseData = await generateAICase();
    }

    if (!caseData) {
      caseData = getRandomCaseTemplate();
    }

    // Safety net: never insert a category the enum does not know about.
    if (!CATEGORY_VALUES.includes(caseData.category)) {
      caseData.category = 'OTHER';
    }

    const decorated = decorateCase(caseData);

    // Resolve a company when the rant targets one.
    let companyId = null;
    if (decorated.companyName) {
      const company = await findOrCreateCompany(prisma, decorated.companyName);
      if (company) companyId = company.id;
    }

    const newCase = await prisma.case.create({
      data: {
        userId: bot.id,
        title: decorated.title,
        description: decorated.description,
        category: decorated.category,
        postType: decorated.postType,
        targetType: companyId ? 'COMPANY' : decorated.targetType,
        targetName: decorated.targetName,
        companyId,
        // Side labels only matter for JUDGE; let the schema defaults stand otherwise.
      },
    });

    const source = useAI && caseData ? '🤖 AI' : '📋 Template';
    console.log(`✅ Bot ${bot.username} created ${decorated.postType} case (${source}): "${decorated.title.substring(0, 50)}..."`);
    return newCase;
  } catch (error) {
    console.error('❌ Error creating bot case:', error.message);
    return null;
  }
}

/** Bot votes on a random active JUDGE case (vent posts cannot be voted on). */
async function botVoteOnCase() {
  try {
    const activeCases = await prisma.case.findMany({
      where: { status: 'ACTIVE', postType: 'JUDGE' },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    if (activeCases.length === 0) {
      console.log('⚠️  No active JUDGE cases to vote on');
      return null;
    }

    const randomCase = pick(activeCases);
    const [bot] = await getRandomBots(1);
    if (!bot) {
      console.log('⚠️  No bots available to vote');
      return null;
    }

    const existingVote = await prisma.vote.findUnique({
      where: { caseId_userId: { caseId: randomCase.id, userId: bot.id } },
    });
    if (existingVote) return null; // already voted; let the next cycle pick another

    // Slight bias toward "you're valid" — workplace ranters usually have the room.
    const side = Math.random() < 0.6 ? 'SIDE_A' : 'SIDE_B';

    const vote = await prisma.vote.create({
      data: { caseId: randomCase.id, userId: bot.id, side },
    });

    console.log(`✅ Bot ${bot.username} voted ${side} on: "${randomCase.title.substring(0, 40)}..."`);
    return vote;
  } catch (error) {
    console.error('❌ Error creating bot vote:', error.message);
    return null;
  }
}

/** Bot reacts to a random active case (works for both VENT and JUDGE posts). */
async function botReactOnCase() {
  try {
    const activeCases = await prisma.case.findMany({
      where: { status: 'ACTIVE' },
      take: 25,
      orderBy: { createdAt: 'desc' },
    });

    if (activeCases.length === 0) {
      console.log('⚠️  No active cases to react to');
      return null;
    }

    const randomCase = pick(activeCases);
    const [bot] = await getRandomBots(1);
    if (!bot) {
      console.log('⚠️  No bots available to react');
      return null;
    }

    const existing = await prisma.reaction.findUnique({
      where: { caseId_userId: { caseId: randomCase.id, userId: bot.id } },
    });
    if (existing) return null; // one reaction per user per case

    const type = pick(REACTION_TYPES);
    const reaction = await prisma.reaction.create({
      data: { caseId: randomCase.id, userId: bot.id, type },
    });

    console.log(`✅ Bot ${bot.username} reacted ${type} on: "${randomCase.title.substring(0, 40)}..."`);
    return reaction;
  } catch (error) {
    console.error('❌ Error creating bot reaction:', error.message);
    return null;
  }
}

/** Bot comments on a random active case. */
async function botCommentOnCase() {
  try {
    const activeCases = await prisma.case.findMany({
      where: { status: 'ACTIVE' },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    if (activeCases.length === 0) {
      console.log('⚠️  No active cases to comment on');
      return null;
    }

    const randomCase = pick(activeCases);
    const [bot] = await getRandomBots(1);
    if (!bot) {
      console.log('⚠️  No bots available to comment');
      return null;
    }

    const comment = await prisma.comment.create({
      data: {
        caseId: randomCase.id,
        userId: bot.id,
        content: pick(commentTemplates),
      },
    });

    console.log(`✅ Bot ${bot.username} commented on: "${randomCase.title.substring(0, 40)}..."`);
    return comment;
  } catch (error) {
    console.error('❌ Error creating bot comment:', error.message);
    return null;
  }
}

/** Bot upvotes or downvotes a random recent comment. */
async function botVoteOnComment() {
  try {
    const recentComments = await prisma.comment.findMany({
      where: { case: { status: 'ACTIVE' } },
      take: 30,
      orderBy: { createdAt: 'desc' },
    });

    if (recentComments.length === 0) {
      console.log('⚠️  No comments to vote on');
      return null;
    }

    const randomComment = pick(recentComments);
    const isUpvote = Math.random() < 0.7; // positive bias

    const updatedComment = await prisma.comment.update({
      where: { id: randomComment.id },
      data: {
        upvotes: isUpvote ? { increment: 1 } : undefined,
        downvotes: !isUpvote ? { increment: 1 } : undefined,
      },
    });

    console.log(`✅ Bot ${isUpvote ? 'upvoted' : 'downvoted'} a comment`);
    return updatedComment;
  } catch (error) {
    console.error('❌ Error voting on comment:', error.message);
    return null;
  }
}

/** Run a single random bot activity with a realistic distribution. */
async function runBotActivity() {
  console.log('\n🤖 Running bot activity cycle...');

  // 15% create case, 25% vote (JUDGE), 20% react (VENT + JUDGE),
  // 25% comment, 15% vote on a comment.
  const activity = Math.random();

  if (activity < 0.15) {
    await botCreateCase();
  } else if (activity < 0.40) {
    await botVoteOnCase();
  } else if (activity < 0.60) {
    await botReactOnCase();
  } else if (activity < 0.85) {
    await botCommentOnCase();
  } else {
    await botVoteOnComment();
  }
}

/** Run multiple bot activities back to back. */
async function runMultipleBotActivities(count = 3) {
  console.log(`\n🤖 Running ${count} bot activities...`);

  for (let i = 0; i < count; i++) {
    await runBotActivity();
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log('✅ Bot activity cycle completed\n');
}

export {
  botCreateCase,
  botVoteOnCase,
  botReactOnCase,
  botCommentOnCase,
  botVoteOnComment,
  runBotActivity,
  runMultipleBotActivities,
};
