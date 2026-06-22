import express from 'express';
import { AdminAuthService } from '../services/adminAuthService';
import { AdminChatService } from '../services/adminChatService';
import { logger } from '../utils/logger';

const router = express.Router();
const authService = new AdminAuthService();
const chatService = new AdminChatService();

/**
 * Admin authentication middleware
 */
const adminAuth = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers['x-admin-token'];
    const adminId = req.headers['x-admin-id'];

    if (!token || !adminId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const verified = await authService.verifyAdminToken(token, adminId);
    if (!verified.valid) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.admin = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * POST /api/admin/auth/init - Initialize admin (first time only)
 */
router.post('/auth/init', async (req, res, next) => {
  try {
    const { email, password, ipWhitelist } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const admin = await authService.initializeAdmin(email, password, ipWhitelist);
    res.status(201).json({ data: admin });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/admin/auth/login - Admin login
 */
router.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || 'unknown';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await authService.loginAdmin(email, password, ipAddress);
    await authService.logAction(email, 'login', {}, ipAddress, req.get('user-agent'));

    res.json({
      token: result.token,
      adminId: result.admin.id,
      email: result.admin.email,
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

/**
 * POST /api/admin/chat/session - Create chat session
 */
router.post('/chat/session', adminAuth, async (req, res, next) => {
  try {
    const { title, model } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title required' });
    }

    const session = await chatService.createChatSession(req.admin.adminId, title, model);

    await authService.logAction(
      req.admin.email,
      'chat_session_created',
      { sessionId: session.id, title },
      req.ip || 'unknown',
      req.get('user-agent')
    );

    res.status(201).json({ data: session });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/chat/sessions - List chat sessions
 */
router.get('/chat/sessions', adminAuth, async (req, res, next) => {
  try {
    const sessions = await chatService.listChatSessions(req.admin.adminId);
    res.json({ data: sessions });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/chat/:sessionId - Get chat session
 */
router.get('/chat/:sessionId', adminAuth, async (req, res, next) => {
  try {
    const session = await chatService.getChatSession(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ data: session });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/chat/:sessionId/message - Send message
 */
router.post('/chat/:sessionId/message', adminAuth, async (req, res, next) => {
  try {
    const { message, model } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const result = await chatService.processMessage(req.params.sessionId, message, model);

    await authService.logAction(
      req.admin.email,
      'chat_message_sent',
      { sessionId: req.params.sessionId, tokens: result.assistantMsg.tokensUsed },
      req.ip || 'unknown',
      req.get('user-agent')
    );

    res.json({
      userMessage: result.userMsg,
      assistantMessage: result.assistantMsg,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/chat/:sessionId - Delete session
 */
router.delete('/chat/:sessionId', adminAuth, async (req, res, next) => {
  try {
    await chatService.deleteChatSession(req.params.sessionId);

    await authService.logAction(
      req.admin.email,
      'chat_session_deleted',
      { sessionId: req.params.sessionId },
      req.ip || 'unknown',
      req.get('user-agent')
    );

    res.json({ status: 'deleted' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/auth/password - Change password
 */
router.post('/auth/password', adminAuth, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old and new password required' });
    }

    await authService.changePassword(req.admin.adminId, oldPassword, newPassword);

    await authService.logAction(
      req.admin.email,
      'password_changed',
      {},
      req.ip || 'unknown',
      req.get('user-agent')
    );

    res.json({ status: 'password_changed' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/admin/auth/whitelist - Update IP whitelist
 */
router.post('/auth/whitelist', adminAuth, async (req, res, next) => {
  try {
    const { ipAddresses } = req.body;

    if (!Array.isArray(ipAddresses)) {
      return res.status(400).json({ error: 'IP addresses array required' });
    }

    const admin = await authService.updateIpWhitelist(req.admin.adminId, ipAddresses);

    await authService.logAction(
      req.admin.email,
      'ip_whitelist_updated',
      { count: ipAddresses.length },
      req.ip || 'unknown',
      req.get('user-agent')
    );

    res.json({ data: admin });
  } catch (err) {
    next(err);
  }
});

export { router as adminRouter };
