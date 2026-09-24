## Purpose

为 Class Adjustment 教师端提供可切换的演示教师身份，使列表、可申请节次与提交身份均只对应当前教师，便于原型演示数据权限隔离。

## ADDED Requirements

### Requirement: Teacher demo identity switch on Class Adjustment

系统 SHALL 在教师端 Class Adjustment 页面（`#page-adjustment-teacher`）右上角展示「演示身份」下拉，供原型切换当前教师。正式说明可用 title 标明正式环境取登录用户。系统 MUST NOT 修改开课管理模块的角色切换或开课列表权限逻辑。

#### Scenario: Switch control visible on teacher page

- **WHEN** 用户进入 Class Adjustment 教师端页面
- **THEN** 页面右上角可见「演示身份」下拉，且选项为多名样本教师

#### Scenario: Sample teachers available

- **WHEN** 下拉打开
- **THEN** 至少提供多名有已排节次（或有演示申请）的教师可选，便于对比不同身份下的数据差异

### Requirement: Data scoped to selected teacher

在教师端（非教务代申请模式）下，系统 SHALL 仅展示与当前演示身份对应教师相关的申请与可操作节次；切换身份后，当前 Tab / 子表 SHALL 立即按新教师刷新。

#### Scenario: Application lists filter by identity

- **WHEN** 用户将演示身份切换为教师 A
- **THEN** Class Replacement（含 Pending / New / History）与 Class Addition 列表仅显示教师 A 的申请（或教师 A 可操作的停课待补节次）

#### Scenario: Apply flow uses selected identity

- **WHEN** 当前演示身份为教师 A，且用户发起调课 / 停课 / 补课 / 加课
- **THEN** 可选节次与提交后的申请人身份均为教师 A

#### Scenario: Switching refreshes current view

- **WHEN** 用户在某一子表停留时切换演示身份
- **THEN** 当前子表内容按新身份重新渲染，不再混入其他教师的行

### Requirement: Admin proxy path unchanged

教务代申请路径 SHALL 继续使用既有「代申请教师」选择，不受教师端演示身份控件影响。开课管理相关代码与数据权限行为 MUST 保持不变。

#### Scenario: Admin proxy teacher select still works

- **WHEN** 教务在代申请页选择代申请教师并发起申请
- **THEN** 行为与改前一致，不依赖教师端「演示身份」下拉
