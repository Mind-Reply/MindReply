import { CHECK_PATH, reportSettings, writeJson } from "./report-shared.mjs";

const settings = reportSettings();
const payload = {
  ...settings,
  required_owners: ["angellllkr@gmail.com", "info@mind-reply.com"],
  required_channels: ["email", "slack"],
  revenue_rule: "Website Completion Package first",
  security_boundary: "private redacted owner evidence only",
};

writeJson(CHECK_PATH, payload);
console.log(`Owner report check: ${payload.status}`);
if (payload.blockers.length > 0) {
  console.log(`Blocked: ${payload.blockers.join("; ")}`);
}
