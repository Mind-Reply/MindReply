import express from 'express';
import { AdminAuthService } from './services/adminAuthService';

const router = express.Router();
const authService = new AdminAuthService();

/**
 * Middleware: Verify admin token & IP
 */
export const verifyAdminToken = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers['x-admin-token'];
    const adminId = req.headers['x-admin-id'];
    const ipAddress = req.ip;

    if (!token || !adminId) {
      return res.status(401).json({ error: 'Missing credentials' });
    }

    const admin = await require('@prisma/client').PrismaClient.$queryRaw`
      SELECT * FROM "AdminSession" WHERE id = ${adminId} LIMIT 1
    `;

    if (!admin) {
      return res.status(401).json({ error: 'Admin not found' });
    }

    // Verify IP whitelist
    const whitelist = admin.ipWhitelist || [];
    if (whitelist.length > 0 && !whitelist.includes(ipAddress)) {
      return res.status(403).json({ error: 'IP not whitelisted' });
    }

    // Verify token
    const verified = await authService.verifyAdminToken(token, adminId);
    if (!verified.valid) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.admin = verified;
    req.adminIp = ipAddress;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Auth failed' });
  }
};

export { router };
