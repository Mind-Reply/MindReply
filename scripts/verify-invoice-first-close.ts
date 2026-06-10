import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function read(path: string) {
  const fullPath = join(process.cwd(), path);
  assert(existsSync(fullPath), `${path} must exist.`);
  return readFileSync(fullPath, "utf-8");
}

function includes(label: string, value: string, expected: string) {
  assert(value.includes(expected), `${label} must include: ${expected}`);
}

const env = read(".env");
const packageRequest = read("lib/package-request.ts");
const packageForm = read("components/PackageRequestForm.tsx");
const packageRoute = read("app/api/package-request/route.ts");
const contact = read("app/contact/page.tsx");
const pricing = read("app/pricing/page.tsx");
const packagePage = read("app/website-completion-package/page.tsx");

for (const expected of [
  "NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL=",
  "MINDREPLY_PACKAGE_REQUEST_TO=",
  "MINDREPLY_PACKAGE_REQUEST_FROM=",
  "MINDREPLY_PACKAGE_REQUEST_DRY_RUN=false",
  "MINDREPLY_REPORT_EMAIL=",
  "MINDREPLY_REPORT_FROM=",
  "RESEND_API_KEY=",
  "MINDREPLY_SLACK_WEBHOOK_URL=",
  "SLACK_WEBHOOK_URL=",
]) {
  includes("env", env, expected);
}

for (const expected of [
  "Invoice-first route",
  "billing name and billing email",
  "billingName",
  "billingEmail",
  "billingEmailHash",
  "Billing name is required for invoice-first package requests.",
  "A valid billing email is required for invoice-first package requests.",
  "configured payment link",
  "send the invoice request before delivery",
  "Website Completion Package request: GBP 600 once",
]) {
  includes("package request library", packageRequest, expected);
}

for (const expected of [
  "Invoice-first route",
  "No payment link is required to submit",
  "Billing name",
  "Billing email",
  "Billing captured",
  "billingEmailHash",
  "billingIntents",
  "configured payment link before delivery",
  "Payment path:",
]) {
  includes("package request form", packageForm, expected);
}

for (const expected of [
  "next close-ready invoice or payment route",
  "billing name, billing email",
  "fallback-required",
]) {
  includes("package request route", packageRoute, expected);
}

const publicSurface = [contact, pricing, packagePage, packageForm, packageRoute].join("\n");
assert(!/ANGELLLKR@GMAIL\.COM|angelllkr@gmail\.com/i.test(publicSurface), "invoice-first close surface must not expose personal Gmail.");

console.log("Invoice-first close route verification passed.");
