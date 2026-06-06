import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { productionRequirements } from "../lib/production-requirements";

const fileArg = process.argv.find((arg) => arg.startsWith("--file="));
const envFile = fileArg ? fileArg.slice("--file=".length) : process.env.ENV_FILE;
const sourceLabel = envFile ? resolve(envFile) : "process.env";
const expectedSiteUrl = (process.env.EXPECTED_SITE_URL || "https://www.mind-reply.com").replace(/\/$/, "").toLowerCase();

function parseEnvFile(path: string) {
  const resolved = resolve(path);
  if (!existsSync(resolved)) {
    throw new Error(`Env file not found: ${resolved}`);
  }

  const values: Record<string, string> = {};
  const lines = readFileSync(resolved, "utf8").split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const equalsAt = line.indexOf("=");
    if (equalsAt <= 0) continue;

    const key = line.slice(0, equalsAt).trim();
    const rawValue = line.slice(equalsAt + 1).trim();
    values[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }

  return values;
}

function loadValues() {
  if (envFile) return parseEnvFile(envFile);
  return Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );
}

function isPlaceholder(value: string) {
  const normalized = value.trim().toLowerCase();
  return !normalized
    || normalized === "..."
    || normalized === "changeme"
    || normalized === "change_me"
    || normalized === "todo"
    || normalized === "placeholder"
    || normalized.includes("your_")
    || normalized.includes("example")
    || normalized.includes("password@host")
    || normalized.includes("user:password");
}

function hasUsableValue(values: Record<string, string>, key: string) {
  const value = values[key];
  if (typeof value !== "string" || isPlaceholder(value)) return false;
  if (key === "NEXT_PUBLIC_SITE_URL") {
    return value.replace(/\/$/, "").toLowerCase() === expectedSiteUrl;
  }
  return true;
}

function configuredGroup(values: Record<string, string>, group: string[]) {
  return group.every((key) => hasUsableValue(values, key));
}

function requiredGroups(requirement: typeof productionRequirements[number]) {
  return requirement.alternativeKeyGroups?.length ? requirement.alternativeKeyGroups : [requirement.keys];
}

function safeKeys(group: string[]) {
  return group.join(", ");
}

function main() {
  let values: Record<string, string>;
  try {
    values = loadValues();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }

  const failures: string[] = [];

  console.log(`MindReply provider env verification from ${sourceLabel}`);
  console.log(`Expected site URL: ${expectedSiteUrl}`);
  for (const requirement of productionRequirements) {
    const groups = requiredGroups(requirement);
    const configured = groups.some((group) => configuredGroup(values, group));
    const marker = configured ? "configured" : "missing";
    console.log(`${marker}: ${requirement.service}`);

    if (!configured) {
      failures.push(requirement.service);
      console.log(`  needs one of: ${groups.map(safeKeys).join(" OR ")}`);
    }
  }

  if (failures.length > 0) {
    console.error("");
    console.error(`Provider env verification failed for ${failures.length} service group(s).`);
    console.error("No values were printed. Add missing values in Vercel or a local .env.*.local file, then rerun this check.");
    process.exitCode = 1;
    return;
  }

  console.log("");
  console.log("Provider env verification passed. No secret values were printed.");
}

main();

export {};
