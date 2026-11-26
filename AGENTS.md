# AGENTS.md — web/ (Kumo design contract)

> All UI in `web/` follows the **Kumo design skill** (Cloudflare product guidance). Also read `design.md` for the binding page-level guidelines; if anything conflicts, treat `design.md` as the truth source.
> These rules are binding for every new component, page, and review.

## Tokens

- `--kumo-line: rgba(255,255,255,0.08)` → `ring-kumo-line` / `border-kumo-line`
- `--kumo-tint: rgba(255,255,255,0.06)` → `bg-kumo-tint` / `hover:bg-kumo-tint`
- Tailwind extension: `colors.kumo.{line,tint}` (see `tailwind.config.ts`)
- Base content size is `14px` (`text-sm`). Set on `body` in `app/globals.css`.

---

## Rules (essence; the Kumo skill holds the full Good/Avoid examples)

1. `content-text-size` — content text always `text-sm`; `text-base`+ is headings-only.
2. `heading-case` — sentence case, never Title Case or UPPERCASE.
3. `font-tracking` — no `tracking-*`, no custom letter-spacing.
4. `font-weight` — headings `font-semibold`, emphasis `font-medium`, never `font-bold`.
5. `related-text-spacing` — title + desc `gap-1.5`; group to siblings/actions `gap-6/7`.
6. `text-spacing` — optical padding, px > py (`px-5 py-4`, `px-3 py-2.5`).
7. `hover-color-transitions` — hovers instant, no `transition-colors`; `.pressable` scales only.
8. `shadow-borders` — LayerCards use `ring-1 ring-kumo-line` + drop shadow, never `border` + shadow. Exception: quiet history blocks on `/releases` stay borderless (see `design.md`).
9. `concentric-border-radius` — outer = inner + padding when surfaces sit ≤8px apart; pills exempt.
10. `icon-alignment` — icons 14px (`size-3.5`); multi-line rows wrap the icon in `h-lh flex items-center`.
11. `inline-monospace-size` — mono inside prose at `text-[0.9em]`.
12. `sticky-borders` — fixed headers always keep `border-b`; swap the color, not the property.
13. `collapse-content-size` — collapsibles animate the shell; inner content keeps a fixed width (`w-64`).
14. `layer-card-nesting` — one LayerCard per group; siblings in `grid gap-4`; inner rows plain.
15. `dialog-rendering` — dialogs always mounted; toggle open classes with `inert` + `aria-hidden`.

## Checklist for new UI

Content `text-sm`, sentence-case semibold headings, no tracking/bold/uppercase, tight title/desc gaps, optical padding, instant hovers, ring (or the documented borderless exception), concentric radii, 14px aligned icons, `0.9em` mono, sticky `border-b`, fixed collapse widths, no nested cards, mounted dialogs.

## Where to look

- Primitives: `components/ui/button.tsx`, `card.tsx`, `badge.tsx`
- Patterns: `components/landing/sections.tsx` (nav, island, grid, deep dive, workflow, footer)
- Overlays: `components/auth/account-menu.tsx` (dropdown reference), `components/auth/auth-card.tsx`
- Motion + surfaces: `app/globals.css`, `tailwind.config.ts`
- Page-specific rules: `design.md` (releases list)

## Release workflow

- When a new notchbud tag ships, add its entry to `CURATED_CHANGES` in `lib/github-release.ts` from the release's actual commits and diffs — one calm lowercase line per change.
- Never render raw release bodies; they are auto-generated compare links, not prose.
- Rebuild and retest (`npm run build`, `node --test tests/*.test.mjs`) before calling the page done.

Always use apple design skill (C:\Users\ankit\.agents\skills\apple-design) while working on UI

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
