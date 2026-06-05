import { isSlackConfigured } from "@/lib/slack";

export type IntegrationKey = "slack" | "gmail" | "notion";

type IntegrationStatus = {
  key: IntegrationKey;
  name: string;
  status: "configured" | "fallback";
  requiredEnv: string[];
  revenueUse: string;
  connectPath: string;
  dependencyFrame: string;
};

export type IntegrationConnectAction = IntegrationStatus & {
  connectReady: boolean;
  connectUrl: string | null;
  missingConnectEnv: string[];
  setupMode: "oauth" | "webhook" | "fallback";
};

function hasAll(keys: string[]) {
  return keys.every((key) => Boolean(process.env[key]?.trim()));
}

export function getIntegrationStatuses(): IntegrationStatus[] {
  const gmailEnv = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"];
  const notionEnv = ["NOTION_CLIENT_ID", "NOTION_CLIENT_SECRET"];

  return [
    {
      key: "slack",
      name: "Slack",
      status: isSlackConfigured() ? "configured" : "fallback",
      requiredEnv: ["SLACK_WEBHOOK_URL"],
      revenueUse: "Team workflow penetration and multi-user dependency for Pro.",
      connectPath: "/api/integrations/connect/slack",
      dependencyFrame: "Move MindReply into team decisions so one user becomes a shared workflow.",
    },
    {
      key: "gmail",
      name: "Gmail",
      status: hasAll(gmailEnv) ? "configured" : "fallback",
      requiredEnv: gmailEnv,
      revenueUse: "Inbox takeover for daily founder and agency communication workflows.",
      connectPath: "/api/integrations/connect/gmail",
      dependencyFrame: "Turn daily email pressure into a repeat usage loop and upgrade trigger.",
    },
    {
      key: "notion",
      name: "Notion",
      status: hasAll(notionEnv) ? "configured" : "fallback",
      requiredEnv: notionEnv,
      revenueUse: "Knowledge and operations memory layer for long-term retention.",
      connectPath: "/api/integrations/connect/notion",
      dependencyFrame: "Make operating memory visible so Pro feels like the permanent brain.",
    },
  ];
}

export function areCoreIntegrationsConfigured() {
  return getIntegrationStatuses().every((integration) => integration.status === "configured");
}

function originFromRequest(origin?: string | null) {
  return (origin || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function redirectUri(key: IntegrationKey, origin?: string | null) {
  const envKey = key === "gmail" ? "GOOGLE_REDIRECT_URI" : key === "notion" ? "NOTION_REDIRECT_URI" : "SLACK_REDIRECT_URI";
  return process.env[envKey]?.trim() || `${originFromRequest(origin)}/api/integrations/callback/${key}`;
}

export function getIntegrationConnectAction(key: IntegrationKey, origin?: string | null): IntegrationConnectAction {
  const status = getIntegrationStatuses().find((integration) => integration.key === key);
  if (!status) {
    throw new Error(`Unknown integration: ${key}`);
  }

  if (key === "slack") {
    const installUrl = process.env.SLACK_APP_INSTALL_URL?.trim();
    const clientId = process.env.SLACK_CLIENT_ID?.trim();
    if (installUrl) {
      return { ...status, connectReady: true, connectUrl: installUrl, missingConnectEnv: [], setupMode: "oauth" };
    }
    if (clientId) {
      const url = new URL("https://slack.com/oauth/v2/authorize");
      url.searchParams.set("client_id", clientId);
      url.searchParams.set("scope", "incoming-webhook,chat:write");
      url.searchParams.set("user_scope", "");
      url.searchParams.set("redirect_uri", redirectUri("slack", origin));
      return { ...status, connectReady: true, connectUrl: url.toString(), missingConnectEnv: [], setupMode: "oauth" };
    }
    return {
      ...status,
      connectReady: isSlackConfigured(),
      connectUrl: null,
      missingConnectEnv: isSlackConfigured() ? [] : ["SLACK_WEBHOOK_URL or SLACK_APP_INSTALL_URL or SLACK_CLIENT_ID"],
      setupMode: isSlackConfigured() ? "webhook" : "fallback",
    };
  }

  if (key === "gmail") {
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const missing = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"].filter((env) => !process.env[env]?.trim());
    if (!clientId || missing.length) {
      return { ...status, connectReady: false, connectUrl: null, missingConnectEnv: missing, setupMode: "fallback" };
    }
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri("gmail", origin));
    url.searchParams.set("response_type", "code");
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent");
    url.searchParams.set("scope", [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.modify",
    ].join(" "));
    return { ...status, connectReady: true, connectUrl: url.toString(), missingConnectEnv: [], setupMode: "oauth" };
  }

  const clientId = process.env.NOTION_CLIENT_ID?.trim();
  const missing = ["NOTION_CLIENT_ID", "NOTION_CLIENT_SECRET"].filter((env) => !process.env[env]?.trim());
  if (!clientId || missing.length) {
    return { ...status, connectReady: false, connectUrl: null, missingConnectEnv: missing, setupMode: "fallback" };
  }
  const url = new URL("https://api.notion.com/v1/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri("notion", origin));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("owner", "user");
  return { ...status, connectReady: true, connectUrl: url.toString(), missingConnectEnv: [], setupMode: "oauth" };
}

export function getIntegrationConnectActions(origin?: string | null) {
  return getIntegrationStatuses().map((integration) => getIntegrationConnectAction(integration.key, origin));
}
