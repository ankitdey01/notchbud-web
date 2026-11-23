import Link from "next/link";
import { SiteNav, Footer } from "@/components/landing/sections";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-brand-950 antialiased">
      <SiteNav />
      <section className="mx-auto flex min-h-[70vh] max-w-[720px] flex-col justify-center px-6 pb-28 pt-[148px]">
        {/* Kumo inline-monospace-size: mono at 0.9em. No tracking tweaks. */}
        <p className="font-mono text-[0.9em] text-slate-500">404</p>
        <h1 className="h2-tight mt-3 text-[clamp(2rem,5vw,3.2rem)] font-semibold">
          This page is not here.
        </h1>
        {/* Kumo content-text-size + related-text-spacing: tight title/body (mt-5 is the loose step). */}
        <p className="body-calm mt-5 max-w-[42ch] text-sm text-slate-600">
          The link may be old, or the page moved.
        </p>
        <Link href="/" className={cn(buttonVariants(), "mt-8 w-fit")}>
          Back to notchbud
        </Link>
      </section>
      <Footer />
    </main>
  );
}
