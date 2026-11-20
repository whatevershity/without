(() => {
  const btn = document.querySelector(".lamp-switch");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const on = btn.getAttribute("aria-pressed") === "true";
    const next = !on;
    btn.setAttribute("aria-pressed", String(next));
    document.body.classList.toggle("is-lit", next);
    // Link / światło — adres podamy później; na razie tylko stan switcha.
  });
})();
