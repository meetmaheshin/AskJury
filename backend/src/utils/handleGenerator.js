/**
 * Anonymous handle generator.
 * Every user gets a permanent, non-identifying public handle (e.g. "SilentPenguin4821").
 * Real email/username are never exposed publicly.
 */

const ADJECTIVES = [
  'Silent', 'Burnt', 'Caffeinated', 'Underpaid', 'Overworked', 'Anonymous', 'Grumpy',
  'Salty', 'Ghosted', 'Micromanaged', 'Disgruntled', 'Quiet', 'Furious', 'Tired',
  'Hidden', 'Masked', 'Restless', 'Sleepless', 'Jaded', 'Bored', 'Sneaky', 'Cubicle',
  'Remote', 'Layoff', 'Midnight', 'Monday', 'Friday', 'Corporate', 'Rogue', 'Spicy',
];

const NOUNS = [
  'Penguin', 'Intern', 'Analyst', 'Manager', 'Panda', 'Tiger', 'Otter', 'Raccoon',
  'Engineer', 'Hamster', 'Walrus', 'Llama', 'Falcon', 'Badger', 'Koala', 'Ninja',
  'Wombat', 'Phoenix', 'Goblin', 'Yeti', 'Ferret', 'Mongoose', 'Drone', 'Whale',
  'Cubicle', 'Slacker', 'Hustler', 'Survivor', 'Wanderer', 'Insider',
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate a single candidate handle. */
export function generateHandle() {
  const num = Math.floor(1000 + Math.random() * 9000); // 4 digits
  return `${randomFrom(ADJECTIVES)}${randomFrom(NOUNS)}${num}`;
}

/**
 * Generate a handle guaranteed unique against the users table.
 * @param {import('@prisma/client').PrismaClient} prisma
 */
export async function generateUniqueHandle(prisma) {
  for (let i = 0; i < 12; i++) {
    const handle = generateHandle();
    const existing = await prisma.user.findUnique({ where: { anonymousHandle: handle } });
    if (!existing) return handle;
  }
  // Extremely unlikely fallback: append more entropy
  return `${generateHandle()}${Math.floor(Math.random() * 1000)}`;
}

/**
 * Derive a unique account username from a handle (kept internal, never shown publicly).
 * @param {import('@prisma/client').PrismaClient} prisma
 */
export async function generateUniqueUsername(prisma, base) {
  let candidate = (base || generateHandle()).replace(/[^a-zA-Z0-9_]/g, '').slice(0, 24) || generateHandle();
  for (let i = 0; i < 12; i++) {
    const existing = await prisma.user.findUnique({ where: { username: candidate } });
    if (!existing) return candidate;
    candidate = `${(base || 'user').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 18)}_${Math.floor(1000 + Math.random() * 9000)}`;
  }
  return `user_${Date.now()}`;
}
