## 1. 真源索引

- [ ] 1.1 在 `参考文档/2、开课管理/00_规范与变更说明/` 新增「现行真源索引」md，按 design.md 表格列出每个二级菜单的最新文件夹路径，并核对文件已存在
- [ ] 1.2 修改 `需求文档版本与变更说明规范.md`：把「03/04 预留给选修开课、特殊开课」改成实际结构（`03_选修开课` 已存在；`04_特殊开课` 不存在），保存后 grep 规范文件不再出现「预留」误导句

## 2. 历史树隔离

- [ ] 2.1 在 `参考文档/2、开课管理/开课0807/` 增加 README：写明本目录为 202608 历史包，开发与测试以编号目录最新 PRD 为准；打开该 README 可见「历史」字样
- [ ] 2.2 不删除 0807 下任何 PRD/HLD/LLD；用 `ls 开课0807` 确认原文件仍在

## 3. 流程图与侧栏对照

- [ ] 3.1 打开 `docs/course-offering-workflow.html`，对照 `#sidebar-nav-course` 现行菜单名；仅修正过时名称（如「专业开课计划」「通识选修开课」），不改未确认业务流程；改完后页面内不再出现已下线菜单作为现行路径
- [ ] 3.2 在真源索引中注明：操作流程图无独立 PRD；特殊开课无 `04_` 目录、侧栏分组已注释下线。打开索引可见这两条

## 4. 未确认项只登记不发明

- [ ] 4.1 把选修三页 20260915V1 的 UC（计划 UC001/UC002、安排 UC001/UC002、名单 UC001）抄入真源索引「未拍板」节，编号与 PRD §11 一致；核对未改这些 PRD 的已明确 BR
- [ ] 4.2 在同一节引用 `20260827_ME借用他专业开课方案确认`：标明方案 A/B 未勾选、现行原型仍是选修另开班；不把 A 或 B 写成已明确

## 5. OpenSpec 过程债

- [ ] 5.1 在真源索引列出 in-progress change：`elective-module-gap-audit`、`ge-quota-by-g-type`、`ge-demand-credit-distribution`、`school-elective-offering-programme`、`design-offering-grouping-hours`，并各写一句「为何过期/须对照 20260915」；不修改这些 change 的 tasks 勾选状态
- [ ] 5.2 grep `app.js` 确认本 change 未改开课业务函数（配额、修读范围、合班、授课确认等）

## 6. 收尾

- [ ] 6.1 运行 `openspec status --change offering-prd-full-scan`，确认 tasks 可被勾选跟踪
