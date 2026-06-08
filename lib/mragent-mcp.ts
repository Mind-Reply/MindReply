import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { fetchStoredReceipt, prepareMindRead, type MRAgentPreparation } from "./mragent";
import type { IntakeSource } from "./decision-layer";

export const MRAGENT_WIDGET_URI = "ui://widget/mragent-mindread-v1.html";
export const MRAGENT_SERVER_INFO = { name: "mindreply-mragent", version: "0.1.0" };
export const MRAGENT_RESOURCE_MIME_TYPE = RESOURCE_MIME_TYPE;

const sourceValues = ["manual", "gmail", "calendar", "extension"] as const;
const sourceSchema = z.enum(sourceValues).optional();
const prepareInputSchema = {
  message: z.string().min(1),
  source: sourceSchema,
};
const receiptInputSchema = {
  receiptId: z.string().min(1),
};
const outputSchema = {
  generationId: z.string(),
  decision: z.any(),
  reply: z.string(),
  receipt: z.any(),
  persistence: z.any(),
};

function siteOrigin() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.mind-reply.com").origin;
  } catch {
    return "https://www.mind-reply.com";
  }
}

export function getMRAgentResourceMeta() {
  const origin = siteOrigin();
  return {
    ui: {
      prefersBorder: true,
      domain: origin,
      csp: {
        connectDomains: [origin],
        resourceDomains: [origin],
      },
    },
    "openai/widgetDescription": "Shows one private Mind Read, one action, the risk gate, and the quiet receipt.",
    "openai/widgetPrefersBorder": true,
    "openai/widgetDomain": origin,
    "openai/widgetCSP": {
      connect_domains: [origin],
      resource_domains: [origin],
    },
  };
}

export function getMRAgentWidgetHtml() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
:root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
* { box-sizing: border-box; }
body { margin: 0; background: #f7f3eb; color: #1d2a3d; }
.shell { min-height: 100vh; padding: 18px; display: grid; gap: 14px; align-content: start; }
.header { display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid rgba(29,42,61,.14); padding-bottom: 12px; }
.brand { display: grid; gap: 2px; }
.brand span { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: #6d5d42; }
.brand strong { font-size: 20px; line-height: 1.1; }
.badge { border: 1px solid rgba(29,42,61,.16); border-radius: 999px; padding: 6px 10px; font-size: 12px; white-space: nowrap; background: rgba(255,255,255,.55); }
.grid { display: grid; gap: 10px; }
.panel { border: 1px solid rgba(29,42,61,.12); background: rgba(255,255,255,.68); border-radius: 8px; padding: 13px; display: grid; gap: 7px; }
.label { color: #6d5d42; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
.value { font-size: 14px; line-height: 1.45; overflow-wrap: anywhere; }
.action { border-color: rgba(142,100,29,.28); background: rgba(255,251,241,.85); }
.footer { display: flex; gap: 8px; flex-wrap: wrap; color: #59636f; font-size: 12px; }
.footer span { border: 1px solid rgba(29,42,61,.12); border-radius: 999px; padding: 5px 8px; background: rgba(255,255,255,.55); }
.empty { color: #59636f; font-size: 14px; padding: 18px; border: 1px dashed rgba(29,42,61,.22); border-radius: 8px; background: rgba(255,255,255,.45); }
@media (min-width: 680px) { .grid { grid-template-columns: 1fr 1fr; } .wide { grid-column: 1 / -1; } }
</style>
</head>
<body>
<div class="shell">
  <header class="header">
    <div class="brand"><span>MindReply</span><strong>MRagent</strong></div>
    <div class="badge">One action</div>
  </header>
  <main id="root"><div class="empty">Waiting for a prepared Mind Read.</div></main>
</div>
<script>
const root = document.getElementById("root");
function esc(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
function getData(toolResult) {
  return toolResult?.structuredContent || toolResult || window.openai?.toolOutput?.structuredContent || window.openai?.toolOutput || null;
}
function panel(label, value, className) {
  return '<section class="panel ' + (className || '') + '"><div class="label">' + esc(label) + '</div><div class="value">' + esc(value || 'Not ready') + '</div></section>';
}
function render(toolResult) {
  const data = getData(toolResult);
  if (!data || !data.decision) return;
  const decision = data.decision;
  const receipt = data.receipt || decision.receipt || {};
  root.innerHTML = '<div class="grid">'
    + panel('Mind Read', decision.mindRead?.reallyAbout, 'wide')
    + panel('Calmer move', decision.mindRead?.calmerMove, '')
    + panel('Risk gate', (decision.risk?.level || 'unknown') + ' - ' + (decision.risk?.reason || ''), '')
    + panel('One action', (decision.recommendedAction?.label || '') + '\n' + (data.reply || ''), 'action wide')
    + '</div><footer class="footer"><span>Receipt ' + esc(receipt.id) + '</span><span>Stored ' + esc(data.persistence?.stored ? 'yes' : 'no') + '</span><span>' + esc(receipt.rawContentRedacted ? 'Raw input redacted' : 'Redaction pending') + '</span></footer>';
}
render(window.openai?.toolOutput);
window.addEventListener("openai:set_globals", (event) => render(event.detail?.toolOutput || window.openai?.toolOutput), { passive: true });
window.addEventListener("message", (event) => {
  if (event.source !== window.parent) return;
  const message = event.data;
  if (!message || message.jsonrpc !== "2.0") return;
  if (message.method === "ui/notifications/tool-result") render(message.params);
}, { passive: true });
</script>
</body>
</html>`;
}

function structuredContent(result: MRAgentPreparation) {
  return {
    generationId: result.generationId,
    decision: result.decision,
    reply: result.reply,
    receipt: result.receipt,
    persistence: result.persistence,
    model: result.model,
    status: result.status,
    tokenUsage: result.tokenUsage,
  };
}

function normalizeToolArgs(args: unknown) {
  const record = args && typeof args === "object" ? (args as Record<string, unknown>) : {};
  const message = typeof record.message === "string" ? record.message.trim() : "";
  const source = sourceValues.includes(record.source as IntakeSource) ? (record.source as IntakeSource) : "manual";
  return { message, source };
}

function zodToJsonToolSchemas() {
  const sourceEnum = [...sourceValues];
  return {
    prepare: {
      type: "object",
      additionalProperties: false,
      required: ["message"],
      properties: {
        message: { type: "string", minLength: 1 },
        source: { type: "string", enum: sourceEnum },
      },
    },
    receipt: {
      type: "object",
      additionalProperties: false,
      required: ["receiptId"],
      properties: {
        receiptId: { type: "string", minLength: 1 },
      },
    },
  };
}

export function getMRAgentMcpManifest() {
  const schemas = zodToJsonToolSchemas();
  const resourceMeta = getMRAgentResourceMeta();

  return {
    serverInfo: MRAGENT_SERVER_INFO,
    resources: [
      {
        uri: MRAGENT_WIDGET_URI,
        name: "MRagent Mind Read",
        mimeType: RESOURCE_MIME_TYPE,
        _meta: resourceMeta,
      },
    ],
    tools: [
      {
        name: "prepare_mindread",
        title: "Prepare Mind Read",
        description: "Prepare one MRagent synthesis, action, risk gate, and receipt without storing raw input.",
        inputSchema: schemas.prepare,
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      },
      {
        name: "render_mindread",
        title: "Render Mind Read",
        description: "Prepare and render the MRagent widget for the current Mind Read.",
        inputSchema: schemas.prepare,
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
        _meta: {
          ui: { resourceUri: MRAGENT_WIDGET_URI },
          "openai/outputTemplate": MRAGENT_WIDGET_URI,
          "openai/toolInvocation/invoking": "Preparing MRagent",
          "openai/toolInvocation/invoked": "MRagent ready",
        },
      },
      {
        name: "fetch_receipt",
        title: "Fetch Receipt",
        description: "Fetch a stored privacy-safe MRagent receipt by id.",
        inputSchema: schemas.receipt,
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      },
    ],
  };
}

export async function callMRAgentTool(name: string, args: unknown) {
  if (name === "prepare_mindread" || name === "render_mindread") {
    const parsed = normalizeToolArgs(args);
    if (!parsed.message) throw new Error("message is required.");

    const result = await prepareMindRead({ input: parsed.message, source: parsed.source });
    const content = structuredContent(result);
    return {
      structuredContent: content,
      content: [{ type: "text" as const, text: `${content.decision.synthesis} ${content.decision.recommendedAction.label}.` }],
      _meta: name === "render_mindread" ? { ui: { resourceUri: MRAGENT_WIDGET_URI }, generationId: result.generationId } : { generationId: result.generationId },
    };
  }

  if (name === "fetch_receipt") {
    const record = args && typeof args === "object" ? (args as Record<string, unknown>) : {};
    const receiptId = typeof record.receiptId === "string" ? record.receiptId.trim() : "";
    if (!receiptId) throw new Error("receiptId is required.");

    const receipt = await fetchStoredReceipt(receiptId);
    return {
      structuredContent: receipt,
      content: [{ type: "text" as const, text: receipt.found ? "Receipt found." : "Receipt not found." }],
      _meta: {},
    };
  }

  throw new Error(`Unknown MRagent tool: ${name}`);
}

export function createMRAgentMcpServer() {
  const server = new McpServer(MRAGENT_SERVER_INFO, {
    instructions:
      "Use MRagent for one private Mind Read, one action, a risk gate, and a quiet receipt. Never request raw input after the preparation step stores only hashes and outputs.",
  });

  registerAppResource(server, "mragent_mindread", MRAGENT_WIDGET_URI, {}, async () => ({
    contents: [
      {
        uri: MRAGENT_WIDGET_URI,
        mimeType: RESOURCE_MIME_TYPE,
        text: getMRAgentWidgetHtml(),
        _meta: getMRAgentResourceMeta(),
      },
    ],
  }));

  registerAppTool(
    server,
    "prepare_mindread",
    {
      title: "Prepare Mind Read",
      description: "Prepare one MRagent synthesis, action, risk gate, and receipt without storing raw input.",
      inputSchema: prepareInputSchema,
      outputSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    },
    async ({ message, source }) => callMRAgentTool("prepare_mindread", { message, source }),
  );

  registerAppTool(
    server,
    "render_mindread",
    {
      title: "Render Mind Read",
      description: "Prepare and render the MRagent widget for the current Mind Read.",
      inputSchema: prepareInputSchema,
      outputSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      _meta: {
        ui: { resourceUri: MRAGENT_WIDGET_URI },
        "openai/outputTemplate": MRAGENT_WIDGET_URI,
        "openai/toolInvocation/invoking": "Preparing MRagent",
        "openai/toolInvocation/invoked": "MRagent ready",
      },
    },
    async ({ message, source }) => callMRAgentTool("render_mindread", { message, source }),
  );

  registerAppTool(
    server,
    "fetch_receipt",
    {
      title: "Fetch Receipt",
      description: "Fetch a stored privacy-safe MRagent receipt by id.",
      inputSchema: receiptInputSchema,
      outputSchema: { found: z.boolean(), receiptId: z.string() },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    },
    async ({ receiptId }) => callMRAgentTool("fetch_receipt", { receiptId }),
  );

  return server;
}
