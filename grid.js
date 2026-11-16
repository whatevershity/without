(() => {
  document.querySelectorAll(".place[data-col]").forEach((el) => {
    const start = Number(el.dataset.col) || 1;
    const span = Number(el.dataset.span) || 1;
    const end = Math.min(13, start + span);
    el.style.gridColumn = `${start} / ${end}`;
  });

  document.querySelectorAll(".place[data-row]").forEach((el) => {
    const start = Number(el.dataset.row) || 1;
    const span = Number(el.dataset.rowSpan) || 1;
    const end = Math.min(13, start + span);
    el.style.gridRow = `${start} / ${end}`;
  });
})();
