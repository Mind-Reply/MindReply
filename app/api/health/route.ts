import { NextResponse } from "next/server";
import { isProductionRequirementConfigured } from "@/lib/production-requirements";

function checkStatus(configured: boolean) {
  return configured ? "configured" : "not_configured";
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
    siteUrl: { status: checkStatus(siteUrlConfigured) },
    database: { status: checkStatus(databaseConfigured) },
    auth: { status: checkStatus(authConfigured) },
    payments: { status: checkStatus(stripeConfigured && stripeWebhookConfigured) },
    bookingPayments: { status: checkStatus(bookingPaymentsConfigured) },
    analytics: { status: checkStatus(analyticsConfigured) },
    monitoring: { status: checkStatus(monitoringConfigured) },
    aiProvider: { status: checkStatus(aiProviderConfigured) },
  };

  return NextResponse.json({
    status: "ok",
    service: "mindreply",
    timestamp: new Date().toISOString(),
    checks,
  });
}
