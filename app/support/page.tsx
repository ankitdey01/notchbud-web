import { SiteNav, Footer } from "@/components/landing/sections";

export const metadata = {
  title: "Support — notchbud",
  description: "Get help with notchbud.",
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-white text-brand-950 antialiased">
      <SiteNav />
      <section className="mx-auto max-w-[720px] px-6 pb-28 pt-[148px]">
        <h1 className="h2-tight text-[clamp(2rem,5vw,3.2rem)] font-semibold">
          How can we help?
        </h1>
        {/* Kumo content-text-size: body is 14px. */}
        <p className="body-calm mt-5 text-sm text-slate-600">
          notchbud uses your own Groq API key. No server; the key is sealed on your device.
          If something breaks, tell us what you saw and what you expected.
        </p>
        {/* Kumo related-text-size: entries sit loose (gap-6),
            each title + body stays tight (gap-1.5). No cards —
            plain text like the terms and privacy pages. */}
        <div className="mt-10 grid gap-6">
          {[
            ["Sign-in fails", "Enter the key again in the island. It must start with gsk_. The key is sealed on your device."],
            ["No answer streams", "Check your Groq key limits, then hover the notch and ask again."],
            ["Still stuck", "Email hello@ankitdey.dev with your Windows version and app version."],
          ].map(([t, b]) => (
            <div key={t} className="grid gap-1.5">
              <p className="text-sm font-semibold text-brand-950">{t}</p>
              <p className="text-sm leading-relaxed text-slate-600">{b}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
