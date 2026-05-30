import jwt from 'jsonwebtoken';

const ENV_SECRET = process.env.JWT_SECRET;
// Fail closed in production: never sign tokens with a known/default secret.
if (!ENV_SECRET || ENV_SECRET.length < 32) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set to a strong value (>=32 chars) in production.');
  }
  console.warn('⚠️  JWT_SECRET missing or weak — using an insecure dev secret. Do NOT use in production.');
}
const JWT_SECRET = ENV_SECRET && ENV_SECRET.length >= 32 ? ENV_SECRET : 'dev-only-insecure-secret-change-me-please';
const JWT_EXPIRES_IN = '7d';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
