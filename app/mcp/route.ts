import { NextResponse } from "next/server";

import {
  callMRAgentTool,
  getMRAgentMcpManifest,
  getMRAgentResourceMeta,
  getMRAgentWidgetHtml,
  MRAGENT_RESOURCE_MIME_TYPE,
  MRAGENT_SERVER_INFO,
  MRAGENT_WIDGET_URI,
} from "@/lib/mragent-mcp";

export const runtime = "nodejs";

type JsonRpcId = string | number | null;

type JsonRpcRequest = {
  jsonrpc?: unknown;
  id?: JsonRpcId;
  method?: unknown;
  params?: unknown;
};

const responseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Cache-Control": "no-store",
};

function jsonResponse(payload: unknown, status = 200) {
  return NextResponse.json(payload, { status, headers: responseHeaders });
}

function rpcResult(id: JsonRpcId, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}

function rpcError(id: JsonRpcId, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function requestId(request: JsonRpcRequest): JsonRpcId {
  return Object.prototype.hasOwnProperty.call(request, "id") ? request.id ?? null : null;
}

async function handleJsonRpc(request: JsonRpcRequest) {
  const id = requestId(request);
  const method = typeof request.method === "string" ? request.method : "";
  const manifest = getMRAgentMcpManifest();

  if (!method) return rpcError(id, -32600, "Invalid request.");

  if (method === "notifications/initialized") return null;

  if (method === "initialize") {
    return rpcResult(id, {
      protocolVersion: "2025-06-18",
      capabilities: {
        resources: { listChanged: false, subscribe: false },
        tools: { listChanged: false },
      },
      serverInfo: MRAGENT_SERVER_INFO,
    });
  }

  if (method === "ping") return rpcResult(id, {});

  if (method === "tools/list") {
    return rpcResult(id, { tools: manifest.tools });
  }

  if (method === "resources/list") {
    return rpcResult(id, { resources: manifest.resources });
  }

  if (method === "resources/read") {
    const params = request.params && typeof request.params === "object" ? (request.params as Record<string, unknown>) : {};
    const uri = typeof params.uri === "string" ? params.uri : "";

    if (uri !== MRAGENT_WIDGET_URI) return rpcError(id, -32602, "Unknown resource URI.");

    return rpcResult(id, {
      contents: [
        {
          uri: MRAGENT_WIDGET_URI,
          mimeType: MRAGENT_RESOURCE_MIME_TYPE,
          text: getMRAgentWidgetHtml(),
          _meta: getMRAgentResourceMeta(),
        },
      ],
    });
  }

  if (method === "tools/call") {
    const params = request.params && typeof request.params === "object" ? (request.params as Record<string, unknown>) : {};
    const name = typeof params.name === "string" ? params.name : "";
    const args = params.arguments ?? params.args ?? {};

    if (!name) return rpcError(id, -32602, "Tool name is required.");

    try {
      return rpcResult(id, await callMRAgentTool(name, args));
    } catch (error) {
      return rpcError(id, -32602, error instanceof Error ? error.message : "Tool call failed.");
    }
  }

  return rpcError(id, -32601, `Unknown method: ${method}`);
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: responseHeaders });
}

export function GET() {
  return jsonResponse({
    endpoint: "/mcp",
    serverInfo: MRAGENT_SERVER_INFO,
    manifest: getMRAgentMcpManifest(),
  });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload) return jsonResponse(rpcError(null, -32700, "Parse error."), 400);

  if (Array.isArray(payload)) {
    const results = (await Promise.all(payload.map((item) => handleJsonRpc(item as JsonRpcRequest)))).filter(Boolean);
    return jsonResponse(results);
  }

  const result = await handleJsonRpc(payload as JsonRpcRequest);
  if (!result) return new Response(null, { status: 204, headers: responseHeaders });
  return jsonResponse(result);
}
