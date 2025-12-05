import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  (req, res, next) => {
    console.log('[OAuth] Google callback hit');
    console.log('[OAuth] Query params:', req.query);

    passport.authenticate('google', {
      failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
      session: false
    })(req, res, next);
  },
  (req, res) => {
    try {
      console.log('[OAuth] Google authentication successful');
      console.log('[OAuth] User:', req.user);

      if (!req.user) {
        console.error('[OAuth] No user object after authentication');
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: req.user.id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      console.log('[OAuth] JWT generated successfully');

      // Redirect to frontend with token
      const redirectUrl = `${process.env.FRONTEND_URL}/login?token=${token}&userId=${req.user.id}&username=${req.user.username}`;
      console.log('[OAuth] Redirecting to:', redirectUrl);

      res.redirect(redirectUrl);
    } catch (error) {
      console.error('[OAuth] Google callback error:', error);
      console.error('[OAuth] Error stack:', error.stack);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
  }
);

// GitHub OAuth routes
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=github_auth_failed`,
    session: false
  }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { userId: req.user.id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      // Redirect to frontend with token
      res.redirect(
        `${process.env.FRONTEND_URL}/login?token=${token}&userId=${req.user.id}&username=${req.user.username}`
      );
    } catch (error) {
      console.error('GitHub OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
  }
);

// Check auth status (optional endpoint)
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

// Debug endpoint to check OAuth configuration
router.get('/debug/config', (req, res) => {
  res.json({
    google: {
      configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasCallbackUrl: !!process.env.GOOGLE_CALLBACK_URL,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL
    },
    github: {
      configured: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
      hasClientId: !!process.env.GITHUB_CLIENT_ID,
      hasClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
      hasCallbackUrl: !!process.env.GITHUB_CALLBACK_URL,
      callbackUrl: process.env.GITHUB_CALLBACK_URL
    },
    frontend: {
      hasFrontendUrl: !!process.env.FRONTEND_URL,
      frontendUrl: process.env.FRONTEND_URL
    }
  });
});

export default router;
