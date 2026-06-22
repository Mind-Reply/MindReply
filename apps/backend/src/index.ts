import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { requestLogger, errorHandler } from './utils/logger';
import { authMiddleware, requireRole } from './middleware/auth';
import { globalLimiter, apiLimiter } from './middleware/rateLimiter';

// Route imports
import { messagesRouter } from './routes/messages';
import { authRouter } from './routes/auth';
import { approvalRouter } from './routes/approvals';
import { followupsRouter } from './routes/followups';
import { analyticsRouter } from './routes/analytics';
import { billingRouter } from './routes/billing';
import { adminRouter } from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(globalLimiter);

// Health & Status
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'MindReply Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Public routes (no auth required)
app.use('/api/auth', authRouter);

// Protected routes (auth required)
app.use('/api/messages', authMiddleware, apiLimiter, messagesRouter);
app.use('/api/approvals', authMiddleware, apiLimiter, approvalRouter);
app.use('/api/followups', authMiddleware, apiLimiter, followupsRouter);
app.use('/api/analytics', authMiddleware, apiLimiter, analyticsRouter);
app.use('/api/billing', authMiddleware, apiLimiter, billingRouter);

// Admin routes (secure)
const { adminRouter } = require('./routes/admin');
app.use('/api/admin', adminRouter);



// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend running on http://0.0.0.0:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
});

export default app;
