"use client";

import * as React from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

// Live island demo — pixel-matched to the real notchbud island.
// Geometry mirrors src/state.rs exactly (1 unit = 1px):
// body 420 wide, flare r 16.8 (total silhouette 453.6), bottom r 35.2.
// The top swoops are the same two cubics as render.rs (cs 0.27, ch 0.17).
// The island is always open — no hover motion.
// Screens mirror ui/index.html: home greeting, /chat history, and the
// menu / chats / notifications / settings overlays (same dotted panels).

const TOTAL_W = 453.6;
const BODY_W = 420;
const BOT_R = 35.2;

type Turn = { role: "user" | "assistant"; text: string };
type Page = "home" | "menu" | "chats" | "notifications" | "settings";

const DEMO_REPLY = "Download me to try out";

function greetingFor(hour: number, name = "Bro") {
  if (hour < 12) return `Good Morning, ${name}`;
  if (hour < 17) return `Good Afternoon, ${name}`;
  return `Good Evening, ${name}`;
}

const ISLAND_FONT = '"SF Pro Text", system-ui, -apple-system, "Segoe UI", sans-serif';

// Topbar buttons ride the real island treatment: 28px circle, ghost until
// active (the highlighted icon says which overlay page is open).
const CHROME_BTN =
  "pressable grid size-7 flex-none place-items-center rounded-full text-[#ececf1] hover:bg-white/[0.08]";
const PILL_BTN = "pressable grid size-7 flex-none place-items-center rounded-full";
// One shared dotted panel for every overlay page (menu grid, empty states,
// profile card) — exactly the real island's panel.
const DOTTED = "rounded-[24px] border border-dashed border-white/[0.14] bg-white/[0.03]";

function GridIcon() {
  return (
    <svg aria-hidden xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C4.52 3 5.08 3 6.2 3h.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C10 4.52 10 5.08 10 6.2v.6c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C8.48 10 7.92 10 6.8 10h-.6c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C3 8.48 3 7.92 3 6.8z" fill="none" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 17.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C4.52 14 5.08 14 6.2 14h.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C10 15.52 10 16.08 10 17.2v.6c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C8.48 21 7.92 21 6.8 21h-.6c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C3 19.48 3 18.92 3 17.8z" fill="none" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 6.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C15.52 3 16.08 3 17.2 3h.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C21 4.52 21 5.08 21 6.2v.6c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C19.48 10 18.92 10 17.8 10h-.6c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C14 8.48 14 7.92 14 6.8z" fill="none" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 17.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C15.52 14 16.08 14 17.2 14h.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C21 15.52 21 16.08 21 17.2v.6c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C19.48 21 18.92 21 17.8 21h-.6c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C14 19.48 14 18.92 14 17.8z" fill="none" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.159 17.724a60 60 0 0 1-3.733-.297 1.587 1.587 0 0 1-1.33-2.08c.161-.485.324-.963.367-1.478l.355-4.26a7.207 7.207 0 0 1 14.365 0l.355 4.262c.043.515.206.993.367 1.479a1.587 1.587 0 0 1-1.33 2.077 60 60 0 0 1-3.732.297m-5.684 0q2.841.135 5.684 0m-5.684 0v.434a2.842 2.842 0 1 0 5.684 0v-.434" fill="none" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg aria-hidden xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.2 4.12c.632-.618.947-.927 1.31-1.043.319-.103.661-.103.98 0 .363.116.678.425 1.31 1.043l.303.297c.273.267.409.4.567.497q.211.128.453.187c.18.044.37.046.752.05l.425.005c.883.009 1.325.013 1.663.188.298.153.54.395.694.693.174.338.178.78.187 1.663l.005.425c.004.382.006.573.05.752q.059.242.187.453c.096.158.23.295.497.567l.297.304c.618.63.927.946 1.043 1.309.103.319.103.661 0 .98-.116.363-.425.678-1.043 1.31l-.297.303c-.267.273-.4.409-.497.567q-.128.211-.187.453c-.044.18-.046.37-.05.752l-.005.425c-.009.883-.013 1.325-.187 1.663-.154.298-.396.54-.694.694-.338.174-.78.178-1.663.187l-.425.005c-.382.004-.573.006-.752.05q-.24.059-.453.187c-.158.096-.294.23-.567.497l-.304.297c-.63.618-.946.927-1.309 1.043a1.6 1.6 0 0 1-.98 0c-.363-.116-.678-.425-1.31-1.043l-.303-.297c-.272-.267-.409-.4-.567-.497a1.6 1.6 0 0 0-.453-.187c-.18-.044-.37-.046-.752-.05l-.425-.005c-.883-.009-1.325-.013-1.663-.187a1.6 1.6 0 0 1-.693-.694c-.175-.338-.18-.78-.188-1.663l-.005-.425c-.004-.382-.006-.573-.05-.752a1.6 1.6 0 0 0-.187-.453c-.096-.158-.23-.294-.497-.567l-.297-.304c-.618-.63-.927-.946-1.043-1.309a1.6 1.6 0 0 1 0-.98c.116-.363.425-.678 1.043-1.31l.297-.303c.267-.272.4-.409.497-.567q.128-.212.187-.453c.044-.18.046-.37.05-.752l.005-.425c.009-.883.013-1.325.188-1.663a1.6 1.6 0 0 1 .693-.693c.338-.175.78-.18 1.663-.188l.425-.005c.382-.004.573-.006.752-.05q.242-.059.453-.187c.158-.096.295-.23.567-.497z" fill="none" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.991 12c0-.552.457-1 1.01-1s1.008.448 1.008 1-.457 1-1.009 1-1.009-.448-1.009-1Z" fill="none" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg aria-hidden xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12.759c0-1.017 0-1.526.119-2.002a4 4 0 0 1 .513-1.19c.265-.414.634-.763 1.374-1.461l2.6-2.456c1.546-1.46 2.32-2.19 3.201-2.466a4 4 0 0 1 2.386 0c.882.275 1.655 1.006 3.201 2.466l2.6 2.456c.74.698 1.11 1.047 1.374 1.46a4 4 0 0 1 .513 1.191c.119.476.119.985.119 2.002v3.574c0 1.085 0 1.628-.12 2.073a3.5 3.5 0 0 1-2.474 2.475c-.445.119-.988.119-2.073.119-.31 0-.465 0-.592-.034a1 1 0 0 1-.707-.707C15 20.132 15 19.977 15 19.667V17c0-.465 0-.697-.03-.891a2.5 2.5 0 0 0-2.079-2.078C12.697 14 12.464 14 12 14s-.697 0-.891.03a2.5 2.5 0 0 0-2.079 2.08C9 16.303 9 16.535 9 17v2.667c0 .31 0 .465-.034.592a1 1 0 0 1-.707.707C8.132 21 7.977 21 7.667 21c-1.085 0-1.628 0-2.073-.12a3.5 3.5 0 0 1-2.475-2.474C3 17.96 3 17.418 3 16.333z" fill="none" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg aria-hidden xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h8m-8 4h4m9-2a9 9 0 0 1-10.272 8.91c-1.203-.17-1.805-.255-1.964-.267-.257-.02-.165-.016-.423-.014-.159 0-.34.014-.702.04l-2.153.153c-.857.062-1.286.092-1.607-.06a1.35 1.35 0 0 1-.641-.641c-.152-.32-.122-.75-.06-1.607l.153-2.153c.026-.362.04-.543.04-.702.002-.258.006-.166-.014-.423-.012-.159-.098-.76-.268-1.964A9 9 0 1 1 21 12Z" fill="none" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg aria-hidden xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.83 6a30.2 30.2 0 0 0-5.62 5.406A.95.95 0 0 0 4 12m5.83 6a30.2 30.2 0 0 1-5.62-5.406A.95.95 0 0 1 4 12m0 0h16" fill="none" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
      <g clipPath="url(#island-greet-sun)">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 23v-1m-7.778-2.222.707-.707M1 12h1m2.222-7.778.707.707M12 2V1m7.071 3.929.707-.707M22 12h1m-3.929 7.071.707.707M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" fill="none" />
      </g>
      <defs>
        <clipPath id="island-greet-sun">
          <path fill="none" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg aria-hidden xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.577 5.764c.46-.893.69-1.34.999-1.485a1 1 0 0 1 .848 0c.31.145.539.592.999 1.485l1.191 2.315c.08.154.12.232.171.3a1 1 0 0 0 .157.165c.065.055.14.098.291.186l2.386 1.387c.782.454 1.173.681 1.305.977a1 1 0 0 1 0 .812c-.132.296-.523.523-1.305.977l-2.386 1.387c-.15.088-.226.131-.291.186q-.088.073-.157.165c-.051.068-.091.146-.17.3l-1.192 2.315c-.46.893-.69 1.34-.999 1.485a1 1 0 0 1-.848 0c-.31-.145-.539-.592-.999-1.485l-1.191-2.315c-.08-.154-.12-.232-.171-.3a1 1 0 0 0-.157-.165 2 2 0 0 0-.291-.186l-2.386-1.387c-.782-.454-1.173-.681-1.305-.977a1 1 0 0 1 0-.812c.132-.296.523-.523 1.305-.977L6.767 8.73c.15-.088.226-.131.291-.186a1 1 0 0 0 .157-.165 2 2 0 0 0 .17-.3z" fill="none" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.46 19.406c-.254-.317-.381-.476-.429-.659a1 1 0 0 1 0-.494c.048-.183.175-.342.428-.66l.816-1.019c.254-.317.38-.475.527-.535a.52.52 0 0 1 .396 0c.146.06.273.218.527.535l.816 1.02c.253.317.38.476.428.659a1 1 0 0 1 0 .494c-.048.183-.175.342-.428.66l-.816 1.019c-.254.317-.38.475-.527.535a.52.52 0 0 1-.396 0c-.146-.06-.273-.218-.527-.535z" fill="none" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.23 4.362c-.127-.126-.19-.19-.214-.263a.32.32 0 0 1 0-.198c.023-.073.087-.137.214-.263l.407-.408c.127-.127.19-.19.264-.214a.32.32 0 0 1 .198 0c.073.023.137.087.264.214l.407.408c.127.126.19.19.214.263a.32.32 0 0 1 0 .198c-.024.073-.087.137-.214.263l-.407.408c-.127.127-.19.19-.264.214a.32.32 0 0 1-.198 0c-.073-.023-.137-.087-.264-.214z" fill="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg aria-hidden xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24" opacity="0.8">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 18 6-6m0 0 6-6m-6 6L6 6m6 6 6 6" fill="none" />
    </svg>
  );
}

function ShotIcon() {
  return (
    <svg aria-hidden xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 11c0-2.8 0-4.2.545-5.27A5 5 0 0 1 4.73 3.545C5.8 3 7.2 3 10 3h4c2.8 0 4.2 0 5.27.545a5 5 0 0 1 2.185 2.185C22 6.8 22 8.2 22 11v2c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C18.2 21 16.8 21 14 21h-4c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C2 17.2 2 15.8 2 13z" fill="none" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" fill="none" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg aria-hidden xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9.83a30.2 30.2 0 0 1 5.406-5.62A.95.95 0 0 1 12 4m6 5.83a30.2 30.2 0 0 0-5.406-5.62A.95.95 0 0 0 12 4m0 0v16" fill="none" />
    </svg>
  );
}

// Top flare strip: the exact silhouette crest from render.rs. Total width
// 453.6, body starts at x=16.8 / ends at 436.8, flare height 16.8.
function FlareStrip() {
  return (
    <svg aria-hidden viewBox="0 0 453.6 16.8" className="block h-auto w-full">
      <path
        fill="#000"
        d="M0 0H453.6C450.744 0 445.872 0 441.336 4.536C436.8 9.072 436.8 13.944 436.8 16.8H16.8C16.8 13.944 16.8 9.072 12.264 4.536C7.728 0 2.856 0 0 0Z"
      />
    </svg>
  );
}

// Exact /chat bubbles from ui/styles.css: user = blue pill right,
// assistant/stream = dark rounded-16 left, thinking = shimmer text.
function TurnBubble({ mine, children }: { mine: boolean; children: React.ReactNode }) {
  return (
    <p
      className={
        mine
          ? "max-w-[85%] self-end rounded-full bg-[#007AFF] text-[13.5px] leading-[1.4] text-white"
          : "max-w-full self-start rounded-2xl bg-[#1c1c1e] text-[13.5px] leading-[1.4] text-[#f2f2f7]"
      }
      style={{ padding: "8px 14px" }}
    >
      {children}
    </p>
  );
}

function PromptBox({
  value,
  onChange,
  onSubmit,
  attached,
  capturing,
  onCapture,
  onClearShot,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  attached: boolean;
  capturing: boolean;
  onCapture: (el: HTMLButtonElement) => void;
  onClearShot: () => void;
  disabled: boolean;
}) {
  const ready = value.trim().length > 0 && !disabled;
  return (
    <form
      className="-mb-1 flex-none"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div
        className="flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.05]"
        style={{ padding: "3px 3px 3px 14px" }}
      >
        <span className="grid flex-none place-items-center text-[#8e8e93]" aria-hidden>
          <SparkleIcon />
        </span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask anything…"
          maxLength={400}
          aria-label="Ask notchbud anything"
          className="min-w-0 flex-1 bg-transparent text-[13.5px] text-[#f2f2f7] outline-none placeholder:text-[rgba(235,235,245,0.45)]"
          style={{ padding: "6px 0" }}
        />
        {(capturing || attached) && (
          <span className="flex flex-none items-center gap-[2px]" aria-label="Screenshot attached">
            {capturing ? (
              <span
                aria-hidden
                className="block size-7 rounded-lg"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.06) 100%)",
                  backgroundSize: "200% 100%",
                  animation: "thinking-shimmer 1.2s linear infinite",
                }}
              />
            ) : (
              <Image
                src="/demobackground.webp"
                alt=""
                width={28}
                height={28}
                className="size-7 rounded-lg border border-white/[0.14] bg-white/[0.05] object-cover"
              />
            )}
            <button
              type="button"
              onClick={onClearShot}
              aria-label="Remove screenshot"
              className="pressable grid size-5 flex-none place-items-center rounded-full border border-transparent text-[#9ca3af] hover:bg-white/[0.08] hover:text-[#ff5a52]"
            >
              <XIcon />
            </button>
          </span>
        )}
        <button
          type="button"
          onClick={(e) => onCapture(e.currentTarget)}
          aria-label="Take a screenshot"
          className={cn(PILL_BTN, "text-[#ececf1] hover:bg-white/[0.08]")}
        >
          <ShotIcon />
        </button>
        <button
          type="submit"
          disabled={!ready}
          aria-label="Send"
          className={cn(
            PILL_BTN,
            ready
              ? "bg-[#007AFF] text-white shadow-[0_1px_2px_rgba(0,122,255,0.35),inset_0_1px_0_rgba(255,255,255,0.16)]"
              : "bg-white/[0.12] text-[#8e8e93]"
          )}
        >
          <ArrowUpIcon />
        </button>
      </div>
    </form>
  );
}

const TILES: { label: string; target: Page; icon: () => React.JSX.Element }[] = [
  { label: "Home", target: "home", icon: HomeIcon },
  { label: "Chats", target: "chats", icon: ChatIcon },
  { label: "Notifications", target: "notifications", icon: BellIcon },
  { label: "Settings", target: "settings", icon: GearIcon },
];

export function IslandDemo() {
  const { user, isSignedIn } = useUser();
  const firstName = isSignedIn ? user?.firstName || user?.fullName?.split(/\s+/)[0] || "Bro" : "Bro";
  const [page, setPage] = React.useState<Page>("home");
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const [value, setValue] = React.useState("");
  const [attached, setAttached] = React.useState(false);
  const [capturing, setCapturing] = React.useState(false);
  const [thinking, setThinking] = React.useState(false);
  const [stream, setStream] = React.useState("");
  const [greeting, setGreeting] = React.useState("Good Afternoon, Bro");

  const historyRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<number | null>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [fixedH, setFixedH] = React.useState<number | null>(null);
  const shutterSound = React.useRef<HTMLAudioElement | null>(null);
  const attachTimer = React.useRef<number | null>(null);

  // Chat is a screen, not an overlay: once a turn exists the topbar hides
  // and the floating back button owns the top-left (like ui/index.html).
  const inChat = turns.length > 0 || thinking || stream !== "";
  const screen = page !== "home" ? page : inChat ? "chat" : "home";

  const toggle = React.useCallback(
    (target: Exclude<Page, "home">) => setPage((p) => (p === target ? "home" : target)),
    []
  );
  const playShutter = React.useCallback(() => {
    try {
      if (!shutterSound.current) {
        shutterSound.current = new Audio("/camera-shutter-release.wav");
        shutterSound.current.preload = "auto";
      }
      shutterSound.current.currentTime = 0;
      shutterSound.current.play().catch(() => {});
    } catch {
      // Audio unavailable — the attach toggle still works.
    }
  }, []);
  // Camera always re-takes like the real island: skeleton shimmer in the
  // thumbnail's exact spot, then the flight lands and swaps in the image.
  // The x button clears. No toggle, no tint on the camera button.
  const handleCapture = React.useCallback(
    (el: HTMLButtonElement | null) => {
      playShutter();
      if (attachTimer.current) window.clearTimeout(attachTimer.current);
      setAttached(false);
      setCapturing(true);
      try {
        const r = el?.getBoundingClientRect();
        window.dispatchEvent(
          new CustomEvent("notchbud:capture", {
            detail: r ? { x: r.left, y: r.top, width: r.width, height: r.height } : null,
          })
        );
      } catch {
        // Event dispatch is best-effort — the thumbnail still attaches.
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setCapturing(false);
        setAttached(true);
        return;
      }
      attachTimer.current = window.setTimeout(() => {
        setCapturing(false);
        setAttached(true);
      }, 700);
    },
    [playShutter]
  );
  const handleClearShot = React.useCallback(() => {
    if (attachTimer.current) window.clearTimeout(attachTimer.current);
    setCapturing(false);
    setAttached(false);
    try {
      window.dispatchEvent(new CustomEvent("notchbud:cancel-capture"));
    } catch {
      // Best-effort — the flight overlay clears on its own.
    }
  }, []);
  const goHome = React.useCallback(() => setPage("home"), []);
  const backFromChat = React.useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setTurns([]);
    setThinking(false);
    setStream("");
    setPage("home");
  }, []);

  React.useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (attachTimer.current) window.clearTimeout(attachTimer.current);
    },
    []
  );
  React.useEffect(() => {
    setGreeting(greetingFor(new Date().getHours(), firstName));
  }, [firstName]);
  React.useEffect(() => {
    const measure = () => {
      // Lock to the home height once: the shell never grows, turns and
      // overlay pages scroll inside it.
      if (wrapRef.current && !inChat && page === "home") setFixedH(wrapRef.current.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    if (document.fonts) document.fonts.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [inChat, page]);
  React.useEffect(() => {
    const el = historyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, stream, thinking, screen, attached]);

  const submitValue = React.useCallback(() => {
    const t = value.trim();
    if (!t || thinking) return;
    // A sent message lands on the chat screen; the prompt stays pinned to
    // the shell bottom in both screens so nothing shifts.
    setPage("home");
    setTurns((prev) => [...prev, { role: "user", text: t }]);
    setValue("");
    if (attachTimer.current) window.clearTimeout(attachTimer.current);
    setCapturing(false);
    setAttached(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTurns((prev) => [...prev, { role: "assistant", text: DEMO_REPLY }]);
      return;
    }
    setThinking(true);
    setStream("");
    window.setTimeout(() => {
      setThinking(false);
      let i = 0;
      timerRef.current = window.setInterval(() => {
        i += 2;
        setStream(DEMO_REPLY.slice(0, i));
        if (i >= DEMO_REPLY.length) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          setTurns((prev) => [...prev, { role: "assistant", text: DEMO_REPLY }]);
          setStream("");
        }
      }, 24);
    }, 650);
  }, [thinking, value]);

  const chromeBtn = (active: boolean) => cn(CHROME_BTN, active && "bg-white/[0.08] text-white");
  const initial = (firstName.trim()[0] || "B").toUpperCase();

  return (
    <div
      ref={wrapRef}
      style={{
        width: 453.6,
        fontFamily: ISLAND_FONT,
        height: fixedH ?? undefined,
        filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.35))",
      }}
      className="pointer-events-auto flex flex-col text-[#f2f2f7]"
      role="region"
      aria-label="notchbud live demo. click around."
    >
      <div className="flex-none">
        <FlareStrip />
      </div>
      <div
        className="relative mx-auto flex min-h-0 flex-1 flex-col bg-black"
        style={{
          width: `${(BODY_W / TOTAL_W) * 100}%`,
          borderRadius: `0 0 ${BOT_R}px ${BOT_R}px`,
          marginTop: "-1px",
          padding: "6px 12px 12px",
          boxShadow: "0 32px 90px -24px rgba(0,0,0,0.65)",
          overflow: "hidden",
        }}
      >
        <style>{`@keyframes thinking-shimmer{from{background-position:200% 0}to{background-position:-200% 0}}.demo-thinking{align-self:flex-start;font-size:13.5px;font-weight:600;background:linear-gradient(90deg,rgba(255,255,255,0.25) 0%,#fff 50%,rgba(255,255,255,0.25) 100%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 6px rgba(255,255,255,0.35));animation:thinking-shimmer 1.4s linear infinite}`}</style>

        {/* Top chrome — hidden on the chat screen like the real island. */}
        {screen !== "chat" && (
          <div className="grid w-full flex-none grid-cols-[1fr_auto_1fr] items-center">
            <span className="justify-self-start">
              <button
                type="button"
                aria-label="Menu"
                aria-pressed={screen === "menu"}
                onClick={() => toggle("menu")}
                className={chromeBtn(screen === "menu")}
              >
                <GridIcon />
              </button>
            </span>
            <button
              type="button"
              aria-label="Notchbud home"
              onClick={goHome}
              className="pressable flex items-center gap-2 rounded-full px-1.5 py-0.5 hover:bg-white/[0.08]"
            >
              <Image src="/logorounded.webp" alt="" width={20} height={20} className="size-5 rounded-[6px] object-cover" />
              <span className="text-sm font-semibold text-white" style={{ letterSpacing: "0.1px" }}>
                Notchbud
              </span>
            </button>
            <span className="flex items-center justify-end gap-2">
              <button
                type="button"
                aria-label="Notifications"
                aria-pressed={screen === "notifications"}
                onClick={() => toggle("notifications")}
                className={chromeBtn(screen === "notifications")}
              >
                <BellIcon />
              </button>
              <button
                type="button"
                aria-label="Settings"
                aria-pressed={screen === "settings"}
                onClick={() => toggle("settings")}
                className={chromeBtn(screen === "settings")}
              >
                <GearIcon />
              </button>
            </span>
          </div>
        )}

        {screen === "home" && (
          <div className="flex min-h-0 flex-1 flex-col gap-2 pt-2">
            {/* Greeting owns the free space so the prompt sits at the shell
                bottom already — sending the first message swaps this slot
                for history without moving the prompt. */}
            <div className="flex min-h-0 flex-1 items-center gap-2.5 px-0.5">
              <span className="grid size-8 flex-none place-items-center rounded-[10px] bg-[#007AFF]/[.16] text-[#007AFF]">
                <SunIcon />
              </span>
              <h1 className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[17px] font-bold leading-normal text-white">
                {greeting}
              </h1>
            </div>
            <PromptBox
              value={value}
              onChange={setValue}
              onSubmit={submitValue}
              attached={attached}
              capturing={capturing}
              onCapture={handleCapture}
              onClearShot={handleClearShot}
              disabled={thinking}
            />
          </div>
        )}

        {screen === "chat" && (
          <div className="relative flex min-h-0 flex-1 flex-col gap-2 pt-2">
            <div className="absolute left-0 top-2 z-10 flex">
              <button
                type="button"
                aria-label="Back to home"
                onClick={backFromChat}
                className="pressable grid size-7 flex-none place-items-center rounded-full bg-[rgba(28,28,30,0.85)] text-[#ececf1]"
              >
                <BackIcon />
              </button>
            </div>
            {/* Always mounted while chatting: turns fill it, never grow it. */}
            <div
              ref={historyRef}
              style={{ scrollbarWidth: "none", paddingTop: 30 }}
              className="flex min-h-0 flex-1 flex-col gap-[10px] overflow-y-auto px-3 text-sm leading-[1.45] [&::-webkit-scrollbar]:hidden"
            >
              {turns.map((t, i) => (
                <TurnBubble key={i} mine={t.role === "user"}>
                  {t.text}
                </TurnBubble>
              ))}
              {thinking && <p className="demo-thinking">Thinking</p>}
              {stream && (
                <TurnBubble mine={false}>
                  {stream}
                  <span className="animate-caret text-white">▏</span>
                </TurnBubble>
              )}
            </div>
            <PromptBox
              value={value}
              onChange={setValue}
              onSubmit={submitValue}
              attached={attached}
              capturing={capturing}
              onCapture={handleCapture}
              onClearShot={handleClearShot}
              disabled={thinking}
            />
          </div>
        )}

        {screen === "menu" && (
          <div className="flex min-h-0 flex-1 flex-col pt-3">
            <div
              className={cn(DOTTED, "grid min-h-0 flex-1 grid-cols-2 content-center gap-[2px] overflow-y-auto")}
              style={{ padding: "8px 10px" }}
            >
              {TILES.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  aria-label={`Go to ${t.label}`}
                  onClick={() => (t.target === "home" ? goHome() : setPage(t.target))}
                  className="pressable flex items-center justify-center gap-[5px] rounded-lg px-2 py-1.5 text-[12px] text-[#ececf1] hover:bg-white/[0.08]"
                >
                  <span className="text-[#007AFF]">
                    <t.icon />
                  </span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {screen === "notifications" && (
          <div className="flex min-h-0 flex-1 flex-col pt-3">
            <div className={cn(DOTTED, "flex min-h-0 flex-1 items-center gap-[10px]")} style={{ padding: "8px 10px" }}>
              <span className="grid size-8 flex-none place-items-center rounded-full bg-[#007AFF]/[.14] text-[#5eb0ff]">
                <BellIcon />
              </span>
              <span className="grid min-w-0 gap-[1px]">
                <span className="text-sm font-semibold text-white">No new notifications</span>
                <span className="text-[12px] text-[#9ca3af]">You&apos;re all caught up.</span>
              </span>
            </div>
          </div>
        )}

        {screen === "chats" && (
          <div className="flex min-h-0 flex-1 flex-col pt-3">
            <div className={cn(DOTTED, "flex min-h-0 flex-1 items-center gap-[10px]")} style={{ padding: "8px 10px" }}>
              <span className="grid size-8 flex-none place-items-center rounded-full bg-[#007AFF]/[.14] text-[#5eb0ff]">
                <ChatIcon />
              </span>
              <span className="grid min-w-0 gap-[1px]">
                <span className="text-sm font-semibold text-white">No saved chats yet</span>
                <span className="truncate text-[12px] text-[#9ca3af]">Ask anything — it will land here.</span>
              </span>
            </div>
          </div>
        )}

        {screen === "settings" && (
          <div className="flex min-h-0 flex-1 flex-col pt-3">
            <div className={cn(DOTTED, "flex min-h-0 flex-1 items-center gap-[10px]")} style={{ padding: "8px 10px" }}>
              <span className="grid size-8 flex-none place-items-center rounded-full bg-[#007AFF]/[.25] text-[15px] font-bold text-white">
                {initial}
              </span>
              <span className="grid min-w-0 flex-1 gap-[1px]">
                <span className="truncate text-sm font-semibold text-white">
                  {isSignedIn ? firstName : "Guest"}
                </span>
                <span className="truncate text-[12px] text-[#9ca3af]">Demo preview — no key needed</span>
              </span>
              <span className="size-[9px] flex-none rounded-full bg-[#30d158]" aria-hidden />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
