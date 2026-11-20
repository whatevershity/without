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

  /* —— zardzewiałe bujanie: loop przy sway, pause na hover —— */
  const creak = new Audio("../lamp-creak.ogg");
  creak.loop = true;
  creak.preload = "auto";
  creak.volume = 0.38;

  let unlocked = false;
  let pausedByHover = false;

  const tryPlay = () => {
    if (pausedByHover) return;
    const p = creak.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        unlocked = true;
      }).catch(() => {
        /* autoplay zablokowany — odblokujemy przy pierwszej interakcji */
      });
    }
  };

  const pauseCreak = () => {
    pausedByHover = true;
    creak.pause();
  };

  const resumeCreak = () => {
    pausedByHover = false;
    tryPlay();
  };

  const unlock = () => {
    if (unlocked && !creak.paused) return;
    tryPlay();
  };

  document.addEventListener("pointerdown", unlock, { once: true, passive: true });
  document.addEventListener("keydown", unlock, { once: true, passive: true });
  /* klik z /with/ czasem pozwala od razu */
  tryPlay();

  btn.addEventListener("pointerenter", pauseCreak);
  btn.addEventListener("pointerleave", resumeCreak);
  btn.addEventListener("focus", pauseCreak);
  btn.addEventListener("blur", resumeCreak);

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    unlock();
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
