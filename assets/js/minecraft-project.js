(() => {
  "use strict";
  const projects = window.XCZONGZI_CONTENT?.portfolios?.minecraft?.projects || [];
  const project = projects.find((item) => item.id === document.body.dataset.minecraftProject);
  if (!project) return;
  const imageRoot = "../../../assets/images/minecraft/";
  const source = `https://afdian.com/album/a174f53aa2e111ed99fa5254001e7c00/${project.source}`;
  const main = document.querySelector("[data-minecraft-detail]");

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function link(text, url, className, external = true) {
    const node = element("a", className, text);
    node.href = url;
    if (external) {
      node.target = "_blank";
      node.rel = "noopener noreferrer";
    }
    return node;
  }

  function section(title, id) {
    const node = element("section", "project-section");
    node.id = id;
    const heading = element("h2", "", title);
    heading.id = `${id}-title`;
    node.setAttribute("aria-labelledby", heading.id);
    node.append(heading);
    main.append(node);
    return node;
  }

  document.title = `${project.title} · Minecraft · XCzongzi`;
  const hero = element("header", "minecraft-hero");
  const identity = element("div");
  identity.append(element("p", "minecraft-eyebrow", `${project.genre} · ${project.players}`));
  identity.append(element("h1", "", project.title));
  identity.append(element("p", "project-description", project.summary));
  const actions = element("div", "project-actions");
  actions.append(link("获取地图", "#downloads", "project-button project-button--primary", false));
  actions.append(link("爱发电原文", source, "project-source"));
  if (project.video) actions.append(link("观看介绍视频", project.video, "project-source"));
  identity.append(actions);
  const cover = element("img", "minecraft-hero-image");
  if (project.imageFit === "contain") cover.classList.add("minecraft-hero-image--contain");
  cover.src = imageRoot + project.image;
  cover.alt = project.imageAlt;
  cover.width = cover.height = 640;
  cover.decoding = "async";
  hero.append(identity, cover);

  // Keep the static fallback available if scripts fail to load.
  main.replaceChildren(hero);
  const facts = element("dl", "project-facts");
  for (const [label, value] of [
    ["支持版本", `Minecraft ${project.gameVersion}`],
    ["推荐版本", project.recommendedVersion],
    ["游戏人数", project.players],
    ["发布日期", project.released]
  ]) {
    const fact = element("div");
    fact.append(element("dt", "", label), element("dd", "", value));
    facts.append(fact);
  }
  main.append(facts);
  const introduction = section("玩法介绍", "introduction");
  const prose = element("div", "minecraft-prose");
  for (const paragraph of project.introduction) prose.append(element("p", "", paragraph));
  introduction.append(prose);
  if (project.notes?.length) {
    const notes = element("ul", "minecraft-notes");
    for (const note of project.notes) notes.append(element("li", "", note));
    introduction.append(notes);
  }
  if (project.related) {
    const related = projects.find((item) => item.id === project.related);
    if (related) introduction.append(link(`浏览${related.title}`, `../${related.id}/`, "text-link minecraft-related", false));
  }

  const screenshots = project.gallery || [];
  if (screenshots.length) {
    const gallerySection = section("游戏预览", "gallery");
    const gallery = element("div", "minecraft-gallery");
    screenshots.forEach((shot, index) => {
      const figure = element("figure");
      const button = element("button");
      button.type = "button";
      button.setAttribute("aria-label", `放大查看：${shot.caption}`);
      button.setAttribute("aria-haspopup", "dialog");
      const img = element("img");
      img.src = imageRoot + shot.image;
      img.alt = shot.caption;
      img.width = 960;
      img.height = 540;
      img.loading = "lazy";
      img.decoding = "async";
      button.append(img);
      button.addEventListener("click", () => openViewer(index));
      figure.append(button, element("figcaption", "", shot.caption));
      gallery.append(figure);
    });
    gallerySection.append(gallery);
  }

  const downloads = section("获取地图", "downloads");
  if (project.mapVersion) downloads.append(element("p", "project-feedback", `地图版本 ${project.mapVersion} · 推荐使用 Minecraft ${project.recommendedVersion}`));
  const downloadList = element("div", "minecraft-downloads");
  for (const download of project.downloads) {
    const row = element("div", "minecraft-download");
    const info = element("div", "minecraft-download-info");
    info.append(element("strong", "", download.label));
    info.append(link(download.url, download.url, "minecraft-download-url"));
    const controls = element("div", "minecraft-download-actions");
    if (download.code) {
      const code = element("span", "minecraft-code", `提取码：${download.code}`);
      const copy = element("button", "", "复制");
      copy.type = "button";
      copy.setAttribute("aria-label", `复制${download.label}提取码 ${download.code}`);
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(download.code);
          copyStatus.textContent = `${download.label}提取码 ${download.code} 已复制`;
          copy.textContent = "已复制";
        } catch {
          copyStatus.textContent = `未能自动复制，请手动复制提取码：${download.code}`;
        }
      });
      code.append(copy);
      controls.append(code);
    }
    controls.append(link("前往下载", download.url, "project-button"));
    row.append(info, controls);
    downloadList.append(row);
  }
  if (!project.downloads.length) {
    const row = element("div", "minecraft-download");
    const info = element("div", "minecraft-download-info");
    info.append(element("strong", "", "爱发电发布页"));
    info.append(element("p", "minecraft-download-url", "请在原发布页查看网盘下载地址；爱发电可能要求登录。"));
    row.append(info, link("前往获取", source, "project-button"));
    downloadList.append(row);
  }
  downloads.append(downloadList);
  const copyStatus = element("p", "project-feedback");
  copyStatus.setAttribute("role", "status");
  downloads.append(copyStatus);
  const install = element("ol", "minecraft-install");
  for (const step of [
    "下载并解压地图文件，将含有 level.dat 的存档文件夹放入对应游戏实例的 saves 目录。",
    "使用上方推荐的游戏版本打开存档；若下载文件包含资源包，请同时加载资源包。",
    "与朋友联机，在地图大厅阅读规则并完成队伍分配后开始游戏。"
  ]) install.append(element("li", "", step));
  downloads.append(install);
  const credit = element("p", "minecraft-credit", "地图由小菜粽子创作。介绍与版本信息整理自 ");
  credit.append(link("爱发电原发布页", source, "text-link"), document.createTextNode("。"));
  main.append(credit);

  let viewer;
  let currentShot = 0;
  let viewerImage;
  let viewerTitle;
  let viewerCount;
  let originalLink;

  function showShot(index) {
    currentShot = (index + screenshots.length) % screenshots.length;
    const shot = screenshots[currentShot];
    viewerImage.src = imageRoot + shot.image;
    viewerImage.alt = shot.caption;
    viewerTitle.textContent = shot.caption;
    viewerCount.textContent = `${currentShot + 1} / ${screenshots.length}`;
    originalLink.href = viewerImage.src;
  }

  function openViewer(index) {
    if (!viewer) {
      viewer = element("dialog", "minecraft-viewer");
      viewer.setAttribute("aria-labelledby", "viewer-title");
      const head = element("div", "minecraft-viewer-head");
      viewerTitle = element("h2");
      viewerTitle.id = "viewer-title";
      const close = element("button", "", "×");
      close.type = "button";
      close.setAttribute("aria-label", "关闭预览");
      close.addEventListener("click", () => viewer.close());
      head.append(viewerTitle, close);
      viewerImage = element("img");
      const footer = element("div", "minecraft-viewer-footer");
      viewerCount = element("span");
      viewerCount.setAttribute("aria-live", "polite");
      originalLink = link("打开原图", "", "text-link");
      const controls = element("div", "minecraft-viewer-controls");
      for (const [text, label, delta] of [["上一张", "上一张", -1], ["下一张", "下一张", 1]]) {
        const button = element("button", "", text);
        button.type = "button";
        button.setAttribute("aria-label", label);
        button.addEventListener("click", () => showShot(currentShot + delta));
        controls.append(button);
      }
      if (screenshots.length < 2) controls.hidden = true;
      footer.append(viewerCount, originalLink, controls);
      viewer.append(head, viewerImage, footer);
      viewer.addEventListener("click", (event) => {
        if (event.target !== viewer) return;
        const rect = viewer.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
      });
      viewer.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          showShot(currentShot + (event.key === "ArrowLeft" ? -1 : 1));
        }
      });
      document.body.append(viewer);
    }
    showShot(index);
    viewer.showModal();
  }
})();
