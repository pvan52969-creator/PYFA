# Tasks

## 1. 演示管理员身份与权限判定

- [x] 1.1 增加排课演示管理员状态（level: school / college / programme + schoolCode / programmeKey），默认学校负责人；用 storage 或等价方式保证新页签可读到同一身份，验证刷新/新页签后身份仍一致
- [x] 1.2 实现 `canAdjustScheduleConflictPeer(peerTask, admin)`：学校全覆盖、学院按 `getProgrammeSchoolCode`、专业按 `programmeKey` 一一匹配；用三组样例断言（可控制台/临时自检）验证真假分支
- [x] 1.3 在排时间详情（或冲突弹窗可见区域）增加「演示管理员」切换 UI，验证可切到学院/专业并改管辖范围

## 2. 冲突结构化对端

- [x] 2.1 在排时间落点冲突检测推入教师/学生冲突时同步写入 peers（含 taskId、programmeKey、weekday、periodNo、kind），验证 `openSchedulePlaceConflictModal` 收到的 conflicts 含 peers
- [x] 2.2 无对端任务的冲突类型不写 peer，验证不排课/学时等行无「去调整」

## 3. 弹窗入口与跳转

- [x] 3.1 改造 `#modal-schedule-place-conflict` 渲染：有 peer 的行展示「去调整」（及/或可点课名），验证教师冲突弹窗出现入口
- [x] 3.2 实现点击处理：无权限 → alert「当前冲突课程调整权限不足」且不跳转；有权限 → 关闭弹窗并用 `launchScheduleDetailTab` 打开深链，验证原页签上下文保留
- [x] 3.3 深链优先按课程打开并选中对端 `taskId`（必要时回退批次作用域）；验证新页签左侧/课表对该课已选中且可微调
- [x] 3.4 （可选）深链带冲突 weekday/periodNo，打开后尽量高亮或选中该节；无则跳过，不影响主验收

## 4. 范围隔离与联调验收

- [x] 4.1 确认未改排教室侧菜单/冲突弹窗；对照打开教室详情右键菜单，行为与改前一致
- [x] 4.2 联调三条路径：学校负责人任意对端可跳；学院负责人仅本院；专业负责人仅本专业否则提示权限不足——在闭环教师冲突样本（如 CDX101/CDX102）上点验通过
