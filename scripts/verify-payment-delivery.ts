import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function readProjectFile(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

const creditsSessionRoute = join(process.cwd(), "app/api/checkout/credits-session/route.ts");
const creditsRoute = readProjectFile("app/api/checkout/credits/route.ts");
const purchasePanel = readProjectFile("components/PurchaseSuccessPanel.tsx");

assert(existsSync(creditsSessionRoute), "Missing /api/checkout/credits-session verification route.");
assert(
  /metadata:\s*{\s*type:\s*"credits"[\s\S]*credits:\s*String\(pack\.credits\)/.test(creditsRoute),
  "Credit checkout sessions must include credits metadata for server verification.",
);
assert(
  /\/api\/checkout\/credits-session\?/.test(purchasePanel),
  "Dashboard must verify credit checkout sessions before activation.",
);
assert(
  !/const activeCredits\s*=\s*isCreditReturn\s*\|\|/.test(purchasePanel),
  "Credit return query params must not activate credits without confirmed Stripe verification.",
);
assert(
  /data\.confirmed[\s\S]*data\.credits/.test(purchasePanel),
  "Dashboard credit activation must require confirmed verification and returned credits.",
);

console.log("Payment delivery verification passed.");
