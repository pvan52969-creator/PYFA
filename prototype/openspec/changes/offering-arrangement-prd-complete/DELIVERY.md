# offering-arrangement-prd-complete 交付

- **策略：** 用户确认 **覆盖** `开课安排20260902V2`（不升 V3）
- **真源：** 可见 UI + tip/alert
- **清单：** `openspec/changes/offering-arrangement-prd-complete/INVENTORY.md`

## 产出

| 文件 | 说明 |
|------|------|
| `参考文档/2、开课管理/02_专业开课/02_开课安排/开课安排20260902V2/开课安排20260902V2.md` | 完整重写 |
| 同目录 `.docx` | 与 md 对齐；新增 ID 黄底 |
| `开课安排无→20260902V2变更说明.md/.docx` | 覆盖说明 |
| 批跑脚本 | `generate-prd-backend-ready-20260902.py` 对本菜单 **skip**，防再缩水 |

## 相对薄版补齐要点

- P01-X01 行展开「开课任务安排」+ 前往修改  
- P01-M02 授课确认弹窗  
- P02 侧栏（分组/重置/学时类型设置/复制）、小组树、安排详情、配置共同授课、Teaching Load、课时详情  
- BR010–BR016（同时授课/联动/偏好/学时锁定/Groups/评教占位/历史复制确认）  
- 教室偏好 = 多选下拉（非文本）
