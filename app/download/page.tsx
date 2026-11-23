import { ArrowRight } from "lucide-react";
import { SiteNav, Footer } from "@/components/landing/sections";
import { HeroGhostCta, HeroPrimaryCta } from "@/components/landing/hero-ctas";

export const metadata = {
  title: "Download — notchbud",
  description: "Download notchbud for Windows. Free, no account.",
};

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-white text-brand-950 antialiased">
      <SiteNav />
      <section className="mx-auto max-w-[720px] px-6 pb-28 pt-[148px]">
        <h1 className="h2-tight text-[clamp(2rem,5vw,3.2rem)] font-semibold">
          Download notchbud
        </h1>
        <div className="body-calm mt-5 grid gap-6 text-sm text-slate-600">
          <p>notchbud is a Windows companion that answers inside the notch island.</p>
          <p>Free, no account. Answers are billed to your own Groq key.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <HeroPrimaryCta href="https://github.com/ankitdey01/notchbud/releases" external>
            download for windows
          </HeroPrimaryCta>
          <HeroGhostCta href="/pricing" icon={<ArrowRight size={14} strokeWidth={2} />}>
            see pricing
          </HeroGhostCta>
        </div>
      </section>
      <Footer />
    </main>
  );
}
