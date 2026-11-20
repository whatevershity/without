(() => {
  const btn = document.querySelector(".lamp-switch");
  if (!btn) return;

  const isLitHash = () => location.hash === "#lit";

  const setLit = (on) => {
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.classList.toggle("is-on", on);
    document.body.classList.toggle("is-lit", on);
  };

  const syncFromUrl = () => {
    setLit(isLitHash());
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLitHash()) {
      // Zgaś: cofnij wpis #lit — zostajemy na /without/
      history.back();
    } else {
      // Zapal: nowy wpis historii, żeby Wstecz wracało do ciemnego without, nie na with
      history.pushState({ lit: true }, "", "#lit");
      setLit(true);
    }
  });

  window.addEventListener("popstate", syncFromUrl);
  syncFromUrl();
})();
