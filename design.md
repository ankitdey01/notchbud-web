# Releases page design

Rules for the version list in `app/releases/page.tsx`. Borderless by
choice — these blocks are quiet history, not calls to action.

## Blocks, not cards

- Each release is a plain tinted block: `rounded-[20px] bg-slate-500/10`
  (same fill as the pricing cards), no ring, no border, no shadow.
  Sibling blocks sit in a `grid gap-4`.
- The `latest` pill keeps its hairline ring — pills stay concentric,
  blocks stay borderless.

## Shared fills, never new tints

- Muted block fills always reuse an existing surface — currently the
  pricing card fill `bg-slate-500/10`. Never invent a one-off opacity
  for a new block; match a surface the site already uses so repeated
  sections feel like one product.
- If the pricing fill ever changes, the release blocks change with it.
  One fill, every quiet surface.

## Menus

- Floating menus (account dropdown) use the same shared fill:
  `rounded-[20px] bg-slate-500/10`, no ring, no shadow, `p-2` with
  `rounded-xl` rows inside.
- Row hovers stay instant and must read on the fill — `hover:bg-white/70`,
  not the white-on-white `kumo-tint` which vanishes on tinted surfaces.

## Inside a block

- Header row: version (`text-base font-semibold`) + optional `latest`
  badge + date in muted slate. One line, wraps gracefully.
- Changes: check-marked bullets (`Check` at 14px in `h-lh` wrapper),
  `text-sm leading-relaxed text-slate-600`, `grid gap-2.5`.
- Footer row: plain text links (`download setup` with a 14px icon,
  `release notes` with an arrow). No buttons inside blocks.
- Only the newest block offers the setup download. Older blocks link
  out to their notes.

## Words

- Summaries are hand-written in `CURATED_CHANGES`
  (`lib/github-release.ts`), one calm lowercase line per change.
  Unknown tags fall back to cleaned commit subjects from the compare
  API — merge noise and version bumps dropped.
- Never render raw release bodies: they are auto-generated compare
  links, not prose.
