## ADDED Requirements

### Requirement: AC sets college minimum groups by term

系统 MUST 提供「通识选修小组配额」页面，供 AC 按学期维护各学院通识选修**保底组数（下限）**及文/商/理统筹总组数。

#### Scenario: AC allocates minimum groups

- **WHEN** AC 为某学期保存各学院 minGroups 与文/商/理 categoryTotals
- **THEN** 系统持久化该学期配额
- **AND** 学院后续开课以 minGroups 为下限

#### Scenario: Exceeding minimum needs no approval

- **WHEN** 学院实际开组数大于其 minGroups
- **THEN** 系统允许该超额
- **AND** MUST NOT 要求 AC 二次确认

### Requirement: Reference group size

系统 MUST 支持教务备注定「每组人数参考值」，用于需求解读与开课容量参考，而非组数上限。

#### Scenario: Set reference group size

- **WHEN** AC 或教务设置某学期 refGroupSize（如 40）
- **THEN** 需求页与开课计划页可展示该参考值
- **AND** 系统 MUST NOT 将 refGroupSize 解释为学院可开组数的上限

### Requirement: Minimum is the only group-count constraint from AC

「可分配组数」在业务上表示为下限：学院至少开满 minGroups，可以开多，不能开少。

#### Scenario: No hard max from AC quota

- **WHEN** 学院拟开组数高于 minGroups
- **THEN** 配额规则不阻止
- **AND** 系统不以 AC 配额名义设置学院组数硬顶
