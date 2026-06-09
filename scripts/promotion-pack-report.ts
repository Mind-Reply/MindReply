export {};

const lanes = [
  "Positioning spine",
  "Homepage line",
  "MRagent line",
  "Personal Pack line",
  "Privacy trust line",
  "Founder post",
  "Operator post",
  "Sales reply angle",
  "Support escalation angle",
  "LinkedIn draft",
  "X short draft",
  "Email announcement",
  "Website CTA",
  "Figma asset queue",
  "Remotion spot",
  "Screenshot queue",
  "Demo script",
  "Case narrative",
  "Launch blocker watch",
  "Domain readiness",
  "Vercel readiness",
  "Analytics readiness",
  "Conversion event readiness",
  "Revenue truth",
  "Audience reply tracker",
  "Ad copy bank",
  "Distribution permission check",
  "Next move",
];

const copyBank = [
  "Read the pressure. Move with grace. Keep the receipt narrow.",
  "For the charged second before your tone becomes the story.",
  "The pack does not perform. It reports.",
  "Pressure is not a souvenir.",
];

function reportMarkdown() {
  const now = new Date().toISOString();
  return [
    "# MindReply Promotion Pack",
    "",
    `Generated: ${now}`,
    "Mode: preparation and reporting only",
    "",
    "## Guardrail",
    "- This pack prepares positioning and tracks readiness.",
    "- It does not post to social, run ads, scrape audiences, or send campaigns unless a real approved account/API is connected.",
    "- It does not claim revenue, conversions, or audience response without a real source.",
    "",
    "## 28-lane promotion team",
    ...lanes.map((lane, index) => `- ${String(index + 1).padStart(2, "0")} ${lane}: prepared for review; requires connected channel before external send.`),
    "",
    "## Copy bank",
    ...copyBank.map((line) => `- ${line}`),
    "",
    "## Next allowed moves",
    "- Prepare channel-specific drafts inside the repo.",
    "- Connect approved social/ad accounts before sending externally.",
    "- Keep all promotion truthful: no fake metrics, no fake urgency, no hidden posting.",
  ].join("\n");
}

console.log(reportMarkdown());
