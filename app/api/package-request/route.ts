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
          ? "MindReply received the package request. Expect the next close-ready invoice or payment route within one business day."
          : "MindReply prepared a receipt. Use info@mind-reply.com with the receipt id, billing name, billing email, and redacted context if delivery is blocked.",
      assistedClose: receipt.assistedClose,
      receipt,
    },
    { status: ok ? 200 : 202 },
  );
}
