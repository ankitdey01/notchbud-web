"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useSignIn } from "@clerk/nextjs";
import { X } from "lucide-react";
import { Mascot } from "page-mascot";
import { cn } from "@/lib/utils";

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

// Playful sign-in: live mascot + pixel stickers, Google SSO via Clerk.
// The modal is always mounted so open/close can animate (Kumo dialog rule).
export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signIn, errors, fetchStatus } = useSignIn();
  const [starting, setStarting] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const ctaRef = React.useRef<HTMLButtonElement>(null);
  const busy = starting || fetchStatus === "fetching";
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  });
  // Portal target: an ancestor uses backdrop-blur, which would trap fixed
  // positioning — the dialog mounts on document.body instead.
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  React.useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    ctaRef.current?.focus();
    // Inert everything outside the dialog: it lives in a body-level portal,
    // so every other body child is background.
    const background = [...document.body.children].filter((el) => el !== rootRef.current);
    background.forEach((el) => el.setAttribute("inert", ""));
    const focusables = () => [
      ...(rootRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) ?? []),
    ];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      // Keep Tab and Shift+Tab cycling inside the dialog.
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      background.forEach((el) => el.removeAttribute("inert"));
      if (trigger && document.contains(trigger)) trigger.focus();
    };
  }, [open ]);

  const startGoogle = async () => {
    if (!signIn || busy) return;
    setStarting(true);
    setFailed(false);
    const { error } = await signIn.sso({
      strategy: "oauth_google",
      redirectUrl: "/",
      redirectCallbackUrl: "/sso-callback",
    });
    if (error) {
      setFailed(true);
      setStarting(false);
    }
  };

  const message = failed
    ? "google sign-in failed. try again."
    : errors?.global?.[0]?.message;

  return mounted
    ? createPortal(
        <div
          ref={rootRef}
          inert={!open ? true : undefined}
          aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[70] grid place-items-center p-6 transition-opacity duration-200",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div aria-hidden className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in to notchbud"
        className={cn(
          "pressable relative w-[min(400px,100%)] rounded-[20px] bg-white px-6 pb-5 pt-6 text-center shadow-[0_8px_30px_-12px_rgba(0,20,60,0.35)] ring-1 ring-kumo-line transition-transform duration-200",
          open ? "scale-100" : "scale-95"
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sign in"
          className="focus-ring pressable absolute right-3 top-3 grid size-8 place-items-center rounded-full text-slate-500 hover:bg-kumo-tint hover:text-brand-950"
        >
          <X size={14} strokeWidth={2} absoluteStrokeWidth aria-hidden="true" />
        </button>
        <img
          src="/pets/pet-happy-clean.webp"
          alt=""
          aria-hidden
          className="absolute -left-5 -top-6 size-12 -rotate-12"
          style={{ imageRendering: "pixelated" }}
        />
        <img
          src="/pets/pet-sleep-clean.webp"
          alt=""
          aria-hidden
          className="absolute -bottom-3 -right-4 size-10 rotate-12"
          style={{ imageRendering: "pixelated" }}
        />
        <div className="flex justify-center">
          <Mascot
            directions="/cat-directions.webp"
            reactions="/cat-reactions.webp"
            size={96}
            label="Pixel cat mascot watching your cursor"
          />
        </div>
        <p className="mt-3 text-base font-semibold text-brand-950">Sign in to notchbud</p>
        <p className="mt-1.5 text-sm text-slate-600">Welcome back! Please sign in to continue</p>
        <button
          ref={ctaRef}
          type="button"
          onClick={startGoogle}
          disabled={!signIn || busy}
          className="focus-ring pressable mt-5 grid h-11 w-full place-items-center rounded-full bg-white text-sm font-medium text-brand-950 ring-1 ring-kumo-line hover:bg-kumo-tint disabled:cursor-wait disabled:opacity-60"
        >
          <span className="inline-flex items-center gap-2">
            <GoogleMark className="size-4" />
            {busy ? "opening google…" : "Continue with Google"}
          </span>
        </button>
        {message && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {message}
          </p>
        )}
        <p className="mt-4 text-[12px] text-slate-500">Secured by Clerk</p>
      </div>
    </div>,
    document.body
  )
    : null;
}
