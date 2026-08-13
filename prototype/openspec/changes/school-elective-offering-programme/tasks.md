## 1. 数据与解析

- [ ] 1.1 新增 `resolveSchoolElectiveOfferingProgrammeCode(row)`：读 `offeringProgrammeCode`，空则「—」展示用
- [ ] 1.2 新增演示回填：按课号前三位匹配 `PROGRAMME_CATALOG`；`G` 开头或未匹配则用稳定 hash 从候选专业分配（优先同开课单位）
- [ ] 1.3 在 `normalizeSchoolElectiveCourseRow` 中空字段时回填 `offeringProgrammeCode`

## 2. 列表 UI

- [ ] 2.1 表头「开课单位」右侧增加可排序「开课专业」列（`offeringProgramme`）
- [ ] 2.2 行渲染展示专业代码；空为「—」；`colspan` 与排序列配置同步 +1
- [ ] 2.3 补充 `.col-offering-programme` 窄列居中样式（对齐开课单位）

## 3. ME 修读范围初始化

- [ ] 3.1 调整 `buildSchoolElectiveDefaultProgrammeScope` ME 分支：有开课专业 → 可选仅开课专业 + MAT；无则保持开课单位全部专业 + MAT
- [ ] 3.2 更新初始化提示文案（区分有/无开课专业）
- [ ] 3.3 手动点「初始化」验证：有开课专业的 ME、无开课专业的 ME、GE（规则不变）

## 4. 验收

- [ ] 4.1 列表：GE/ME 均有开课专业列；前缀课号与 G 开头课均有值或合理演示值
- [ ] 4.2 ME 初始化：有开课专业时可选仅两专业（或仅 MAT）；无开课专业时仍为单位全部 + MAT
- [ ] 4.3 GE 初始化结果与改前一致
