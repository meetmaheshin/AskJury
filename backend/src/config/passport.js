import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (user) {
          // User exists, return user
          return done(null, user);
        }

        // Check if email is already registered with different provider
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.emails[0].value },
        });

        if (existingUser) {
          // Update existing user with Google ID
          user = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              googleId: profile.id,
              authProvider: 'google',
              isVerified: true,
              avatarUrl: profile.photos?.[0]?.value || existingUser.avatarUrl,
            },
          });
          return done(null, user);
        }

        // Create new user
        const username = profile.emails[0].value.split('@')[0] + '_' + profile.id.slice(-4);

        user = await prisma.user.create({
          data: {
            email: profile.emails[0].value,
            username: username,
            googleId: profile.id,
            authProvider: 'google',
            isVerified: true,
            avatarUrl: profile.photos?.[0]?.value,
          },
        });

        done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        done(error, null);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await prisma.user.findUnique({
          where: { githubId: profile.id.toString() },
        });

        if (user) {
          // User exists, return user
          return done(null, user);
        }

        // Get primary email from GitHub
        const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;

        // Check if email is already registered with different provider
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          // Update existing user with GitHub ID
          user = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              githubId: profile.id.toString(),
              authProvider: 'github',
              isVerified: true,
              avatarUrl: profile.photos?.[0]?.value || existingUser.avatarUrl,
            },
          });
          return done(null, user);
        }

        // Create new user
        const username = profile.username || email.split('@')[0] + '_gh' + profile.id.toString().slice(-4);

        user = await prisma.user.create({
          data: {
            email,
            username,
            githubId: profile.id.toString(),
            authProvider: 'github',
            isVerified: true,
            avatarUrl: profile.photos?.[0]?.value,
          },
        });

        done(null, user);
      } catch (error) {
        console.error('GitHub OAuth error:', error);
        done(error, null);
      }
    }
  )
);

export default passport;
