export const MAX_TEXT_INPUT_CHARS = 8000;
export const MAX_JSON_BODY_BYTES = 32768;
export const MAX_MCP_BATCH_ITEMS = 8;

export class SafeRequestError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "SafeRequestError";
    this.status = status;
    this.code = code;
  }
}

export async function readJsonRequest(request: Request, maxBytes = MAX_JSON_BODY_BYTES): Promise<unknown> {
  const text = await request.text().catch(() => "");
  if (!text.trim()) throw new SafeRequestError(400, "empty_body", "Request body is required.");

  const bodyBytes = new TextEncoder().encode(text).length;
  if (bodyBytes > maxBytes) {
    throw new SafeRequestError(413, "body_too_large", `Request body must be ${maxBytes} bytes or smaller.`);
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new SafeRequestError(400, "invalid_json", "Request body must be valid JSON.");
  }
}

export function assertTextInputWithinLimit(input: string, maxChars = MAX_TEXT_INPUT_CHARS) {
  if (input.length > maxChars) {
    throw new SafeRequestError(413, "input_too_large", `Input must be ${maxChars} characters or fewer.`);
  }
}

export function trustedClientUserId(request: Request, body: unknown) {
  const ownerToken = process.env.MINDREPLY_OWNER_API_TOKEN;
  const authorization = request.headers.get("authorization") || "";
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : "";

  if (!ownerToken || bearer !== ownerToken) return undefined;

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const userId = typeof record.userId === "string" ? record.userId.trim() : "";
  return userId ? userId.slice(0, 128) : undefined;
}

export function ownerSecurityLog(event: string, details: Record<string, string | number | boolean | null | undefined>) {
  const safeDetails = Object.fromEntries(
    Object.entries(details).filter(([, value]) => value !== undefined),
  );

  console.info(
    JSON.stringify({
      service: "mindreply",
      event,
      timestamp: new Date().toISOString(),
      ...safeDetails,
    }),
  );
}
