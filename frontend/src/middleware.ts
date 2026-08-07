import { NextRequest, NextResponse } from "next/server";

/**
 * Per-request Content-Security-Policy with a cryptographic nonce.
 *
 * The nonce is forwarded through the `x-nonce` request header, which Next.js
 * automatically applies to its own inline scripts (Flight payloads and the
 * hydration bootstrap). Our own inline script in the root layout reads the
 * same header and sets the nonce attribute manually (see app/layout.tsx).
 *
 * `'strict-dynamic'` lets scripts loaded by a nonce-trusted script run without
 * listing every chunk origin, while modern browsers enforce the nonce
 * strictly and ignore the `'self'`/`'unsafe-inline'` fallbacks.
 *
 * The policy is applied in production only: `next dev` / Fast Refresh relies
 * on `unsafe-eval`, so enforcing it there would break the dev experience.
 */
export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // The frontend talks to the FastAPI backend (analysis + GitHub stars).
  // CSP host sources must not carry a path — sub-path requests (e.g.
  // /api/v1/github/stars) would be blocked — so reduce to the origin.
  const apiBase = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
  ).replace(/\/+$/, "");
  const apiOrigin = (() => {
    try {
      return new URL(apiBase).origin;
    } catch {
      return apiBase;
    }
  })();

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' ${apiOrigin}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  // Only force HTTPS for subresources when the page itself is already HTTPS.
  // Browsers treat http://localhost as a secure context, so adding this on
  // plain-HTTP local testing would wrongly upgrade local API calls to https.
  if (request.nextUrl.protocol === "https:") {
    csp.push("upgrade-insecure-requests");
  }

  const policy = csp.join("; ");

  const requestHeaders = new Headers(request.headers);
  // x-nonce is what makes Next.js stamp its own inline scripts with the nonce.
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  // The policy itself must go on the response headers the browser actually sees.
  response.headers.set("Content-Security-Policy", policy);

  return response;
}

export const config = {
  // Skip static assets; everything else gets the CSP header.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
