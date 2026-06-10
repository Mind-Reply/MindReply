import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

type ProjectLink = {
  projectId?: string;
  orgId?: string;
  projectName?: string;
};

const root = process.cwd();
const projectPath = join(root, ".vercel", "project.json");
const expectedProjectName = process.env.MINDREPLY_VERCEL_PROJECT_NAME || "mindreply";
const expectedProjectId = process.env.MINDREPLY_VERCEL_PROJECT_ID || "prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3";
const failures: string[] = [];

function env(name: string) {
  return process.env[name]?.trim() ?? "";
}

function readProjectLink(): ProjectLink {
  if (!existsSync(projectPath)) {
    failures.push(".vercel/project.json is missing; copy the real mindreply project binding before deploying.");
    return {};
  }

  try {
    return JSON.parse(readFileSync(projectPath, "utf-8")) as ProjectLink;
  } catch {
    failures.push(".vercel/project.json is not valid JSON.");
    return {};
  }
}

const linkedProject = readProjectLink();
const token = env("VERCEL_TOKEN");
const orgId = env("VERCEL_ORG_ID");
const projectId = env("VERCEL_PROJECT_ID");
const requireEnvCredentials = env("CI") === "true" || env("MINDREPLY_REQUIRE_VERCEL_ENV") === "true";

if (linkedProject.projectName && linkedProject.projectName !== expectedProjectName) {
  failures.push(`Linked Vercel project name must be ${expectedProjectName}, found ${linkedProject.projectName}.`);
}

if (linkedProject.projectId && linkedProject.projectId !== expectedProjectId) {
  failures.push(`Linked Vercel project id must be ${expectedProjectId}, found ${linkedProject.projectId}.`);
}

if (requireEnvCredentials && !token) failures.push("VERCEL_TOKEN is missing.");
if (requireEnvCredentials && !orgId) failures.push("VERCEL_ORG_ID is missing.");
if (requireEnvCredentials && !projectId) failures.push("VERCEL_PROJECT_ID is missing.");

if (orgId && linkedProject.orgId && orgId !== linkedProject.orgId) {
  failures.push(`VERCEL_ORG_ID does not match linked project org ${linkedProject.orgId}.`);
}

if (projectId && linkedProject.projectId && projectId !== linkedProject.projectId) {
  failures.push(`VERCEL_PROJECT_ID does not match linked project ${linkedProject.projectId}.`);
}

if (failures.length) {
  console.error("Vercel deploy preflight failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Vercel deploy preflight passed.");
console.log(`Project: ${linkedProject.projectName ?? "unknown"} (${linkedProject.projectId})`);
console.log(`Team: ${linkedProject.orgId}`);
