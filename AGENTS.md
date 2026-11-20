# Prototype instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

When the user gives durable prototype-specific design feedback, preferences, or decisions, record them here.

## Site variants — with / without

Two versions of the site, like a language switch (`pl` / `en`):

| Path | Variant | Role |
|------|---------|------|
| `/` (`index.html`) | **with** | **Default.** Static. |
| `/without/` (`without/index.html`) | **without** | Mirror layout; later: motion, sound, more unease. |

- On **with** (`/`): linked word reads **with**, points to `/without/`
- On **without** (`/without/`): linked word reads **without**, points to `/`
- Same dark hero, tytuł / opcje / wybór; keep the locked link *mechanism* (reuse via inverted `data-from` / `data-to`, do not rewrite `splitflap.js`)

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

## Hero photo

- Photo removed on the dark with page (for now)

## Surface — dark

- Page background: **`#454545`** (former flap-black)
- Page / sound text: **white** (`#f5f5f5`)
- Flap cards: light **`#f2f0ec`** with dark glyphs (`--flap-ink`) so letters stay readable
- Blank out-klapki use the same light flap tone (not dark panels on dark bg)
- Soft grain via `soft-light`

## Naming — tytuł / opcje / wybór

| Name (PL) | What | Markup |
|-----------|------|--------|
| **tytuł** | `wild with frames` (link flap) | `.line` |
| **opcje** | `sound` · `interactive` · `story` | `.status-label` |
| **wybór** | `no`/`yes`/`who knows` under each option | `.status-answer` (`.rest` / `.hover`) |

Use these names in chat and notes when talking about spacing or copy.

## Opcje + wybór (status meta)

Exact same crossfade as the old sound yes/no: two stacked **wybór** answers, opacity + slight vertical drift + light blur ~420ms. Columns one after another (`--i` × `--status-stagger` ~320ms) — not all at once.

- Placement: under the **tytuł**, centered in the hero stack (cols **5–8**), smaller (**Synonym Regular** ~11px, [Fontshare](https://www.fontshare.com/fonts/synonym))
- Gap **tytuł → opcje**: larger (`margin-top` ~3.25rem on `.status-meta`)
- Gap **opcje → wybór**: within each column (`gap` ~0.7em)
- Opcje always visible; wybór crossfades on link hover
- Non-interactive (`.status-meta`); do not change link flap markup when editing this
- **On with** (`/`): rest **no** / **no** / **yes** → hover/focus (link reads **without**) **yes** / **yes** / **who knows**
- **On without** (`/without/`): rest **yes** / **yes** / **who knows** → hover/focus (link reads **with**) **no** / **no** / **yes**

## Typography

- Typeface: **Special Elite** (typewriter / machine style), fallback Courier New / Courier.
- **Tytuł** on **with**: `wild with frames` (linked word = **with**)
  - Centered in hero stack (cols **5–8**)
  - Type size on `.line`: `clamp(14px, 1.05vw + 0.55rem, 16px)` (~14–16px)
  - Link size (smaller on purpose): ~13–15px clamp on `.without-link`
  - Split-flap tiles are near-square (`~1em × 1.05em`), not tall/vertical

## Link mechanism — FINAL LOCK (do not touch)

**2026-11-16 — user: „zapisz to !! i nie ruszaj już tego pod żadnym pozorem”.**

Do **not** edit `splitflap.js`, `.without-link` / `.tile-*` / `.spin` / `.flip` / `.hinge` link rules in `styles.css`, or the link tile markup in `index.html`, unless the user **explicitly** asks to change the link animation. Layout / sound / other page work must leave this alone.

Video ref: https://www.youtube.com/watch?v=cI3jg1Jo650 — mechanism only.

### On **with** (`/` — current) — frozen

- Resting: **with** + **three visible out klapki** (blank light flaps)
- Hover reads **without**:
  - **with**: **rotateX(-360deg)** on own axis
  - **out**: klapki **blank → `o u t`** (stagger); after settle, letters are clean (no hinge / no strikethrough look)
- Underline fixed, a bit longer than “without”
- Link → `/without/`
- Leave `.status-meta` alone when changing the link flip unless asked

### On **without** (`/without/`)

- Resting: **without** (letters `o u t` clean — hinge hidden at rest via `.page-without`)
- Hover reads **with**:
  - **with** tiles: same **rotateX(-360deg)**
  - **out**: letters **`o u t` → blank** (same flip CSS; inverted `data-from` / `data-to`)
- Link → `/`
- Wybór inverted (see above)

## Lamp switch (only on **without**)

- Asset: `lamp.png` (rest) / `lamp2.png` (hover + pressed) — hangs from **top edge**, ~**column 3**
- Acts as a **light switch** on `/without/` (does **not** navigate between pages)
- Hover / pressed: show `lamp2`, may overhang toward **column 2**
- Idle (before click): noticeable sway (~±2–3°) + brightness pulse — only affordance on the page; sound TBD
- State: `aria-pressed` + `body.is-lit` via `lamp.js` — destination link TBD (user will provide)
- Do not change the locked tytuł flap when editing the lamp
