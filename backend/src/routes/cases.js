import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { calculateVerdict, shouldAutoClose } from '../utils/verdictCalculator.js';
import {
  CATEGORY_VALUES,
  POST_TYPES,
  TARGET_TYPES,
  REACTION_TYPES,
  PUBLIC_USER_SELECT,
} from '../utils/constants.js';
import { findOrCreateCompany } from '../utils/companies.js';

const router = express.Router();
const prisma = new PrismaClient();

const CASE_INCLUDE = {
  user: { select: PUBLIC_USER_SELECT },
  company: { select: { id: true, name: true, slug: true, logoUrl: true } },
  _count: { select: { votes: true, reactions: true, comments: true } },
};

// Compute vote %, reaction summary, and the current user's vote/reaction for one case.
async function attachStats(caseItem, userId) {
  const voteCounts = await prisma.vote.groupBy({
    by: ['side'],
    where: { caseId: caseItem.id },
    _count: true,
  });
  const sideAVotes = voteCounts.find((v) => v.side === 'SIDE_A')?._count || 0;
  const sideBVotes = voteCounts.find((v) => v.side === 'SIDE_B')?._count || 0;
  const totalVotes = sideAVotes + sideBVotes;

  const reactionCounts = await prisma.reaction.groupBy({
    by: ['type'],
    where: { caseId: caseItem.id },
    _count: true,
  });
  const reactions = {};
  for (const t of REACTION_TYPES) reactions[t] = 0;
  let totalReactions = 0;
  for (const r of reactionCounts) {
    reactions[r.type] = r._count;
    totalReactions += r._count;
  }

  let userVote = null;
  let userReaction = null;
  if (userId) {
    const [v, r] = await Promise.all([
      prisma.vote.findUnique({ where: { caseId_userId: { caseId: caseItem.id, userId } } }),
      prisma.reaction.findUnique({ where: { caseId_userId: { caseId: caseItem.id, userId } } }),
    ]);
    userVote = v?.side || null;
    userReaction = r?.type || null;
  }

  return {
    ...caseItem,
    voteCount: totalVotes,
    sideAVotes,
    sideBVotes,
    sideAPercentage: totalVotes > 0 ? Math.round((sideAVotes / totalVotes) * 100) : 50,
    sideBPercentage: totalVotes > 0 ? Math.round((sideBVotes / totalVotes) * 100) : 50,
    reactions,
    totalReactions,
    userVote,
    userReaction,
  };
}

// Get all cases with filtering and sorting
router.get('/', [
  query('sort').optional().isIn(['hot', 'new', 'top']),
  query('category').optional(),
  query('postType').optional().isIn(POST_TYPES),
  query('company').optional(), // company slug
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sort = 'new', category, postType, company, limit = 20, offset = 0 } = req.query;

    const where = { status: 'ACTIVE' };
    if (category) where.category = category;
    if (postType) where.postType = postType;
    if (company) where.company = { slug: company };

    let cases;

    if (sort === 'new') {
      cases = await prisma.case.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
        include: CASE_INCLUDE,
      });
    } else {
      // hot / top: rank by engagement (votes + reactions + comments)
      const pool = await prisma.case.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit) * 3,
        include: CASE_INCLUDE,
      });

      const scored = pool.map((c) => {
        const engagement = c._count.votes * 2 + c._count.reactions + c._count.comments;
        const days = (Date.now() - new Date(c.createdAt)) / (1000 * 60 * 60 * 24);
        const recency = Math.max(0, 1 - days / 7);
        return { ...c, hotScore: engagement * (sort === 'hot' ? recency : 1) };
      });
      scored.sort((a, b) => b.hotScore - a.hotScore);
      cases = scored.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    }

    const casesWithStats = await Promise.all(cases.map((c) => attachStats(c, req.user?.id)));
    res.json({ cases: casesWithStats });
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
      include: CASE_INCLUDE,
      orderBy: { closedAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    });
    const casesWithStats = await Promise.all(closedCases.map((c) => attachStats(c, null)));
    res.json(casesWithStats);
  } catch (error) {
    console.error('Error fetching closed cases:', error);
    res.status(500).json({ error: 'Failed to fetch closed cases' });
  }
});

// Get platform stats (total counts from DB)
router.get('/stats', async (req, res) => {
  try {
    const [totalCases, totalVotes, totalReactions, totalComments, totalCompanies] = await Promise.all([
      prisma.case.count({ where: { status: 'ACTIVE' } }),
      prisma.vote.count(),
      prisma.reaction.count(),
      prisma.comment.count(),
      prisma.company.count(),
    ]);
    res.json({ totalCases, totalVotes, totalReactions, totalComments, totalCompanies });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get trending cases (most engagement in last 48 hours)
router.get('/trending/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const cutoffDate = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const cases = await prisma.case.findMany({
      where: { status: 'ACTIVE', createdAt: { gte: cutoffDate } },
      include: CASE_INCLUDE,
    });

    const ranked = cases
      .map((c) => ({
        ...c,
        engagementScore: c._count.votes * 2 + c._count.reactions + c._count.comments * 3,
      }))
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, limit);

    const trending = await Promise.all(
      ranked.map(async (c) => {
        const stats = await attachStats(c, null);
        return {
          id: c.id,
          title: c.title,
          category: c.category,
          postType: c.postType,
          company: c.company,
          voteCount: stats.voteCount,
          totalReactions: stats.totalReactions,
          commentCount: c._count.comments,
          engagementScore: c.engagementScore,
          sideAPercentage: stats.sideAPercentage,
          sideBPercentage: stats.sideBPercentage,
          createdAt: c.createdAt,
          user: c.user,
        };
      })
    );

    res.json({ trending });
  } catch (error) {
    console.error('Get trending cases error:', error);
    res.status(500).json({ error: 'Failed to fetch trending cases' });
  }
});

// Get single case by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const caseItem = await prisma.case.findUnique({
      where: { id },
      include: CASE_INCLUDE,
    });
    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }
    const withStats = await attachStats(caseItem, req.user?.id);
    res.json({ case: withStats });
  } catch (error) {
    console.error('Get case error:', error);
    res.status(500).json({ error: 'Failed to fetch case' });
  }
});

// Create new case (a "vent" or a "judge" post)
router.post('/', authenticate, upload.array('media', 3), [
  body('title').trim().isLength({ min: 10, max: 120 }),
  body('description').trim().isLength({ min: 20, max: 2000 }),
  body('category').isIn(CATEGORY_VALUES),
  body('postType').optional().isIn(POST_TYPES),
  body('targetType').optional().isIn(TARGET_TYPES),
  body('targetName').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('companyName').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('sideALabel').optional().trim().isLength({ max: 50 }),
  body('sideBLabel').optional().trim().isLength({ max: 50 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title, description, category,
      postType = 'JUDGE',
      targetType = 'GENERAL',
      targetName,
      companyName,
      sideALabel, sideBLabel,
    } = req.body;

    const files = req.files || [];
    let mediaUrls = [];
    if (files.length > 0) {
      try {
        if (
          process.env.CLOUDINARY_CLOUD_NAME &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_SECRET &&
          process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloudinary-name'
        ) {
          mediaUrls = await Promise.all(files.map((f) => uploadToCloudinary(f.buffer, 'jury/cases')));
        } else {
          console.warn('Cloudinary not configured, skipping media upload');
        }
      } catch (uploadError) {
        console.error('Media upload error:', uploadError);
      }
    }

    // Resolve company: an explicit companyName, or a COMPANY-targeted post using targetName.
    let companyId = null;
    let resolvedTargetType = targetType;
    let resolvedTargetName = targetName || null;

    const companyToResolve = companyName || (targetType === 'COMPANY' ? targetName : null);
    if (companyToResolve) {
      const company = await findOrCreateCompany(prisma, companyToResolve);
      if (company) {
        companyId = company.id;
        resolvedTargetType = 'COMPANY';
        if (!resolvedTargetName) resolvedTargetName = company.name;
      }
    }

    const caseData = {
      title,
      description,
      category,
      postType,
      targetType: resolvedTargetType,
      targetName: resolvedTargetName,
      companyId,
      userId: req.user.id,
      mediaUrls: JSON.stringify(mediaUrls),
    };

    // Side labels only matter for JUDGE posts.
    if (postType === 'JUDGE') {
      if (sideALabel) caseData.sideALabel = sideALabel;
      if (sideBLabel) caseData.sideBLabel = sideBLabel;
    }

    const newCase = await prisma.case.create({
      data: caseData,
      include: CASE_INCLUDE,
    });

    res.status(201).json({ case: newCase });
  } catch (error) {
    console.error('Create case error:', error);
    res.status(500).json({ error: 'Failed to create case' });
  }
});

// Vote on a case (JUDGE posts only)
router.post('/:id/vote', authenticate, [
  body('side').isIn(['SIDE_A', 'SIDE_B']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { side } = req.body;

    const caseItem = await prisma.case.findUnique({ where: { id } });
    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }
    if (caseItem.postType !== 'JUDGE') {
      return res.status(400).json({ error: 'This is a vent post — react to it instead of voting' });
    }
    if (caseItem.status === 'CLOSED') {
      return res.status(400).json({ error: 'Cannot vote on a closed case' });
    }

    const existingVote = await prisma.vote.findUnique({
      where: { caseId_userId: { caseId: id, userId: req.user.id } },
    });

    if (existingVote) {
      const hoursSinceVote = (Date.now() - existingVote.createdAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceVote > 24) {
        return res.status(400).json({ error: 'Cannot change vote after 24 hours' });
      }
      const updatedVote = await prisma.vote.update({
        where: { caseId_userId: { caseId: id, userId: req.user.id } },
        data: { side },
      });
      return res.json({ vote: updatedVote, message: 'Vote updated' });
    }

    const vote = await prisma.vote.create({
      data: { caseId: id, userId: req.user.id, side },
    });

    // Auto-close check
    const voteCounts = await prisma.vote.groupBy({
      by: ['side'],
      where: { caseId: id },
      _count: true,
    });
    const sideAVotes = voteCounts.find((v) => v.side === 'SIDE_A')?._count || 0;
    const sideBVotes = voteCounts.find((v) => v.side === 'SIDE_B')?._count || 0;
    const autoCloseCheck = shouldAutoClose(caseItem, sideAVotes, sideBVotes);

    if (autoCloseCheck && autoCloseCheck.shouldClose && caseItem.status === 'ACTIVE') {
      const { verdict, margin, ownerReward } = calculateVerdict(sideAVotes, sideBVotes);
      await prisma.case.update({
        where: { id },
        data: {
          status: 'CLOSED',
          closedAt: new Date(),
          closureType: autoCloseCheck.closureType,
          verdict,
          verdictMargin: margin,
          ownerReward,
        },
      });
      if (ownerReward > 0) {
        await prisma.user.update({
          where: { id: caseItem.userId },
          data: {
            caseEarnings: { increment: ownerReward },
            totalEarnings: { increment: ownerReward },
          },
        });
      }
      return res.status(201).json({ vote, caseClosed: true, verdict, message: 'Vote recorded and case automatically closed' });
    }

    res.status(201).json({ vote });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to vote' });
  }
});

// React to a case (vent reactions). One reaction per user; sending the same type toggles it off.
router.post('/:id/react', authenticate, [
  body('type').isIn(REACTION_TYPES),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { type } = req.body;

    const caseItem = await prisma.case.findUnique({ where: { id } });
    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }
    if (caseItem.status === 'CLOSED') {
      return res.status(400).json({ error: 'Cannot react to a closed case' });
    }

    const existing = await prisma.reaction.findUnique({
      where: { caseId_userId: { caseId: id, userId: req.user.id } },
    });

    let userReaction = type;
    if (existing && existing.type === type) {
      // toggle off
      await prisma.reaction.delete({ where: { caseId_userId: { caseId: id, userId: req.user.id } } });
      userReaction = null;
    } else if (existing) {
      await prisma.reaction.update({
        where: { caseId_userId: { caseId: id, userId: req.user.id } },
        data: { type },
      });
    } else {
      await prisma.reaction.create({ data: { caseId: id, userId: req.user.id, type } });
    }

    // Return fresh reaction summary
    const reactionCounts = await prisma.reaction.groupBy({
      by: ['type'],
      where: { caseId: id },
      _count: true,
    });
    const reactions = {};
    for (const t of REACTION_TYPES) reactions[t] = 0;
    let totalReactions = 0;
    for (const r of reactionCounts) {
      reactions[r.type] = r._count;
      totalReactions += r._count;
    }

    res.json({ reactions, totalReactions, userReaction });
  } catch (error) {
    console.error('React error:', error);
    res.status(500).json({ error: 'Failed to react' });
  }
});

// Close a case manually (owner only)
router.post('/:id/close', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const caseItem = await prisma.case.findUnique({ where: { id }, include: { user: true } });
    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }
    if (caseItem.userId !== userId) {
      return res.status(403).json({ error: 'Only the post owner can close it' });
    }
    if (caseItem.status === 'CLOSED') {
      return res.status(400).json({ error: 'Case is already closed' });
    }

    const voteCounts = await prisma.vote.groupBy({
      by: ['side'],
      where: { caseId: id },
      _count: true,
    });
    const sideAVotes = voteCounts.find((v) => v.side === 'SIDE_A')?._count || 0;
    const sideBVotes = voteCounts.find((v) => v.side === 'SIDE_B')?._count || 0;
    const { verdict, margin, ownerReward } = calculateVerdict(sideAVotes, sideBVotes);

    const updatedCase = await prisma.case.update({
      where: { id },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
        closureType: 'MANUAL_OWNER',
        verdict,
        verdictMargin: margin,
        ownerReward,
      },
    });

    if (ownerReward > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          caseEarnings: { increment: ownerReward },
          totalEarnings: { increment: ownerReward },
        },
      });
    }

    res.json({ message: 'Case closed successfully', case: updatedCase, verdict, margin, ownerReward });
  } catch (error) {
    console.error('Error closing case:', error);
    res.status(500).json({ error: 'Failed to close case' });
  }
});

// Delete case (owner only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const caseItem = await prisma.case.findUnique({ where: { id } });
    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }
    if (caseItem.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this case' });
    }
    await prisma.case.delete({ where: { id } });
    res.json({ message: 'Case deleted successfully' });
  } catch (error) {
    console.error('Delete case error:', error);
    res.status(500).json({ error: 'Failed to delete case' });
  }
});

export default router;
