# XCzongzi.net

XCzongzi 的个人创作主页。纯 HTML、CSS、JavaScript 构建，不依赖构建工具，可直接部署到任意静态托管服务。
此项目由AI生成、维护。

## 目录结构

```text
.
├─ index.html                 # 页面结构
├─ portfolio/                 # 三个创作方向的作品集页
├─ assets/
│  ├─ css/site.css           # 全站视觉与响应式样式
│  ├─ images/                # Logo 与背景图
│  └─ js/
│     ├─ content.js          # 所有可更新内容
│     └─ site.js             # 内容渲染和交互
└─ README.md
```

## 日常更新

编辑 `assets/js/content.js` 即可维护以下内容：

- `directions`：三个长期创作方向；
- `current`：当前热点项目，可随时替换；对应视觉会自动读取项目名称与标签；
- `channels`：个人频道名称、简介和链接。
- `portfolios`：三个作品集的标题、简介、标签和项目列表。

新增卡片时复制对应对象并修改字段，不需要调整 HTML。视觉样式统一维护在 `assets/css/site.css`。

为某个作品集添加项目时，在对应的 `projects: []` 中加入：

```js
{ title: "项目名称", description: "一句简介", url: "https://项目链接" }
```

## 本地预览

直接用浏览器打开 `index.html`，或使用任意静态文件服务器启动当前目录。
