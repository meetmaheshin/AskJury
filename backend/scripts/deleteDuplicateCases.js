import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteDuplicateCases() {
  console.log('🔍 Finding duplicate cases...\n');

  // Get all active cases
  const cases = await prisma.case.findMany({
    where: { status: 'ACTIVE' },
    include: { user: { select: { username: true } } },
    orderBy: { createdAt: 'asc' } // Keep oldest, delete newer duplicates
  });

  const seenTitles = new Map();
  const duplicatesToDelete = [];

  // Find duplicates (keep first occurrence, mark rest for deletion)
  cases.forEach(c => {
    const normalizedTitle = c.title.toLowerCase().trim();

    if (seenTitles.has(normalizedTitle)) {
      duplicatesToDelete.push({
        id: c.id,
        title: c.title,
        user: c.user.username,
        createdAt: c.createdAt
      });
    } else {
      seenTitles.set(normalizedTitle, c);
    }
  });

  console.log(`Total cases: ${cases.length}`);
  console.log(`Unique titles: ${seenTitles.size}`);
  console.log(`Duplicates to delete: ${duplicatesToDelete.length}\n`);

  if (duplicatesToDelete.length === 0) {
    console.log('✅ No duplicates found!');
    return;
  }

  console.log('Deleting duplicates...\n');

  // Delete duplicate cases
  let deleted = 0;
  for (const dup of duplicatesToDelete) {
    try {
      // Delete associated votes first
      await prisma.vote.deleteMany({
        where: { caseId: dup.id }
      });

      // Delete associated comments
      await prisma.comment.deleteMany({
        where: { caseId: dup.id }
      });

      // Delete the case
      await prisma.case.delete({
        where: { id: dup.id }
      });

      deleted++;
      if (deleted % 10 === 0) {
        console.log(`  Deleted ${deleted}/${duplicatesToDelete.length}...`);
      }
    } catch (error) {
      console.error(`❌ Failed to delete case "${dup.title.substr(0, 40)}...":`, error.message);
    }
  }

  console.log(`\n✅ Deleted ${deleted} duplicate cases!`);
  console.log(`📊 Remaining cases: ${cases.length - deleted}`);
}

deleteDuplicateCases()
  .then(() => {
    console.log('\n✨ Cleanup complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
