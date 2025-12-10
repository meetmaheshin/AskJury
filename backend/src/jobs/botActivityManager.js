import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Case topics and descriptions for bot-generated content
const caseTemplates = [
  {
    category: 'ROOMMATE_DISPUTES',
    templates: [
      { title: 'Roommate keeps eating my food without asking', description: 'My roommate has been taking my food from the fridge without permission. I labeled everything clearly, but they still help themselves. They say I\'m being petty because "we\'re roommates" and should share. Am I wrong for being upset about this?' },
      { title: 'Roommate refuses to clean shared bathroom', description: 'I live with someone who never cleans the bathroom we share. I\'ve asked multiple times, but they say they\'re "too busy" with work. I end up cleaning it every time because I can\'t stand the mess. Should they pay more rent since I\'m doing all the cleaning?' },
      { title: 'Roommate has guests over every weekend', description: 'My roommate invites friends over every Friday and Saturday night until 2-3 AM. The noise makes it hard for me to sleep, and I have work in the morning. They say it\'s their place too and I should just deal with it. Who\'s in the wrong here?' },
      { title: 'Roommate doesn\'t pay utilities on time', description: 'Every month I have to chase my roommate for their share of electricity and internet bills. They always have excuses and say I\'m being too strict about deadlines. I\'m tired of fronting the money. Should I just add it to next month\'s rent?' },
      { title: 'Roommate uses my Netflix account for their friends', description: 'I pay for Netflix and gave my roommate access. Now they\'ve shared the password with their friends and family. My account is maxed out and I can\'t even watch. They say I\'m being selfish since "streaming is meant to be shared."' },
      { title: 'Roommate keeps thermostat too cold/hot', description: 'My roommate insists on keeping the AC at 18°C in summer. I\'m freezing all the time. When I adjust it, they change it back and say they\'re paying half so they get a say. How do we compromise?' }
    ]
  },
  {
    category: 'RELATIONSHIP_ISSUES',
    templates: [
      { title: 'Partner wants to split bills 50/50 despite income difference', description: 'I make $80k/year and my partner makes $45k/year. They insist on splitting all bills and rent exactly 50/50. I suggested splitting proportionally to our incomes, but they say that\'s not fair. What\'s the right approach here?' },
      { title: 'Partner checks my phone without permission', description: 'My partner occasionally picks up my phone and reads my messages when I\'m in the shower or sleeping. When I confronted them, they said if I have nothing to hide, it shouldn\'t be a problem. Is this normal in relationships?' },
      { title: 'Partner forgot our anniversary', description: 'My partner completely forgot our 2-year anniversary. No card, no gift, nothing. When I brought it up, they said anniversaries aren\'t that important and I\'m making a big deal out of nothing. Am I overreacting?' },
      { title: 'Partner refuses to meet my friends', description: 'My partner always makes excuses to avoid meeting my friend group. They say they\'re introverted and need alone time. But they hang out with their own friends all the time. This has been going on for 8 months.' },
      { title: 'Partner wants separate bank accounts after marriage', description: 'We\'re getting married soon and my partner insists on keeping completely separate finances. They don\'t want a joint account at all. I feel like marriage should mean sharing everything. Are separate accounts a red flag?' },
      { title: 'Partner follows their ex on social media', description: 'My partner still follows their ex on Instagram and likes their posts occasionally. When I asked them to unfollow, they said I\'m being insecure and controlling. They broke up 3 years ago. Am I wrong to feel uncomfortable?' }
    ]
  },
  {
    category: 'WORKPLACE_CONFLICTS',
    templates: [
      { title: 'Coworker takes credit for my ideas in meetings', description: 'During team meetings, my coworker often presents ideas we discussed privately as their own. When I mention it, they say we "collaborated" on it. It\'s happened three times now. Should I say something to my manager?' },
      { title: 'Boss expects me to work weekends without extra pay', description: 'My boss has been asking me to work Saturdays "to meet deadlines" but doesn\'t offer overtime pay or time off in exchange. When I asked about compensation, they said I\'m "not a team player." Is this acceptable?' },
      { title: 'Colleague microwaves fish in office kitchen', description: 'A coworker heats up fish in the microwave every day for lunch. The smell fills the entire office. Several people have complained, but they say they have a right to eat what they want. Who\'s right here?' },
      { title: 'Coworker plays music without headphones', description: 'My desk neighbor plays Spotify out loud all day at low volume. It\'s not super loud but I can hear it constantly. When I asked them to use headphones, they got offended and said the office allows music. Who\'s being unreasonable?' },
      { title: 'Manager scheduled meeting during my lunch break', description: 'My manager keeps scheduling "quick" 30-minute meetings during my 12-1 PM lunch break. When I said I prefer to keep that time free, they said everyone needs to be flexible. Should I push back harder?' },
      { title: 'Colleague always asks me to cover their shift', description: 'The same coworker asks me to cover their shift at least twice a month. They always have "emergencies" but I see them posting on social media having fun. I feel guilty saying no. Should I stop helping?' }
    ]
  },
  {
    category: 'FAMILY_DRAMA',
    templates: [
      { title: 'Parents expect me to pay their bills', description: 'I recently got a good job, and now my parents expect me to help pay their monthly bills. They say it\'s my duty as their child. I want to help, but it\'s affecting my ability to save. Am I being selfish?' },
      { title: 'Sister borrows money and never pays back', description: 'My sister has borrowed money from me five times in the past year, totaling about $2000. She promises to pay back but never does. Now she\'s asking for more. Should I keep lending to family?' },
      { title: 'In-laws visit without calling first', description: 'My in-laws drop by our house unannounced, sometimes as early as 8 AM on weekends. When I asked them to call first, they were offended and said "family doesn\'t need permission." Am I wrong to want notice?' },
      { title: 'Brother wants to borrow my car every weekend', description: 'My younger brother keeps asking to borrow my car for weekend trips. He has his own car but says mine is "nicer." Last time he returned it with an empty tank and a scratch. Should I say no?' },
      { title: 'Parents favor my sibling over me', description: 'My parents helped my sister with a down payment for her house but refused to help me with mine. They say she "needed it more" even though I asked first. I feel like I\'ve always been the second choice.' },
      { title: 'Family expects me to host every holiday', description: 'For the past 5 years, I\'ve hosted Thanksgiving and Christmas for my extended family. When I suggested rotating to someone else\'s house, they said my place is biggest and I\'m being selfish. I\'m exhausted.' }
    ]
  },
  {
    category: 'FRIEND_DISAGREEMENTS',
    templates: [
      { title: 'Friend always cancels plans last minute', description: 'My friend cancels on me about 70% of the time, usually an hour before we\'re supposed to meet. They always have an excuse. I told them it\'s frustrating, and they said I\'m being too demanding of their time. Am I?' },
      { title: 'Friend never pays when we go out', description: 'Every time we eat out together, my friend "forgets" their wallet or says they\'ll "get it next time." This has happened at least 10 times. Should I stop inviting them or bring it up?' },
      { title: 'Friend posted unflattering photo of me', description: 'My friend posted a terrible photo of me on social media without asking. I requested they take it down, but they said I\'m being vain and it\'s "not that bad." Should they have asked first?' },
      { title: 'Friend invited my ex to group hangout', description: 'My friend invited my ex to our group outing without asking me first. We had a messy breakup 6 months ago. My friend says I can\'t control who they invite and I need to "be mature about it."' },
      { title: 'Friend keeps trying to set me up on dates', description: 'My friend constantly tries to set me up with people I\'m not interested in. I\'ve said no many times but they keep pushing, saying I\'m "too picky." It\'s getting annoying. How do I make them stop?' },
      { title: 'Friend never responds to my messages', description: 'My friend takes 2-3 days to respond to my texts but posts on Instagram constantly. When I mentioned it, they said they\'re "bad at texting." But they reply to others immediately. Am I not a priority?' }
    ]
  },
  {
    category: 'MONEY_PAYMENTS',
    templates: [
      { title: 'Split dinner bill evenly when I ordered less', description: 'At dinner with friends, everyone wanted to split the bill evenly. I only had a salad ($12) while others had steaks and drinks ($40-50). I suggested paying separately, and they said I was being cheap. Who\'s right?' },
      { title: 'Friend wants me to pay for their concert ticket', description: 'I invited my friend to a concert, and now they expect me to pay for their ticket because I "invited them." I thought we\'d each pay our own way. Should the person who invites always pay?' },
      { title: 'Venmo request for $3 coffee', description: 'A friend Venmo requested me $3.50 for a coffee they grabbed for me two weeks ago. I didn\'t ask them to get it, they offered. Is it petty to request such a small amount after so long?' },
      { title: 'Group trip cost split unfairly', description: 'We booked an Airbnb for 6 people. Two couples took the master bedrooms and want to split cost evenly. I got the couch in the living room. Shouldn\'t couples pay more for private rooms?' },
      { title: 'Friend wants to use my discount without buying anything', description: 'I get a 30% employee discount at a store. My friend wants me to buy stuff for them using my discount even though I\'m not buying anything. The store prohibits this. They\'re calling me selfish.' },
      { title: 'Sibling expects me to pay for family gifts', description: 'Every birthday and holiday, my sibling suggests we go in together on gifts for family. But they never have money and I end up paying 80%. They still sign the card as "from both of us." Is this fair?' }
    ]
  }
];

const commentTemplates = [
  'You\'re definitely right in this situation.',
  'I can see both sides, but I think you handled it well.',
  'Have you tried talking to them about it?',
  'This is a tough one. I would probably do the same thing.',
  'I disagree. I think you should consider their perspective.',
  'Been in a similar situation. It doesn\'t get better unless you address it.',
  'You need to set better boundaries here.',
  'This is pretty common actually. Don\'t stress too much.',
  'I think you\'re overreacting a bit, to be honest.',
  'Stand your ground. You\'re not wrong.',
  'Maybe there\'s a compromise you haven\'t considered?',
  'Communication is key in situations like this.',
  'I would be upset too if I were in your position.',
  'Have you considered their side of things?',
  'This is tricky. Good luck figuring it out!',
  'NTA. They\'re clearly in the wrong here.',
  'YTA. You should apologize and move on.',
  'This sounds like a communication breakdown on both sides.',
  'Set firm boundaries and stick to them. Don\'t back down.',
  'Honestly, I think you\'re both being a bit unreasonable.',
  'Have you thought about the long-term implications of this?',
  'Sometimes you just have to let it go for your own peace of mind.',
  'Document everything. You might need it later.',
  'Trust your gut. If something feels off, it probably is.',
  'This is a red flag. Proceed with caution.',
  'You deserve better treatment than this.',
  'I\'d distance myself from this situation if I were you.',
  'They\'re gaslighting you. Don\'t let them.',
  'Sounds like you need to have a serious conversation.',
  'Cut them off. Life is too short for this drama.',
  'Give them one more chance, but make your expectations clear.',
  'This is totally normal. Don\'t beat yourself up.',
  'You\'re being too nice. Time to stand up for yourself.',
  'I see where they\'re coming from, actually.',
  'This requires a mature, calm discussion between adults.',
  'Some people just don\'t change. Accept it or move on.',
  'You did the right thing by bringing it up.',
  'This is a dealbreaker for me. How about you?',
  'Therapy might help you both work through this.',
  'You\'re not crazy for feeling this way.'
];

/**
 * Get random bot users for activity
 */
async function getRandomBots(count = 1) {
  const bots = await prisma.user.findMany({
    where: { isBot: true },
    select: { id: true, username: true }
  });

  if (bots.length === 0) return [];

  // Shuffle and return random bots
  const shuffled = bots.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, bots.length));
}

/**
 * Generate a random case from templates
 */
function getRandomCaseTemplate() {
  const categoryData = caseTemplates[Math.floor(Math.random() * caseTemplates.length)];
  const template = categoryData.templates[Math.floor(Math.random() * categoryData.templates.length)];

  return {
    ...template,
    category: categoryData.category
  };
}

/**
 * Bot creates a new case
 */
async function botCreateCase() {
  try {
    const [bot] = await getRandomBots(1);
    if (!bot) {
      console.log('⚠️  No bots available to create case');
      return null;
    }

    const template = getRandomCaseTemplate();

    const newCase = await prisma.case.create({
      data: {
        userId: bot.id,
        title: template.title,
        description: template.description,
        category: template.category,
        sideALabel: 'You\'re Right',
        sideBLabel: 'You\'re Wrong'
      }
    });

    console.log(`✅ Bot ${bot.username} created case: "${template.title}"`);
    return newCase;
  } catch (error) {
    console.error('❌ Error creating bot case:', error.message);
    return null;
  }
}

/**
 * Bot votes on a random active case
 */
async function botVoteOnCase() {
  try {
    // Get random active cases
    const activeCases = await prisma.case.findMany({
      where: { status: 'ACTIVE' },
      take: 20,
      orderBy: { createdAt: 'desc' }
    });

    if (activeCases.length === 0) {
      console.log('⚠️  No active cases to vote on');
      return null;
    }

    const randomCase = activeCases[Math.floor(Math.random() * activeCases.length)];
    const [bot] = await getRandomBots(1);

    if (!bot) {
      console.log('⚠️  No bots available to vote');
      return null;
    }

    // Check if bot already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        caseId_userId: {
          caseId: randomCase.id,
          userId: bot.id
        }
      }
    });

    if (existingVote) {
      return await botVoteOnCase(); // Try another case
    }

    // Random vote (60% SIDE_A, 40% SIDE_B for slight bias)
    const side = Math.random() < 0.6 ? 'SIDE_A' : 'SIDE_B';

    const vote = await prisma.vote.create({
      data: {
        caseId: randomCase.id,
        userId: bot.id,
        side
      }
    });

    console.log(`✅ Bot ${bot.username} voted ${side} on case: "${randomCase.title.substring(0, 40)}..."`);
    return vote;
  } catch (error) {
    console.error('❌ Error creating bot vote:', error.message);
    return null;
  }
}

/**
 * Bot comments on a random active case
 */
async function botCommentOnCase() {
  try {
    // Get random active cases
    const activeCases = await prisma.case.findMany({
      where: { status: 'ACTIVE' },
      take: 20,
      orderBy: { createdAt: 'desc' }
    });

    if (activeCases.length === 0) {
      console.log('⚠️  No active cases to comment on');
      return null;
    }

    const randomCase = activeCases[Math.floor(Math.random() * activeCases.length)];
    const [bot] = await getRandomBots(1);

    if (!bot) {
      console.log('⚠️  No bots available to comment');
      return null;
    }

    const commentText = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];

    const comment = await prisma.comment.create({
      data: {
        caseId: randomCase.id,
        userId: bot.id,
        content: commentText
      }
    });

    console.log(`✅ Bot ${bot.username} commented on case: "${randomCase.title.substring(0, 40)}..."`);
    return comment;
  } catch (error) {
    console.error('❌ Error creating bot comment:', error.message);
    return null;
  }
}

/**
 * Bot upvotes or downvotes a random comment
 */
async function botVoteOnComment() {
  try {
    // Get recent comments from active cases
    const recentComments = await prisma.comment.findMany({
      where: {
        case: {
          status: 'ACTIVE'
        }
      },
      take: 30,
      orderBy: { createdAt: 'desc' }
    });

    if (recentComments.length === 0) {
      console.log('⚠️  No comments to vote on');
      return null;
    }

    const randomComment = recentComments[Math.floor(Math.random() * recentComments.length)];

    // 70% upvote, 30% downvote (positive bias)
    const isUpvote = Math.random() < 0.7;

    const updatedComment = await prisma.comment.update({
      where: { id: randomComment.id },
      data: {
        upvotes: isUpvote ? { increment: 1 } : undefined,
        downvotes: !isUpvote ? { increment: 1 } : undefined
      }
    });

    console.log(`✅ Bot ${isUpvote ? 'upvoted' : 'downvoted'} comment`);
    return updatedComment;
  } catch (error) {
    console.error('❌ Error voting on comment:', error.message);
    return null;
  }
}

/**
 * Run random bot activity with realistic distribution
 */
async function runBotActivity() {
  console.log('\n🤖 Running bot activity cycle...');

  // Realistic activity distribution:
  // 15% chance: create case (less frequent)
  // 35% chance: vote on case (most common)
  // 30% chance: comment on case
  // 20% chance: vote on comment (engagement)

  const activity = Math.random();

  if (activity < 0.15) {
    await botCreateCase();
  } else if (activity < 0.50) {
    await botVoteOnCase();
  } else if (activity < 0.80) {
    await botCommentOnCase();
  } else {
    await botVoteOnComment();
  }
}

/**
 * Run multiple bot activities
 */
async function runMultipleBotActivities(count = 3) {
  console.log(`\n🤖 Running ${count} bot activities...`);

  for (let i = 0; i < count; i++) {
    await runBotActivity();
    // Small delay between activities
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('✅ Bot activity cycle completed\n');
}

export {
  botCreateCase,
  botVoteOnCase,
  botCommentOnCase,
  botVoteOnComment,
  runBotActivity,
  runMultipleBotActivities
};
