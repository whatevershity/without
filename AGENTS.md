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
- Guide lines (`.col-guides` / `.row-guides`): **hidden** (`display: none`); keep markup + `data-col` / `data-row`
- Placement API:
  - `data-col="N" data-span="S"` → column N, span S
  - `data-row="R" data-row-span="T"` → row R, span T
  - Example: “zdjęcie na kolumnach 2–5” → `data-col="2" data-span="4"`
  - Example: “na rzędzie 3” → `data-row="3"`

## Hero photo

- Photo removed on the dark with page (for now)

## Surface — dark

- Page background: **`#1a1a1a`** (near-black, not `#000`)
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

### Saved baseline (restore point)

- **Commit / CSS:** `d60676f` · `styles.css?v=status-receipt6`
- Clean receipt panel: no value rotate/translate; dots `1fr`; values right-aligned, column `calc(10ch + 0.8em)`
- Editorial-brutalist experiment reverted — current = this baseline

### Current layout

- Placement: under the **tytuł**, panel stretches hero stack (cols **5–8**) for layout
- Layout: three rows; padding 0; **tło** via `::before` mniejsze niż napisy (inset **7px** ze wszystkich stron)
- **Etykiety** (opcje): PT Mono 10px, uppercase, letter-spacing ~0.12em, `rgb(255 255 255 / 0.65)` (jak wartości)
- **Wartości** (wybór): PT Mono ~10px, `rgb(255 255 255 / 0.65)`; always **right-aligned**; prawa krawędź na luce kol. **6|7**
- Gap **tytuł → tabela**: ~40px; dots = `border-bottom: 1px dotted` ending before the value column
- Opcje always visible; wybór crossfades on link hover (do not touch that animation)
- Non-interactive (`.status-meta`); do not change link flap markup when editing this
- **On with** (`/`): rest **no** / **no** / **yes** → hover/focus (link reads **without**) **yes** / **yes** / **who knows**
- **On without** (`/without/`): rest **yes** / **yes** / **who knows** → hover/focus (link reads **with**) **no** / **no** / **yes**

## Typography

- **Tytuł** (`wild … frames`) + everything else (opcje / wybór / shout): **PT Mono**, fallback Courier New / Courier
- **Tytuł** on **with**: `wild with frames` (linked word = **with**)
  - Centered in hero stack (cols **5–8**)
  - Type size on `.line`: `clamp(14px, 1.05vw + 0.55rem, 16px)` (~14–16px)
  - Link size (smaller on purpose): ~13–15px clamp on `.without-link`
  - Split-flap tiles are near-square (`~1em × 1.05em`), not tall/vertical
  - Orientation cue (only **with** for now): flat **„u r here”** + arrow (~1cm above **with**) in **Farsan** — no rotation; smaller type; on link hover/focus → **„u r not here”**. Open question: whether this cue belongs on every subpage (probably not)

## Story zigzag (only **without**, below hero)

- Section `.story-zigzag` under hero — **do not modify the hero** when editing this
- 4 blocks: image left / text right; same `--side` inset as hero; type like **Ok, so.** (PT Mono, small); no text/image panel frames
- Images: `/images/block-1.jpg` … `block-4.jpg` (placeholders; swap later); CSS scanline overlay; sticky media when text is taller
- Motion: fade+translateY via `zigzag.js` IntersectionObserver; one glitch on final sentence of block 4; honor `prefers-reduced-motion`

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

- Asset: **`lamp.png` only** (no lamp2 swap) — hangs from **top edge**, ~**column 3**
- Acts as a **light switch** on `/without/` (does **not** navigate between pages)
- Sways harder: **right→left in 2s**, back in 2s (full **4s**); creak on each side (~every 2s); **keeps swaying on hover/click**; no lamp2 image swap
- Sound (`sound/`):
  - `lamp-swaying.mp3` — loop on enter; keeps playing on hover; **volume falls with scroll**; **muted while lit (white)**
  - `lamp-switch.mp3` — plays on dark↔light (and back)
  - `hey.mp3` — plays (slowed) when **HEY!** pops on lit
  - may need first gesture if autoplay blocked
- State: `aria-pressed` + `body.is-lit` via `lamp.js`; lit uses hash `#lit` so browser **Back** returns to dark `/without/`, not to **with**
- Do not change the locked tytuł flap when editing the lamp

### Joke / sensory concept (autism experience)

Clicking the lamp **bursts light from the hero center** (`.light-flood` `clip-path` circle, `body.is-lit`) — not navigation. Hover does **not** flood.

- Lit ≈ sensory overload: soft **blurred circle from center** + natural halo (not a flat white wash); dark vignette edges stay; tytuł/opcje/guides fade
- Glow layers: `.light-flood-core` (brighter blur) + `.light-flood-halo` (wider soft poświata); scales out from mid-hero
- Lamp art stays **`lamp.png`**, visible and clickable (never under the wash)
- Flood has `pointer-events: none` so the second click always reaches the lamp
- On lit: **shout** once (EN), caps, **PT Mono** — **HEY!** then rest lines enter after it
  - Entrance: **pop small→large** + **fast smear/shadow trail**; then text **settles and stops** (no cycling)
  - Placement: **HEY** starts at mid **row 5**; stack leans right
  - `hey.mp3` (slowed) on HEY
  - After light off: shout **exits word-by-word** (fast reading pace) while apology enters the same way in parallel:
    *“I apologize, but when I’m working, a sudden change in my surroundings throws me off rhythm.”*
  - Apology placement: starts at **column 7**, row 5 (`data-col="7"`); stays on dark
  - Apology layout (ref): small type, short lines, open leading in-block, **larger gaps between stanza blocks**
  - Photo **`adelka.png`**: **col 8**, **rows 5→8**; apology text (**col 7**, wider span) **overlaps onto** the photo; enters from top with **uneven pixel-strip** reveal; box uses image **aspect-ratio** so dark **overlay** covers only the photo (no empty band below)
  - After apology: **lamp locks** — still sways + click sound, but **no return to lit**
  - Then **“Ok, so.”** at **col 5 / row 8**, same word-by-word reveal
  - Lamp stays above; sway audio muted on lit
- Tone: empathy for sensory overload / light+noise; site is about that experience

