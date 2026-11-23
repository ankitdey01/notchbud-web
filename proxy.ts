import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { HOME_MARKDOWN, markdown } from "@/lib/agent-content";
import { representation } from "@/lib/agent-http";

const clerk = clerkMiddleware();
// Keep this list in sync with public pages; tests check the route inventory.
const pages = new Set(["/", "/docs", "/download", "/pricing", "/support", "/privacy", "/tos", "/sign-in", "/sign-up", "/sso-callback"]);
const resources = new Set(["/llms.txt", "/index.md", "/sitemap.xml", "/robots.txt"]);


// Required on Vercel (*.vercel.app): Clerk auto-proxies its JS and API
// through this app at /__clerk, and only middleware can serve those paths.
// Public by default — no route protection, just the proxy.
export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  const path = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  // Discovery resources are public and must not depend on an auth handshake.
  if (resources.has(path)) return NextResponse.next();
  const read = request.method === "GET" || request.method === "HEAD";
  const format = representation(request.headers.get("accept"));
  const internal = /^\/(?:api|trpc|__clerk|_next)(?:\/|$)/.test(path);
  const asset = /\.(?:webp|png|ico|wav|css|js|woff2?|ttf|svg|jpg|jpeg|gif)$/.test(path);
  if (read && path === "/") {
    if (format === "markdown") return markdown(request.method === "HEAD" ? null : HOME_MARKDOWN);
    if (format === "none") return new Response("Request text/html or text/markdown.", {
      status: 406, headers: { Vary: "Accept", "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  if (read && format === "markdown" && !internal && !asset && !pages.has(path) && !resources.has(path)) {
    return markdown(request.method === "HEAD" ? null : "# Page not found\n\nThe requested page does not exist. See [agent instructions](/llms.txt) or the [sitemap](/sitemap.xml).\n", 404);
  }
  const response = (await clerk(request, event)) || NextResponse.next();
  if (read && !internal && !asset && !resources.has(path)) {
    const vary = new Set((response.headers.get("Vary") || "").split(",").map((v) => v.trim()).filter(Boolean));
    vary.add("Accept");
    response.headers.set("Vary", [...vary].join(", "));
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Clerk auto-proxy (Vercel hosts): its .js bundles must reach the
    // middleware too, or the SDK 404s and auth never loads.
    "/__clerk/(.*)",
    "/(api|trpc)(.*)",
  ],
};
