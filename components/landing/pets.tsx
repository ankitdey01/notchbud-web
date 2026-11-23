"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type DraggablePetProps = {
  src: string;
  alt: string;
  size?: number | string;
  className?: string;
  /** Size to 1em on mobile, fixed `size` on sm+ screens. */
  responsive?: boolean;
};

  /** Moved stickers escape section clipping; their inline slot preserves layout. */
export function DraggablePet({ src, alt, size = 22, className, responsive }: DraggablePetProps) {
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const slot = React.useRef<HTMLSpanElement>(null);
  const start = React.useRef({ x: 0, y: 0, ox: 0, oy: 0, pointerId: -1 });

  React.useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => {
      if (e.pointerId !== start.current.pointerId) return;
      setPos({
        x: start.current.ox + e.pageX - start.current.x,
        y: start.current.oy + e.pageY - start.current.y,
      });
    };
    const stop = (e: PointerEvent) => {
      if (e.pointerId === start.current.pointerId) setDragging(false);
    };
    const cancel = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    window.addEventListener("blur", cancel);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      window.removeEventListener("blur", cancel);
    };
  }, [dragging]);

  const beginDrag = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!e.isPrimary || e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const origin = pos ?? { x: rect.left + window.scrollX, y: rect.top + window.scrollY };
    start.current = { x: e.pageX, y: e.pageY, ox: origin.x, oy: origin.y, pointerId: e.pointerId };
    // The slot stays mounted when the visible sticker moves into the portal.
    slot.current?.setPointerCapture(e.pointerId);
    setPos(origin);
    setDragging(true);
  };

  // Dragged sticker keeps its on-screen px size (slot may be sized in em).
  const slotPx = slot.current?.offsetWidth;
  const stickerSize = slotPx || size;
  const px = typeof size === "number" ? `${size}px` : size;
  const sticker = (
    <span
      role="img"
      aria-label={alt}
      onPointerDown={beginDrag}
      title="Drag me — double-click to reset"
      className={cn("inline-block touch-none select-none", dragging ? "cursor-grabbing" : "cursor-grab")}
      // Page chrome uses 50. Active stickers sit above the other stickers.
      style={pos ? { position: "absolute", left: pos.x, top: pos.y, width: stickerSize, height: stickerSize, zIndex: dragging ? 61 : 60, pointerEvents: "auto" } : undefined}
    >
      <img
        src={src} alt="" aria-hidden draggable={false}
        className={cn("pet-bob", !pos && responsive && "h-[1em] w-[1em] sm:h-[var(--pet-size)] sm:w-[var(--pet-size)]")}
        style={
          pos
            ? { width: stickerSize, height: stickerSize, imageRendering: "pixelated", display: "block" }
            : responsive
              ? { imageRendering: "pixelated", display: "block" }
              : { width: size, height: size, imageRendering: "pixelated", display: "block" }
        }
      />
    </span>
  );

  return (
    <span ref={slot} onDoubleClick={() => { setDragging(false); setPos(null); }}
      className={cn("inline-block touch-none select-none", responsive ? "align-[-0.12em] sm:align-[-4px]" : "align-[-4px]", className)}
      style={responsive ? ({ "--pet-size": px } as React.CSSProperties) : { width: size, height: size }}>
      <style>{`@keyframes pet-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
.pet-bob{animation:pet-bob 2.4s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.pet-bob{animation:none}}`}</style>
      {pos ? createPortal(sticker, document.body) : sticker}
    </span>
  );
}

/** Sleeping cat that sits on top of the pricing card. */
export function SleepingCat({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <span aria-hidden className={cn("pointer-events-none absolute -top-12 left-8", className)}>
      <style>{`@keyframes pet-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
.pet-bob{animation:pet-bob 2.4s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.pet-bob{animation:none}}`}</style>
      <img
        src="/pets/pet-sleep-clean.webp"
        alt=""
        width={size}
        height={size}
        draggable={false}
        className="pet-bob"
        style={{ width: size, height: "auto", imageRendering: "pixelated", display: "block" }}
      />
    </span>
  );
}
