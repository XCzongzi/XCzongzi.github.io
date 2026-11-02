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
- `assets/js/xcshop-project.js`：加载 GitHub Releases、版本列表和下载文件。
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
- `/projects/xcshop/releases/`：最新版的下载文件。
- `/projects/xcshop/v0.0.1/`：指定版本的下载文件。

页面每次加载时请求 `XCzongzi/xcshop` 的公开 GitHub Releases，不需要密钥。最新版本优先使用 GitHub 的 latest 标记；没有正式版本时展示最近发布的预发布版本。日期按北京时间显示，版本列表按发布时间倒序排列，每次加载 30 项，可继续加载。

尚未发布、版本不存在、没有下载附件和请求失败时分别显示对应状态；失败可重试，也可使用页面上的 GitHub 链接。下载文件直接使用 Release 附件的下载地址。

`v0.0.1` 提供静态目录入口。未来新版本的 `/projects/xcshop/<版本标签>` 由 GitHub Pages 的 `404.html` 读取标签并显示下载内容，不需要为每次发版重新部署网页。该回退页面的 HTTP 状态仍为 404；仅在 xcshop 版本路径上加载版本信息，其它不存在的路径显示普通未找到页面。本地服务器要预览未来版本路径，也需把未命中请求交给 `404.html`。

## 发布到 GitHub Pages

修改样式、脚本或图片后，在站点根目录执行，再一并提交 HTML 和资源文件：

```sh
node scripts/version-assets.mjs
```

该命令为主页、作品集、项目页面和 404 页面引用的本地资源添加内容哈希版本号，避免 GitHub Pages 或 CDN 的旧缓存与新版 HTML 混用。内容不变时版本号保持不变；不会处理 `CraftBFF/`。

`CraftBFF/` 为独立站点。
