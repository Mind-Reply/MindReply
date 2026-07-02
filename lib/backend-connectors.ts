import { Pool } from "pg";
import { anthropic } from "./clients/anthropic";
import { gmail, youtube } from "./clients/google";
import { getStripe } from "./stripe";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ============================================
// STRIPE CONNECTOR - FULL INTEGRATION
// ============================================
export async function getStripeData() {
  try {
    const [customers, charges, invoices, subscriptions, payouts] =
      await Promise.all([
        getStripe().customers.list({ limit: 100 }),
        getStripe().charges.list({ limit: 100 }),
        getStripe().invoices.list({ limit: 100 }),
        getStripe().subscriptions.list({ limit: 100 }),
        getStripe().payouts.list({ limit: 50 }),
      ]);

    const totalRevenue = charges.data.reduce((sum, charge) => {
      return sum + (charge.paid ? charge.amount : 0);
    }, 0);

    const activeCustomers = customers.data.filter(
      (c) => c.subscriptions?.data?.length! > 0
    ).length;

    const recurringRevenue = subscriptions.data.reduce((sum, sub) => {
      const price =
        typeof sub.items.data[0].price.unit_amount === "number"
          ? sub.items.data[0].price.unit_amount
          : 0;
      return sum + price;
    }, 0);

    return {
      status: "connected",
      metrics: {
        totalRevenue: totalRevenue / 100,
        monthlyRecurringRevenue: recurringRevenue / 100,
        totalCustomers: customers.data.length,
        activeCustomers,
        totalCharges: charges.data.length,
        totalSubscriptions: subscriptions.data.length,
        averageOrderValue:
          charges.data.length > 0 ? totalRevenue / charges.data.length / 100 : 0,
        payouts: payouts.data.length,
      },
      data: {
        topCustomers: customers.data.slice(0, 5),
        recentCharges: charges.data.slice(0, 10),
        activeSubscriptions: subscriptions.data.slice(0, 10),
      },
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Stripe error:", error);
    return { status: "error", error: String(error) };
  }
}

// ============================================
// GMAIL CONNECTOR - FULL INTEGRATION
// ============================================
export async function getGmailData() {
  try {
    const [unreadMessages, allMessages, threads] = await Promise.all([
      gmail.users.messages.list({
        userId: "me",
        q: "is:unread",
        maxResults: 100,
      }),
      gmail.users.messages.list({
        userId: "me",
        maxResults: 100,
      }),
      gmail.users.threads.list({
        userId: "me",
        maxResults: 50,
      }),
    ]);

    const labels = await gmail.users.labels.list({ userId: "me" });

    // Get message details for recent emails
    const recentMessageIds = allMessages.data.messages?.slice(0, 5) || [];
    const recentMessages = await Promise.all(
      recentMessageIds.map((msg) =>
        gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
        })
      )
    );

    return {
      status: "connected",
      metrics: {
        unreadCount: unreadMessages.data.resultSizeEstimate || 0,
        totalEmails: allMessages.data.resultSizeEstimate || 0,
        totalThreads: threads.data.resultSizeEstimate || 0,
        totalLabels: labels.data.labels?.length || 0,
      },
      data: {
        unreadEmails: unreadMessages.data.messages || [],
        recentEmails: recentMessages,
        threads: threads.data.threads || [],
        labels: labels.data.labels || [],
      },
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Gmail error:", error);
    return { status: "error", error: String(error) };
  }
}

// ============================================
// YOUTUBE CONNECTOR - FULL INTEGRATION
// ============================================
export async function getYoutubeData() {
  try {
    const [channels, videos, analytics] = await Promise.all([
      youtube.channels.list({
        part: ["statistics", "snippet", "contentDetails"],
        mine: true,
      }),
      youtube.search.list({
        part: ["snippet"],
        forMine: true,
        maxResults: 50,
        type: "video",
      }),
      youtube.analytics.reports.query({
        ids: "channel==MINE",
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        metrics: "views,estimatedMinutesWatched,subscribersGained",
      }),
    ]);

    const channel = channels.data.items?.[0];
    const stats = channel?.statistics;

    return {
      status: "connected",
      metrics: {
        subscribers: parseInt(stats?.subscriberCount || "0"),
        views: parseInt(stats?.viewCount || "0"),
        videos: parseInt(stats?.videoCount || "0"),
        watchMinutes: analytics.data.rows?.[0]?.[1] || 0,
        engagement: analytics.data.rows?.[0]?.[2] || 0,
      },
      data: {
        channel: {
          title: channel?.snippet?.title,
          description: channel?.snippet?.description,
          thumbnail: channel?.snippet?.thumbnails,
        },
        videos: videos.data.items || [],
        analytics: analytics.data.rows || [],
      },
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("YouTube error:", error);
    return { status: "error", error: String(error) };
  }
}

// ============================================
// CLAUDE AI CONNECTOR - FULL INTEGRATION
// ============================================
export async function processWithClaude(message: string, context: any) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      system: `You are an advanced business intelligence assistant with access to:
- Stripe payment data (revenue, customers, subscriptions)
- Gmail communications (emails, threads)
- YouTube analytics (subscribers, views, watch time)
- Database records (users, transactions)
- Real-time metrics

Provide detailed, actionable insights. You have no limitations on data scope.`,
      messages: [
        {
          role: "user",
          content: `${message}\n\nAvailable context:\n${JSON.stringify(context, null, 2)}`,
        },
      ],
    });

    return {
      status: "connected",
      response: response.content[0].type === "text" ? response.content[0].text : "",
      tokensUsed: response.usage,
      model: "claude-3-5-sonnet",
    };
  } catch (error) {
    console.error("Claude error:", error);
    return { status: "error", error: String(error) };
  }
}

// ============================================
// DATABASE CONNECTOR - FULL INTEGRATION
// ============================================
export async function getDatabaseMetrics() {
  try {
    const userStats = await db.query(
      "SELECT COUNT(*) as total, COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_30d FROM users"
    );

    const transactionStats = await db.query(
      "SELECT COUNT(*) as total, SUM(amount) as total_amount FROM transactions WHERE status='completed'"
    );

    return {
      status: "connected",
      metrics: {
        totalUsers: userStats.rows[0]?.total || 0,
        newUsersMonth: userStats.rows[0]?.new_30d || 0,
        totalTransactions: transactionStats.rows[0]?.total || 0,
        totalRevenue: parseFloat(transactionStats.rows[0]?.total_amount || 0),
      },
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Database error:", error);
    return { status: "error", error: String(error) };
  }
}

// ============================================
// UNIFIED API - ALL CONNECTORS COMBINED
// ============================================
export async function getAllData() {
  const [stripe, gmail, youtube, claude, db_metrics] = await Promise.all([
    getStripeData(),
    getGmailData(),
    getYoutubeData(),
    processWithClaude("Provide a business overview", {}),
    getDatabaseMetrics(),
  ]);

  return {
    status: "all_connected",
    timestamp: new Date().toISOString(),
    connectors: {
      stripe,
      gmail,
      youtube,
      claude,
      database: db_metrics,
    },
    summary: {
      stripeConnected: stripe.status === "connected",
      gmailConnected: gmail.status === "connected",
      youtubeConnected: youtube.status === "connected",
      claudeConnected: claude.status === "connected",
      databaseConnected: db_metrics.status === "connected",
    },
  };
}
