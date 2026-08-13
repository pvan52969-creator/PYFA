## 1. 类型解析与数据模型

- [ ] 1.1 新增 `resolveGeOfferingTypeCode`（课号 G01/G1x、G02/G2x、G03/G3x → 对应类型，其余 → G04；可回退 geCategory）
- [ ] 1.2 将 `GE_OFFERING_QUOTA_BY_TERM` 默认结构改为 `types[{ typeCode, minGroups2, minGroups3 }]`，`ensure` 时兼容/迁移旧 `colleges` 缓存
- [ ] 1.3 实现按类型统计已开小组数（替代/旁路 `getGeOfferingActualGroupsBySchool` 在配额场景的用法）
- [ ] 1.4 实现 `getGeOfferingQuotaProgressRows` 类型版：合计需开、已开、是否达标、短差

## 2. 类型配额 UI

- [ ] 2.1 `index.html`：卡片标题改为「类型配额」；表头改为类型 / 需开课程班/组数 / 需开·2学分 / 需开·3学分 / 已开 / 进度；更新 tbody id
- [ ] 2.2 重写 `renderGeOfferingQuotaPage`：渲染四行类型、2/3 学分可编辑输入、合计与进度
- [ ] 2.3 重写 `saveGeOfferingQuotaPage`：从类型输入保存 `types`，不写 colleges

## 3. 开课校验与摘要

- [ ] 3.1 将生效/提交短差收集改为按涉及类型（去掉学院维度拦截）
- [ ] 3.2 更新拦截提示文案为类型 + 差额
- [ ] 3.3 `renderGeOfferingPlanQuotaProgress`（及同类摘要）改为按类型展示

## 4. 回归核对

- [ ] 4.1 配额页：四行类型、保存后刷新保留、需求刷新不改需开
- [ ] 4.2 通识开课：涉及类型未达标不可生效；达标或超额可生效；未涉及类型不挡
- [ ] 4.3 确认侧栏/文案无残留「各学院配额」主标题（hint 可保留下限说明）
