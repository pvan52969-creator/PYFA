#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'docs');
const HTML_PATH = join(OUT_DIR, 'pyfa-workflow.html');
const PDF_PATH = join(OUT_DIR, 'XMUM-培养方案管理-操作流程.pdf');

const FLOW_NODES = [
  { id: 'v-manage', title: '方案版本管理', subtitle: '新建 · 复制 · 批量提交/导出', lane: 'version' },
  { id: 'v-tabs', title: '四 TAB 制定', subtitle: '分类 → 课程 → 课程组 → 进程表', lane: 'version' },
  { id: 'v-submit', title: '提交审批', subtitle: '学分校验 · 进入四级审批流', lane: 'version' },
  { id: 'v-review', title: '版本审批', subtitle: 'Pending / In Progress / History', lane: 'version' },
  { id: 'v-approved', title: '版本已通过', subtitle: '生效 · 回填上一版本截止批次', lane: 'version' },
  { id: 'e-gen', title: '生成执行计划', subtitle: '选专业 + 入学批次 · 自动匹配版本', lane: 'exec' },
  { id: 'e-edit', title: '编辑执行计划', subtitle: '版本副本 · 学期旋转 · 仅改差异', lane: 'exec' },
  { id: 'e-submit', title: '提交执行计划', subtitle: '批量提交/撤回 · 提交后锁定', lane: 'exec' },
  { id: 'e-offer', title: '开课', subtitle: '已开课须先删开课任务', lane: 'exec' },
  { id: 'c-apply', title: '方案变更申请', subtitle: '选已通过版本 · 批量提交/删除', lane: 'change' },
  { id: 'c-review', title: '方案变更审核', subtitle: '四级审批 · 审批日志', lane: 'change' },
  { id: 'c-merge', title: '覆盖原版本', subtitle: '不影响已生成执行计划', lane: 'change' },
  { id: 'q-read', title: '版本查询', subtitle: '只读查看已通过版本', lane: 'query' },
  { id: 'stats-bloom', title: "Bloom 统计", subtitle: '学院→专业→批次 · 已发布计划', lane: 'stats' },
  { id: 'stats-exec', title: '执行计划统计', subtitle: '跟踪各批次生成进度', lane: 'stats' },
];

const FLOW_EDGES = [
  { from: 'v-manage', to: 'v-tabs' },
  { from: 'v-tabs', to: 'v-submit' },
  { from: 'v-submit', to: 'v-review' },
  { from: 'v-review', to: 'v-approved' },
  { from: 'v-approved', to: 'e-gen' },
  { from: 'e-gen', to: 'e-edit' },
  { from: 'e-edit', to: 'e-submit' },
  { from: 'e-submit', to: 'e-offer' },
  { from: 'e-submit', to: 'stats-bloom' },
  { from: 'e-submit', to: 'stats-exec' },
  { from: 'v-approved', to: 'c-apply' },
  { from: 'c-apply', to: 'c-review' },
  { from: 'c-review', to: 'c-merge' },
  { from: 'v-approved', to: 'q-read' },
];

const LANE = {
  version: { label: '方案版本', fill: '#eff6ff', stroke: '#2563eb', dot: '#2563eb' },
  exec: { label: '执行计划', fill: '#f0fdf4', stroke: '#16a34a', dot: '#16a34a' },
  change: { label: '方案变更', fill: '#fffbeb', stroke: '#d97706', dot: '#d97706' },
  query: { label: '只读查询', fill: '#f1f5f9', stroke: '#64748b', dot: '#64748b' },
  stats: { label: '数据统计', fill: '#faf5ff', stroke: '#9333ea', dot: '#9333ea' },
};

const LAYOUT_OPTS = {
  nodeWidth: 168,
  nodeHeight: 52,
  rankGap: 42,
  nodeGap: 28,
  padding: 28,
};

// A3 landscape printable area @ 96dpi (approx, minus margins)
const PAGE_INNER_W = 1500;
const PAGE_INNER_H = 980;

function computeDAGLayout({
  nodes,
  edges,
  nodeWidth = 168,
  nodeHeight = 46,
  rankGap = 28,
  nodeGap = 18,
  padding = 20,
}) {
  const ids = nodes.map(n => n.id);
  const inDeg = Object.fromEntries(ids.map(id => [id, 0]));
  const adj = Object.fromEntries(ids.map(id => [id, []]));
  edges.forEach(e => {
    inDeg[e.to] = (inDeg[e.to] || 0) + 1;
    adj[e.from].push(e.to);
  });

  const rank = {};
  const q = ids.filter(id => inDeg[id] === 0);
  q.forEach(id => { rank[id] = 0; });
  const queue = [...q];
  while (queue.length) {
    const u = queue.shift();
    for (const v of adj[u]) {
      rank[v] = Math.max(rank[v] ?? 0, rank[u] + 1);
      inDeg[v] -= 1;
      if (inDeg[v] === 0) queue.push(v);
    }
  }

  const ranksMap = new Map();
  ids.forEach(id => {
    const r = rank[id] ?? 0;
    if (!ranksMap.has(r)) ranksMap.set(r, []);
    ranksMap.get(r).push(id);
  });

  const rankIndices = [...ranksMap.keys()].sort((a, b) => a - b);
  const positioned = [];
  const rankBoxes = [];
  let maxWidth = 0;
  let totalHeight = padding;

  rankIndices.forEach(r => {
    const row = ranksMap.get(r);
    const rowWidth = row.length * nodeWidth + (row.length - 1) * nodeGap;
    maxWidth = Math.max(maxWidth, rowWidth);
  });

  const canvasWidth = maxWidth + padding * 2;

  rankIndices.forEach(r => {
    const row = ranksMap.get(r);
    const rowWidth = row.length * nodeWidth + (row.length - 1) * nodeGap;
    const startX = padding + (canvasWidth - padding * 2 - rowWidth) / 2;
    const y = totalHeight;

    row.forEach((id, i) => {
      positioned.push({
        id,
        x: startX + i * (nodeWidth + nodeGap),
        y,
        rank: r,
        order: i,
      });
    });

    rankBoxes.push({
      rank: r,
      x: padding - 6,
      y: y - 6,
      width: canvasWidth - padding * 2 + 12,
      height: nodeHeight + 12,
    }); // rank index stored in .rank

    totalHeight += nodeHeight + rankGap;
  });

  const posMap = Object.fromEntries(positioned.map(p => [p.id, p]));
  const layoutEdges = edges.map(e => {
    const from = posMap[e.from];
    const to = posMap[e.to];
    return {
      from: e.from,
      to: e.to,
      sourceX: from.x + nodeWidth / 2,
      sourceY: from.y + nodeHeight,
      targetX: to.x + nodeWidth / 2,
      targetY: to.y,
    };
  });

  return {
    nodes: positioned,
    edges: layoutEdges,
    ranks: rankBoxes,
    width: canvasWidth,
    height: totalHeight - rankGap + padding,
    nodeWidth,
    nodeHeight,
  };
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEdgePath(sx, sy, tx, ty) {
  const midY = (sy + ty) / 2;
  return `M ${sx} ${sy} C ${sx} ${midY}, ${tx} ${midY}, ${tx} ${ty}`;
}

const TAB_ANNOTATIONS = [
  {
    title: 'TAB1 课程分类',
    desc: '二级/三级分类 · 最低/最高学分 · 选修课学期修读矩阵',
    tone: '#7c5cbf',
    bg: '#f5f3ff',
  },
  {
    title: 'TAB2 课程设置',
    desc: '课程库选课 · 分类与开课学期 · CLO · SLT 学时',
    tone: '#2563eb',
    bg: '#eff6ff',
  },
  {
    title: 'TAB3 课程组',
    desc: '选修课分组 · 标记必选项 · 影响进程表展示',
    tone: '#d97706',
    bg: '#fffbeb',
  },
  {
    title: 'TAB4 方案进程表',
    desc: '由 TAB1+2+3 自动生成 · 只读预览 · 可导出 PDF',
    tone: '#0d9488',
    bg: '#f0fdfa',
  },
];

const TAB_BRANCH_OPTS = {
  noteW: 204,
  noteH: 54,
  noteGap: 16,
  laneGap: 24,
  connectorGap: 20,
};

function refreshLayoutEdges(layout) {
  const posMap = Object.fromEntries(layout.nodes.map(p => [p.id, p]));
  layout.edges = FLOW_EDGES.map(e => {
    const from = posMap[e.from];
    const to = posMap[e.to];
    return {
      from: e.from,
      to: e.to,
      sourceX: from.x + layout.nodeWidth / 2,
      sourceY: from.y + layout.nodeHeight,
      targetX: to.x + layout.nodeWidth / 2,
      targetY: to.y,
    };
  });
  const maxY = Math.max(...layout.nodes.map(n => n.y + layout.nodeHeight));
  layout.height = maxY + LAYOUT_OPTS.padding;
}

function getTabBranchMetrics(layout) {
  const tabsNode = layout.nodes.find(n => n.id === 'v-tabs');
  if (!tabsNode) return null;
  const { noteH, noteGap } = TAB_BRANCH_OPTS;
  const totalH = TAB_ANNOTATIONS.length * noteH + (TAB_ANNOTATIONS.length - 1) * noteGap;
  // 整体垂直居中，使 TAB2 与「三 TAB 制定」节点居中对齐
  const startY = tabsNode.y + (layout.nodeHeight - totalH) / 2;
  return {
    tabsNode,
    startY,
    totalH,
    bottom: startY + totalH + 8,
  };
}

function expandLayoutForTabBranch(layout) {
  const metrics = getTabBranchMetrics(layout);
  if (!metrics) return;
  const { tabsNode, bottom } = metrics;
  const tabsRankBottom = tabsNode.y + layout.nodeHeight + 8;
  const overflow = bottom - tabsRankBottom;
  if (overflow <= 0) return;

  layout.nodes.forEach(n => {
    if (n.rank > tabsNode.rank) n.y += overflow;
  });
  layout.ranks.forEach(box => {
    if (box.rank > tabsNode.rank) box.y += overflow;
  });
  refreshLayoutEdges(layout);
}

function buildTabBranchAnnotation(layout) {
  const metrics = getTabBranchMetrics(layout);
  if (!metrics) return { svg: '', width: layout.width, height: layout.height };

  const { tabsNode, startY } = metrics;
  const { noteW, noteH, noteGap, laneGap, connectorGap } = TAB_BRANCH_OPTS;
  const hubX = tabsNode.x + layout.nodeWidth + connectorGap;
  const noteX = layout.width + laneGap;
  const sourceX = tabsNode.x + layout.nodeWidth;
  const sourceY = tabsNode.y + layout.nodeHeight / 2;

  const centers = TAB_ANNOTATIONS.map((_, i) => startY + i * (noteH + noteGap) + noteH / 2);
  const spineTop = centers[0];
  const spineBottom = centers[centers.length - 1];
  const dividerX = layout.width + laneGap / 2;

  const paths = [
    `<line x1="${dividerX}" y1="${spineTop - 12}" x2="${dividerX}" y2="${spineBottom + 12}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="6 5"/>`,
    `<path d="M ${sourceX} ${sourceY} L ${hubX} ${sourceY}" fill="none" stroke="#93c5fd" stroke-width="1.25" stroke-dasharray="5 4"/>`,
    `<path d="M ${hubX} ${spineTop} L ${hubX} ${spineBottom}" fill="none" stroke="#93c5fd" stroke-width="1.25" stroke-dasharray="5 4"/>`,
    ...centers.map(cy =>
      `<path d="M ${hubX} ${cy} L ${noteX} ${cy}" fill="none" stroke="#93c5fd" stroke-width="1.25" marker-end="url(#flow-arrow-branch)"/>`),
  ].join('');

  const notes = TAB_ANNOTATIONS.map((tab, i) => {
    const y = startY + i * (noteH + noteGap);
    return `
    <foreignObject x="${noteX}" y="${y}" width="${noteW}" height="${noteH}">
      <div xmlns="http://www.w3.org/1999/xhtml" class="tab-note" style="background:${tab.bg};border-color:${tab.tone}">
        <div class="tab-note-title" style="color:${tab.tone}">${esc(tab.title)}</div>
        <div class="tab-note-desc">${esc(tab.desc)}</div>
      </div>
    </foreignObject>`;
  }).join('');

  const branchBottom = startY + TAB_ANNOTATIONS.length * noteH + (TAB_ANNOTATIONS.length - 1) * noteGap;
  return {
    svg: `${paths}${notes}`,
    width: noteX + noteW + LAYOUT_OPTS.padding,
    height: Math.max(layout.height, branchBottom + LAYOUT_OPTS.padding),
  };
}

function buildHtml() {
  const nodeMap = Object.fromEntries(FLOW_NODES.map(n => [n.id, n]));
  const layout = computeDAGLayout({ nodes: FLOW_NODES, edges: FLOW_EDGES, ...LAYOUT_OPTS });
  expandLayoutForTabBranch(layout);

  const headerH = 72;
  const footerH = 52;
  const diagramAreaH = PAGE_INNER_H - headerH - footerH;

  const rankRects = layout.ranks.map(r => `
    <rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" rx="8"
      fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>`).join('');

  const edgePaths = layout.edges.map(e => `
    <path d="${buildEdgePath(e.sourceX, e.sourceY, e.targetX, e.targetY)}"
      fill="none" stroke="#94a3b8" stroke-width="1.25" marker-end="url(#flow-arrow)"/>`).join('');

  const nodeFo = layout.nodes.map(n => {
    const def = nodeMap[n.id];
    const lane = LANE[def.lane];
    return `
    <foreignObject x="${n.x}" y="${n.y}" width="${layout.nodeWidth}" height="${layout.nodeHeight}">
      <div xmlns="http://www.w3.org/1999/xhtml" class="node" style="background:${lane.fill};border-color:${lane.stroke}">
        <div class="node-title">${esc(def.title)}</div>
        <div class="node-sub">${esc(def.subtitle)}</div>
      </div>
    </foreignObject>`;
  }).join('');

  const legend = Object.entries(LANE).map(([, v]) => `
    <span class="legend-item" style="background:${v.fill}">
      <span class="legend-dot" style="background:${v.dot}"></span>${esc(v.label)}
    </span>`).join('');

  const tabBranch = buildTabBranchAnnotation(layout);
  const svgWidth = tabBranch.width;
  const svgHeight = tabBranch.height;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<title>XMUM 培养方案管理 · 操作流程</title>
<style>
  @page { size: A3 landscape; margin: 8mm; }
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", sans-serif;
    background: #f8fafc; color: #0f172a;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  body { overflow: auto; }
  .sheet {
    max-width: 920px; margin: 0 auto;
    padding: 14px 16px 18px;
    display: flex; flex-direction: column;
    background: #f8fafc;
  }
  .header {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 16px; flex-shrink: 0; margin-bottom: 10px;
  }
  .header-left h1 { margin: 0 0 4px; font-size: 18px; font-weight: 700; }
  .header-left p { margin: 0; font-size: 11px; color: #64748b; line-height: 1.4; }
  .legend { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-start; }
  .legend-item {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 8px; border-radius: 999px; font-size: 10px; color: #475569; border: 1px solid #e2e8f0;
  }
  .legend-dot { width: 7px; height: 7px; border-radius: 999px; flex-shrink: 0; }
  .diagram-area {
    flex-shrink: 0;
    display: flex; align-items: stretch; justify-content: center;
    border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; padding: 6px;
    overflow: hidden;
  }
  .diagram-area svg { display: block; width: 100%; max-width: 960px; height: auto; margin: 0 auto; }
  .node {
    width: 100%; height: 100%;
    padding: 6px 8px; border-radius: 8px;
    border: 1px solid; border-left-width: 3px;
    display: flex; flex-direction: column; justify-content: center; gap: 1px;
    box-sizing: border-box; overflow: hidden;
  }
  .node-title { font-size: 11px; font-weight: 600; line-height: 14px; color: #0f172a; }
  .node-sub { font-size: 9px; line-height: 12px; color: #64748b; }
  .tab-note {
    width: 100%; height: 100%;
    padding: 6px 8px; border-radius: 8px;
    border: 1px solid; border-left-width: 3px;
    display: flex; flex-direction: column; justify-content: center; gap: 2px;
    box-sizing: border-box; overflow: hidden;
  }
  .tab-note-title { font-size: 10px; font-weight: 700; line-height: 1.25; }
  .tab-note-desc { font-size: 8px; line-height: 1.35; color: #64748b; }
  .footer {
    flex-shrink: 0; margin-top: 10px;
    display: grid; grid-template-columns: 1fr; gap: 8px;
    font-size: 10px; line-height: 1.45; color: #475569;
  }
  @media (min-width: 700px) { .footer { grid-template-columns: 1fr 1fr 1fr; } }
  .footer-item {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 8px;
  }
  .footer-item strong { color: #0f172a; font-weight: 600; }
  .workflow-phases {
    flex-shrink: 0; margin-top: 10px;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
    padding: 10px 12px; font-size: 11px; line-height: 1.55; color: #475569;
  }
  .workflow-phases-title { font-size: 12px; font-weight: 600; color: #0f172a; margin-bottom: 6px; }
  .workflow-phases p { margin: 0 0 6px; }
  .workflow-phases p:last-child { margin-bottom: 0; }
  .workflow-modules {
    flex-shrink: 0; margin-top: 10px;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
    padding: 10px 12px; font-size: 10px; line-height: 1.5; color: #475569;
  }
  .workflow-modules-title { font-size: 12px; font-weight: 600; color: #0f172a; margin-bottom: 6px; }
  .workflow-modules dl { margin: 0; display: grid; gap: 4px; }
  .workflow-modules dt { font-weight: 600; color: #0f172a; display: inline; }
  .workflow-modules dt::after { content: '：'; }
  .workflow-modules dd { margin: 0 0 4px 0; display: inline; }
  .meta { margin-top: 8px; text-align: right; font-size: 10px; color: #94a3b8; flex-shrink: 0; }
  @media print {
    html, body { overflow: hidden; height: 100%; }
    .sheet {
      width: ${PAGE_INNER_W}px; height: ${PAGE_INNER_H}px; max-width: none;
      padding: 16px 20px 12px;
      page-break-after: avoid; page-break-inside: avoid;
    }
    .header-left { display: block; }
    .diagram-area { height: ${diagramAreaH}px; flex: 1; min-height: 0; }
    .diagram-area svg { max-width: none; width: 100%; height: 100%; }
    .node-title { font-size: 11px; line-height: 14px; }
    .node-sub { font-size: 9px; line-height: 12px; }
    .footer { font-size: 9px; }
    .workflow-phases { font-size: 9px; }
    .meta { display: none; }
  }
</style>
</head>
<body>
<div class="sheet">
  <div class="header">
    <div class="header-left">
      <h1>XMUM 培养方案管理 · 操作流程</h1>
      <p>主路径：四 TAB 制定与四级审批 → 通过后分流至执行计划、方案变更、只读查询与数据统计</p>
    </div>
    <div class="legend">${legend}</div>
  </div>
  <div class="diagram-area">
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="flow-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#94a3b8"/>
        </marker>
        <marker id="flow-arrow-branch" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#93c5fd"/>
        </marker>
      </defs>
      ${rankRects}${edgePaths}${nodeFo}${tabBranch.svg}
    </svg>
  </div>
  <div class="footer">
    <div class="footer-item"><strong>版本链</strong> 新版本开始批次须晚于上一版本；四级审批（HoP→HoD/Dean→QA→Senate）通过后自动回填上一版本截止批次。</div>
    <div class="footer-item"><strong>执行计划</strong> 按专业批次匹配已审批版本并复制；未提交可编辑/删除；已提交仅查看；撤回仅隐藏未开课候选；列表支持学院/专业级联筛选与分页。</div>
    <div class="footer-item"><strong>方案变更</strong> 同一版本审批中不可重复申请；通过后覆盖原版本；已生成执行计划不变；未生成批次引用最新版本。</div>
  </div>
  <div class="workflow-modules">
    <div class="workflow-modules-title">系统模块（侧栏导航）</div>
    <dl>
      <dt>概览</dt><dd>操作流程图</dd><br>
      <dt>方案版本</dt><dd>方案版本管理 · 版本审批 · 版本查询</dd><br>
      <dt>方案版本变更</dt><dd>方案版本变更申请 · 方案版本变更审核</dd><br>
      <dt>专业批次执行计划</dt><dd>专业批次执行计划（生成 / 编辑 / 批量提交）</dd><br>
      <dt>数据统计</dt><dd>Bloom's Taxonomy Charts · 执行计划统计</dd>
    </dl>
  </div>
  <div class="workflow-phases">
    <div class="workflow-phases-title">阶段说明</div>
    <p><strong>① 方案版本制定与审批</strong> 在【方案版本管理】新建或编辑草稿，完成 TAB1 分类、TAB2 课程、TAB3 课程组、TAB4 方案进程表后提交。学分校验通过后进入【版本审批】四级节点（Pending / In Progress / History），终审通过后版本生效。</p>
    <p><strong>② 专业批次执行计划</strong> 从已通过版本为尚未生成的入学批次生成执行计划（自动匹配版本、旋转开课学期），在【专业批次执行计划】编辑后批量提交；提交后方可进入开课模块。</p>
    <p><strong>③ 方案版本变更</strong> 在【变更申请】选择已通过版本（审批中不可重复），修改后批量提交；【变更审核】四级审批通过后覆盖原版本模板，不影响既有执行计划副本。</p>
    <p><strong>④ 数据统计</strong> 【Bloom 统计】按学院→专业→批次树展示已发布执行计划的布鲁姆分布；【执行计划统计】跟踪各专业批次是否已生成执行计划。</p>
  </div>
  <div class="meta">XMUM Curriculum Management · ${new Date().toISOString().slice(0, 10)}</div>
</div>
</body>
</html>`;
}

function findChrome() {
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ];
  return candidates.find(Boolean);
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(HTML_PATH, buildHtml(), 'utf8');

const chrome = findChrome();
if (!chrome) {
  console.error('未找到 Chrome/Chromium，已生成 HTML：', HTML_PATH);
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
});
try {
  const page = await browser.newPage();
  await page.goto(`file://${HTML_PATH}`, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  await page.pdf({
    path: PDF_PATH,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '8mm', right: '8mm', bottom: '8mm', left: '8mm' },
    pageRanges: '1',
  });
} finally {
  await browser.close();
}

console.log('单页 PDF 已生成:', PDF_PATH);
