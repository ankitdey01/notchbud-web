# AGENTS.md — web/ (Kumo design contract)

> All UI in `web/` follows the **Kumo design skill** (Cloudflare product guidance).
> These 15 rules are binding for every new component, page, and review.
> When in doubt, pick the **Good** pattern and delete the **Avoid** pattern.

## Tokens

- `--kumo-line: rgba(255,255,255,0.08)` → `ring-kumo-line` / `border-kumo-line`
- `--kumo-tint: rgba(255,255,255,0.06)` → `bg-kumo-tint` / `hover:bg-kumo-tint`
- Tailwind extension: `colors.kumo.{line,tint}` (see `tailwind.config.ts`)
- Base content size is `14px` (`text-sm`). Set on `body` in `app/globals.css`.

---

## 1. `content-text-size` — 14px for all content text

Body, buttons, data, and interactables are **always** `text-sm` (14px).
`16px+` (`text-base` and up) is reserved for headings only.

```tsx
// Good
<p className="text-sm text-neutral-400">Billed to your plan.</p>
<Button size="sm">Sign in</Button>

// Avoid
<p className="text-[13.5px]">Billed to your plan.</p>
<p className="text-[16px]">Billed to your plan.</p> // body must not be 16px
```

## 2. `heading-case` — always sentence case

Never Title Case or UPPERCASE headings. Product names stay title-cased per brand.

```tsx
// Good
<h2>Recent requests</h2>
<h2>Three steps. One minute.</h2>

// Avoid
<h2>Recent Requests</h2>
<h2 className="uppercase">Recent requests</h2>
<p>GOOGLE ONLY · SECURED BY CLERK</p> // use: Google only · Secured by Clerk
```

## 3. `font-tracking` — never change tracking

No `tracking-*` classes. No custom `letter-spacing` in CSS.
`.display` / `.h2-tight` control scale + balance only.

```tsx
// Good
<span className="text-base">Worker Metrics</span>

// Avoid
<span className="text-base tracking-tight">Worker Metrics</span>
```

## 4. `font-weight` — never `font-bold`

Headings use `font-semibold`. Inline emphasis uses `font-medium`.

```tsx
// Good
<h3 className="text-base font-semibold">Account settings</h3>
<strong className="font-medium">required</strong>

// Avoid
<h3 className="font-bold">Account settings</h3>
```

## 5. `related-text-spacing` — related text stays tight

Title + description use `gap-1.5`. The group keeps a loose gap (`gap-6`/`gap-7`)
to siblings and actions.

```tsx
// Good
<div className="grid gap-6">
  <div className="grid gap-1.5">
    <h3>Web Analytics</h3>
    <p>Measure site traffic.</p>
  </div>
  <Button>Configure</Button>
</div>

// Avoid — uniform gap erases hierarchy
<div className="grid gap-4">
  <h3>Web Analytics</h3>
  <p>Measure site traffic.</p>
  <Button>Configure</Button>
</div>
```

## 6. `text-spacing` — optical padding (px > py)

Vertical padding is always smaller than horizontal.

```tsx
// Good
<div className="px-5 py-4">…</div>
<div className="px-5 py-3">…</div>
<div className="px-3 py-2.5">…</div>

// Avoid
<div className="p-5">…</div>
<div className="px-5 py-5">…</div>
```

## 7. `hover-color-transitions` — hovers are instant

Never transition colors. `.pressable` scales only (see `globals.css`).
`hover:bg-kumo-tint` / `hover:text-white` apply with **no** transition class.

```tsx
// Good
<button className="pressable hover:bg-kumo-tint">…</button>

// Avoid
<button className="transition-colors duration-300 hover:bg-kumo-tint">…</button>
```

> `btn-gloss-blue` keeps only the positional sheen sweep (`left 600ms`).
> The lighter-tone layer swaps instantly.

## 8. `shadow-borders` — ring, never border + shadow

LayerCards use `ring-1 ring-kumo-line` + a drop shadow. Never `border` + shadow.

```tsx
// Good
<div className="rounded-2xl bg-white/[0.03] shadow-[0_1px_2px_rgba(0,0,0,0.4)] ring-1 ring-kumo-line">…</div>

// Avoid
<div className="rounded-2xl border border-kumo-line shadow-md">…</div>
```

## 9. `concentric-border-radius` — outer = inner + padding

When surfaces sit ≤8px apart, radii must be mathematically concentric.
Padding >8px exempts the pair (document it). Pills (`rounded-full` in `rounded-full`) are inherently concentric.

```tsx
// Good — 12px inner + 8px padding = 20px outer
<div className="rounded-[20px] p-2">
  <div className="rounded-xl">…</div>
</div>

// Avoid — same radius at different insets
<div className="rounded-xl p-1">
  <div className="rounded-xl">…</div>
</div>
```

> Account dropdown in `components/auth/account-menu.tsx` is the reference:
> `rounded-[20px]` shell + `p-2` + `rounded-xl` rows.

## 10. `icon-alignment` — align icons to the first line

Inline icons match the 14px text (`size={14}` / `size-3.5`).
Multi-line rows wrap the icon in `h-lh flex items-center`.

```tsx
// Good
<div className="flex items-start gap-2.5">
  <span className="h-lh flex shrink-0 items-center"><Icon size={14} /></span>
  <p className="text-sm">Wraps onto multiple lines…</p>
</div>

// Avoid — icon floats between lines
<div className="flex items-center gap-2">
  <Icon size={16} />
  <p>Wraps onto multiple lines…</p>
</div>
```

## 11. `inline-monospace-size` — mono at 0.9em

Monospaced text inside prose uses `text-[0.9em]`, never full size.

```tsx
// Good
<p className="text-sm">Edit <span className="font-mono text-[0.9em]">wrangler.toml</span> to continue.</p>

// Avoid
<p className="text-sm">Edit <span className="font-mono">wrangler.toml</span> to continue.</p>
```

## 12. `sticky-borders` — sticky chrome always keeps its border

Fixed headers keep `border-b` at all times; swap the color, not the property,
so layout never shifts.

```tsx
// Good — see SiteNav
<header className={cn("fixed inset-x-0 top-0 z-50 border-b", scrolled ? "chrome border-white/[0.07]" : "border-transparent bg-transparent")}>

// Avoid
<header className="fixed inset-x-0 top-0 z-50"> // no separator over content
```

## 13. `collapse-content-size` — fixed inner width during collapse

Collapsible shells animate the outer box; the inner content keeps a fixed width
(`w-64`) so text never reflows mid-animation.

```tsx
// Good
<motion.div animate={{ width: open ? 256 : 0 }}>
  <div className="w-64">…</div>
</motion.div>

// Avoid
<motion.div animate={{ width: open ? 256 : 0 }}>
  <div className="w-full min-w-0">…</div>
</motion.div>
```

## 14. `layer-card-nesting` — never stack cards

One LayerCard per visual group. Sibling cards sit in a `grid gap-4`;
inner rows are plain (no `ring`/`bg` card styles).

```tsx
// Good — DeepDive has one card; Workflow uses two siblings
<div>
  <h3>Recent requests</h3>
  <Card>…</Card>
</div>

// Avoid
<Card>
  <h3>Recent requests</h3>
  <Card>…</Card>
</Card>
```

## 15. `dialog-rendering` — never conditionally render dialogs

Always mount the dialog/dropdown; toggle `open` / `is-open` / `is-closing`
so open/close animation can play. Pair with `inert` + `aria-hidden`.

```tsx
// Good — see AccountMenu
<div role="menu" inert={open ? undefined : true} aria-hidden={!open} className={cn("t-dropdown", open && "is-open", closing && "is-closing")}>

// Avoid
{open && (
  <div role="menu">…</div>
)}
```

---

## Checklist for new UI

1. All content text `text-sm`? Headings sentence case + `font-semibold`?
2. No `tracking-*`, no `font-bold`, no `uppercase`?
3. Title/desc `gap-1.5`, group `gap-6+`?
4. Padding optical (`px-5 py-4`, `px-3 py-2.5`)?
5. Hovers instant (no `transition-colors`)?
6. Cards use `ring-1 ring-kumo-line`, no `border` + shadow?
7. Radii concentric or exempt (>8px, documented)?
8. Icons 14px, multi-line wrapped in `h-lh`?
9. Mono at `0.9em`?
10. Sticky header keeps `border-b`?
11. Collapsibles use fixed inner width?
12. No nested cards?
13. Dialogs always mounted?

## Where to look

- Primitives: `components/ui/button.tsx`, `card.tsx`, `badge.tsx`
- Patterns: `components/landing/sections.tsx` (nav, island, grid, deep dive, workflow, footer)
- Overlays: `components/auth/account-menu.tsx` (dropdown reference), `components/auth/auth-card.tsx`
- Motion + surfaces: `app/globals.css`, `tailwind.config.ts`

Always use apple design skill (C:\Users\ankit\.agents\skills\apple-design) while working on UI

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
