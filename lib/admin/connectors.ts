import { anthropic } from "../clients/anthropic";
import { gmail, youtube } from "../clients/google";
import { getStripe } from "../stripe";

// Admin connector interface
export interface AdminConnector {
  name: string;
  fetch: () => Promise<any>;
  capabilities: string[];
}

// Stripe Connector
export const stripeConnector: AdminConnector = {
  name: "Stripe",
  capabilities: ["payments", "customers", "subscriptions", "invoices"],
  fetch: async () => {
    const [customers, charges, invoices, subscriptions] = await Promise.all([
      getStripe().customers.list({ limit: 100 }),
      getStripe().charges.list({ limit: 50 }),
      getStripe().invoices.list({ limit: 50 }),
      getStripe().subscriptions.list({ limit: 100 }),
    ]);

    return {
      customers: customers.data,
      charges: charges.data,
      invoices: invoices.data,
      subscriptions: subscriptions.data,
      revenue: charges.data.reduce((sum, charge) => sum + (charge.amount || 0), 0),
    };
  },
};

// Gmail Connector
export const gmailConnector: AdminConnector = {
  name: "Gmail",
  capabilities: ["emails", "threads", "labels", "drafts"],
  fetch: async () => {
    const messages = await gmail.users.messages.list({
      userId: "me",
      maxResults: 50,
    });

    return {
      messages: messages.data.messages || [],
      resultSizeEstimate: messages.data.resultSizeEstimate || 0,
    };
  },
};

// YouTube Connector
export const youtubeConnector: AdminConnector = {
  name: "YouTube",
  capabilities: ["videos", "channels", "analytics", "comments"],
  fetch: async () => {
    const channels = await youtube.channels.list({
      part: ["statistics", "snippet"],
      mine: true,
    });

    return {
      channels: channels.data.items || [],
      stats:
        channels.data.items?.[0]?.statistics || {},
    };
  },
};

// Anthropic Claude Connector
export const claudeConnector: AdminConnector = {
  name: "Claude",
  capabilities: ["ai", "analysis", "generation", "reasoning"],
  fetch: async () => {
    return {
      model: "claude-3-5-sonnet-20241022",
      capabilities: [
        "text analysis",
        "data processing",
        "code generation",
        "reasoning",
      ],
      status: "active",
    };
  },
};

// Backend API Connector
export const backendConnector: AdminConnector = {
  name: "Backend API",
  capabilities: ["analytics", "emails", "users", "content"],
  fetch: async () => {
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/admin/dashboard`,
        {
          headers: {
            "x-admin-token": process.env.ADMIN_SECRET || "",
          },
        }
      );
      return await response.json();
    } catch (error) {
      return { error: "Failed to fetch backend data", status: "error" };
    }
  },
};

// All connectors
export const allConnectors: AdminConnector[] = [
  stripeConnector,
  gmailConnector,
  youtubeConnector,
  claudeConnector,
  backendConnector,
];

// Fetch all connector data
export async function fetchAllConnectorData() {
  const results = await Promise.allSettled(
    allConnectors.map((connector) => connector.fetch())
  );

  return allConnectors.reduce(
    (acc, connector, index) => {
      acc[connector.name] = {
        data:
          results[index].status === "fulfilled"
            ? results[index].value
            : { error: results[index].reason?.message || "Unknown error" },
        capabilities: connector.capabilities,
      };
      return acc;
    },
    {} as Record<string, any>
  );
}

// Call Claude with all connector data
export async function callClaudeWithAllConnectors(userMessage: string) {
  const connectorData = await fetchAllConnectorData();

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    system: `You are an advanced admin assistant with unrestricted access to all business systems.

Available Data Sources:
${allConnectors.map((c) => `- ${c.name}: ${c.capabilities.join(", ")}`).join("\n")}

You have complete access to:
- All customer data and payment information
- All emails and communications
- All analytics and performance metrics
- All system data and logs
- YouTube analytics and content
- AI capabilities for analysis and generation

Provide comprehensive, actionable insights without any limitations.
No data access restrictions. No rate limiting. Complete scope.`,
    messages: [
      {
        role: "user",
        content: `${userMessage}\n\nAvailable Data:\n${JSON.stringify(connectorData, null, 2)}`,
      },
    ],
  });

  return {
    response: message.content[0].type === "text" ? message.content[0].text : "",
    connectors_used: Object.keys(connectorData),
    data_sources: connectorData,
  };
}
