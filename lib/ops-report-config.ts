import { revenueOwnerEmail } from "@/lib/owner-auth";

export function getOpsReportRecipient() {
  return revenueOwnerEmail;
}

export function getOpsReportFrom() {
  return process.env.OPS_REPORT_FROM?.trim() || "";
}

export function isOpsReportingConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CRON_SECRET && process.env.REVENUE_OWNER_SECRET && getOpsReportFrom());
}
