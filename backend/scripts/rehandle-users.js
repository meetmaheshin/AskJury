/**
 * Regenerate every user's public anonymousHandle with the new varied generator.
 * NON-DESTRUCTIVE: updates only `anonymous_handle` — no cases/comments/votes touched.
 *
 * Usage (point DATABASE_URL at the target DB):
 *   node scripts/rehandle-users.js
 */
import { PrismaClient } from '@prisma/client';
import { generateHandle } from '../src/utils/handleGenerator.js';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true } });
  const seen = new Set();
  let updated = 0;

  for (const u of users) {
    let handle = generateHandle();
    let tries = 0;
    while (seen.has(handle) && tries < 30) { handle = generateHandle(); tries++; }
    seen.add(handle);
    try {
      await prisma.user.update({ where: { id: u.id }, data: { anonymousHandle: handle } });
      updated++;
    } catch {
      // unique collision with an existing (not-yet-updated) handle — add entropy and retry once
      try {
        const h2 = `${handle}${Math.floor(Math.random() * 1000)}`.slice(0, 24);
        await prisma.user.update({ where: { id: u.id }, data: { anonymousHandle: h2 } });
        seen.add(h2);
        updated++;
      } catch (e) {
        console.error('skip', u.id, e.message);
      }
    }
  }

  console.log(`Re-handled ${updated}/${users.length} users`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
