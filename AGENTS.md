# Prototype instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

When the user gives durable prototype-specific design feedback, preferences, or decisions, record them here.

## Site variants — with / without

Two versions of the site, like a language switch (`pl` / `en`):

| Path | Variant | Role |
|------|---------|------|
| `/` (`index.html`) | **with** | **Default.** Static. Build this first. |
| `/without/` (`without/index.html`) | **without** | Motion, sound, more unease. Stub only for now — fill in later. |

- On **with** (`/`), the linked word reads **with** (not “without”) and points to `/without/` — click to switch variant
- On **without** (later): linked word will read **without** and point back to `/`
- Do not invent without content until the user asks
- When changing the page later, keep the locked link hover intact

## Layout — Hero grid

- Hero section: **100vw × 100vh** (full first viewport; not taller — rows are dense inside)
- Content inset: **360px** left/right (`--side`) inside the hero
- **12 columns**, numbered **1 → 12 from the left**
- **8 rows**, numbered **1 → 8 from the top** (`--rows: 8`) — denser bands within 100vh, not a longer page
- Gutter between columns: `--gutter: 16px`
- Thin guide lines + faint numbers: `.col-guides` / `.row-guides`; placement aids, **not final art** — may be removed later; keep `data-col` / `data-row`
- Placement API:
  - `data-col="N" data-span="S"` → column N, span S
  - `data-row="R" data-row-span="T"` → row R, span T
  - Example: “zdjęcie na kolumnach 2–5” → `data-col="2" data-span="4"`
  - Example: “na rzędzie 3” → `data-row="3"`

## Hero photo — adelka

- `adelka.png` on rows **3–4** (`data-row="3" data-row-span="2"` → through the **5th** horizontal guide, not the 6th), columns **9–12**
- `object-fit: cover`; do not disturb the locked link when moving this image

## Surface

- Page background: near-white `#FDFDFD` with very light **paper grain** (opacity ~0.08)

## Sound / no|yes label (with page) — leave alone unless asked

- No `sound.png` image on the with page (removed)
- Between columns **5–6** (`data-col="5" data-span="2"`, centered); label top **126px** (above the hero line at 190px)
- Font: **Oswald** (regular), **12px**
- Always shows **sound**
- Under it: **no** while the link shows **with**; **yes** while hovering/focusing (link reads **without**)
- yes/no: soft crossfade (~420ms) with slight vertical drift + light blur — not a hard cut
- Non-interactive (`.sound-meta`)
- Do not move, restyle, or rewrite this block when changing the link flip

## Typography

- Typeface: **Special Elite** (typewriter / machine style), fallback Courier New / Courier.
- Hero line on **with**: `wild with frames` (linked word = **with**)
  - Starts flush with **column 3** (`data-col="3" data-span="10"`, left-aligned)
  - Vertical position: **top 190px** inside hero (raised 150px from 340)
  - Type size on `.line`: `clamp(14px, 1.05vw + 0.55rem, 16px)` (~14–16px)
  - Link size (smaller on purpose): ~13–15px clamp on `.without-link`
  - Split-flap tiles are near-square (`~1em × 1.05em`), not tall/vertical

## Link mechanism — FINAL LOCK (do not touch)

**2026-11-16 — user: „zapisz to !! i nie ruszaj już tego pod żadnym pozorem”.**

Do **not** edit `splitflap.js`, `.without-link` / `.tile-*` / `.spin` / `.flip` / `.hinge` link rules in `styles.css`, or the link tile markup in `index.html`, unless the user **explicitly** asks to change the link animation. Layout / sound / other page work must leave this alone.

Video ref: https://www.youtube.com/watch?v=cI3jg1Jo650 — mechanism only.

### On **with** (`/` — current) — frozen

- Resting: **with** + **three visible out klapki** (`#454545`)
- Hover reads **without**:
  - **with**: **rotateX(-360deg)** on own axis
  - **out**: klapki **`#454545` → `o u t`** (stagger); after settle, letters are clean (no hinge / no strikethrough look)
- Underline fixed, a bit longer than “without”
- Link → `/without/`
- Also leave `.sound-meta` alone unless asked
