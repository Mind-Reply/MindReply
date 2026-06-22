import { z } from 'zod';

/**
 * Validation schemas for API endpoints
 */

// Auth
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name required'),
  password: z.string().min(12, 'Password must be at least 12 characters'),
  agencyName: z.string().min(2, 'Agency name required'),
});

// Messages
export const syncMessagesSchema = z.object({
  agencyId: z.string().cuid('Invalid agency ID'),
  accessToken: z.string().min(20, 'Invalid access token'),
});

export const messageFilterSchema = z.object({
  status: z.enum(['new', 'processing', 'processed', 'archived']).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

// Approvals
export const approveReplySchema = z.object({
  approvalId: z.string().cuid('Invalid approval ID'),
  edits: z.string().optional(),
});

export const rejectReplySchema = z.object({
  approvalId: z.string().cuid('Invalid approval ID'),
  reason: z.string().min(10, 'Please provide a reason'),
});

export const escalateSchema = z.object({
  approvalId: z.string().cuid('Invalid approval ID'),
  reason: z.string().min(10, 'Please provide an escalation reason'),
  escalateTo: z.string().optional(),
});

// Follow-ups
export const createFollowUpSchema = z.object({
  messageId: z.string().cuid('Invalid message ID'),
  taskType: z.enum(['reminder', 'nudge', 'escalation', 'callback']),
  description: z.string().min(10),
  scheduledFor: z.coerce.date().min(new Date(), 'Date must be in future'),
  notificationChannels: z.array(z.enum(['email', 'slack', 'sms', 'in_app'])).default(['email']),
});

// Validation middleware
export const validateRequest = (schema: any) => {
  return async (req: any, res: any, next: any) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.validated = validated;
      next();
    } catch (err: any) {
      res.status(400).json({
        error: 'Validation failed',
        details: err.errors,
      });
    }
  };
};
