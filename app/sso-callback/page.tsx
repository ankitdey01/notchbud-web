import { Suspense } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6">
      <p className="text-sm text-slate-600" role="status">
        Signing you in…
      </p>
      <Suspense>
        <AuthenticateWithRedirectCallback />
      </Suspense>
    </main>
  );
}
