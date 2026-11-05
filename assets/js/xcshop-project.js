(() => {
  "use strict";
  const BASE = "https://xczongzi.net/projects/xcshop";
  const REPO = "https://github.com/XCzongzi/xcshop";
  const VERSIONS_URL = BASE + "/downloads/versions.json";
  const PAGE_SIZE = 30;
  let manifestRequest = null;
  const main = document.querySelector("[data-project-main]");
  if (!main) return;

  const mode = document.body.dataset.projectPage;
  let requestedTag = document.body.dataset.releaseTag || null;
  if (mode === "route") {
    const match = location.pathname.match(/^\/projects\/xcshop\/(?:releases\/)?([^/]+)\/?$/);
    try { requestedTag = match ? decodeURIComponent(match[1]) : null; } catch { requestedTag = null; }
    if (!requestedTag || requestedTag === "." || requestedTag === ".." || requestedTag === "index.html") {
      document.title = "页面不存在 · XCzongzi";
      main.querySelector("h1").textContent = "页面不存在";
      main.querySelector("[data-feedback]").textContent = "请检查链接，或返回首页。";
      main.querySelectorAll(".project-facts, [data-download-section], .project-actions").forEach((element) => { element.hidden = true; });
      const back = main.querySelector(".project-back");
      back.href = "/";
      back.textContent = "← 返回首页";
      main.setAttribute("aria-busy", "false");
      return;
    }
    if (requestedTag === "releases") requestedTag = null;
  }

  const overview = mode === "overview";
  const feedback = document.querySelector("[data-feedback]");
  const retry = document.querySelector("[data-retry]");
  const more = document.querySelector("[data-more]");
  const dateFormat = new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" });
  let latest = null;
  let visibleCount = 0;
  let releases = [];
  let pending = false;
  const shown = new Set();

  const versionURL = (tag) => `${BASE}/releases/${encodeURIComponent(tag)}`;
  const githubReleaseURL = (tag) => `${REPO}/releases/tag/${encodeURIComponent(tag)}`;
  const dateValue = (value) => Number.isFinite(Date.parse(value)) ? dateFormat.format(new Date(value)) : "—";
  const isRelease = (value) => value && typeof value.tag_name === "string" && value.tag_name.length > 0 && value.draft !== true;
  const sortReleases = (items) => items.filter(isRelease).sort((a, b) => (Date.parse(b.published_at) || 0) - (Date.parse(a.published_at) || 0));

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function fetchManifest() {
    if (manifestRequest) return manifestRequest;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    // One document request per page; let HTTP Cache-Control/ETag govern reloads.
    manifestRequest = (async () => {
      try {
        const response = await fetch(VERSIONS_URL, { cache: "default", credentials: "omit", signal: controller.signal });
        if (!response.ok) throw new Error("Version manifest request failed");
        const data = JSON.parse((await response.text()).replace(/^\uFEFF/, ""));
        if (!data || data.schema_version !== 1 || data.repository !== "XCzongzi/xcshop" || !Array.isArray(data.releases)) {
          throw new Error("Invalid version manifest");
        }
        return sortReleases(data.releases);
      } finally { clearTimeout(timer); }
    })().catch(error => { manifestRequest = null; throw error; });
    return manifestRequest;
  }

  function fileSize(value) {
    if (!Number.isFinite(value) || value < 0) return "";
    const units = ["B", "KB", "MB", "GB"];
    let size = value, unit = 0;
    while (size >= 1024 && unit < units.length - 1) { size /= 1024; unit += 1; }
    return (unit ? size.toFixed(1) : size) + " " + units[unit];
  }

  function releaseDetails(release) {
    const details = node("details", "release-details");
    details.append(node("summary", "release-details-toggle", "发布详情"));
    const content = node("div", "release-details-content");
    content.append(node("p", "release-notes", typeof release.body === "string" && release.body.trim() ? release.body.trim() : "暂无发布说明。"));
    const assets = Array.isArray(release.assets) ? release.assets.filter(asset => asset && typeof asset.name === "string") : [];
    if (assets.length) {
      const list = node("ul", "release-assets");
      for (const asset of assets) {
        const item = node("li", "release-asset");
        item.append(node("p", "release-asset-name", asset.name));
        const metadata = [fileSize(asset.size), typeof asset.content_type === "string" ? asset.content_type : ""].filter(Boolean);
        if (metadata.length) item.append(node("p", "release-asset-meta", metadata.join(" · ")));
        if (typeof asset.digest === "string" && asset.digest) item.append(node("code", "release-digest", asset.digest));
        list.append(item);
      }
      content.append(list);
    } else content.append(node("p", "release-asset-meta", "暂无附件信息。"));
    const source = node("a", "project-source", "在 GitHub 查看发布说明");
    source.href = githubReleaseURL(release.tag_name);
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    content.append(source);
    details.append(content);
    return details;
  }

  function updateFacts(release) {
    document.querySelector("[data-version]").textContent = release ? release.tag_name : "尚未发布";
    const time = document.querySelector("[data-date]");
    time.textContent = release ? dateValue(release.published_at) : "—";
    if (release?.published_at && Number.isFinite(Date.parse(release.published_at))) time.dateTime = release.published_at;
    else time.removeAttribute("datetime");
  }

  function appendReleases(items) {
    const list = document.querySelector("[data-release-list]");
    for (const release of items) {
      if (shown.has(release.tag_name)) continue;
      shown.add(release.tag_name);
      const row = node("article", "release-row");
      const summary = node("div", "release-summary");
      const heading = node("div", "release-heading");
      const title = node("a", "release-title", release.tag_name);
      title.href = versionURL(release.tag_name);
      heading.append(title);
      if (release.tag_name === latest?.tag_name) heading.append(node("span", "release-badge release-badge--latest", "最新版"));
      if (release.prerelease) heading.append(node("span", "release-badge", "预发布"));
      const time = node("time", "release-date", dateValue(release.published_at));
      if (release.published_at && Number.isFinite(Date.parse(release.published_at))) time.dateTime = release.published_at;
      summary.append(heading);
      if (typeof release.name === "string" && release.name.trim() && release.name.trim() !== release.tag_name) summary.append(node("p", "release-name", release.name.trim()));
      summary.append(time);
      const download = node("a", "release-download", "下载");
      download.href = versionURL(release.tag_name);
      download.setAttribute("aria-label", `下载 xcshop ${release.tag_name}`);
      row.append(summary, download, releaseDetails(release));
      list.append(row);
    }
  }

  function renderDownloads(release) {
    const files = document.querySelector("[data-download-files]");
    const source = document.querySelector("[data-release-source]");
    source.href = githubReleaseURL(release.tag_name);
    source.hidden = false;
    const badge = document.querySelector("[data-prerelease]");
    if (badge) badge.hidden = !release.prerelease;
    const link = node("a", "download-file", requestedTag ? "下载 xcshop " + release.tag_name : "下载最新版");
    link.href = requestedTag ? versionURL(release.tag_name) : BASE + "/releases";
    const details = releaseDetails(release);
    details.open = true;
    files.replaceChildren(link);
    if (typeof release.name === "string" && release.name.trim() && release.name.trim() !== release.tag_name) files.append(node("p", "release-name", release.name.trim()));
    files.append(details);
  }

  async function load() {
    if (pending) return;
    pending = true;
    main.setAttribute("aria-busy", "true");
    retry.hidden = true;
    feedback.textContent = "正在获取版本信息…";
    try {
      releases = await fetchManifest();
      latest = releases.find(release => !release.prerelease) || releases[0] || null;
      if (overview) {
        updateFacts(latest);
        const latestLink = document.querySelector("[data-latest-download]");
        latestLink.hidden = !latest;
        shown.clear();
        visibleCount = PAGE_SIZE;
        document.querySelector("[data-release-list]").replaceChildren();
        appendReleases(releases.slice(0, visibleCount));
        more.hidden = visibleCount >= releases.length;
        feedback.textContent = releases.length ? "" : "尚未发布版本。";
      } else {
        const release = requestedTag ? releases.find(item => item.tag_name === requestedTag) || null : latest;
        updateFacts(release);
        const title = requestedTag ? `下载 xcshop ${requestedTag}` : "下载 xcshop";
        document.querySelector("[data-download-title]").textContent = title;
        document.title = `${title} · XCzongzi`;
        document.querySelector("[data-download-files]").replaceChildren();
        document.querySelector("[data-release-source]").hidden = true;
        if (release) renderDownloads(release);
        feedback.textContent = release ? "" : requestedTag ? `未找到版本 ${requestedTag}。` : "尚未发布版本。";
      }
    } catch {
      document.querySelector("[data-version]").textContent = "暂不可用";
      document.querySelector("[data-date]").textContent = "—";
      feedback.textContent = "暂时无法获取版本信息，请重试。";
      retry.hidden = false;
    } finally {
      pending = false;
      main.setAttribute("aria-busy", "false");
    }
  }

  retry.addEventListener("click", load);
  more?.addEventListener("click", () => {
    appendReleases(releases.slice(visibleCount, visibleCount + PAGE_SIZE));
    visibleCount += PAGE_SIZE;
    more.hidden = visibleCount >= releases.length;
  });
  load();
})();
