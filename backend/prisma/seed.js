import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting seed...');

  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.case.deleteMany();
  await prisma.user.deleteMany();
  console.log('🗑️ Cleared existing data');

  // Create demo users with Indian names
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'rahul@example.com',
        username: 'RahulVerma',
        passwordHash,
        bio: 'Political analyst from Delhi | Truth seeker 🔍',
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'priya@example.com',
        username: 'PriyaSharma',
        passwordHash,
        bio: 'Mumbai based journalist | Unbiased opinions ⚖️',
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'amit@example.com',
        username: 'AmitKumar',
        passwordHash,
        bio: 'Engineer turned political commentator 🎙️',
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'sneha@example.com',
        username: 'SnehaPatel',
        passwordHash,
        bio: 'Law student | Human rights advocate ⚖️',
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'vikram@example.com',
        username: 'VikramSingh',
        passwordHash,
        bio: 'Retired IAS officer | Voice of reason 🎯',
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'ananya@example.com',
        username: 'AnanyaRao',
        passwordHash,
        bio: 'Social activist | Ground reality checker 📢',
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'karan@example.com',
        username: 'KaranMehta',
        passwordHash,
        bio: 'Startup founder | Economics enthusiast 📊',
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'deepika@example.com',
        username: 'DeepikaNair',
        passwordHash,
        bio: 'Professor | Policy researcher 📚',
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'arjun@example.com',
        username: 'ArjunReddy',
        passwordHash,
        bio: 'IT Professional from Hyderabad | Logical thinker 💻',
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'meera@example.com',
        username: 'MeeraJoshi',
        passwordHash,
        bio: 'Teacher | Common citizen perspective 👩‍🏫',
        isVerified: true,
      },
    }),
  ]);

  console.log('👥 Created users:', users.length);

  // Create time offsets for varied creation dates (past 30 days)
  const getRandomPastDate = (maxDaysAgo = 30) => {
    const daysAgo = Math.floor(Math.random() * maxDaysAgo);
    const hoursAgo = Math.floor(Math.random() * 24);
    return new Date(Date.now() - (daysAgo * 24 + hoursAgo) * 60 * 60 * 1000);
  };

  // Indian Political Cases (in Hindi/English/Hinglish)
  const politicalCases = [
    {
      userId: users[0].id,
      title: 'क्या EVM पर सवाल उठाना सही है? | Is questioning EVM justified?',
      description: `हर चुनाव के बाद EVM पर सवाल उठते हैं। हारने वाली पार्टी अक्सर EVM में गड़बड़ी का आरोप लगाती है।

Every election, questions are raised about EVMs. Losing parties often blame EVM malfunction.

एक तरफ Election Commission कहता है कि EVM पूरी तरह सुरक्षित है और इसमें कोई tampering संभव नहीं। दूसरी तरफ कई राजनीतिक दल VVPAT matching की मांग करते हैं।

On one side, Election Commission says EVMs are completely secure. On the other side, many political parties demand 100% VVPAT verification.

आप किस पक्ष में हैं? Should we trust EVMs blindly or is healthy skepticism good for democracy?`,
      category: 'POLITICS',
      sideALabel: 'EVMs are Safe ✅',
      sideBLabel: 'Need More Verification 🔍',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(5),
    },
    {
      userId: users[1].id,
      title: 'Freebies vs Development: कौन सी सरकार बेहतर?',
      description: `बड़ी बहस: Free revdi देना सही या गलत?

कुछ कहते हैं free electricity, free bus rides, free ration गरीबों की मदद है। दूसरे कहते हैं यह सिर्फ वोट बैंक politics है और economy को नुकसान पहुंचाती है।

Arguments FOR freebies:
• Helps poor and marginalized
• Immediate relief to struggling families  
• Redistributes wealth

Arguments AGAINST freebies:
• Creates dependency culture
• Hurts state finances
• Money could be spent on infrastructure

Supreme Court भी इस पर टिप्पणी कर चुका है। आपकी राय क्या है?`,
      category: 'POLITICS',
      sideALabel: 'Freebies Help Poor 🤝',
      sideBLabel: 'Focus on Development 🏗️',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(7),
    },
    {
      userId: users[2].id,
      title: 'Should there be a Uniform Civil Code in India?',
      description: `Uniform Civil Code (UCC) का मुद्दा फिर गरमाया है। 

समर्थक कहते हैं:
• संविधान के Article 44 में UCC का प्रावधान है
• Gender equality के लिए जरूरी
• एक देश एक कानून होना चाहिए
• Goa में पहले से UCC है

विरोधी कहते हैं:
• धार्मिक स्वतंत्रता पर हमला
• Minority rights का उल्लंघन
• भारत की विविधता को खतरा
• Personal laws में सरकार का दखल गलत

What's your verdict? Is UCC necessary for modern India or should personal laws remain?`,
      category: 'POLITICS',
      sideALabel: 'UCC is Necessary ⚖️',
      sideBLabel: 'Respect Diversity 🕊️',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(10),
    },
    {
      userId: users[3].id,
      title: 'IT Raids on Opposition: Vendetta Politics या Genuine Action?',
      description: `जब भी किसी opposition leader पर IT raid होती है, सवाल उठते हैं।

सरकार का पक्ष:
• Independent agencies अपना काम कर रही हैं
• कोई कानून से ऊपर नहीं
• Evidence मिलने पर कार्रवाई होती है
• Why are opposition leaders always "victims"?

विपक्ष का पक्ष:
• चुनाव से पहले raids संयोग नहीं
• BJP में शामिल होते ही cases बंद
• CBI, ED का misuse हो रहा है
• Democracy खतरे में है

Is this genuine anti-corruption drive or selective targeting? You decide!`,
      category: 'POLITICS',
      sideALabel: 'Agencies are Fair 👍',
      sideBLabel: 'Political Vendetta 👎',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(3),
    },
    {
      userId: users[4].id,
      title: 'क्या Caste Census होना चाहिए? | Should Caste Census happen?',
      description: `बिहार ने caste survey कराया। अब पूरे देश में caste census की मांग उठ रही है।

Support करने वाले कहते हैं:
• Data based policy बनेगी
• OBC की सही संख्या पता चलेगी
• Reservation का proper implementation होगा
• Last caste census 1931 में हुआ था

विरोध करने वाले कहते हैं:
• समाज में divide बढ़ेगा
• जाति व्यवस्था मजबूत होगी
• Data का political misuse होगा
• We should move towards casteless society

आप किस पक्ष में हैं? Should government know caste composition or not?`,
      category: 'POLITICS',
      sideALabel: 'Census Zaruri Hai ✓',
      sideBLabel: 'Divide Badhega ✗',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(8),
    },
    {
      userId: users[5].id,
      title: 'Media House Bias: Is Indian media really independent?',
      description: `गोदी media या स्वतंत्र पत्रकारिता?

एक पक्ष कहता है:
• Mainstream media सरकार की PR agency बन गया
• Tough questions नहीं पूछे जाते
• Press freedom index में India गिरा
• Independent journalists पर cases

दूसरा पक्ष कहता है:
• Opposition का propaganda भी चलता है
• Social media पर सब कुछ है
• Private channels अपनी policy रखते हैं
• Government criticism भी होती है

The Wire, NDTV, Republic - सबका अपना bias है। But is media truly free? What do you think?`,
      category: 'POLITICS',
      sideALabel: 'Media is Biased 📺',
      sideBLabel: 'Media is Free 📰',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(12),
    },
    {
      userId: users[6].id,
      title: 'Bulldozer Justice: सही approach या rights का उल्लंघन?',
      description: `Bulldozer कार्रवाई पर देश बंटा हुआ है।

समर्थन में arguments:
• Illegal constructions तोड़ना सही
• Criminals को सख्त message
• कानून का राज होना चाहिए
• UP, MP में crime कम हुआ

विरोध में arguments:
• Due process का उल्लंघन
• Court orders के बिना demolition
• Selective targeting का आरोप
• Property rights का हनन
• Supreme Court ने चिंता जताई

Bulldozer नीति सही है या संविधान का उल्लंघन? आप judge करें!`,
      category: 'POLITICS',
      sideALabel: 'Bulldozer Sahi ✓',
      sideBLabel: 'Follow Due Process ⚖️',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(6),
    },
    {
      userId: users[7].id,
      title: 'दल-बदल कानून: Should MLAs have right to defect?',
      description: `Maharashtra, Bihar में जो हुआ उसके बाद सवाल:

एक पक्ष:
• Elected representatives को freedom होनी चाहिए
• Party high command की dictatorship गलत
• 2/3 MLAs साथ हों तो जनता की आवाज है
• Political realignment democracy का हिस्सा

दूसरा पक्ष:
• वोट पार्टी को मिला था, व्यक्ति को नहीं
• Horse trading को बढ़ावा मिलता है
• Voters का विश्वासघात है
• Anti-defection law strict होना चाहिए

What's your take? Strengthen anti-defection or give more freedom?`,
      category: 'POLITICS',
      sideALabel: 'More Freedom 🗽',
      sideBLabel: 'Strict Anti-Defection 🔒',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(15),
    },
    {
      userId: users[8].id,
      title: 'INDIA Alliance vs NDA: Who is better for the country?',
      description: `2024 elections के बाद बड़ा सवाल - कौन सा alliance बेहतर?

NDA Support:
• Stable governance मिली
• Economic reforms हुए
• International image better हुई
• Decisive leadership

INDIA Alliance Support:
• Democracy बचाने की जरूरत
• Constitutional values को खतरा
• Diverse representation जरूरी
• Checks and balances important

Coalition politics या single party majority - आप किसके पक्ष में हैं?`,
      category: 'POLITICS',
      sideALabel: 'NDA Better 🏛️',
      sideBLabel: 'INDIA Alliance Better 🤝',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(2),
    },
    {
      userId: users[9].id,
      title: 'Agniveer योजना: Good reform या youth के साथ धोखा?',
      description: `Agniveer योजना पर युवाओं में मिली-जुली प्रतिक्रिया।

सरकार का पक्ष:
• Armed forces को young blood मिलेगा
• Pension bill कम होगा
• 4 साल बाद skilled workforce मिलेगी
• Discipline और training से youth ready होंगे

विरोध करने वाले:
• Job security नहीं है
• 4 साल बाद कहां जाएंगे?
• Army की quality पर असर
• Youth का future uncertain

क्या Agniveer scheme revolutionary है या youth के साथ धोखा? आप तय करें!`,
      category: 'POLITICS',
      sideALabel: 'Good Reform 👍',
      sideBLabel: 'Unfair to Youth 👎',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(9),
    },
    {
      userId: users[0].id,
      title: 'Farm Laws Repeal: किसानों की जीत या missed opportunity?',
      description: `तीन कृषि कानून वापस लिए गए। अब MSP guarantee की मांग।

एक पक्ष:
• Farmers का historic victory था
• Corporate farming से बचाव हुआ
• APMC mandi system बचा
• Democracy की जीत

दूसरा पक्ष:
• Reform का मौका गया
• Farmers को ज्यादा freedom मिलती
• Middlemen system बना रहा
• Political decision था, economic नहीं

Was the repeal right decision or did we lose a reform opportunity?`,
      category: 'POLITICS',
      sideALabel: 'Repeal was Right ✓',
      sideBLabel: 'Reform was Needed 📈',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(20),
    },
    {
      userId: users[1].id,
      title: 'Hindi Imposition: राष्ट्रीय एकता या linguistic imperialism?',
      description: `Hindi should be national language या नहीं?

Hindi supporters कहते हैं:
• Most spoken language in India
• राष्ट्रीय एकता के लिए जरूरी
• Communication आसान होगा
• Already official language है

विरोधी कहते हैं:
• भारत multilingual है
• South India में strong opposition
• English works as link language
• Regional languages को खतरा
• Constitution में equality है

Tamil Nadu से Karnataka तक विरोध। क्या Hindi impose करना सही है?`,
      category: 'POLITICS',
      sideALabel: 'Hindi is Unifying 🇮🇳',
      sideBLabel: 'Respect All Languages 🗣️',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(14),
    },
    {
      userId: users[2].id,
      title: 'Reservation in Private Sector: Should it be mandatory?',
      description: `Private sector में reservation लागू हो - ये demand बढ़ रही है।

Support में:
• Government jobs limited हैं
• Private sector में भी representation जरूरी
• Historical injustice को address करना है
• Economic equality के लिए जरूरी

Against में:
• Merit should be the only criteria
• Companies की autonomy होनी चाहिए
• Brain drain बढ़ेगा
• Economy पर negative impact

क्या private companies में भी reservation होना चाहिए?`,
      category: 'POLITICS',
      sideALabel: 'Yes, Mandatory ✓',
      sideBLabel: 'No, Merit Only ✗',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(11),
    },
  ];

  // General life cases for variety
  const generalCases = [
    {
      userId: users[3].id,
      title: 'Am I wrong for refusing to pay for my friend\'s expensive meal?',
      description: `We went out to dinner and my friend ordered the most expensive items on the menu. When the bill came, they suggested we split it equally. 

I only ordered a salad and water while they had steak, wine, and dessert. I said I would only pay for what I ordered. 

Now they are upset with me and saying I ruined the dinner. Other friends are divided on this.

Was I being cheap or is it fair to pay for what you ordered?`,
      category: 'FRIEND_DISAGREEMENTS',
      sideALabel: 'Fair to Split by Order 💰',
      sideBLabel: 'Should Split Equally 🤝',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(4),
    },
    {
      userId: users[4].id,
      title: 'Roommate uses my Netflix without asking - Password change sahi?',
      description: `I pay for Netflix premium. My roommate never asked but just started using it. I noticed 3 extra profiles were created - their friends too!

When I changed my password, they got angry saying "we live together, sharing is caring." They pay for WiFi but that's included in our rent split.

Am I being petty or is this justified?`,
      category: 'ROOMMATE_DISPUTES',
      sideALabel: 'Your Account Your Rules 🔐',
      sideBLabel: 'Learn to Share 🤝',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(3),
    },
    {
      userId: users[5].id,
      title: 'Parents want arranged marriage, I want love marriage - कौन सही?',
      description: `I'm 28 and have a girlfriend for 3 years. My parents don't know about her because they want me to have arranged marriage within our caste.

They say arranged marriages are more stable and they know what's best. My girlfriend is from different community.

I feel torn between family expectations and my own choice. Am I wrong for hiding this relationship? Should I follow my heart or respect parents' wishes?`,
      category: 'FAMILY_DRAMA',
      sideALabel: 'Follow Your Heart ❤️',
      sideBLabel: 'Respect Parents 🙏',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(7),
    },
    {
      userId: users[6].id,
      title: 'Boss expects weekend work without extra pay - Should I refuse?',
      description: `My company culture is toxic. Boss sends messages on Saturday-Sunday expecting immediate response. Last month I worked 4 weekends without any overtime.

When I politely mentioned compensation, he said "this is how IT industry works" and "you should be grateful to have a job."

My wife is frustrated. Should I refuse weekend work or is this normal in corporate world?`,
      category: 'WORKPLACE_CONFLICTS',
      sideALabel: 'Set Boundaries 🚫',
      sideBLabel: 'Pay Your Dues 💼',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(5),
    },
    {
      userId: users[7].id,
      title: 'Sister borrowed ₹50K and won\'t return - Family says let it go',
      description: `My sister borrowed ₹50,000 for her "emergency" two years ago. Turns out she used it for a vacation. She keeps saying she'll return but never does.

When I ask, she gets defensive. Parents say "let it go, she's family." But I worked hard for that money!

She just bought a new iPhone. Am I wrong for still asking for my money back?`,
      category: 'MONEY_PAYMENTS',
      sideALabel: 'Get Your Money Back 💰',
      sideBLabel: 'Let It Go, Family First 👨‍👩‍👧',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(11),
    },
    {
      userId: users[8].id,
      title: 'Husband won\'t do housework because he earns more - Is this fair?',
      description: `Both of us work full time. I earn 8 LPA, he earns 25 LPA. He thinks since he earns 3x more, I should handle all cooking, cleaning, laundry.

His logic: "I contribute more financially, you contribute more at home."

I come home equally tired. Is his logic valid or should housework be equal regardless of salary?`,
      category: 'RELATIONSHIP_ISSUES',
      sideALabel: 'Share Housework Equally ⚖️',
      sideBLabel: 'His Logic Makes Sense 🤔',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(6),
    },
    {
      userId: users[9].id,
      title: 'Friend leaked my salary to everyone - Am I overreacting?',
      description: `I got a good hike and shared with my best friend in confidence. Next day, entire friend group knows. Some are jealous, some are asking for treat.

When I confronted him, he said "what's the big deal, we are friends."

I feel betrayed. Salary is personal. Am I overreacting for being upset about this?`,
      category: 'FRIEND_DISAGREEMENTS',
      sideALabel: 'Betrayal of Trust 😤',
      sideBLabel: 'Overreacting 🙄',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(8),
    },
    {
      userId: users[0].id,
      title: 'Should I report colleague who fakes WFH sick leaves?',
      description: `My colleague marks WFH or sick leave but I see him posting Instagram stories from cafes and trips. He's done this multiple times.

I do all his pending work. Manager doesn't know. If I report, I'll be called snitch. If I don't, I suffer.

What should I do? Report him or mind my own business?`,
      category: 'WORKPLACE_CONFLICTS',
      sideALabel: 'Report the Faker 📢',
      sideBLabel: 'Mind Your Business 🤐',
      mediaUrls: JSON.stringify([]),
      createdAt: getRandomPastDate(4),
    },
  ];

  const allCases = [...politicalCases, ...generalCases];
  
  const createdCases = [];
  for (const caseData of allCases) {
    const c = await prisma.case.create({ data: caseData });
    createdCases.push(c);
  }

  console.log('📋 Created cases:', createdCases.length);

  // Add realistic votes to cases - MORE VOTES for busier feel
  for (const caseItem of createdCases) {
    const voterIds = users.map(u => u.id).filter(id => id !== caseItem.userId);
    
    // Each user votes on most cases
    for (const oderId of voterIds) {
      const shouldVote = Math.random() > 0.1; // 90% chance to vote
      if (!shouldVote) continue;
      
      const bias = Math.random();
      try {
        await prisma.vote.create({
          data: {
            caseId: caseItem.id,
            userId: oderId,
            side: bias > 0.45 ? 'SIDE_A' : 'SIDE_B',
          }
        });
      } catch (e) {
        // Skip duplicate votes
      }
    }
  }
  console.log('🗳️ Created votes for all cases');

  // Add MANY MORE comments for active feel
  const comments = [
    // Political case comments - Case 0 (EVM)
    { caseId: createdCases[0].id, userId: users[1].id, content: 'EVM पर शक करना democracy का हक है। लेकिन हर बार हारने के बाद blame करना भी गलत है।', upvotes: 145, downvotes: 32 },
    { caseId: createdCases[0].id, userId: users[2].id, content: 'If EVMs can be hacked, why doesn\'t any country show proof? Just allegations no evidence!', upvotes: 238, downvotes: 58 },
    { caseId: createdCases[0].id, userId: users[3].id, content: '100% VVPAT matching होनी चाहिए। Transparency से किसी को क्या problem?', upvotes: 312, downvotes: 45 },
    { caseId: createdCases[0].id, userId: users[4].id, content: 'Congress won in Karnataka with same EVMs. Selective outrage much?', upvotes: 189, downvotes: 67 },
    { caseId: createdCases[0].id, userId: users[5].id, content: 'Bro EVM hack karke dikha do, Election Commission has challenged multiple times 😂', upvotes: 276, downvotes: 89 },
    { caseId: createdCases[0].id, userId: users[6].id, content: 'Developed countries use paper ballots for a reason. Why are we so obsessed with EVMs?', upvotes: 198, downvotes: 112 },
    
    // Case 1 (Freebies)
    { caseId: createdCases[1].id, userId: users[4].id, content: 'Freebies temporary relief है, infrastructure permanent development है। Short term vs long term thinking.', upvotes: 267, downvotes: 83 },
    { caseId: createdCases[1].id, userId: users[5].id, content: 'जब corporates को tax breaks मिलती है तो किसी को problem नहीं, गरीबों को free ration मिले तो revdi?', upvotes: 489, downvotes: 134 },
    { caseId: createdCases[1].id, userId: users[6].id, content: 'Delhi ka example dekho - free bijli paani se budget ka haal dekho 😬', upvotes: 234, downvotes: 156 },
    { caseId: createdCases[1].id, userId: users[7].id, content: 'Kerala has highest literacy because of welfare schemes. Context matters!', upvotes: 378, downvotes: 67 },
    { caseId: createdCases[1].id, userId: users[8].id, content: 'Middle class ko kuch nahi milta. Ameer ko tax breaks, gareeb ko freebies. Hum pagal hain 🤡', upvotes: 567, downvotes: 45 },
    
    // Case 2 (UCC)
    { caseId: createdCases[2].id, userId: users[6].id, content: 'UCC से gender equality आएगी। Triple talaq जैसी practices खत्म होंगी।', upvotes: 343, downvotes: 118 },
    { caseId: createdCases[2].id, userId: users[7].id, content: 'First implement uniform economic policy, then talk about UCC. Priorities are wrong.', upvotes: 235, downvotes: 121 },
    { caseId: createdCases[2].id, userId: users[8].id, content: 'Goa mein already hai UCC, any problems there? No! So what\'s the fuss about?', upvotes: 412, downvotes: 89 },
    { caseId: createdCases[2].id, userId: users[9].id, content: 'Minority communities should be consulted before implementing. Dialogue is important.', upvotes: 289, downvotes: 145 },
    { caseId: createdCases[2].id, userId: users[0].id, content: 'Hindu Code Bill laya gaya tab bhi opposition tha. Progress always faces resistance.', upvotes: 356, downvotes: 98 },
    
    // Case 3 (IT Raids)
    { caseId: createdCases[3].id, userId: users[8].id, content: 'Notice the pattern - raids always before elections on opposition, never on ruling party members.', upvotes: 478, downvotes: 245 },
    { caseId: createdCases[3].id, userId: users[9].id, content: 'अगर आपने corruption नहीं किया तो raid से डर क्यों? Guilty conscience!', upvotes: 356, downvotes: 238 },
    { caseId: createdCases[3].id, userId: users[0].id, content: 'ED cases on everyone but conviction rate is 0.5%. Let that sink in.', upvotes: 523, downvotes: 187 },
    { caseId: createdCases[3].id, userId: users[1].id, content: 'BJP join karo, sab cases band. Ye kaisa coincidence hai bhai? 🤔', upvotes: 612, downvotes: 298 },
    { caseId: createdCases[3].id, userId: users[2].id, content: 'Agencies are independent. Courts are monitoring. Trust the process.', upvotes: 234, downvotes: 312 },
    
    // Case 4 (Caste Census)
    { caseId: createdCases[4].id, userId: users[0].id, content: 'Without data, how will we know if policies are reaching the right people? Caste census is scientific approach.', upvotes: 461, downvotes: 119 },
    { caseId: createdCases[4].id, userId: users[1].id, content: 'Bihar data shows OBCs are 63%. If true nationally, reservation needs rethinking.', upvotes: 534, downvotes: 167 },
    { caseId: createdCases[4].id, userId: users[2].id, content: 'We count everything - cows, tigers, trees. Why not castes? Data se kya dar?', upvotes: 678, downvotes: 89 },
    { caseId: createdCases[4].id, userId: users[3].id, content: 'Casteism khatam karna hai ya aur strong karna hai? Census se divide badhega.', upvotes: 345, downvotes: 234 },
    
    // Case 5 (Media Bias)
    { caseId: createdCases[5].id, userId: users[1].id, content: 'सच बोलने वाले journalists को sedition cases मिलते हैं। Press freedom sirf कागज़ों पर है।', upvotes: 593, downvotes: 141 },
    { caseId: createdCases[5].id, userId: users[2].id, content: 'Every media has bias. Learn to read multiple sources and form your own opinion.', upvotes: 447, downvotes: 78 },
    { caseId: createdCases[5].id, userId: users[3].id, content: 'Godi media invented by opposition. Same media praised UPA for 10 years 😂', upvotes: 389, downvotes: 234 },
    { caseId: createdCases[5].id, userId: users[4].id, content: 'NDTV sold to Adani. That tells you everything about media independence in India.', upvotes: 712, downvotes: 198 },
    { caseId: createdCases[5].id, userId: users[5].id, content: 'YouTube pe independent journalism dekho. TV is dead anyway for news.', upvotes: 534, downvotes: 67 },
    
    // Case 6 (Bulldozer)
    { caseId: createdCases[6].id, userId: users[3].id, content: 'Bulldozer action without court order is unconstitutional. We are not in jungle raj.', upvotes: 472, downvotes: 255 },
    { caseId: createdCases[6].id, userId: users[4].id, content: 'Finally criminals are scared. UP crime rate has gone down. Actions speak louder than words.', upvotes: 568, downvotes: 249 },
    { caseId: createdCases[6].id, userId: users[5].id, content: 'Supreme Court said you can\'t demolish without due process. Why is govt ignoring?', upvotes: 623, downvotes: 198 },
    { caseId: createdCases[6].id, userId: users[6].id, content: 'Selective demolition is the problem. Same encroachment by supporters = no action.', upvotes: 534, downvotes: 212 },
    
    // Case 8 (INDIA vs NDA)
    { caseId: createdCases[8].id, userId: users[5].id, content: 'Coalition politics has its own challenges but keeps checks on power. Single party majority can be dangerous.', upvotes: 454, downvotes: 231 },
    { caseId: createdCases[8].id, userId: users[6].id, content: 'Strong stable govt needed for development. Coalition means daily compromises.', upvotes: 512, downvotes: 189 },
    { caseId: createdCases[8].id, userId: users[7].id, content: 'INDIA alliance ka koi common agenda nahi. Sirf Modi hatao? That\'s not governance.', upvotes: 478, downvotes: 234 },
    { caseId: createdCases[8].id, userId: users[8].id, content: 'Democracy means opposition. Without strong opposition, democracy dies.', upvotes: 623, downvotes: 156 },
    
    // Case 9 (Agniveer)
    { caseId: createdCases[9].id, userId: users[6].id, content: 'Only 4 years and then what? Government should guarantee jobs after Agniveer tenure.', upvotes: 682, downvotes: 127 },
    { caseId: createdCases[9].id, userId: users[7].id, content: 'Youth should trust the process. Agniveers will be preferred in private sector too.', upvotes: 344, downvotes: 252 },
    { caseId: createdCases[9].id, userId: users[8].id, content: 'Army veterans are opposing this scheme. Shouldn\'t we listen to experts?', upvotes: 567, downvotes: 178 },
    { caseId: createdCases[9].id, userId: users[9].id, content: '75% youth gets nothing. This is contract labour system for army 😠', upvotes: 723, downvotes: 234 },
    { caseId: createdCases[9].id, userId: users[0].id, content: 'China border pe tension hai aur hum contract soldiers bhej rahe hain?', upvotes: 534, downvotes: 189 },
    
    // Case 10 (Farm Laws)
    { caseId: createdCases[10].id, userId: users[7].id, content: 'Farmers sat for 1 year in cold. Govt had to bow down. Power of protest!', upvotes: 756, downvotes: 234 },
    { caseId: createdCases[10].id, userId: users[8].id, content: 'Punjab farmers are rich, not real farmers. Real farmers in Bihar wanted the laws.', upvotes: 345, downvotes: 412 },
    { caseId: createdCases[10].id, userId: users[9].id, content: 'Reform was needed but dialogue first. You can\'t impose without consultation.', upvotes: 534, downvotes: 123 },
    
    // Case 11 (Hindi Imposition)  
    { caseId: createdCases[11].id, userId: users[0].id, content: 'South India will never accept Hindi imposition. We respect your language, respect ours.', upvotes: 823, downvotes: 234 },
    { caseId: createdCases[11].id, userId: users[1].id, content: 'Hindi already connecting North India. Kya problem hai seekhne mein?', upvotes: 456, downvotes: 367 },
    { caseId: createdCases[11].id, userId: users[2].id, content: 'English is the global language. Why fight over regional languages?', upvotes: 534, downvotes: 198 },
    
    // Case 12 (Reservation Private)
    { caseId: createdCases[12].id, userId: users[3].id, content: 'Private companies will leave India if forced reservation. Simple economics.', upvotes: 456, downvotes: 234 },
    { caseId: createdCases[12].id, userId: users[4].id, content: 'Government sector shrinking. Where will reserved categories go for jobs?', upvotes: 623, downvotes: 167 },
    { caseId: createdCases[12].id, userId: users[5].id, content: 'Merit should be only criteria. Reservation has failed to uplift anyone.', upvotes: 345, downvotes: 412 },
    
    // General case comments  
    { caseId: createdCases[13].id, userId: users[8].id, content: 'Totally fair! Why should you subsidize someone\'s expensive taste? Bill split by order is reasonable.', upvotes: 234, downvotes: 45 },
    { caseId: createdCases[13].id, userId: users[9].id, content: 'Bro ₹500 ke liye dosti mat todo. Next time clear kar lena pehle se.', upvotes: 189, downvotes: 67 },
    { caseId: createdCases[13].id, userId: users[0].id, content: 'I always ask for separate bills. No confusion, no drama. Pro tip!', upvotes: 312, downvotes: 23 },
    
    { caseId: createdCases[14].id, userId: users[9].id, content: 'Your subscription, your rules. They should have asked first. Basic manners!', upvotes: 428, downvotes: 34 },
    { caseId: createdCases[14].id, userId: users[0].id, content: 'Bhai sharing is caring but asking permission is also caring 😂', upvotes: 356, downvotes: 45 },
    { caseId: createdCases[14].id, userId: users[1].id, content: 'I share Netflix with roommate but we discussed first. Communication matters.', upvotes: 289, downvotes: 12 },
    
    { caseId: createdCases[15].id, userId: users[0].id, content: 'This is 2024. Love marriage ya arranged - your life your choice. Parents will eventually understand.', upvotes: 567, downvotes: 112 },
    { caseId: createdCases[15].id, userId: users[1].id, content: '3 saal chhupaya? Bro that\'s also wrong. Should have told earlier.', upvotes: 345, downvotes: 89 },
    { caseId: createdCases[15].id, userId: users[2].id, content: 'Parents se baat karo. Shock hoga initially but they\'ll come around. Meri bhi same story thi.', upvotes: 478, downvotes: 56 },
    { caseId: createdCases[15].id, userId: users[3].id, content: 'Caste shouldn\'t matter in 2024. But Indian reality is different sadly 😔', upvotes: 623, downvotes: 145 },
    
    { caseId: createdCases[16].id, userId: users[1].id, content: 'Work-life balance is not a luxury, it\'s a necessity. Start saying no or you\'ll burn out.', upvotes: 789, downvotes: 67 },
    { caseId: createdCases[16].id, userId: users[2].id, content: 'Start looking for new job. Toxic culture won\'t change. Your health matters more.', upvotes: 534, downvotes: 89 },
    { caseId: createdCases[16].id, userId: users[3].id, content: 'Document everything. Email trail rakh. HR ko ja agar extreme ho.', upvotes: 412, downvotes: 34 },
    { caseId: createdCases[16].id, userId: users[4].id, content: 'IT industry is like this only bro. Either accept or switch to govt job 😅', upvotes: 234, downvotes: 178 },
    
    { caseId: createdCases[17].id, userId: users[2].id, content: 'Paisa wapas lena galat nahi hai. Rishta bhi important hai but so is self-respect.', upvotes: 445, downvotes: 111 },
    { caseId: createdCases[17].id, userId: users[3].id, content: 'iPhone le sakti hai but 50K nahi de sakti? Priorities 🙄', upvotes: 623, downvotes: 67 },
    { caseId: createdCases[17].id, userId: users[4].id, content: 'Family ke saath paise mat do. Gift samajh ke bhool jao. Lesson learned.', upvotes: 356, downvotes: 145 },
    
    { caseId: createdCases[18].id, userId: users[3].id, content: 'Earning more doesn\'t mean you work harder at home less. Partnership means sharing responsibilities.', upvotes: 802, downvotes: 123 },
    { caseId: createdCases[18].id, userId: users[4].id, content: 'Get a maid. Problem solved. Both focus on careers.', upvotes: 534, downvotes: 89 },
    { caseId: createdCases[18].id, userId: users[5].id, content: 'His logic is from 1950s. Marriage is partnership not business arrangement.', upvotes: 678, downvotes: 156 },
    { caseId: createdCases[18].id, userId: users[6].id, content: 'Both earning means both should contribute at home. Gender roles are outdated.', upvotes: 723, downvotes: 134 },
    
    { caseId: createdCases[19].id, userId: users[4].id, content: 'Breaking trust is breaking trust. Salary discussions should be private. Your friend was wrong.', upvotes: 456, downvotes: 78 },
    { caseId: createdCases[19].id, userId: users[5].id, content: 'Salary toh pata chal hi jata hai eventually. Itna kya secret rakhna?', upvotes: 234, downvotes: 145 },
    { caseId: createdCases[19].id, userId: users[6].id, content: 'Real friends don\'t get jealous of your success. Time to evaluate friendships.', upvotes: 512, downvotes: 67 },
    
    { caseId: createdCases[20].id, userId: users[5].id, content: 'Document everything first. Then talk to HR directly. Don\'t be a snitch but protect yourself.', upvotes: 341, downvotes: 115 },
    { caseId: createdCases[20].id, userId: users[6].id, content: 'Apna kaam karo. Karma will handle him. Getting involved will backfire.', upvotes: 289, downvotes: 123 },
    { caseId: createdCases[20].id, userId: users[7].id, content: 'Anonymous tip to manager. Let them investigate. Your hands stay clean.', upvotes: 412, downvotes: 89 },
  ];

  for (const comment of comments) {
    try {
      await prisma.comment.create({ data: comment });
    } catch (e) {
      console.error('Error creating comment:', e.message);
    }
  }

  console.log('💬 Created comments:', comments.length);
  console.log('\n✅ Seed completed successfully! 🎉');
  console.log('\n📝 Demo accounts (password: password123):');
  console.log('   • rahul@example.com (RahulVerma)');
  console.log('   • priya@example.com (PriyaSharma)');
  console.log('   • amit@example.com (AmitKumar)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
