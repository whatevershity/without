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

Artboard reference: **1440 × 1024** (Figma HERO).

- Side margins: **360px** left and right (`--side: 360px`) → content width **720px** at 1440
- Inside the content area: **12 columns**, numbered **1 → 12 from the left**
- Gutter between columns: `--gutter: 16px`
- Thin guide lines + faint column numbers are drawn for placement (`.col-guides`); not part of the final art direction
- Placement API for items in `.hero-grid`:
  - `class="place" data-col="N" data-span="S"` → starts at column N, spans S columns
  - Example: `data-col="3" data-span="2"` = columns **3–4**
  - User will say e.g. “zdjęcie na kolumnach 2–5” → set `data-col="2" data-span="4"`

## Surface

- Page background: flat `#FAFAFA` with subtle **paper grain / noise** overlay

## Typography

- Typeface: **Special Elite** (typewriter / machine style), fallback Courier New / Courier.
- Hero line on **with**: `wild with frame` (linked word = **with**)
  - Starts flush with **column 3** (`data-col="3" data-span="10"`, left-aligned)
  - Vertical position: **top 340px** inside hero
  - Type size on `.line`: `clamp(14px, 1.05vw + 0.55rem, 16px)` (~14–16px)
  - Link size (smaller on purpose): ~13–15px clamp on `.without-link`
  - Split-flap tiles are near-square (`~1em × 1.05em`), not tall/vertical

## Link mechanism — LOCKED (do not regress)

Video ref: https://www.youtube.com/watch?v=cI3jg1Jo650 — focus on **change mechanism**, not board colors/fonts.

**Approved hover — keep intact through later page changes** unless the user explicitly asks to change the mechanism.

### On **with** (`/` — current)

- Linked word shows **with** (form-blank underline under it only; the line does not flip)
- Hover: each letter full **rotateX(-360deg)** around its own horizontal axis
- Resting look stays; no strikethrough
- Word spacing in the hero line: `word-spacing: 0.85em`

### Shared / for **without** later

- Hybrid still available in code: **with**-letters spin + **out** split-flap into `#454545` klapki (stagger) — use when the linked word is **without**
- Implementation: `splitflap.js` + `.tile-keep` / `.tile-out` in `styles.css` — touch only for bugfixes or explicit mechanism changes
