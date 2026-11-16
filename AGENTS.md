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
  - **without** is a link
  - Underline on **without** is print-style (thick, slightly skewed/uneven rule), not a default CSS `text-decoration` line
