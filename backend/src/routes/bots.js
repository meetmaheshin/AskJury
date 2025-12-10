import express from 'express';
import { generateBotUsers, getBotStats } from '../jobs/userGeneratorBot.js';
import { runMultipleBotActivities } from '../jobs/botActivityManager.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

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

export default router;
