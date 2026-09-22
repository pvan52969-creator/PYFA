## 1. Static HTML（排课 / 调课）

- [x] 1.1 在 `index.html` 中定位 `page-schedule-*` / `page-adjustment-*` 及排课专用 modal，将表头与筛选/表单 label：周次→Week、日期→Date、星期→Day、教室→Venue（**跳过节次**）
- [x] 1.2 同范围内替换复合标签：教室类型→Venue Type、上课教室→Venue、原教室→Original Venue、目标教室→Target Venue、调后教室→New Venue
- [x] 1.3 确认联合排课 weekday 空表头不加 Day；页面 h1 / 导航组名 / 起止周 / 节次保持不动

## 2. Dynamic JS（排课 / 调课）

- [x] 2.1 检索 `app.js` 中排课/调课相关 `'周次'|'日期'|'星期'|'教室'` 及教室复合词，更新动态表头、详情 `{k:}`、`fieldLabel`、导出 CSV headers；**不替换节次**
- [x] 2.2 核对变更日志 / 冲突抽屉 / 批量调课等导出列与 design 映射表一致

## 3. 边界与回归

- [x] 3.1 抽查开课、培养方案页面：上述中文标签未被改动；排课域「节次」仍为中文
- [x] 3.2 浏览器回归：Pending Replacement 停课表头为 Week / Date / Day / 节次 / Venue；排时间详情 weekday 表头显示 Day；联合排课 weekday 表头仍为空
