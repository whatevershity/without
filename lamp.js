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

  const heyFx = new Audio("../sound/hey.mp3");
  heyFx.preload = "auto";
  heyFx.volume = 0.85;
  /* zwolnione — w sensie dźwięk */
  heyFx.playbackRate = 0.72;
  try {
    heyFx.preservesPitch = false;
  } catch (_) {}

  let lit = false;
  let unlocked = false;
  let shoutSettled = false;

  /*
    Krzyk raz: HEY! + reszta wchodzi po nim (pop + smear),
    potem napisy się zatrzymują i zostają na stronie
    (po zgaszeniu — biały tekst).
  */
  const shoutRoot = document.querySelector(".lit-shout");
  const shoutHey = document.querySelector(".lit-shout-hey");
  const shoutRest = document.querySelector(".lit-shout-rest");
  const FINAL_REST = ["TURN OFF", "THE LIGHT!", "IT'S TOO LOUD!"];
  let restTimer = 0;
  let settleTimer = 0;

  const linesToHtml = (lines, startI = 0) =>
    lines
      .map(
        (line, i) =>
          `<span class="lit-line" style="--i:${startI + i}">${line}</span>`
      )
      .join("");

  const playHey = () => {
    heyFx.currentTime = 0;
    heyFx.playbackRate = 0.72;
    const p = heyFx.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

  const markSettled = () => {
    shoutSettled = true;
    if (shoutRoot) {
      shoutRoot.classList.add("is-settled");
      shoutRoot.setAttribute("aria-hidden", "false");
    }
    if (shoutHey) shoutHey.classList.remove("is-popping");
    if (shoutRest) shoutRest.classList.remove("is-popping");
  };

  const startShout = () => {
    if (!shoutRoot || !shoutHey || !shoutRest) return;

    /* już po efekcie — tylko zostań (kolor CSS przełącza się z is-lit) */
    if (shoutSettled) {
      shoutRoot.classList.add("is-settled");
      shoutRoot.setAttribute("aria-hidden", "false");
      return;
    }

    shoutRoot.setAttribute("aria-hidden", "false");
    shoutRoot.classList.remove("is-settled");

    /* 1) HEY! + dźwięk */
    shoutHey.classList.remove("is-popping");
    shoutHey.textContent = "HEY!";
    void shoutHey.offsetWidth;
    shoutHey.classList.add("is-popping");
    playHey();

    /* 2) reszta raz — potem stop */
    shoutRest.innerHTML = "";
    shoutRest.classList.remove("is-popping");
    window.clearTimeout(restTimer);
    window.clearTimeout(settleTimer);
    restTimer = window.setTimeout(() => {
      shoutRest.innerHTML = linesToHtml(FINAL_REST, 1);
      void shoutRest.offsetWidth;
      shoutRest.classList.add("is-popping");
      /* po popie — zatrzymaj na stałe */
      const restMs = 520 + FINAL_REST.length * 70 + 80;
      settleTimer = window.setTimeout(markSettled, restMs);
    }, 520);
  };

  /* zgaszenie: nie kasuj tekstu — zostaje, biały na ciemnym */
  const keepShoutOnDark = () => {
    window.clearTimeout(restTimer);
    window.clearTimeout(settleTimer);
    heyFx.pause();
    heyFx.currentTime = 0;
    if (!shoutRoot) return;
    if (shoutHey?.textContent || shoutRest?.textContent) {
      markSettled();
    }
  };

  /* Im niżej scroll, tym dalej / ciszej lampa — na bieli wycisz */
  const fadeRange = () => Math.max(window.innerHeight * 0.9, 420);

  const updateSwayDistance = () => {
    if (lit) {
      sway.volume = 0;
      return;
    }
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
    updateSwayDistance();
    if (on) startShout();
    else keepShoutOnDark();
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
  updateSwayDistance();
  if (lit) startShout();
})();
