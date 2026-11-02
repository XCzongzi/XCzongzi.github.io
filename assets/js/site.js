(() => {
  "use strict";
  const cover = document.querySelector("[data-cover]");
  if (!cover) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const profile = document.querySelector(".profile");
  const coverReturn = document.querySelector(".cover-return");
  const revealLink = document.querySelector(".reveal-link");
  const sections = [...document.querySelectorAll(".information > section[id]")];
  const links = [...document.querySelectorAll(".side-nav a")];
  let scheduled = false;
  let animationFrame = 0;

  function revealOffset() {
    return Math.max(0, cover.getBoundingClientRect().height - parseFloat(getComputedStyle(profile).top));
  }

  function update() {
    const scroll = Math.max(0, window.scrollY);
    const expanded = scroll > 1 || animationFrame !== 0;
    document.body.classList.toggle("is-expanded", expanded);
    coverReturn.tabIndex = expanded ? 0 : -1;
    // As the cover clips from the top, keep the image's center in the
    // remaining viewport. Stop moving it together with the pinned cover.
    const coverScroll = Math.min(scroll, revealOffset());
    cover.style.setProperty("--cover-offset", `${coverScroll * .5}px`);
    const readingEdge = profile.getBoundingClientRect().bottom + 48;
    const active = expanded ? sections.filter((section) => section.getBoundingClientRect().top <= readingEdge).at(-1) : null;
    links.forEach((link) => {
      if (active && link.hash === `#${active.id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    scheduled = false;
  }

  function stopAnimation() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }

  function animateScroll(target) {
    stopAnimation();
    const start = window.scrollY;
    const destination = Math.max(0, Math.min(target, document.documentElement.scrollHeight - window.innerHeight));
    if (reduceMotion.matches || Math.abs(destination - start) < 1) {
      window.scrollTo({ top: destination, behavior: "instant" });
      update();
      return;
    }
    const started = performance.now();
    function step(now) {
      const progress = Math.min(1, (now - started) / 520);
      const eased = 1 - Math.pow(1 - progress, 3);
      window.scrollTo({ top: start + (destination - start) * eased, behavior: "instant" });
      if (progress < 1) animationFrame = requestAnimationFrame(step);
      else animationFrame = 0;
      update();
    }
    animationFrame = requestAnimationFrame(step);
    update();
  }

  function revealInformation() {
    if (animationFrame) return;
    animateScroll(revealOffset());
  }

  window.addEventListener("wheel", (event) => {
    if (event.ctrlKey || event.metaKey || event.deltaY === 0 || event.defaultPrevented) return;
    const rail = event.target.closest?.(".side-rail");
    if (rail && rail.scrollHeight > rail.clientHeight) return;
    if (animationFrame) {
      event.preventDefault();
      return;
    }
    if (window.scrollY <= 1 && event.deltaY > 0) {
      event.preventDefault();
      revealInformation();
    }
  }, { passive: false });

  window.addEventListener("scroll", () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("pageshow", update);
  window.addEventListener("resize", () => { stopAnimation(); update(); });
  window.addEventListener("pointerdown", stopAnimation, { passive: true });
  window.addEventListener("touchstart", stopAnimation, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (["Escape", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) stopAnimation();
  });
  links.forEach((link) => link.addEventListener("click", stopAnimation));

  revealLink.addEventListener("click", (event) => {
    event.preventDefault();
    revealInformation();
  });
  profile.addEventListener("click", (event) => {
    if (!event.defaultPrevented && window.scrollY <= 1 && !event.target.closest("a")) revealInformation();
  });
  document.querySelectorAll("[data-cover-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      animateScroll(0);
      history.replaceState(null, "", `${location.pathname}${location.search}`);
    });
  });
  update();
})();
