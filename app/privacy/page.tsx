import { SiteNav, Footer } from "@/components/landing/sections";

export const metadata = {
  title: "Privacy — notchbud",
  description: "Privacy policy for notchbud.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-brand-950 antialiased">
      <SiteNav />
      <section className="mx-auto max-w-[720px] px-6 pb-28 pt-[148px]">
        <h1 className="h2-tight text-[clamp(2rem,5vw,3.2rem)] font-semibold">
          Privacy policy
        </h1>
        {/* Kumo content-text-size: 14px body. */}
        <div className="body-calm mt-5 grid gap-6 text-sm text-slate-600">
          <p>notchbud runs on your desktop. No server.</p>
          <p>The island asks for a Groq key or a custom endpoint (api root, optional key, exact model id). Credentials seal with DPAPI on your device.</p>
          <p>Saved keys never reach the island&apos;s JavaScript. Your prompts and screenshots go only to the provider you configured.</p>
          <p>We don&apos;t collect your prompts or answers.</p>
          <p>Contact hello@ankitdey.dev with privacy questions.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
