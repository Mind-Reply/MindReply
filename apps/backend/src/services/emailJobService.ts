import { PrismaClient } from '@prisma/client';
import Queue from 'bull';
import { EmailService } from './emailService';
import { AnalysisService } from './analysisService';
import { ApprovalService } from './approvalService';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();
const emailQueue = new Queue('email-sync', process.env.REDIS_URL!);
const analysisQueue = new Queue('message-analysis', process.env.REDIS_URL!);
const sendQueue = new Queue('send-email', process.env.REDIS_URL!);

/**
 * Background job: Sync Gmail inbox every 5 minutes
 */
export async function setupEmailSyncJob() {
  emailQueue.process(async (job) => {
    try {
      const { agencyId, accessToken } = job.data;
      const emailService = new EmailService(accessToken);
      
      logger.info('Starting email sync for agency', { agencyId });
      
      const messages = await emailService.fetchUnreadMessages(10);
      
      for (const msg of messages) {
        // Check if message already exists
        const existing = await prisma.incomingMessage.findUnique({
          where: { gmailMessageId: msg.gmailMessageId },
        });

        if (!existing) {
          // Create new message
          const incomingMessage = await prisma.incomingMessage.create({
            data: {
              agencyId,
              gmailMessageId: msg.gmailMessageId,
              from: msg.from,
              subject: msg.subject,
              body: msg.body,
              bodyText: msg.body,
              receivedAt: new Date(msg.timestamp),
              status: 'new',
            },
          });

          // Queue for AI analysis
          await analysisQueue.add(
            { messageId: incomingMessage.id, agencyId },
            { attempts: 3, backoff: 'exponential' }
          );

          logger.info('New message queued for analysis', { messageId: incomingMessage.id });
        }
      }

      return { messagesProcessed: messages.length };
    } catch (err) {
      logger.error('Email sync failed:', err);
      throw err;
    }
  });

  // Schedule every 5 minutes
  emailQueue.add({}, { repeat: { every: 5 * 60 * 1000 } });
  logger.info('Email sync job scheduled: every 5 minutes');
}

/**
 * Background job: Analyze messages with AI
 */
export async function setupAnalysisJob() {
  const analysisService = new AnalysisService();
  const approvalService = new ApprovalService();

  analysisQueue.process(async (job) => {
    try {
      const { messageId, agencyId } = job.data;

      const message = await prisma.incomingMessage.findUnique({
        where: { id: messageId },
      });

      if (!message) throw new Error('Message not found');

      logger.info('Analyzing message', { messageId });

      // Get agency tone preference
      const agency = await prisma.agency.findUnique({
        where: { id: agencyId },
      });

      const agencyTone = agency?.settings?.tonePreference || 'professional and friendly';

      // Analyze with AI
      const analysis = await analysisService.analyzeMessage(
        message.subject,
        message.bodyText,
        agencyTone
      );

      // Create analysis record
      const messageAnalysis = await prisma.messageAnalysis.create({
        data: {
          messageId,
          summary: analysis.summary,
          sentiment: analysis.sentiment,
          extractedQuestions: analysis.extractedQuestions,
          suggestedReplyDraft: analysis.suggestedReply,
          confidenceScore: analysis.confidenceScore,
          analysisMethod: analysis.confidenceScore > 0 ? 'gpt4' : 'fallback',
        },
      });

      // Check escalation rules
      const { shouldEscalate, reason } = analysisService.detectEscalation(
        analysis.sentiment,
        analysis.confidenceScore,
        analysis.extractedQuestions.length
      );

      // Create approval queue item
      const approvalItem = await approvalService.createApprovalItem(
        agencyId,
        messageId,
        messageAnalysis.id,
        analysis.suggestedReply
      );

      if (shouldEscalate) {
        await approvalService.escalateItem(approvalItem.id, reason || 'Auto-escalated by system');
        logger.warn('Message auto-escalated', { messageId, reason });
      }

      // Update message status
      await prisma.incomingMessage.update({
        where: { id: messageId },
        data: { status: 'processed' },
      });

      return { success: true, escalated: shouldEscalate };
    } catch (err) {
      logger.error('Message analysis failed:', err);
      throw err;
    }
  });
}

/**
 * Background job: Send approved emails
 */
export async function setupSendJob() {
  sendQueue.process(async (job) => {
    try {
      const { approvalId, accessToken } = job.data;

      const approvalItem = await prisma.approvalQueue.findUnique({
        where: { id: approvalId },
        include: { message: true },
      });

      if (!approvalItem) throw new Error('Approval not found');

      const emailService = new EmailService(accessToken);
      const finalReply = approvalItem.human_edits || approvalItem.suggested_reply;

      // Extract recipient from original message
      const fromMatch = approvalItem.message.from.match(/<(.+?)>|(.+)/);
      const toEmail = fromMatch?.[1] || fromMatch?.[2] || approvalItem.message.from;

      logger.info('Sending reply', { approvalId, toEmail });

      const result = await emailService.sendReply(
        toEmail,
        `Re: ${approvalItem.message.subject}`,
        finalReply
      );

      // Create sent record
      await prisma.sentMessage.create({
        data: {
          approvalId,
          messageId: approvalItem.messageId,
          gmailMessageId: result.gmailMessageId,
          deliveryStatus: 'sent',
        },
      });

      // Update approval status
      await prisma.approvalQueue.update({
        where: { id: approvalId },
        data: { status: 'approved' },
      });

      logger.info('Email sent successfully', { approvalId });
      return { success: true };
    } catch (err) {
      logger.error('Email send failed:', err);
      throw err;
    }
  });
}

/**
 * Background job: Process scheduled follow-ups
 */
export async function setupFollowUpJob() {
  const followUpQueue = new Queue('follow-ups', process.env.REDIS_URL!);

  followUpQueue.process(async (job) => {
    try {
      // Find all pending follow-ups that are due
      const dueFollowUps = await prisma.followUp.findMany({
        where: {
          status: 'pending',
          scheduledAt: { lte: new Date() },
        },
        include: { message: true, agency: true },
      });

      logger.info(`Processing ${dueFollowUps.length} follow-ups`);

      for (const followUp of dueFollowUps) {
        // Send follow-up notification to agency
        // TODO: Integrate with email/Slack notification
        
        await prisma.followUp.update({
          where: { id: followUp.id },
          data: {
            status: 'completed',
            completedAt: new Date(),
          },
        });
      }

      return { processed: dueFollowUps.length };
    } catch (err) {
      logger.error('Follow-up job failed:', err);
      throw err;
    }
  });

  // Schedule every 15 minutes
  followUpQueue.add({}, { repeat: { every: 15 * 60 * 1000 } });
  logger.info('Follow-up job scheduled: every 15 minutes');
}

/**
 * Background job: Update daily analytics
 */
export async function setupAnalyticsJob() {
  const analyticsQueue = new Queue('analytics', process.env.REDIS_URL!);

  analyticsQueue.process(async (job) => {
    try {
      const { agencyId } = job.data;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Aggregate today's metrics
      const messagesReceived = await prisma.incomingMessage.count({
        where: {
          agencyId,
          createdAt: { gte: today },
        },
      });

      const repliesApproved = await prisma.sentMessage.count({
        where: {
          approvalQueue: { agencyId },
          sentAt: { gte: today },
        },
      });

      const repliesRejected = await prisma.approvalQueue.count({
        where: {
          agencyId,
          status: 'rejected',
          reviewedAt: { gte: today },
        },
      });

      const escalations = await prisma.approvalQueue.count({
        where: {
          agencyId,
          status: 'escalated',
          createdAt: { gte: today },
        },
      });

      // Estimate hours saved (average 5 min per reply draft)
      const estimatedHoursSaved = (repliesApproved * 5) / 60;

      // Upsert analytics record
      await prisma.analytics.upsert({
        where: {
          agencyId_date: {
            agencyId,
            date: today,
          },
        },
        create: {
          agencyId,
          date: today,
          messagesReceived,
          messagesProcessed: repliesApproved + repliesRejected,
          repliesApproved,
          repliesRejected,
          escalations,
          estimatedHoursSaved,
        },
        update: {
          messagesReceived,
          messagesProcessed: repliesApproved + repliesRejected,
          repliesApproved,
          repliesRejected,
          escalations,
          estimatedHoursSaved,
        },
      });

      logger.info('Analytics updated for agency', { agencyId });
      return { success: true };
    } catch (err) {
      logger.error('Analytics job failed:', err);
      throw err;
    }
  });

  // Schedule daily at midnight
  analyticsQueue.add({}, { repeat: { cron: '0 0 * * *' } });
  logger.info('Analytics job scheduled: daily at midnight');
}
