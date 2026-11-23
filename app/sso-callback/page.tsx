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
        navigateToSignIn={() => go("/")}
        navigateToSignUp={() => go("/")}
      />
    </main>
  );
}
