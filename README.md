# CINÉ · 电影宇宙

> **Discover your next favorite film.**
> 一个苹果官网质感 + 电影杂志排版的电影发现与收藏平台。不做播放，只做挑选与记录。

![tech](https://img.shields.io/badge/React-18.3-0b0b0c) ![tech](https://img.shields.io/badge/Vite-5.4-0b0b0c) ![tech](https://img.shields.io/badge/Router-6.30-0b0b0c)

---

## 1. 技术栈

| 部分 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | React 18.3 | 函数组件 + Hooks，无额外状态库 |
| 构建 | Vite 5.4 | 秒级启动，生产构建 229 KB / gzip 82 KB |
| 路由 | react-router-dom 6.30 | 5 个页面 + 404，SPA 路由 |
| 样式 | 原生 CSS（设计变量） | 5 个样式文件，`[data-theme]` 驱动深色模式，无 UI 框架 |
| 数据 | 本地 JSON 资料库 + 可选 TMDB | 65 部真实电影，海报/剧照本地化存储 |
| 状态持久化 | localStorage | 收藏、想看、已看、评分、主题 |

没有引入 Tailwind、Redux、CSS-in-JS 或任何重组件库：**依赖只有 3 个**，便于长期维护。

---

## 2. 目录结构

```
cine/
├─ index.html
├─ vite.config.js
├─ .env.example                # TMDB Key 模板（可留空）
├─ public/
│  ├─ favicon.svg
│  └─ media/                   # 65 张海报 + 65 张剧照（约 14 MB）
│     ├─ posters/<id>.jpg      # 500×750
│     └─ backdrops/<id>.jpg    # 1200×675
├─ scripts/
│  ├─ fetch-media.mjs          # 一次性素材抓取脚本（含来源记录）
│  └─ manifest.json            # 每张图对应的影片名与年份
└─ src/
   ├─ main.jsx                 # Provider 组装
   ├─ App.jsx                  # 路由表 + 页面过渡
   ├─ context/
   │  ├─ ThemeProvider.jsx     # 深浅色 + 持久化
   │  ├─ LibraryProvider.jsx   # 片单状态机（收藏/想看/已看/评分）
   │  ├─ MoviesProvider.jsx    # 本地库 + TMDB 增量合并
   │  └─ ToastProvider.jsx     # 轻量提示
   ├─ data/
   │  ├─ movies.js             # 65 部电影资料
   │  ├─ topics.js             # 6 个精选专题
   │  └─ constants.js          # 类型/排序/年代/导航配置
   ├─ lib/
   │  ├─ movies.js             # 筛选、排序、相似推荐、年份聚合
   │  ├─ tmdb.js               # 可选远程数据源
   │  ├─ storage.js            # localStorage 安全封装
   │  └─ format.js             # 分数/时长/日期格式化
   ├─ components/              # 15 个展示与交互组件
   └─ pages/                   # Home / Discover / Detail / Ranking / MyList / 404
```

---

## 3. 启动方式

```bash
# 安装依赖（Node ≥ 18）
npm install

# 开发模式（默认 http://localhost:5173）
npm run dev

# 生产构建 / 预览
npm run build
npm run preview
```

---

## 4. 配置电影 API（可选）

网站**没有 API Key 也能完整运行**，默认读取 `src/data/movies.js` 的本地资料库。

接入 TMDB 作为补充数据：

```bash
# 1. 复制模板
cp .env.example .env

# 2. 填入申请到的 Key（https://www.themoviedb.org/settings/api）
VITE_TMDB_API_KEY=你的key

# 3. 重启 dev server
npm run dev
```

- 启用后，应用启动会异步拉取 TMDB 热门影片（2 页，`language=zh-CN`），与本地库去重合并，追加到「发现电影」等列表。
- 请求失败、超时（8s）或未配置 Key 时，自动回落到本地资料库，页面不会报错或空白。
- 远端影片的导演/演员显示为「资料待补充」，因为列表接口不返回 credits。
- 使用 TMDB 数据时，页脚会自动显示其要求的来源声明。
- **密钥不写入源码**：只从 `import.meta.env` 读取，`.env` 已在 `.gitignore` 中。

---

## 5. 已实现功能

**首页**：主视觉轮播（5 部精选，7s 自动切换 + hover 暂停 + 按钮/指示点手动切换 + 图片交叉淡入、缓慢推近）· 编辑精选文案区 · 正在热门横滑（按钮翻页/触摸滑动）· 高分电影网格 · 6 个精选专题 · 年度精选（按年份切换）· 页脚。

**发现电影**：关键词实时搜索（片名/原名/导演/演员/年份）· 10 种类型标签 · 年代、评分、4 种排序，可任意组合 · 结果计数 · 每页 12 部 + 加载更多 · 条件写入 URL（可分享/刷新保持）· 骨架屏过渡 · 空结果引导。

**电影详情**：全幅剧照 + 海报叠压的杂志式排版 · 中英文片名 · 片长/类型/上映日期/国家 · 导演/主演 · 剧情简介 · CINÉ 评分卡 · 收藏/想看/已看三个状态 · 1—10 分评分器（可取消）· 相似电影推荐。

**排行榜**：全球热门 / 高分电影 / 年度电影 / 类型排行榜（10 种类型切换）· 名次、海报、片名、年份、评分与刻度条。

**我的片单**：收藏 / 想看 / 已看 / 我的评分四个分区 · 数量统计（可点击切换）· 单项移除 · 评分清除 · 空状态引导。

**全局**：固定毛玻璃导航（滚动加深）· 移动端折叠菜单 · 搜索浮层（即时结果 + 回车跳转 + Esc 关闭）· 深浅色切换 · 全局 Toast · 路由切换过渡与滚动复位 · 图片骨架屏与统一兜底图 · 键盘可达（focus-visible 环）· `prefers-reduced-motion` 适配。

**数据持久化**：`cine.library.v1`（收藏/想看/已看/评分）、`cine.theme.v1`（主题），刷新后全部保留。

---

## 6. 测试结果

用 Playwright 驱动本机 Chrome 跑了 50 项检查，全部通过：

- 轮播自动/手动切换、指示点数量；
- 搜索浮层实时结果、回车跳转；
- 关键词 / 类型 / 年代 / 评分筛选、四种排序、重置、加载更多；
- 收藏、想看、已看、评分写入与刷新后保留；
- 我的片单统计、切换分区、移除；
- 主题切换与刷新保留；
- 排行榜切换、类型榜筛选；
- 1440 / 1024 / 768 / 390 四个宽度 × 5 个页面，**横向溢出均为 0px**；
- 控制台错误 0 条，图片加载失败 0 张；
- 断网模拟下海报/剧照兜底图正常显示。

---

## 7. 已知限制

1. **图片为本地素材**：来自公开电影页面的海报/剧照，仅用于学习与作品展示，版权归各电影公司所有，不可商用。重新抓取可运行 `node scripts/fetch-media.mjs`（会跳过已存在的文件）。
2. **评分为 CINÉ 编辑评分**，用于排版演示，不代表豆瓣/IMDb/TMDB 的任何官方分数。
3. **TMDB 补充影片信息不完整**（无导演、演员），因为一次请求无法拿到 credits；如需完整信息需逐部请求详情接口，会显著增加请求量。
4. **个人数据只存在当前浏览器**，换设备/清缓存会丢失，没有账号体系。
5. 电影数量 65 部，是人工挑选的片单而非全量数据库；新增影片需在 `src/data/movies.js` 追加并放置同名图片。
6. 页面无 SSR，社交平台分享时只能拿到 `index.html` 的通用标题与描述。

---

## 8. 数据与版权说明

- 影片资料（片名、年份、片长、导演、演员等）按公开信息整理；剧情简介为本站原创中文撰写。
- 海报与剧照版权归各电影公司所有；本项目为非商业的前端作品练习。
- 如启用 TMDB：*This product uses the TMDB API but is not endorsed or certified by TMDB.*
