"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { Orb } from "@yogesharc/thinking-orbs";
import { Mascot } from "page-mascot";
import { Show } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { AccountMenu } from "@/components/auth/account-menu";
import { AuthModal } from "@/components/auth/auth-modal";
import { smoothScrollTo } from "@/components/ui/lenis-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradientWave } from "@/components/ui/gradient-wave";
import { HeroGhostCta, HeroPrimaryCta, GithubMark } from "@/components/landing/hero-ctas";
import { Reveal } from "./reveal";
import { MobileMenu, type MobileMenuLink } from "./mobile-menu";

// Kumo icon-alignment: inline icons match the 14px content size.
// size-3.5 = 14px so icons sit optically with text-sm labels.
const ICON = { size: 14, strokeWidth: 2, absoluteStrokeWidth: true } as const;

function motionScroll(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

/* ---------------------------------- nav ---------------------------------- */

// Same links in the desktop nav and the mobile drawer.
const NAV_LINKS = [
  ["download", "/download"],
  ["docs", "/docs"],
  ["pricing", "/pricing"],
  ["releases", "/releases"],
] as const satisfies MobileMenuLink;

export function SiteNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [authOpen, setAuthOpen] = React.useState(false);
  const toTop = () => {
    if (pathname !== "/") {
      router.push("/");
      return;
    }
    smoothScrollTo(0, motionScroll());
  };
  React.useEffect(() => {
    const target = sessionStorage.getItem("scroll-target");
    if (target) {
      sessionStorage.removeItem("scroll-target");
      const t = setTimeout(() => {
        const el = document.getElementById(target);
        if (el) smoothScrollTo(el, motionScroll());
      }, 120);
      return () => clearTimeout(t);
    }
  }, [pathname]);
  return (
    // Kumo hover-color-transitions: no color transition.
    <header className="absolute inset-x-0 top-3 z-50 border-b border-transparent bg-transparent">
      <div className="relative mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-6">
        <button type="button" onClick={toTop} className="focus-ring pressable flex items-center gap-2.5 rounded-lg" aria-label="Back to top">
          <Image src="/logorounded.webp" alt="notchbud logo" width={32} height={32} className="size-8 rounded-[10px] object-cover" />
          <span className="hidden text-base font-semibold text-brand-950 min-[400px]:inline">notchbud</span>
        </button>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 text-sm text-brand-950 md:flex" aria-label="Primary">
          {NAV_LINKS.map(([label, href]) => (
            <Link key={href} href={href} className="focus-ring pressable rounded-md hover:text-brand-950">
              {label}
            </Link>
          ))}
        </nav>
        {/* Kumo concentric-border-radius: pill container (full) + pill buttons (full) stay concentric. */}
        <div className="flex items-center gap-1 rounded-full bg-white/60 p-1 backdrop-blur">
          <Show when="signed-out">
            <Button variant="ghost" size="sm" className="h-8 rounded-full px-4 text-brand-950" onClick={() => setAuthOpen(true)}>
              sign in
            </Button>
          </Show>
          <Show when="signed-in">
            <span className="grid h-8 place-items-center pl-1 pr-1">
              <AccountMenu />
            </span>
          </Show>
          {/* Download lives in the hamburger drawer on mobile. */}
          <Button type="button" size="sm" className="hidden h-8 rounded-full px-4 md:inline-flex" onClick={() => router.push("/download")}>
            <Download {...ICON} />
            download
          </Button>
          <MobileMenu links={NAV_LINKS} />
        </div>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}

/* ------------------------------- hero + island ---------------------------- */

function AnswerLine({ text, live = false }: { text: string; live?: boolean }) {
  return (
    // Kumo icon-alignment: icon wraps in h-lh so multi-line text aligns to the first line.
    // Kumo content-text-size: row text is 14px; the orb matches at 14px.
    <div className="flex items-start gap-2.5">
      <span className="h-lh flex shrink-0 items-center" aria-hidden={!live}>
        {live ? (
          <Orb state="reasoning" size={14} label="Streaming answer" />
        ) : (
          <span className="size-[5px] rounded-full bg-brand-300" />
        )}
      </span>
      <p className="text-sm leading-relaxed text-slate-600">{text}</p>
    </div>
  );
}

export function IslandMock() {
  return (
    // Kumo shadow-borders: single LayerCard — ring, never border + shadow.
    // Kumo text-spacing: optical padding (px-5 > py-4).
    // Concentric note: outer padding (16–20px) exceeds 8px, so inner radii are exempt.
    <div className="island group/island relative mx-auto w-full max-w-[680px] overflow-hidden rounded-[24px] bg-white/85 ring-1 ring-kumo-line backdrop-blur">
      {/* Kumo related-text-spacing: query + answers form one tight group (gap-4),
          kept well clear of surrounding sections by the parent layout. */}
      <div className="grid gap-4 px-5 py-4">
        <div className="flex items-center gap-2.5 rounded-xl bg-brand-50 px-4 py-3 ring-1 ring-kumo-line">
          <p className="flex-1 text-sm text-brand-950">
            Summarize this thread in 3 bullets
            <span className="ml-[3px] inline-block h-[15px] w-[2px] animate-caret bg-brand-600 align-[-2px]" />
          </p>
        </div>
        <AnswerLine text="Kept the hover physics — swell, pop, collapse." />
        <AnswerLine text="Billed by your own provider. No server." />
        <AnswerLine live text="Sealing the token…" />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-14 pt-32 sm:pt-[108px]">
      {/* Animated sky/white wave — the site's signature background. */}
      <GradientWave />
      {/* Soft blend from the wave into the page background. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-64 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.45)_38%,rgba(255,255,255,0.82)_68%,#ffffff_100%)] md:h-80"
      />
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center">
        <Reveal>
          <div className="relative z-10 -mb-[37px] flex justify-center">
            <Mascot
              directions="/cat-directions.webp"
              reactions="/cat-reactions.webp"
              size={140}
              label="Pixel cat mascot watching your cursor"
            />
          </div>
        </Reveal>
        <Reveal>
          <Badge className="mx-auto gap-2 px-5 py-2">
            {/* Pill orb scaled up for visibility against the larger pill. */}
            <Orb state="reasoning" size={22} label="Thinking" className="shrink-0" />
            hover. ask. done.
          </Badge>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="display mx-auto mt-6 max-w-[14ch] text-[clamp(3rem,8.8vw,6.9rem)] text-black max-sm:text-balance">
            the notch{" "}
            <br className="max-sm:hidden" />
            with an assistant.
          </h1>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <HeroPrimaryCta href="/download">download for windows</HeroPrimaryCta>
            <HeroGhostCta href="https://github.com/ankitdey01/notchbud" external icon={<GithubMark />}>
              star on github
            </HeroGhostCta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------- footer (dusk-style, see dusk.tsx) ------------------ */

export { SiteFooter as Footer } from "./dusk";
