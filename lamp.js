(() => {
  const btn = document.querySelector(".lamp-switch");
  if (!btn) return;

  const setLit = (on) => {
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.classList.toggle("is-on", on);
    document.body.classList.toggle("is-lit", on);
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLit(!(btn.getAttribute("aria-pressed") === "true"));
    // Link / światło — adres podamy później; na razie tylko stan switcha.
  });
})();
