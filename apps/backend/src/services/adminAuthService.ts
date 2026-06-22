import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

export class AdminAuthService {
  /**
   * Initialize admin (one-time setup)
   */
  async initializeAdmin(email: string, password: string, ipWhitelist: string[] = []) {
    try {
      // Check if admin exists
      const existing = await prisma.adminSession.findUnique({ where: { adminEmail: email } });
      if (existing) {
        throw new Error('Admin already exists');
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const jwtSecret = jwt.sign({ email, timestamp: Date.now() }, JWT_SECRET);

      const admin = await prisma.adminSession.create({
        data: {
          adminEmail: email,
          adminPasswordHash: passwordHash,
          jwtSecret,
          ipWhitelist: ipWhitelist.length > 0 ? ipWhitelist : ['127.0.0.1', '::1'],
        },
      });

      logger.info('Admin initialized', { email });
      return { id: admin.id, email: admin.adminEmail };
    } catch (err) {
      logger.error('Admin initialization failed:', err);
      throw err;
    }
  }

  /**
   * Admin login
   */
  async loginAdmin(email: string, password: string, ipAddress: string) {
    try {
      const admin = await prisma.adminSession.findUnique({ where: { adminEmail: email } });
      if (!admin) {
        throw new Error('Invalid credentials');
      }

      // Check if locked
      if (admin.locked && admin.lockUntil && admin.lockUntil > new Date()) {
        throw new Error('Account temporarily locked');
      }

      // Check IP whitelist
      if (admin.ipWhitelist.length > 0 && !admin.ipWhitelist.includes(ipAddress)) {
        logger.warn('Login attempt from unauthorized IP', { email, ip: ipAddress });
        throw new Error('Access denied: IP not whitelisted');
      }

      // Verify password
      const valid = await bcrypt.compare(password, admin.adminPasswordHash);
      if (!valid) {
        // Increment failed attempts
        const attempts = (admin.loginAttempts || 0) + 1;
        const locked = attempts >= 5;

        await prisma.adminSession.update({
          where: { id: admin.id },
          data: {
            loginAttempts: attempts,
            locked,
            lockUntil: locked ? new Date(Date.now() + 30 * 60 * 1000) : null,
          },
        });

        throw new Error('Invalid credentials');
      }

      // Successful login
      const token = jwt.sign(
        { adminId: admin.id, email: admin.adminEmail },
        admin.jwtSecret,
        { expiresIn: '24h' }
      );

      await prisma.adminSession.update({
        where: { id: admin.id },
        data: {
          lastLogin: new Date(),
          loginAttempts: 0,
          locked: false,
        },
      });

      logger.info('Admin login successful', { email });
      return { token, admin: { id: admin.id, email: admin.adminEmail } };
    } catch (err) {
      logger.error('Admin login failed:', err);
      throw err;
    }
  }

  /**
   * Verify admin token
   */
  async verifyAdminToken(token: string, adminId: string) {
    try {
      const admin = await prisma.adminSession.findUnique({ where: { id: adminId } });
      if (!admin) {
        throw new Error('Admin not found');
      }

      const decoded = jwt.verify(token, admin.jwtSecret) as any;
      return { valid: true, adminId: decoded.adminId, email: decoded.email };
    } catch (err) {
      logger.error('Token verification failed:', err);
      return { valid: false };
    }
  }

  /**
   * Update IP whitelist
   */
  async updateIpWhitelist(adminId: string, ipAddresses: string[]) {
    try {
      const admin = await prisma.adminSession.update({
        where: { id: adminId },
        data: { ipWhitelist: ipAddresses },
      });

      logger.info('IP whitelist updated', { adminId });
      return admin;
    } catch (err) {
      logger.error('Failed to update IP whitelist:', err);
      throw err;
    }
  }

  /**
   * Change admin password
   */
  async changePassword(adminId: string, oldPassword: string, newPassword: string) {
    try {
      const admin = await prisma.adminSession.findUnique({ where: { id: adminId } });
      if (!admin) {
        throw new Error('Admin not found');
      }

      const valid = await bcrypt.compare(oldPassword, admin.adminPasswordHash);
      if (!valid) {
        throw new Error('Current password incorrect');
      }

      const newHash = await bcrypt.hash(newPassword, 12);
      await prisma.adminSession.update({
        where: { id: adminId },
        data: { adminPasswordHash: newHash },
      });

      logger.info('Admin password changed', { adminId });
      return { success: true };
    } catch (err) {
      logger.error('Failed to change password:', err);
      throw err;
    }
  }

  /**
   * Log admin action
   */
  async logAction(adminEmail: string, action: string, details: any, ipAddress: string, userAgent?: string) {
    try {
      await prisma.adminAuditLog.create({
        data: {
          adminEmail,
          action,
          details,
          ipAddress,
          userAgent,
        },
      });
    } catch (err) {
      logger.error('Failed to log action:', err);
    }
  }
}
