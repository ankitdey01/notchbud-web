import { ArrowRight, Download, Monitor, ShieldCheck } from "lucide-react";
import { SiteNav, Footer } from "@/components/landing/sections";
import { HeroGhostCta } from "@/components/landing/hero-ctas";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getLatestRelease } from "@/lib/github-release";
import type { ReactNode } from "react";

export const metadata = {
  title: "Download — notchbud",
  description: "Download notchbud for Windows. Free, no account.",
};

// Version tag stays fresh without rebuilds.
export const revalidate = 3600;

export default async function DownloadPage() {
  const latest = await getLatestRelease();
  const tag = latest?.tag ? ` ${latest.tag}` : "";
  const STEPS: { icon: typeof Download; t: string; b: ReactNode }[] = [
    {
      icon: Download,
      t: "download the installer",
      b: <>the latest release{tag}, fetched fresh from github.</>,
    },
    {
      icon: Monitor,
      t: "run the installer",
      b: "no admin rights needed. free, no account — usage is billed by your own provider.",
    },
    {
      icon: ShieldCheck,
      t: "unknown publisher warning",
      b: "go through it. smartscreen flags new publishers until reputation builds.",
    },
  ];
  return (
    <main className="min-h-screen bg-white text-brand-950 antialiased">
      <SiteNav />
      <section className="mx-auto max-w-[720px] px-6 pb-28 pt-[148px]">
        <h1 className="h2-tight text-[clamp(2rem,5vw,3.2rem)] font-semibold">
          Download notchbud
        </h1>
        <div className="mt-10 grid gap-6">
          {STEPS.map((s) => (
            <div key={s.t} className="flex items-start gap-3">
              <span className="grid size-9 flex-none place-items-center rounded-xl bg-brand-500/10 text-brand-700">
                <s.icon className="size-3.5" size={14} strokeWidth={2} />
              </span>
              <span className="grid gap-1">
                <span className="text-sm font-semibold text-brand-950">{s.t}</span>
                <span className="text-sm leading-relaxed text-slate-600">{s.b}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          {/* Plain anchor: a Next Link would prefetch (and follow) the
              binary on hover. Same primary style as the hero button. */}
          <a href="/api/download" className={cn(buttonVariants({ size: "lg" }), "[&_svg]:size-3.5")}>
            <Download size={14} strokeWidth={2} /> download for windows
          </a>
          <HeroGhostCta href="/pricing" icon={<ArrowRight size={14} strokeWidth={2} />}>
            see pricing
          </HeroGhostCta>
        </div>
        <p className="mt-10 text-sm leading-relaxed text-slate-600">
          looking for an older version? every release lives on the{" "}
          <a href="/releases" className="focus-ring pressable rounded-md font-medium text-brand-950 underline decoration-current decoration-1 underline-offset-4">
            releases page
          </a>
          , fetched fresh from github.
        </p>
      </section>
      <Footer />
    </main>
  );
}
