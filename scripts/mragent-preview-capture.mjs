import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const targetUrl = process.env.MRAGENT_PREVIEW_URL || "https://www.mind-reply.com/agent";
const outputDir = process.env.MRAGENT_PREVIEW_DIR || "mragent-preview-results";
const sampleInput = "I need to answer a client who says the price is too high, but I do not want to sound defensive.";
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

mkdirSync(outputDir, { recursive: true });

function includesAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

async function captureViewport(browser, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  const screenshotPath = `${outputDir}/agent-${viewport.name}.png`;
  const checks = {
    pageLoaded: false,
    sessionHeaderVisible: false,
    composerVisible: false,
    sendControlVisible: false,
    stagedReadingVisible: false,
    mindReadVisible: false,
    actionVisible: false,
    receiptVisible: false,
    riskVisible: false,
    noGenericPositioning: false,
    noClinicalClaims: false,
  };

  try {
    await page.goto(targetUrl, { waitUntil: "networkidle", timeout: 45000 });
    const initialText = await page.locator("body").innerText({ timeout: 10000 });
    checks.pageLoaded = /MRagent|MindReply|Mind Read/i.test(initialText);
    checks.sessionHeaderVisible = /MRagent session/i.test(initialText);
    checks.composerVisible = await page.locator("textarea").isVisible().catch(() => false);
    checks.sendControlVisible = await page.locator('button[aria-label="Send to MRagent"]').isVisible().catch(() => false);
    checks.noGenericPositioning = !includesAny(initialText, [/generic helper/i, /productivity/i, /chatbot/i]);
    checks.noClinicalClaims = !includesAny(initialText, [/therapy/i, /diagnose/i, /clinical/i]);

    if (checks.composerVisible && checks.sendControlVisible) {
      await page.locator("textarea").fill(sampleInput);
      await page.locator('button[aria-label="Send to MRagent"]').click();
      await page.getByText(/listening under the words|finding the emotional weather|checking the risk gate|choosing one clean move/i).waitFor({ timeout: 5000 }).catch(() => null);
      checks.stagedReadingVisible = await page.getByText(/listening under the words|finding the emotional weather|checking the risk gate|choosing one clean move/i).isVisible().catch(() => false);
      await page.waitForTimeout(4500);
    }

    const finalText = await page.locator("body").innerText({ timeout: 10000 });
    checks.mindReadVisible = /Feeling|Protection|Mind Read/i.test(finalText);
    checks.actionVisible = /Move|Send the warm clear reply|Set one quiet follow-up|Hold it for review|Mark it resolved/i.test(finalText);
    checks.receiptVisible = /Receipt|mr-/i.test(finalText);
    checks.riskVisible = /risk/i.test(finalText);
    await page.screenshot({ path: screenshotPath, fullPage: true });
  } finally {
    await page.close();
  }

  const passed = Object.values(checks).every(Boolean);
  return { ...viewport, screenshotPath, passed, checks };
}

const browser = await chromium.launch({ headless: true });
const capturedAt = new Date().toISOString();
const results = [];
try {
  for (const viewport of viewports) {
    results.push(await captureViewport(browser, viewport));
  }
} finally {
  await browser.close();
}

const summary = {
  capturedAt,
  targetUrl,
  commitSha: process.env.GITHUB_SHA || null,
  runUrl: process.env.GITHUB_RUN_ID && process.env.GITHUB_REPOSITORY ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : null,
  status: results.every((result) => result.passed) ? "passed" : "needs_review",
  results,
};

writeFileSync(`${outputDir}/preview-results.json`, `${JSON.stringify(summary, null, 2)}\n`, "utf-8");
console.log(`# MRagent preview capture`);
console.log("");
console.log(`Target: ${targetUrl}`);
console.log(`Status: ${summary.status}`);
for (const result of results) {
  console.log(`- ${result.name} ${result.width}x${result.height}: ${result.passed ? "passed" : "needs review"} (${result.screenshotPath})`);
}

if (summary.status !== "passed") {
  process.exitCode = 1;
}
