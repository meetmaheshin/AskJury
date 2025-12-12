import express from 'express';
import { generateBotUsers, getBotStats } from '../jobs/userGeneratorBot.js';
import { runMultipleBotActivities } from '../jobs/botActivityManager.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /api/bots/generate
 * Generate bot users (admin only)
 * Body: { count: number }
 */
router.post('/generate', authenticate, requireAdmin, async (req, res) => {
  try {
    const { count = 5 } = req.body;

    // Validate count
    if (count < 1 || count > 50) {
      return res.status(400).json({
        error: 'Count must be between 1 and 50'
      });
    }

    const results = await generateBotUsers(count);

    res.json({
      message: 'Bot generation completed',
      results
    });
  } catch (error) {
    console.error('Error generating bots:', error);
    res.status(500).json({
      error: 'Failed to generate bot users'
    });
  }
});

/**
 * GET /api/bots/stats
 * Get bot statistics (admin only)
 */
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const stats = await getBotStats();

    res.json({
      stats
    });
  } catch (error) {
    console.error('Error fetching bot stats:', error);
    res.status(500).json({
      error: 'Failed to fetch bot statistics'
    });
  }
});

/**
 * POST /api/bots/trigger-activity
 * Manually trigger bot activity (admin only)
 * Body: { count: number }
 */
router.post('/trigger-activity', authenticate, requireAdmin, async (req, res) => {
  try {
    const { count = 10 } = req.body;

    // Validate count
    if (count < 1 || count > 100) {
      return res.status(400).json({
        error: 'Count must be between 1 and 100'
      });
    }

    console.log(`[API] Manually triggering ${count} bot activities...`);
    await runMultipleBotActivities(count);

    res.json({
      message: `Successfully triggered ${count} bot activities`,
      count
    });
  } catch (error) {
    console.error('Error triggering bot activity:', error);
    res.status(500).json({
      error: 'Failed to trigger bot activity'
    });
  }
});

/**
 * POST /api/bots/populate-now
 * Emergency endpoint to populate platform with cases (no auth for quick fix)
 */
router.post('/populate-now', async (req, res) => {
  try {
    console.log('[API] Emergency populate - triggering 50 bot activities...');
    await runMultipleBotActivities(50);

    res.json({
      message: 'Platform populated with bot activity',
      count: 50
    });
  } catch (error) {
    console.error('Error populating:', error);
    res.status(500).json({
      error: 'Failed to populate'
    });
  }
});

/**
 * POST /api/bots/fix-flags
 * Fix isBot flags for existing users (one-time fix)
 */
router.post('/fix-flags', async (req, res) => {
  try {
    const botUsernames = [
      'SnehaPatel', 'KaranMehta', 'AnanyaRao', 'VikramSingh', 'RahulVerma',
      'PriyaSharma', 'AmitKumar', 'ArjunReddy', 'DeepikaNair', 'MeeraJoshi'
    ];

    const result = await prisma.user.updateMany({
      where: {
        username: {
          in: botUsernames
        }
      },
      data: {
        isBot: true
      }
    });

    // Also make meet.maheshin admin
    await prisma.user.update({
      where: { email: 'meet.maheshin@gmail.com' },
      data: { isAdmin: true }
    });

    const bots = await prisma.user.findMany({
      where: { isBot: true },
      select: { username: true }
    });

    res.json({
      message: 'Fixed bot flags',
      updated: result.count,
      bots: bots.map(b => b.username)
    });
  } catch (error) {
    console.error('Error fixing bot flags:', error);
    res.status(500).json({
      error: 'Failed to fix bot flags'
    });
  }
});

/**
 * POST /api/bots/delete-duplicates
 * Delete duplicate cases (admin only)
 */
router.post('/delete-duplicates', authenticate, requireAdmin, async (req, res) => {
  try {
    console.log('[API] Deleting duplicate cases...');

    // Get all active cases
    const cases = await prisma.case.findMany({
      where: { status: 'ACTIVE' },
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: 'asc' } // Keep oldest
    });

    const seenTitles = new Map();
    const duplicatesToDelete = [];

    // Find duplicates
    cases.forEach(c => {
      const normalizedTitle = c.title.toLowerCase().trim();
      if (seenTitles.has(normalizedTitle)) {
        duplicatesToDelete.push(c.id);
      } else {
        seenTitles.set(normalizedTitle, c);
      }
    });

    console.log(`Total cases: ${cases.length}, Duplicates: ${duplicatesToDelete.length}`);

    if (duplicatesToDelete.length === 0) {
      return res.json({ message: 'No duplicates found', deleted: 0 });
    }

    // Delete duplicates (cascade will handle votes/comments)
    const result = await prisma.case.deleteMany({
      where: { id: { in: duplicatesToDelete } }
    });

    console.log(`✅ Deleted ${result.count} duplicate cases`);

    res.json({
      message: 'Duplicates deleted successfully',
      totalCases: cases.length,
      uniqueCases: seenTitles.size,
      deleted: result.count,
      remaining: cases.length - result.count
    });
  } catch (error) {
    console.error('Delete duplicates error:', error);
    res.status(500).json({ error: 'Failed to delete duplicates' });
  }
});

export default router;
