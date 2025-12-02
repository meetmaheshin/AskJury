import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            cases: true,
            votes: true,
            comments: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user's cases
router.get('/:id/cases', async (req, res) => {
  try {
    const { id } = req.params;

    const cases = await prisma.case.findMany({
      where: {
        userId: id,
        status: 'ACTIVE'
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate vote percentages for each case
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

        return {
          ...caseItem,
          voteCount: totalVotes,
          sideAVotes,
          sideBVotes,
          sideAPercentage,
          sideBPercentage
        };
      })
    );

    res.json({ cases: casesWithVotes });
  } catch (error) {
    console.error('Get user cases error:', error);
    res.status(500).json({ error: 'Failed to fetch user cases' });
  }
});

// Update user profile (owner only)
router.put('/:id', authenticate, upload.single('avatar'), [
  body('username').optional().trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('bio').optional().trim().isLength({ max: 200 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    if (id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const { username, bio } = req.body;
    const updateData = {};

    if (username && username !== req.user.username) {
      // Check if username is taken
      const existingUser = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }

      updateData.username = username;
    }

    if (bio !== undefined) {
      updateData.bio = bio;
    }

    if (req.file) {
      const avatarUrl = await uploadToCloudinary(req.file.buffer, 'jury/avatars');
      updateData.avatarUrl = avatarUrl;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        bio: true,
        isVerified: true,
        createdAt: true
      }
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get top jury members (leaderboard)
router.get('/leaderboard/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get users with their comment upvotes
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        comments: {
          select: {
            upvotes: true
          }
        },
        _count: {
          select: {
            comments: true,
            votes: true,
            cases: true
          }
        }
      }
    });

    // Calculate total upvotes and earnings for each user
    const leaderboard = users
      .map(user => {
        const totalUpvotes = user.comments.reduce((sum, comment) => sum + comment.upvotes, 0);
        const earnings = (totalUpvotes / 1000).toFixed(2); // $1 per 1000 upvotes

        return {
          id: user.id,
          username: user.username,
          avatarUrl: user.avatarUrl,
          totalUpvotes,
          earnings,
          commentCount: user._count.comments,
          voteCount: user._count.votes,
          caseCount: user._count.cases
        };
      })
      .sort((a, b) => b.totalUpvotes - a.totalUpvotes)
      .slice(0, limit);

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get user stats and earnings
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        comments: {
          select: {
            upvotes: true,
            downvotes: true
          }
        },
        _count: {
          select: {
            comments: true,
            votes: true,
            cases: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalUpvotes = user.comments.reduce((sum, comment) => sum + comment.upvotes, 0);
    const totalDownvotes = user.comments.reduce((sum, comment) => sum + comment.downvotes, 0);
    const earnings = (totalUpvotes / 1000).toFixed(2);

    res.json({
      stats: {
        totalUpvotes,
        totalDownvotes,
        earnings,
        commentCount: user._count.comments,
        voteCount: user._count.votes,
        caseCount: user._count.cases
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

export default router;
