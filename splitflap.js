(() => {
  const tiles = document.querySelectorAll(".without-link .tile");
  if (!tiles.length) return;

  tiles.forEach((tile) => {
    const from = tile.dataset.from ?? "";
    const to = tile.dataset.to ?? "";
    const showFrom = from === " " ? "\u00a0" : from;
    const isOut = tile.classList.contains("tile-out");
    const isBlack = to === "black";

    if (!isOut) {
      // „with”: obrót całej litery wokół własnej osi (efekt z początku)
      tile.innerHTML = `
        <span class="spin">
          <span class="spin-face front"><span class="glyph">${showFrom}</span></span>
          <span class="spin-face back"><span class="glyph">${showFrom}</span></span>
        </span>
      `;
      return;
    }

    // „out”: klapka → czarny panel
    const showTo = "\u00a0";
    tile.innerHTML = `
      <span class="half bottom current"><span class="glyph">${showFrom}</span></span>
      <span class="half top current"><span class="glyph">${showFrom}</span></span>
      <span class="half bottom next next-black"><span class="glyph">${showTo}</span></span>
      <span class="half top next next-black"><span class="glyph">${showTo}</span></span>
      <span class="flip">
        <span class="flip-face front"><span class="glyph">${showFrom}</span></span>
        <span class="flip-face back back-black"><span class="glyph">${showTo}</span></span>
      </span>
      <span class="hinge"></span>
    `;
  });
})();
