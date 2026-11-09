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
    card.className = project.image ? "link-card work-card minecraft-card" : "link-card work-card";
    card.href = project.url;
    if (/^https?:\/\//i.test(project.url)) {
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    }
    if (project.id) card.id = project.id;
    if (project.image) {
      const image = document.createElement("img");
      image.className = "minecraft-card-image";
      if (project.imageFit === "contain") image.classList.add("minecraft-card-image--contain");
      image.src = `../assets/images/minecraft/${project.image}`;
      image.alt = project.imageAlt;
      image.width = image.height = 320;
      image.loading = list.children.length ? "lazy" : "eager";
      image.decoding = "async";
      const copy = document.createElement("div");
      copy.className = "minecraft-card-copy";
      const meta = document.createElement("p");
      meta.className = "minecraft-card-meta";
      meta.textContent = `${project.genre} · ${project.players}`;
      const title = document.createElement("h2");
      title.textContent = project.title;
      const summary = document.createElement("p");
      summary.className = "minecraft-card-summary";
      summary.textContent = project.summary;
      const footer = document.createElement("div");
      footer.className = "minecraft-card-footer";
      const version = document.createElement("span");
      version.textContent = `推荐 ${project.recommendedVersion}`;
      const action = document.createElement("span");
      action.className = "minecraft-card-action";
      action.textContent = "介绍与下载";
      footer.append(version, action);
      copy.append(meta, title, summary, footer);
      card.append(image, copy);
      list.append(card);
      continue;
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
