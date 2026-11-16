# Prototype instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

When the user gives durable prototype-specific design feedback, preferences, or decisions, record them here.

## Layout

- Side margins: **360px** left and right on desktop (`--side: 360px`). Narrower viewports scale down with `clamp`.

## Typography

- Typeface: **Special Elite** (typewriter / machine style), fallback Courier New / Courier.
- Hero line: `wild without frame`
  - Centered horizontally
  - Vertical position: **1/3 of `100vw`** (`top: calc(100vw / 3)`)
  - **without** is a link with a **delicate thin underline** under the word (1px, slight print tilt) — not a thick bar
  - Hover/focus: the link flips **down** around its own horizontal axis (`rotateX(-180deg)`), revealing **with** on the back face — not a sideways (`rotateY`) spin
  - Type size on `.line`: `clamp(1.35rem, 2.4vw, 2.15rem)` (~21.6px–34.4px; at 1440px viewport ≈ 34.4px / 2.15rem)
