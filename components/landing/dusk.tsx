"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  BatteryMedium,
  Camera,
  Check,
  ChevronUp,
  FileText,
  Folder,
  Globe,
  History,
  Inbox,
  KeyRound,
  LogOut,
  Monitor,
  Moon,
  MousePointer2,
  MousePointerClick,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Plane,
  Terminal,
  Trash2,
  Volume2,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroGhostCta, HeroPrimaryCta, GithubMark } from "@/components/landing/hero-ctas";
import { Reveal } from "./reveal";
import { IslandDemo } from "./island-demo";
import { MODELS } from "./brands";
import { DraggablePet, SleepingCat } from "./pets";

const ICON = { size: 14, strokeWidth: 2, absoluteStrokeWidth: true } as const;

/* ------------------------------- demo section ----------------------------- */
// Island mockup: the live island demo hanging over a Windows 11 style desktop —
// pixel sky wallpaper, desktop icons, centered taskbar with search + tray.
// Wallpaper and island stay exactly as they were.

// Fixed desktop stage: the frame renders this 1120px composition and scales
// it to fit, so mobile shows the exact desktop look, just smaller.
const STAGE_W = 1120;
const STAGE_H = (STAGE_W * 922) / 1536;

type DesktopApp = {
  name: string;
  icon: React.ElementType;
  tile: string;
  glyph: string;
  logo?: boolean;
};

const DESKTOP_APPS: DesktopApp[] = [
  { name: "This PC", icon: Monitor, tile: "from-sky-400 to-blue-600", glyph: "text-white" },
  { name: "Recycle Bin", icon: Trash2, tile: "from-zinc-300 to-zinc-500", glyph: "text-white" },
  { name: "Microsoft Edge", icon: Globe, tile: "from-teal-400 to-blue-600", glyph: "text-white" },
  { name: "File Explorer", icon: Folder, tile: "from-amber-300 to-amber-500", glyph: "text-white" },
  { name: "Notepad", icon: FileText, tile: "from-white to-slate-200", glyph: "text-slate-500" },
  { name: "Terminal", icon: Terminal, tile: "from-zinc-700 to-black", glyph: "text-white" },
  { name: "notchbud", icon: Monitor, tile: "", glyph: "", logo: true },
];

function WinLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="9" height="9" rx="1.5" fill="#0078D4" />
      <rect x="13" y="2" width="9" height="9" rx="1.5" fill="#0078D4" />
      <rect x="2" y="13" width="9" height="9" rx="1.5" fill="#0078D4" />
      <rect x="13" y="13" width="9" height="9" rx="1.5" fill="#0078D4" />
    </svg>
  );
}

function bounceDesktopIcon(event: React.MouseEvent<HTMLButtonElement>) {
  const icon = event.currentTarget.firstElementChild;
  if (!icon) return;
  // Restart on repeated clicks without stacking animations or moving the label.
  icon.getAnimations().filter((animation) => animation.id === "desktop-icon-bounce").forEach((animation) => animation.cancel());
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  icon.animate(
    [
      { transform: "scale(1)", offset: 0 },
      { transform: "scale(0.88)", offset: 0.4 },
      { transform: "scale(1)", offset: 1 },
    ],
    { id: "desktop-icon-bounce", duration: 250, easing: "ease-in-out" }
  );
}

export function DemoSection() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const frameRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  const flyHostRef = React.useRef<HTMLDivElement>(null);
  const flashRef = React.useRef<HTMLDivElement>(null);
  const pendingClone = React.useRef<HTMLElement | null>(null);
  const flyingRef = React.useRef(false);
  const [fly, setFly] = React.useState<{ id: number; tx: number; ty: number; fw: number; fh: number } | null>(null);
  // Shutter capture: clone the live demo frame (wallpaper, icons, island,
  // taskbar) and fly the clone shrinking into the island input.
  React.useEffect(() => {
    const onCapture = (e: Event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const frame = frameRef.current;
      const stage = stageRef.current;
      if (!frame || !stage) return;
      const fr = frame.getBoundingClientRect();
      if (fr.width < 10 || fr.height < 10) return;
      const d = (e as CustomEvent).detail as { x: number; y: number; width: number; height: number } | null;
      // Land exactly on the 28px thumbnail: the shot wrap is 50px wide
      // (28 thumb + 2 gap + 20 x) sitting 8px left of the 28px camera button,
      // thumb on the wrap's left, vertically centered with the button.
      let tx = fr.width / 2 - 20;
      let ty = 76;
      if (d) {
        tx = d.x - fr.left - 58;
        ty = d.y - fr.top;
      }
      tx = Math.max(8, Math.min(tx, fr.width - 48));
      ty = Math.max(8, Math.min(ty, fr.height - 60));
      // Freeze the live stage as the screenshot — no overlay exists yet.
      // The clone keeps its natural 1120px size, pre-scaled to the frame.
      try {
        const node = stage.cloneNode(true) as HTMLElement;
        node.setAttribute("aria-hidden", "true");
        node.setAttribute("inert", "");
        node.style.pointerEvents = "none";
        node.style.margin = "0";
        node.style.width = `${STAGE_W}px`;
        node.style.height = `${STAGE_H}px`;
        node.style.transform = `scale(${fr.width / STAGE_W})`;
        node.style.transformOrigin = "top left";
        pendingClone.current = node;
      } catch {
        pendingClone.current = null;
      }
      if (!pendingClone.current) return;
      flyingRef.current = true;
      setFly({ id: Date.now(), tx, ty, fw: fr.width, fh: fr.height });
    };
    window.addEventListener("notchbud:capture", onCapture);
    const onCancel = () => setFly(null);
    window.addEventListener("notchbud:cancel-capture", onCancel);
    return () => {
      window.removeEventListener("notchbud:capture", onCapture);
      window.removeEventListener("notchbud:cancel-capture", onCancel);
    };
  }, []);
  React.useEffect(() => {
    if (!fly) return;
    const done = window.setTimeout(() => {
      flyingRef.current = false;
      setFly(null);
    }, 950);
    const host = flyHostRef.current;
    const flash = flashRef.current;
    const anims: Animation[] = [];
    if (host && pendingClone.current) {
      host.appendChild(pendingClone.current);
      pendingClone.current = null;
      if (fly.fw > 0 && fly.fh > 0) {
        // Travel the full 850ms; corners morph 24px → 8px so the landed
        // frame has the static thumbnail's exact rounded shape. Fade only
        // over the tail so the thumbnail underneath (shown at 700ms)
        // takes over with no pop.
        anims.push(
          host.animate(
            [
              { transform: "translate(0px, 0px) scale(1, 1)", borderRadius: "24px" },
              {
                transform: `translate(${fly.tx}px, ${fly.ty}px) scale(${28 / fly.fw}, ${28 / fly.fh})`,
                borderRadius: "8px",
              },
            ],
            { duration: 850, easing: "cubic-bezier(0.22,0.8,0.24,1)", fill: "forwards" }
          ),
          host.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 200,
            delay: 650,
            easing: "ease-out",
            fill: "forwards",
          })
        );
      }
    }
    if (flash) {
      anims.push(
        flash.animate([{ opacity: 0.55 }, { opacity: 0 }], { duration: 320, easing: "ease-out", fill: "forwards" })
      );
    }
    return () => {
      anims.forEach((a) => a.cancel());
      window.clearTimeout(done);
      flyingRef.current = false;
      if (host) host.replaceChildren();
      if (!flyingRef.current) pendingClone.current = null;
    };
  }, [fly]);
  // Scale the fixed stage to the measured frame width.
  React.useEffect(() => {
    const measure = () => {
      const w = frameRef.current?.offsetWidth;
      if (w && w > 10) setScale(w / STAGE_W);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  // Keep the server and first client render identical across locales and time zones.
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    const update = () => setNow(new Date());
    const initial = window.setTimeout(update, 0);
    const t = window.setInterval(update, 20000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(t);
    };
  }, []);
  const time = now?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) ?? "--:--";
  const date = now?.toLocaleDateString([], { month: "numeric", day: "numeric", year: "numeric" }) ?? "--/--/----";

  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-20 pt-6">
      <Reveal delay={100}>
        <div ref={frameRef} data-windows-frame className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[24px]" style={{ aspectRatio: "1536 / 922" }}>
          {/* Fixed-size desktop stage, scaled to fit: mobile shows the exact
              desktop composition, just smaller. */}
          <div ref={stageRef} className="absolute left-0 top-0" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          {/* Original sky, cropped 10% off the bottom — never stretched. */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/demobackground.webp"
              alt=""
              fill
              priority
              className="pixelated object-cover object-top"
              sizes="(max-width:1120px) 100vw, 1120px"
            />
          </div>
          {/* Fake desktop icons, top-left like a fresh Windows install. */}
          <div className="absolute left-2 top-2 z-10 grid w-24 gap-1">
            {DESKTOP_APPS.map((a) => (
              <button
                key={a.name}
                type="button"
                onClick={(event) => {
                  setSelected((s) => (s === a.name ? null : a.name));
                  bounceDesktopIcon(event);
                }}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md px-1.5 py-2",
                  selected === a.name ? "bg-white/25" : "hover:bg-white/15"
                )}
              >
                {a.logo ? (
                  <Image
                    src="/logorounded.webp"
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 rounded-[10px] object-cover drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]"
                  />
                ) : (
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-[10px] bg-gradient-to-b drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]",
                      a.tile
                    )}
                  >
                    <a.icon size={20} strokeWidth={2} className={a.glyph} />
                  </span>
                )}
                <span className="text-center text-[11px] font-medium leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
                  {a.name}
                </span>
              </button>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center">
            <IslandDemo />
          </div>
          {/* Windows 11 taskbar: centered Start + search + pins, tray on the right. */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex h-12 items-stretch justify-center border-t border-white/30 bg-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-xl backdrop-saturate-150">
            <div className="flex items-center gap-1 px-2 text-neutral-800">
              <button
                type="button"
                aria-label="Start"
                onClick={bounceDesktopIcon}
                className="grid size-10 place-items-center rounded-md hover:bg-white/60"
              >
                <WinLogo />
              </button>
              <form
                className="flex h-8 w-44 items-center gap-2 rounded-full bg-white/70 px-3 ring-1 ring-black/10"
                onSubmit={(e) => e.preventDefault()}
              >
                <Search size={14} className="flex-none text-neutral-600" />
                <input
                  aria-label="Search"
                  placeholder="Search"
                  className="min-w-0 flex-1 bg-transparent text-xs text-neutral-800 outline-none placeholder:text-neutral-500"
                />
              </form>
              {[
                { label: "File Explorer", icon: Folder, cls: "text-amber-500" },
                { label: "Microsoft Edge", icon: Globe, cls: "text-sky-600" },
                { label: "Microsoft Store", icon: ShoppingBag, cls: "" },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  aria-label={p.label}
                  onClick={bounceDesktopIcon}
                  className="grid size-10 place-items-center rounded-md hover:bg-white/60"
                >
                  <p.icon size={22} strokeWidth={1.75} className={p.cls} />
                </button>
              ))}
              <button type="button" className="grid size-10 place-items-center rounded-md hover:bg-white/60" aria-label="notchbud" onClick={bounceDesktopIcon}>
                <Image
                  src="/logorounded.webp"
                  alt=""
                  width={22}
                  height={22}
                  className="size-[22px] rounded-[6px] object-cover"
                />
              </button>
            </div>
            <div className="absolute inset-y-0 right-1 flex items-center gap-1.5 px-2 text-neutral-800">
              <ChevronUp size={14} />
              <Wifi size={14} />
              <Volume2 size={14} />
              <BatteryMedium size={16} />
              <span className="text-right text-[11px] leading-[1.25]">
                {time}
                <br />
                {date}
              </span>
            </div>
          </div>
          </div>
          {/* Shutter flash + live desktop clone flying into the island input.
              Unscaled screen px above the scaled stage. */}
          {fly && (
            <>
              <div ref={flashRef} aria-hidden className="pointer-events-none absolute inset-0 z-30 bg-white" />
              <div
                ref={flyHostRef}
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 z-30 overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/60"
                style={{ width: fly.fw, height: fly.fh, transformOrigin: "top left" }}
              />
            </>
          )}
        </div>
      </Reveal>
      <Reveal delay={150} className="mt-8">
        <div className="mx-auto flex max-w-[720px] flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-sm text-slate-600 sm:gap-2">
          <span className="whitespace-nowrap">works with</span>
          {MODELS.map((m) => (
            <Link
              key={m.name}
              href={m.href}
              className="focus-ring pressable inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-sm font-medium text-brand-950 ring-1 ring-kumo-line sm:gap-1.5 sm:px-3"
            >
              <m.Mark className="size-3.5" />
              {m.name}
            </Link>
          ))}
          <span className="whitespace-nowrap">or your own api key</span>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------- big statement ---------------------------- */
// Large-font simple text with movable pets inline, like the inspiration.

export function BigStatement() {
  return (
    <section className="mx-auto flex min-h-[85vh] max-w-[1200px] items-center justify-center px-6 pb-24 pt-12">
      <Reveal className="mx-auto w-full max-w-[1150px] text-center">
        <p className="text-[clamp(1.9rem,4.6vw,3.6rem)] font-semibold leading-[1.08] text-brand-950">
          <DraggablePet src="/pets/pet-wave-clean.webp" alt="waving notchbud cat" size={52} responsive className="ml-0 mr-1" />
          hover the notch
          <DraggablePet src="/pets/pet-happy-clean.webp" alt="happy notchbud cat" size={52} responsive className="ml-0 mr-1" />
          ask what you need. it answers in place.
          <DraggablePet src="/pets/pet-computer-clean.webp" alt="notchbud cat at a computer" size={52} responsive className="ml-0 mr-1" />
          open sourced and built purely in rust
          <span className="whitespace-nowrap">
            <DraggablePet src="/pets/pet-sleep-clean.webp" alt="sleeping notchbud cat" size={52} responsive className="ml-0 mr-1" />.
          </span>
        </p>
      </Reveal>
    </section>
  );
}
/* --------------------------------- jobs grid ------------------------------ */

type VsTile = { icon: React.ElementType; title: string; body: string };

const NORMAL_TILES: VsTile[] = [
  { icon: X, title: "another tab", body: "lives outside your work, a switch away." },
  { icon: X, title: "copy-paste roundtrip", body: "context out, answers back in." },
  { icon: X, title: "breaks your flow", body: "every question costs your focus." },
  { icon: X, title: "screenshot shuffle", body: "snap, save, paste into another window. every time." },
];

const OURS_TILES: VsTile[] = [
  { icon: MousePointer2, title: "stays where you work", body: "hover the notch, answers stream in place." },
  { icon: Zap, title: "keeps your focus", body: "your window never loses focus." },
  { icon: Camera, title: "screenshot questions", body: "snap anything on screen, ask what it means." },
  { icon: ShieldCheck, title: "yours, on your disk", body: "chats stay local, billed to your own key." },
];

function TileGroup({
  label,
  labelClass,
  chipClass,
  tiles,
}: {
  label: string;
  labelClass: string;
  chipClass: string;
  tiles: VsTile[];
}) {
  return (
    <div className="grid content-start gap-2 sm:gap-3">
      <p className={cn("text-sm font-semibold", labelClass)}>{label}</p>
      <div className="grid gap-4 sm:gap-6">
        {tiles.map((t, i) => (
          <div key={t.title} className={cn("items-start gap-2.5 sm:gap-3", i >= 2 ? "hidden sm:flex" : "flex")}>
            <span className={cn("grid size-8 flex-none place-items-center rounded-xl sm:size-9", chipClass)}>
              <t.icon className="size-3.5" {...ICON} />
            </span>
            <span className="grid gap-0.5 sm:gap-1">
              <span className="text-sm font-semibold text-brand-950">{t.title}</span>
              <span className="text-sm leading-snug text-slate-600 sm:leading-relaxed">{t.body}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function JobsSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-16 sm:pb-24">
      <Reveal className="max-w-[620px]">
        <div className="grid gap-1.5">
          <h2 className="h2-tight text-[clamp(2rem,5vw,3.4rem)] font-semibold">how is it different from your normal ai chat.</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            same models, none of the tab-switching.
          </p>
        </div>
      </Reveal>
      <Reveal delay={100}>
        <div className="relative mt-6 sm:mt-10">
          <SleepingCat className="-top-[46px]" />
          <div className="relative overflow-hidden rounded-[20px]">
          <Image
            src="/1000186581.webp"
            alt=""
            fill
            className="pixelated object-cover"
            sizes="(max-width:1200px) 100vw, 1200px"
          />
          <div className="relative p-3 sm:p-12">
            <div className="grid gap-6 rounded-2xl bg-white/95 p-4 shadow-[0_8px_30px_-12px_rgba(0,20,60,0.35)] backdrop-blur sm:grid-cols-2 sm:gap-8 sm:p-10">
              <TileGroup
                label="normal ai chat"
                labelClass="text-slate-500"
                chipClass="bg-slate-500/10 text-slate-400"
                tiles={NORMAL_TILES}
              />
              <TileGroup
                label="notchbud"
                labelClass="text-brand-950"
                chipClass="bg-brand-500/10 text-brand-700"
                tiles={OURS_TILES}
              />
            </div>
          </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------- where it lives --------------------------- */

type WhereCard = {
  top: string;
  rows: { icon: React.ElementType; title: string; sub: string; time: string; dot?: string }[];
  status: { label: string; sub: string; tone: string };
  title: string;
  body: string;
  cta: { label: string; href: string };
};

const WHERE: WhereCard[] = [
  {
    top: "/demobackground.webp",
    rows: [
      { icon: History, title: "Past chats", sub: "Newest first, on this device.", time: "today" },
      { icon: Camera, title: "Screenshot questions", sub: "Snap it, ask about it.", time: "today" },
      { icon: LogOut, title: "Tray menu", sub: "Disconnect wipes the key.", time: "settings" },
    ],
    status: { label: "This PC", sub: "Runs while your pc is on", tone: "bg-amber-500" },
    title: "on your computer",
    body: "chats and history stay on your disk. no account, nothing to rent.",
    cta: { label: "download the app", href: "/download" },
  },
  {
    top: "/1000186581.webp",
    rows: [
      { icon: KeyRound, title: "Groq key", sub: "Pasted once, sealed with DPAP.", time: "gsk-…" },
      { icon: Zap, title: "Billed by Groq", sub: "No notchbud server in between.", time: "live" },
      { icon: ShieldCheck, title: "No account", sub: "Nothing to rent, nothing to sync.", time: "free" },
    ],
    status: { label: "Sealed", sub: "Only Groq ever sees it", tone: "bg-emerald-500" },
    title: "on your own key",
    body: "your key pays groq directly. we never see it, we never store it.",
    cta: { label: "see the pricing", href: "/pricing" },
  },
  {
    top: "/footerimage.webp",
    rows: [
      { icon: MousePointer2, title: "Hover to open", sub: "No click, your window keeps focus.", time: "0.2s" },
      { icon: ArrowUp, title: "Type, press enter", sub: "Answers stream in place.", time: "live" },
      { icon: MousePointerClick, title: "Move away to stop", sub: "The reply stops with you.", time: "esc" },
    ],
    status: { label: "Your workflow", sub: "On while you work", tone: "bg-amber-500" },
    title: "in your workflow",
    body: "hover, ask, collapse. it fits between keystrokes, not instead of them.",
    cta: { label: "read the docs", href: "/docs" },
  },
];

export function WhereSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-24">
      <Reveal>
        <div className="grid gap-1.5">
          <h2 className="h2-tight text-[clamp(2rem,5vw,3.4rem)] font-semibold">where notchbud lives.</h2>
          <p className="text-sm leading-relaxed text-slate-600">your computer, your key, your workflow.</p>
        </div>
      </Reveal>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {WHERE.map((c, i) => (
          <div key={c.title} className="relative grid gap-6">
            {i === 0 && (
              <span aria-hidden className="pointer-events-none absolute -top-[29px] right-8 z-[1]">
                <DraggablePet src="/pets/pet-wave-clean.webp" alt="waving notchbud cat" size={48} />
              </span>
            )}
            <div className="relative flex min-h-[440px] overflow-hidden rounded-[20px]">
              <Image src={c.top} alt="" fill className="pixelated object-cover" sizes="(max-width:1024px) 100vw, 33vw" />
              <div className="relative z-[2] m-6 flex min-w-0 flex-1 flex-col sm:m-4">
                <div className="flex flex-1 flex-col gap-4 rounded-2xl bg-white/95 p-4 shadow-[0_8px_30px_-12px_rgba(0,20,60,0.35)] backdrop-blur">
                {c.rows.map((r) => (
                  <div key={r.title} className="flex items-start gap-3">
                    <span className="grid size-8 flex-none place-items-center rounded-lg bg-slate-500/10 text-brand-700">
                      <r.icon className="size-3.5" {...ICON} />
                    </span>
                    <span className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)] gap-0.5">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-brand-950">{r.title}</span>
                        <span className="flex-none text-[12px] text-slate-500">{r.time}</span>
                      </span>
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm text-slate-600">{r.sub}</span>
                        {r.dot && <span className={cn("size-2 flex-none rounded-full", r.dot)} />}
                      </span>
                    </span>
                  </div>
                ))}
                <div className="mt-auto flex items-center gap-2.5 rounded-xl bg-slate-500/10 px-4 py-3">
                  <span className="grid size-7 flex-none place-items-center rounded-lg bg-slate-500/10 text-brand-700">
                    <Moon className="size-3.5" {...ICON} />
                  </span>
                  <span className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)]">
                    <span className="text-sm font-semibold text-brand-950">{c.status.label}</span>
                    <span className="truncate text-sm text-slate-600">{c.status.sub}</span>
                  </span>
                  <span className={cn("size-2 flex-none rounded-full", c.status.tone)} aria-hidden />
                </div>
                </div>
              </div>
            </div>
            <div className="grid gap-1.5 px-1">
              <h3 className="text-base font-semibold text-brand-950">{c.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{c.body}</p>
              <Link href={c.cta.href} className="focus-ring pressable mt-1 inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-brand-950">
                {c.cta.label} <ArrowRight {...ICON} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- pricing -------------------------------- */

export function PricingSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-24">
      <Reveal>
        <div className="grid gap-1.5">
          <h2 className="h2-tight max-w-[16ch] text-[clamp(2rem,5vw,3.4rem)] font-semibold">
            start free. pay once if you love it.
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">no trial, no subscription.</p>
        </div>
      </Reveal>
      <div className="mx-auto mt-10 grid max-w-[1000px] gap-10 md:grid-cols-2">
        {[
          {
            top: "/demobackground.webp",
            name: "free",
            desc: "your answers, on your own computer.",
            price: "$0",
            note: "forever. no card, no account.",
            cta: "get started",
            href: "/download",
            soon: false,
            points: ["every feature of the app", "runs on your computer", "answers billed to your groq key", "no account, nothing to sync"],
            cat: true,
          },
          {
            top: "/footerimage.webp",
            name: "premium",
            desc: "pay once, support the project.",
            price: "$3",
            note: "once. yours forever.",
            cta: "coming soon",
            href: "/download",
            soon: true,
            points: ["everything in free", "every future update included", "your name in the supporters list", "vote on what ships next"],
          },
        ].map((p) => (
          <div key={p.name} className="relative rounded-[20px] bg-slate-500/10 p-2">
            {p.cat && <SleepingCat className="-top-[31px]" />}
            {p.name === "premium" && (
              <span aria-hidden className="pointer-events-none absolute -top-8 right-8">
                <DraggablePet src="/pets/pet-wave-clean.webp" alt="waving notchbud cat" size={48} />
              </span>
            )}
            <div className="relative h-36 overflow-hidden rounded-xl">
              <Image src={p.top} alt="" fill className="pixelated object-cover" sizes="(max-width:1000px) 100vw, 500px" />
            </div>
            <div className="grid gap-1.5 px-4 pb-4 pt-5">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-brand-950">{p.name}</h3>
                {p.soon && (
                  <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-sm font-medium text-brand-700 ring-1 ring-kumo-line">
                    coming soon
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600">{p.desc}</p>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
                <span className="text-[2.6rem] font-semibold leading-none text-brand-950">{p.price}</span>
                <span className="text-sm text-slate-600">{p.note}</span>
              </p>
              {/* Same glass button as the hero star button — no new styles. */}
              {p.soon ? (
                <span
                  aria-disabled="true"
                  className="mt-3 grid h-11 cursor-not-allowed place-items-center rounded-full bg-white/40 text-sm font-medium text-slate-500 ring-1 ring-kumo-line"
                >
                  {p.cta}
                </span>
              ) : (
                <Link
                  href={p.href}
                  className="focus-ring pressable mt-3 grid h-11 place-items-center rounded-full bg-white/80 text-sm font-medium text-brand-950 ring-1 ring-kumo-line backdrop-blur-xl hover:bg-white/50"
                >
                  {p.cta}
                </Link>
              )}
              <ul className="mt-3 grid gap-2.5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="h-lh flex shrink-0 items-center">
                      <Check className="size-3.5 text-brand-700" {...ICON} />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ native and open ----------------------------- */
// Technical brag: rust core, system webview, public source. No electron.

export function NativeSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-24">
      <Reveal className="max-w-[640px]">
        <div className="grid gap-1.5">
          <h2 className="h2-tight text-[clamp(2rem,5vw,3.4rem)] font-semibold">rust native, open-source dynamic island.</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            public source, rust core, system webview. no electron, no server, no accounts.
          </p>
        </div>
      </Reveal>
      <Reveal delay={100}>
        <div className="relative mt-10 overflow-hidden rounded-[20px]">
          <Image src="/1000186581.webp" alt="" fill className="pixelated object-cover" sizes="(max-width:1200px) 100vw, 1200px" />
          <div className="relative p-4 sm:p-6 lg:pt-16">
            {/* Stack card: what it is under the hood, straight from the repo */}
            <div className="relative z-[1] grid content-start gap-3 rounded-2xl bg-white/95 p-5 shadow-[0_8px_30px_-12px_rgba(0,20,60,0.35)] backdrop-blur sm:p-6">
              <div className="grid gap-4 sm:gap-5">
              {[
                { icon: Terminal, title: "rust core", sub: "one native binary. no runtime, no gc, no electron." },
                { icon: Monitor, title: "system webview", sub: "shares the webview windows already runs. nothing bundled." },
                { icon: Zap, title: "small and fast", sub: "opt-z, lto, stripped. built small to download fast and run lean." },
                { icon: ShieldCheck, title: "sealed with dpapi", sub: "windows encrypts your key on your disk." },
                { icon: FileText, title: "public source", sub: "read every line on github. issues and prs welcome." },
              ].map((s) => (
                <div key={s.title} className="flex items-start gap-3">
                  <span className="grid size-8 flex-none place-items-center rounded-xl bg-brand-500/10 text-brand-700 sm:size-9">
                    <s.icon className="size-3.5" {...ICON} />
                  </span>
                  <span className="grid min-w-0 flex-1 gap-0.5 sm:gap-1">
                    <span className="text-sm font-semibold text-brand-950">{s.title}</span>
                    <span className="text-sm leading-snug text-slate-600 sm:leading-relaxed">{s.sub}</span>
                  </span>
                </div>
              ))}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2">
                <Link href="https://github.com/ankitdey01/notchbud" className="focus-ring pressable inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-brand-950">
                  read the source <ArrowRight {...ICON} />
                </Link>
                <Link href="https://github.com/ankitdey01/notchbud" className="focus-ring pressable inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-brand-950">
                  <GithubMark /> star on github
                </Link>
              </div>
            </div>
          </div>
          <div aria-hidden className="absolute right-16 top-[12px] hidden lg:block">
            <DraggablePet src="/pets/pet-wave-clean.webp" alt="waving notchbud cat" size={56} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ----------------------------------- faq ---------------------------------- */

const FAQS = [
  { q: "Is notchbud really free?", a: "Yes. The app is free, with no trial timer. AI requests use your own Groq API key, so Groq's usage limits and pricing apply separately." },
  { q: "Do I need an account?", a: "You don't need a notchbud account to use the desktop app. You do need a Groq account to create your API key." },
  { q: "Where do my chats and API key go?", a: "Chat history stays on your computer, and your API key is protected locally using Windows DPAPI. Your prompts and any attached screenshots are sent to Groq to generate responses." },
  { q: "Which computers does it work on?", a: "notchbud is available for Windows x64 and uses WebView2. The installer runs for your user without requiring admin rights. Mac and Linux versions aren't available yet." },
  { q: "Is the preview a real AI chat?", a: "The preview shows how the island feels, with a sample response. Download the app and connect your Groq key for real answers." },
];

export function FaqSection() {
  const [open, setOpen] = React.useState<number[]>([0]);
  const toggle = (i: number) =>
    setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-24" aria-labelledby="faq-title">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.3fr] lg:gap-20">
        <div className="grid content-start gap-6">
          <div className="grid gap-1.5">
            <p className="mb-3 text-sm font-medium text-brand-600">A few good questions</p>
            <h2 id="faq-title" className="text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-[1.12] [text-wrap:balance]">
              Before you<br />make room.
            </h2>
          </div>
          <p className="text-sm text-slate-600">Something else on your mind?</p>
          <Link href="/support" className="focus-ring inline-flex w-fit items-center gap-2 rounded-md text-sm font-medium text-brand-700 hover:text-brand-950 hover:underline hover:underline-offset-4">
            We&rsquo;re here to help <ArrowRight {...ICON} />
          </Link>
        </div>
        <div className="grid gap-2">
          {FAQS.map((f, i) => {
            const isOpen = open.includes(i);
            return (
              <div key={f.q}>
                <h3>
                  <button
                    type="button"
                    id={`faq-trigger-${i}`}
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    className="focus-ring flex w-full items-center justify-between gap-4 rounded-lg px-5 py-4 text-left text-sm font-medium text-brand-950 hover:bg-brand-50/50"
                  >
                    {f.q}
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-7 flex-none place-items-center rounded-full bg-brand-50 text-brand-700 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out",
                        isOpen && "rotate-45"
                      )}
                    >
                      {/* Pikaicons plus-default (free, MIT): plus rotates into a cross when open. */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19v-7m0 0V5m0 7H5m7 0h7" fill="none" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                  className={cn(
                    "grid motion-safe:transition-[grid-template-rows] motion-safe:duration-200 motion-safe:ease-out",
                    isOpen ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- final cta ------------------------------- */
// Beach strip just above the footer, like the inspiration.

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/footerimage.webp"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="relative mx-auto max-w-[1200px] px-6 pb-28 pt-24 text-center">
        <Reveal>
          <h2 className="h2-tight mx-auto max-w-[14ch] text-[clamp(2.4rem,6vw,4.4rem)] font-semibold text-brand-950">
            meet your first answer.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-4 max-w-[52ch] text-sm leading-relaxed text-brand-950/70">
            it could be streaming in a minute. free on your own computer.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {/* Same hero buttons — no new styles. */}
          <HeroPrimaryCta href="/download">download for free</HeroPrimaryCta>
          <HeroGhostCta href="/pricing" icon={<ArrowRight {...ICON} />}>
            see pricing
          </HeroGhostCta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- footer -------------------------------- */

const FOOT_COLS: { title: string; links: { label: string; href: string }[] }[] = [
  { title: "product", links: [{ label: "download", href: "/download" }, { label: "pricing", href: "/pricing" }] },
  { title: "learn", links: [{ label: "docs", href: "/docs" }, { label: "support", href: "/support" }] },
  { title: "notchbud", links: [{ label: "support", href: "/support" }, { label: "terms", href: "/tos" }, { label: "privacy", href: "/privacy" }] },
  { title: "legal", links: [{ label: "terms", href: "/tos" }, { label: "privacy", href: "/privacy" }, { label: "support", href: "/support" }] },
];

export function SiteFooter() {
  return (
    <>
      <FinalCtaSection />
    <footer className="bg-white px-6 pb-10 pt-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div className="grid gap-1.5">
            <div className="flex items-center gap-2.5">
              <Image src="/logorounded.webp" alt="notchbud logo" width={28} height={28} className="size-7 rounded-lg object-cover" />
              <span className="text-base font-semibold text-brand-950">notchbud</span>
            </div>
            <p className="max-w-[36ch] text-sm leading-relaxed text-slate-600">
              a windows island that answers where you work.
            </p>
            <a href="mailto:hello@ankitdey.dev" className="focus-ring pressable w-fit rounded-md text-sm text-slate-600">
              hello@ankitdey.dev
            </a>
          </div>
          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-4" aria-label="Footer">
            {FOOT_COLS.map((c) => (
              <div key={c.title} className="grid content-start gap-3">
                <p className="text-sm font-semibold text-brand-950">{c.title}</p>
                {c.links.map((l) => (
                  <Link key={l.label + l.href} href={l.href} className="focus-ring pressable w-fit rounded-md text-sm text-slate-600 hover:text-brand-950">
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <p className="mt-10 text-sm text-slate-500">
          made for windows. answers billed to your own groq key.
        </p>
      </div>
    </footer>
    </>
  );
}
