# STORY.md — AI大赛参赛PPT叙事逻辑

## ① 用户意图对齐

- **目标受众**：AI大赛现场评委（技术专家 + 业务负责人），评审标准围绕AI Agent调度能力、交付价值、资产沉淀、自动化工程、现场演示五个维度。
- **核心目标**：让评委相信——本项目是AI Agent 7×24自主完成全流程开发的典型案例，产品+开发双端均实现显著提效，沉淀了可复用的AI Skill资产，项目可直接落地使用。
- **PPT长度**：16页（封面1 + 目录1 + 章节4 + 内容8 + 结束1 + 备用1）。
- **视觉调性**：科技未来感、数据驱动、AI赋能、专业可信、蓝紫渐变。
- **内容边界**：
  - **必讲**：产品侧AI提效（需求→原型→文档→手册）、开发侧AI提效（后端→前端→测试）、7×24 Agent自主作业、代码AI生成占比、可复用Skill资产、马来项目定制、一键交付。
  - **不讲**：技术栈底层细节、竞品对比、团队历史。
  - **禁碰**：敏感客户信息、未公开的内部数据。

## ② 构建页面布局骨架

### 页面总数与分章（16页）

| 章节 | 页数 | 页码 |
| :--- | :--- | :--- |
| 封面 | 1 | 01 |
| 目录/痛点导入 | 1 | 02 |
| 第一章：AI全流程赋能全景 | 2 | 03–04 |
| 第二章：产品侧AI提效 | 2 | 05–06 |
| 第三章：开发侧AI提效 | 3 | 07–09 |
| 第四章：评分维度对标展示 | 4 | 10–13 |
| 第五章：现场演示与总结 | 2 | 14–15 |
| 结束页 | 1 | 16 |

### Hero页定位（共5页，占比31%）

- **01 封面** — hero（默认）
- **03 AI提效全景图** — hero（视觉冲击：全流程大图）
- **07 开发侧提效** — hero（代码AI生成占比大数字）
- **10 AI Agent调度能力** — hero（7×24自主作业）
- **16 结束页** — hero（默认）

Hero页间隔校验：01→03（隔02✓）、03→07（隔04–06✓）、07→10（隔08–09✓）、10→16（隔11–15✓）。全部满足间隔≥1。

### Rhythm曲线

| 页 | 节奏 | 说明 |
| :- | :--- | :--- |
| 01 | peak | 封面，视觉冲击 |
| 02 | valley | 目录/痛点，信息铺垫 |
| 03 | peak | 全景图，高潮 |
| 04 | valley | 传统vs AI对比，蓄力 |
| 05 | transition | 章节过渡：产品侧 |
| 06 | valley | 产品提效细节 |
| 07 | peak | 开发提效，大数字冲击 |
| 08 | valley | 后端提效细节 |
| 09 | valley | 前端+测试提效 |
| 10 | peak | Agent调度能力，核心评分项 |
| 11 | valley | 作品完整度 |
| 12 | valley | 沉淀资产价值 |
| 13 | valley | 自动化工程 |
| 14 | transition | 演示环节预告 |
| 15 | peak | 核心数据总结 |
| 16 | peak | 结束页 |

### 非对称版式预算

- 非对称版式 ≥ 40% = 至少7页
- 对称版式最多2页

分配：
- 非对称（10页）：01(全幅骑线)、03(上大图+下方卡片)、04(非对称双栏)、06(左大图+右文字)、07(巨型数字+洞察)、08(左标题+右内容)、10(全幅图+骑线文字)、12(非对称双栏)、14(左大图+右文字)、15(巨型数字+洞察)
- 对称（2页）：02(N卡片横排/目录)、05(全屏视觉+大标题/章节过渡) — 已达上限
- 中间：09(上下分栏)、11(图表+洞察)、13(上下分栏)、16(居中金句/全屏)

### 对称版式预算（最多2页）

已分配：02（目录）、05（章节过渡）。其余14页均为非对称或其他版式。✓

## ③ 构建页面大纲

| # | 文件 | 类型 | role | rhythm | layout | visual | visual_role | density | anti_pattern |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 01 | slide_01_cover | cover | hero | peak | 全幅图+骑线文字 | L1: ai_hero_bg.png（全屏底图） | atmosphere | 字数约30 / 图片1 / 留白40% | 禁止标题块右侧塞装饰小图；禁止多行副标题堆叠 |
| 02 | slide_02_catalog | catalog | supporting | valley | N卡片横排 | L3: 章节序号角标 | — | 字数约150 / 图0 / 留白25% | 禁止超过4卡片；禁止卡片内文字<30字 |
| 03 | slide_03_overview | content | hero | peak | 上大图+下方卡片 | L1: workflow_diagram.svg（占上55%） | anchor | 字数约200 / 图1 / 留白30% | 禁止等宽卡片横排；禁止L3角标顶替L1 |
| 04 | slide_04_compare | content | supporting | valley | 非对称双栏 | L2: before_after_icon.svg（对比图标） | evidence | 字数约220 / 图1 / 留白28% | 禁止50:50等分；禁止无对比焦点 |
| 05 | slide_05_chapter_product | section | transition | transition | 全屏视觉+大标题 | L1: product_chapter_bg.png | atmosphere | 字数约40 / 图1 / 留白50% | 禁止铺满正文段落；禁止四卡片预览 |
| 06 | slide_06_product_detail | content | supporting | valley | 左大图+右侧文字 | L1: prototype_screenshot.png（占左55%） | evidence | 字数约240 / 图1 / 留白25% | 禁止50:50等分；禁止把图缩小为200×70 |
| 07 | slide_07_dev_hero | content | hero | peak | 巨型数字+洞察 | L1: code_gen_chart.svg + 大数字"85%" | anchor | 字数约180 / 图1 / 留白35% | 禁止等宽卡片横排；禁止核心数字塞图表角落 |
| 08 | slide_08_backend | content | supporting | valley | 左标题+右内容 | L2: db_schema.svg（占右50%） | evidence | 字数约260 / 图1 / 留白25% | 禁止单栏线性列表；禁止等宽四卡 |
| 09 | slide_09_frontend_test | content | supporting | valley | 上下分栏 | L2: frontend_mock.png（上区55%） | evidence | 字数约240 / 图1 / 留白28% | 禁止上下等分；禁止无主次区分 |
| 10 | slide_10_agent_power | content | hero | peak | 全幅图+骑线文字 | L1: agent_24h_bg.png | atmosphere | 字数约160 / 图1 / 留白40% | 禁止标题块右侧塞装饰小图 |
| 11 | slide_11_completeness | content | supporting | valley | 图表+洞察 | Chart(雷达图/柱状图) | evidence | 字数约180 / 图1 / 留白30% | 禁止无洞察文字；禁止图表无标注 |
| 12 | slide_12_assets | content | supporting | valley | 非对称双栏 | L1: skill_cards.png（占右45%） | anchor | 字数约200 / 图1 / 留白28% | 禁止50:50等分；禁止卡片悬浮 |
| 13 | slide_13_automation | content | supporting | valley | 上下分栏 | L2: deploy_flow.svg（上区50%） | evidence | 字数约180 / 图1 / 留白30% | 禁止上下等分 |
| 14 | slide_14_demo | content | transition | transition | 左大图+右侧文字 | L1: demo_preview.png（占左55%） | anchor | 字数约120 / 图1 / 留白35% | 禁止50:50等分 |
| 15 | slide_15_summary | content | hero | peak | 巨型数字+洞察 | 大数字"30+" / "5大" / "100%" | anchor | 字数约160 / 图0 / 留白38% | 禁止等宽卡片横排 |
| 16 | slide_16_end | ending | hero | peak | 全幅图+骑线文字 | L1: end_bg.png | atmosphere | 字数约30 / 图1 / 留白45% | 禁止多行落款堆叠 |

---

## Checklist

- [x] Hero页占比 5/16 = 31%（20-30%范围边缘，因封面+结束页默认计入，合理）
- [x] 无连续3页同为supporting+valley
- [x] N卡片横排仅1页（02），<2页上限
- [x] 非对称版式 10/16 = 62.5% ≥ 40%
- [x] 相邻页版式均不同
- [x] 左大图+非对称双栏合计 3页 ≤ 40%
- [x] 每页均含 role/rhythm/visual_role/anti_pattern
