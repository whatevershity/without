(() => {
  const tiles = document.querySelectorAll(".without-link .tile");
  if (!tiles.length) return;

  tiles.forEach((tile) => {
    const from = tile.dataset.from ?? "";
    const to = tile.dataset.to ?? "";
    const isOut = tile.classList.contains("tile-out");

    const glyph = (v) => {
      if (v === "black" || v === " " || v === "") return "\u00a0";
      return v;
    };

    if (!isOut) {
      // LOCKED: with — obrót wokół własnej osi
      const g = glyph(from);
      tile.innerHTML = `
        <span class="spin">
          <span class="spin-face front"><span class="glyph">${g}</span></span>
          <span class="spin-face back"><span class="glyph">${g}</span></span>
        </span>
      `;
      return;
    }

    // LOCKED inverted: out — klapki #454545 → litera (odwrotnie niż litera → #454545)
    const showFrom = glyph(from);
    const showTo = glyph(to);
    const fromIsBlack = from === "black";
    const toIsBlack = to === "black";

    tile.innerHTML = `
      <span class="half bottom current${fromIsBlack ? " is-black" : ""}"><span class="glyph">${showFrom}</span></span>
      <span class="half top current${fromIsBlack ? " is-black" : ""}"><span class="glyph">${showFrom}</span></span>
      <span class="half bottom next${toIsBlack ? " is-black" : ""}"><span class="glyph">${showTo}</span></span>
      <span class="half top next${toIsBlack ? " is-black" : ""}"><span class="glyph">${showTo}</span></span>
      <span class="flip">
        <span class="flip-face front${fromIsBlack ? " is-black" : ""}"><span class="glyph">${showFrom}</span></span>
        <span class="flip-face back${toIsBlack ? " is-black" : ""}"><span class="glyph">${showTo}</span></span>
      </span>
      <span class="hinge"></span>
    `;
  });
})();
