"use client";

import * as React from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const avatarImage =
  "size-full rounded-full object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10";

export function AccountMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const itemRef = React.useRef<HTMLButtonElement>(null);
  const closeTimer = React.useRef<number | undefined>(undefined);

  const closeMs = () =>
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--dropdown-close-dur")
    ) || 150;

  const openDropdown = React.useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setClosing(false);
    setOpen(true);
  }, []);

  const closeDropdown = React.useCallback(() => {
    setOpen((wasOpen) => {
      if (!wasOpen) return wasOpen;
      setClosing(true);
      window.clearTimeout(closeTimer.current);
      closeTimer.current = window.setTimeout(() => setClosing(false), closeMs());
      return false;
    });
  }, []);

  React.useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  React.useEffect(() => {
    if (!open) return;
    itemRef.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) closeDropdown();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDropdown();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closeDropdown]);

  if (!user) return null;

  const name = user.fullName || user.primaryEmailAddress?.emailAddress || "Account";
  const email = user.primaryEmailAddress?.emailAddress;
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={boxRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? closeDropdown() : openDropdown())}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className={cn(
          // Kumo content-text-size: 14px trigger label.
          "focus-ring pressable grid size-8 place-items-center rounded-full bg-brand-950/[0.06] text-sm font-semibold text-brand-950",
          !user.imageUrl && "ring-1 ring-kumo-line"
        )}
      >
        {user.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.imageUrl} alt="" className={avatarImage} />
        ) : (
          initials
        )}
      </button>

      {/* Kumo dialog-rendering: never conditionally render â€” always mounted,
          visibility via open/is-closing so open/close animation can play. */}
      <div
        role="menu"
        inert={open ? undefined : true}
        aria-hidden={!open}
        data-origin="top-right"
        className={cn(
          "t-dropdown",
          open && "is-open",
          closing && "is-closing",
          // Kumo shadow-borders: ring + shadow, never border.
          // Kumo concentric-border-radius: outer 20px = inner 12px + 8px padding.
          // Kumo collapse-content-size: fixed w-64 shell so content never squeezes.
          "absolute right-0 top-full z-50 mt-2 w-64 rounded-[20px] bg-white p-2 text-left shadow-[0_8px_30px_rgba(0,55,115,0.18)] ring-1 ring-kumo-line",
          "max-h-[min(24rem,_calc(100dvh-5rem))] overflow-y-auto overscroll-contain"
        )}
      >
        <div className="w-64 max-w-full">
          {/* Kumo related-text-spacing: avatar + identity stay tight, divider keeps loose rhythm. */}
          <div className="flex items-center gap-3 px-3 py-2.5">
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-full bg-brand-950/[0.06] text-sm font-semibold text-brand-950",
                !user.imageUrl && "ring-1 ring-kumo-line"
              )}
            >
              {user.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.imageUrl} alt="" className={avatarImage} />
              ) : (
                initials
              )}
            </span>
            <span className="grid min-w-0 gap-1.5">
              <span className="block truncate text-sm font-semibold text-brand-950">{name}</span>
              {email && (
                <span className="block truncate text-sm text-slate-500">{email}</span>
              )}
            </span>
          </div>
          <div className="my-1 h-px bg-brand-950/10" />
          <button
            ref={itemRef}
            type="button"
            role="menuitem"
            onClick={() => {
              closeDropdown();
              triggerRef.current?.focus();
              void signOut({ redirectUrl: "/" });
            }}
            // Kumo text-spacing: px-3 py-2.5 (horizontal > vertical).
            // Kumo icon-alignment: 14px icon with 14px label, first-line centered.
            // Hover is immediate â€” no color transition.
            className="focus-ring pressable flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-kumo-tint hover:text-brand-950"
          >
            <LogOut className="size-3.5 shrink-0" size={14} strokeWidth={2} absoluteStrokeWidth />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
