/**
 * Web Push helper. Sends notifications to a user's saved subscriptions.
 * No-ops gracefully when VAPID keys aren't configured (so the app never crashes).
 */
import webpush from 'web-push';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PUBLIC = process.env.VAPID_PUBLIC_KEY;
const PRIVATE = process.env.VAPID_PRIVATE_KEY;
const SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@askjury.com';

let configured = false;
if (PUBLIC && PRIVATE) {
  try {
    webpush.setVapidDetails(SUBJECT, PUBLIC, PRIVATE);
    configured = true;
  } catch (e) {
    console.warn('⚠️ Invalid VAPID config — push disabled:', e.message);
  }
} else {
  console.warn('⚠️ VAPID keys not set — push notifications disabled');
}

export function isPushConfigured() {
  return configured;
}

export function getVapidPublicKey() {
  return PUBLIC || null;
}

/** Send a push payload to every subscription belonging to a user. Expired subs are pruned. */
export async function sendPushToUser(userId, payload) {
  if (!configured || !userId) return;
  let subs = [];
  try {
    subs = await prisma.pushSubscription.findMany({ where: { userId } });
  } catch {
    return; // table may not exist yet on a stale DB
  }
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, JSON.stringify(payload));
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { id: s.id } }).catch(() => {});
        } else {
          console.error('Push send error:', err.statusCode || err.message);
        }
      }
    })
  );
}
