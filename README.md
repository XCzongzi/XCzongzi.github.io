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

## 更新作品

主页在 `index.html` 中维护。作品集在 `assets/js/content.js` 的对应 `projects` 数组中添加：

```js
{ title: "作品名称", url: "https://项目链接" }
```

## 预览

直接打开 `index.html`，或从此目录启动任意静态 HTTP 服务器。

## 发布到 GitHub Pages

修改样式、脚本或图片后，在站点根目录执行，再一并提交 HTML 和资源文件：

```sh
node scripts/version-assets.mjs
```

该命令为主页和作品集引用的本地资源添加内容哈希版本号，避免 GitHub Pages 或 CDN 的旧缓存与新版 HTML 混用。内容不变时版本号保持不变；不会处理 `CraftBFF/`。

`CraftBFF/` 为独立站点。
