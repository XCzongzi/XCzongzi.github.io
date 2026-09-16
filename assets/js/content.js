/*
 * 站点内容配置
 * 以后新增/修改创作方向、近期项目或外部频道，只需要编辑这里。
 */
window.XCZONGZI_CONTENT = {
  directions: [
    {
      id: "minecraft",
      number: "01",
      title: "Minecraft 内容",
      description: "因热爱而建造。地图、数据包与游戏内体验。",
      tags: ["地图", "数据包", "创作"],
      url: "portfolio/minecraft.html"
    },
    {
      id: "software",
      number: "02",
      title: "软件",
      description: "因热爱而学习。把想法写成真正可用的工具。",
      tags: ["开发", "工具", "学习"],
      url: "portfolio/software.html"
    },
    {
      id: "indie-game",
      number: "03",
      title: "独立游戏",
      description: "因热爱而出发。为未来想做的世界慢慢积累。",
      tags: ["计划", "设计", "未来"],
      url: "portfolio/indie-game.html"
    }
  ],

  current: {
    title: "Minecraft UI 商店生成器",
    description: "为 Minecraft 创作者准备的可视化商店配置工具。",
    tags: ["Minecraft", "Tool", "In progress"]
  },

  journal: [
    { status: "COMING SOON", title: "从一个商店界面开始：生成器的第一版构想" },
    { status: "IN NOTES", title: "我想为 Minecraft 设计怎样的“探索感”" },
    { status: "LEARNING", title: "通往独立开发的语言学习路径" }
  ],

  portfolios: {
    minecraft: {
      title: "Minecraft 内容",
      eyebrow: "MINECRAFT / PORTFOLIO",
      statement: "因热爱而建造。",
      description: "地图、数据包与游戏内体验，会慢慢收集在这里。",
      tags: ["地图", "数据包", "创作"],
      projects: []
    },
    software: {
      title: "软件",
      eyebrow: "SOFTWARE / PORTFOLIO",
      statement: "因热爱而学习。",
      description: "工具、实验与正在学习的代码，会慢慢收集在这里。",
      tags: ["开发", "工具", "学习"],
      projects: []
    },
    "indie-game": {
      title: "独立游戏",
      eyebrow: "INDIE GAME / PORTFOLIO",
      statement: "因热爱而出发。",
      description: "这个世界还在加载中。",
      tags: ["计划", "设计", "未来"],
      projects: [],
      comingSoon: true
    }
  },

  channels: [
    {
      name: "哔哩哔哩",
      handle: "@XCzongzi",
      description: "视频与创作记录",
      url: "https://space.bilibili.com/481184316"
    },
    {
      name: "爱发电",
      handle: "@xczongzi",
      description: "支持我的创作",
      url: "https://afdian.com/a/xczongzi"
    },
    {
      name: "GitHub",
      handle: "@XCzongzi",
      description: "代码与开源项目",
      url: "https://github.com/XCzongzi"
    }
  ]
};
