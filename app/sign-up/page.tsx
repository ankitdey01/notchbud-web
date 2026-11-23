import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Sign up — notchbud",
  description: "Finish creating your notchbud account.",
};

// Continuation interface for the SSO callback's navigateToSignUp: Clerk's
// prebuilt component collects any missing sign-up information out of the box.
// Hash routing keeps everything in one file — path routing would 404 on
// multi-step sub-paths without a catch-all route.
export default function SignUpPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-16">
      <SignUp routing="hash" />
    </main>
  );
}
