import { NextResponse } from "next/server";

import { deliverPackageRequest, makePackageReceipt, parsePackageRequest } from "@/lib/package-request";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = parsePackageRequest(body);

  if (!parsed.input) {
    return NextResponse.json({ error: parsed.error || "Invalid package request." }, { status: 400 });
  }

  const delivery = await deliverPackageRequest(parsed.input);
  const receipt = makePackageReceipt(parsed.input, delivery);
  const ok = delivery.status === "sent" || delivery.status === "dry-run";

  return NextResponse.json(
    {
      status: ok ? "received" : "fallback-required",
      packageName: receipt.packageName,
      packageValue: receipt.packageValue,
      message:
        delivery.status === "sent"
          ? "MindReply received the package request and will use the public reply route."
          : "MindReply prepared a receipt. Use the fallback email route if delivery is blocked.",
      receipt,
    },
    { status: ok ? 200 : 202 },
  );
}
