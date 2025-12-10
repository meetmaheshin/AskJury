import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function uploadCases() {
  try {
    console.log('📤 Starting case upload to Railway...\n');

    // Read backup file
    const backup = JSON.parse(fs.readFileSync('backend-local-cases-backup.json', 'utf8'));
    console.log(`📊 Found ${backup.totalCases} cases in backup\n`);

    // Get bot users from Railway database
    const botUsers = await prisma.user.findMany({
      where: { isBot: true },
      select: { id: true, username: true }
    });

    if (botUsers.length === 0) {
      console.log('❌ No bot users found in Railway database!');
      return;
    }

    console.log(`✅ Found ${botUsers.length} bot users on Railway\n`);

    let created = 0;
    let skipped = 0;

    // Upload cases (assign to random bot users)
    for (const caseData of backup.cases) {
      try {
        // Pick random bot user
        const randomBot = botUsers[Math.floor(Math.random() * botUsers.length)];

        // Create case with bot as owner
        const newCase = await prisma.case.create({
          data: {
            userId: randomBot.id,
            title: caseData.title,
            description: caseData.description,
            category: caseData.category,
            sideALabel: caseData.sideALabel,
            sideBLabel: caseData.sideBLabel,
            status: 'ACTIVE' // Make all cases active
          }
        });

        console.log(`✅ Created: "${caseData.title.substring(0, 60)}..." by ${randomBot.username}`);
        created++;

      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️  Skipped duplicate: "${caseData.title.substring(0, 60)}..."`);
          skipped++;
        } else {
          console.error(`❌ Error creating case: ${error.message}`);
        }
      }
    }

    console.log(`\n📊 Upload Summary:`);
    console.log(`   ✅ Created: ${created} cases`);
    console.log(`   ⚠️  Skipped: ${skipped} duplicates`);
    console.log(`\n🎉 Platform is now populated!`);

  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

uploadCases();
