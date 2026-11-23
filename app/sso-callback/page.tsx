"use client";

import { useRouter } from "next/navigation";
import { HandleSSOCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  const router = useRouter();
  const go = (to: string) => router.push(to);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6">
      <p className="text-sm text-slate-600" role="status">
        Signing you in…
      </p>
      <HandleSSOCallback
        navigateToApp={({ decorateUrl }) => {
          const destination = decorateUrl("/");
          if (destination.startsWith("http")) window.location.href = destination;
          else go(destination);
        }}
        // Incomplete attempts land on the prebuilt continuation interfaces,
        // which collect remaining factors and missing sign-up information.
        // (This Clerk version exposes only these callbacks — no URL props.)
        navigateToSignIn={() => go("/sign-in")}
        navigateToSignUp={() => go("/sign-up")}
      />
    </main>
  );
}
