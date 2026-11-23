import { LifeBuoy } from "lucide-react";
import { SiteNav, Footer } from "@/components/landing/sections";
import { HeroGhostCta, HeroPrimaryCta } from "@/components/landing/hero-ctas";

export const metadata = {
  title: "Docs — notchbud",
  description: "Get started with notchbud in about a minute.",
};

const STEPS = [
  ["download it and install it", "run the installer. no admin rights needed. if windows warns about an unknown publisher, go through it."],
  ["paste your groq key", "the key seals on your device with dpap. we never see it."],
  ["hover the notch", "the island swells open. type, read the stream."],
  ["hand it something real", "the thing you've been putting off. hover-off collapses when done."],
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-white text-brand-950 antialiased">
      <SiteNav />
      <section className="mx-auto max-w-[720px] px-6 pb-28 pt-[148px]">
        <h1 className="h2-tight text-[clamp(2rem,5vw,3.2rem)] font-semibold">
          Get started
        </h1>
        <p className="body-calm mt-5 text-sm text-slate-600">
          from download to asking in about a minute.
        </p>
        <div className="mt-10 grid gap-6">
          {STEPS.map(([t, b], i) => (
            <div key={t} className="flex gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-500/10 font-mono text-[0.9em] text-brand-700">
                {i + 1}
              </span>
              <div className="grid gap-1.5">
                <p className="text-sm font-semibold text-brand-950">{t}</p>
                <p className="text-sm leading-relaxed text-slate-600">{b}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <HeroPrimaryCta href="/download">download</HeroPrimaryCta>
          <HeroGhostCta href="/support" icon={<LifeBuoy size={14} strokeWidth={2} />}>
            support
          </HeroGhostCta>
        </div>
      </section>
      <Footer />
    </main>
  );
}
