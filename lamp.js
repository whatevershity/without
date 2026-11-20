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

  /*
    Krzyk na bieli:
    HEY! zostaje; reszta wchodzi po nim (pop małe→duże + smear-cień).
    Pozycja: środek / lekko w prawo.
  */
  const shoutRoot = document.querySelector(".lit-shout");
  const shoutHey = document.querySelector(".lit-shout-hey");
  const shoutRest = document.querySelector(".lit-shout-rest");
  const restVariants = [
    ["TURN OFF", "THE LIGHT!", "IT'S TOO LOUD!"],
    ["TURN OFF", "THE LIGHT!", "TOO LOUD!"],
    ["TOO LOUD!", "TURN IT OFF!"],
    ["THE LIGHT!", "IT'S TOO LOUD!"],
    ["TURN IT OFF!", "TOO LOUD!", "THE LIGHT!"],
    ["IT'S TOO LOUD!", "TURN IT OFF!"],
  ];
  let shoutIndex = 0;
  let shoutTimer = 0;
  let restTimer = 0;

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

  const renderRest = (lines) => {
    if (!shoutRest) return;
    shoutRest.classList.remove("is-popping");
    shoutRest.innerHTML = linesToHtml(lines, 1);
    void shoutRest.offsetWidth;
    shoutRest.classList.add("is-popping");
  };

  const nextDelay = () => {
    const roll = Math.random();
    if (roll < 0.15) return 420 + Math.random() * 200;
    if (roll < 0.55) return 700 + Math.random() * 320;
    return 980 + Math.random() * 480;
  };

  const scheduleRestCycle = () => {
    window.clearTimeout(shoutTimer);
    shoutTimer = window.setTimeout(() => {
      if (Math.random() > 0.2) {
        shoutIndex =
          (shoutIndex + 1 + Math.floor(Math.random() * 2)) % restVariants.length;
      }
      renderRest(restVariants[shoutIndex]);
      scheduleRestCycle();
    }, nextDelay());
  };

  const stopShout = () => {
    window.clearTimeout(shoutTimer);
    window.clearTimeout(restTimer);
    shoutTimer = 0;
    restTimer = 0;
    heyFx.pause();
    heyFx.currentTime = 0;
    if (shoutRoot) shoutRoot.setAttribute("aria-hidden", "true");
    if (shoutHey) {
      shoutHey.classList.remove("is-popping");
      shoutHey.textContent = "";
    }
    if (shoutRest) {
      shoutRest.classList.remove("is-popping");
      shoutRest.innerHTML = "";
    }
  };

  const startShout = () => {
    if (!shoutRoot || !shoutHey || !shoutRest) return;
    shoutRoot.setAttribute("aria-hidden", "false");
    shoutIndex = 0;

    /* 1) HEY! — zostaje; dźwięk zwolniony */
    shoutHey.classList.remove("is-popping");
    shoutHey.textContent = "HEY!";
    void shoutHey.offsetWidth;
    shoutHey.classList.add("is-popping");
    playHey();

    /* 2) reszta wchodzi po nim */
    shoutRest.innerHTML = "";
    shoutRest.classList.remove("is-popping");
    window.clearTimeout(restTimer);
    restTimer = window.setTimeout(() => {
      renderRest(restVariants[0]);
      scheduleRestCycle();
    }, 520);
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
    else stopShout();
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
  else stopShout();
})();
