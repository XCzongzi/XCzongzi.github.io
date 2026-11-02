(() => {
  "use strict";
  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const storageKey = "xczongzi-theme";
  let preference = null;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "parchment" || saved === "amber") preference = saved;
  } catch { /* The theme also works when browser storage is unavailable. */ }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const dark = theme === "amber";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#33251d" : "#eadbc1");
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.querySelector("[data-theme-label]").textContent = dark ? "深色模式" : "浅色模式";
      const icon = button.querySelector("[data-theme-icon]");
      if (icon) icon.textContent = dark ? "☾" : "☀";
      button.setAttribute("aria-label", dark ? "切换到浅色模式" : "切换到深色模式");
      button.setAttribute("aria-pressed", String(dark));
      button.title = dark ? "切换到浅色模式" : "切换到深色模式";
    });
  }
  const preferredTheme = () => preference || (systemTheme.matches ? "amber" : "parchment");
  applyTheme(preferredTheme());
  systemTheme.addEventListener("change", () => { if (!preference) applyTheme(preferredTheme()); });
  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    preference = event.newValue === "parchment" || event.newValue === "amber" ? event.newValue : null;
    applyTheme(preferredTheme());
  });
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(preferredTheme());
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        preference = root.dataset.theme === "amber" ? "parchment" : "amber";
        try { localStorage.setItem(storageKey, preference); } catch { /* Keep the in-memory choice. */ }
        applyTheme(preference);
      });
    });
  });
})();
