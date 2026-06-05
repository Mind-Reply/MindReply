import { eq } from "drizzle-orm";
import { db, hasDatabaseUrl, usersTable } from "@/lib/db";
import { logMetric } from "@/lib/metrics";

export type MembershipTier = "curator" | "strategist" | "sovereign";

export type MembershipEntitlement = {
  tier: MembershipTier;
  name: string;
  creditsMonthly: number | "unlimited";
  toolAccess: "core" | "full" | "full-plus";
  lexiconAccess: "starter" | "all" | "custom";
  bookingPriority: "standard" | "priority" | "white-glove";
  dashboardAccess: "member" | "analytics" | "executive";
  supportLevel: string;
  deliveredProducts: string[];
};

export type FulfillmentInput = {
  tier: unknown;
  email?: string | null;
  name?: string | null;
  source: "checkout_session" | "stripe_webhook" | "manual_admin";
  stripeCustomerId?: string | null;
  stripeSessionId?: string | null;
  stripeSubscriptionId?: string | null;
};

export type FulfillmentResult = {
  entitlement: MembershipEntitlement;
  persisted: boolean;
  reason?: "database_not_configured" | "missing_email" | "database_error";
};

const entitlements: Record<MembershipTier, MembershipEntitlement> = {
  curator: {
    tier: "curator",
    name: "Curator",
    creditsMonthly: 50,
    toolAccess: "core",
    lexiconAccess: "starter",
    bookingPriority: "standard",
    dashboardAccess: "member",
    supportLevel: "Standard member support",
    deliveredProducts: [
      "Text Refiner",
      "Email Polisher",
      "Tone Adjuster",
      "Starter professional lexicons",
      "Member dashboard",
    ],
  },
  strategist: {
    tier: "strategist",
    name: "Strategist",
    creditsMonthly: "unlimited",
    toolAccess: "full",
    lexiconAccess: "all",
    bookingPriority: "priority",
    dashboardAccess: "analytics",
    supportLevel: "Priority support and specialist matching",
    deliveredProducts: [
      "Full micro-tool suite",
      "All professional lexicons",
      "Behavioral analytics dashboard",
      "Priority professional booking",
      "MRagent intelligence workspace",
    ],
  },
  sovereign: {
    tier: "sovereign",
    name: "Sovereign",
    creditsMonthly: "unlimited",
    toolAccess: "full-plus",
    lexiconAccess: "custom",
    bookingPriority: "white-glove",
    dashboardAccess: "executive",
    supportLevel: "Executive operator desk and custom language architecture",
    deliveredProducts: [
      "Everything in Strategist",
      "Custom professional lexicon path",
      "Executive communication architecture",
      "White-glove booking priority",
      "Operator-led growth and intelligence review",
    ],
  },
};

export function normalizeMembershipTier(value: unknown): MembershipTier {
  const tier = String(value ?? "").toLowerCase();
  if (tier === "curator" || tier === "strategist" || tier === "sovereign") return tier;
  return "strategist";
}

export function getMembershipEntitlement(value: unknown): MembershipEntitlement {
  return entitlements[normalizeMembershipTier(value)];
}

function displayNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "MindReply Member";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "MindReply Member";
}

function emailDomain(email: string) {
  return email.split("@")[1]?.toLowerCase() ?? "unknown";
}

export async function fulfillMembershipPurchase(input: FulfillmentInput): Promise<FulfillmentResult> {
  const entitlement = getMembershipEntitlement(input.tier);
  const email = input.email?.trim().toLowerCase();

  if (!email) {
    return { entitlement, persisted: false, reason: "missing_email" };
  }

  if (!hasDatabaseUrl()) {
    return { entitlement, persisted: false, reason: "database_not_configured" };
  }

  try {
    const name = input.name?.trim() || displayNameFromEmail(email);
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

    if (existing[0]) {
      await db.update(usersTable)
        .set({ name, membershipTier: entitlement.tier })
        .where(eq(usersTable.email, email));
    } else {
      await db.insert(usersTable).values({
        name,
        email,
        membershipTier: entitlement.tier,
      });
    }

    await logMetric({
      eventName: "membership.fulfilled",
      eventValue: {
        tier: entitlement.tier,
        source: input.source,
        emailDomain: emailDomain(email),
        stripeCustomerId: input.stripeCustomerId ?? null,
        stripeSessionId: input.stripeSessionId ?? null,
        stripeSubscriptionId: input.stripeSubscriptionId ?? null,
      },
    });

    return { entitlement, persisted: true };
  } catch (error) {
    console.warn("Membership fulfillment skipped:", error);
    return { entitlement, persisted: false, reason: "database_error" };
  }
}
