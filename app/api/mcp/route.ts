import { GET as getMcp, OPTIONS as optionsMcp, POST as postMcp } from "../../mcp/route";

export const runtime = "nodejs";

export function OPTIONS() {
  return optionsMcp();
}

export function GET() {
  return getMcp();
}

export function POST(request: Request) {
  return postMcp(request);
}
