(() => {
  const btn = document.querySelector(".lamp-switch");
  if (!btn) return;

  const isLitHash = () => location.hash === "#lit";

  const SWAY_VOL_MAX = 0.45;

  /* —— dźwięki z sound/ —— */
  const sway = new Audio("../sound/lamp-swaying.mp3");
  sway.loop = true;
  sway.preload = "auto";
  sway.volume = SWAY_VOL_MAX;

  const clickFx = new Audio("../sound/lamp-switch.mp3");
  clickFx.preload = "auto";
  clickFx.volume = 0.7;

  let lit = false;
  let unlocked = false;

  /* Im niżej scroll, tym dalej / ciszej lampa — miejsce na inne dźwięki */
  const fadeRange = () => Math.max(window.innerHeight * 0.9, 420);

  const updateSwayDistance = () => {
    const t = Math.min(1, Math.max(0, window.scrollY / fadeRange()));
    const gain = (1 - t) * (1 - t);
    sway.volume = SWAY_VOL_MAX * gain;
  };

  let scrollTick = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollTick) return;
      scrollTick = true;
      requestAnimationFrame(() => {
        scrollTick = false;
        updateSwayDistance();
      });
    },
    { passive: true }
  );
  window.addEventListener("resize", updateSwayDistance, { passive: true });
  updateSwayDistance();

  const setLit = (on) => {
    if (on === lit) return;
    lit = on;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.classList.toggle("is-on", on);
    document.body.classList.toggle("is-lit", on);
    /* switch przy czarne↔białe (i odwrotnie) */
    clickFx.currentTime = 0;
    const p = clickFx.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

  const tryPlaySway = () => {
    updateSwayDistance();
    const p = sway.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        unlocked = true;
      }).catch(() => {});
    }
  };

  const unlock = () => {
    if (unlocked && !sway.paused) return;
    tryPlaySway();
  };

  document.addEventListener("pointerdown", unlock, { once: true, passive: true });
  document.addEventListener("keydown", unlock, { once: true, passive: true });
  tryPlaySway();

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    unlock();
    if (isLitHash()) {
      history.back();
    } else {
      history.pushState({ lit: true }, "", "#lit");
      setLit(true);
    }
  });

  window.addEventListener("popstate", () => {
    setLit(isLitHash());
  });

  /* start: bez dźwięku switch przy samym wejściu / odświeżeniu */
  lit = isLitHash();
  btn.setAttribute("aria-pressed", lit ? "true" : "false");
  btn.classList.toggle("is-on", lit);
  document.body.classList.toggle("is-lit", lit);
})();
