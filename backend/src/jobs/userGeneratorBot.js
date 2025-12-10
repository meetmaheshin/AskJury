import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Arrays of random data for generating realistic usernames
const adjectives = [
  'Swift', 'Bright', 'Cool', 'Quick', 'Bold', 'Calm', 'Wise', 'Brave', 'Sharp', 'Smart',
  'Lucky', 'Happy', 'Sunny', 'Clever', 'Noble', 'Fierce', 'Gentle', 'Silent', 'Active', 'Mighty',
  'Cosmic', 'Digital', 'Neon', 'Cyber', 'Urban', 'Royal', 'Arctic', 'Storm', 'Thunder', 'Lightning'
];

const nouns = [
  'Tiger', 'Eagle', 'Wolf', 'Lion', 'Bear', 'Hawk', 'Fox', 'Panda', 'Falcon', 'Dragon',
  'Phoenix', 'Raven', 'Shark', 'Cobra', 'Lynx', 'Jaguar', 'Panther', 'Owl', 'Viper', 'Gryphon',
  'Ninja', 'Samurai', 'Warrior', 'Knight', 'Ranger', 'Hunter', 'Scout', 'Wizard', 'Mage', 'Sage'
];

const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'proton.me', 'icloud.com'];

const bioTemplates = [
  'Just here to share my thoughts and hear others.',
  'Believer in fair judgments and honest debates.',
  'Love a good discussion. Always open to different perspectives.',
  'Here to settle disputes the right way.',
  'Fair and balanced opinions matter.',
  'Truth seeker. Justice lover.',
  'Debate enthusiast. Let us talk it out.',
  'Always curious about different viewpoints.',
  'Here to help resolve conflicts.',
  'Passionate about fairness and justice.',
  'Life is full of gray areas. Let us explore them.',
  'Open mind, fair judgment.',
  'I believe in hearing both sides.',
  'Justice warrior in the digital age.',
  'Conflict resolver by nature.'
];

/**
 * Generate a random username
 */
function generateUsername() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999);
  return `${adjective}${noun}${number}`;
}

/**
 * Generate a random email
 */
function generateEmail(username) {
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username.toLowerCase()}@${domain}`;
}

/**
 * Generate a random bio
 */
function generateBio() {
  return bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
}

/**
 * Generate a single bot user
 */
async function generateBotUser() {
  const username = generateUsername();
  const email = generateEmail(username);
  const bio = generateBio();

  // Generate a random password (not important for bots, but required by schema)
  const passwordHash = await bcrypt.hash('BotUser123!', 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        bio,
        isBot: true,
        isVerified: true, // Auto-verify bot accounts
        authProvider: 'bot'
      }
    });

    console.log(` Created bot user: ${username} (${email})`);
    return user;
  } catch (error) {
    if (error.code === 'P2002') {
      // Unique constraint violation - username or email already exists
      console.log(`�  Skipping duplicate: ${username} or ${email} already exists`);
      return null;
    }
    throw error;
  }
}

/**
 * Generate multiple bot users
 * @param {number} count - Number of users to generate
 */
async function generateBotUsers(count = 5) {
  console.log(`\\n> Starting bot user generation (${count} users)...`);
  console.log(`=� ${new Date().toISOString()}\\n`);

  const results = {
    created: 0,
    skipped: 0,
    errors: 0
  };

  for (let i = 0; i < count; i++) {
    try {
      const user = await generateBotUser();
      if (user) {
        results.created++;
      } else {
        results.skipped++;
      }

      // Add small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`L Error creating user ${i + 1}:`, error.message);
      results.errors++;
    }
  }

  console.log('\\n=� Bot Generation Summary:');
  console.log(`    Created: ${results.created}`);
  console.log(`   �  Skipped: ${results.skipped}`);
  console.log(`   L Errors: ${results.errors}`);
  console.log(`   =� Total Attempts: ${count}\\n`);

  return results;
}

/**
 * Get bot user statistics
 */
async function getBotStats() {
  const totalBots = await prisma.user.count({
    where: { isBot: true }
  });

  const botsCreatedToday = await prisma.user.count({
    where: {
      isBot: true,
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    }
  });

  return {
    totalBots,
    botsCreatedToday
  };
}

// Export functions
export {
  generateBotUser,
  generateBotUsers,
  getBotStats
};
