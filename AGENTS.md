# Prototype instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

When the user gives durable prototype-specific design feedback, preferences, or decisions, record them here.

## Layout

- Side margins: **360px** left and right on desktop (`--side: 360px`). Narrower viewports scale down with `clamp`.
- Page background: flat `#FAFAFA` (closer to white than gray) with subtle **paper grain / noise** overlay

## Typography

- Typeface: **Special Elite** (typewriter / machine style), fallback Courier New / Courier.
- Hero line: `wild without frame`
  - Centered horizontally
  - Vertical position: **top 300px**
  - Type size on `.line`: `clamp(14px, 1.05vw + 0.55rem, 16px)` (~14–16px)
  - Link size (smaller on purpose): `clamp(12px, 0.9vw + 0.5rem, 14px)` (~12–14px)

## Link mechanism (reference: split-flap / “pragotron” / tablice klapkowe)

Video ref: https://www.youtube.com/watch?v=cI3jg1Jo650 — focus on **change mechanism**, not board colors/fonts.

- **without** is a link with a **form-blank underline** under it only (`imię: ________`); the line does **not** flip
- Resting **without** stays as-is (do not restyle the word)
- Hover/focus: **with** stays put; only the **out** ending flaps **down** into **black klapki** (closed panels) — not empty/blank disappearance
- Visible **horizontal hinge seam** on tiles; top half drops like a real board flap
