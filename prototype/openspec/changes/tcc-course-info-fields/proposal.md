## Why

授课确认表字段与参考「Course Information」口径不一致（人数取上限、起止周区间、周学时未按学期均摊四舍五入、缺 Combined class 等），教务与教师看到的确认内容无法对齐线下确认函语义。同时共同授课仍要求手填「共同授课码」，增加多余操作；确认侧 Combined class 应以系统自动打上的共同授课标记为准，并在设置弹窗内能看到已合班课程。

## What Changes

- **BREAKING（相对既有授课确认提案口径）**：`Total Student No.` 改为**计划人数**（不含预留），不再取课程人数上限；表头统一为学生数量语义，不另列/备注 quota。
- 管理端 / 教师端授课确认表（含 section 管理明细）字段对齐参考表：新增 **Combined class**；**No. of Group** 对齐 Teaching Load Groups 规则；**Teaching Weeks** 显示授课周数（单双周显示周次总和）；**Weekly Teaching Hours** 按全学期总学时 / 授课周数均摊后四舍五入；**Course Coordinator** / **Co-teaching Staff** 按同 course code 范围重算（Co-teaching 排除本人与 Coordinator）。
- **Combined class**：同课号多组同时授课，**或**不同课号已打上共同授课标记 → `Y`，否则 `N`。
- 共同授课设置：**不再手填共同授课码**；勾选符合规则的多门不同课号课程并确认后，系统**自动打上共同授课标记**；设置弹窗内可检索课程号/名称，并能看到**已设置共同授课**的课程信息。

## Capabilities

### New Capabilities

- `shared-teaching-mark`: 共同授课自动标记（取消手填码）、设置弹窗展示已合班课程与检索

### Modified Capabilities

- `teacher-course-confirmation`（既有 change 已引入、主 specs 尚未归档）：确认表字段语义与计算规则对齐 Course Information；Combined class 依赖共同授课标记与同课同时授课

## Impact

- `app.js`：`buildTeacherCourseConfirmationRows` 及管理端/教师端/明细表渲染；Groups / 周学时均摊；共同授课 confirm 写入与列表展示
- `index.html` / `styles.css`：授课确认表列；`#modal-shared-teaching-setup` 去掉手填码字段、强化已合班可见性
- 数据：section 上共同授课由「用户输入码」改为系统生成/写入的标记（可兼容现有 `sharedTeachingCode` 字段作内部关联键，或等价布尔/组 id）；演示数据需覆盖合班与变周学时案例
- 非目标：邮件确认函导出；改排课冲突算法本体（仍按标记忽略冲突的既有示意）；通识/特殊开课确认扩面
