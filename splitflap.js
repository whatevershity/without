(() => {
  const tiles = document.querySelectorAll(".without-link .tile");
  if (!tiles.length) return;

  tiles.forEach((tile) => {
    const from = tile.dataset.from ?? "";
    const to = tile.dataset.to ?? "";
    const showFrom = from === " " ? "\u00a0" : from;
    const showTo = to === " " ? "\u00a0" : to;

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
