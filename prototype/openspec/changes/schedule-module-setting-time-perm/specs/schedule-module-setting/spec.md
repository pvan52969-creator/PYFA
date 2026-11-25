# Spec Delta

## Purpose

Defines the schedule-module settings page: per-term lock checkboxes grouped as time, scheduling, and adjustment permissions, including the new time-setting column and interlocking rules between the three groups.

## ADDED Requirements

### Requirement: Three permission groups in module setting table

The schedule module setting page MUST present, for each term row, three header groups left-to-right after 学期: **时间权限** (column 时间设置), **排课权限** (columns 排课表时间, 自动排课表时间, 排课表教室), and **调课权限** (column 调课管理). Checkbox semantics MUST remain 勾选 = 禁用 / 不勾选 = 开放.

#### Scenario: Header shows three groups

- **WHEN** the user opens 排课模块设置
- **THEN** the table header shows 时间权限 / 排课权限 / 调课权限 as separate group headers with the five leaf columns listed above
- **AND** the former single group label 锁定资源 is no longer used as the sole colspan header for all lock columns

#### Scenario: New term row includes timeSetting

- **WHEN** a term row is initialized in the module setting store
- **THEN** the row includes a `timeSetting` flag alongside the existing schedule and adjustment flags
- **AND** checked state for `timeSetting` means 时间设置 is disabled for that term

### Requirement: Time permission interlock

When **时间设置** is disabled (checked), the system MUST treat time-window limits as ignored for that term’s module-setting semantics and defer to 排课权限. When **时间设置** is open (unchecked), the system MUST prefer time-window / classroom constrained scheduling semantics, MUST default the three 排课权限 columns to open (unchecked) if cascading on that toggle, and MUST force 调课管理 to disabled (checked).

#### Scenario: Disable time setting

- **WHEN** the user checks 时间设置 on a term (禁用)
- **THEN** that term’s `timeSetting` is stored as disabled
- **AND** the UI reflects that time limits are not governing (排课权限 remain independently editable subject to other rules)

#### Scenario: Open time setting forces schedule open and adjustment locked

- **WHEN** the user unchecks 时间设置 on a term (开放)
- **THEN** the three 排课权限 checkboxes for that term become unchecked (开放) if the cascade applies
- **AND** 调课管理 for that term becomes checked (禁用)

### Requirement: Scheduling permission interlock

When all three **排课权限** columns are disabled (checked), the system MUST also disable **时间设置**. While any of the three 排课权限 columns is open (unchecked), the system MUST prevent **调课管理** from being opened (unchecking 调课管理 MUST be rejected or immediately re-disabled).

#### Scenario: All schedule modules disabled also disables time setting

- **WHEN** 排课表时间、自动排课表时间、排课表教室 are all checked (禁用) for a term
- **THEN** 时间设置 for that term becomes checked (禁用)

#### Scenario: Cannot open adjustment while scheduling is open

- **WHEN** at least one of the three 排课权限 columns is unchecked (开放)
- **AND** the user attempts to uncheck 调课管理 (开放调课)
- **THEN** 调课管理 remains disabled (checked)
- **AND** the user is informed or the control is not actionable

### Requirement: Adjustment permission interlock

When **调课管理** is disabled (checked), 时间设置 and 排课权限 MUST remain configurable under the other rules. When **调课管理** is open (unchecked), the system MUST automatically disable 时间设置 and all three 排课权限 columns for that term.

#### Scenario: Open adjustment locks time and scheduling

- **WHEN** 排课权限 are all disabled (so opening 调课 is allowed)
- **AND** the user unchecks 调课管理 (开放老师调课申请)
- **THEN** 时间设置 and the three 排课权限 columns become checked (禁用)

#### Scenario: Disabled adjustment leaves time and schedule editable

- **WHEN** 调课管理 is checked (禁用)
- **THEN** the user can still toggle 时间设置 and 排课权限 subject to the time and scheduling interlock rules

### Requirement: Persist and refresh after toggle

Every checkbox change MUST write the resulting row (after cascade) into the per-term module setting store and refresh the table so locked cells keep the existing locked visual treatment.

#### Scenario: Toggle persists cascade result

- **WHEN** a cascade changes multiple columns on one toggle
- **THEN** all affected flags for that term are stored
- **AND** the table re-renders with correct checked and locked-cell styles for those columns
