import { SiteNav, Footer } from "@/components/landing/sections";

export const metadata = {
  title: "Terms — notchbud",
  description: "Terms of service for notchbud.",
};

export default function TosPage() {
  return (
    <main className="min-h-screen bg-white text-brand-950 antialiased">
      <SiteNav />
      <section className="mx-auto max-w-[720px] px-6 pb-28 pt-[148px]">
        <h1 className="h2-tight text-[clamp(2rem,5vw,3.2rem)] font-semibold">
          Terms of service
        </h1>
        {/* Kumo content-text-size: 14px body. Related paragraphs keep a loose rhythm. */}
        <div className="body-calm mt-5 grid gap-6 text-sm text-slate-600">
          <p>notchbud is a Windows companion that answers inside the notch island.</p>
          <p>Your Groq API key pays for usage. Groq limits are yours.</p>
          <p>Your key is sealed on your device. We never see it.</p>
          <p>Don&apos;t misuse the app. We may update these terms as the app changes.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
