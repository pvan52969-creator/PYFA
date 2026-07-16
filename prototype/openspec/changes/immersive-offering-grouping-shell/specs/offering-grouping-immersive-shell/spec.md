## ADDED Requirements

### Requirement: Immersive full-page shell for offering grouping

系统在打开开课分组/名单编辑页（`#page-offering-grouping`）时 MUST 启用沉浸整页壳：隐藏应用左侧导航侧栏，并将主内容区扩展为全视口宽度。离开该页时 MUST 退出沉浸壳并恢复常规侧栏布局。

#### Scenario: Enter from task arrangement "安排教师"
- **WHEN** 用户在开课任务安排列表点击「安排教师」（或等价入口）进入分组/教师安排页
- **THEN** 左侧开课导航侧栏不可见
- **AND** 分组页主内容区占满可用宽度
- **AND** 页顶仍展示现有「面包屑 + 返回 + 保存」操作区

#### Scenario: Enter from roster "管理名单"
- **WHEN** 用户在学生名单管理列表点击「管理名单」进入同一分组页
- **THEN** 系统使用与「安排教师」相同的沉浸整页壳
- **AND** 页顶仍展示现有「面包屑 + 返回 + 保存名单」操作区（按名单模式显示对应保存按钮）

#### Scenario: Leave immersive shell on return
- **WHEN** 用户确认返回（或保存后回列表）离开 `#page-offering-grouping`
- **THEN** 沉浸壳退出
- **AND** 左侧导航侧栏重新可见
- **AND** 用户回到原 `returnPage` 对应列表页

#### Scenario: Shared shell across offering types
- **WHEN** 用户从专业、通识选修或特殊开课等任一已接入 `openOfferingGroupingModal` 的入口进入该页
- **THEN** 沉浸壳行为一致（进入隐藏侧栏、离开恢复）

### Requirement: Preserve existing grouping page header

沉浸壳 MUST NOT 替换或移除现有顶栏结构；系统 MUST 继续展示面包屑、返回按钮，以及按模式显示的保存/保存名单按钮。

#### Scenario: Header chrome unchanged
- **WHEN** 沉浸壳已启用
- **THEN** 顶栏仍包含面包屑与返回
- **AND** 不改为仅含「← 返回 + 课程标题 + 保存」的极简独立应用顶栏
