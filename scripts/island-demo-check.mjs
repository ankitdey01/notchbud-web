// TDD guard for the web island demo (components/landing/island-demo.tsx).
// Run: node scripts/island-demo-check.mjs
// Fails before the fix, passes after. No deps.
import fs from "node:fs";

const src = fs.readFileSync("components/landing/island-demo.tsx", "utf8");
let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

// 3. Shell must not grow when a message lands: history mounts structurally,
// not conditionally on turns, and the home greeting owns flex-1 so the
// prompt is already pinned bottom before chatting.
check(
  "history not conditionally mounted on turns",
  !src.includes("turns.length > 0 || thinking || stream ?")
);
check("home greeting owns flex-1 (prompt pinned bottom)", src.includes("flex min-h-0 flex-1 items-center"));

// 2. Topbar controls are real buttons with the exact labels.
for (const label of ["Menu", "Notifications", "Settings"]) {
  check(`button aria-label="${label}"`, src.includes(`aria-label="${label}"`) && src.includes("<button"));
}

// 4. Chat clone replies with the exact demo line, no canned pool.
check("fake reply is 'Download me to try out'", src.includes("Download me to try out"));
check("no CANNED pool", !src.includes("CANNED"));

// 4b. Chat back affordance like the real /chat screen.
check("chat back button", src.includes('aria-label="Back to home"'));

// 1. A bit of depth shadow behind the island shell.
check("depth shadow behind shell", src.includes("drop-shadow"));

process.exit(failures ? 1 : 0);
