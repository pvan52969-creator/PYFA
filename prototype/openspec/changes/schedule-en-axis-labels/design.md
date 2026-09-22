## Context

排课管理侧栏（`#sidebar-nav-schedule`）覆盖基础设置、排时间、排教室、自动排课、课表查询与调课管理。用户从 Pending Replacement 停课列表发起英文化表头，并要求整块排课域统一；开课 / 培养方案不得改动。节次英文映射（Time / Period 等）尚未拍板，本轮排除。

现状：同类轴字段在表头、筛选 label、弹窗、导出 CSV、冲突抽屉、变更日志 `fieldLabel` 中大量中文；部分字段（Course Code / Lecturer）已英文化，同屏混用。

## Goals / Non-Goals

**Goals:**

- 统一四类轴标签：周次→Week，日期→Date，星期→Day，教室→Venue
- 覆盖排课侧栏内静态 HTML 与 `app.js` 动态生成文案（含导出、详情字段名）
- 复合「教室*」标签在排课域内同步英文化

**Non-Goals:**

- **不改「节次」任何标签**（表头 / 筛选 / 表单 / 导出 / fieldLabel 均保持「节次」）
- 不改单元格取值语言（星期展示、节次文案、教室名称内容）
- 不改「起止周」及开课/培养方案模块任何文案
- 不改导航组名、页面大标题、长说明段落（除非整句仅为上述四类字段名）
- 不为 i18n 引入框架；本次为文案替换
- 联合排课已清空的 weekday 表头不加回 Day

## Decisions

1. **范围锚点 = 排课侧栏域**  
   以 `#sidebar-nav-schedule` 对应的 `page-schedule-*` / `page-adjustment-*` 及专属 modal 为准；开课 / 培养方案侧栏页面一律跳过。  
   *备选*：只改补课表 — 已否决，用户要求整块排课管理。

2. **标签映射表（权威）**

   | 中文 | 英文 |
   |------|------|
   | 周次 | Week |
   | 日期 | Date |
   | 星期 | Day |
   | 教室 | Venue |
   | 教室类型 | Venue Type |
   | 上课教室 | Venue |
   | 原教室 | Original Venue |
   | 目标教室 | Target Venue |
   | 调后教室 | New Venue |

   「节次」**不在本表**，保持中文。

3. **替换面**  
   表头 `<th>`、筛选/表单 `<label>`、导出 headers、详情 `{k:}` / `fieldLabel`、动态表头字符串。ID / class / data-* 不改。检索替换时跳过「节次」。

4. **排时间 / 排教室独立性**  
   仅改两侧各自可见的标签字符串；不改交互、菜单、校验。时间详情 weekday 列头「星期」→「Day」；联合排课空 weekday 表头保持空。

5. **实施顺序**  
   先 `index.html` 静态面，再 `app.js` 按关键词检索替换排课/调课相关字符串，最后对开课/培养方案做反向抽查确认无误伤。

## Risks / Trade-offs

- [误伤开课文案] → 替换前用路径/函数前缀过滤；改完对 `course-*` / 培养方案页抽查  
- [同屏 Week/Date/Day/Venue 与中文「节次」并存] → 有意为之；节次英文化另开变更  
- [导出列英文、单元格仍中文] → 与现有 Course Code 列一致，可接受  
- [遗漏动态表头] → tasks 要求全仓 `app.js` 检索四词 + 教室复合词并逐条确认归属

## Migration Plan

- 纯前端文案，无数据迁移  
- 回滚：还原 `index.html` / `app.js` 相关 diff

## Open Questions

- 「教室开放时间设置」页面标题是否改为 Venue…？默认：**页面标题暂不改**，表内列/表单项改。
- 节次后续英文化用 Time 还是 Period？**本轮不决**，另开变更再定。
