/* 创作方向的作品列表。 */
window.XCZONGZI_CONTENT = {
  portfolios: {
    minecraft: {
      title: "Minecraft 内容",
      projects: [
        {
          id: "escape-chicken-remastered",
          title: "逃离鸡舍 重制版",
          url: "../projects/minecraft/escape-chicken-remastered/",
          image: "escape-chicken-remastered.webp",
          imageAlt: "逃离鸡舍 重制版的林间场景",
          genre: "非对称竞技",
          players: "多人联机",
          gameVersion: "1.19.x",
          recommendedVersion: "1.19.4",
          released: "2023-08-31",
          summary: "小鸡破门逃生，牧民守住鸡舍。在经典、遗迹与混沌空岛三张地图中，展开一场道具与策略的对抗。",
          source: "a24e1e244f2911ee86f652540025c377",
          introduction: [
            "游戏分为小鸡与牧民两个队伍。小鸡需要获取经验，在商店购买镐子、破坏大门并逃离鸡舍，同时抵抗牧民的攻击；牧民则要守住大门，阻止小鸡逃脱，坚持到倒计时结束即可获胜。",
            "重制版内置经典、遗迹、混沌空岛三张不同规模的地图，新增多种道具，提供三种商店、经验池升级面板与大门控制台。大厅还支持禁用道具及调整游戏选项。"
          ],
          notes: ["通常建议小鸡人数多于牧民。开启大厅中的平衡模式后，两队装备一致，可以平均分队。", "本作与初版为独立地图，请使用对应的推荐游戏版本。"],
          gallery: [
            { image: "remastered-classic.webp", caption: "经典 · 从初代场景改造而来" },
            { image: "remastered-ruins.webp", caption: "遗迹 · 探索地表与深处的场景" },
            { image: "remastered-sky-island.webp", caption: "混沌空岛 · 更大的地图与活动空间" }
          ],
          downloads: [
            { label: "蓝奏云", url: "https://xczongzi.lanzouq.com/iZu57171djif" },
            { label: "百度网盘", url: "https://pan.baidu.com/s/1n7NyPgbKTmlsKSDlDt6tKA?pwd=xczz", code: "xczz" }
          ]
        },
        {
          id: "mcgw",
          title: "MCGW",
          url: "../projects/minecraft/mcgw/",
          image: "mcgw.webp",
          imageAlt: "MCGW 地图标志",
          imageFit: "contain",
          genre: "枪战竞技",
          players: "2 人及以上",
          gameVersion: "1.17.x",
          recommendedVersion: "1.17.1",
          mapVersion: "0.1",
          released: "2022-01-17",
          summary: "Minecraft Gun War：以原版指令实现的红蓝队枪战，包含积分、升级与炸弹三种模式。",
          source: "a32b2034a2eb11ed87f652540025c377",
          introduction: [
            "MCGW 的全名为 Minecraft Gun War，是一款供两人及以上游玩的枪战类团队竞技地图。玩家分为红队与蓝队，使用游戏发放的枪支与敌方交战。",
            "游戏包含积分、升级、炸弹三种模式。积分模式下，队伍累计淘汰人数达到 20 即可获胜。地图由原版指令制作，无需额外模组或数据包，需要搭配随地图提供的资源包。",
            "内置地牢、空中小镇、太空三张场景，由小菜粽子与无影共同完成。"
          ],
          notes: ["下载文件包含存档与资源包，请正确加载资源包后游玩。", "这是早期版本作品，原发布帖提示部分场景可能存在卡顿或 BUG。"],
          gallery: [],
          downloads: [
            { label: "蓝奏云", url: "https://xczongzi.lanzoup.com/iOqICywwwyj" },
            { label: "百度网盘", url: "https://pan.baidu.com/s/1L3Tdpg7wTdWdjC3mxEgd-g?pwd=xczz", code: "xczz" }
          ]
        },
        {
          id: "minecraft-pubg",
          title: "Minecraft PUBG",
          url: "../projects/minecraft/minecraft-pubg/",
          image: "minecraft-pubg.webp",
          imageAlt: "Minecraft PUBG 地图封面",
          genre: "大逃杀",
          players: "2 人及以上",
          gameVersion: "1.16.x",
          recommendedVersion: "1.16.5",
          mapVersion: "1.0",
          released: "2021-07-28",
          summary: "选择落点、搜集物资，在不断缩小的地图边界中与其他玩家交战，努力成为最后的幸存者。",
          source: "8ca17c9ea2e811eda9d55254001e7c00",
          introduction: [
            "Minecraft PUBG 是一款供两人及以上游玩的多人大逃杀小游戏，主要进行个人对战，也可以与其他玩家合作。",
            "开局后选择地点降落，在地图各处的物资刷新点搜集装备，利用已有物资与其他玩家交战。地图边界会定时收缩，压缩玩家的活动范围；存活到最后的一名玩家获胜。"
          ],
          notes: ["建议使用 Minecraft 1.16.5，与朋友联机游玩。"],
          gallery: [{ image: "pubg-video.webp", caption: "地图预览 · 原作者介绍视频封面" }],
          video: "https://www.bilibili.com/video/BV1R64y1q7c2/",
          downloads: [
            { label: "百度网盘", url: "https://pan.baidu.com/s/1NliM0FrbccE-vMiMMSDChA", code: "xczz" }
          ]
        },
        {
          id: "escape-chicken",
          title: "逃离鸡舍",
          url: "../projects/minecraft/escape-chicken/",
          image: "escape-chicken.webp",
          imageAlt: "逃离鸡舍初版的俯瞰封面",
          genre: "非对称竞技",
          players: "2–5 人",
          gameVersion: "1.16.x",
          recommendedVersion: "1.16.5",
          mapVersion: "1.0",
          released: "2021-06-13",
          summary: "最初的鸡舍逃脱对抗：小鸡购买道具、破坏大门，牧民在时限内阻止逃生，适合与朋友一起游玩。",
          source: "ab88a792a2e611ed9b0052540025c377",
          introduction: [
            "逃离鸡舍是一款 2–5 人的多人竞技小游戏。游戏分为小鸡与牧民两支队伍，小鸡最多 4 人，牧民 1 人。",
            "小鸡需要购买道具，在规定时间内破坏大门并逃离鸡舍；牧民则要在时限内阻止小鸡逃脱。双方可通过购买不同道具展开对抗。"
          ],
          notes: ["本作已有《逃离鸡舍 重制版》，希望体验更多地图与道具时，可以选择重制版。"],
          related: "escape-chicken-remastered",
          gallery: [],
          downloads: [
            { label: "百度网盘", url: "https://pan.baidu.com/s/1AQzLHsxPBzk4nzDd-JdfSw", code: "xczz" }
          ]
        }
      ]
    },
    software: {
      title: "软件",
      projects: [{ title: "xcshop", url: "../projects/xcshop/" }]
    },
    "indie-game": { title: "独立游戏", projects: [] }
  }
};
