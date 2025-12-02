import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

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

    let orderBy;
    if (sort === 'new') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'hot') {
      // For MVP, use created date as proxy for hot
      // In future, calculate based on votes in last 24h
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'top') {
      // For MVP, order by vote count
      orderBy = { createdAt: 'desc' };
    }

    const cases = await prisma.case.findMany({
      where,
      orderBy,
      take: parseInt(limit),
      skip: parseInt(offset),
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

    // Calculate vote percentages
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

    res.status(201).json({ vote });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to vote' });
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
