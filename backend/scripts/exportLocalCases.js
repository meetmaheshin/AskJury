import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function exportCases() {
  try {
    // Get all cases with related data
    const cases = await prisma.case.findMany({
      include: {
        user: true,
        votes: {
          include: {
            user: true
          }
        },
        comments: {
          include: {
            user: true
          }
        }
      }
    });

    console.log(`📊 Found ${cases.length} cases in local database`);

    // Export to JSON file
    const exportData = {
      exportDate: new Date().toISOString(),
      totalCases: cases.length,
      cases: cases
    };

    fs.writeFileSync(
      'backend-local-cases-backup.json',
      JSON.stringify(exportData, null, 2)
    );

    console.log(`✅ Exported to backend-local-cases-backup.json`);
    console.log(`\nSummary:`);
    console.log(`- Total cases: ${cases.length}`);
    console.log(`- Total votes: ${cases.reduce((sum, c) => sum + c.votes.length, 0)}`);
    console.log(`- Total comments: ${cases.reduce((sum, c) => sum + c.comments.length, 0)}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

exportCases();
