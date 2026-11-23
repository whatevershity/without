(() => {
  const btn = document.querySelector(".lamp-switch");
  if (!btn) return;

  const isLitHash = () => location.hash === "#lit";

  const SWAY_VOL_MAX = 0.45;
  /* tempo jak szybkie czytanie — słowo po słowie */
  /* trochę wolniej — nadal jak czytanie, nie jak maszyna */
  const WORD_MS = 155;

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
  heyFx.playbackRate = 0.72;
  try {
    heyFx.preservesPitch = false;
  } catch (_) {}

  let lit = false;
  let unlocked = false;
  let shoutSettled = false;
  let apologySettled = false;
  /* po apology — lampa nie wraca do światła; tylko dźwięk kliknięcia */
  let lampLocked = false;

  const shoutRoot = document.querySelector(".lit-shout");
  const shoutHey = document.querySelector(".lit-shout-hey");
  const shoutRest = document.querySelector(".lit-shout-rest");
  const apologyRoot = document.querySelector(".apology");
  const apologyLines = document.querySelector(".apology-lines");
  const apologyPhoto = document.querySelector(".apology-photo");
  const okSoRoot = document.querySelector(".ok-so");
  const okSoLine = document.querySelector(".ok-so-line");

  const FINAL_REST = ["TURN OFF", "THE LIGHT!", "IT'S TOO LOUD!"];
  /* bloki jak w ref (krótkie wersy + większa przerwa między grupami) */
  const APOLOGY = [
    ["I apologize,"],
    ["but when I’m working,", "a sudden change"],
    ["in my surroundings", "throws me off rhythm."],
  ];
  const OK_SO = "Ok, so.";

  let restTimer = 0;
  let settleTimer = 0;
  let wordTimers = [];

  const clearWordTimers = () => {
    wordTimers.forEach((id) => window.clearTimeout(id));
    wordTimers = [];
  };

  const wordsHtml = (text) =>
    text
      .split(/(\s+)/)
      .map((tok) => {
        if (/^\s+$/.test(tok)) return tok;
        if (!tok) return "";
        return `<span class="w">${tok}</span>`;
      })
      .join("");

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
      shoutRoot.classList.remove("is-exiting");
      shoutRoot.setAttribute("aria-hidden", "false");
    }
    if (shoutHey) shoutHey.classList.remove("is-popping");
    if (shoutRest) shoutRest.classList.remove("is-popping");
  };

  /* zamień linie krzyku na słowa — do wyjścia słowo-po-słowie */
  const explodeShoutToWords = () => {
    if (!shoutHey || !shoutRest) return [];
    const heyText = shoutHey.textContent.trim() || "HEY!";
    shoutHey.innerHTML = wordsHtml(heyText);
    shoutHey.classList.remove("is-popping");

    const restText = FINAL_REST.join(" ");
    shoutRest.classList.remove("is-popping");
    shoutRest.innerHTML = `<span class="lit-line">${wordsHtml(restText)}</span>`;

    const words = [...shoutRoot.querySelectorAll(".w")];
    words.forEach((w) => {
      w.classList.add("is-on");
      w.style.opacity = "1";
    });
    return words;
  };

  const staggerWords = (words, turnOn, startAt = 0) => {
    words.forEach((el, i) => {
      const id = window.setTimeout(() => {
        el.classList.toggle("is-on", turnOn);
        if (!turnOn) el.style.opacity = "0";
        else el.style.opacity = "";
      }, startAt + i * WORD_MS);
      wordTimers.push(id);
    });
    return startAt + Math.max(0, words.length - 1) * WORD_MS;
  };

  const lockLamp = () => {
    lampLocked = true;
    btn.classList.add("is-locked");
    btn.setAttribute("aria-disabled", "true");
  };

  const playClickOnly = () => {
    clickFx.currentTime = 0;
    const p = clickFx.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

  const PHOTO_SLICES = 18;

  const buildApologyPhotoSlices = () => {
    if (!apologyPhoto || apologyPhoto.dataset.sliced === "1") return;
    const srcImg = apologyPhoto.querySelector(".apology-photo-src");
    const host = apologyPhoto.querySelector(".apology-photo-slices");
    if (!srcImg || !host) return;
    const src = srcImg.getAttribute("src");
    host.innerHTML = "";
    for (let i = 0; i < PHOTO_SLICES; i += 1) {
      const slice = document.createElement("div");
      slice.className = "apology-photo-slice";
      slice.style.setProperty("--i", String(i));
      slice.style.setProperty("--n", String(PHOTO_SLICES));
      /* nierówne tempo + lekkie poszarpanie boków */
      const jitter = ((i * 37) % 11) * 10 + (i % 4) * 14;
      slice.style.setProperty("--delay", `${i * 58 + jitter}ms`);
      slice.style.setProperty("--jx", `${(i * 5) % 4}%`);
      slice.style.setProperty("--jy", `${(i * 3) % 3}%`);
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.draggable = false;
      slice.appendChild(img);
      host.appendChild(slice);
    }
    apologyPhoto.dataset.sliced = "1";
  };

  const openApologyPhoto = (instant = false) => {
    if (!apologyPhoto) return;
    buildApologyPhotoSlices();
    if (instant) {
      apologyPhoto.classList.add("is-open");
      apologyPhoto.querySelectorAll(".apology-photo-slice").forEach((slice) => {
        slice.style.transition = "none";
        slice.style.clipPath = `inset(0 ${slice.style.getPropertyValue("--jx") || "0%"} 0 ${slice.style.getPropertyValue("--jy") || "0%"})`;
      });
      return;
    }
    apologyPhoto.classList.remove("is-open");
    apologyPhoto.querySelectorAll(".apology-photo-slice").forEach((slice) => {
      slice.style.transition = "";
      slice.style.clipPath = "";
    });
    void apologyPhoto.offsetWidth;
    apologyPhoto.classList.add("is-open");
  };

  const hideApology = () => {
    if (apologyRoot) {
      apologyRoot.classList.remove("is-on");
      apologyRoot.setAttribute("aria-hidden", "true");
    }
    if (apologyPhoto) {
      apologyPhoto.classList.remove("is-open");
      apologyPhoto.querySelectorAll(".apology-photo-slice").forEach((slice) => {
        slice.style.transition = "";
        slice.style.clipPath = "";
      });
    }
    if (okSoRoot) {
      okSoRoot.classList.remove("is-on");
      okSoRoot.setAttribute("aria-hidden", "true");
    }
    if (okSoLine) okSoLine.innerHTML = "";
  };

  const revealOkSo = (startAt = 0, instant = false) => {
    if (!okSoRoot || !okSoLine) return startAt;
    okSoLine.innerHTML = wordsHtml(OK_SO);
    const words = [...okSoLine.querySelectorAll(".w")];
    okSoRoot.classList.add("is-on");
    okSoRoot.setAttribute("aria-hidden", "false");
    if (instant) {
      words.forEach((w) => {
        w.classList.add("is-on");
        w.style.opacity = "";
      });
      return startAt;
    }
    words.forEach((w) => {
      w.classList.remove("is-on");
      w.style.opacity = "0";
    });
    return staggerWords(words, true, startAt);
  };

  const apologyHtml = () =>
    APOLOGY.map(
      (block) =>
        `<span class="apology-block">${block
          .map((line) => `<span class="apology-line">${wordsHtml(line)}</span>`)
          .join("")}</span>`
    ).join("");

  const showApologyInstant = () => {
    if (!apologyRoot || !apologyLines) return;
    apologyLines.innerHTML = apologyHtml();
    apologyLines.querySelectorAll(".w").forEach((w) => {
      w.classList.add("is-on");
      w.style.opacity = "";
    });
    apologyRoot.classList.add("is-on");
    apologyRoot.setAttribute("aria-hidden", "false");
    openApologyPhoto(true);
    apologySettled = true;
    lockLamp();
    revealOkSo(0, true);
  };

  const crossfadeToApology = () => {
    window.clearTimeout(restTimer);
    window.clearTimeout(settleTimer);
    clearWordTimers();
    heyFx.pause();
    heyFx.currentTime = 0;

    if (!shoutRoot) {
      showApologyInstant();
      return;
    }

    /* już było — tylko pokaż apology, schowaj shout */
    if (apologySettled) {
      shoutRoot.classList.remove("is-settled", "is-exiting");
      shoutRoot.setAttribute("aria-hidden", "true");
      if (shoutHey) shoutHey.innerHTML = "";
      if (shoutRest) shoutRest.innerHTML = "";
      showApologyInstant();
      return;
    }

    if (!shoutHey?.textContent && !shoutRest?.textContent) {
      showApologyInstant();
      return;
    }

    const shoutWords = explodeShoutToWords();
    shoutRoot.classList.add("is-exiting", "is-settled");
    shoutRoot.setAttribute("aria-hidden", "false");

    if (apologyLines) {
      apologyLines.innerHTML = apologyHtml();
    }
    const apologyWords = apologyRoot
      ? [...apologyRoot.querySelectorAll(".w")]
      : [];
    apologyWords.forEach((w) => {
      w.classList.remove("is-on");
      w.style.opacity = "0";
    });
    if (apologyRoot) {
      apologyRoot.classList.add("is-on");
      apologyRoot.setAttribute("aria-hidden", "false");
    }
    /* zdjęcie razem z akapitem — rozwija się z góry */
    openApologyPhoto(false);

    /* równolegle: shout out + apology in; potem „Ok, so.” @ 5/8 */
    staggerWords(shoutWords, false, 0);
    const apologyEnd = staggerWords(apologyWords, true, 0);
    const okSoEnd = revealOkSo(apologyEnd + WORD_MS * 2, false);

    wordTimers.push(
      window.setTimeout(() => {
        shoutRoot.classList.remove("is-settled", "is-exiting");
        shoutRoot.setAttribute("aria-hidden", "true");
        if (shoutHey) shoutHey.innerHTML = "";
        if (shoutRest) shoutRest.innerHTML = "";
        apologySettled = true;
        shoutSettled = true;
        lockLamp();
      }, okSoEnd + 140)
    );
  };

  const startShout = () => {
    if (!shoutRoot || !shoutHey || !shoutRest) return;

    clearWordTimers();
    hideApology();

    /* już po pierwszym krzyku — wróć bez popu */
    if (shoutSettled) {
      shoutHey.textContent = "HEY!";
      shoutRest.innerHTML = linesToHtml(FINAL_REST, 1);
      shoutRoot.classList.add("is-settled");
      shoutRoot.classList.remove("is-exiting");
      shoutRoot.setAttribute("aria-hidden", "false");
      return;
    }

    shoutRoot.setAttribute("aria-hidden", "false");
    shoutRoot.classList.remove("is-settled", "is-exiting");

    shoutHey.classList.remove("is-popping");
    shoutHey.textContent = "HEY!";
    void shoutHey.offsetWidth;
    shoutHey.classList.add("is-popping");
    playHey();

    shoutRest.innerHTML = "";
    shoutRest.classList.remove("is-popping");
    window.clearTimeout(restTimer);
    window.clearTimeout(settleTimer);
    restTimer = window.setTimeout(() => {
      shoutRest.innerHTML = linesToHtml(FINAL_REST, 1);
      void shoutRest.offsetWidth;
      shoutRest.classList.add("is-popping");
      const restMs = 520 + FINAL_REST.length * 70 + 80;
      settleTimer = window.setTimeout(markSettled, restMs);
    }, 520);
  };

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
    /* zablokowana — nie wracaj do światła (nawet z historii) */
    if (lampLocked && on) return;
    lit = on;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.classList.toggle("is-on", on);
    document.body.classList.toggle("is-lit", on);
    playClickOnly();
    updateSwayDistance();
    if (on) startShout();
    else crossfadeToApology();
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
    /* po apology: tylko klik dźwiękowy, zero przejścia */
    if (lampLocked) {
      playClickOnly();
      return;
    }
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

  lit = isLitHash();
  btn.setAttribute("aria-pressed", lit ? "true" : "false");
  btn.classList.toggle("is-on", lit);
  document.body.classList.toggle("is-lit", lit);
  updateSwayDistance();
  if (lit) startShout();
})();
