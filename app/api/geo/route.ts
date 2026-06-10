import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const headers = request.headers;
  const country =
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country-code") ||
    "";
  const region = headers.get("x-vercel-ip-country-region") || "";
  const city = headers.get("x-vercel-ip-city") || "";
  const language = headers.get("accept-language")?.split(",")[0] || "";

  return NextResponse.json(
    {
      country: country.toUpperCase(),
      region,
      city,
      language,
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
