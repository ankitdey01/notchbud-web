"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { GithubMark } from "@/components/landing/hero-ctas";

const ICON = { size: 14, strokeWidth: 2, absoluteStrokeWidth: true } as const;

export type MobileMenuLink = readonly (readonly [label: string, href: string])[];

/** Hamburger button + right-side drawer holding the nav links. Mobile only.
    Port of postdiff's MobileMenu, rebuilt on this repo's stack (no motion
    lib): the drawer stays mounted and slides via transform, like t-dropdown. */
export function MobileMenu({ links }: { links: MobileMenuLink }) {
  const [open, setOpen] = React.useState(false);
  // Portal target: the pill ancestor uses backdrop-blur, which would trap
  // fixed positioning — the drawer must mount on document.body instead.
  // useSyncExternalStore keeps SSR (snapshot false) and lint clean.
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);

  const close = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="focus-ring pressable grid size-8 place-items-center rounded-full text-brand-950 hover:bg-white/60 md:hidden"
      >
        {open ? (
          <X size={20} strokeWidth={2} absoluteStrokeWidth aria-hidden="true" />
        ) : (
          <Menu size={20} strokeWidth={2} absoluteStrokeWidth aria-hidden="true" />
        )}
      </button>

      {/* Backdrop + panel live on document.body: fixed positioning would
          otherwise anchor to the backdrop-blur pill ancestor. */}
      {mounted
        ? createPortal(
            <>
              {/* Backdrop — always mounted, fades via opacity. */}
              <div
                aria-hidden={!open}
                inert={open ? undefined : true}
                onClick={close}
                className={cn(
                  "fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm motion-safe:transition-opacity motion-safe:duration-200",
                  open ? "opacity-100" : "pointer-events-none opacity-0"
                )}
              />
              {/* Panel — always mounted, slides via transform. */}
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                inert={open ? undefined : true}
                aria-hidden={!open}
                className={cn(
                  "fixed inset-y-0 right-0 z-[60] flex w-80 max-w-[85vw] flex-col rounded-l-[20px] bg-white shadow-[0_8px_30px_rgba(0,55,115,0.18)] ring-1 ring-kumo-line",
                  "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out",
                  open ? "translate-x-0" : "translate-x-full"
                )}
              >
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="flex items-center gap-2.5">
                    <Image src="/logorounded.webp" alt="notchbud logo" width={28} height={28} className="size-7 rounded-lg object-cover" />
                    <span className="text-base font-semibold text-brand-950">notchbud</span>
                  </span>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    aria-label="Close menu"
                    className="focus-ring pressable grid size-8 place-items-center rounded-full text-brand-950 hover:bg-white/60"
                  >
                    <X size={20} strokeWidth={2} absoluteStrokeWidth aria-hidden="true" />
                  </button>
                </div>
                <nav className="flex flex-col px-5 py-2" aria-label="Mobile">
                  {links.map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={close}
                      className="focus-ring pressable flex items-center justify-between border-b border-kumo-line py-4 text-left text-sm font-medium text-brand-950 last:border-b-0"
                    >
                      {label}
                      <ArrowRight {...ICON} aria-hidden="true" />
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto grid gap-2 p-5">
                  <Link
                    href="/download"
                    onClick={close}
                    className={cn(buttonVariants(), "h-11 w-full rounded-full")}
                  >
                    <Download {...ICON} />
                    download
                  </Link>
                  <Link
                    href="https://github.com/ankitdey01/notchbud"
                    onClick={close}
                    className={cn(buttonVariants({ variant: "outline" }), "h-11 w-full rounded-full")}
                  >
                    <GithubMark />
                    star on github
                  </Link>
                </div>
              </div>
            </>,
            document.body
          )
        : null}
    </>
  );
}
