import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, requireRole } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { BriefService } from '../services/briefService';
import { SEOService } from '../services/seoService';
import { DistributionService } from '../services/distributionService';
import Queue from 'bull';

const router = express.Router();
const prisma = new PrismaClient();
const briefService = new BriefService();
const seoService = new SEOService();
const distributionService = new DistributionService();
const generationQueue = new Queue('brief-generation', process.env.REDIS_URL!);

/**
 * POST /api/briefs - Create new brief project
 */
router.post('/', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const { title, topic, targetAudience, contentType, goals, keywords } =
      req.body;

    if (!title || !topic || !targetAudience || !contentType) {
      throw new AppError(400, 'Missing required fields');
    }

    // Create project
    const project = await prisma.briefProject.create({
      data: {
        userId: req.user.id,
        title,
        topic,
        targetAudience,
        contentType,
        goals: goals || [],
        keywords: keywords || [],
        status: 'draft',
      },
    });

    logger.info('Brief project created', { projectId: project.id });

    res.json({
      data: project,
      message: 'Brief project created. Ready to generate.',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/briefs - List user's briefs
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const { status, limit = '20' } = req.query;

    const where: any = { userId: req.user.id, deletedAt: null };
    if (status) where.status = status;

    const briefs = await prisma.briefProject.findMany({
      where,
      include: {
        brief: true,
        reviewer: true,
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
    });

    const total = await prisma.briefProject.count({ where });

    res.json({ data: briefs, total });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/briefs/:id - Get brief details
 */
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const brief = await prisma.briefProject.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        brief: true,
        seoStrategy: true,
        distribution: true,
        calendar: true,
        reviewer: true,
      },
    });

    if (!brief || brief.userId !== req.user.id) {
      throw new AppError(404, 'Brief not found');
    }

    res.json({ data: brief });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/briefs/:id/generate - Trigger AI generation
 */
router.post('/:id/generate', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const project = await prisma.briefProject.findUnique({
      where: { id: req.params.id },
    });

    if (!project || project.userId !== req.user.id) {
      throw new AppError(404, 'Project not found');
    }

    // Queue brief generation
    const job = await generationQueue.add(
      {
        projectId: project.id,
        topic: project.topic,
        targetAudience: project.targetAudience,
        contentType: project.contentType,
        goals: project.goals,
        keywords: project.keywords,
      },
      { attempts: 3, backoff: 'exponential' }
    );

    res.json({
      status: 'ok',
      message: 'Brief generation started',
      jobId: job.id,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/briefs/:id/preview - Preview brief before approval
 */
router.get('/:id/preview', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const brief = await prisma.briefProject.findUnique({
      where: { id: req.params.id },
      include: {
        brief: true,
        seoStrategy: true,
        distribution: true,
        calendar: true,
      },
    });

    if (!brief || brief.userId !== req.user.id) {
      throw new AppError(404, 'Brief not found');
    }

    res.json({
      data: {
        ...brief,
        preview: this.formatBriefPreview(brief),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Format brief for preview
 */
private formatBriefPreview(brief: any) {
  return `
# ${brief.title}

## Content Brief
**Angle:** ${brief.brief?.angle}
**Tone:** ${brief.brief?.tone}
**Length:** ${brief.brief?.estimatedLength}

**Key Messages:**
${brief.brief?.keyMessages.map((m: string) => `- ${m}`).join('\n')}

**Target Pain:** ${brief.brief?.targetPain}
**Solution:** ${brief.brief?.solutionOffered}
**CTA:** ${brief.brief?.callToAction}

## SEO Strategy
**Primary Keyword:** ${brief.seoStrategy?.primaryKeyword}
**Meta Title:** ${brief.seoStrategy?.metaTitle}
**Meta Description:** ${brief.seoStrategy?.metaDescription}

## Distribution Plan
${brief.distribution?.channels.map((c: any) => `- **${c.name}**: ${c.postingTime}`).join('\n')}
  `.trim();
}

export { router as briefs Router };
