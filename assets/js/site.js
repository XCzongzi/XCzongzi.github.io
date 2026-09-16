(() => {
  "use strict";

  const content = window.XCZONGZI_CONTENT;
  if (!content) return;

  const escapeHTML = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const directionIcons = {
    minecraft: '<span class="block block-a"></span><span class="block block-b"></span><span class="block block-c"></span>',
    software: '<code>&lt;/&gt;</code><span class="code-line">love.build();_</span>',
    "indie-game": '<span class="planet"></span><span class="orbit"></span><small>NEXT WORLD</small>'
  };

  const directionsRoot = document.querySelector("[data-directions]");
  directionsRoot.innerHTML = content.directions.map((item) => `
    <a class="direction-card direction-card--${escapeHTML(item.id)}" href="${escapeHTML(item.url)}">
      <div class="card-art">${directionIcons[item.id] || ""}</div>
      <div class="card-meta"><span>${escapeHTML(item.number)}</span><span>${escapeHTML(item.tags.join(" · "))}</span></div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.description)}</p>
      <span class="card-link">查看作品集 <b>→</b></span>
    </a>
  `).join("");

  const current = content.current;
  document.querySelector("[data-now-content]").innerHTML = `
    <h3>${escapeHTML(current.title)}</h3>
    <p>${escapeHTML(current.description)}</p>
    <div class="tags">${current.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
  `;

  document.querySelector("[data-now-visual]").innerHTML = `
    <div class="pixel-orbit"></div>
    <div class="current-poster">
      <span>NOW BUILDING</span>
      <strong>${escapeHTML(current.title)}</strong>
      <small>${escapeHTML(current.tags[0] || "PROJECT")} · WORK IN PROGRESS</small>
    </div>
    <b class="poster-mark">XC</b>
  `;

  document.querySelector("[data-journal]").innerHTML = content.journal.map((entry) => `
    <article class="journal-entry">
      <time>${escapeHTML(entry.status)}</time>
      <h3>${escapeHTML(entry.title)}</h3>
      <span aria-hidden="true">↗</span>
    </article>
  `).join("");

  const channelsRoot = document.querySelector("[data-channels]");
  channelsRoot.innerHTML = content.channels.map((channel, index) => `
    <a class="channel" href="${escapeHTML(channel.url)}" target="_blank" rel="noreferrer">
      <span class="channel-number">0${index + 1}</span>
      <div><h3>${escapeHTML(channel.name)}</h3><p>${escapeHTML(channel.description)}</p></div>
      <span class="channel-handle">${escapeHTML(channel.handle)}</span>
      <span class="channel-arrow" aria-hidden="true">↗</span>
    </a>
  `).join("");

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

  const heroMedia = document.querySelector(".hero-media");
  window.addEventListener("scroll", () => {
    heroMedia.style.transform = `scale(1.02) translateY(${Math.min(window.scrollY * 0.08, 52)}px)`;
  }, { passive: true });
})();
