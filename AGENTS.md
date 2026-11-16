# Prototype instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

When the user gives durable prototype-specific design feedback, preferences, or decisions, record them here.

## Layout

- Side margins: **360px** left and right on desktop (`--side: 360px`). Narrower viewports scale down with `clamp`.
- Page background: light gray paper grain texture (`assets/paper.png`), `cover` + fixed — not a flat cream gradient

## Typography

- Typeface: **Special Elite** (typewriter / machine style), fallback Courier New / Courier.
- Hero line: `wild without frame`
  - Centered horizontally
  - Vertical position: **1/3 of `100vw`** (`top: calc(100vw / 3)`)
  - **without** is a link with a **delicate thin underline** under the word (1px, slight print tilt) — not a thick bar
  - Hover/focus: the link flips **down** around its own horizontal axis (`rotateX(-180deg)`), revealing **with** on the back face — not a sideways (`rotateY`) spin
  - Type size on `.line`: `clamp(14px, 1.05vw + 0.55rem, 16px)` (~14–16px)
  - Link size (smaller on purpose): `clamp(12px, 0.9vw + 0.5rem, 14px)` (~12–14px)
