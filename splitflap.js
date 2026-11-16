(() => {
  const tiles = document.querySelectorAll(".without-link .tile");
  if (!tiles.length) return;

  tiles.forEach((tile) => {
    const from = tile.dataset.from ?? "";
    const to = tile.dataset.to ?? "";
    const showFrom = from === " " || from === "" ? "\u00a0" : from;
    const showTo = to === " " || to === "" ? "\u00a0" : to;
    const isOut = tile.classList.contains("tile-out");

    if (!isOut) {
      // „with”: obrót całej litery wokół własnej osi (LOCKED)
      tile.innerHTML = `
        <span class="spin">
          <span class="spin-face front"><span class="glyph">${showFrom}</span></span>
          <span class="spin-face back"><span class="glyph">${showFrom}</span></span>
        </span>
      `;
      return;
    }

    // „out”: klapki (kwadraty) z pustego → litera
    tile.innerHTML = `
      <span class="half bottom current"><span class="glyph">${showFrom}</span></span>
      <span class="half top current"><span class="glyph">${showFrom}</span></span>
      <span class="half bottom next"><span class="glyph">${showTo}</span></span>
      <span class="half top next"><span class="glyph">${showTo}</span></span>
      <span class="flip">
        <span class="flip-face front"><span class="glyph">${showFrom}</span></span>
        <span class="flip-face back"><span class="glyph">${showTo}</span></span>
      </span>
      <span class="hinge"></span>
    `;
  });
})();
