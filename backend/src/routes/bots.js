import express from 'express';
import { generateBotUsers, getBotStats } from '../jobs/userGeneratorBot.js';
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

export default router;
