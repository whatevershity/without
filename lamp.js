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

  /* Krzyk przez hałas — jakbyś chciał go trochę przekrzyczeć */
  const shoutRoot = document.querySelector(".lit-shout");
  const shoutLines = document.querySelector(".lit-shout-lines");
  const shoutGhost = document.querySelector(".lit-shout-ghost");
  const shoutVariants = [
    ["HEY, TURN OFF", "THE LIGHT!", "IT'S TOO LOUD!"],
    ["TURN OFF", "THE LIGHT!", "TOO LOUD!"],
    ["HEY!", "TOO LOUD!", "TURN IT OFF!"],
    ["THE LIGHT!", "IT'S TOO LOUD!", "HEY!"],
    ["TURN IT OFF!", "TOO LOUD!", "THE LIGHT!"],
    ["HEY—", "TOO LOUD!", "TURN IT OFF!"],
    ["IT'S TOO LOUD!", "HEY!", "THE LIGHT!"],
  ];
  let shoutIndex = 0;
  let shoutTimer = 0;
  let lastLinesHtml = "";

  const linesToHtml = (lines) =>
    lines
      .map((line, i) => `<span class="lit-line" style="--i:${i}">${line}</span>`)
      .join("");

  const renderShout = (lines) => {
    if (!shoutLines) return;
    if (shoutGhost && lastLinesHtml) {
      shoutGhost.innerHTML = lastLinesHtml;
      shoutGhost.classList.remove("is-echo");
      void shoutGhost.offsetWidth;
      shoutGhost.classList.add("is-echo");
    }
    const html = linesToHtml(lines);
    lastLinesHtml = html;
    shoutLines.classList.remove("is-smearing", "is-shaking");
    shoutLines.innerHTML = html;
    void shoutLines.offsetWidth;
    shoutLines.classList.add("is-smearing", "is-shaking");
  };

  const nextDelay = () => {
    /* nierówne tempo — jak krzyczenie przez hałas */
    const roll = Math.random();
    if (roll < 0.15) return 320 + Math.random() * 180; /* staccato */
    if (roll < 0.55) return 520 + Math.random() * 280;
    return 780 + Math.random() * 420;
  };

  const scheduleNext = () => {
    window.clearTimeout(shoutTimer);
    shoutTimer = window.setTimeout(() => {
      /* czasem powtórz tę samą frazę — jakby nie dosłyszeli */
      if (Math.random() > 0.22) {
        shoutIndex = (shoutIndex + 1 + Math.floor(Math.random() * 2)) % shoutVariants.length;
      }
      renderShout(shoutVariants[shoutIndex]);
      scheduleNext();
    }, nextDelay());
  };

  const stopShout = () => {
    window.clearTimeout(shoutTimer);
    shoutTimer = 0;
    lastLinesHtml = "";
    if (shoutRoot) shoutRoot.setAttribute("aria-hidden", "true");
    if (shoutLines) {
      shoutLines.classList.remove("is-smearing", "is-shaking");
      shoutLines.innerHTML = "";
    }
    if (shoutGhost) {
      shoutGhost.classList.remove("is-echo");
      shoutGhost.innerHTML = "";
    }
  };

  const startShout = () => {
    if (!shoutRoot || !shoutLines) return;
    shoutRoot.setAttribute("aria-hidden", "false");
    shoutIndex = 0;
    lastLinesHtml = "";
    renderShout(shoutVariants[0]);
    scheduleNext();
  };

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
  if (lit) startShout();
  else stopShout();
})();
