import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
import { getVapidPublicKey, isPushConfigured } from '../utils/push.js';

const router = express.Router();
const prisma = new PrismaClient();

// Public VAPID key + whether push is enabled (client subscribes with this).
router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: getVapidPublicKey(), enabled: isPushConfigured() });
});

// Save / update a push subscription for the logged-in user.
router.post('/subscribe', authenticate, async (req, res) => {
  try {
    const { endpoint, keys } = req.body || {};
    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return res.status(400).json({ error: 'Invalid subscription' });
    }
    const sub = await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { userId: req.user.id, keys },
      create: { userId: req.user.id, endpoint, keys },
    });
    res.status(201).json({ ok: true, id: sub.id });
  } catch (e) {
    console.error('Subscribe error:', e);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Remove a subscription (on disable).
router.post('/unsubscribe', authenticate, async (req, res) => {
  try {
    const { endpoint } = req.body || {};
    if (endpoint) {
      await prisma.pushSubscription.deleteMany({ where: { endpoint, userId: req.user.id } });
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

export default router;
