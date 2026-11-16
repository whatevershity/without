(() => {
  const tiles = document.querySelectorAll(".without-link .tile");
  if (!tiles.length) return;

  tiles.forEach((tile) => {
    const from = tile.dataset.from ?? "";
    const to = tile.dataset.to ?? "";
    const isOut = tile.classList.contains("tile-out");
    const isBlackFrom = from === "black";
    const isBlackTo = to === "black";

    const glyph = (v) => {
      if (v === "black" || v === " " || v === "") return "\u00a0";
      return v;
    };

    if (!isOut) {
      // LOCKED: „with” — obrót wokół własnej osi
      const g = glyph(from);
      tile.innerHTML = `
        <span class="spin">
          <span class="spin-face front"><span class="glyph">${g}</span></span>
          <span class="spin-face back"><span class="glyph">${g}</span></span>
        </span>
      `;
      return;
    }

    // LOCKED inverted: klapki #454545 → litera (odwrotnie niż letter → black)
    const showFrom = glyph(from);
    const showTo = glyph(to);
    const fromBlack = isBlackFrom ? " next-black" : "";
    const toBlack = isBlackTo ? " next-black" : "";
    const frontBlack = isBlackFrom ? " back-black" : "";
    const backBlack = isBlackTo ? " back-black" : "";
    // current halves use flap-card or black
    const curBlack = isBlackFrom ? " next-black" : "";

    tile.innerHTML = `
      <span class="half bottom current${curBlack}"><span class="glyph">${showFrom}</span></span>
      <span class="half top current${curBlack}"><span class="glyph">${showFrom}</span></span>
      <span class="half bottom next${toBlack}"><span class="glyph">${showTo}</span></span>
      <span class="half top next${toBlack}"><span class="glyph">${showTo}</span></span>
      <span class="flip">
        <span class="flip-face front${frontBlack}"><span class="glyph">${showFrom}</span></span>
        <span class="flip-face back${backBlack}"><span class="glyph">${showTo}</span></span>
      </span>
      <span class="hinge"></span>
    `;
  });
})();
