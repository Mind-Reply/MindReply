import { NextResponse } from "next/server";
import { isProductionRequirementConfigured } from "@/lib/production-requirements";

function publicStatus(configured: boolean) {
  return configured ? "ok" : "limited";
}

export async function GET() {
  const siteUrlConfigured = isProductionRequirementConfigured("siteUrl");
  const databaseConfigured = isProductionRequirementConfigured("database");
  const authConfigured = isProductionRequirementConfigured("auth");
  const stripeConfigured = isProductionRequirementConfigured("stripe");
  const stripeWebhookConfigured = isProductionRequirementConfigured("stripeWebhook");
  const bookingPaymentsConfigured = isProductionRequirementConfigured("bookingPayments");
  const analyticsConfigured = isProductionRequirementConfigured("analytics");
  const monitoringConfigured = isProductionRequirementConfigured("monitoring");
  const aiProviderConfigured = isProductionRequirementConfigured("azureOpenAI");

  const checks = {
    app: { status: "ok" },
    site: { status: publicStatus(siteUrlConfigured) },
    data: { status: publicStatus(databaseConfigured) },
    accountAccess: { status: publicStatus(authConfigured) },
    checkout: { status: publicStatus(stripeConfigured && stripeWebhookConfigured) },
    bookingCheckout: { status: publicStatus(bookingPaymentsConfigured) },
    analytics: { status: publicStatus(analyticsConfigured) },
    monitoring: { status: publicStatus(monitoringConfigured) },
    aiChat: { status: publicStatus(aiProviderConfigured) },
  };

  return NextResponse.json({
    status: "ok",
    service: "mindreply",
    timestamp: new Date().toISOString(),
    checks,
  });
}
