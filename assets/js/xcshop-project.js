(() => {
  "use strict";
  const BASE = "https://xczongzi.net/projects/xcshop";
  const REPO = "https://github.com/XCzongzi/xcshop";
  const API = "https://api.github.com/repos/XCzongzi/xcshop/releases";
  const CACHE_TTL = 10 * 60 * 1000;
  const CACHE_PREFIX = "xcshop-releases:v1:";
  const cache = new Map();
  const requests = new Map();
  const main = document.querySelector("[data-project-main]");
  if (!main) return;

  const mode = document.body.dataset.projectPage;
  let requestedTag = document.body.dataset.releaseTag || null;
  if (mode === "route") {
    const match = location.pathname.match(/^\/projects\/xcshop\/([^/]+)\/?$/);
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
  let page = 1;
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

  function readCache(key) {
    try {
      const entry = JSON.parse(localStorage.getItem(key));
      if (entry && Number.isFinite(entry.requestedAt)) return entry;
    } catch { /* Storage may be unavailable. Keep caching in this page. */ }
    return cache.get(key);
  }

  function writeCache(key, entry) {
    cache.set(key, entry);
    try { localStorage.setItem(key, JSON.stringify(entry)); } catch { /* Use the in-memory cache. */ }
  }

  async function cachedRequest(url) {
    const key = CACHE_PREFIX + url;
    const previous = readCache(key);
    if (previous && Date.now() - previous.requestedAt < CACHE_TTL) {
      if (previous.result) return previous.result;
      const error = new Error("Release query is cooling down");
      error.status = previous.status;
      error.cooldown = true;
      throw error;
    }
    // Record the attempt before fetching: failures and reloads cannot bypass the interval.
    const entry = { requestedAt: Date.now(), result: previous?.result || null };
    writeCache(key, entry);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store", credentials: "omit", signal: controller.signal });
      if (!response.ok && response.status !== 404) {
        const error = new Error("Release request failed");
        error.status = response.status;
        throw error;
      }
      const result = { value: response.status === 404 ? null : await response.json(), hasMore: /rel="next"/.test(response.headers.get("Link") || ""), status: response.status };
      writeCache(key, { ...entry, result });
      return result;
    } catch (error) {
      writeCache(key, { ...entry, status: error.status });
      if (entry.result) return entry.result;
      error.cooldown = true;
      throw error;
    } finally { clearTimeout(timer); }
  }

  async function request(url, allowMissing = false) {
    if (!requests.has(url)) {
      // Web Locks serialize the same query across tabs before checking localStorage.
      const pending = navigator.locks
        ? navigator.locks.request(CACHE_PREFIX + url, () => cachedRequest(url))
        : cachedRequest(url);
      requests.set(url, pending);
      pending.finally(() => requests.delete(url)).catch(() => {});
    }
    const result = await requests.get(url);
    if (result.status === 404 && !allowMissing) {
      const error = new Error("Release request failed");
      error.status = 404;
      throw error;
    }
    return result;
  }

  async function releaseList(number = 1) {
    const result = await request(`${API}?per_page=30&page=${number}`);
    if (!Array.isArray(result.value)) throw new Error("Invalid release list");
    return { items: sortReleases(result.value), hasMore: result.hasMore };
  }

  async function latestRelease() {
    const result = await request(`${API}/latest`, true);
    if (isRelease(result.value)) return result.value;
    const list = await releaseList();
    return list.items[0] || null;
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
      summary.append(heading, time);
      const download = node("a", "release-download", "下载");
      download.href = versionURL(release.tag_name);
      download.setAttribute("aria-label", `下载 xcshop ${release.tag_name}`);
      row.append(summary, download);
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
    files.replaceChildren(link);
  }

  async function load() {
    if (pending) return;
    pending = true;
    main.setAttribute("aria-busy", "true");
    retry.hidden = true;
    feedback.textContent = "正在获取版本信息…";
    try {
      if (overview) {
        const [list, newest] = await Promise.all([releaseList(), request(`${API}/latest`, true)]);
        latest = isRelease(newest.value) ? newest.value : list.items[0] || null;
        updateFacts(latest);
        const latestLink = document.querySelector("[data-latest-download]");
        latestLink.hidden = !latest;
        shown.clear();
        page = 1;
        document.querySelector("[data-release-list]").replaceChildren();
        appendReleases(list.items);
        more.hidden = !list.hasMore;
        feedback.textContent = list.items.length ? "" : "尚未发布版本。";
      } else {
        const result = requestedTag ? await request(`${API}/tags/${encodeURIComponent(requestedTag)}`, true) : { value: await latestRelease() };
        const release = isRelease(result.value) ? result.value : null;
        updateFacts(release);
        const title = requestedTag ? `下载 xcshop ${requestedTag}` : "下载 xcshop";
        document.querySelector("[data-download-title]").textContent = title;
        document.title = `${title} · XCzongzi`;
        document.querySelector("[data-download-files]").replaceChildren();
        document.querySelector("[data-release-source]").hidden = true;
        if (release) renderDownloads(release);
        feedback.textContent = release ? "" : requestedTag ? `未找到版本 ${requestedTag}。` : "尚未发布版本。";
      }
    } catch (error) {
      document.querySelector("[data-version]").textContent = "暂不可用";
      document.querySelector("[data-date]").textContent = "—";
      feedback.textContent = error.cooldown ? "暂时无法获取版本信息，请在本次查询满 10 分钟后重试。" : error.status === 403 || error.status === 429 ? "版本查询暂时过于频繁，请稍后重试，或前往 GitHub。" : "暂时无法获取版本信息，请重试或前往 GitHub。";
      retry.hidden = false;
    } finally {
      pending = false;
      main.setAttribute("aria-busy", "false");
    }
  }

  retry.addEventListener("click", load);
  more?.addEventListener("click", async () => {
    if (pending) return;
    pending = true;
    more.disabled = true;
    more.textContent = "正在加载…";
    try {
      const result = await releaseList(page + 1);
      appendReleases(result.items);
      page += 1;
      more.hidden = !result.hasMore;
      feedback.textContent = "";
    } catch {
      feedback.textContent = "暂时无法加载更多版本，请稍后再试。";
    } finally {
      pending = false;
      more.disabled = false;
      more.textContent = "加载更多版本";
    }
  });
  load();
})();
