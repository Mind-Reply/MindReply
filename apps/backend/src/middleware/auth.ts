import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

export interface TokenPayload {
  id: string;
  email: string;
  agencyId: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate JWT token
 */
export const generateToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  if (!JWT_SECRET) throw new Error('JWT_SECRET not configured');

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): TokenPayload => {
  if (!JWT_SECRET) throw new Error('JWT_SECRET not configured');

  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    logger.error('Token verification failed:', err);
    throw new Error('Invalid or expired token');
  }
};

/**
 * Extract token from Authorization header
 */
export const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
};

/**
 * Middleware: Verify JWT
 */
export const authMiddleware = (req: any, res: any, next: any) => {
  try {
    const token = extractToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err: any) {
    logger.warn('Auth failed:', { error: err.message });
    res.status(401).json({ error: 'Unauthorized' });
  }
};

/**
 * Middleware: Verify role
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Insufficient permissions', {
        userId: req.user.id,
        requiredRole: allowedRoles,
        userRole: req.user.role,
      });
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
