import { clerkMiddleware } from "@clerk/nextjs/server";

// Required on Vercel (*.vercel.app): Clerk auto-proxies its JS and API
// through this app at /__clerk, and only middleware can serve those paths.
// Public by default — no route protection, just the proxy.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
