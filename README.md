# XCzongzi.net

参考 xcshop 关于页的个人网站，使用纯 HTML、CSS、JavaScript，无构建步骤或外部字体依赖。

主页仅包含最近的作品、创作方向、联系入口和赞助。左上角身份始终悬浮且背景透明；左侧为纵向滚动的文本导航，平时显示简称，悬浮、键盘聚焦或位于当前区块时显示全称，并以下划线标记，当前区块额外高亮。浅色／深色模式沿用 xcshop 的羊皮纸／琥珀配色，首次访问跟随系统，手动选择会在页面间共用并保存在浏览器中。

外观切换使用独立的图标按钮。首屏提示、首次向下滚轮的 520ms 展开和封面保留比例沿用 xcshop；封面收缩时始终保留图片中心，返回顶部后可再次触发。系统减少动态效果时直接展开。

## 文件

- `index.html`：主页内容与链接。
- `assets/css/site.css`：布局、两种配色和响应式样式。
- `assets/js/site.js`：封面滚动、返回封面和左侧导航定位。
- `assets/js/theme.js`：显示模式与偏好保存。
- `assets/js/content.js`：三个创作方向的作品列表。
- `assets/js/portfolio-page.js`：作品列表渲染。
- `assets/images/brands/`：xcshop 关于页所用的品牌图标及原始来源说明。
- `portfolio/`：创作方向的作品页面。
- `projects/xcshop/`：xcshop 项目详情与下载页面。
- `assets/js/xcshop-project.js`：读取本站版本 JSON，展示版本列表、发布详情和下载入口。
- `404.html`：GitHub Pages 的未命中路径处理，以及新版本下载页的动态入口。

## 更新作品

主页在 `index.html` 中维护。作品集在 `assets/js/content.js` 的对应 `projects` 数组中添加：

```js
{ title: "作品名称", url: "https://项目链接" }
```

## 预览

直接打开 `index.html`，或从此目录启动任意静态 HTTP 服务器。

项目页面使用站点绝对路径，请通过 HTTP 服务器预览。

## xcshop 版本页面

- `/projects/xcshop/`：项目简介、最新版本、发布时间和版本列表。
- `/projects/xcshop/releases`：最新版安装包下载地址。
- `/projects/xcshop/releases/v0.0.1`：指定版本安装包下载地址。

页面读取 `https://xczongzi.net/projects/xcshop/downloads/versions.json` 的文本并解析 JSON（schema_version 为 1，repository 为 XCzongzi/xcshop，releases 为数组），不再查询 GitHub API。已移除十分钟本地缓存和请求冷却。同一页面只获取一次完整数据，并合并进行中的请求；展开详情、加载更多均不追加网络请求，不轮询，也不自动重试。刷新和重新访问遵循服务器的标准 HTTP 缓存头（当前为 max-age=300，带 ETag），不再由前端设置固定等待时间；失败可手动立即重试。

版本按发布时间倒序排列，优先将最近发布的正式版作为最新版；没有正式版时使用最近的预发布版本。日期按北京时间显示，每批展示 30 项，更多版本从已加载的数据中展示。每个版本列出发布名称，并可展开查看发布说明、附件名称、大小、类型和摘要校验值；缺失信息显示相应空状态。说明按纯文本展示，不执行其中的 HTML。

尚未发布、版本不存在和请求失败时显示对应状态；失败可重试。所有安装包下载均使用现有的本站下载地址：`https://xczongzi.net/projects/xcshop/releases` 下载最新版，`https://xczongzi.net/projects/xcshop/releases/<版本标签>` 下载指定版本。项目主页的版本列表直接链接安装包，无需进入历史版本页面。下载链接不添加尾部斜杠，也不使用 JSON 中的 GitHub 附件地址。

安装包和版本 JSON 由域名上已有的服务提供；此静态仓库只提供项目页面及下载入口，不额外部署代理。原有下载 HTML 和 `404.html` 作为静态回退页面，也从同一份 JSON 读取详情并链接本站下载地址。更新 JSON 即可同步版本列表，无需逐个添加静态页面。

## 发布到 GitHub Pages

修改样式、脚本或图片后，在站点根目录执行，再一并提交 HTML 和资源文件：

```sh
node scripts/version-assets.mjs
```

该命令为主页、作品集、项目页面和 404 页面引用的本地资源添加内容哈希版本号，避免 GitHub Pages 或 CDN 的旧缓存与新版 HTML 混用。内容不变时版本号保持不变；不会处理 `CraftBFF/`。

`CraftBFF/` 为独立站点。
