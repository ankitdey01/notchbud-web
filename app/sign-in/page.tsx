import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Sign in — notchbud",
  description: "Finish signing in to notchbud.",
};

// Continuation interface for the SSO callback's navigateToSignIn: Clerk's
// prebuilt component collects any remaining factors (first/second factor,
// new password) out of the box. Hash routing keeps everything in one file —
// path routing would 404 on multi-step sub-paths without a catch-all route.
export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-16">
      <SignIn routing="hash" />
    </main>
  );
}
