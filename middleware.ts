import { NextRequest, NextResponse } from "next/server";
import { isRedirectedPublicPath } from "@/lib/decision-layer";
import { localeFromPath, stripLocaleFromPath } from "@/lib/locales";

const allowedApiPaths = new Set([
  "/api/health",
  "/api/intake",
  "/api/conversion",
  "/api/agent",
  "/api/mcp",
  "/api/package-request",
  "/api/geo-locale",
  "/api/translate",
  "/api/version",
]);

export default function middleware(req: NextRequest) {
  const host = req.headers.get("host")?.toLowerCase();
  if (host === "mind-reply.com") {
    const url = req.nextUrl.clone();
    url.hostname = "www.mind-reply.com";
    return NextResponse.redirect(url, 308);
  }

  const prefixedLocale = localeFromPath(req.nextUrl.pathname);
  if (prefixedLocale) {
    const strippedPath = stripLocaleFromPath(req.nextUrl.pathname);
    if (isRedirectedPublicPath(strippedPath)) {
      const url = req.nextUrl.clone();
      url.pathname = prefixedLocale === "en" ? "/" : `/${prefixedLocale}`;
      url.search = "";
      return NextResponse.redirect(url, 307);
    }

    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = strippedPath;
    rewriteUrl.searchParams.set("lang", prefixedLocale);
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set("x-mindreply-locale", prefixedLocale);
    response.cookies.set("mindreply-locale", prefixedLocale, {
      path: "/",
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  if (isRedirectedPublicPath(req.nextUrl.pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url, 307);
  }

  if (req.nextUrl.pathname.startsWith("/api/") && !allowedApiPaths.has(req.nextUrl.pathname)) {
    return NextResponse.json(
      {
        status: "retired",
        service: "mindreply",
        message: "This surface has moved into the decision layer.",
      },
      { status: 410 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
