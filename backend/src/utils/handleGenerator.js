/**
 * Anonymous handle generator.
 * Every user gets a permanent, non-identifying public handle. Handles are intentionally
 * VARIED in style (camelCase, snake_case, single words, prefixes, mixed numbering) so a
 * user list looks organic rather than templated. Real email/username are never public.
 * Output is always safe for usernames too: [A-Za-z0-9_].
 */

const ADJ = [
  'Quiet', 'Burnt', 'Salty', 'Grumpy', 'Tired', 'Jaded', 'Feral', 'Petty', 'Chaotic',
  'Lowkey', 'Nocturnal', 'Unbothered', 'Caffeinated', 'Overworked', 'Underpaid', 'Spicy',
  'Restless', 'Sleepless', 'Vague', 'Soft', 'Loud', 'Broke', 'Booked', 'Bored', 'Sneaky',
  'Rogue', 'Mild', 'Bitter', 'Cosmic', 'Neon', 'Velvet', 'Rusty', 'Golden', 'Midnight',
];
const NOUN = [
  'Fox', 'Crow', 'Moth', 'Otter', 'Sloth', 'Possum', 'Pigeon', 'Heron', 'Newt', 'Koala',
  'Goblin', 'Gremlin', 'Menace', 'Nomad', 'Drifter', 'Barista', 'Intern', 'Temp', 'Cog',
  'Harbor', 'Ember', 'Comet', 'Willow', 'Cipher', 'Echo', 'Static', 'Pixel', 'Vibe', 'Mood',
  'Wraith', 'Specter', 'Bandit', 'Maven', 'Oracle', 'Jester', 'Wanderer', 'Hermit',
];
// Single, evocative standalone words (used alone or with a number).
const SOLO = [
  'nightowl', 'deadline', 'payday', 'quietquit', 'overit', 'logging_off', 'pto', 'oof',
  'sendhelp', 'touchgrass', 'lurker', 'anon', 'noidea', 'idk', 'sigh', 'meh', 'brb',
  'corporate', 'cubicle', 'standup', 'eod', 'wfh', 'monday', 'friday', 'burnout',
];
const PREFIX = ['the', 'its', 'not', 'just', 'ok', 'lil', 'big', 'mr', 'ms', 'sir', 'real'];

const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// A grab-bag of number styles (often none).
function num() {
  const k = Math.random();
  if (k < 0.45) return '';                                   // no number
  if (k < 0.65) return String(Math.floor(Math.random() * 90) + 10);   // 2 digits
  if (k < 0.8) return String(Math.floor(Math.random() * 9) + 1);      // 1 digit
  if (k < 0.92) return ['90s', '00', '07', '22', '99', '420', '69', '101'][Math.floor(Math.random() * 8)];
  return String(Math.floor(1000 + Math.random() * 9000));    // 4 digits (rare)
}

/** Generate one varied candidate handle. */
export function generateHandle() {
  const style = Math.floor(Math.random() * 6);
  let h;
  switch (style) {
    case 0: // camel: QuietHarbor07
      h = `${r(ADJ)}${r(NOUN)}${num()}`;
      break;
    case 1: // snake lower: burnt_out_99 / quiet_fox
      h = `${r(ADJ).toLowerCase()}_${r(NOUN).toLowerCase()}${chance(0.5) ? '_' + (num() || Math.floor(Math.random() * 90)) : ''}`;
      break;
    case 2: // solo word + maybe number: nightowl42 / overit
      h = `${r(SOLO)}${num()}`;
      break;
    case 3: // prefix + word: notyourintern / the_quiet_fox
      h = `${r(PREFIX)}${chance(0.5) ? '_' : ''}${chance(0.5) ? r(SOLO) : (r(ADJ).toLowerCase() + (chance(0.5) ? '_' : '') + r(NOUN).toLowerCase())}`;
      break;
    case 4: // two nouns camel: EmberCrow / VibeGoblin
      h = `${cap(r(NOUN).toLowerCase())}${cap(r(NOUN).toLowerCase())}${num()}`;
      break;
    default: // lowercase smush: feralanalyst / saltybarista12
      h = `${r(ADJ).toLowerCase()}${r(NOUN).toLowerCase()}${num()}`;
  }
  // sanitize to [A-Za-z0-9_]
  h = h.replace(/[^A-Za-z0-9_]/g, '');
  return h.slice(0, 24) || `user${Math.floor(1000 + Math.random() * 9000)}`;
}

/** Generate a handle guaranteed unique against the users table. */
export async function generateUniqueHandle(prisma) {
  for (let i = 0; i < 15; i++) {
    const handle = generateHandle();
    const existing = await prisma.user.findUnique({ where: { anonymousHandle: handle } });
    if (!existing) return handle;
  }
  return `${generateHandle()}${Math.floor(Math.random() * 1000)}`;
}

/** Derive a unique internal account username (never shown publicly). */
export async function generateUniqueUsername(prisma, base) {
  let candidate = (base || generateHandle()).replace(/[^a-zA-Z0-9_]/g, '').slice(0, 24) || generateHandle();
  for (let i = 0; i < 12; i++) {
    const existing = await prisma.user.findUnique({ where: { username: candidate } });
    if (!existing) return candidate;
    candidate = `${(base || 'user').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 18)}_${Math.floor(1000 + Math.random() * 9000)}`;
  }
  return `user_${Math.floor(100000 + Math.random() * 900000)}`;
}
