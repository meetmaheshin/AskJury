/**
 * Auto-Close Cases Job
 * Automatically closes cases that are 7+ days old
 */

import { PrismaClient } from '@prisma/client';
import { calculateVerdict } from '../utils/verdictCalculator.js';

const prisma = new PrismaClient();

/**
 * Run auto-closure check for all active cases
 * Should be called periodically (e.g., every hour via cron)
 */
export async function autoCloseCases() {
  try {
    console.log('[AUTO-CLOSE] Starting auto-closure check...');

    // Get all ACTIVE cases older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const expiredCases = await prisma.case.findMany({
      where: {
        status: 'ACTIVE',
        createdAt: { lte: sevenDaysAgo }
      },
      include: {
        _count: {
          select: { votes: true }
        }
      }
    });

    console.log(`[AUTO-CLOSE] Found ${expiredCases.length} expired cases`);

    for (const caseItem of expiredCases) {
      // Get vote counts
      const voteCounts = await prisma.vote.groupBy({
        by: ['side'],
        where: { caseId: caseItem.id },
        _count: true
      });

      const sideAVotes = voteCounts.find(v => v.side === 'SIDE_A')?._count || 0;
      const sideBVotes = voteCounts.find(v => v.side === 'SIDE_B')?._count || 0;

      // Calculate verdict
      const { verdict, margin, ownerReward } = calculateVerdict(sideAVotes, sideBVotes);

      // Close case
      await prisma.case.update({
        where: { id: caseItem.id },
        data: {
          status: 'CLOSED',
          closedAt: new Date(),
          closureType: 'AUTO_TIME_LIMIT',
          verdict,
          verdictMargin: margin,
          ownerReward
        }
      });

      // Update owner earnings
      if (ownerReward > 0) {
        await prisma.user.update({
          where: { id: caseItem.userId },
          data: {
            caseEarnings: { increment: ownerReward },
            totalEarnings: { increment: ownerReward }
          }
        });
      }

      console.log(`[AUTO-CLOSE] Closed case ${caseItem.id} - Verdict: ${verdict}, Reward: $${ownerReward}`);
    }

    console.log('[AUTO-CLOSE] Auto-closure check completed');

  } catch (error) {
    console.error('[AUTO-CLOSE] Error during auto-closure:', error);
  }
}
