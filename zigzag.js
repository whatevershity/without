(() => {
  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const blocks = document.querySelectorAll(".story-block[data-reveal]");
  const glitch = document.querySelector(".story-glitch-line");

  if (!blocks.length) return;

  if (reduce) {
    blocks.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const reveal = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      });
    },
    { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.18 }
  );

  blocks.forEach((el) => reveal.observe(el));

  if (!glitch) return;

  const glitchOnce = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-glitch");
        obs.unobserve(entry.target);
      });
    },
    { root: null, threshold: 0.6 }
  );

  glitchOnce.observe(glitch);
})();
