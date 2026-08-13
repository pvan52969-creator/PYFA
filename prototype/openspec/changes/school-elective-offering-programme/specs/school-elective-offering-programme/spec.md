## Purpose

为校选课程补充「开课专业」展示，并按是否具备开课专业收紧 ME 课的默认可修专业范围；GE 课仅展示开课专业，不改变其按大类初始化的修读范围规则。

## ADDED Requirements

### Requirement: School elective list shows offering programme

校选课程管理列表 MUST 在「开课单位」右侧展示可排序列「开课专业」。GE 与 ME 行均 MUST 显示该列；无开课专业时 MUST 显示「—」。

#### Scenario: Column placement

- **WHEN** 用户打开校选课程管理列表
- **THEN** 「开课专业」列位于「开课单位」与「状态」之间（或紧接开课单位右侧、状态之前，与实现表头顺序一致）

#### Scenario: Empty offering programme

- **WHEN** 某课程行没有开课专业
- **THEN** 该列显示「—」

### Requirement: Demo data assigns offering programme

原型演示数据 MUST 为校选课程填充开课专业，规则如下：

1. 若课号去掉装饰字符后的前三位（大小写不敏感）能匹配已有专业代码，则开课专业为该专业代码。
2. 若课号以 `G` 开头，或前三位无法匹配专业代码，则 MUST 从专业目录中确定性或伪随机分配一个专业代码，保证列表可演示且同一课号结果稳定。

#### Scenario: Code prefix matches programme

- **WHEN** 课号为 `ECM301`（或等价前缀 `ECM`）
- **THEN** 开课专业为 `ECM`

#### Scenario: G-prefix or unmatched prefix

- **WHEN** 课号以 `G` 开头，或前三位不在专业目录中
- **THEN** 系统仍为其分配一个有效专业代码（非空），并在列表中显示

### Requirement: ME default scope with offering programme

当课程类型为 ME 且存在开课专业时，修读范围「初始化」MUST 将可选专业设为 **仅该开课专业 + MAT**，不可选专业 MUST 为空；提示文案 MUST 说明按开课专业 + MAT 初始化。

#### Scenario: ME init with offering programme

- **WHEN** 用户对一门有开课专业的 ME 课执行修读范围初始化
- **THEN** 可选专业仅为「开课专业」与 `MAT`（若开课专业已是 MAT，则不重复）
- **AND** 不可选专业为空

### Requirement: ME default scope without offering programme

当课程类型为 ME 且无开课专业时，修读范围「初始化」MUST 保持现有规则：可选 = 开课单位下全部专业 + MAT；不可选为空。

#### Scenario: ME init without offering programme

- **WHEN** 用户对一门无开课专业的 ME 课执行修读范围初始化
- **THEN** 可选专业为该课开课单位下全部专业，并包含 `MAT`
- **AND** 不可选专业为空

### Requirement: GE scope rules unchanged

GE 课的修读范围初始化规则 MUST 不因开课专业字段改变：仍按 Arts / Business / Science / 不限 的既有规则设置不可选或全开放；开课专业仅用于列表展示。

#### Scenario: GE still uses category rules

- **WHEN** 用户对一门已有开课专业的 GE 课执行修读范围初始化
- **THEN** 可选/不可选结果与未引入开课专业前的 GE 规则一致（同大类不可选或「不限」全开放等）
- **AND** 列表仍显示该课的开课专业
