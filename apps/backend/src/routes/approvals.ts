import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { approveReplySchema, rejectReplySchema, escalateSchema } from '../middleware/validation';
import { ApprovalService } from '../services/approvalService';
import { logger } from '../utils/logger';

const router = express.Router();
const approvalService = new ApprovalService();

/**
 * GET /api/approvals - List pending approvals
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { status = 'pending', limit = '20', offset = '0' } = req.query;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const approvals = await approvalService.getPendingApprovals(
      req.user.agencyId,
      parseInt(limit as string)
    );

    res.json({
      data: approvals,
      count: approvals.length,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/approvals/:id/approve - Approve reply
 */
router.post('/:id/approve', authMiddleware, validateRequest(approveReplySchema), async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const approval = await approvalService.approveReply(
      req.params.id,
      req.user.id,
      req.validated?.edits
    );

    logger.info('Approval granted', { approvalId: approval.id, userId: req.user.id });

    res.json({
      status: 'approved',
      data: approval,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/approvals/:id/reject - Reject reply
 */
router.post('/:id/reject', authMiddleware, validateRequest(rejectReplySchema), async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const approval = await approvalService.rejectReply(
      req.params.id,
      req.user.id,
      req.validated?.reason
    );

    logger.info('Approval rejected', { approvalId: approval.id, userId: req.user.id });

    res.json({
      status: 'rejected',
      data: approval,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/approvals/:id/escalate - Escalate item
 */
router.post('/:id/escalate', authMiddleware, validateRequest(escalateSchema), async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const approval = await approvalService.escalateItem(
      req.params.id,
      req.validated?.reason,
      req.validated?.escalateTo
    );

    logger.warn('Item escalated', { approvalId: approval.id, userId: req.user.id });

    res.json({
      status: 'escalated',
      data: approval,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/approvals/stats - Approval statistics
 */
router.get('/stats', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const stats = await approvalService.getApprovalStats(req.user.agencyId);

    res.json({ data: stats });
  } catch (err) {
    next(err);
  }
});

export { router as approvalRouter };
