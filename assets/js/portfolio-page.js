(() => {
  "use strict";
  const id = document.body.dataset.portfolio;
  const portfolio = window.XCZONGZI_CONTENT?.portfolios?.[id];
  if (!portfolio) return;
  document.title = `${portfolio.title} · XCzongzi`;
  document.querySelector("[data-portfolio-title]").textContent = portfolio.title;
  const list = document.querySelector("[data-project-list]");
  if (!portfolio.projects.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "暂无作品";
    list.append(empty);
    return;
  }
  for (const project of portfolio.projects) {
    const card = document.createElement("a");
    card.className = "link-card work-card";
    card.href = project.url;
    if (/^https?:\/\//i.test(project.url)) {
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    }
    const icon = document.createElement("span");
    icon.className = "card-icon work-icon";
    const logo = document.createElement("img");
    logo.src = "../assets/images/logo.png";
    logo.alt = "";
    logo.width = logo.height = 28;
    icon.append(logo);
    const title = document.createElement("h2");
    title.textContent = project.title;
    card.append(icon, title);
    list.append(card);
  }
})();
