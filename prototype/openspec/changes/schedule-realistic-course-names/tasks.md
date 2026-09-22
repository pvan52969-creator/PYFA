## 1. 课名真实化

- [x] 1.1 普查排课演示种子中带 `Studio` / `Demo` / `Conflict` / `Anchor` / `Probe` / `Pad` 的 `name`（含 CQ*、CDF*、CTS101、RM*、RCL*、RWP* 等），列出并改成互不撞车的目录风格英文课名；全局搜这些演示词在用户可见课名中无残留
- [x] 1.2 李明补课挂钩课（现 `CTS101`）课程班名称改为真实课名；`ensureAdjustmentLiMingMorningDemoSlots` / `ensureAdjustmentMakeupPendingDemoSlots` 仍能按 code 找到任务；刷新后补课 Pending 课名为真课名

## 2. 课组短名

- [x] 2.1 演示种子 `groupName` / 默认分组改为 `A组` 或 `Group1`，去掉 `${课名}小组1` 默认拼接（含 `buildScheduleDemoGroupAssignments` 等注入路径）；手测展示为 `课名（A组）` 而非 `课名（课名小组1）`
- [x] 2.2 排教室待排种子里已真实课名（如 `BIO110` General Biology）若组名仍假，一并改短名；卡片课程组带人数时仍为 `课名（短名）（n）`

## 3. 回归

- [x] 3.1 浏览器打开补课 Pending：无 `Teacher Timetable Studio` / `Studio` / `Demo ·`；课程组为真实课名 + 短名
- [x] 3.2 浏览器打开课表冲突查询、按教师排李明详情：课名真实；排时间右键菜单与排教室锁定/撤回与改前一致
- [x] 3.3 打开专业开课任务安排与培养方案 TAB3，确认未改
