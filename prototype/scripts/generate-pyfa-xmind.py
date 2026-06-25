#!/usr/bin/env python3
"""Generate XMind Zen-compatible .xmind for 培养方案管理 business mind map."""

import json
import uuid
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "XMUM-培养方案管理-业务逻辑思维导图.xmind"

# (id, title, fill, text_color, children)
MIND_TREE = (
    "root",
    "培养方案管理",
    None,
    None,
    [
        ("v", "方案版本管理", "#dbeafe", "#1e3a8a", [
            ("v-list", "版本列表", None, None, [
                ("v-list-cols", "列表字段：勾选·专业代码·培养方案版本·学制·版本·开始/截止Intake·学位·审批状态·引用数·操作", None, None, []),
                ("v-list-filter", "筛选：专业·审批状态·查询", None, None, []),
                ("v-list-batch", "批量：提交审批·版本导出（占位）", None, None, []),
            ]),
            ("v-new", "新增版本", None, None, [
                ("v-new-f", "字段：专业(必选)→自动带出学制/学位/方案名", None, None, []),
                ("v-new-f2", "开始入学批次(必选)→版本号通常一致", None, None, []),
                ("v-new-chain", "批次链：上一版本截止批次 = 下一版本开始批次的前一批次", None, None, []),
                ("v-new-val", "校验：开始批次不得早于上一版本截止批次", None, None, []),
                ("v-new-go", "确认→创建草稿→进入三标签页编辑", None, None, []),
            ]),
            ("v-status", "状态机", None, None, [
                ("v-st-draft", "草稿 draft：可编辑·提交·删除", None, None, []),
                ("v-st-pend", "审批中 pending：只读查看", None, None, []),
                ("v-st-app", "已通过 approved：只读；可生成执行计划/变更", None, None, []),
                ("v-st-rej", "已驳回 rejected：可编辑后重提", None, None, []),
            ]),
            ("v-tab", "三标签页编辑页", None, None, [
                ("v-tab1", "TAB1 课程分类", None, None, [
                    ("v-t1-tree", "三级树：H1(预设不可增删改)→H2(+新增分类)→H3(+子级)", None, None, []),
                    ("v-t1-l1", "一级：上移/下移排序；课程数自动汇总", None, None, []),
                    ("v-t1-credit", "学分：最低/最高；一级=各二级之和", None, None, []),
                    ("v-t1-nature", "课程性质：必修 compulsory / 选修 elective", None, None, []),
                    ("v-t1-elec", "选修二级：学期修读要求矩阵(学期·最低/最高学分·课程数)", None, None, []),
                    ("v-t1-val", "校验：同级不重名·学分非负·最低≤最高·三级合计不突破二级上限·必修三级=二级·选修矩阵学期不重复", None, None, []),
                    ("v-t1-gate", "门禁：TAB1未完成→TAB2/3禁用并提示", None, None, []),
                ]),
                ("v-tab2", "TAB2 课程设置", None, None, [
                    ("v-t2-sum", "顶栏：分类课程学分配置面板(课程数/已配/要求/达标)", None, None, []),
                    ("v-t2-list", "课程表：课号·课名·H1/H2/H3·学分·开课学期·性质·操作", None, None, []),
                    ("v-t2-add", "+新增/批量新增：须先建TAB1分类", None, None, []),
                    ("v-t2-modal", "课程设置三步弹窗", None, None, [
                        ("v-t2-s1", "Step1 基本信息：课程库选取·分类路径·学分·开课学期·先修", None, None, []),
                        ("v-t2-s1-ro", "只读带出：课号/课名/单位/负责人/授课语言/简介/参考书/其他信息", None, None, []),
                        ("v-t2-s1-opt", "可编辑：分类·学分·开课学期·先修·授课对象·语言水平", None, None, []),
                        ("v-t2-s1-sem", "必修须指定学期；选修可开关「指定学期」", None, None, []),
                        ("v-t2-s2", "Step2 CLO：创建/编辑/删除学习成果", None, None, []),
                        ("v-t2-s3", "Step3 SLT：大纲+过程性/期末评估(占比≤100%)", None, None, []),
                        ("v-t2-nav", "导航：Step1→2校验分类学分；Step2→3须≥1条CLO", None, None, []),
                    ]),
                    ("v-t2-val", "校验：未选课程库·分类未选全·有H3必选·学分有效·不超二级最高·不可重复纳入", None, None, []),
                ]),
                ("v-tab3", "TAB3 方案进程表", None, None, [
                    ("v-t3-gen", "由TAB1+TAB2自动生成只读预览", None, None, []),
                    ("v-t3-sem", "表头：Sem N（无周次）", None, None, []),
                    ("v-t3-pdf", "导出PDF/打印（原型占位）", None, None, []),
                ]),
                ("v-save", "保存：二次确认→写入VERSION_CONTENT_STORE→返回列表", None, None, []),
                ("v-submit", "提交审批：学分校验→审批队列→状态变审批中", None, None, []),
            ]),
        ]),
        ("ap", "培养方案版本审批", "#ede9fe", "#5b21b6", [
            ("ap-list", "待办/已办列表：Status·培养方案·Stage·专业·Intake·总学分·提交人·时间", None, None, []),
            ("ap-flow", "三级审批流：院系→学院→校方（原型简化）", None, None, []),
            ("ap-dec", "决策：通过 / 驳回 / 需修改", None, None, []),
            ("ap-batch", "批量：全部通过或全部驳回（不支持批量需修改）", None, None, []),
            ("ap-view", "查看：跳转版本编辑页只读三标签页", None, None, []),
            ("ap-pass", "通过后：status=approved；回填上一版本endIntake", None, None, []),
        ]),
        ("vq", "方案版本查询", "#f1f5f9", "#334155", [
            ("vq-ro", "仅已通过版本只读查看", None, None, []),
            ("vq-banner", "只读横幅：当前为查看模式不可编辑", None, None, []),
        ]),
        ("ch", "方案版本变更", "#fef3c7", "#92400e", [
            ("ch-new", "新建申请：目标版本须已通过；不可并行进行中变更", None, None, []),
            ("ch-copy", "复制版本内容→变更编辑页（共用三标签页）", None, None, []),
            ("ch-save", "保存：写入变更内容存储；不影响已生成执行计划", None, None, []),
            ("ch-submit", "提交变更审批：学分校验同版本提交", None, None, []),
            ("ch-pass", "审批通过：覆盖VERSION_CONTENT_STORE；已生成执行计划副本不变", None, None, []),
            ("ch-review", "变更审核：同版本审批规则+审批日志", None, None, []),
        ]),
        ("ex", "专业批次执行计划", "#dcfce7", "#166534", [
            ("ex-iso", "数据隔离：每入学批次独立副本；不回写方案版本；变更通过不影响已生成副本", None, None, []),
            ("ex-gen", "生成执行计划", None, None, [
                ("ex-gen-match", "选专业+入学批次→自动匹配已通过版本", None, None, []),
                ("ex-gen-dup", "校验：批次落在版本生效区间；不可重复生成", None, None, []),
                ("ex-gen-rot", "复制内容+旋转Y1S1~YnS3槽位→计算实际开课学期(年月)", None, None, []),
                ("ex-gen-base", "生成基线快照→用于「是否调整」对比", None, None, []),
            ]),
            ("ex-list", "执行计划列表", None, None, [
                ("ex-list-col", "列：专业代码·专业·专业批次·学院·入学批次·总学分·是否提交·是否调整·AC·操作", None, None, []),
                ("ex-list-op", "操作：编辑(未提交)·查看·修改记录(有调整时)", None, None, []),
            ]),
            ("ex-lock", "是否提交（isLocked）", None, None, [
                ("ex-lock-yes", "已提交：执行计划页只读；不可编辑", None, None, []),
                ("ex-lock-offer", "业务含义：专业开课「生成开课计划」时可见本批次未开课课程", None, None, []),
                ("ex-lock-no", "未提交：可编辑(限开课学期+先修)；可删除(无开课任务时)", None, None, []),
            ]),
            ("ex-edit", "执行计划编辑（未提交）", None, None, [
                ("ex-t1", "TAB1：分类树只读(不可增删改/移动/矩阵编辑)", None, None, []),
                ("ex-t2", "TAB2：无新增/批量/移除；列含开课状态·实际开课学期", None, None, [
                    ("ex-t2-off", "已开课课程：仅查看", None, None, []),
                    ("ex-t2-unoff", "未开课：查看+编辑(限开课学期与先修)", None, None, []),
                    ("ex-t2-modal", "课程弹窗三Tab：Tab1部分可编；Tab2 CLO·Tab3 SLT只读", None, None, []),
                    ("ex-t2-ro-f", "不可改：分类·学分·语言·简介·参考书·其他信息·CLO·SLT", None, None, []),
                ]),
                ("ex-t3", "TAB3：方案进程表只读", None, None, []),
            ]),
            ("ex-unlock", "撤回提交", None, None, [
                ("ex-unlock-eff", "效果：开课计划生成时看不到本批次还未开课课程", None, None, []),
                ("ex-unlock-keep", "已开课课程及已生成开课任务不受影响", None, None, []),
                ("ex-unlock-re", "再次提交→未开课候选恢复可见", None, None, []),
                ("ex-unlock-edit", "撤回后可重新编辑执行计划(限开课学期+先修)", None, None, []),
            ]),
            ("ex-del", "删除：仅未提交且无开课任务的计划可删", None, None, []),
            ("ex-log", "修改记录：相对版本基线的调整日志(AC/时间/摘要)", None, None, []),
        ]),
        ("of", "开课管理", "#cffafe", "#0e7490", [
            ("of-time", "开课时间设置：唯一「是否开课学期=是」的学年学期", None, None, []),
            ("of-plan", "开课计划生成", None, None, [
                ("of-plan-src", "数据源：已提交执行计划+当前开课学期+未开课课程", None, None, []),
                ("of-plan-dim", "维度：1门课+1专业+1入学批次=1条候选", None, None, []),
                ("of-plan-keep", "重新生成时保留已开课教学班", None, None, []),
                ("of-plan-split", "拆分：专业开课/通识选修/其他开课", None, None, []),
            ]),
            ("of-major", "专业开课：合分班·分组·教学班列表", None, None, []),
            ("of-ge", "通识选修开课", None, None, []),
            ("of-other", "其他开课：重修等人工维护", None, None, []),
        ]),
        ("rule", "通用规则与校验汇总", "#fee2e2", "#991b1b", [
            ("rule-iso", "数据隔离", None, None, [
                ("rule-iso-v", "版本保存→VERSION_CONTENT_STORE", None, None, []),
                ("rule-iso-e", "执行计划保存→EXEC_CONTENT_STORE(不回写版本)", None, None, []),
                ("rule-iso-c", "变更通过→覆盖版本；执行计划副本不变", None, None, []),
            ]),
            ("rule-credit", "总学分", None, None, [
                ("rule-c-total", "毕业总学分=TAB1各一级最低学分之和", None, None, []),
                ("rule-c-list", "各列表总学分取对应内容存储计算值", None, None, []),
                ("rule-c-bar", "编辑顶栏信息条不展示毕业总学分", None, None, []),
            ]),
            ("rule-val", "关键校验阻断", None, None, [
                ("rule-v-sub", "提交审批：必修已配≥最低；不超最高；选修矩阵合法", None, None, []),
                ("rule-v-tab", "TAB门禁：分类未完成不可进课程设置", None, None, []),
                ("rule-v-course", "课程：库中选取·分类完整·必修指定学期·不重复", None, None, []),
                ("rule-v-clo", "CLO：进Step3前至少1条", None, None, []),
                ("rule-v-exec", "执行计划：未提交可编；已提交只读；开课状态在TAB2", None, None, []),
            ]),
            ("rule-term", "学期映射（执行计划）", None, None, [
                ("rule-t-y", "方案版本：Y1S1~YnS3不含具体年月", None, None, []),
                ("rule-t-a", "执行计划：按入学批次旋转→actualSemester如2026/09", None, None, []),
            ]),
        ]),
    ],
)


def build_topic(node):
    tid, title, fill, color, children = node
    topic = {
        "id": tid,
        "class": "topic",
        "title": title,
    }
    if fill:
        topic["style"] = {
            "id": f"style-{tid}",
            "properties": {
                "svg:fill": fill,
                "fo:color": color or "#0f172a",
                "fill-pattern": "solid",
            },
        }
    if children:
        topic["children"] = {"attached": [build_topic(c) for c in children]}
    return topic


def build_content():
    root = build_topic(MIND_TREE)
    root["structureClass"] = "org.xmind.ui.logic.right"
    sheet_id = str(uuid.uuid4())
    return [
        {
            "id": sheet_id,
            "class": "sheet",
            "title": "培养方案管理",
            "rootTopic": root,
            "extensions": [
                {
                    "provider": "org.xmind.ui.skeleton.structure.style",
                    "content": {"centralTopic": "org.xmind.ui.logic.right"},
                }
            ],
            "theme": {"id": "XMind-primary-theme"},
        }
    ]


def main():
    content = build_content()
    metadata = {
        "creator": {"name": "XMUM PyFA Prototype", "version": "1.0.0"},
        "author": "XMUM",
        "title": "培养方案管理-业务逻辑思维导图",
    }
    manifest = {
        "file-entries": {
            "content.json": {},
            "metadata.json": {},
        }
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(OUT, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("content.json", json.dumps(content, ensure_ascii=False, indent=2))
        zf.writestr("metadata.json", json.dumps(metadata, ensure_ascii=False, indent=2))
        zf.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=2))

    print(f"Generated: {OUT}")


if __name__ == "__main__":
    main()
