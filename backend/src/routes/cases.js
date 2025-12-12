import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { calculateVerdict, shouldAutoClose } from '../utils/verdictCalculator.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all cases with filtering and sorting
router.get('/', [
  query('sort').optional().isIn(['hot', 'new', 'top']),
  query('category').optional(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sort = 'new', category, limit = 20, offset = 0 } = req.query;

    const where = {
      status: 'ACTIVE'
    };

    if (category) {
      where.category = category;
    }

    // Fetch cases based on sort type
    let cases;

    if (sort === 'new') {
      // Sort by most recent
      cases = await prisma.case.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
        include: {
          user: {
            select: { id: true, username: true, avatarUrl: true }
          },
          _count: {
            select: { votes: true, comments: true }
          }
        }
      });
    } else if (sort === 'hot' || sort === 'top') {
      // For hot and top, we need to calculate engagement score
      // Fetch more cases and then sort by engagement
      const allCases = await prisma.case.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit) * 3, // Fetch more to sort properly
        include: {
          user: {
            select: { id: true, username: true, avatarUrl: true }
          },
          _count: {
            select: { votes: true, comments: true }
          }
        }
      });

      // Calculate engagement scores
      const casesWithScores = await Promise.all(
        allCases.map(async (caseItem) => {
          const voteCounts = await prisma.vote.groupBy({
            by: ['side'],
            where: { caseId: caseItem.id },
            _count: true
          });

          const sideAVotes = voteCounts.find(v => v.side === 'SIDE_A')?._count || 0;
          const sideBVotes = voteCounts.find(v => v.side === 'SIDE_B')?._count || 0;
          const totalVotes = sideAVotes + sideBVotes;

          // Hot score: votes + comments, weighted by recency (last 7 days)
          const daysSinceCreation = (Date.now() - new Date(caseItem.createdAt)) / (1000 * 60 * 60 * 24);
          const recencyMultiplier = Math.max(0, 1 - (daysSinceCreation / 7));
          const hotScore = (totalVotes * 2 + caseItem._count.comments) * (sort === 'hot' ? recencyMultiplier : 1);

          return {
            ...caseItem,
            totalVotes,
            hotScore
          };
        })
      );

      // Sort by engagement and take requested limit
      casesWithScores.sort((a, b) => b.hotScore - a.hotScore);
      cases = casesWithScores.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    }

    // Calculate vote percentages for final cases
    const casesWithVotes = await Promise.all(
      cases.map(async (caseItem) => {
        const voteCounts = await prisma.vote.groupBy({
          by: ['side'],
          where: { caseId: caseItem.id },
          _count: true
        });

        const sideAVotes = voteCounts.find(v => v.side === 'SIDE_A')?._count || 0;
        const sideBVotes = voteCounts.find(v => v.side === 'SIDE_B')?._count || 0;
        const totalVotes = sideAVotes + sideBVotes;

        const sideAPercentage = totalVotes > 0 ? Math.round((sideAVotes / totalVotes) * 100) : 50;
        const sideBPercentage = totalVotes > 0 ? Math.round((sideBVotes / totalVotes) * 100) : 50;

        // Check if current user has voted
        let userVote = null;
        if (req.user) {
          const vote = await prisma.vote.findUnique({
            where: {
              caseId_userId: {
                caseId: caseItem.id,
                userId: req.user.id
              }
            }
          });
          userVote = vote?.side || null;
        }

        return {
          ...caseItem,
          voteCount: totalVotes,
          sideAVotes,
          sideBVotes,
          sideAPercentage,
          sideBPercentage,
          userVote
        };
      })
    );

    res.json({ cases: casesWithVotes });
  } catch (error) {
    console.error('Get cases error:', error);
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

// Get closed cases (for marquee)
router.get('/closed', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const closedCases = await prisma.case.findMany({
      where: { status: 'CLOSED' },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { votes: true, comments: true } }
      },
      orderBy: { closedAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    // Add vote percentages and verdict info
    const casesWithStats = await Promise.all(
      closedCases.map(async (c) => {
        const voteCounts = await prisma.vote.groupBy({
          by: ['side'],
          where: { caseId: c.id },
          _count: true
        });

        const sideAVotes = voteCounts.find(v => v.side === 'SIDE_A')?._count || 0;
        const sideBVotes = voteCounts.find(v => v.side === 'SIDE_B')?._count || 0;
        const totalVotes = sideAVotes + sideBVotes;

        return {
          ...c,
          sideAVotes,
          sideBVotes,
          totalVotes,
          sideAPercentage: totalVotes > 0 ? Math.round((sideAVotes / totalVotes) * 100) : 50,
          sideBPercentage: totalVotes > 0 ? Math.round((sideBVotes / totalVotes) * 100) : 50
        };
      })
    );

    res.json(casesWithStats);

  } catch (error) {
    console.error('Error fetching closed cases:', error);
    res.status(500).json({ error: 'Failed to fetch closed cases' });
  }
});

// Get single case by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const caseItem = await prisma.case.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            bio: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            votes: true,
            comments: true
          }
        }
      }
    });

    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Calculate vote percentages
    const voteCounts = await prisma.vote.groupBy({
      by: ['side'],
      where: { caseId: id },
      _count: true
    });

    const sideAVotes = voteCounts.find(v => v.side === 'SIDE_A')?._count || 0;
    const sideBVotes = voteCounts.find(v => v.side === 'SIDE_B')?._count || 0;
    const totalVotes = sideAVotes + sideBVotes;

    const sideAPercentage = totalVotes > 0 ? Math.round((sideAVotes / totalVotes) * 100) : 50;
    const sideBPercentage = totalVotes > 0 ? Math.round((sideBVotes / totalVotes) * 100) : 50;

    // Check if current user has voted
    let userVote = null;
    if (req.user) {
      const vote = await prisma.vote.findUnique({
        where: {
          caseId_userId: {
            caseId: id,
            userId: req.user.id
          }
        }
      });
      userVote = vote?.side || null;
    }

    res.json({
      case: {
        ...caseItem,
        voteCount: totalVotes,
        sideAVotes,
        sideBVotes,
        sideAPercentage,
        sideBPercentage,
        userVote
      }
    });
  } catch (error) {
    console.error('Get case error:', error);
    res.status(500).json({ error: 'Failed to fetch case' });
  }
});

// Create new case
router.post('/', authenticate, upload.array('media', 3), [
  body('title').trim().isLength({ min: 10, max: 100 }),
  body('description').trim().isLength({ min: 20, max: 1000 }),
  body('category').isIn(['ROOMMATE_DISPUTES', 'RELATIONSHIP_ISSUES', 'WORKPLACE_CONFLICTS', 'FAMILY_DRAMA', 'FRIEND_DISAGREEMENTS', 'MONEY_PAYMENTS', 'POLITICS', 'OTHER']),
  body('sideALabel').optional().trim().isLength({ max: 50 }),
  body('sideBLabel').optional().trim().isLength({ max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, sideALabel, sideBLabel } = req.body;
    const files = req.files || [];

    let mediaUrls = [];
    if (files.length > 0) {
      try {
        // Only upload if Cloudinary is configured
        if (process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET &&
            process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloudinary-name') {
          mediaUrls = await Promise.all(
            files.map(file => uploadToCloudinary(file.buffer, 'jury/cases'))
          );
        } else {
          console.warn('Cloudinary not configured, skipping media upload');
        }
      } catch (uploadError) {
        console.error('Media upload error:', uploadError);
        // Continue without media if upload fails
      }
    }

    const caseData = {
      title,
      description,
      category,
      userId: req.user.id,
      mediaUrls: JSON.stringify(mediaUrls)
    };

    if (sideALabel) caseData.sideALabel = sideALabel;
    if (sideBLabel) caseData.sideBLabel = sideBLabel;

    const newCase = await prisma.case.create({
      data: caseData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    });

    res.status(201).json({ case: newCase });
  } catch (error) {
    console.error('Create case error:', error);
    res.status(500).json({ error: 'Failed to create case' });
  }
});

// Vote on a case
router.post('/:id/vote', authenticate, [
  body('side').isIn(['SIDE_A', 'SIDE_B'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { side } = req.body;

    const caseItem = await prisma.case.findUnique({
      where: { id }
    });

    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Check if case is closed
    if (caseItem.status === 'CLOSED') {
      return res.status(400).json({ error: 'Cannot vote on a closed case' });
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        caseId_userId: {
          caseId: id,
          userId: req.user.id
        }
      }
    });

    if (existingVote) {
      // Check if vote is within 24 hours
      const hoursSinceVote = (Date.now() - existingVote.createdAt.getTime()) / (1000 * 60 * 60);

      if (hoursSinceVote > 24) {
        return res.status(400).json({ error: 'Cannot change vote after 24 hours' });
      }

      // Update existing vote
      const updatedVote = await prisma.vote.update({
        where: {
          caseId_userId: {
            caseId: id,
            userId: req.user.id
          }
        },
        data: { side }
      });

      return res.json({ vote: updatedVote, message: 'Vote updated' });
    }

    // Create new vote
    const vote = await prisma.vote.create({
      data: {
        caseId: id,
        userId: req.user.id,
        side
      }
    });

    // Check if case should auto-close after this vote
    const voteCounts = await prisma.vote.groupBy({
      by: ['side'],
      where: { caseId: id },
      _count: true
    });

    const sideAVotes = voteCounts.find(v => v.side === 'SIDE_A')?._count || 0;
    const sideBVotes = voteCounts.find(v => v.side === 'SIDE_B')?._count || 0;

    const autoCloseCheck = shouldAutoClose(caseItem, sideAVotes, sideBVotes);

    if (autoCloseCheck && autoCloseCheck.shouldClose && caseItem.status === 'ACTIVE') {
      // Calculate verdict
      const { verdict, margin, ownerReward } = calculateVerdict(sideAVotes, sideBVotes);

      // Close the case
      await prisma.case.update({
        where: { id },
        data: {
          status: 'CLOSED',
          closedAt: new Date(),
          closureType: autoCloseCheck.closureType,
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

      return res.status(201).json({
        vote,
        caseClosed: true,
        verdict,
        message: 'Vote recorded and case automatically closed'
      });
    }

    res.status(201).json({ vote });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to vote' });
  }
});

// Close a case manually (owner only)
router.post('/:id/close', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get case and verify ownership
    const caseItem = await prisma.case.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }

    if (caseItem.userId !== userId) {
      return res.status(403).json({ error: 'Only case owner can close the case' });
    }

    if (caseItem.status === 'CLOSED') {
      return res.status(400).json({ error: 'Case is already closed' });
    }

    // Get vote counts
    const voteCounts = await prisma.vote.groupBy({
      by: ['side'],
      where: { caseId: id },
      _count: true
    });

    const sideAVotes = voteCounts.find(v => v.side === 'SIDE_A')?._count || 0;
    const sideBVotes = voteCounts.find(v => v.side === 'SIDE_B')?._count || 0;

    // Calculate verdict and rewards
    const { verdict, margin, ownerReward } = calculateVerdict(sideAVotes, sideBVotes);

    // Update case
    const updatedCase = await prisma.case.update({
      where: { id },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
        closureType: 'MANUAL_OWNER',
        verdict,
        verdictMargin: margin,
        ownerReward
      }
    });

    // Update user earnings if reward > 0
    if (ownerReward > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          caseEarnings: { increment: ownerReward },
          totalEarnings: { increment: ownerReward }
        }
      });
    }

    res.json({
      message: 'Case closed successfully',
      case: updatedCase,
      verdict,
      margin,
      ownerReward
    });

  } catch (error) {
    console.error('Error closing case:', error);
    res.status(500).json({ error: 'Failed to close case' });
  }
});

// Delete case (owner only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const caseItem = await prisma.case.findUnique({
      where: { id }
    });

    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }

    if (caseItem.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this case' });
    }

    await prisma.case.delete({
      where: { id }
    });

    res.json({ message: 'Case deleted successfully' });
  } catch (error) {
    console.error('Delete case error:', error);
    res.status(500).json({ error: 'Failed to delete case' });
  }
});

// Get platform stats (total counts from DB)
router.get('/stats', async (req, res) => {
  try {
    const [totalCases, totalVotes, totalComments] = await Promise.all([
      prisma.case.count({ where: { status: 'ACTIVE' } }),
      prisma.vote.count(),
      prisma.comment.count()
    ]);

    res.json({
      totalCases,
      totalVotes,
      totalComments
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get trending cases (most engagement in last 48 hours)
router.get('/trending/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const hoursAgo = 48;
    const cutoffDate = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    const cases = await prisma.case.findMany({
      where: {
        status: 'ACTIVE',
        createdAt: {
          gte: cutoffDate
        }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        _count: {
          select: {
            votes: true,
            comments: true
          }
        }
      }
    });

    // Calculate engagement score (votes * 2 + comments * 3)
    const casesWithEngagement = cases
      .map(caseItem => {
        const engagementScore = (caseItem._count.votes * 2) + (caseItem._count.comments * 3);
        return {
          ...caseItem,
          engagementScore
        };
      })
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, limit);

    // Calculate vote percentages for trending cases
    const trendingCases = await Promise.all(
      casesWithEngagement.map(async (caseItem) => {
        const voteCounts = await prisma.vote.groupBy({
          by: ['side'],
          where: { caseId: caseItem.id },
          _count: true
        });

        const sideAVotes = voteCounts.find(v => v.side === 'SIDE_A')?._count || 0;
        const sideBVotes = voteCounts.find(v => v.side === 'SIDE_B')?._count || 0;
        const totalVotes = sideAVotes + sideBVotes;

        const sideAPercentage = totalVotes > 0 ? Math.round((sideAVotes / totalVotes) * 100) : 50;
        const sideBPercentage = totalVotes > 0 ? Math.round((sideBVotes / totalVotes) * 100) : 50;

        return {
          id: caseItem.id,
          title: caseItem.title,
          category: caseItem.category,
          voteCount: totalVotes,
          commentCount: caseItem._count.comments,
          engagementScore: caseItem.engagementScore,
          sideAPercentage,
          sideBPercentage,
          createdAt: caseItem.createdAt,
          user: caseItem.user
        };
      })
    );

    res.json({ trending: trendingCases });
  } catch (error) {
    console.error('Get trending cases error:', error);
    res.status(500).json({ error: 'Failed to fetch trending cases' });
  }
});

export default router;
