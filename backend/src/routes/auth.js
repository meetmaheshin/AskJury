import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt.js';
import { authenticate } from '../middleware/auth.js';
import { generateUniqueHandle, generateUniqueUsername } from '../utils/handleGenerator.js';

const router = express.Router();
const prisma = new PrismaClient();

// Register — any email works. We auto-assign a permanent anonymous handle;
// the username is internal only (never shown publicly) and is optional.
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('username').optional({ checkFalsy: true }).trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const anonymousHandle = await generateUniqueHandle(prisma);
    // Internal account username (not public). Use provided one if free, else derive from handle.
    const username = await generateUniqueUsername(prisma, req.body.username || anonymousHandle);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        anonymousHandle,
        passwordHash
      },
      select: {
        id: true,
        email: true,
        username: true,
        anonymousHandle: true,
        avatarUrl: true,
        bio: true,
        isVerified: true,
        createdAt: true
      }
    });

    const token = generateToken(user.id);

    res.status(201).json({
      user,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({ user: req.user });
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
