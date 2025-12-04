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
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
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
      console.error('Google OAuth callback error:', error);
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

export default router;
