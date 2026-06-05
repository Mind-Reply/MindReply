import type { NextRequest } from "next/server";

export const revenueOwnerEmail = "angelllkr@gmail.com";

export function isRevenueOwnerAuthorized(req: NextRequest | Request) {
  const secret = process.env.REVENUE_OWNER_SECRET;
  return Boolean(secret && req.headers.get("authorization") === `Bearer ${secret}`);
}

export function unauthorizedOwnerResponse() {
  return Response.json({ error: "Owner authorization required" }, { status: 401 });
}
