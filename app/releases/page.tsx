import { ArrowUpRight, Check, Download } from "lucide-react";
import { SiteNav, Footer } from "@/components/landing/sections";
import { HeroGhostCta, HeroPrimaryCta } from "@/components/landing/hero-ctas";
import { getAllReleases } from "@/lib/github-release";

export const metadata = {
  title: "Releases — notchbud",
  description: "Every notchbud release, in plain words.",
};

// Version list stays fresh without rebuilds.
export const revalidate = 3600;

const ICON = { size: 14, strokeWidth: 2, absoluteStrokeWidth: true } as const;

function formatDate(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return "";
  }
}

export default async function ReleasesPage() {
  const releases = await getAllReleases();
  return (
    <main className="min-h-screen bg-white text-brand-950 antialiased">
      <SiteNav />
      <section className="mx-auto max-w-[720px] px-6 pb-28 pt-[148px]">
        <h1 className="h2-tight text-[clamp(2rem,5vw,3.2rem)] font-semibold">
          Releases
        </h1>
        <p className="body-calm mt-5 text-sm text-slate-600">
          every version, newest first, in plain words. the app updates itself when a new one lands.
        </p>
        {releases.length === 0 ? (
          <div className="mt-10 grid gap-6">
            <div className="grid gap-1.5">
              <p className="text-sm font-semibold text-brand-950">could not load releases</p>
              <p className="text-sm leading-relaxed text-slate-600">
                github did not answer. see them directly instead.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-4">
            {releases.map((r, i) => {
              const date = formatDate(r.publishedAt);
              return (
              <article key={r.tag || r.htmlUrl} className="grid gap-4 rounded-[20px] bg-slate-500/10 px-6 py-5">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <h2 className="text-base font-semibold text-brand-950">{r.tag || r.name}</h2>
                  {i === 0 && (
                    <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-sm font-medium text-brand-700 ring-1 ring-kumo-line">
                      latest
                    </span>
                  )}
                  {date && (
                    <span className="text-sm text-slate-500">{date}</span>
                  )}
                </div>
                {r.changes.length > 0 && (
                  <ul className="grid gap-2.5">
                    {r.changes.map((c) => (
                      <li key={c} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
                        <span className="h-lh flex shrink-0 items-center">
                          <Check className="size-3.5 text-brand-700" {...ICON} />
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                  {i === 0 && r.assetUrl && (
                    <a
                      href={r.assetUrl}
                      className="focus-ring pressable inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-brand-950"
                    >
                      <Download {...ICON} aria-hidden="true" />
                      download setup
                    </a>
                  )}
                  <a
                    href={r.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring pressable inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-brand-950"
                  >
                    release notes
                    <ArrowUpRight {...ICON} aria-hidden="true" />
                  </a>
                </div>
              </article>
              );
            })}
          </div>
        )}
        <div className="mt-10 flex flex-wrap gap-3">
          <HeroPrimaryCta href="/download">download</HeroPrimaryCta>
          <HeroGhostCta href="/docs">read the docs</HeroGhostCta>
        </div>
      </section>
      <Footer />
    </main>
  );
}
