(() => {
  const tiles = document.querySelectorAll(".without-link .tile");
  if (!tiles.length) return;

  tiles.forEach((tile) => {
    const from = tile.dataset.from ?? "";
    const to = tile.dataset.to ?? "";
    const showFrom = from === " " ? "\u00a0" : from;
    const isBlack = to === "black";
    const showTo = isBlack ? "\u00a0" : to === " " ? "\u00a0" : to;
    const nextClass = isBlack ? " next next-black" : " next";

    tile.innerHTML = `
      <span class="half bottom current"><span class="glyph">${showFrom}</span></span>
      <span class="half top current"><span class="glyph">${showFrom}</span></span>
      <span class="half bottom${nextClass}"><span class="glyph">${showTo}</span></span>
      <span class="half top${nextClass}"><span class="glyph">${showTo}</span></span>
      <span class="flip">
        <span class="flip-face front"><span class="glyph">${showFrom}</span></span>
        <span class="flip-face back${isBlack ? " back-black" : ""}"><span class="glyph">${showTo}</span></span>
      </span>
      <span class="hinge"></span>
    `;
  });
})();
