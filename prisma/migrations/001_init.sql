-- CreateTable User
CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "avatarUrl" TEXT,
  "authProvider" TEXT NOT NULL DEFAULT 'email',
  "authProviderId" TEXT,
  "passwordHash" TEXT,
  "emailVerified" TIMESTAMP(3),
  "agencyId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'member',
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE CASCADE
);

-- CreateTable Agency
CREATE TABLE "Agency" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "website" TEXT,
  "logo" TEXT,
  "stripeCustomerId" TEXT,
  "subscriptionTier" TEXT NOT NULL DEFAULT 'free',
  "subscriptionStatus" TEXT NOT NULL DEFAULT 'active',
  "settings" JSONB NOT NULL DEFAULT '{}',
  "emailIntegrations" JSONB NOT NULL DEFAULT '{}',
  "automationRules" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable IncomingMessage
CREATE TABLE "IncomingMessage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "agencyId" TEXT NOT NULL,
  "gmailMessageId" TEXT NOT NULL UNIQUE,
  "from" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "bodyText" TEXT NOT NULL,
  "receivedAt" TIMESTAMP(3) NOT NULL,
  "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT NOT NULL DEFAULT 'new',
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "threadId" TEXT,
  "isReply" BOOLEAN NOT NULL DEFAULT false,
  "parentMessageId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE CASCADE
);

-- CreateTable MessageAnalysis
CREATE TABLE "MessageAnalysis" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "messageId" TEXT NOT NULL UNIQUE,
  "summary" TEXT NOT NULL,
  "sentiment" TEXT NOT NULL,
  "extractedQuestions" TEXT[],
  "suggestedReplyDraft" TEXT NOT NULL,
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "analysisMethod" TEXT NOT NULL DEFAULT 'gpt4',
  "keyTopics" TEXT[],
  "actionItems" TEXT[],
  "requiresEscalation" BOOLEAN NOT NULL DEFAULT false,
  "escalationReason" TEXT,
  "analysisModel" TEXT,
  "tokenUsage" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("messageId") REFERENCES "IncomingMessage" ("id") ON DELETE CASCADE
);

-- CreateTable ApprovalQueue
CREATE TABLE "ApprovalQueue" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "agencyId" TEXT NOT NULL,
  "messageId" TEXT NOT NULL UNIQUE,
  "suggestedReply" TEXT NOT NULL,
  "humanEdits" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "reviewedBy" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "reviewNotes" TEXT,
  "escalatedTo" TEXT,
  "escalationReason" TEXT,
  "escalatedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("messageId") REFERENCES "IncomingMessage" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("reviewedBy") REFERENCES "User" ("id")
);

-- CreateTable SentMessage
CREATE TABLE "SentMessage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "messageId" TEXT NOT NULL UNIQUE,
  "approvalId" TEXT NOT NULL UNIQUE,
  "gmailMessageId" TEXT UNIQUE,
  "toEmail" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "deliveryStatus" TEXT NOT NULL DEFAULT 'sent',
  "deliveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "readAt" TIMESTAMP(3),
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "sentBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("messageId") REFERENCES "IncomingMessage" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("approvalId") REFERENCES "ApprovalQueue" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("sentBy") REFERENCES "User" ("id")
);

-- CreateTable FollowUp
CREATE TABLE "FollowUp" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "agencyId" TEXT NOT NULL,
  "messageId" TEXT,
  "createdBy" TEXT NOT NULL,
  "taskType" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "scheduledFor" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'scheduled',
  "completedAt" TIMESTAMP(3),
  "completedBy" TEXT,
  "notificationChannels" TEXT[] DEFAULT ARRAY['email'],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("messageId") REFERENCES "IncomingMessage" ("id") ON DELETE SET NULL,
  FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- CreateTable Subscription
CREATE TABLE "Subscription" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "tier" TEXT NOT NULL DEFAULT 'free',
  "status" TEXT NOT NULL DEFAULT 'active',
  "stripeCustomerId" TEXT,
  "stripeSubscriptionId" TEXT,
  "stripePriceId" TEXT,
  "currentPeriodStart" TIMESTAMP(3),
  "currentPeriodEnd" TIMESTAMP(3),
  "cancelAt" TIMESTAMP(3),
  "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- CreateTable Analytics
CREATE TABLE "Analytics" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "agencyId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "messagesReceived" INTEGER NOT NULL DEFAULT 0,
  "messagesProcessed" INTEGER NOT NULL DEFAULT 0,
  "repliesApproved" INTEGER NOT NULL DEFAULT 0,
  "repliesRejected" INTEGER NOT NULL DEFAULT 0,
  "escalations" INTEGER NOT NULL DEFAULT 0,
  "estimatedHoursSaved" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "avgResponseTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "approvalRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("agencyId", "date"),
  FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE CASCADE
);

-- CreateTable UsageMetrics
CREATE TABLE "UsageMetrics" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "agencyId" TEXT NOT NULL,
  "month" TIMESTAMP(3) NOT NULL,
  "emailsProcessed" INTEGER NOT NULL DEFAULT 0,
  "apiBriefsGenerated" INTEGER NOT NULL DEFAULT 0,
  "storageUsedGb" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "aiTokensUsed" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("agencyId", "month"),
  FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE CASCADE
);

-- CreateTable ActivityLog
CREATE TABLE "ActivityLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "resourceType" TEXT NOT NULL,
  "resourceId" TEXT,
  "details" JSONB NOT NULL DEFAULT '{}',
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- CreateTable N8nWorkflow
CREATE TABLE "N8nWorkflow" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "agencyId" TEXT NOT NULL,
  "n8nWorkflowId" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "triggerType" TEXT NOT NULL,
  "triggerConfig" JSONB NOT NULL DEFAULT '{}',
  "lastRun" TIMESTAMP(3),
  "lastRunStatus" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable N8nExecution
CREATE TABLE "N8nExecution" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "workflowId" TEXT NOT NULL,
  "n8nExecutionId" TEXT NOT NULL UNIQUE,
  "status" TEXT NOT NULL,
  "inputData" JSONB,
  "outputData" JSONB,
  "errorMessage" TEXT,
  "startedAt" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  "executionTime" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "User_agencyId_idx" ON "User"("agencyId");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "Agency_stripeCustomerId_idx" ON "Agency"("stripeCustomerId");
CREATE INDEX "IncomingMessage_agencyId_idx" ON "IncomingMessage"("agencyId");
CREATE INDEX "IncomingMessage_gmailMessageId_idx" ON "IncomingMessage"("gmailMessageId");
CREATE INDEX "IncomingMessage_status_idx" ON "IncomingMessage"("status");
CREATE INDEX "IncomingMessage_receivedAt_idx" ON "IncomingMessage"("receivedAt");
CREATE INDEX "MessageAnalysis_messageId_idx" ON "MessageAnalysis"("messageId");
CREATE INDEX "ApprovalQueue_agencyId_idx" ON "ApprovalQueue"("agencyId");
CREATE INDEX "ApprovalQueue_status_idx" ON "ApprovalQueue"("status");
CREATE INDEX "ApprovalQueue_messageId_idx" ON "ApprovalQueue"("messageId");
CREATE INDEX "ApprovalQueue_reviewedBy_idx" ON "ApprovalQueue"("reviewedBy");
CREATE INDEX "SentMessage_gmailMessageId_idx" ON "SentMessage"("gmailMessageId");
CREATE INDEX "SentMessage_deliveryStatus_idx" ON "SentMessage"("deliveryStatus");
CREATE INDEX "FollowUp_agencyId_idx" ON "FollowUp"("agencyId");
CREATE INDEX "FollowUp_status_idx" ON "FollowUp"("status");
CREATE INDEX "FollowUp_scheduledFor_idx" ON "FollowUp"("scheduledFor");
CREATE INDEX "Subscription_stripeCustomerId_idx" ON "Subscription"("stripeCustomerId");
CREATE INDEX "Analytics_agencyId_idx" ON "Analytics"("agencyId");
CREATE INDEX "Analytics_date_idx" ON "Analytics"("date");
CREATE INDEX "UsageMetrics_agencyId_idx" ON "UsageMetrics"("agencyId");
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");
CREATE INDEX "ActivityLog_action_idx" ON "ActivityLog"("action");
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");
CREATE INDEX "N8nWorkflow_agencyId_idx" ON "N8nWorkflow"("agencyId");
CREATE INDEX "N8nWorkflow_type_idx" ON "N8nWorkflow"("type");
CREATE INDEX "N8nExecution_workflowId_idx" ON "N8nExecution"("workflowId");
CREATE INDEX "N8nExecution_status_idx" ON "N8nExecution"("status");
