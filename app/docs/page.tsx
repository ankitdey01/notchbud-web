import { KeyRound, LifeBuoy, Radio, Repeat, Sparkles } from "lucide-react";
import { SiteNav, Footer } from "@/components/landing/sections";
import { HeroGhostCta, HeroPrimaryCta } from "@/components/landing/hero-ctas";

export const metadata = {
  title: "Docs — notchbud",
  description: "Get started with notchbud in about a minute.",
};

const STEPS = [
  ["download it and install it", "run the installer. no admin rights needed. if windows warns about an unknown publisher, go through it."],
  ["connect groq or a custom endpoint", "pick groq and paste a key from console.groq.com/keys, or pick custom and enter the provider's api root (with /v1 when it needs it), an optional key, and the exact model id."],
  ["hover the notch", "the island swells open. type, read the stream."],
  ["hand it something real", "the thing you've been putting off. hover-off collapses when done."],
];

const NOTES: { icon: typeof Radio; t: string; b: string }[] = [
  { icon: Radio, t: "custom endpoints must stream", b: "any openai-compatible api root works if it streams chat completions. enter the root — never a /models or /chat/completions url. remote urls need https; http works only on localhost." },
  { icon: KeyRound, t: "the key is optional on custom", b: "leave it blank for keyless local servers like ollama. if you leave it blank on the same api root, the saved key is reused." },
  { icon: Sparkles, t: "groq-only extras", b: "web search answers need groq's gpt-oss models and never go to custom endpoints. screenshot support follows the model you pick." },
  { icon: Repeat, t: "switching keeps your chat", b: "the local conversation stays and rides along to the newly selected provider. keys seal with dpapi and never reach the island's javascript." },
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
        <div className="mt-10 grid gap-4">
          <h2 className="text-base font-semibold text-brand-950">good to know</h2>
          <div className="rounded-[20px] bg-slate-500/10 px-6 py-5">
            <ul className="grid gap-4">
              {NOTES.map((n) => (
                <li key={n.t} className="flex items-start gap-3">
                  <span className="grid size-8 flex-none place-items-center rounded-xl bg-brand-500/10 text-brand-700">
                    <n.icon size={14} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span className="grid min-w-0 flex-1 gap-1">
                    <span className="text-sm font-semibold text-brand-950">{n.t}</span>
                    <span className="text-sm leading-relaxed text-slate-600">{n.b}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
