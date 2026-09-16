(() => {
  "use strict";

  const escapeHTML = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const portfolioId = document.body.dataset.portfolio;
  const portfolio = window.XCZONGZI_CONTENT?.portfolios?.[portfolioId];
  if (!portfolio) return;

  document.title = `${portfolio.title} · XCzongzi`;
  document.querySelector("[data-portfolio-eyebrow]").textContent = portfolio.eyebrow;
  document.querySelector("[data-portfolio-statement]").textContent = portfolio.statement;
  document.querySelector("[data-portfolio-description]").textContent = portfolio.description;
  document.querySelector("[data-portfolio-tags]").innerHTML = portfolio.tags
    .map((tag) => `<span>${escapeHTML(tag)}</span>`)
    .join("");

  const projectRoot = document.querySelector("[data-project-grid]");
  if (portfolio.comingSoon) {
    projectRoot.innerHTML = '<div class="empty-state empty-state--coming"><span>✦</span><h2>敬请期待。</h2><p>第一个游戏世界正在酝酿。</p></div>';
  } else if (!portfolio.projects.length) {
    projectRoot.innerHTML = '<div class="empty-state"><span>+</span><h2>作品集正在整理。</h2><p>下一件作品会出现在这里。</p></div>';
  } else {
    projectRoot.innerHTML = portfolio.projects.map((project, index) => `
      <article class="project-item">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div><h2>${escapeHTML(project.title)}</h2><p>${escapeHTML(project.description)}</p></div>
        <a href="${escapeHTML(project.url || "#")}" ${project.url ? 'target="_blank" rel="noreferrer"' : ""}>查看 <b>↗</b></a>
      </article>
    `).join("");
  }

  document.querySelector("[data-year]").textContent = new Date().getFullYear();

  const header = document.querySelector("[data-header]");
  const menu = document.querySelector("[data-menu]");
  const menuButton = document.querySelector("[data-menu-button]");
  menuButton.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "关闭菜单" : "打开菜单");
  });
  menu.addEventListener("click", (event) => {
    if (!event.target.matches("a")) return;
    header.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
})();
