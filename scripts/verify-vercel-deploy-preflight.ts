import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const scriptPath = join(process.cwd(), "scripts", "vercel-deploy-preflight.ts");
const baseEnv = {
  ...process.env,
  CI: "true",
  VERCEL_TOKEN: "test-token",
  VERCEL_ORG_ID: "team_0plIJmQLgZC1wVv9zI2eVf3B",
  VERCEL_PROJECT_ID: "prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3",
};

function makeProject(projectName: string, projectId: string) {
  const dir = join(tmpdir(), `mindreply-preflight-${projectName}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(join(dir, ".vercel"), { recursive: true });
  writeFileSync(
    join(dir, ".vercel", "project.json"),
    `${JSON.stringify({ projectId, orgId: "team_0plIJmQLgZC1wVv9zI2eVf3B", projectName })}\n`,
  );
  return dir;
}

function run(cwd: string, env = baseEnv) {
  return spawnSync(process.execPath, [scriptPath], {
    cwd,
    encoding: "utf-8",
    env,
  });
}

const goodDir = makeProject("mindreply", "prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3");
const wrongNameDir = makeProject("mindreply-launch-evidence", "prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3");
const wrongIdDir = makeProject("mindreply", "prj_wrong");

try {
  const good = run(goodDir);
  if (good.status !== 0 || !good.stdout.includes("Vercel deploy preflight passed.")) {
    console.error("Expected matching Vercel deploy binding to pass.");
    console.error(good.stdout);
    console.error(good.stderr);
    process.exit(1);
  }

  const manualCliAuth = run(goodDir, {
    ...process.env,
    CI: "false",
    VERCEL_TOKEN: "",
    VERCEL_ORG_ID: "",
    VERCEL_PROJECT_ID: "",
  });
  if (manualCliAuth.status !== 0 || !manualCliAuth.stdout.includes("Vercel deploy preflight passed.")) {
    console.error("Expected manual CLI-authenticated deploy binding check to pass without Vercel env vars.");
    console.error(manualCliAuth.stdout);
    console.error(manualCliAuth.stderr);
    process.exit(1);
  }

  const wrongName = run(wrongNameDir);
  if (wrongName.status === 0 || !wrongName.stderr.includes("Linked Vercel project name must be mindreply")) {
    console.error("Expected wrong Vercel project name to fail clearly.");
    console.error(wrongName.stdout);
    console.error(wrongName.stderr);
    process.exit(1);
  }

  const wrongId = run(wrongIdDir);
  if (wrongId.status === 0 || !wrongId.stderr.includes("Linked Vercel project id must be prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3")) {
    console.error("Expected wrong Vercel project id to fail clearly.");
    console.error(wrongId.stdout);
    console.error(wrongId.stderr);
    process.exit(1);
  }
} finally {
  for (const dir of [goodDir, wrongNameDir, wrongIdDir]) rmSync(dir, { recursive: true, force: true });
}

console.log("Vercel deploy preflight verifier passed.");
