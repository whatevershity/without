# Prototype instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

When the user gives durable prototype-specific design feedback, preferences, or decisions, record them here.

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
- Hero line: `wild without frame`
  - Starts flush with **column 3** (`data-col="3" data-span="10"`, left-aligned)
  - Vertical position: **top 300px** inside hero
  - Type size on `.line`: `clamp(14px, 1.05vw + 0.55rem, 16px)` (~14–16px)
  - Link size (smaller on purpose): ~13–15px clamp on `.without-link`

## Link mechanism (reference: split-flap / “pragotron” / tablice klapkowe)

Video ref: https://www.youtube.com/watch?v=cI3jg1Jo650 — focus on **change mechanism**, not board colors/fonts.

- **without** is a link with a **form-blank underline** under it only (`imię: ________`); the line does **not** flip
- Resting **without** stays as-is (do not restyle the word)
- Hover/focus: **with** stays put; only the **out** ending flaps **down** into pure **black (`#000`) klapki**, one after another (stagger) — no strikethrough, no empty disappearance
- Visible **horizontal hinge seam** on out tiles only (hidden on `with` so it doesn’t look crossed out)
- Word spacing in the hero line is enlarged (`word-spacing: 0.85em`)
