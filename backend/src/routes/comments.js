import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get comments for a case
router.get('/case/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;

    const comments = await prisma.comment.findMany({
      where: {
        caseId,
        parentId: null // Only get top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        upvotes: 'desc' // Default sort by top
      }
    });

    res.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Create comment
router.post('/', authenticate, [
  body('caseId').isUUID(),
  body('content').trim().isLength({ min: 1, max: 1000 }),
  body('parentId').optional().isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { caseId, content, parentId } = req.body;

    // Verify case exists
    const caseItem = await prisma.case.findUnique({
      where: { id: caseId }
    });

    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // If parentId provided, verify it exists and is a top-level comment
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId }
      });

      if (!parentComment) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }

      if (parentComment.parentId) {
        return res.status(400).json({ error: 'Cannot reply to a reply (max 1 level deep)' });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        caseId,
        userId: req.user.id,
        content,
        parentId: parentId || null
      },
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

    res.status(201).json({ comment });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Upvote comment
router.post('/:id/upvote', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        upvotes: {
          increment: 1
        }
      }
    });

    res.json({ comment: updatedComment });
  } catch (error) {
    console.error('Upvote comment error:', error);
    res.status(500).json({ error: 'Failed to upvote comment' });
  }
});

// Downvote comment
router.post('/:id/downvote', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        downvotes: {
          increment: 1
        }
      }
    });

    res.json({ comment: updatedComment });
  } catch (error) {
    console.error('Downvote comment error:', error);
    res.status(500).json({ error: 'Failed to downvote comment' });
  }
});

// Delete comment (owner only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await prisma.comment.delete({
      where: { id }
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;
