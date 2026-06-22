-- Admin schema migration

CREATE TABLE "AdminSession" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "adminEmail" TEXT NOT NULL UNIQUE,
  "adminPasswordHash" TEXT NOT NULL,
  "jwtSecret" TEXT NOT NULL UNIQUE,
  "ipWhitelist" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "lastLogin" TIMESTAMP(3),
  "loginAttempts" INTEGER NOT NULL DEFAULT 0,
  "locked" BOOLEAN NOT NULL DEFAULT false,
  "lockUntil" TIMESTAMP(3),
  "settings" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "AdminChatSession" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "adminSessionId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "model" TEXT NOT NULL DEFAULT 'gpt-4-turbo',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("adminSessionId") REFERENCES "AdminSession" ("id") ON DELETE CASCADE
);

CREATE TABLE "AdminChatMessage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "chatSessionId" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "tokensUsed" INTEGER NOT NULL DEFAULT 0,
  "model" TEXT,
  "thinking" TEXT,
  "connectorsUsed" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("chatSessionId") REFERENCES "AdminChatSession" ("id") ON DELETE CASCADE
);

CREATE TABLE "AdminChatConnector" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "type" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "credentials" TEXT NOT NULL,
  "lastSync" TIMESTAMP(3),
  "nextSync" TIMESTAMP(3),
  "requestsThisHour" INTEGER NOT NULL DEFAULT 0,
  "rateLimitMax" INTEGER NOT NULL DEFAULT 100,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  UNIQUE("type", "name")
);

CREATE TABLE "AdminAuditLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "action" TEXT NOT NULL,
  "adminEmail" TEXT NOT NULL,
  "details" JSONB NOT NULL,
  "ipAddress" TEXT NOT NULL,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "AdminChatSession_adminSessionId_idx" ON "AdminChatSession"("adminSessionId");
CREATE INDEX "AdminChatMessage_chatSessionId_idx" ON "AdminChatMessage"("chatSessionId");
CREATE INDEX "AdminChatMessage_createdAt_idx" ON "AdminChatMessage"("createdAt");
CREATE INDEX "AdminAuditLog_adminEmail_idx" ON "AdminAuditLog"("adminEmail");
CREATE INDEX "AdminAuditLog_action_idx" ON "AdminAuditLog"("action");
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");
