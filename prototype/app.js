// ── Version data：截止批次 = 下一版本开始批次的前一批次，区间不重合 ──
const PROGRAMMES = {
  finance:    { code: 'FIN', name: 'Finance', nameZh: '金融学', school: 'School of Economics & Management', degree: '经济学学士', duration: 4 },
  chinese:    { code: 'CHS', name: 'Chinese Studies', nameZh: '中国研究', school: 'School of Humanities and Social Sciences', degree: '文学学士', duration: 3 },
  accounting: { code: 'ACC', name: 'Accounting', nameZh: '会计学', school: 'School of Economics & Management', degree: '管理学学士', duration: 4 }
};

/** 入学批次顺序：每年 02 → 04 → 09 */
const INTAKE_TYPES = ['02', '04', '09'];

function parseIntake(code) {
  if (!code || code.length < 6) return null;
  return { year: parseInt(code.slice(0, 4), 10), type: code.slice(4) };
}

function formatIntake(year, type) {
  return `${year}${type}`;
}

/** 展示格式：201602 → 2016/02 */
function formatIntakeDisplay(intakeCode) {
  if (!intakeCode) return '—';
  const p = parseIntake(String(intakeCode).replace(/\//g, ''));
  if (!p) return intakeCode;
  return `${p.year}/${p.type}`;
}

/** 输入归一化：2025/09 → 202509 */
function normalizeIntakeCode(input) {
  if (!input) return '';
  return String(input).trim().replace(/\//g, '');
}

/** 前一个入学批次，如 202602 → 202509 */
function getPreviousIntake(intakeCode) {
  const p = parseIntake(intakeCode);
  if (!p) return '';
  const idx = INTAKE_TYPES.indexOf(p.type);
  if (idx > 0) {
    return formatIntake(p.year, INTAKE_TYPES[idx - 1]);
  }
  return formatIntake(p.year - 1, INTAKE_TYPES[INTAKE_TYPES.length - 1]);
}

/** 下一个入学批次，如 202509 → 202602 */
function getNextIntake(intakeCode) {
  const p = parseIntake(intakeCode);
  if (!p) return '';
  const idx = INTAKE_TYPES.indexOf(p.type);
  if (idx >= 0 && idx < INTAKE_TYPES.length - 1) {
    return formatIntake(p.year, INTAKE_TYPES[idx + 1]);
  }
  return formatIntake(p.year + 1, INTAKE_TYPES[0]);
}

/** 新版本保存时：上一版本截止批次 = 新版本开始批次的前一批次 */
function getPreviousVersionEndIntake(newStartIntake) {
  return getPreviousIntake(newStartIntake);
}

const VERSIONS = [
  { id: 1, programmeKey: 'chinese', name: 'Course Structure of Chinese Studies (201602 Version)', version: '201602', startIntake: '201602', endIntake: '201809', duration: 3, degree: '文学学士', disabled: true, locked: true, status: 'approved' },
  { id: 2, programmeKey: 'chinese', name: 'Course Structure of Chinese Studies (201902 Version)', version: '201902', startIntake: '201902', endIntake: '202204', duration: 3, degree: '文学学士', disabled: false, locked: false, status: 'approved' },
  { id: 3, programmeKey: 'chinese', name: 'Course Structure of Chinese Studies (202209 Version)', version: '202209', startIntake: '202209', endIntake: '202404', duration: 3, degree: '文学学士', disabled: false, locked: false, status: 'approved' },
  { id: 4, programmeKey: 'chinese', name: 'Course Structure of Chinese Studies (202409 Version)', version: '202409', startIntake: '202409', endIntake: '202504', duration: 3, degree: '文学学士', disabled: false, locked: false, status: 'approved' },
  { id: 5, programmeKey: 'chinese', name: 'Course Structure of Chinese Studies (202509 Version)', version: '202509', startIntake: '202509', endIntake: '', duration: 3, degree: '文学学士', disabled: false, locked: false, status: 'approved' },

  { id: 10, programmeKey: 'finance', name: 'Course Structure of Finance (201602 Version)', version: '201602', startIntake: '201602', endIntake: '201809', duration: 4, degree: '经济学学士', disabled: false, locked: false, status: 'approved' },
  { id: 11, programmeKey: 'finance', name: 'Course Structure of Finance (201902 Version)', version: '201902', startIntake: '201902', endIntake: '202204', duration: 4, degree: '经济学学士', disabled: false, locked: false, status: 'approved' },
  { id: 12, programmeKey: 'finance', name: 'Course Structure of Finance (202209 Version)', version: '202209', startIntake: '202209', endIntake: '202404', duration: 4, degree: '经济学学士', disabled: false, locked: false, status: 'approved' },
  { id: 13, programmeKey: 'finance', name: 'Course Structure of Finance (202409 Version)', version: '202409', startIntake: '202409', endIntake: '', duration: 4, degree: '经济学学士', disabled: false, locked: false, status: 'approved' },
  { id: 14, programmeKey: 'finance', name: 'Course Structure of Finance (202509 Version)', version: '202509', startIntake: '202509', endIntake: '', duration: 4, degree: '经济学学士', disabled: false, locked: false, status: 'pending' },

  { id: 20, programmeKey: 'accounting', name: 'Course Structure of Accounting (201602 Version)', version: '201602', startIntake: '201602', endIntake: '201809', duration: 4, degree: '管理学学士', disabled: false, locked: false, status: 'approved' },
  { id: 21, programmeKey: 'accounting', name: 'Course Structure of Accounting (201902 Version)', version: '201902', startIntake: '201902', endIntake: '202204', duration: 4, degree: '管理学学士', disabled: false, locked: false, status: 'approved' },
  { id: 22, programmeKey: 'accounting', name: 'Course Structure of Accounting (202209 Version)', version: '202209', startIntake: '202209', endIntake: '202404', duration: 4, degree: '管理学学士', disabled: false, locked: false, status: 'approved' },
  { id: 23, programmeKey: 'accounting', name: 'Course Structure of Accounting (202409 Version)', version: '202409', startIntake: '202409', endIntake: '202504', duration: 4, degree: '管理学学士', disabled: false, locked: false, status: 'approved' },
  { id: 24, programmeKey: 'accounting', name: 'Course Structure of Accounting (202509 Version)', version: '202509', startIntake: '202509', endIntake: '', duration: 4, degree: '管理学学士', disabled: false, locked: false, status: 'approved' },
  { id: 25, programmeKey: 'accounting', name: 'Course Structure of Accounting (202602 Version)', version: '202602', startIntake: '202602', endIntake: '', duration: 4, degree: '管理学学士', disabled: false, locked: false, status: 'draft' }
];

/** 批次执行计划：关联已审批培养方案版本（versionId） */
const EXEC_PLANS = [
  { id: 1, planCode: 'EP-Finance-202502', programmeKey: 'finance', intake: '202502', versionId: 13, status: 'published', isLocked: true, isOffering: true },
  { id: 3, planCode: 'EP-ChineseStudies-202409', programmeKey: 'chinese', intake: '202409', versionId: 4, status: 'published', isLocked: true, isOffering: true },
  { id: 4, planCode: 'EP-ChineseStudies-202502', programmeKey: 'chinese', intake: '202502', versionId: 4, status: 'published', isLocked: true, isOffering: true },
  { id: 5, planCode: 'EP-ChineseStudies-202509', programmeKey: 'chinese', intake: '202509', versionId: 5, status: 'published', isLocked: true, isOffering: false },
  { id: 6, planCode: 'EP-Accounting-202509', programmeKey: 'accounting', intake: '202509', versionId: 24, status: 'published', isLocked: true, isOffering: true },
  { id: 7, planCode: 'EP-Accounting-202602', programmeKey: 'accounting', intake: '202602', versionId: 24, status: 'draft', isLocked: false, isOffering: false }
];

/** 各执行计划独立的分类树 / 课程 / 选修矩阵（由关联版本模板复制） */
const EXEC_CONTENT_STORE = {};
let currentExecPlan = null;
let selectedExecPlanIds = new Set();

/** 方案变更申请：审批通过后覆盖目标版本内容，不影响已生成执行计划 */
const CHANGE_APPLICATIONS = [
  {
    id: 'ca-fin-13-pending',
    versionId: 13,
    programmeKey: 'finance',
    name: 'Course Structure of Finance (202409 Version)',
    version: '202409',
    startIntake: '202409',
    totalCredits: 125,
    status: 'pending',
    submitter: '张老师',
    submitTime: '2025-06-01 09:30',
    reviewTime: '',
    reviewComment: '',
    currentStageLevel: 1,
    stages: [
      { level: 1, role: 'Programme Office', status: 'pending' },
      { level: 2, role: 'Academic Affairs', status: 'waiting' },
      { level: 3, role: 'Senate', status: 'waiting' }
    ]
  },
  {
    id: 'ca-acc-24-progress',
    versionId: 24,
    programmeKey: 'accounting',
    name: 'Course Structure of Accounting (202509 Version)',
    version: '202509',
    startIntake: '202509',
    totalCredits: 128,
    status: 'pending',
    submitter: '王老师',
    submitTime: '2025-05-28 14:10',
    reviewTime: '',
    reviewComment: '',
    currentStageLevel: 2,
    stages: [
      { level: 1, role: 'Programme Office', status: 'approved', reviewer: '李主任', time: '2025-05-28 16:00', comment: '结构完整' },
      { level: 2, role: 'Academic Affairs', status: 'pending' },
      { level: 3, role: 'Senate', status: 'waiting' }
    ]
  },
  {
    id: 'ca-chs-5-history',
    versionId: 5,
    programmeKey: 'chinese',
    name: 'Course Structure of Chinese Studies (202509 Version)',
    version: '202509',
    startIntake: '202509',
    totalCredits: 120,
    status: 'approved',
    submitter: '陈老师',
    submitTime: '2025-04-20 10:00',
    reviewTime: '2025-04-25 09:00',
    reviewComment: 'Approved',
    currentStageLevel: 3,
    stages: [
      { level: 1, role: 'Programme Office', status: 'approved', reviewer: '李主任', time: '2025-04-20 15:00', comment: '' },
      { level: 2, role: 'Academic Affairs', status: 'approved', reviewer: '王处长', time: '2025-04-22 11:00', comment: 'OK' },
      { level: 3, role: 'Senate', status: 'approved', reviewer: 'Senate Sec', time: '2025-04-25 09:00', comment: 'Approved' }
    ]
  }
];
const CHANGE_CONTENT_STORE = {};
let currentChangeApplication = null;
let pendingSubmitChangeId = null;
let changeReviewActiveTab = 'pending';
let pendingChangeReviewId = null;
let selectedChangeReviewIds = new Set();
let batchChangeReviewIds = [];

let currentEditVersion = null;
let versionEditReadonly = false;
let versionEditReturnPage = 'version-list';
/** 各版本独立的分类树 / 课程 / 选修矩阵数据 */
const VERSION_CONTENT_STORE = {};

function isVersionEditReadonly() {
  return versionEditReadonly;
}

function applyVersionEditReadonly(readonly) {
  versionEditReadonly = readonly;
  const page = document.getElementById('page-version-edit');
  if (page) page.classList.toggle('version-readonly', readonly);
  const banner = document.getElementById('version-readonly-banner');
  if (banner) banner.style.display = readonly ? 'block' : 'none';
  const btnSave = document.getElementById('btn-save');
  const btnSubmit = document.getElementById('btn-submit');
  if (btnSave) btnSave.style.display = readonly ? 'none' : '';
  if (btnSubmit) btnSubmit.style.display = readonly ? 'none' : '';
}

function getVersionReadonlyStatusLabel(status) {
  const map = {
    approved: 'Approved（只读）',
    pending: 'In Progress（只读）',
    draft: 'Draft（只读）',
    rejected: 'Rejected（只读）'
  };
  return map[status] || '只读';
}

function statusLabel(s) {
  return { draft: 'Draft', pending: 'In Progress', approved: 'Approved', rejected: 'Rejected' }[s] || s;
}

function statusClass(s) {
  return {
    draft: 'draft-solid',
    pending: 'in-progress',
    approved: 'approved-solid',
    rejected: 'rejected'
  }[s] || 'draft-solid';
}

function getVersionsByProgramme(programmeKey) {
  return VERSIONS
    .filter(v => v.programmeKey === programmeKey)
    .sort((a, b) => a.startIntake.localeCompare(b.startIntake));
}

/** 按开始批次排序后，仅根据已审批通过的下一版回填截止批次 */
function syncVersionEndIntakes(programmeKey) {
  const list = getVersionsByProgramme(programmeKey);
  const approved = list.filter(v => v.status === 'approved');

  list.forEach(v => {
    if (v.status !== 'approved') v.endIntake = '';
  });

  approved.forEach((v, i) => {
    const nextApproved = approved[i + 1];
    v.endIntake = nextApproved
      ? getPreviousVersionEndIntake(nextApproved.startIntake)
      : '';
  });
}

function syncAllVersionEndIntakes() {
  Object.keys(PROGRAMMES).forEach(syncVersionEndIntakes);
}

function isVersionChainValid(programmeKey) {
  const approved = getVersionsByProgramme(programmeKey).filter(v => v.status === 'approved');
  for (let i = 0; i < approved.length - 1; i++) {
    const cur = approved[i];
    const next = approved[i + 1];
    const expectedEnd = getPreviousVersionEndIntake(next.startIntake);
    if (cur.endIntake !== expectedEnd) return false;
    if (cur.endIntake >= next.startIntake) return false;
    if (getNextIntake(cur.endIntake) !== next.startIntake) return false;
  }
  return true;
}

function versionCoversIntake(version, intake) {
  if (intake < version.startIntake) return false;
  if (version.endIntake && intake > version.endIntake) return false;
  return true;
}

function getCurrentVersion(programmeKey) {
  const approved = getVersionsByProgramme(programmeKey).filter(v => v.status === 'approved');
  return approved.filter(v => !v.endIntake).sort((a, b) => b.startIntake.localeCompare(a.startIntake))[0]
    || approved[approved.length - 1]
    || null;
}

function isCurrentEffectiveVersion(v) {
  if (v.status !== 'approved' || v.endIntake) return false;
  const current = getCurrentVersion(v.programmeKey);
  return current?.id === v.id;
}

function finalizeProgrammeVersionApproval(versionId) {
  const v = findVersionById(versionId);
  if (!v || v.status === 'approved') return;
  v.status = 'approved';
  syncVersionEndIntakes(v.programmeKey);
  filterVersions();
}

function matchVersionByIntake(programmeKey, intake, { approvedOnly = false } = {}) {
  return getVersionsByProgramme(programmeKey).find(v => {
    if (approvedOnly && v.status !== 'approved') return false;
    return versionCoversIntake(v, intake);
  });
}

function resolveExecVersionMatch(programmeKey, intake) {
  if (!intake) return { ok: false, reason: 'empty' };
  const matched = matchVersionByIntake(programmeKey, intake);
  if (!matched) return { ok: false, reason: 'no-match' };
  if (matched.status !== 'approved') {
    return { ok: false, reason: 'not-approved', version: matched };
  }
  return { ok: true, version: matched };
}

function isVersionReferencableByExecPlan(v) {
  return v?.status === 'approved';
}

function formatVersionRange(v) {
  if (!v.endIntake) return `${formatIntakeDisplay(v.startIntake)} ~ 至今`;
  return `${formatIntakeDisplay(v.startIntake)} ~ ${formatIntakeDisplay(v.endIntake)}`;
}

function getExecPlansByVersionId(versionId) {
  return EXEC_PLANS.filter(ep => ep.versionId === versionId);
}

function formatProgrammeIntakeCode(programmeKey, intake) {
  const programme = PROGRAMMES[programmeKey];
  if (!programme || !intake) return '—';
  return `${programme.code}-${formatIntakeDisplay(intake)}`;
}

/**
 * 将执行计划结构学期（Y1S1…）按入学批次映射为实际开课学年学期（如 2025/02）。
 * Y{n} 为培养方案学年（非自然年）；Y1S1～Y1S3 均属第一学年，如 04 起版：Y1S1=Y1/04，Y1S2=Y1/09，Y1S3=Y1/02。
 */
function getIntakeTypeIndex(intakeCode) {
  const parsedIntake = parseIntake(normalizeIntakeCode(intakeCode));
  if (!parsedIntake) return -1;
  return INTAKE_TYPES.indexOf(parsedIntake.type);
}

function getActualOfferingSemester(structuralCode, intakeCode) {
  if (!structuralCode || !intakeCode) return null;
  const parsed = parseSemesterCode(structuralCode);
  const parsedIntake = parseIntake(normalizeIntakeCode(intakeCode));
  if (!parsed || !parsedIntake) return null;
  const startTypeIdx = getIntakeTypeIndex(intakeCode);
  if (startTypeIdx < 0) return null;
  const semIndex = (parsed.year - 1) * INTAKE_TYPES.length + (parsed.sem - 1);
  const typeIdx = (startTypeIdx + semIndex) % INTAKE_TYPES.length;
  const yearDelta = Math.floor((startTypeIdx + semIndex) / INTAKE_TYPES.length);
  return formatIntakeDisplay(formatIntake(parsedIntake.year + yearDelta, INTAKE_TYPES[typeIdx]));
}

/**
 * 版本内 Y{n}S{s} → 执行计划 Y{n}S{s'}（同一年级，按起始批次类型旋转槽位）
 * 例：版本 2023/02（S1=02,S2=04,S3=09），批次 2029/09（S1=09,S2=02,S3=04）
 *     版本 Y1S3 课程 → 执行 Y1S1
 */
function getExecStructuralFromVersion(versionStructural, versionStartIntake, execIntake) {
  const parsed = parseSemesterCode(versionStructural);
  if (!parsed) return null;
  const vIdx = getIntakeTypeIndex(versionStartIntake);
  const eIdx = getIntakeTypeIndex(execIntake);
  if (vIdx < 0 || eIdx < 0) return null;
  const execSlot = ((vIdx + parsed.sem - 1 - eIdx + INTAKE_TYPES.length * 100) % INTAKE_TYPES.length) + 1;
  return `Y${parsed.year}S${execSlot}`;
}

function syncProgramCourseActualSemester(pc, intakeCode) {
  if (!pc) return;
  if (!pc.semester || !intakeCode) {
    delete pc.actualSemester;
    return;
  }
  pc.actualSemester = getActualOfferingSemester(pc.semester, intakeCode);
}

/** 执行计划结构学期对应的学年/学期槽位标签，如 Y1S1 + 2029/04 → Y1/04 */
function formatStructuralSemesterSlot(structuralCode, intakeCode) {
  const parsed = parseSemesterCode(structuralCode);
  const startTypeIdx = getIntakeTypeIndex(intakeCode);
  if (!parsed || startTypeIdx < 0) return null;
  const typeIdx = (startTypeIdx + parsed.sem - 1) % INTAKE_TYPES.length;
  return `Y${parsed.year}/${INTAKE_TYPES[typeIdx]}`;
}

function remapElectiveSemesterRequirements(requirements, versionStartIntake, execIntake) {
  if (!requirements) return {};
  const normVersion = normalizeIntakeCode(versionStartIntake);
  const normExec = normalizeIntakeCode(execIntake);
  if (normVersion === normExec) return cloneJson(requirements);
  const remapped = {};
  Object.entries(requirements).forEach(([l2Id, semReqs]) => {
    const next = {};
    Object.entries(semReqs || {}).forEach(([versionSem, req]) => {
      const execSem = getExecStructuralFromVersion(versionSem, normVersion, normExec);
      if (execSem) next[execSem] = cloneJson(req);
    });
    if (Object.keys(next).length) remapped[l2Id] = next;
  });
  return remapped;
}

const EXEC_SEMESTER_REMAP_VERSION = 3;

/** 按版本起始批次 → 执行批次槽位旋转，重算执行计划全部学期字段 */
function remapExecPlanContent(content, versionStartIntake, execIntake, versionId) {
  if (!content || !versionStartIntake || !execIntake) return content;
  const normVersion = normalizeIntakeCode(versionStartIntake);
  const normExec = normalizeIntakeCode(execIntake);
  const versionSnapshot = versionId != null ? getVersionContentSnapshot(versionId) : null;
  const versionCourseById = new Map((versionSnapshot?.programCourses || []).map(pc => [pc.id, pc]));

  (content.programCourses || []).forEach(pc => {
    if (!pc.semester) return;
    const orig = versionCourseById.get(pc.id);
    if (orig?.semester) {
      pc.versionSemester = orig.semester;
      if (normVersion === normExec) {
        pc.semester = pc.versionSemester;
      } else {
        pc.semester = getExecStructuralFromVersion(pc.versionSemester, normVersion, normExec) || pc.versionSemester;
      }
    } else if (!pc.versionSemester) {
      // 执行计划内新增课程：学期已是本批次视角，仅同步实际学期
    } else if (normVersion !== normExec) {
      pc.semester = getExecStructuralFromVersion(pc.versionSemester, normVersion, normExec) || pc.semester;
    }
    syncProgramCourseActualSemester(pc, normExec);
  });

  if (versionSnapshot?.electiveSemesterRequirements) {
    content.electiveSemesterRequirements = remapElectiveSemesterRequirements(
      versionSnapshot.electiveSemesterRequirements,
      versionStartIntake,
      execIntake
    );
  }

  content._semesterRemapVersion = EXEC_SEMESTER_REMAP_VERSION;
  return content;
}

function syncExecPlanContentSemesters(content, execIntake) {
  (content?.programCourses || []).forEach(pc => syncProgramCourseActualSemester(pc, execIntake));
}

function isExecPlanEditMode() {
  return Boolean(currentExecPlan);
}

function finalizeProgramCourseForContext(pc) {
  if (currentExecPlan) syncProgramCourseActualSemester(pc, currentExecPlan.intake);
  else delete pc.actualSemester;
  return pc;
}

function findExecPlanById(id) {
  return EXEC_PLANS.find(ep => ep.id === Number(id));
}

function renderExecLockStatus(isLocked) {
  return isLocked
    ? '<span class="exec-status exec-status-lock-yes">是</span>'
    : '<span class="exec-status exec-status-lock-no">否</span>';
}

function renderExecOfferingStatusLabel(isOffering) {
  return isOffering
    ? '<span class="exec-status exec-status-offering-yes">已开课</span>'
    : '<span class="exec-status exec-status-offering-no">未开课</span>';
}

function canEditExecPlan(ep) {
  return ep && !ep.isLocked && !ep.isOffering;
}

function canDeleteExecPlan(ep) {
  return ep && !ep.isLocked && !ep.isOffering;
}

function updateExecSelection() {
  selectedExecPlanIds = new Set(
    Array.from(document.querySelectorAll('.exec-row-check:checked')).map(el => Number(el.value))
  );
  const btnLock = document.getElementById('btn-exec-lock');
  const btnUnlock = document.getElementById('btn-exec-unlock');
  const btnDelete = document.getElementById('btn-exec-delete');
  const hasSelection = selectedExecPlanIds.size > 0;
  if (btnLock) btnLock.disabled = !hasSelection;
  if (btnUnlock) btnUnlock.disabled = !hasSelection;
  if (btnDelete) btnDelete.disabled = !hasSelection;
  const checkAll = document.getElementById('exec-check-all');
  const selectable = document.querySelectorAll('.exec-row-check');
  if (checkAll && selectable.length) {
    checkAll.checked = selectable.length > 0 && selectedExecPlanIds.size === selectable.length;
    checkAll.indeterminate = selectedExecPlanIds.size > 0 && selectedExecPlanIds.size < selectable.length;
  }
}

function toggleExecCheckAll(checked) {
  document.querySelectorAll('.exec-row-check').forEach(el => { el.checked = checked; });
  updateExecSelection();
}

function syncExecSelectionFromDom() {
  selectedExecPlanIds = new Set(
    Array.from(document.querySelectorAll('.exec-row-check:checked')).map(el => Number(el.value))
  );
}

function getSelectedExecPlans() {
  syncExecSelectionFromDom();
  return Array.from(selectedExecPlanIds).map(id => findExecPlanById(id)).filter(Boolean);
}

function showExecNotice(title, message) {
  const titleEl = document.getElementById('exec-notice-title');
  const msgEl = document.getElementById('exec-notice-msg');
  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;
  openModal('modal-exec-notice');
}

function requestLockSelectedExecPlans() {
  syncExecSelectionFromDom();
  const selected = getSelectedExecPlans();
  if (!selected.length) {
    alert('请至少勾选一条执行计划');
    return;
  }
  const lockable = selected.filter(ep => !ep.isLocked && !ep.isOffering);
  if (!lockable.length) {
    if (selected.some(ep => ep.isOffering)) {
      alert('所选执行计划已开课，无法提交。');
    } else {
      alert('所选执行计划均已提交，无需重复提交。');
    }
    return;
  }
  const msg = document.getElementById('exec-lock-msg');
  const hint = document.getElementById('exec-lock-hint');
  if (msg) {
    msg.innerHTML = `确定提交 <strong>${lockable.length}</strong> 条执行计划吗？`;
  }
  if (hint) {
    hint.textContent = lockable.map(ep => formatProgrammeIntakeCode(ep.programmeKey, ep.intake)).join('；')
      + '。提交后不可编辑，提交后方可进行开课。';
  }
  openModal('modal-exec-lock');
}

function cancelExecLockConfirm() {
  closeModal('modal-exec-lock');
}

function confirmLockSelectedExecPlans() {
  closeModal('modal-exec-lock');
  const selected = getSelectedExecPlans();
  let locked = 0;
  selected.forEach(ep => {
    if (ep.isLocked || ep.isOffering) return;
    ep.isLocked = true;
    locked += 1;
  });
  selectedExecPlanIds.clear();
  renderExecList();
  rebuildExecListIntakeFilterOptions();
  if (locked) {
    alert(`已提交 ${locked} 条执行计划。提交后方可进行开课。`);
  }
}

function requestUnlockSelectedExecPlans() {
  syncExecSelectionFromDom();
  const selected = getSelectedExecPlans();
  if (!selected.length) {
    showExecNotice('提示', '请至少勾选一条执行计划');
    return;
  }
  const offeringPlans = selected.filter(ep => ep.isOffering);
  if (offeringPlans.length) {
    const names = offeringPlans.map(ep => formatProgrammeIntakeCode(ep.programmeKey, ep.intake)).join('、');
    showExecNotice(
      '无法撤回',
      offeringPlans.length === selected.length
        ? '当前计划已开课，无法撤回，需先删除开课任务'
        : `所选计划中 ${names} 已开课，无法撤回，需先删除开课任务。请取消勾选已开课计划后再试。`
    );
    return;
  }
  const unlockable = selected.filter(ep => ep.isLocked);
  if (!unlockable.length) {
    alert('所选执行计划尚未提交，无需撤回。');
    return;
  }
  const msg = document.getElementById('exec-unlock-msg');
  const hint = document.getElementById('exec-unlock-hint');
  if (msg) {
    msg.innerHTML = `确定撤回 <strong>${unlockable.length}</strong> 条执行计划吗？`;
  }
  if (hint) {
    hint.textContent = unlockable.map(ep => formatProgrammeIntakeCode(ep.programmeKey, ep.intake)).join('；')
      + '。撤回后可重新编辑执行计划。';
  }
  openModal('modal-exec-unlock');
}

function cancelExecUnlockConfirm() {
  closeModal('modal-exec-unlock');
}

function confirmUnlockSelectedExecPlans() {
  closeModal('modal-exec-unlock');
  syncExecSelectionFromDom();
  const selected = getSelectedExecPlans();
  if (selected.some(ep => ep.isOffering)) {
    showExecNotice('无法撤回', '当前计划已开课，无法撤回，需先删除开课任务');
    return;
  }
  let unlocked = 0;
  selected.forEach(ep => {
    if (!ep.isLocked || ep.isOffering) return;
    ep.isLocked = false;
    unlocked += 1;
  });
  selectedExecPlanIds.clear();
  rebuildExecListIntakeFilterOptions();
  renderExecList();
  if (unlocked) {
    alert(`已撤回 ${unlocked} 条执行计划。`);
  }
}

function requestDeleteSelectedExecPlans() {
  syncExecSelectionFromDom();
  const selected = getSelectedExecPlans();
  if (!selected.length) {
    alert('请至少勾选一条执行计划');
    return;
  }
  const deletable = selected.filter(canDeleteExecPlan);
  if (!deletable.length) {
    if (selected.some(ep => ep.isOffering)) {
      showExecNotice('无法删除', '已开课的执行计划不可删除，需先删除开课任务。');
    } else if (selected.some(ep => ep.isLocked)) {
      alert('已提交的执行计划不可删除，请先撤回后再删除。');
    }
    return;
  }
  if (deletable.length < selected.length) {
    const blocked = selected.filter(ep => !canDeleteExecPlan(ep));
    const names = blocked.map(ep => formatProgrammeIntakeCode(ep.programmeKey, ep.intake)).join('、');
    showExecNotice(
      '部分计划不可删除',
      `${names} 已提交或已开课，无法删除。请取消勾选后再试，或仅删除未提交且未开课的计划。`
    );
    return;
  }
  const msg = document.getElementById('exec-delete-msg');
  const hint = document.getElementById('exec-delete-hint');
  if (msg) {
    msg.innerHTML = `确定删除 <strong>${deletable.length}</strong> 条执行计划吗？此操作不可撤销。`;
  }
  if (hint) {
    hint.textContent = deletable.map(ep => formatProgrammeIntakeCode(ep.programmeKey, ep.intake)).join('；')
      + '。仅未提交且未开课的执行计划可删除。';
  }
  openModal('modal-exec-delete');
}

function cancelExecDeleteConfirm() {
  closeModal('modal-exec-delete');
}

function confirmDeleteSelectedExecPlans() {
  closeModal('modal-exec-delete');
  syncExecSelectionFromDom();
  const selected = getSelectedExecPlans();
  const deletableIds = new Set(
    selected.filter(canDeleteExecPlan).map(ep => ep.id)
  );
  if (!deletableIds.size) return;

  for (let i = EXEC_PLANS.length - 1; i >= 0; i -= 1) {
    if (deletableIds.has(EXEC_PLANS[i].id)) {
      delete EXEC_CONTENT_STORE[EXEC_PLANS[i].id];
      EXEC_PLANS.splice(i, 1);
    }
  }
  if (currentExecPlan && deletableIds.has(currentExecPlan.id)) {
    currentExecPlan = null;
  }
  selectedExecPlanIds.clear();
  rebuildExecListIntakeFilterOptions();
  renderExecList();
  alert(`已删除 ${deletableIds.size} 条执行计划。`);
}

function renderExecPlanActions(ep) {
  const actions = [`<a href="#" onclick="goExecEdit(${ep.id}, false);return false">查看</a>`];
  if (canEditExecPlan(ep)) {
    actions.push(`<a href="#" onclick="goExecEdit(${ep.id}, true);return false">编辑</a>`);
  }
  return actions.join('');
}

function renderExecPlanRow(ep) {
  const programme = PROGRAMMES[ep.programmeKey];
  return `<tr>
    <td class="col-check"><input type="checkbox" class="exec-row-check" value="${ep.id}" onchange="updateExecSelection()"></td>
    <td class="col-center">${escapeHtml(programme?.code || '—')}</td>
    <td>${escapeHtml(programme?.name || '—')}</td>
    <td>${escapeHtml(formatProgrammeIntakeCode(ep.programmeKey, ep.intake))}</td>
    <td>${escapeHtml(programme?.school || '—')}</td>
    <td>${formatIntakeDisplay(ep.intake)}</td>
    <td class="col-center">${getExecPlanTotalCredits(ep)}</td>
    <td class="col-center">${renderExecOfferingStatusLabel(!!ep.isOffering)}</td>
    <td class="col-center">${renderExecLockStatus(!!ep.isLocked)}</td>
    <td class="actions">${renderExecPlanActions(ep)}</td>
  </tr>`;
}

function getFilteredExecPlans() {
  const programmeKey = document.getElementById('filter-exec-programme')?.value || '';
  const intakeFilter = document.getElementById('filter-exec-intake')?.value || '';
  const offering = document.getElementById('filter-exec-offering')?.value || '';
  const submitted = document.getElementById('filter-exec-submitted')?.value || '';
  return EXEC_PLANS.filter(ep => {
    if (programmeKey && ep.programmeKey !== programmeKey) return false;
    if (intakeFilter && ep.intake !== intakeFilter) return false;
    if (offering === 'yes' && !ep.isOffering) return false;
    if (offering === 'no' && ep.isOffering) return false;
    if (submitted === 'yes' && !ep.isLocked) return false;
    if (submitted === 'no' && ep.isLocked) return false;
    return true;
  });
}

function rebuildExecListIntakeFilterOptions() {
  const sel = document.getElementById('filter-exec-intake');
  if (!sel) return;
  const cur = sel.value;
  const intakes = [...new Set(EXEC_PLANS.map(ep => ep.intake))].sort();
  sel.innerHTML = '<option value="">全部入学批次</option>' +
    intakes.map(code => `<option value="${code}">${formatIntakeDisplay(code)}</option>`).join('');
  if (cur && intakes.includes(cur)) sel.value = cur;
}

function filterExecList() {
  renderExecList();
}

function renderExecList() {
  const tbody = document.getElementById('exec-list-tbody');
  if (!tbody) return;
  const list = getFilteredExecPlans();
  tbody.innerHTML = list.length
    ? list.map(renderExecPlanRow).join('')
    : '<tr><td colspan="10" class="text-muted" style="text-align:center;padding:24px">暂无匹配的执行计划</td></tr>';
  selectedExecPlanIds.clear();
  const checkAll = document.getElementById('exec-check-all');
  if (checkAll) {
    checkAll.checked = false;
    checkAll.indeterminate = false;
  }
  updateExecSelection();
}

function renderVersionRefCell(v) {
  const count = isVersionReferencableByExecPlan(v) ? getExecPlansByVersionId(v.id).length : 0;
  const title = isVersionReferencableByExecPlan(v)
    ? ''
    : ' title="版本尚未审批通过，不可被批次执行计划引用"';
  return `<td class="col-ref col-center"><a href="#" class="ref-count-link${count ? '' : ' ref-count-zero'}"${title} onclick="openVersionRefModal(${v.id});return false">${count}</a></td>`;
}

function openVersionRefModal(versionId) {
  const v = findVersionById(versionId);
  if (!v) return;
  const refs = getExecPlansByVersionId(versionId);
  const programme = PROGRAMMES[v.programmeKey];
  const title = document.getElementById('version-ref-title');
  const summary = document.getElementById('version-ref-summary');
  const tbody = document.getElementById('version-ref-tbody');
  if (title) title.textContent = '版本引用情况';
  if (summary) {
    const refNote = isVersionReferencableByExecPlan(v)
      ? `共 ${refs.length} 个批次执行计划引用`
      : '该版本尚未审批通过，不可被批次执行计划引用';
    summary.textContent = `${programme.name} ${programme.nameZh} · 版本 ${formatIntakeDisplay(v.version)} · ${refNote}`;
  }
  if (tbody) {
    if (!isVersionReferencableByExecPlan(v)) {
      tbody.innerHTML = `<tr><td colspan="4" class="matrix-empty">版本状态为「${statusLabel(v.status)}」，审批通过后方可被批次执行计划引用</td></tr>`;
    } else if (!refs.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="matrix-empty">暂无引用该版本的批次执行计划</td></tr>';
    } else {
      tbody.innerHTML = refs.map(ep => {
        const m = PROGRAMMES[ep.programmeKey];
        const st = ep.status === 'published' ? 'approved' : 'draft';
        const stLabel = ep.status === 'published' ? '已发布' : '草稿';
        return `<tr>
          <td><strong>${escapeHtml(ep.planCode)}</strong></td>
          <td>${escapeHtml(m.name)} ${escapeHtml(m.nameZh)}</td>
          <td><code>${formatIntakeDisplay(ep.intake)}</code></td>
          <td><span class="status ${st}">${stLabel}</span></td>
        </tr>`;
      }).join('');
    }
  }
  openModal('modal-version-refs');
}

function canSubmitVersion(v) {
  return v && (v.status === 'draft' || v.status === 'rejected') && !v.disabled;
}

function renderVersionRow(v, { showActions = true, showCheckbox = false } = {}) {
  const programme = PROGRAMMES[v.programmeKey];
  const canEdit = v.status === 'draft' || v.status === 'rejected';

  let actions = '';
  if (showActions) {
    if (canEdit && !v.disabled) {
      actions = `<a href="#" onclick="goEditVersion(${v.id});return false">编辑</a>
        <a href="#" onclick="requestSubmitVersion(${v.id});return false">提交</a>`;
    } else if (v.status === 'pending') {
      actions = `<a href="#" onclick="goPage('approval-list');return false">查看</a>`;
    } else {
      actions = `<a href="#" onclick="goEditVersion(${v.id}, true);return false">查看</a>`;
    }
    if (canEdit) actions += `<a href="#" class="danger" onclick="requestDeleteVersion(${v.id});return false">删除</a>`;
  } else {
    actions = `<a href="#" onclick="goEditVersion(${v.id}, true);return false">查看详情</a>`;
  }

  const checkCell = showCheckbox
    ? `<td class="col-check"><input type="checkbox" class="version-row-check" value="${v.id}" onchange="updateVersionSelection()"></td>`
    : '';

  return `<tr data-programme="${v.programmeKey}" data-version="${v.version}" class="${isCurrentEffectiveVersion(v) ? 'row-current' : ''}">
    ${checkCell}
    <td class="col-name"><a href="#" class="link-name" onclick="goEditVersion(${v.id}, ${!canEdit});return false">${v.name}</a></td>
    <td class="col-center"><span class="status ${statusClass(v.status)}">${statusLabel(v.status)}</span></td>
    <td class="col-center"><code>${programme.code}</code></td>
    <td class="col-center">${v.duration}</td>
    <td class="col-center"><code>${formatIntakeDisplay(v.version)}</code></td>
    <td class="col-center"><code class="batch-code batch-start">${formatIntakeDisplay(v.startIntake)}</code></td>
    <td class="col-center">${v.endIntake ? `<code class="batch-code batch-end">${formatIntakeDisplay(v.endIntake)}</code>` : '<span class="text-muted">—</span>'}</td>
    <td class="col-center">${v.degree}</td>
    ${renderVersionRefCell(v)}
    <td class="actions">${actions}</td>
  </tr>`;
}

let pendingSubmitVersionId = null;
let pendingBatchSubmitVersionIds = [];
let pendingDeleteVersionId = null;
let selectedVersionIds = new Set();

function findVersionById(id) {
  return VERSIONS.find(v => v.id === id);
}

function runWithVersionContent(versionId, fn) {
  saveCurrentEditContent();
  const backup = {
    classificationTree: cloneJson(CLASSIFICATION_TREE),
    programCourses: cloneJson(PROGRAM_COURSES),
    electiveSemesterRequirements: cloneJson(ELECTIVE_SEMESTER_REQUIREMENTS)
  };
  loadVersionContent(versionId);
  const result = fn();
  applyVersionContent(backup);
  return result;
}

function canBatchSubmitSelectedVersions() {
  if (!selectedVersionIds.size) return false;
  return Array.from(selectedVersionIds).every(id => canSubmitVersion(findVersionById(id)));
}

function updateVersionSelection() {
  selectedVersionIds = new Set(
    Array.from(document.querySelectorAll('.version-row-check:checked')).map(el => Number(el.value))
  );
  const btn = document.getElementById('btn-batch-submit-version');
  if (btn) btn.disabled = !canBatchSubmitSelectedVersions();
  const btnExport = document.getElementById('btn-batch-export-version');
  if (btnExport) btnExport.disabled = selectedVersionIds.size === 0;
  const checkAll = document.getElementById('version-check-all');
  const selectable = document.querySelectorAll('.version-row-check');
  if (checkAll && selectable.length) {
    checkAll.checked = selectable.length > 0 && selectedVersionIds.size === selectable.length;
    checkAll.indeterminate = selectedVersionIds.size > 0 && selectedVersionIds.size < selectable.length;
  }
}

function toggleVersionCheckAll(checked) {
  document.querySelectorAll('.version-row-check').forEach(el => { el.checked = checked; });
  updateVersionSelection();
}

function openBatchExportVersion() {
  if (!selectedVersionIds.size) {
    alert('请先勾选要导出的培养方案版本');
    return;
  }
  const ids = Array.from(selectedVersionIds);
  const names = ids.map(id => findVersionById(id)?.name).filter(Boolean);
  alert(`版本导出（原型）：导出模板待定\n\n已选 ${ids.length} 个版本：\n${names.join('\n')}`);
}

function openBatchSubmitVersion() {
  if (!canBatchSubmitSelectedVersions()) {
    alert('所选版本中包含不可提交的记录（仅草稿或已驳回版本可提交审批）');
    return;
  }
  const ids = Array.from(selectedVersionIds);
  pendingBatchSubmitVersionIds = ids;
  const msg = document.getElementById('batch-submit-version-msg');
  const hint = document.getElementById('batch-submit-version-hint');
  if (msg) {
    msg.innerHTML = `确定提交 <strong>${ids.length}</strong> 个培养方案版本进行审批吗？`;
  }
  if (hint) {
    const names = ids.map(id => findVersionById(id)?.name).filter(Boolean);
    hint.textContent = names.join('；') + '。提交后将进入审批流程，待审批期间不可编辑。';
  }
  openModal('modal-batch-submit-version');
}

function cancelBatchSubmitVersion() {
  pendingBatchSubmitVersionIds = [];
  closeModal('modal-batch-submit-version');
}

function confirmBatchSubmitVersion() {
  const ids = [...pendingBatchSubmitVersionIds];
  pendingBatchSubmitVersionIds = [];
  closeModal('modal-batch-submit-version');
  if (!ids.length) return;

  const failed = [];
  let submitted = 0;
  ids.forEach(id => {
    const v = findVersionById(id);
    if (!canSubmitVersion(v)) return;
    const check = runWithVersionContent(id, () => validateCompulsoryMinCreditsForSubmit());
    if (!check.ok) {
      failed.push(`「${v.name}」：${check.message}`);
      return;
    }
    v.status = 'pending';
    submitted += 1;
  });

  selectedVersionIds.clear();
  filterVersions();

  if (failed.length && !submitted) {
    alert(`批量提交失败：\n${failed.join('\n\n')}`);
    return;
  }
  if (failed.length) {
    alert(`已提交 ${submitted} 个版本。\n以下版本未通过校验：\n${failed.join('\n\n')}`);
    return;
  }
  alert(`已提交 ${submitted} 个版本审批（原型）`);
}

function requestSubmitVersion(id) {
  const v = findVersionById(id);
  if (!v || (v.status !== 'draft' && v.status !== 'rejected') || v.disabled) return;
  pendingSubmitVersionId = id;
  const programme = PROGRAMMES[v.programmeKey];
  const msg = document.getElementById('submit-version-msg');
  const hint = document.getElementById('submit-version-hint');
  if (msg) {
    msg.innerHTML = `确定提交培养方案「<strong>${escapeHtml(v.name)}</strong>」进行审批吗？`;
  }
  if (hint) {
    hint.textContent = `${programme?.nameZh || ''} · 版本 ${formatIntakeDisplay(v.version)} · 开始批次 ${formatIntakeDisplay(v.startIntake)}。提交后将进入审批流程，待审批期间不可编辑。`;
  }
  openModal('modal-submit-version');
}

function cancelSubmitVersion() {
  pendingSubmitVersionId = null;
  closeModal('modal-submit-version');
}

function confirmSubmitVersion() {
  const v = findVersionById(pendingSubmitVersionId);
  if (!v) {
    pendingSubmitVersionId = null;
    closeModal('modal-submit-version');
    return;
  }
  const minCheck = runWithVersionContent(v.id, () => validateCompulsoryMinCreditsForSubmit());
  if (!minCheck.ok) {
    alert(minCheck.message);
    return;
  }
  pendingSubmitVersionId = null;
  closeModal('modal-submit-version');
  v.status = 'pending';
  filterVersions();
  alert('已提交审批（原型）');
}

function requestDeleteVersion(id) {
  const v = findVersionById(id);
  if (!v || (v.status !== 'draft' && v.status !== 'rejected')) return;
  pendingDeleteVersionId = id;
  const programme = PROGRAMMES[v.programmeKey];
  const msg = document.getElementById('delete-version-msg');
  const hint = document.getElementById('delete-version-hint');
  if (msg) {
    msg.innerHTML = `确定删除培养方案「<strong>${escapeHtml(v.name)}</strong>」吗？此操作不可撤销。`;
  }
  if (hint) {
    hint.textContent = `${programme?.nameZh || ''} · 版本 ${formatIntakeDisplay(v.version)} · 开始批次 ${formatIntakeDisplay(v.startIntake)}。`;
  }
  openModal('modal-delete-version');
}

function cancelDeleteVersion() {
  pendingDeleteVersionId = null;
  closeModal('modal-delete-version');
}

function confirmDeleteVersion() {
  const id = pendingDeleteVersionId;
  pendingDeleteVersionId = null;
  closeModal('modal-delete-version');
  const idx = VERSIONS.findIndex(v => v.id === id);
  if (idx >= 0) {
    VERSIONS.splice(idx, 1);
    delete VERSION_CONTENT_STORE[id];
    filterVersions();
  }
}

function filterVersions() {
  syncAllVersionEndIntakes();
  const programmeKey = document.getElementById('filter-programme')?.value || '';
  const status = document.getElementById('filter-status')?.value || '';
  let list = [...VERSIONS].sort((a, b) => {
    if (a.programmeKey !== b.programmeKey) return a.programmeKey.localeCompare(b.programmeKey);
    return a.startIntake.localeCompare(b.startIntake);
  });
  if (programmeKey) list = list.filter(v => v.programmeKey === programmeKey);
  if (status) list = list.filter(v => v.status === status);

  const tbody = document.getElementById('version-table-body');
  if (tbody) {
    tbody.innerHTML = list.map(v => renderVersionRow(v, { showCheckbox: true })).join('');
    document.getElementById('version-count').textContent = list.length;
    selectedVersionIds.clear();
    const checkAll = document.getElementById('version-check-all');
    if (checkAll) {
      checkAll.checked = false;
      checkAll.indeterminate = false;
    }
    updateVersionSelection();
  }

  const queryBody = document.getElementById('version-query-body');
  if (queryBody) {
    const queryProgrammeKey = document.getElementById('query-programme')?.value || '';
    let queryList = VERSIONS.filter(v => v.status === 'approved');
    if (queryProgrammeKey) queryList = queryList.filter(v => v.programmeKey === queryProgrammeKey);
    queryList.sort((a, b) => {
      if (a.programmeKey !== b.programmeKey) return a.programmeKey.localeCompare(b.programmeKey);
      return a.startIntake.localeCompare(b.startIntake);
    });
    queryBody.innerHTML = queryList.length
      ? queryList.map(v => renderVersionRow(v, { showActions: false })).join('')
      : '<tr><td colspan="10" class="text-muted" style="text-align:center;padding:24px">暂无匹配的已通过版本</td></tr>';
  }
}

// ── New version modal ──
function getMinimumNewStartIntake(programmeKey) {
  const list = getVersionsByProgramme(programmeKey);
  if (!list.length) return null;
  const latest = list[list.length - 1];
  const anchorBatch = latest.endIntake || latest.startIntake;
  return getNextIntake(anchorBatch);
}

function isValidNewVersionStartIntake(programmeKey, startIntake) {
  const min = getMinimumNewStartIntake(programmeKey);
  if (!min) return true;
  return startIntake >= min;
}

/** 新增版本可选的开始批次（不早于当前有效版本的下一批次） */
function getAllowedNewStartIntakes(programmeKey, yearsAhead = 3) {
  const min = getMinimumNewStartIntake(programmeKey);
  const startYear = min ? parseInt(min.slice(0, 4), 10) : new Date().getFullYear();
  const endYear = startYear + yearsAhead;
  const all = [];
  for (let y = startYear; y <= endYear; y++) {
    INTAKE_TYPES.forEach(t => all.push(formatIntake(y, t)));
  }
  if (!min) return all;
  return all.filter(b => b >= min);
}

function rebuildStartIntakeSelect(programmeKey) {
  const sel = document.getElementById('new-start-intake');
  const hintEl = document.getElementById('min-intake-hint');
  if (!sel) return;

  const current = getCurrentVersion(programmeKey);
  const min = getMinimumNewStartIntake(programmeKey);
  const allowed = getAllowedNewStartIntakes(programmeKey);
  const latest = getVersionsByProgramme(programmeKey).slice(-1)[0];

  sel.innerHTML = allowed.map(b =>
    `<option value="${b}">${formatIntakeDisplay(b)}</option>`
  ).join('');

  if (hintEl) {
    if (!latest) {
      hintEl.textContent = '暂无历史版本，可选择任意开始批次';
    } else if (latest.endIntake) {
      hintEl.textContent = `上一版本 ${formatIntakeDisplay(latest.version)} 截止批次 ${formatIntakeDisplay(latest.endIntake)}，新版本开始批次最早为 ${formatIntakeDisplay(min)}`;
    } else {
      hintEl.textContent = `当前有效版本 ${formatIntakeDisplay(current?.version || latest.version)}（${formatIntakeDisplay(latest.startIntake)} 起），新版本开始批次最早为 ${formatIntakeDisplay(min)}`;
    }
  }
}

function openNewVersionModal() {
  document.getElementById('new-programme').value = '';
  document.getElementById('new-duration').value = '';
  document.getElementById('new-degree').value = '';
  document.getElementById('cascade-preview').style.display = 'none';
  document.getElementById('new-programme-name').value = '';
  document.getElementById('new-version-code').value = '';
  document.getElementById('min-intake-hint').textContent = '';
  const batchSel = document.getElementById('new-start-intake');
  if (batchSel) batchSel.innerHTML = '';
  openModal('modal-new-version');
}

function onNewProgrammeChange() {
  const programmeKey = document.getElementById('new-programme').value;
  const durationEl = document.getElementById('new-duration');
  const degreeEl = document.getElementById('new-degree');
  if (!programmeKey) {
    document.getElementById('cascade-preview').style.display = 'none';
    document.getElementById('min-intake-hint').textContent = '';
    if (durationEl) durationEl.value = '';
    if (degreeEl) degreeEl.value = '';
    return;
  }
  const programme = PROGRAMMES[programmeKey];
  if (durationEl) durationEl.value = programme.duration;
  if (degreeEl) degreeEl.value = programme.degree;
  rebuildStartIntakeSelect(programmeKey);
  onStartIntakeChange();
}

function onStartIntakeChange() {
  const programmeKey = document.getElementById('new-programme').value;
  if (!programmeKey) return;

  const startIntake = document.getElementById('new-start-intake')?.value;
  if (!startIntake) return;

  const min = getMinimumNewStartIntake(programmeKey);
  if (min && startIntake < min) {
    rebuildStartIntakeSelect(programmeKey);
    return;
  }

  const prevEndBatch = getPreviousVersionEndIntake(startIntake);
  const programme = PROGRAMMES[programmeKey];
  const prev = getCurrentVersion(programmeKey);

  document.getElementById('new-version-code').value = formatIntakeDisplay(startIntake);
  document.getElementById('new-programme-name').value =
    `Course Structure of ${programme.name} (${formatIntakeDisplay(startIntake)} Version)`;

  document.getElementById('cascade-preview').style.display = 'block';
  document.getElementById('prev-version-label').textContent =
    prev ? `${formatIntakeDisplay(prev.version)} (${prev.name.split('(')[1]?.replace(')', '') || ''})` : '（无上一版本）';
  document.getElementById('prev-end-intake').textContent = prev ? formatIntakeDisplay(prevEndBatch) : '—';
  document.getElementById('curr-version-label').textContent = `${formatIntakeDisplay(startIntake)} Version`;
  document.getElementById('curr-start-intake').textContent = formatIntakeDisplay(startIntake);

  const hint = document.getElementById('intake-cascade-hint');
  if (hint) {
    hint.textContent = prevEndBatch
      ? `新版本审批通过后，上一版本截止批次将设为 ${formatIntakeDisplay(prevEndBatch)}（当前保持不变）；${formatIntakeDisplay(startIntake)} 起启用新版本`
      : '';
  }
}

function nextVersionId() {
  return VERSIONS.reduce((max, v) => Math.max(max, v.id), 0) + 1;
}

function confirmNewVersion() {
  const programmeKey = document.getElementById('new-programme').value;
  if (!programmeKey) { alert('请选择专业'); return; }
  const startIntake = document.getElementById('new-start-intake')?.value;
  if (!startIntake) { alert('请选择开始批次'); return; }
  const min = getMinimumNewStartIntake(programmeKey);
  const current = getCurrentVersion(programmeKey);
  const latest = getVersionsByProgramme(programmeKey).slice(-1)[0];
  if (min && startIntake < min) {
    const prevEnd = latest?.endIntake ? formatIntakeDisplay(latest.endIntake) : formatIntakeDisplay(getPreviousVersionEndIntake(min));
    alert(`新版本开始批次须晚于上一版本截止批次。最早可选 ${formatIntakeDisplay(min)}（上一版本截止 ${prevEnd}）`);
    return;
  }
  const programme = PROGRAMMES[programmeKey];
  const prev = current;
  const newId = nextVersionId();
  const newVersion = {
    id: newId,
    programmeKey,
    name: document.getElementById('new-programme-name').value,
    version: startIntake,
    startIntake,
    endIntake: '',
    duration: programme.duration,
    degree: programme.degree,
    disabled: false,
    locked: false,
    status: 'draft'
  };
  VERSIONS.push(newVersion);
  VERSION_CONTENT_STORE[newId] = getEmptyVersionContent();
  closeModal('modal-new-version');
  filterVersions();
  goEdit('draft', newVersion);
  const prevEnd = getPreviousVersionEndIntake(startIntake);
  alert(`已创建新版本 ${formatIntakeDisplay(startIntake)}（待审批通过后生效）\n上一版本 ${prev ? formatIntakeDisplay(prev.version) : '—'} 的截止批次将在新版本审批通过后设为 ${formatIntakeDisplay(prevEnd)}（当前保持不变）`);
}

// ── Exec plan version match ──
function getExistingExecPlanIntakeSet(programmeKey) {
  return new Set(
    EXEC_PLANS.filter(ep => ep.programmeKey === programmeKey).map(ep => ep.intake)
  );
}

function getAvailableExecIntakes(programmeKey) {
  const existing = getExistingExecPlanIntakeSet(programmeKey);
  const approved = getVersionsByProgramme(programmeKey).filter(v => v.status === 'approved');
  if (!approved.length) return [];

  const minStart = approved[0].startIntake;
  const openVersion = approved.find(v => !v.endIntake);
  const startYear = parseInt(minStart.slice(0, 4), 10);
  const endYear = openVersion
    ? startYear + 6
    : parseInt((approved[approved.length - 1].endIntake || approved[approved.length - 1].startIntake).slice(0, 4), 10) + 1;

  const batches = [];
  for (let y = startYear; y <= endYear; y += 1) {
    INTAKE_TYPES.forEach(t => {
      const batch = formatIntake(y, t);
      if (batch < minStart) return;
      if (existing.has(batch)) return;
      if (!resolveExecVersionMatch(programmeKey, batch).ok) return;
      batches.push(batch);
    });
  }
  return batches.sort();
}

function initExecProgrammeSelect() {
  const sel = document.getElementById('exec-programme');
  if (!sel) return;
  sel.innerHTML = Object.entries(PROGRAMMES).map(([key, programme]) =>
    `<option value="${key}">${escapeHtml(programme.name)} ${escapeHtml(programme.nameZh)}</option>`
  ).join('');
}

function rebuildExecIntakeSelect(programmeKey) {
  const sel = document.getElementById('exec-intake');
  const hintEl = document.getElementById('exec-intake-hint');
  if (!sel) return;

  const batches = getAvailableExecIntakes(programmeKey);
  if (!batches.length) {
    sel.innerHTML = '<option value="">暂无可选批次</option>';
    sel.disabled = true;
    if (hintEl) {
      hintEl.textContent = '该专业暂无可生成的入学批次（可能均已生成执行计划，或无可引用的已审批版本）';
    }
    return;
  }

  sel.disabled = false;
  sel.innerHTML = batches.map(batch =>
    `<option value="${batch}">${formatIntakeDisplay(batch)}</option>`
  ).join('');
  if (hintEl) {
    hintEl.textContent = `共 ${batches.length} 个可选批次，均为尚未生成执行计划的入学批次`;
  }
}

function onExecProgrammeChange() {
  const programmeKey = document.getElementById('exec-programme')?.value || 'finance';
  rebuildExecIntakeSelect(programmeKey);
  onExecIntakeInput();
}

function onExecIntakeInput() {
  const programmeKey = document.getElementById('exec-programme')?.value || 'finance';
  const intakeCode = normalizeIntakeCode(document.getElementById('exec-intake')?.value);
  const result = intakeCode ? resolveExecVersionMatch(programmeKey, intakeCode) : { ok: false, reason: 'empty' };
  const el = document.getElementById('exec-matched-version');
  const range = document.getElementById('exec-match-range');
  const hint = document.getElementById('exec-match-hint');
  const statusEl = document.getElementById('exec-match-status');
  const box = document.getElementById('exec-version-match');
  const submitBtn = document.getElementById('btn-gen-exec-submit');
  if (!el) return;

  box?.classList.remove('is-error', 'is-ok');

  if (result.ok) {
    const matched = result.version;
    el.textContent = formatIntakeDisplay(matched.version);
    if (range) range.textContent = `生效区间：${formatVersionRange(matched)}`;
    if (statusEl) {
      statusEl.className = 'status approved';
      statusEl.textContent = statusLabel('approved');
    }
    if (box) box.classList.add('is-ok');
    const nextStart = matched.endIntake ? getNextIntake(matched.endIntake) : null;
    if (hint) {
      hint.textContent = nextStart
        ? `入学批次 ${formatIntakeDisplay(intakeCode)} 匹配已审批版本 ${formatIntakeDisplay(matched.version)}；下一版本从 ${formatIntakeDisplay(nextStart)} 起`
        : `入学批次 ${formatIntakeDisplay(intakeCode)} 匹配已审批版本 ${formatIntakeDisplay(matched.version)}（${formatVersionRange(matched)}）`;
    }
    if (submitBtn) submitBtn.disabled = false;
    return;
  }

  if (submitBtn) submitBtn.disabled = true;

  if (result.reason === 'not-approved') {
    const v = result.version;
    el.textContent = formatIntakeDisplay(v.version);
    if (range) range.textContent = `生效区间：${formatVersionRange(v)}`;
    if (statusEl) {
      statusEl.className = `status ${statusClass(v.status)}`;
      statusEl.textContent = statusLabel(v.status);
    }
    if (box) box.classList.add('is-error');
    if (hint) {
      hint.textContent = `入学批次 ${formatIntakeDisplay(intakeCode)} 虽匹配版本 ${formatIntakeDisplay(v.version)}，但该版本为「${statusLabel(v.status)}」，尚未审批通过，无法生成批次执行计划。`;
    }
    return;
  }

  el.textContent = '未匹配';
  if (range) range.textContent = '请检查入学批次是否在已审批版本的有效区间内';
  if (statusEl) {
    statusEl.className = 'status draft';
    statusEl.textContent = '—';
  }
  if (hint) {
    hint.textContent = intakeCode
      ? `入学批次 ${formatIntakeDisplay(intakeCode)} 未落在任何已审批版本的生效区间内`
      : '请选择入学批次';
  }
}

function confirmGenerateExecPlan() {
  const programmeKey = document.getElementById('exec-programme')?.value || 'finance';
  const intakeCode = normalizeIntakeCode(document.getElementById('exec-intake')?.value);
  const result = resolveExecVersionMatch(programmeKey, intakeCode);
  if (!result.ok) {
    if (result.reason === 'not-approved') {
      alert(`培养方案版本 ${formatIntakeDisplay(result.version.version)} 尚未审批通过（${statusLabel(result.version.status)}），无法被批次执行计划引用。`);
    } else if (result.reason === 'no-match') {
      alert('未匹配到已审批通过的有效培养方案版本，请调整入学批次或等待版本审批完成。');
    } else {
      alert('请选择入学批次');
    }
    return;
  }
  closeModal('modal-gen-exec');
  let ep = EXEC_PLANS.find(p => p.programmeKey === programmeKey && p.intake === intakeCode);
  if (!ep) {
    ep = {
      id: Date.now(),
      planCode: `EP-${programmeKey}-${intakeCode}`,
      programmeKey,
      intake: intakeCode,
      versionId: result.version.id,
      status: 'draft',
      isLocked: false,
      isOffering: false
    };
    EXEC_PLANS.push(ep);
    ensureExecPlanContentStore(ep);
    rebuildExecListIntakeFilterOptions();
    renderExecList();
  } else {
    ensureExecPlanContentStore(ep);
  }
  goExecEdit(ep.id, true);
}

// ── Programme change applications (方案变更申请) ──
function nextChangeApplicationId() {
  return `ca-${Date.now()}`;
}

function findChangeApplication(id) {
  return CHANGE_APPLICATIONS.find(ca => ca.id === id);
}

function getChangeApplicationStatusLabel(status, readonly = false) {
  const map = {
    draft: readonly ? 'View Mode' : 'Draft',
    pending: 'In Progress',
    approved: 'Approved',
    rejected: 'Rejected'
  };
  return map[status] || status;
}

function changeApplicationStatusClass(status) {
  return status === 'approved' ? 'approved-solid'
    : status === 'rejected' ? 'rejected'
    : status === 'pending' ? 'in-progress'
    : 'draft';
}

function hasActiveChangeForVersion(versionId) {
  return CHANGE_APPLICATIONS.some(ca =>
    ca.versionId === versionId && (ca.status === 'draft' || ca.status === 'pending')
  );
}

function getApprovedVersionsForChangeApply(programmeKey) {
  if (!programmeKey) return [];
  return getVersionsByProgramme(programmeKey).filter(v => v.status === 'approved');
}

function openNewChangeApplyModal() {
  const programmeSel = document.getElementById('change-apply-programme');
  const versionSel = document.getElementById('change-apply-version');
  const hint = document.getElementById('change-apply-version-hint');
  const preview = document.getElementById('change-apply-preview');
  if (programmeSel) programmeSel.value = '';
  if (versionSel) {
    versionSel.innerHTML = '<option value="">请先选择专业</option>';
    versionSel.disabled = true;
  }
  if (hint) hint.textContent = '请先选择专业';
  if (preview) preview.style.display = 'none';
  openModal('modal-new-change-apply');
}

function onChangeApplyProgrammeChange() {
  rebuildChangeApplyVersionSelect();
  onChangeApplyVersionChange();
}

function rebuildChangeApplyVersionSelect() {
  const programmeKey = document.getElementById('change-apply-programme')?.value || '';
  const sel = document.getElementById('change-apply-version');
  const hint = document.getElementById('change-apply-version-hint');
  if (!sel) return;

  if (!programmeKey) {
    sel.innerHTML = '<option value="">请先选择专业</option>';
    sel.disabled = true;
    if (hint) hint.textContent = '请先选择专业';
    return;
  }

  const versions = getApprovedVersionsForChangeApply(programmeKey);
  if (!versions.length) {
    sel.innerHTML = '<option value="">暂无已审批版本</option>';
    sel.disabled = true;
    if (hint) hint.textContent = '该专业暂无已审批通过的培养方案版本';
    return;
  }

  sel.disabled = false;
  sel.innerHTML = versions.map(v => {
    const busy = hasActiveChangeForVersion(v.id);
    const execCount = getExecPlansByVersionId(v.id).length;
    const suffix = busy ? ' · 已有进行中变更' : (execCount ? ` · 已生成 ${execCount} 个执行计划` : ' · 尚无执行计划');
    return `<option value="${v.id}"${busy ? ' disabled' : ''}>${escapeHtml(v.name)}${escapeHtml(suffix)}</option>`;
  }).join('');
  if (hint) {
    hint.textContent = '仅可选择已审批通过的版本；已有草稿/进行中变更的版本不可重复申请';
  }
}

function onChangeApplyVersionChange() {
  const versionId = Number(document.getElementById('change-apply-version')?.value);
  const preview = document.getElementById('change-apply-preview');
  if (!versionId) {
    if (preview) preview.style.display = 'none';
    return;
  }
  const v = findVersionById(versionId);
  if (!v || !preview) return;

  const execPlans = getExecPlansByVersionId(v.id);
  const futureBatches = getAvailableExecIntakes(v.programmeKey).length;
  document.getElementById('change-preview-version-name').textContent = v.name;
  document.getElementById('change-preview-version-range').textContent = formatVersionRange(v);
  document.getElementById('change-preview-exec-count').textContent = execPlans.length
    ? `${execPlans.length} 个（${execPlans.map(ep => formatIntakeDisplay(ep.intake)).join('、')}）`
    : '无';
  document.getElementById('change-preview-future-hint').textContent = futureBatches
    ? `尚有 ${futureBatches} 个入学批次未生成执行计划；变更审批通过后，这些批次生成时将引用最新版本内容。`
    : '当前专业暂无可新生成的入学批次。';
  preview.style.display = 'block';
}

function confirmNewChangeApply() {
  const programmeKey = document.getElementById('change-apply-programme')?.value;
  const versionId = Number(document.getElementById('change-apply-version')?.value);
  if (!programmeKey) { alert('请选择专业'); return; }
  if (!versionId) { alert('请选择目标培养方案版本'); return; }
  const v = findVersionById(versionId);
  if (!v || v.status !== 'approved') {
    alert('只能选择已审批通过的培养方案版本');
    return;
  }
  if (hasActiveChangeForVersion(versionId)) {
    alert('该版本已有进行中的变更申请，请完成或撤回后再新建');
    return;
  }

  const change = {
    id: nextChangeApplicationId(),
    versionId: v.id,
    programmeKey: v.programmeKey,
    name: v.name,
    version: v.version,
    startIntake: v.startIntake,
    totalCredits: 130,
    status: 'draft',
    submitter: '当前用户',
    submitTime: '',
    reviewTime: '',
    reviewComment: ''
  };
  CHANGE_APPLICATIONS.unshift(change);
  CHANGE_CONTENT_STORE[change.id] = cloneJson(getVersionContentSnapshot(v.id));
  closeModal('modal-new-change-apply');
  renderChangeApplyList();
  goChangeEdit(change.id);
}

function renderChangeApplyList() {
  const tbody = document.getElementById('change-apply-list-body');
  const empty = document.getElementById('change-apply-list-empty');
  if (!tbody) return;

  const programmeFilter = document.getElementById('change-apply-filter-programme')?.value || '';
  const statusFilter = document.getElementById('change-apply-filter-status')?.value || '';
  const items = CHANGE_APPLICATIONS.filter(ca => {
    if (programmeFilter && ca.programmeKey !== programmeFilter) return false;
    if (statusFilter && ca.status !== statusFilter) return false;
    return true;
  });

  if (!items.length) {
    tbody.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  tbody.innerHTML = items.map(ca => {
    const programme = PROGRAMMES[ca.programmeKey];
    const actions = [];
    if (ca.status === 'draft' || ca.status === 'rejected') {
      actions.push(`<a href="#" onclick="goChangeEdit('${ca.id}');return false">编辑</a>`);
    } else {
      actions.push(`<a href="#" onclick="goChangeEdit('${ca.id}', true);return false">查看</a>`);
    }
    if (ca.status === 'draft') {
      actions.push(`<a href="#" onclick="requestSubmitChangeApplication('${ca.id}');return false">提交审批</a>`);
    }
    if (ca.status === 'draft' || ca.status === 'rejected') {
      actions.push(`<a href="#" onclick="deleteChangeApplication('${ca.id}');return false">删除</a>`);
    }
    return `<tr>
      <td><a href="#" class="link-name" onclick="goChangeEdit('${ca.id}', ${ca.status !== 'draft' && ca.status !== 'rejected'});return false">${escapeHtml(ca.name)}</a></td>
      <td>${escapeHtml(programme?.name || '—')}</td>
      <td class="col-center"><code>${formatIntakeDisplay(ca.version)}</code></td>
      <td class="col-center"><span class="status ${changeApplicationStatusClass(ca.status)}">${getChangeApplicationStatusLabel(ca.status)}</span></td>
      <td>${escapeHtml(ca.submitter || '—')}</td>
      <td>${escapeHtml(ca.submitTime || '—')}</td>
      <td class="actions">${actions.join('')}</td>
    </tr>`;
  }).join('');
}

function createChangeApprovalStages() {
  return [
    { level: 1, role: 'Programme Office', status: 'pending' },
    { level: 2, role: 'Academic Affairs', status: 'waiting' },
    { level: 3, role: 'Senate', status: 'waiting' }
  ];
}

function initChangeApprovalWorkflow(ca) {
  ca.currentStageLevel = 1;
  ca.stages = createChangeApprovalStages();
  ca.status = 'pending';
  ca.reviewTime = '';
  ca.reviewComment = '';
}

function getChangeReviewQueueItems() {
  return CHANGE_APPLICATIONS.filter(ca => ca.status !== 'draft');
}

function resolveChangeReviewBucket(ca) {
  if (ca.status === 'approved' || ca.status === 'rejected') return 'history';
  if (!ca.stages?.length) return 'pending';

  if (ca.stages.some(s => s.status === 'rejected' || s.status === 'update_required')) return 'history';
  if (ca.stages.every(s => s.status === 'approved')) return 'history';

  const current = ca.stages.find(s => s.level === ca.currentStageLevel);
  if (current?.status === 'pending') return 'pending';
  return 'in-progress';
}

function getChangeReviewTabs() {
  return [
    { id: 'pending', label: 'Pending' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'history', label: 'History' }
  ];
}

function getChangeReviewOverallStatus(ca) {
  if (ca.status === 'approved') return { label: 'Approved', cls: 'approved-solid' };
  if (ca.status === 'rejected') {
    const updateRequired = ca.stages?.some(s => s.status === 'update_required');
    return updateRequired
      ? { label: 'Update Required', cls: 'pending' }
      : { label: 'Rejected', cls: 'rejected' };
  }
  if (ca.stages?.some(s => s.status === 'update_required')) {
    return { label: 'Update Required', cls: 'pending' };
  }
  return { label: 'In Progress', cls: 'in-progress' };
}

function getChangeReviewStageDisplay(ca) {
  if (ca.status === 'approved') {
    const last = ca.stages?.[ca.stages.length - 1];
    return last?.role || 'Approved';
  }
  if (ca.status === 'rejected') {
    const updateRequired = ca.stages?.find(s => s.status === 'update_required');
    if (updateRequired) return updateRequired.role;
    const rejected = ca.stages?.find(s => s.status === 'rejected');
    return rejected?.role || 'Rejected';
  }
  const current = ca.stages?.find(s => s.level === ca.currentStageLevel);
  return current?.role || '—';
}

function canReviewChangeItem(ca, tab) {
  return tab === 'pending' && resolveChangeReviewBucket(ca) === 'pending';
}

function renderChangeReviewTabs() {
  const bar = document.getElementById('change-review-tab-bar');
  if (!bar) return;
  const tabs = getChangeReviewTabs();
  if (!tabs.some(t => t.id === changeReviewActiveTab)) changeReviewActiveTab = tabs[0].id;

  const counts = {};
  tabs.forEach(t => { counts[t.id] = 0; });
  getChangeReviewQueueItems().forEach(ca => {
    const bucket = resolveChangeReviewBucket(ca);
    if (counts[bucket] != null) counts[bucket] += 1;
  });

  bar.innerHTML = tabs.map(t => {
    const badge = t.id === 'pending' && counts[t.id] > 0
      ? `<span class="approval-tab-badge">${counts[t.id]}</span>`
      : '';
    return `<button type="button" class="approval-tab${t.id === changeReviewActiveTab ? ' active' : ''}" data-change-review-tab="${t.id}" onclick="setChangeReviewTab('${t.id}')">${t.label}${badge}</button>`;
  }).join('');
}

function setChangeReviewTab(tabId) {
  changeReviewActiveTab = tabId;
  renderChangeReviewList();
}

function updateChangeReviewSelection() {
  const checks = Array.from(document.querySelectorAll('.change-review-row-check:not(:disabled)'));
  selectedChangeReviewIds = new Set(
    checks.filter(c => c.checked).map(c => c.value)
  );
  const checkAll = document.getElementById('change-review-check-all');
  const reviewableCount = checks.length;
  const selectedCount = selectedChangeReviewIds.size;
  if (checkAll) {
    checkAll.indeterminate = selectedCount > 0 && selectedCount < reviewableCount;
    checkAll.checked = reviewableCount > 0 && selectedCount === reviewableCount;
  }
  const btn = document.getElementById('btn-batch-change-review');
  const hint = document.getElementById('change-review-selection-hint');
  if (btn) btn.disabled = selectedCount === 0;
  if (hint) {
    hint.textContent = selectedCount
      ? `已选 ${selectedCount} 项，可批量 Review`
      : 'Pending 页勾选待办后可批量 Review';
  }
}

function toggleChangeReviewCheckAll(checked) {
  document.querySelectorAll('.change-review-row-check:not(:disabled)').forEach(el => {
    el.checked = checked;
  });
  updateChangeReviewSelection();
}

function openBatchChangeReview() {
  const ids = Array.from(selectedChangeReviewIds);
  if (!ids.length) {
    alert('请至少勾选一条待审批记录');
    return;
  }
  batchChangeReviewIds = ids.filter(id => {
    const ca = findChangeApplication(id);
    return ca && canReviewChangeItem(ca, changeReviewActiveTab);
  });
  if (!batchChangeReviewIds.length) {
    alert('所选记录当前不可审批');
    return;
  }
  const summary = document.getElementById('batch-change-review-summary');
  const list = document.getElementById('batch-change-review-list');
  const comment = document.getElementById('batch-change-review-comment');
  if (summary) {
    summary.textContent = `共 ${batchChangeReviewIds.length} 项待审批`;
  }
  if (list) {
    list.innerHTML = batchChangeReviewIds.map(id => {
      const ca = findChangeApplication(id);
      if (!ca) return '';
      const programme = PROGRAMMES[ca.programmeKey];
      return `<li><strong>${escapeHtml(ca.name)}</strong><div class="item-meta">${escapeHtml(programme?.name || '—')} · ${formatIntakeDisplay(ca.version)} · ${escapeHtml(ca.submitter)}</div></li>`;
    }).join('');
  }
  if (comment) comment.value = '';
  openModal('modal-batch-change-review');
}

function renderChangeReviewActions(ca, tab) {
  const parts = [
    `<a href="#" onclick="openChangeReviewView('${ca.id}');return false">View</a>`
  ];
  if (canReviewChangeItem(ca, tab)) {
    parts.push(`<a href="#" onclick="openChangeReviewModal('${ca.id}');return false">Review</a>`);
  }
  parts.push(`<a href="#" onclick="openChangeReviewLog('${ca.id}');return false">Approval Log</a>`);
  return parts.join('');
}

function renderChangeReviewList() {
  renderChangeReviewTabs();
  const tbody = document.getElementById('change-review-list-body');
  const empty = document.getElementById('change-review-list-empty');
  const toolbar = document.getElementById('change-review-list-toolbar');
  const table = document.querySelector('.change-review-table');
  const showBatch = changeReviewActiveTab === 'pending';
  if (toolbar) toolbar.style.display = showBatch ? 'flex' : 'none';
  if (table) table.classList.toggle('batch-mode', showBatch);
  selectedChangeReviewIds = new Set();
  if (!tbody) return;

  const items = getChangeReviewQueueItems().filter(ca =>
    resolveChangeReviewBucket(ca) === changeReviewActiveTab
  );
  if (!items.length) {
    tbody.innerHTML = '';
    if (empty) empty.style.display = 'block';
    updateChangeReviewSelection();
    return;
  }
  if (empty) empty.style.display = 'none';

  tbody.innerHTML = items.map(ca => {
    const programme = PROGRAMMES[ca.programmeKey];
    const st = getChangeReviewOverallStatus(ca);
    const canReview = canReviewChangeItem(ca, changeReviewActiveTab);
    const checkCell = showBatch && canReview
      ? `<td class="col-check"><input type="checkbox" class="change-review-row-check" value="${ca.id}" onchange="updateChangeReviewSelection()"></td>`
      : '<td class="col-check"></td>';
    return `<tr>
      ${checkCell}
      <td><a href="#" class="link-name" onclick="openChangeReviewView('${ca.id}');return false">${escapeHtml(ca.name)}</a></td>
      <td class="col-center"><span class="status ${st.cls}">${st.label}</span></td>
      <td>${escapeHtml(getChangeReviewStageDisplay(ca))}</td>
      <td>${escapeHtml(programme?.name || '—')}</td>
      <td class="col-center"><code>${formatIntakeDisplay(ca.version)}</code></td>
      <td class="col-center"><code>${formatIntakeDisplay(ca.startIntake || ca.version)}</code></td>
      <td class="col-center">${getChangeApplicationTotalCredits(ca)}</td>
      <td>${escapeHtml(ca.submitter || '—')}</td>
      <td>${escapeHtml(ca.submitTime || '—')}</td>
      <td class="actions">${renderChangeReviewActions(ca, changeReviewActiveTab)}</td>
    </tr>`;
  }).join('');
  updateChangeReviewSelection();
}

function goChangeEdit(changeId, readonly = false, returnPage = 'change-apply') {
  const ca = findChangeApplication(changeId);
  if (!ca) return;
  const v = findVersionById(ca.versionId);
  if (!v) return;

  saveCurrentEditContent();
  currentExecPlan = null;
  currentChangeApplication = ca;
  currentEditVersion = v;
  versionEditReturnPage = returnPage;
  goPage('version-edit');

  const isReadonly = readonly || ca.status === 'pending' || ca.status === 'approved';
  applyVersionEditReadonly(isReadonly);
  applyEditPageChrome('change');

  const statusEl = document.getElementById('edit-status');
  if (statusEl) {
    statusEl.className = 'status ' + changeApplicationStatusClass(ca.status);
    statusEl.textContent = getChangeApplicationStatusLabel(ca.status, isReadonly);
  }
  document.getElementById('edit-title').textContent =
    `变更 · ${PROGRAMMES[v.programmeKey].name} (${formatIntakeDisplay(v.version)})`;
  renderChangeInfoStrip(v, ca);
  updateVersionEditBreadcrumb();
  loadChangeContent(changeId);
  activateVersionEditTab('tab-classification');
  updateVersionEditTabStates();
}

function renderChangeInfoStrip(v, ca) {
  const strip = document.getElementById('edit-info-strip');
  if (!strip || !v) return;
  const programme = PROGRAMMES[v.programmeKey];
  const execCount = getExecPlansByVersionId(v.id).length;
  strip.innerHTML = `
    <span><label>变更目标</label><strong>${escapeHtml(v.name)}</strong></span>
    <span><label>专业</label>${escapeHtml(programme.name)} ${escapeHtml(programme.nameZh)}</span>
    <span><label>版本</label><strong>${formatIntakeDisplay(v.version)}</strong></span>
    <span><label>生效区间</label>${formatVersionRange(v)}</span>
    <span><label>已生成执行计划</label>${execCount ? `${execCount} 个（不受影响）` : '无'}</span>
    <span><label>申请状态</label>${escapeHtml(getChangeApplicationStatusLabel(ca.status))}</span>`;
}

function loadChangeContent(changeId) {
  let content = CHANGE_CONTENT_STORE[changeId];
  const ca = findChangeApplication(changeId);
  if (!content && ca) {
    content = cloneJson(getVersionContentSnapshot(ca.versionId));
    CHANGE_CONTENT_STORE[changeId] = cloneJson(content);
  }
  applyVersionContent(content || getEmptyVersionContent());
}

function deleteChangeApplication(id) {
  const ca = findChangeApplication(id);
  if (!ca) return;
  if (ca.status !== 'draft' && ca.status !== 'rejected') {
    alert('仅草稿或已驳回状态的申请可删除');
    return;
  }
  if (!confirm(`确定删除变更申请「${ca.name}」吗？`)) return;
  const idx = CHANGE_APPLICATIONS.findIndex(x => x.id === id);
  if (idx >= 0) CHANGE_APPLICATIONS.splice(idx, 1);
  delete CHANGE_CONTENT_STORE[id];
  if (currentChangeApplication?.id === id) currentChangeApplication = null;
  renderChangeApplyList();
  renderChangeReviewList();
}

function requestSubmitChangeApplication(id) {
  const ca = id ? findChangeApplication(id) : currentChangeApplication;
  if (!ca || (ca.status !== 'draft' && ca.status !== 'rejected')) return;

  if (currentChangeApplication?.id === ca.id) {
    saveCurrentEditContent();
    const result = validateCompulsoryMinCreditsForSubmit();
    if (!result.ok) {
      alert(result.message);
      return;
    }
  }

  pendingSubmitChangeId = ca.id;
  const msg = document.getElementById('submit-change-msg');
  const hint = document.getElementById('submit-change-hint');
  const programme = PROGRAMMES[ca.programmeKey];
  if (msg) {
    msg.innerHTML = `确定提交方案变更「<strong>${escapeHtml(ca.name)}</strong>」进行审批吗？`;
  }
  if (hint) {
    const execCount = getExecPlansByVersionId(ca.versionId).length;
    hint.textContent = `${programme?.nameZh || ''} · 版本 ${formatIntakeDisplay(ca.version)}。审批通过后将覆盖原版本内容；${execCount ? `已有 ${execCount} 个执行计划不受影响` : '尚无执行计划'}；未生成执行计划的批次生成时将引用最新内容。`;
  }
  openModal('modal-submit-change');
}

function cancelSubmitChange() {
  pendingSubmitChangeId = null;
  closeModal('modal-submit-change');
}

function confirmSubmitChange() {
  const ca = findChangeApplication(pendingSubmitChangeId);
  pendingSubmitChangeId = null;
  closeModal('modal-submit-change');
  if (!ca) return;

  if (currentChangeApplication?.id === ca.id) {
    const result = validateCompulsoryMinCreditsForSubmit();
    if (!result.ok) {
      alert(result.message);
      return;
    }
    saveCurrentEditContent();
  }

  ca.status = 'pending';
  ca.submitTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
  initChangeApprovalWorkflow(ca);
  renderChangeApplyList();
  renderChangeReviewList();

  if (currentChangeApplication?.id === ca.id) {
    applyVersionEditReadonly(true);
    const statusEl = document.getElementById('edit-status');
    if (statusEl) {
      statusEl.className = 'status ' + changeApplicationStatusClass('pending');
      statusEl.textContent = getChangeApplicationStatusLabel('pending');
    }
  }
  alert('变更申请已提交审核（原型）');
}

function buildChangeReviewStageInfoHtml(ca) {
  const current = ca.stages?.find(s => s.level === ca.currentStageLevel);
  const nodeLabel = current?.role || getChangeReviewStageDisplay(ca);
  return `
    <div class="approval-stage-field">
      <label>当前审批节点</label>
      <span>${escapeHtml(nodeLabel)}</span>
    </div>`;
}

function openChangeReviewView(id) {
  goChangeEdit(id, true, 'change-review');
}

function openChangeReviewModal(id) {
  const ca = findChangeApplication(id);
  if (!ca) return;
  if (!canReviewChangeItem(ca, changeReviewActiveTab)) {
    alert('当前记录不可审批，请使用「查看」或切换至 Pending 页。');
    return;
  }
  pendingChangeReviewId = id;
  const title = document.getElementById('change-review-title');
  const stageInfo = document.getElementById('change-review-stage-info');
  const comment = document.getElementById('change-review-comment');
  if (title) title.textContent = `Review — ${ca.name}`;
  if (stageInfo) stageInfo.innerHTML = buildChangeReviewStageInfoHtml(ca);
  if (comment) comment.value = '';
  openModal('modal-change-review');
}

function cancelChangeReview() {
  pendingChangeReviewId = null;
  closeModal('modal-change-review');
}

function getChangeReviewDecisionMessage(decision) {
  return {
    approved: 'Approved（原型）',
    rejected: 'Rejected（原型）',
    update_required: 'Update Required — 变更已退回修改（原型）'
  }[decision] || decision;
}

function applyChangeDecisionToItem(ca, decision, comment) {
  if (!ca.stages?.length) return false;
  const level = ca.currentStageLevel;
  const myStage = ca.stages.find(s => s.level === level);
  if (!myStage) return false;
  myStage.status = decision;
  myStage.reviewer = myStage.role || 'Reviewer';
  myStage.time = new Date().toISOString().slice(0, 16).replace('T', ' ');
  myStage.comment = comment || '';

  if (decision === 'approved') {
    const next = ca.stages.find(s => s.level === level + 1);
    if (next) {
      ca.currentStageLevel = next.level;
      next.status = 'pending';
    } else {
      ca.currentStageLevel = level;
      if (ca.stages.every(s => s.status === 'approved')) {
        finalizeChangeApplicationApproval(ca.id);
      }
    }
  } else if (decision === 'update_required' || decision === 'rejected') {
    ca.status = 'rejected';
    ca.reviewTime = myStage.time;
    ca.reviewComment = comment;
    if (decision === 'update_required') {
      ca.stages.forEach(stage => {
        if (stage.level > level) {
          stage.status = 'waiting';
          delete stage.reviewer;
          delete stage.time;
          delete stage.comment;
        }
      });
    }
  }
  return true;
}

function submitChangeReviewDecision(decision) {
  const ca = findChangeApplication(pendingChangeReviewId);
  if (!ca) return;
  applyChangeDecisionToItem(
    ca,
    decision,
    document.getElementById('change-review-comment')?.value.trim() || ''
  );
  pendingChangeReviewId = null;
  closeModal('modal-change-review');
  renderChangeApplyList();
  renderChangeReviewList();
  alert(getChangeReviewDecisionMessage(decision));
}

function submitBatchChangeReviewDecision(decision) {
  if (!batchChangeReviewIds.length) return;
  const comment = document.getElementById('batch-change-review-comment')?.value.trim() || '';
  let count = 0;
  batchChangeReviewIds.forEach(id => {
    const ca = findChangeApplication(id);
    if (ca && applyChangeDecisionToItem(ca, decision, comment)) count += 1;
  });
  batchChangeReviewIds = [];
  selectedChangeReviewIds = new Set();
  closeModal('modal-batch-change-review');
  renderChangeApplyList();
  renderChangeReviewList();
  alert(decision === 'approved'
    ? `已批量通过 ${count} 项（原型）`
    : `已批量驳回 ${count} 项（原型）`);
}

function openChangeReviewLog(id) {
  const ca = findChangeApplication(id);
  if (!ca) return;
  const title = document.getElementById('change-review-log-title');
  const body = document.getElementById('change-review-log-body');
  if (title) title.textContent = `Approval Log — ${ca.name}`;
  if (!body) return;

  const submitRow = `
    <div class="approval-log-item done">
      <div class="approval-log-dot"></div>
      <div>
        <div class="approval-log-head"><strong>Submitted</strong><span class="status draft">Submitted</span></div>
        <div class="approval-log-meta">${escapeHtml(ca.submitter)} · ${escapeHtml(ca.submitTime)}</div>
      </div>
    </div>`;

  const stageRows = (ca.stages || []).map(stage => {
    const st = renderApprovalLogStageStatus(stage);
    const itemCls = stage.status === 'approved' ? 'done'
      : stage.status === 'rejected' || stage.status === 'update_required' ? 'rejected'
      : stage.status === 'pending' ? 'current'
      : '';
    return `
      <div class="approval-log-item ${itemCls}">
        <div class="approval-log-dot"></div>
        <div>
          <div class="approval-log-head">
            <strong>${escapeHtml(stage.role)}</strong>
            <span class="status ${st.cls}">${st.label}</span>
          </div>
          <div class="approval-log-meta">${stage.reviewer ? escapeHtml(stage.reviewer) : '—'}${stage.time ? ` · ${escapeHtml(stage.time)}` : ''}</div>
          ${stage.comment ? `<div class="approval-log-comment">${escapeHtml(stage.comment)}</div>` : ''}
        </div>
      </div>`;
  }).join('');

  body.innerHTML = submitRow + stageRows;
  openModal('modal-change-review-log');
}

function finalizeChangeApplicationApproval(changeId) {
  const ca = findChangeApplication(changeId);
  if (!ca) return;
  const content = CHANGE_CONTENT_STORE[changeId] || getVersionContentSnapshot(ca.versionId);
  VERSION_CONTENT_STORE[ca.versionId] = cloneJson(content);
  // 已生成的 EXEC_CONTENT_STORE 副本保持不变，专业批次执行计划不受版本变更影响
  ca.status = 'approved';
}

// ── Approval queue (版本审批 · Pending / In Progress / History) ──
const APPROVAL_ROLES = {
  1: { level: 1, name: 'Programme Office', label: '一级审批 · Programme Office' },
  2: { level: 2, name: 'Academic Affairs', label: '二级审批 · Academic Affairs' },
  3: { level: 3, name: 'Senate', label: '三级审批 · Senate' }
};

let approvalActiveTab = 'pending';
let pendingApprovalItemId = null;
let selectedApprovalIds = new Set();
let batchApprovalReviewIds = [];

const APPROVAL_QUEUE = [
  {
    id: 'ap-fin-2509',
    versionId: 14,
    programmeKey: 'finance',
    name: 'Course Structure of Finance (202509 Version)',
    programme: 'Finance',
    version: '202509',
    startIntake: '202509',
    totalCredits: 130,
    submitter: '张老师',
    submitTime: '2025-05-28 10:15',
    cancelled: false,
    currentStageLevel: 2,
    stages: [
      { level: 1, role: 'Programme Office', status: 'approved', reviewer: '李主任', time: '2025-05-28 14:20', comment: '分类结构完整' },
      { level: 2, role: 'Academic Affairs', status: 'pending' },
      { level: 3, role: 'Senate', status: 'waiting' }
    ]
  },
  {
    id: 'ap-acc-2504',
    versionId: 23,
    programmeKey: 'accounting',
    name: 'Course Structure of Accounting (202504 Version)',
    programme: 'Accounting',
    version: '202504',
    startIntake: '202504',
    totalCredits: 128,
    submitter: '王老师',
    submitTime: '2025-04-12 09:40',
    cancelled: false,
    currentStageLevel: 2,
    stages: [
      { level: 1, role: 'Programme Office', status: 'approved', reviewer: '李主任', time: '2025-04-12 16:00', comment: 'OK' },
      { level: 2, role: 'Academic Affairs', status: 'pending' },
      { level: 3, role: 'Senate', status: 'waiting' }
    ]
  },
  {
    id: 'ap-chs-2509',
    versionId: 5,
    programmeKey: 'chinese',
    name: 'Course Structure of Chinese Studies (202509 Version)',
    programme: 'Chinese Studies',
    version: '202509',
    startIntake: '202509',
    totalCredits: 120,
    submitter: '陈老师',
    submitTime: '2025-05-30 11:05',
    cancelled: false,
    currentStageLevel: 1,
    stages: [
      { level: 1, role: 'Programme Office', status: 'pending' },
      { level: 2, role: 'Academic Affairs', status: 'waiting' },
      { level: 3, role: 'Senate', status: 'waiting' }
    ]
  },
  {
    id: 'ap-fin-2502',
    versionId: 13,
    programmeKey: 'finance',
    name: 'Course Structure of Finance (202502 Version)',
    programme: 'Finance',
    version: '202502',
    startIntake: '202502',
    totalCredits: 125,
    submitter: '张老师',
    submitTime: '2025-02-18 08:50',
    cancelled: false,
    currentStageLevel: 1,
    stages: [
      { level: 1, role: 'Programme Office', status: 'pending' },
      { level: 2, role: 'Academic Affairs', status: 'waiting' },
      { level: 3, role: 'Senate', status: 'waiting' }
    ]
  },
  {
    id: 'ap-acc-2502',
    versionId: 23,
    programmeKey: 'accounting',
    name: 'Course Structure of Accounting (202502 Version)',
    programme: 'Accounting',
    version: '202502',
    startIntake: '202502',
    totalCredits: 126,
    submitter: '赵老师',
    submitTime: '2025-02-10 15:22',
    cancelled: false,
    currentStageLevel: 2,
    stages: [
      { level: 1, role: 'Programme Office', status: 'approved', reviewer: '李主任', time: '2025-02-11 10:00', comment: 'Submitted' },
      { level: 2, role: 'Academic Affairs', status: 'pending' },
      { level: 3, role: 'Senate', status: 'waiting' }
    ]
  },
  {
    id: 'ap-fin-2409',
    versionId: 13,
    programmeKey: 'finance',
    name: 'Course Structure of Finance (202409 Version)',
    programme: 'Finance',
    version: '202409',
    startIntake: '202409',
    totalCredits: 130,
    submitter: '张老师',
    submitTime: '2024-08-20 09:00',
    cancelled: false,
    currentStageLevel: 3,
    stages: [
      { level: 1, role: 'Programme Office', status: 'approved', reviewer: '李主任', time: '2024-08-21 11:00', comment: 'OK' },
      { level: 2, role: 'Academic Affairs', status: 'approved', reviewer: '王处长', time: '2024-08-25 16:30', comment: 'Approved' },
      { level: 3, role: 'Senate', status: 'approved', reviewer: 'Senate Sec', time: '2024-09-01 09:00', comment: 'Final approval' }
    ]
  },
  {
    id: 'ap-chs-2404',
    versionId: 4,
    programmeKey: 'chinese',
    name: 'Course Structure of Chinese Studies (202404 Version)',
    programme: 'Chinese Studies',
    version: '202404',
    startIntake: '202404',
    totalCredits: 118,
    submitter: '陈老师',
    submitTime: '2024-03-15 13:40',
    cancelled: false,
    currentStageLevel: 3,
    stages: [
      { level: 1, role: 'Programme Office', status: 'approved', reviewer: '李主任', time: '2024-03-16 10:00', comment: '' },
      { level: 2, role: 'Academic Affairs', status: 'approved', reviewer: '王处长', time: '2024-03-18 14:00', comment: 'Approved' },
      { level: 3, role: 'Senate', status: 'rejected', reviewer: 'Senate Sec', time: '2024-03-22 11:20', comment: 'Elective credits mismatch' }
    ]
  },
  {
    id: 'ap-acc-2409',
    versionId: 23,
    programmeKey: 'accounting',
    name: 'Course Structure of Accounting (202409 Version)',
    programme: 'Accounting',
    version: '202409',
    startIntake: '202409',
    totalCredits: 128,
    submitter: '王老师',
    submitTime: '2024-07-08 10:30',
    cancelled: true,
    currentStageLevel: 2,
    stages: [
      { level: 1, role: 'Programme Office', status: 'approved', reviewer: '李主任', time: '2024-07-09 09:00', comment: '' },
      { level: 2, role: 'Academic Affairs', status: 'cancelled', reviewer: '—', time: '2024-07-10 08:00', comment: 'Applicant withdrew' }
    ]
  }
];

function findApprovalItem(id) {
  return APPROVAL_QUEUE.find(item => item.id === id);
}

function resolveApprovalVersionId(item) {
  if (!item) return null;
  if (item.versionId) return item.versionId;
  const programmeKey = item.programmeKey
    || Object.entries(PROGRAMMES).find(([, m]) => m.name === item.programme)?.[0];
  if (!programmeKey) return null;
  return VERSIONS.find(v => v.programmeKey === programmeKey && v.version === item.version)?.id ?? null;
}

function updateVersionEditBreadcrumb() {
  const crumb = document.getElementById('version-edit-breadcrumb');
  if (!crumb) return;
  const labels = {
    'approval-list': '培养方案版本审批',
    'exec-list': '专业批次执行计划',
    'change-apply': '方案版本变更申请',
    'change-review': '方案版本变更审核'
  };
  crumb.textContent = labels[versionEditReturnPage] || '方案版本管理';
}

function applyEditPageChrome(mode = 'version') {
  const execBanner = document.getElementById('exec-edit-banner');
  const changeBanner = document.getElementById('change-edit-banner');
  const btnSubmit = document.getElementById('btn-submit');
  if (execBanner) execBanner.style.display = mode === 'exec' ? 'block' : 'none';
  if (changeBanner) changeBanner.style.display = mode === 'change' ? 'block' : 'none';
  renderProgramCourseTableHeader();
  if (btnSubmit) {
    if (mode === 'exec') {
      btnSubmit.style.display = 'none';
    } else if (mode === 'change') {
      btnSubmit.textContent = '提交变更审批';
      btnSubmit.style.display = '';
    } else {
      btnSubmit.textContent = '提交审批';
      btnSubmit.style.display = '';
    }
  }
}

function restoreVersionInfoStrip(v) {
  const strip = document.getElementById('edit-info-strip');
  if (!strip || !v) return;
  const programme = PROGRAMMES[v.programmeKey];
  strip.innerHTML = `
    <span><label>专业</label><span id="info-programme">${escapeHtml(programme.name)} ${escapeHtml(programme.nameZh)}</span></span>
    <span><label>版本</label><strong id="info-version">${formatIntakeDisplay(v.version)}</strong></span>
    <span><label>开始批次</label><code id="info-start-intake">${formatIntakeDisplay(v.startIntake)}</code></span>
    <span><label>截止批次</label><code id="info-end-intake" class="${v.endIntake ? '' : 'text-muted'}">${v.endIntake ? formatIntakeDisplay(v.endIntake) : '—（当前有效版本）'}</code></span>
    <span><label>学制</label>${v.duration} 年</span>
    <span><label>授予学位</label>${escapeHtml(v.degree)}</span>`;
}

function renderExecInfoStrip(ep, version) {
  const strip = document.getElementById('edit-info-strip');
  if (!strip) return;
  const programme = PROGRAMMES[ep.programmeKey];
  strip.innerHTML = `
    <span><label>专业</label>${escapeHtml(programme.name)} ${escapeHtml(programme.nameZh)}</span>
    <span><label>专业代码</label>${escapeHtml(programme.code)}</span>
    <span><label>专业批次</label>${escapeHtml(formatProgrammeIntakeCode(ep.programmeKey, ep.intake))}</span>
    <span><label>入学批次</label>${formatIntakeDisplay(ep.intake)}</span>
    <span><label>关联版本</label>${version ? formatIntakeDisplay(version.version) : '—'} <span class="lock-icon" title="按批次自动匹配，不可切换">🔒</span></span>
    <span><label>是否提交</label>${renderExecLockStatus(!!ep.isLocked)}</span>
    <span><label>开课状态</label>${ep.isOffering ? '已开课' : '未开课'}</span>`;
}

function requestSaveVersionEdit() {
  if (versionEditReadonly) return;
  const msg = document.getElementById('save-version-msg');
  const hint = document.getElementById('save-version-hint');
  if (currentExecPlan) {
    if (msg) {
      msg.textContent = `确定保存专业批次执行计划（入学批次 ${formatIntakeDisplay(currentExecPlan.intake)}）吗？`;
    }
    if (hint) {
      hint.textContent = '保存后将返回执行计划列表；仅更新当前批次执行计划，不回写方案版本管理，其他入学批次互不影响。';
    }
  } else if (currentChangeApplication) {
    if (msg) msg.textContent = '确定保存方案版本变更内容吗？';
    if (hint) hint.textContent = '保存后将返回变更申请列表。';
  } else {
    if (msg) msg.textContent = '确定保存当前培养方案版本内容吗？';
    if (hint) hint.textContent = '保存后将返回方案版本管理列表。';
  }
  openModal('modal-save-version');
}

function cancelSaveVersionEdit() {
  closeModal('modal-save-version');
}

function confirmSaveVersionEdit() {
  if (versionEditReadonly) return;
  closeModal('modal-save-version');
  saveCurrentEditContent();
  const returnPage = versionEditReturnPage || 'version-list';
  currentExecPlan = null;
  currentChangeApplication = null;
  goPage(returnPage);
}

function goVersionEditReturn() {
  saveCurrentEditContent();
  if (currentExecPlan) renderExecList();
  currentExecPlan = null;
  currentChangeApplication = null;
  goPage(versionEditReturnPage || 'version-list');
}

function resolveApprovalBucket(item) {
  if (item.cancelled) return 'history';
  if (item.stages.some(s => s.status === 'rejected' || s.status === 'update_required')) return 'history';
  if (item.stages.every(s => s.status === 'approved')) return 'history';

  const current = item.stages.find(s => s.level === item.currentStageLevel);
  if (current?.status === 'pending') return 'pending';
  return 'in-progress';
}

function getApprovalTabs() {
  return [
    { id: 'pending', label: 'Pending' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'history', label: 'History' }
  ];
}

function getApprovalOverallStatus(item) {
  if (item.cancelled) return { label: 'Cancelled', cls: 'cancelled' };
  const last = item.stages[item.stages.length - 1];
  if (last?.status === 'approved' && item.currentStageLevel >= last.level) {
    return { label: 'Approved', cls: 'approved' };
  }
  if (item.stages.some(s => s.status === 'update_required')) {
    return { label: 'Update Required', cls: 'pending' };
  }
  if (item.stages.some(s => s.status === 'rejected')) {
    return { label: 'Rejected', cls: 'rejected' };
  }
  return { label: 'In Progress', cls: 'in-progress' };
}

function getApprovalStageDisplay(item) {
  if (item.cancelled) {
    return item.stages.find(s => s.level === item.currentStageLevel)?.role || 'Cancelled';
  }
  const updateRequired = item.stages.find(s => s.status === 'update_required');
  if (updateRequired) return updateRequired.role;
  const rejected = item.stages.find(s => s.status === 'rejected');
  if (rejected) return rejected.role;
  const current = item.stages.find(s => s.level === item.currentStageLevel);
  return current?.role || '—';
}

function canReviewApprovalItem(item, tab) {
  return tab === 'pending' && resolveApprovalBucket(item) === 'pending';
}

function renderApprovalTabs() {
  const bar = document.getElementById('approval-tab-bar');
  if (!bar) return;
  const tabs = getApprovalTabs();
  if (!tabs.some(t => t.id === approvalActiveTab)) approvalActiveTab = tabs[0].id;

  const counts = {};
  tabs.forEach(t => { counts[t.id] = 0; });
  APPROVAL_QUEUE.forEach(item => {
    const bucket = resolveApprovalBucket(item);
    if (counts[bucket] != null) counts[bucket] += 1;
  });

  bar.innerHTML = tabs.map(t => {
    const badge = t.id === 'pending' && counts[t.id] > 0
      ? `<span class="approval-tab-badge">${counts[t.id]}</span>`
      : '';
    return `<button type="button" class="approval-tab${t.id === approvalActiveTab ? ' active' : ''}" data-approval-tab="${t.id}" onclick="setApprovalTab('${t.id}')">${t.label}${badge}</button>`;
  }).join('');
}

function getReviewableApprovalItems(tab = approvalActiveTab) {
  return APPROVAL_QUEUE.filter(item =>
    resolveApprovalBucket(item) === tab &&
    canReviewApprovalItem(item, tab)
  );
}

function updateApprovalSelection() {
  const checks = Array.from(document.querySelectorAll('.approval-row-check:not(:disabled)'));
  selectedApprovalIds = new Set(
    checks.filter(c => c.checked).map(c => c.value)
  );
  const checkAll = document.getElementById('approval-check-all');
  const reviewableCount = checks.length;
  const selectedCount = selectedApprovalIds.size;
  if (checkAll) {
    checkAll.indeterminate = selectedCount > 0 && selectedCount < reviewableCount;
    checkAll.checked = reviewableCount > 0 && selectedCount === reviewableCount;
  }
  const btn = document.getElementById('btn-batch-approval-review');
  const hint = document.getElementById('approval-selection-hint');
  if (btn) btn.disabled = selectedCount === 0;
  if (hint) {
    hint.textContent = selectedCount
      ? `已选 ${selectedCount} 项，可批量 Review`
      : 'Pending 页勾选待办后可批量 Review';
  }
}

function toggleApprovalCheckAll(checked) {
  document.querySelectorAll('.approval-row-check:not(:disabled)').forEach(el => {
    el.checked = checked;
  });
  updateApprovalSelection();
}

function openBatchApprovalReview() {
  const ids = Array.from(selectedApprovalIds);
  if (!ids.length) {
    alert('请至少勾选一条待审批记录');
    return;
  }
  batchApprovalReviewIds = ids.filter(id => {
    const item = findApprovalItem(id);
    return item && canReviewApprovalItem(item, approvalActiveTab);
  });
  if (!batchApprovalReviewIds.length) {
    alert('所选记录当前不可审批');
    return;
  }
  const summary = document.getElementById('batch-approval-review-summary');
  const list = document.getElementById('batch-approval-review-list');
  const comment = document.getElementById('batch-approval-review-comment');
  if (summary) {
    summary.textContent = `共 ${batchApprovalReviewIds.length} 项待审批`;
  }
  if (list) {
    list.innerHTML = batchApprovalReviewIds.map(id => {
      const item = findApprovalItem(id);
      if (!item) return '';
      return `<li><strong>${escapeHtml(item.name)}</strong><div class="item-meta">${escapeHtml(item.programme)} · ${formatIntakeDisplay(item.version)} · ${escapeHtml(item.submitter)}</div></li>`;
    }).join('');
  }
  if (comment) comment.value = '';
  openModal('modal-batch-approval-review');
}

function applyApprovalDecisionToItem(item, decision, comment) {
  const level = item.currentStageLevel;
  const myStage = item.stages.find(s => s.level === level);
  if (!myStage) return false;
  myStage.status = decision;
  myStage.reviewer = myStage.role || 'Reviewer';
  myStage.time = new Date().toISOString().slice(0, 16).replace('T', ' ');
  myStage.comment = comment || '';

  if (decision === 'approved') {
    const next = item.stages.find(s => s.level === level + 1);
    if (next) {
      item.currentStageLevel = next.level;
      next.status = 'pending';
    } else {
      item.currentStageLevel = level;
    }
    if (item.versionId && item.stages.every(s => s.status === 'approved')) {
      finalizeProgrammeVersionApproval(item.versionId);
    }
  } else if (decision === 'update_required' || decision === 'rejected') {
    if (item.versionId) {
      const v = findVersionById(item.versionId);
      if (v) v.status = 'rejected';
    }
    if (decision === 'update_required') {
      item.stages.forEach(stage => {
        if (stage.level > level) {
          stage.status = 'waiting';
          delete stage.reviewer;
          delete stage.time;
          delete stage.comment;
        }
      });
    }
  }
  return true;
}

function submitBatchApprovalDecision(decision) {
  if (!batchApprovalReviewIds.length) return;
  const comment = document.getElementById('batch-approval-review-comment')?.value.trim() || '';
  let count = 0;
  batchApprovalReviewIds.forEach(id => {
    const item = findApprovalItem(id);
    if (item && applyApprovalDecisionToItem(item, decision, comment)) count += 1;
  });
  batchApprovalReviewIds = [];
  selectedApprovalIds = new Set();
  closeModal('modal-batch-approval-review');
  renderApprovalList();
  alert(decision === 'approved'
    ? `已批量通过 ${count} 项（原型）`
    : `已批量驳回 ${count} 项（原型）`);
}

function setApprovalTab(tabId) {
  approvalActiveTab = tabId;
  renderApprovalList();
}

function renderApprovalActions(item, tab) {
  const parts = [
    `<a href="#" onclick="openApprovalView('${item.id}');return false">View</a>`
  ];
  if (canReviewApprovalItem(item, tab)) {
    parts.push(`<a href="#" onclick="openApprovalReview('${item.id}');return false">Review</a>`);
  }
  parts.push(`<a href="#" onclick="openApprovalLog('${item.id}');return false">Approval Log</a>`);
  return parts.join('');
}

function renderApprovalList() {
  renderApprovalTabs();
  const tbody = document.getElementById('approval-list-body');
  const empty = document.getElementById('approval-list-empty');
  const toolbar = document.getElementById('approval-list-toolbar');
  const table = document.querySelector('.approval-table');
  const showBatch = approvalActiveTab === 'pending';
  if (toolbar) toolbar.style.display = showBatch ? 'flex' : 'none';
  if (table) table.classList.toggle('batch-mode', showBatch);
  selectedApprovalIds = new Set();
  if (!tbody) return;

  const items = APPROVAL_QUEUE.filter(item => resolveApprovalBucket(item) === approvalActiveTab);
  if (!items.length) {
    tbody.innerHTML = '';
    if (empty) empty.style.display = 'block';
    updateApprovalSelection();
    return;
  }
  if (empty) empty.style.display = 'none';

  tbody.innerHTML = items.map(item => {
    const st = getApprovalOverallStatus(item);
    const canReview = canReviewApprovalItem(item, approvalActiveTab);
    const checkCell = showBatch && canReview
      ? `<td class="col-check"><input type="checkbox" class="approval-row-check" value="${item.id}" onchange="updateApprovalSelection()"></td>`
      : '<td class="col-check"></td>';
    return `<tr>
      ${checkCell}
      <td><a href="#" class="link-name" onclick="openApprovalView('${item.id}');return false">${escapeHtml(item.name)}</a></td>
      <td class="col-center"><span class="status ${st.cls}">${st.label}</span></td>
      <td>${escapeHtml(getApprovalStageDisplay(item))}</td>
      <td>${escapeHtml(item.programme)}</td>
      <td class="col-center"><code>${formatIntakeDisplay(item.startIntake)}</code></td>
      <td class="col-center">${getApprovalItemTotalCredits(item)}</td>
      <td>${escapeHtml(item.submitter)}</td>
      <td>${escapeHtml(item.submitTime)}</td>
      <td class="actions">${renderApprovalActions(item, approvalActiveTab)}</td>
    </tr>`;
  }).join('');
  updateApprovalSelection();
}

function buildApprovalStageInfoHtml(item) {
  const current = item.stages.find(s => s.level === item.currentStageLevel);
  const nodeLabel = current?.role || getApprovalStageDisplay(item);
  return `
    <div class="approval-stage-field">
      <label>当前审批节点</label>
      <span>${escapeHtml(nodeLabel)}</span>
    </div>`;
}

function openApprovalView(id) {
  const item = findApprovalItem(id);
  if (!item) return;
  const versionId = resolveApprovalVersionId(item);
  if (!versionId) {
    alert('未找到关联的培养方案版本');
    return;
  }
  goEditVersion(versionId, true, 'approval-list');
}

function openApprovalReview(id) {
  const item = findApprovalItem(id);
  if (!item) return;
  if (!canReviewApprovalItem(item, approvalActiveTab)) {
    alert('当前记录不可审批，请使用「查看」或切换至 Pending 页。');
    return;
  }
  pendingApprovalItemId = id;
  const title = document.getElementById('approval-review-title');
  const stageInfo = document.getElementById('approval-review-stage-info');
  const comment = document.getElementById('approval-review-comment');
  if (title) title.textContent = `Review — ${item.name}`;
  if (stageInfo) stageInfo.innerHTML = buildApprovalStageInfoHtml(item);
  if (comment) comment.value = '';
  openModal('modal-approval-review');
}

function getApprovalDecisionMessage(decision) {
  return {
    approved: 'Approved（原型）',
    rejected: 'Rejected（原型）',
    update_required: 'Update Required — 方案已退回修改（原型）'
  }[decision] || decision;
}

function submitApprovalDecision(decision) {
  const item = findApprovalItem(pendingApprovalItemId);
  if (!item) return;
  applyApprovalDecisionToItem(item, decision, document.getElementById('approval-review-comment')?.value.trim() || '');
  pendingApprovalItemId = null;
  closeModal('modal-approval-review');
  renderApprovalList();
  filterVersions();
  alert(getApprovalDecisionMessage(decision));
}

function renderApprovalLogStageStatus(stage) {
  const map = {
    approved: { label: 'Approved', cls: 'approved' },
    rejected: { label: 'Rejected', cls: 'rejected' },
    update_required: { label: 'Update Required', cls: 'pending' },
    pending: { label: 'Pending', cls: 'pending' },
    waiting: { label: 'Waiting', cls: 'draft' },
    cancelled: { label: 'Cancelled', cls: 'cancelled' }
  };
  return map[stage.status] || { label: stage.status, cls: 'draft' };
}

function openApprovalLog(id) {
  const item = findApprovalItem(id);
  if (!item) return;
  const title = document.getElementById('approval-log-title');
  const body = document.getElementById('approval-log-body');
  if (title) title.textContent = `Approval Log — ${item.name}`;
  if (!body) return;

  const submitRow = `
    <div class="approval-log-item done">
      <div class="approval-log-dot"></div>
      <div>
        <div class="approval-log-head"><strong>Submitted</strong><span class="status draft">Submitted</span></div>
        <div class="approval-log-meta">${escapeHtml(item.submitter)} · ${escapeHtml(item.submitTime)}</div>
      </div>
    </div>`;

  const stageRows = item.stages.map(stage => {
    const st = renderApprovalLogStageStatus(stage);
    const itemCls = stage.status === 'approved' ? 'done'
      : stage.status === 'rejected' ? 'rejected'
      : stage.status === 'update_required' ? 'update-required'
      : stage.status === 'cancelled' ? 'cancelled'
      : stage.status === 'pending' ? 'pending' : '';
    const meta = stage.time
      ? `${escapeHtml(stage.reviewer || stage.role)} · ${escapeHtml(stage.time)}`
      : escapeHtml(stage.role);
    const comment = stage.comment
      ? `<div class="approval-log-comment">${escapeHtml(stage.comment)}</div>`
      : '';
    return `
      <div class="approval-log-item ${itemCls}">
        <div class="approval-log-dot"></div>
        <div>
          <div class="approval-log-head"><strong>${escapeHtml(stage.role)}</strong><span class="status ${st.cls}">${st.label}</span></div>
          <div class="approval-log-meta">${meta}</div>
          ${comment}
        </div>
      </div>`;
  }).join('');

  body.innerHTML = submitRow + stageRows;
  openModal('modal-approval-log');
}

// ── Page navigation ──
function goPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id)?.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === id);
  });
  if (id === 'version-list' || id === 'version-query') filterVersions();
  if (id === 'approval-list') renderApprovalList();
  if (id === 'exec-list') {
    rebuildExecListIntakeFilterOptions();
    renderExecList();
  }
  if (id === 'change-apply') renderChangeApplyList();
  if (id === 'change-review') renderChangeReviewList();
  if (id === 'stats-bloom') renderStatsBloomPage();
  if (id === 'workflow') renderWorkflowPage();
}

const WORKFLOW_ZOOM = { scale: 1, min: 0.5, max: 1.8, step: 0.1 };

function applyWorkflowZoom() {
  const stage = document.getElementById('workflow-zoom-stage');
  const mount = document.getElementById('workflow-doc-mount');
  const label = document.getElementById('workflow-zoom-label');
  if (!stage || !mount) return;
  const z = WORKFLOW_ZOOM.scale;
  stage.style.transform = `scale(${z})`;
  stage.style.width = z < 1 ? `${100 / z}%` : '100%';
  const baseH = mount.offsetHeight;
  stage.style.minHeight = baseH ? `${baseH * z}px` : '';
  if (label) label.textContent = `${Math.round(z * 100)}%`;
}

function workflowZoomStep(delta) {
  WORKFLOW_ZOOM.scale = Math.min(
    WORKFLOW_ZOOM.max,
    Math.max(WORKFLOW_ZOOM.min, +(WORKFLOW_ZOOM.scale + delta).toFixed(2))
  );
  applyWorkflowZoom();
}

function workflowZoomReset() {
  WORKFLOW_ZOOM.scale = 1;
  applyWorkflowZoom();
}

async function renderWorkflowPage() {
  const mount = document.getElementById('workflow-doc-mount');
  if (!mount) return;
  try {
    const res = await fetch('docs/pyfa-workflow.html', { cache: 'no-store' });
    if (!res.ok) throw new Error('fetch failed');
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const sheet = doc.querySelector('.sheet');
    if (!sheet) throw new Error('no sheet');
    mount.replaceChildren(...sheet.children);
    requestAnimationFrame(() => {
      workflowZoomReset();
      applyWorkflowZoom();
    });
  } catch {
    mount.innerHTML = '<p class="workflow-loading">无法加载流程图，请使用 <code>npm start</code> 启动本地服务后刷新页面。</p>';
    workflowZoomReset();
  }
}

(function initWorkflowZoom() {
  const viewport = document.getElementById('workflow-viewport');
  if (!viewport) return;
  viewport.addEventListener('wheel', e => {
    if (!document.getElementById('page-workflow')?.classList.contains('active')) return;
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    workflowZoomStep(e.deltaY > 0 ? -WORKFLOW_ZOOM.step : WORKFLOW_ZOOM.step);
  }, { passive: false });
})();

function goEditVersion(id, readonly, returnPage = 'version-list') {
  const v = VERSIONS.find(x => x.id === id);
  if (!v) return;
  versionEditReturnPage = returnPage;
  goEdit(readonly ? 'locked' : 'draft', v);
}

function goEdit(mode, versionData) {
  saveCurrentEditContent();
  currentExecPlan = null;
  currentChangeApplication = null;
  goPage('version-edit');
  const v = versionData || currentEditVersion || VERSIONS.find(x => x.version === '202509' && x.programmeKey === 'finance');
  currentEditVersion = v;
  const readonly = mode === 'locked' || v.status === 'approved' || v.status === 'pending';
  applyVersionEditReadonly(readonly);
  applyEditPageChrome('version');

  const statusEl = document.getElementById('edit-status');
  if (statusEl) {
    statusEl.className = 'status ' + statusClass(v.status);
    statusEl.textContent = readonly ? getVersionReadonlyStatusLabel(v.status) : statusLabel(v.status);
  }
  document.getElementById('edit-title').textContent = `${PROGRAMMES[v.programmeKey].name} (${formatIntakeDisplay(v.version)} Version)`;
  restoreVersionInfoStrip(v);
  updateVersionEditBreadcrumb();
  loadVersionContent(v.id);
  activateVersionEditTab('tab-classification');
  updateVersionEditTabStates();
}

function goExecEdit(execPlanId, editable = true) {
  const ep = findExecPlanById(execPlanId);
  if (!ep) return;
  if (editable && ep.isOffering) {
    alert('该执行计划已开课，不允许编辑');
    return;
  }
  if (editable && ep.isLocked) {
    alert('该执行计划已提交，不允许编辑');
    return;
  }
  saveCurrentEditContent();
  currentExecPlan = ep;
  currentChangeApplication = null;
  currentEditVersion = findVersionById(ep.versionId);
  versionEditReturnPage = 'exec-list';
  goPage('version-edit');

  const readonly = !editable;
  applyVersionEditReadonly(readonly);
  applyEditPageChrome('exec');

  const programme = PROGRAMMES[ep.programmeKey];
  const version = currentEditVersion;
  document.getElementById('edit-title').textContent =
    `${programme.name} · ${formatProgrammeIntakeCode(ep.programmeKey, ep.intake)}`;

  const statusEl = document.getElementById('edit-status');
  if (statusEl) {
    statusEl.className = 'status ' + (ep.status === 'published' ? 'approved' : 'draft');
    statusEl.textContent = readonly ? '查看模式' : (ep.status === 'published' ? '已发布' : '草稿');
  }

  renderExecInfoStrip(ep, version);
  updateVersionEditBreadcrumb();
  loadExecContent(ep.id);
  activateVersionEditTab('tab-classification');
  updateVersionEditTabStates();
}

// ── Sidebar nav ──
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    goPage(item.dataset.page);
  });
});

// ── Version edit tabs ──
document.querySelectorAll('#page-version-edit .tab-bar .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab.classList.contains('is-disabled')) {
      alert(getClassificationSetupStatus().message);
      return;
    }
    activateVersionEditTab(tab.dataset.tab);
  });
});

document.querySelectorAll('#page-exec-edit .tab-bar .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const parent = tab.closest('#page-exec-edit');
    parent.querySelectorAll('.tab-bar .tab').forEach(t => t.classList.remove('active'));
    parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tabExec)?.classList.add('active');
    if (tab.dataset.tabExec === 'exec-tab3') {
      renderProgrammeStructure('programme-structure-exec');
    }
  });
});

// ── Modals ──
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
  if (id === 'modal-add-category') {
    if (categoryFormMode === 'add-l2') {
      onH1Change();
      onStudyTypeChange();
      onCategoryLevelChange();
      resetElectiveMatrix();
    } else if (categoryFormMode === 'edit-l2') {
      onStudyTypeChange();
      onCategoryLevelChange();
      if (editingCategoryId) loadElectiveMatrixForCategory(editingCategoryId);
      updateElectiveMatrixHint();
    } else if (categoryFormMode === 'add-l3' || categoryFormMode === 'edit-l3') {
      onCategoryLevelChange();
    }
    applyCategoryFormMode();
  }
  if (id === 'modal-gen-exec') {
    initExecProgrammeSelect();
    const programmeKey = document.getElementById('exec-programme')?.value || 'finance';
    rebuildExecIntakeSelect(programmeKey);
    onExecIntakeInput();
  }
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
  if (id === 'modal-add-course') {
    courseModalReadonly = false;
    applyCourseModalReadonly(false);
    editingProgramCourseId = null;
  }
  if (id === 'modal-delete-category') pendingDeleteCategoryId = null;
  if (id === 'modal-submit-version') pendingSubmitVersionId = null;
  if (id === 'modal-delete-version') pendingDeleteVersionId = null;
  if (id === 'modal-delete-confirm') deleteConfirmCallback = null;
}

let deleteConfirmCallback = null;

function openDeleteConfirm({ title, message, hint, onConfirm }) {
  deleteConfirmCallback = onConfirm || null;
  const titleEl = document.getElementById('delete-confirm-title');
  const msgEl = document.getElementById('delete-confirm-msg');
  const hintEl = document.getElementById('delete-confirm-hint');
  if (titleEl) titleEl.textContent = title || '确认删除';
  if (msgEl) msgEl.innerHTML = message || '确定删除吗？此操作不可撤销。';
  if (hintEl) {
    if (hint) {
      hintEl.textContent = hint;
      hintEl.style.display = '';
    } else {
      hintEl.textContent = '';
      hintEl.style.display = 'none';
    }
  }
  openModal('modal-delete-confirm');
}

function cancelDeleteConfirm() {
  deleteConfirmCallback = null;
  closeModal('modal-delete-confirm');
}

function confirmDeleteConfirm() {
  const cb = deleteConfirmCallback;
  deleteConfirmCallback = null;
  closeModal('modal-delete-confirm');
  if (cb) cb();
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSltOutlineCloDropdown();
    closeSltInfoTip();
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});

document.addEventListener('click', e => {
  const wrap = document.getElementById('slt-outline-clo-multiselect');
  if (wrap && !wrap.contains(e.target)) closeSltOutlineCloDropdown();
  if (!e.target.closest('.slt-info-tip')) closeSltInfoTip();
});

// ── H1/H2 cascade ──
const H2_MAP = {
  compulsory: ['Mata Pelajaran Umum (MPU)', 'University Course', 'General Elective'],
  core: ['Major Core', 'Common Core', 'Basic Medical Sciences', 'Discipline',
         'Scientific Methods', 'Engineering Core 1', 'Engineering Core 2',
         'Mathematics/Physics', 'Major Elective', 'Field Elective'],
  elective: ['General Elective', 'Major Elective', 'Open Elective',
             'Engineering Elective', 'Field Elective', 'Specialisation Elective'],
  minor: ['—'],
  training: ['Industrial Training', 'Practicum', 'Clinical Training'],
  others: ['Humanities']
};

// ── Semester codes: 4 years × 3 semesters (Y1S1 … Y4S3) ──
const PROGRAM_YEARS = 4;
const SEMESTERS_PER_YEAR = 3;
const SEMESTER_WEEKS = { 1: 18, 2: 18, 3: 6 };

function semesterCode(year, sem) {
  return `Y${year}S${sem}`;
}

function getAllSemesterCodes(years = PROGRAM_YEARS) {
  const codes = [];
  for (let y = 1; y <= years; y++) {
    for (let s = 1; s <= SEMESTERS_PER_YEAR; s++) {
      codes.push(semesterCode(y, s));
    }
  }
  return codes;
}

function buildSemesterSelectOptions(selected) {
  return getAllSemesterCodes()
    .map(code => `<option value="${code}"${code === selected ? ' selected' : ''}>${code}</option>`)
    .join('');
}

function initSemesterSelects() {
  document.querySelectorAll('.semester-select').forEach((sel, i) => {
    const defaults = ['Y1S2', 'Y2S1'];
    sel.innerHTML = buildSemesterSelectOptions(defaults[i] || 'Y1S1');
  });
}

function offeringSemesterIds(prefix = '') {
  const p = prefix ? `${prefix}-` : '';
  return {
    toggle: `${p}offering-semester-enabled`,
    wrap: `${p}offering-semester-wrap`,
    label: `${p}offering-semester-label`,
    select: `${p}offering-semester-select`,
    hint: `${p}offering-semester-hint`
  };
}

function isOfferingSemesterEnabled(prefix = '') {
  return document.getElementById(offeringSemesterIds(prefix).toggle)?.checked ?? false;
}

function getCourseFormH1Id(prefix = '') {
  const id = prefix ? `${prefix}-course-h1-select` : 'course-h1-select';
  return document.getElementById(id)?.value || '';
}

function getCourseFormH2Id(prefix = '') {
  const id = prefix ? `${prefix}-course-h2-select` : 'course-h2-select';
  return document.getElementById(id)?.value || '';
}

/** 当前二级分类下是否存在三级分类（有则 H3 必填，无则跳过） */
function isCourseH3Required(prefix = '') {
  const h2Id = getCourseFormH2Id(prefix);
  if (!h2Id) return false;
  const l2 = findClassificationNode(h2Id);
  return Boolean(l2?.children?.length);
}

function isCourseFormCompulsory(prefix = '') {
  const h1Id = getCourseFormH1Id(prefix);
  if (!h1Id) return false;
  const l1 = findClassificationNode(h1Id);
  return l1?.studyType !== 'elective';
}

function getCourseFormStudyTypeLabel(prefix = '') {
  const h1Id = getCourseFormH1Id(prefix);
  if (!h1Id) return '—';
  return isCourseFormCompulsory(prefix) ? '必修 Compulsory' : '选修 Elective';
}

function syncCourseFormStudyTypeField(prefix = '') {
  const id = prefix ? `${prefix}-course-study-type-display` : 'course-study-type-display';
  const el = document.getElementById(id);
  if (el) el.value = getCourseFormStudyTypeLabel(prefix);
}

function setOfferingSemesterEnabled(enabled, semester, prefix = '', { locked = false } = {}) {
  const ids = offeringSemesterIds(prefix);
  const toggle = document.getElementById(ids.toggle);
  const wrap = document.getElementById(ids.wrap);
  const label = document.getElementById(ids.label);
  const select = document.getElementById(ids.select);
  const hint = document.getElementById(ids.hint);
  const toggleSwitch = toggle?.closest('.toggle-switch');
  const on = locked ? true : enabled;

  if (toggle) {
    toggle.checked = on;
    toggle.disabled = locked;
  }
  if (toggleSwitch) {
    toggleSwitch.classList.toggle('is-locked', locked);
    toggleSwitch.setAttribute('aria-disabled', locked ? 'true' : 'false');
  }
  if (wrap) {
    wrap.classList.toggle('field-disabled', !on);
    wrap.classList.toggle('offering-semester-locked', locked);
  }
  if (label) label.classList.toggle('req', on);
  if (select) {
    select.disabled = !on;
    if (on) {
      select.innerHTML = buildSemesterSelectOptions(semester || 'Y1S1');
    } else {
      select.innerHTML = '<option value="">—</option>';
    }
  }
  if (hint) {
    if (locked) {
      hint.textContent = '必修课程须指定开课学期，开关固定为开启';
    } else {
      hint.textContent = on
        ? '请选择该课程在本方案中的开课学期'
        : '选修课程可关闭开关，不指定开课学期时列表显示为 —';
    }
  }
  if (prefix === 'batch') {
    updateBatchAddButtonState();
  } else {
    updateCourseSaveButtonState();
  }
  syncCourseFormStudyTypeField(prefix);
}

function syncOfferingSemesterControl(prefix = '') {
  const ids = offeringSemesterIds(prefix);
  const select = document.getElementById(ids.select);
  const prev = select?.value && select.value !== '—' ? select.value : 'Y1S1';

  if (isCourseFormCompulsory(prefix)) {
    setOfferingSemesterEnabled(true, prev, prefix, { locked: true });
    return;
  }

  const toggle = document.getElementById(ids.toggle);
  if (toggle) {
    toggle.disabled = false;
    toggle.checked = isOfferingSemesterEnabled(prefix);
  }
  toggle?.closest('.toggle-switch')?.classList.remove('is-locked');
  toggle?.closest('.toggle-switch')?.setAttribute('aria-disabled', 'false');
  document.getElementById(ids.wrap)?.classList.remove('offering-semester-locked');
  setOfferingSemesterEnabled(isOfferingSemesterEnabled(prefix), prev, prefix, { locked: false });
}

function onOfferingSemesterToggleChange(prefix = '') {
  if (courseModalReadonly) return;
  if (isCourseFormCompulsory(prefix)) {
    syncOfferingSemesterControl(prefix);
    return;
  }
  const select = document.getElementById(offeringSemesterIds(prefix).select);
  const prev = select?.value && select.value !== '—' ? select.value : 'Y1S1';
  setOfferingSemesterEnabled(isOfferingSemesterEnabled(prefix), prev, prefix, { locked: false });
}


function getUsedElectiveSemesters(excludeSelect) {
  return Array.from(document.querySelectorAll('#elective-matrix-tbody .semester-row-select'))
    .filter(sel => sel !== excludeSelect)
    .map(sel => sel.value)
    .filter(Boolean);
}

function buildElectiveSemesterOptions(selected, excludeSelect) {
  const used = getUsedElectiveSemesters(excludeSelect);
  const options = ['<option value="">请选择</option>'];
  getAllSemesterCodes().forEach(code => {
    if (code !== selected && used.includes(code)) return;
    options.push(`<option value="${code}"${code === selected ? ' selected' : ''}>${code}</option>`);
  });
  return options.join('');
}

function refreshElectiveSemesterOptions() {
  document.querySelectorAll('#elective-matrix-tbody .semester-row-select').forEach(sel => {
    const current = sel.value;
    sel.innerHTML = buildElectiveSemesterOptions(current, sel);
  });
}

function updateElectiveMatrixEmptyState() {
  const tbody = document.getElementById('elective-matrix-tbody');
  const empty = document.getElementById('elective-matrix-empty');
  if (!tbody) return;
  const hasRows = tbody.querySelectorAll('tr[data-row]').length > 0;
  if (empty) empty.style.display = hasRows ? 'none' : '';
}

function resetElectiveMatrix() {
  const tbody = document.getElementById('elective-matrix-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr id="elective-matrix-empty"><td colspan="5" class="matrix-empty">暂无数据，请点击下方「+ 添加学期要求」</td></tr>';
}

function addElectiveMatrixRow(data = {}) {
  const tbody = document.getElementById('elective-matrix-tbody');
  if (!tbody) return;

  const row = document.createElement('tr');
  row.setAttribute('data-row', '1');
  row.innerHTML = `
    <td>
      <select class="input input-sm semester-row-select" onchange="refreshElectiveSemesterOptions()"></select>
    </td>
    <td><input class="input input-sm matrix-credit-min" type="number" min="0" placeholder="最低" value="${data.creditsMin ?? ''}"></td>
    <td><input class="input input-sm matrix-credit-max" type="number" min="0" placeholder="最高" value="${data.creditsMax ?? ''}"></td>
    <td><input class="input input-sm matrix-count" type="number" min="0" placeholder="门数" value="${data.count ?? ''}"></td>
    <td class="actions"><a href="#" class="danger" onclick="removeElectiveMatrixRow(this);return false">删除</a></td>`;

  tbody.appendChild(row);
  const sel = row.querySelector('.semester-row-select');
  sel.innerHTML = buildElectiveSemesterOptions(data.semester || '', sel);
  if (data.semester) sel.value = data.semester;
  refreshElectiveSemesterOptions();
  updateElectiveMatrixEmptyState();
  updateElectiveMatrixHint();
}

function removeElectiveMatrixRow(link) {
  const row = link.closest('tr');
  if (!row) return;
  openDeleteConfirm({
    title: '删除学期要求',
    message: '确定删除该学期的选修要求配置吗？此操作不可撤销。',
    onConfirm: () => {
      row.remove();
      refreshElectiveSemesterOptions();
      updateElectiveMatrixEmptyState();
      updateElectiveMatrixHint();
    }
  });
}

function onH1Change() {
  const h1 = document.getElementById('h1-select')?.value;
  const h2 = document.getElementById('h2-select');
  if (!h2) return;
  if (!h1) {
    h2.innerHTML = '<option value="">请选择</option>';
    h2.value = '';
    return;
  }
  h2.innerHTML = '<option value="">请选择</option>' +
    (H2_MAP[h1] || []).map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join('');
  h2.value = '';
}

// ── Course Classification Tree（学分/课程数：L1/L2(有L3) 自动汇总，L2/L3 可填）──
const SEED_CLASSIFICATION_TREE = [
  {
    id: 'l1-comp', level: 1, name: 'Compulsory Courses', studyType: 'compulsory',
    children: [
      { id: 'l2-mpu', level: 2, name: 'Mata Pelajaran Umum (MPU)', studyType: 'compulsory', creditsMin: 19, creditsMax: 19, courseCount: 5 },
      { id: 'l2-uni', level: 2, name: 'University Course', studyType: 'compulsory', creditsMin: 15, creditsMax: 15, courseCount: 4 }
    ]
  },
  {
    id: 'l1-core', level: 1, name: 'Core/Major/Specialisation', studyType: 'compulsory',
    children: [
      { id: 'l2-major', level: 2, name: 'Major Core', studyType: 'compulsory', creditsMin: 54, creditsMax: 54, courseCount: 14 }
    ]
  },
  {
    id: 'l1-elec', level: 1, name: 'Optional/Elective Courses', studyType: 'elective', highlight: true,
    children: [
      {
        id: 'l2-ge', level: 2, name: 'General Elective', studyType: 'elective',
        creditsMin: 12, creditsMax: 20,
        children: [
          { id: 'l3-arts', level: 3, name: 'Arts', studyType: 'elective', creditsMin: 4, courseCount: 2 },
          { id: 'l3-biz', level: 3, name: 'Business', studyType: 'elective', creditsMin: 4, courseCount: 2 },
          { id: 'l3-sci', level: 3, name: 'Science', studyType: 'elective', creditsMin: 4, courseCount: 2 }
        ]
      },
      { id: 'l2-me', level: 2, name: 'Major Elective', studyType: 'elective', creditsMin: 15, creditsMax: 17, courseCount: 5 }
    ]
  }
];

/** 选修课学期修读要求（TAB1 矩阵 · 按二级分类 × 学期） */
const SEED_ELECTIVE_SEMESTER_REQUIREMENTS = {
  'l2-ge': {
    Y1S2: { creditsMin: 3, creditsMax: 4, count: 1 },
    Y2S1: { creditsMin: 3, creditsMax: 4, count: 1 },
    Y1S3: { creditsMin: 2, creditsMax: 3, count: 1 },
    Y3S1: { creditsMin: 3, creditsMax: 4, count: 1 },
    Y4S1: { creditsMin: 2, creditsMax: 3, count: 1 }
  },
  'l2-me': {
    Y2S2: { creditsMin: 5, creditsMax: 6, count: 1 },
    Y3S2: { creditsMin: 5, creditsMax: 6, count: 1 },
    Y4S2: { creditsMin: 5, creditsMax: 5, count: 1 }
  }
};

let CLASSIFICATION_TREE = JSON.parse(JSON.stringify(SEED_CLASSIFICATION_TREE));
let ELECTIVE_SEMESTER_REQUIREMENTS = JSON.parse(JSON.stringify(SEED_ELECTIVE_SEMESTER_REQUIREMENTS));

function normalizeElectiveSemesterReq(req) {
  if (!req) return req;
  if (req.credits != null && req.creditsMin == null) {
    req.creditsMin = req.credits;
    req.creditsMax = req.credits;
    delete req.credits;
  }
  if (req.creditsMin != null && req.creditsMax == null) {
    req.creditsMax = req.creditsMin;
  }
  return req;
}

function normalizeNodeCredits(node) {
  if (!node) return;
  if (node.credits != null && node.creditsMin == null) {
    node.creditsMin = node.credits;
    if (node.level !== 3) node.creditsMax = node.credits;
    delete node.credits;
  }
  if (node.level === 3) {
    delete node.creditsMax;
  } else if (node.creditsMin != null && node.creditsMax == null) {
    node.creditsMax = node.creditsMin;
  }
  (node.children || []).forEach(normalizeNodeCredits);
}

function calcNodeCreditsMin(node) {
  normalizeNodeCredits(node);
  if (node.level === 3) return Number(node.creditsMin) || 0;
  if (node.level === 2) return Number(node.creditsMin) || 0;
  if (node.level === 1) {
    return (node.children || []).reduce((sum, child) => sum + calcNodeCreditsMin(child), 0);
  }
  return Number(node.creditsMin) || 0;
}

function calcNodeCreditsMax(node) {
  normalizeNodeCredits(node);
  if (node.level === 3) return null;
  if (node.level === 2) return Number(node.creditsMax) || 0;
  if (node.level === 1) {
    return (node.children || []).reduce((sum, child) => sum + calcNodeCreditsMax(child), 0);
  }
  return Number(node.creditsMax) || 0;
}

function calcNodeCredits(node) {
  return calcNodeCreditsMin(node);
}

/** 与 TAB1「毕业总学分」chip（sum-total）一致：各一级分类最低学分之和 */
function calcGraduationTotalCredits(classificationTree) {
  if (!Array.isArray(classificationTree) || !classificationTree.length) return null;
  const tree = cloneJson(classificationTree);
  return tree.reduce((sum, l1) => sum + calcNodeCreditsMin(l1), 0);
}

function getChangeApplicationContent(ca) {
  return CHANGE_CONTENT_STORE[ca.id] || getVersionContentSnapshot(ca.versionId);
}

function getChangeApplicationTotalCredits(ca) {
  const total = calcGraduationTotalCredits(getChangeApplicationContent(ca)?.classificationTree);
  return total != null ? total : (ca.totalCredits || '—');
}

function ensureExecPlanContentStore(ep) {
  if (!ep) return;
  const version = findVersionById(ep.versionId);
  const versionStart = version?.startIntake;
  if (!EXEC_CONTENT_STORE[ep.id]) {
    const content = cloneJson(getVersionContentSnapshot(ep.versionId));
    remapExecPlanContent(content, versionStart, ep.intake, ep.versionId);
    EXEC_CONTENT_STORE[ep.id] = content;
  } else if (EXEC_CONTENT_STORE[ep.id]._semesterRemapVersion !== EXEC_SEMESTER_REMAP_VERSION) {
    remapExecPlanContent(EXEC_CONTENT_STORE[ep.id], versionStart, ep.intake, ep.versionId);
  } else {
    syncExecPlanContentSemesters(EXEC_CONTENT_STORE[ep.id], ep.intake);
  }
}

function initExecContentStore() {
  EXEC_PLANS.forEach(ensureExecPlanContentStore);
}

function getExecPlanContent(ep) {
  ensureExecPlanContentStore(ep);
  return EXEC_CONTENT_STORE[ep.id];
}

function getExecPlanTotalCredits(ep) {
  const total = calcGraduationTotalCredits(getExecPlanContent(ep)?.classificationTree);
  return total != null ? total : '—';
}

function getApprovalItemTotalCredits(item) {
  const total = calcGraduationTotalCredits(getVersionContentSnapshot(item.versionId)?.classificationTree);
  return total != null ? total : (item.totalCredits || '—');
}

function calcNodeCourseCount(node) {
  if (node.level === 3) return Number(node.courseCount) || 0;
  if (node.level === 2) {
    if (node.children?.length) {
      return node.children.reduce((sum, child) => sum + calcNodeCourseCount(child), 0);
    }
    return Number(node.courseCount) || 0;
  }
  if (node.level === 1) {
    return (node.children || []).reduce((sum, child) => sum + calcNodeCourseCount(child), 0);
  }
  return Number(node.courseCount) || 0;
}

function isAggregatedCreditNode(node) {
  return node.level === 1;
}

function syncClassificationStoredCredits() {
  CLASSIFICATION_TREE.forEach(l1 => {
    normalizeNodeCredits(l1);
    (l1.children || []).forEach(l2 => {
      normalizeNodeCredits(l2);
      if (l2.children?.length) {
        delete l2.credits;
        delete l2.courseCount;
        (l2.children || []).forEach(normalizeNodeCredits);
      }
    });
  });
}

function findClassificationNode(id, nodes = CLASSIFICATION_TREE) {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findClassificationNode(id, n.children);
      if (found) return found;
    }
  }
  return null;
}

function hasCourseClassificationOptions() {
  return CLASSIFICATION_TREE.some(l1 => l1.children?.length);
}

function getClassificationSetupStatus() {
  if (!CLASSIFICATION_TREE.length) {
    return {
      ok: false,
      message: '请先在 TAB1 完成课程分类建设（各级分类及学分要求），再进入 TAB2 课程设置。'
    };
  }
  for (const l1 of CLASSIFICATION_TREE) {
    if (!l1.children?.length) {
      return {
        ok: false,
        message: `请先在 TAB1 为「${l1.name}」建设二级分类，再进入 TAB2 课程设置。`
      };
    }
    for (const l2 of l1.children) {
      if (l2.children?.length) {
        for (const l3 of l2.children) {
          normalizeNodeCredits(l3);
          if (l3.creditsMin == null || l3.creditsMin === '') {
            return {
              ok: false,
              message: `请完善 TAB1 三级分类「${l3.name}」的最低学分，再进入 TAB2 课程设置。`
            };
          }
        }
      } else {
        normalizeNodeCredits(l2);
        if (l2.creditsMin == null || l2.creditsMin === '') {
          return {
            ok: false,
            message: `请完善 TAB1 二级分类「${l2.name}」的学分要求，再进入 TAB2 课程设置。`
          };
        }
      }
    }
  }
  return { ok: true, message: '' };
}

function isClassificationSetupComplete() {
  return getClassificationSetupStatus().ok;
}

function canAccessVersionEditTab(tabId) {
  if (tabId !== 'tab-courses') return true;
  if (versionEditReadonly) return true;
  return isClassificationSetupComplete();
}

function updateVersionEditTabStates() {
  const coursesTab = document.querySelector('#page-version-edit .tab[data-tab="tab-courses"]');
  if (!coursesTab) return;
  const unlocked = canAccessVersionEditTab('tab-courses');
  coursesTab.classList.toggle('is-disabled', !unlocked);
  coursesTab.title = unlocked ? '' : getClassificationSetupStatus().message;
}

function activateVersionEditTab(tabId) {
  if (!canAccessVersionEditTab(tabId)) {
    alert(getClassificationSetupStatus().message);
    return;
  }
  const parent = document.getElementById('page-version-edit');
  if (!parent) return;
  parent.querySelectorAll('.tab-bar .tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabId);
  });
  parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');
  if (tabId === 'tab-structure') {
    renderProgrammeStructure('programme-structure-root');
  }
  if (tabId === 'tab-classification') {
    renderClassificationTree();
  }
  if (tabId === 'tab-courses') {
    renderProgramCoursesTable();
  }
}

/** 教务课程库（课程选择器数据源） */
const COURSE_CATALOG = [
  { id: 'mpu3123', code: 'MPU3123', name: 'Malaysian Studies 3', department: 'School of Humanities and Social Sciences', coordinator: 'Dr. Ahmad Rahman', credits: 3, language: 'English', classification: 'Compulsory', synopsis: 'An overview of Malaysian history, politics and society.', references: 'Malaysia: History and Heritage.' },
  { id: 'fin101', code: 'FIN101', name: 'Introduction to Finance', department: 'School of Economics & Management', coordinator: 'Prof. Lim Wei Jie', credits: 4, language: 'English', classification: 'Major Core', synopsis: 'Fundamentals of finance and financial markets.', references: 'Berk & DeMarzo, Corporate Finance.' },
  { id: 'fin201', code: 'FIN201', name: 'Corporate Finance', department: 'School of Economics & Management', coordinator: 'Dr. Tan Mei Ling', credits: 4, language: 'English', classification: 'Major Core', synopsis: 'This course introduces students to the principles of corporate finance, including valuation, capital budgeting, and risk management.', references: 'Berk & DeMarzo, Corporate Finance, 5th Ed.' },
  { id: 'eng101', code: 'ENG101', name: 'English for Academic Writing', department: 'School of Humanities and Social Sciences', coordinator: 'Dr. Sarah Chen', credits: 3, language: 'English', classification: 'Compulsory', synopsis: 'Academic writing skills for undergraduate students.', references: '—' },
  { id: 'phy101', code: 'PHY101', name: 'Mechanics', department: 'School of Science', coordinator: 'Dr. Wong Kai', credits: 4, language: 'English', classification: 'Major Core', synopsis: 'Classical mechanics for science majors.', references: 'Halliday & Resnick, Fundamentals of Physics.' },
  { id: 'phy102', code: 'PHY102', name: 'Data Science Fundamentals', department: 'School of Science', coordinator: 'Dr. Lee Ming', credits: 2, language: 'English', classification: 'Common Core', synopsis: 'Introduction to data science concepts and tools.', references: '—' },
  { id: 'csc201', code: 'CSC201', name: 'Introduction to Programming', department: 'School of Computing', coordinator: 'Dr. Kumar Raj', credits: 3, language: 'English', classification: 'Common Core', synopsis: 'Programming fundamentals using Python.', references: '—' },
  { id: 'fin301', code: 'FIN301', name: 'Investment Analysis', department: 'School of Economics & Management', coordinator: 'Dr. Tan Mei Ling', credits: 4, language: 'English', classification: 'Major Elective', synopsis: 'Portfolio theory and security analysis.', references: 'Bodie, Kane & Marcus, Investments.' },
  { id: 'int401', code: 'INT401', name: 'Industrial Training', department: 'School of Economics & Management', coordinator: 'Ms. Ooi Lay Kuan', credits: 6, language: 'English', classification: 'Industrial Training', synopsis: 'Supervised industrial placement.', references: '—' },
  { id: 'mpu3113', code: 'MPU3113', name: 'Ethnic Relations', department: 'School of Humanities and Social Sciences', coordinator: 'Dr. Ahmad Rahman', credits: 3, language: 'English', classification: 'Compulsory', synopsis: 'Ethnic relations in Malaysia.', references: '—' },
  { id: 'mpu3143', code: 'MPU3143', name: 'Islamic Civilisation and Asian Civilisation', department: 'School of Humanities and Social Sciences', coordinator: 'Dr. Ahmad Rahman', credits: 3, language: 'English', classification: 'Compulsory', synopsis: 'Islamic and Asian civilisation.', references: '—' },
  { id: 'mpu3173', code: 'MPU3173', name: 'Malay Communication 3', department: 'School of Humanities and Social Sciences', coordinator: 'Dr. Siti Aminah', credits: 3, language: 'Malay', classification: 'Compulsory', synopsis: 'Malay language communication.', references: '—' },
  { id: 'mpu3183', code: 'MPU3183', name: 'Leadership and Teambuilding', department: 'Student Affairs', coordinator: 'Ms. Nurul Huda', credits: 3, language: 'English', classification: 'Compulsory', synopsis: 'Leadership and teamwork skills.', references: '—' },
  { id: 'mpu3193', code: 'MPU3193', name: 'Community Service', department: 'Student Affairs', coordinator: 'Ms. Nurul Huda', credits: 4, language: 'English', classification: 'Compulsory', synopsis: 'Community engagement project.', references: '—' },
  { id: 'uni101', code: 'UNI101', name: 'University English I', department: 'School of Humanities and Social Sciences', coordinator: 'Dr. Sarah Chen', credits: 4, language: 'English', classification: 'University Course', synopsis: 'Academic English foundation.', references: '—' },
  { id: 'uni102', code: 'UNI102', name: 'University English II', department: 'School of Humanities and Social Sciences', coordinator: 'Dr. Sarah Chen', credits: 4, language: 'English', classification: 'University Course', synopsis: 'Advanced academic English.', references: '—' },
  { id: 'uni103', code: 'UNI103', name: 'Critical Thinking', department: 'School of Humanities and Social Sciences', coordinator: 'Dr. Sarah Chen', credits: 4, language: 'English', classification: 'University Course', synopsis: 'Logic and critical reasoning.', references: '—' },
  { id: 'uni104', code: 'UNI104', name: 'Digital Literacy', department: 'School of Computing', coordinator: 'Dr. Kumar Raj', credits: 3, language: 'English', classification: 'University Course', synopsis: 'Digital tools and information literacy.', references: '—' },
  { id: 'acc101', code: 'ACC101', name: 'Principles of Accounting', department: 'School of Economics & Management', coordinator: 'Prof. Lim Wei Jie', credits: 4, language: 'English', classification: 'Major Core', synopsis: 'Fundamentals of financial accounting.', references: '—' },
  { id: 'acc201', code: 'ACC201', name: 'Financial Accounting', department: 'School of Economics & Management', coordinator: 'Prof. Lim Wei Jie', credits: 4, language: 'English', classification: 'Major Core', synopsis: 'Financial reporting standards.', references: '—' },
  { id: 'acc301', code: 'ACC301', name: 'Cost Accounting', department: 'School of Economics & Management', coordinator: 'Dr. Tan Mei Ling', credits: 4, language: 'English', classification: 'Major Core', synopsis: 'Cost measurement and control.', references: '—' },
  { id: 'acc302', code: 'ACC302', name: 'Management Accounting', department: 'School of Economics & Management', coordinator: 'Dr. Tan Mei Ling', credits: 4, language: 'English', classification: 'Major Core', synopsis: 'Managerial decision support.', references: '—' },
  { id: 'acc303', code: 'ACC303', name: 'Auditing I', department: 'School of Economics & Management', coordinator: 'Dr. Tan Mei Ling', credits: 4, language: 'English', classification: 'Major Core', synopsis: 'Audit process and assurance.', references: '—' },
  { id: 'acc304', code: 'ACC304', name: 'Taxation I', department: 'School of Economics & Management', coordinator: 'Dr. Tan Mei Ling', credits: 4, language: 'English', classification: 'Major Core', synopsis: 'Malaysian taxation principles.', references: '—' },
  { id: 'eco101', code: 'ECO101', name: 'Microeconomics', department: 'School of Economics & Management', coordinator: 'Prof. Lim Wei Jie', credits: 4, language: 'English', classification: 'Major Core', synopsis: 'Microeconomic theory.', references: '—' },
  { id: 'eco201', code: 'ECO201', name: 'Macroeconomics', department: 'School of Economics & Management', coordinator: 'Prof. Lim Wei Jie', credits: 4, language: 'English', classification: 'Major Core', synopsis: 'Macroeconomic analysis.', references: '—' },
  { id: 'mat101', code: 'MAT101', name: 'Business Mathematics', department: 'School of Science', coordinator: 'Dr. Wong Kai', credits: 4, language: 'English', classification: 'Major Core', synopsis: 'Mathematics for business.', references: '—' },
  { id: 'sta101', code: 'STA101', name: 'Business Statistics', department: 'School of Science', coordinator: 'Dr. Wong Kai', credits: 4, language: 'English', classification: 'Major Core', synopsis: 'Statistics for business analysis.', references: '—' },
  { id: 'art201', code: 'ART201', name: 'Introduction to Art History', department: 'School of Humanities and Social Sciences', coordinator: 'Dr. Sarah Chen', credits: 3, language: 'English', classification: 'General Elective', synopsis: 'Survey of art history.', references: '—' },
  { id: 'bus201', code: 'BUS201', name: 'International Business', department: 'School of Economics & Management', coordinator: 'Prof. Lim Wei Jie', credits: 3, language: 'English', classification: 'General Elective', synopsis: 'Global business environment.', references: '—' },
  { id: 'mkt201', code: 'MKT201', name: 'Marketing Principles', department: 'School of Economics & Management', coordinator: 'Prof. Lim Wei Jie', credits: 4, language: 'English', classification: 'General Elective', synopsis: 'Introduction to marketing.', references: '—' },
  { id: 'fin401', code: 'FIN401', name: 'Derivative Markets', department: 'School of Economics & Management', coordinator: 'Dr. Tan Mei Ling', credits: 4, language: 'English', classification: 'Major Elective', synopsis: 'Derivatives pricing and use.', references: '—' },
  { id: 'fin402', code: 'FIN402', name: 'Risk Management', department: 'School of Economics & Management', coordinator: 'Dr. Tan Mei Ling', credits: 4, language: 'English', classification: 'Major Elective', synopsis: 'Financial risk management.', references: '—' },
  { id: 'fin403', code: 'FIN403', name: 'International Finance', department: 'School of Economics & Management', coordinator: 'Dr. Tan Mei Ling', credits: 4, language: 'English', classification: 'Major Elective', synopsis: 'International financial markets.', references: '—' },
  { id: 'fin404', code: 'FIN404', name: 'Financial Modelling', department: 'School of Economics & Management', coordinator: 'Dr. Tan Mei Ling', credits: 3, language: 'English', classification: 'Major Elective', synopsis: 'Spreadsheet-based financial models.', references: '—' }
];

function seedProgramCourse(id, catalogId, h1Id, h2Id, h3Id, semester, studyType, prereqIds = []) {
  const cat = COURSE_CATALOG.find(c => c.id === catalogId);
  return {
    id,
    catalogId,
    h1Id,
    h2Id,
    h3Id: h3Id || null,
    semester,
    studyType,
    language: cat?.language || 'English',
    credits: cat?.credits,
    prereqIds,
    synopsis: cat?.synopsis || '',
    references: cat?.references || ''
  };
}

/** 培养方案内已配置课程（TAB2 · 学分校验达标示例数据） */
const SEED_PROGRAM_COURSES = [
  // MPU 必修 19 学分
  ...['mpu3123', 'mpu3113', 'mpu3143', 'mpu3173', 'mpu3183', 'mpu3193'].map((cid, i) =>
    seedProgramCourse(`pc-mpu-${i}`, cid, 'l1-comp', 'l2-mpu', null, `Y1S${(i % 2) + 1}`, 'compulsory')
  ),
  // University 必修 15 学分
  ...['uni101', 'uni102', 'uni103', 'uni104'].map((cid, i) =>
    seedProgramCourse(`pc-uni-${i}`, cid, 'l1-comp', 'l2-uni', null, `Y1S${i + 1}`, 'compulsory')
  ),
  // Major Core 必修 54 学分
  seedProgramCourse('pc-mc-fin101', 'fin101', 'l1-core', 'l2-major', null, 'Y1S1', 'compulsory'),
  seedProgramCourse('pc-mc-fin201', 'fin201', 'l1-core', 'l2-major', null, 'Y2S1', 'compulsory', ['fin101']),
  ...['acc101', 'acc201', 'acc301', 'acc302', 'acc303', 'acc304', 'eco101', 'eco201', 'mat101', 'sta101'].map((cid, i) =>
    seedProgramCourse(`pc-mc-${i}`, cid, 'l1-core', 'l2-major', null, `Y${2 + Math.floor(i / 3)}S${(i % 3) + 1}`, 'compulsory')
  ),
  seedProgramCourse('pc-mc-int401', 'int401', 'l1-core', 'l2-major', null, 'Y4S2', 'compulsory'),
  // General Elective · Arts ≥4
  seedProgramCourse('pc-ge-arts-1', 'eng101', 'l1-elec', 'l2-ge', 'l3-arts', 'Y1S2', 'elective'),
  seedProgramCourse('pc-ge-arts-2', 'art201', 'l1-elec', 'l2-ge', 'l3-arts', 'Y2S1', 'elective'),
  // General Elective · Business ≥4
  seedProgramCourse('pc-ge-biz-1', 'bus201', 'l1-elec', 'l2-ge', 'l3-biz', 'Y2S2', 'elective'),
  seedProgramCourse('pc-ge-biz-2', 'mkt201', 'l1-elec', 'l2-ge', 'l3-biz', 'Y3S1', 'elective'),
  // General Elective · Science ≥4
  seedProgramCourse('pc-ge-sci-1', 'csc201', 'l1-elec', 'l2-ge', 'l3-sci', 'Y1S3', 'elective'),
  seedProgramCourse('pc-ge-sci-2', 'phy101', 'l1-elec', 'l2-ge', 'l3-sci', 'Y3S2', 'elective'),
  // Major Elective ≥15
  seedProgramCourse('pc-me-1', 'fin301', 'l1-elec', 'l2-me', null, 'Y3S1', 'elective', ['fin201']),
  seedProgramCourse('pc-me-2', 'fin401', 'l1-elec', 'l2-me', null, 'Y2S2', 'elective'),
  seedProgramCourse('pc-me-3', 'fin402', 'l1-elec', 'l2-me', null, 'Y3S2', 'elective'),
  seedProgramCourse('pc-me-4', 'fin403', 'l1-elec', 'l2-me', null, 'Y4S1', 'elective'),
  seedProgramCourse('pc-me-5', 'fin404', 'l1-elec', 'l2-me', null, 'Y4S2', 'elective')
];

const PROGRAM_COURSES = JSON.parse(JSON.stringify(SEED_PROGRAM_COURSES));

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function getEmptyVersionContent() {
  return {
    classificationTree: [],
    programCourses: [],
    electiveSemesterRequirements: {}
  };
}

function getSeedVersionContent() {
  return {
    classificationTree: cloneJson(SEED_CLASSIFICATION_TREE),
    programCourses: cloneJson(SEED_PROGRAM_COURSES),
    electiveSemesterRequirements: cloneJson(SEED_ELECTIVE_SEMESTER_REQUIREMENTS)
  };
}

/** 为各版本预置达标示例数据（已通过/草稿等打开即可查看或编辑） */
function initVersionContentStore() {
  const seed = getSeedVersionContent();
  VERSIONS.forEach(v => {
    VERSION_CONTENT_STORE[v.id] = cloneJson(seed);
  });
}

function applyVersionContent(content) {
  CLASSIFICATION_TREE.length = 0;
  CLASSIFICATION_TREE.push(...cloneJson(content.classificationTree));
  PROGRAM_COURSES.length = 0;
  PROGRAM_COURSES.push(...cloneJson(content.programCourses));
  Object.keys(ELECTIVE_SEMESTER_REQUIREMENTS).forEach(k => delete ELECTIVE_SEMESTER_REQUIREMENTS[k]);
  Object.assign(ELECTIVE_SEMESTER_REQUIREMENTS, cloneJson(content.electiveSemesterRequirements));
}

function getVersionContentSnapshot(versionId) {
  if (VERSION_CONTENT_STORE[versionId]) {
    return cloneJson(VERSION_CONTENT_STORE[versionId]);
  }
  return getSeedVersionContent();
}

function saveCurrentEditContent() {
  if (currentExecPlan?.id) {
    PROGRAM_COURSES.forEach(pc => finalizeProgramCourseForContext(pc));
  }
  const payload = {
    classificationTree: cloneJson(CLASSIFICATION_TREE),
    programCourses: cloneJson(PROGRAM_COURSES),
    electiveSemesterRequirements: cloneJson(ELECTIVE_SEMESTER_REQUIREMENTS)
  };
  if (currentChangeApplication?.id) {
    CHANGE_CONTENT_STORE[currentChangeApplication.id] = payload;
    const ca = findChangeApplication(currentChangeApplication.id);
    if (ca) {
      const total = calcGraduationTotalCredits(payload.classificationTree);
      if (total != null) ca.totalCredits = total;
    }
    return;
  }
  if (currentExecPlan?.id) {
    EXEC_CONTENT_STORE[currentExecPlan.id] = payload;
    // 仅写入当前批次执行计划，不回写 VERSION_CONTENT_STORE（与方案版本管理隔离）
    return;
  }
  if (currentEditVersion?.id) {
    VERSION_CONTENT_STORE[currentEditVersion.id] = payload;
    const total = calcGraduationTotalCredits(payload.classificationTree);
    if (total != null) {
      APPROVAL_QUEUE.forEach(ap => {
        if (ap.versionId === currentEditVersion.id) ap.totalCredits = total;
      });
    }
  }
}

function loadVersionContent(versionId) {
  applyVersionContent(getVersionContentSnapshot(versionId));
}

function loadExecContent(execPlanId) {
  const ep = findExecPlanById(execPlanId);
  if (!ep) return;
  ensureExecPlanContentStore(ep);
  applyVersionContent(EXEC_CONTENT_STORE[execPlanId]);
}

let selectedCatalogCourseId = null;
let editingProgramCourseId = null;
let selectedPrereqCourseIds = [];
let pendingPickerCourseId = null;
let pendingPrereqCourseIds = [];
let coursePickerMode = 'main';
let coursePickerFilteredList = [];
let batchSelectedCatalogIds = [];
let pendingBatchCourseIds = [];

function getExistingProgramCatalogIds() {
  return new Set(PROGRAM_COURSES.map(pc => pc.catalogId));
}

function createProgramCourseFromCatalog(catalogId, { h1Id, h2Id, h3Id, semester }) {
  const catalog = COURSE_CATALOG.find(c => c.id === catalogId);
  if (!catalog) return null;
  const l1 = findClassificationNode(h1Id);
  const { clos, slt } = getCatalogCourseCloSlt(catalogId);
  return {
    id: `pc-${catalogId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    catalogId,
    h1Id,
    h2Id,
    h3Id: h3Id || null,
    semester,
    studyType: l1?.studyType === 'elective' ? 'elective' : 'compulsory',
    language: catalog.language || 'English',
    credits: catalog.credits,
    prereqIds: [],
    synopsis: catalog.synopsis || '',
    references: catalog.references || '',
    clos: cloneJson(clos),
    slt: cloneJson(slt)
  };
}

function findProgramCourse(id) {
  return PROGRAM_COURSES.find(c => c.id === id);
}

function studyTypeTag(type) {
  if (type === 'elective') return '<span class="tag elective">选修</span>';
  return '<span class="tag compulsory">必修</span>';
}

function getCourseClassificationDisplay(pc) {
  const l1 = findClassificationNode(pc.h1Id);
  if (!l1) return '—';
  const l2 = pc.h2Id ? findClassificationNode(pc.h2Id) : null;
  const l3 = pc.h3Id ? findClassificationNode(pc.h3Id) : null;
  if (l3 && l2) return `${l1.name} / ${l2.name} / ${l3.name}`;
  if (l2) return `${l1.name} / ${l2.name}`;
  return l1.name;
}

function getProgramCourseCredits(pc) {
  const cat = COURSE_CATALOG.find(c => c.id === pc.catalogId);
  return Number(pc.credits ?? cat?.credits) || 0;
}

function courseBelongsToClassificationNode(pc, node) {
  if (!pc || !node || pc.studyType !== 'compulsory') return false;
  if (node.level === 1) return pc.h1Id === node.id;
  if (node.level === 2) return pc.h2Id === node.id;
  if (node.level === 3) return pc.h3Id === node.id;
  return false;
}

function courseBelongsToClassificationNodeAny(pc, node) {
  if (!pc || !node) return false;
  if (node.level === 1) return pc.h1Id === node.id;
  if (node.level === 2) return pc.h2Id === node.id;
  if (node.level === 3) return pc.h3Id === node.id;
  return false;
}

function sumCourseCreditsForNode(nodeId, excludeCourseId = null) {
  const node = findClassificationNode(nodeId);
  if (!node) return 0;
  return PROGRAM_COURSES
    .filter(pc => pc.id !== excludeCourseId && courseBelongsToClassificationNodeAny(pc, node))
    .reduce((sum, pc) => sum + getProgramCourseCredits(pc), 0);
}

function sumCompulsoryCreditsForNode(nodeId, excludeCourseId = null) {
  return sumCourseCreditsForNode(nodeId, excludeCourseId);
}

function validateL2L3CreditsConsistency(l2) {
  if (!l2?.children?.length) return { ok: true };
  normalizeNodeCredits(l2);
  const l2Min = Number(l2.creditsMin) || 0;
  const l2Max = getClassificationMaxCredits(l2);
  const l3Sum = sumL3CreditsMinUnderL2(l2);
  const issues = [];
  const l2Label = `二级分类「${l2.name}」`;

  if (l2.studyType === 'elective') {
    if (l3Sum > l2Min) {
      issues.push(
        `${l2Label}（选修）三级最低学分合计 ${l3Sum} 超过二级最低学分 ${l2Min}` +
        '（须：三级最低合计≤二级最低）'
      );
    }
    if (l2Max != null && l2Min > l2Max) {
      issues.push(
        `${l2Label}（选修）二级最低学分 ${l2Min} 超过二级最高学分 ${l2Max}` +
        '（须：二级最低≤二级最高）'
      );
    }
  } else {
    if (l2Max != null && l2Min !== l2Max) {
      issues.push(
        `${l2Label}（必修）最低学分 ${l2Min} 须等于最高学分 ${l2Max}` +
        '（须：二级最低=二级最高）'
      );
    }
    const target = l2Max != null ? l2Max : l2Min;
    if (l3Sum !== target) {
      issues.push(
        `${l2Label}（必修）三级最低学分合计 ${l3Sum} 须等于二级最低/最高学分 ${target}` +
        '（须：三级最低合计=二级最低=二级最高）'
      );
    }
  }

  if (issues.length) return { ok: false, message: issues.join('\n') };
  return { ok: true };
}

function sumElectiveMatrixCreditsMax() {
  let sum = 0;
  document.querySelectorAll('#elective-matrix-tbody tr[data-row]').forEach(row => {
    const raw = row.querySelector('.matrix-credit-max')?.value.trim();
    if (raw !== '') sum += Number(raw) || 0;
  });
  return sum;
}

function validateStoredElectiveMatrix(l2) {
  const issues = [];
  const reqs = ELECTIVE_SEMESTER_REQUIREMENTS[l2.id];
  if (!reqs) return issues;
  normalizeNodeCredits(l2);
  const l2Max = getClassificationMaxCredits(l2);
  let sumMax = 0;
  Object.entries(reqs).forEach(([semester, req]) => {
    normalizeElectiveSemesterReq(req);
    const min = req.creditsMin !== '' && req.creditsMin != null ? Number(req.creditsMin) : null;
    const max = req.creditsMax !== '' && req.creditsMax != null ? Number(req.creditsMax) : null;
    if (min != null && max != null && !Number.isNaN(min) && !Number.isNaN(max) && max < min) {
      issues.push(`「${l2.name}」${semester} 最高学分须≥最低学分`);
    }
    if (max != null && !Number.isNaN(max)) sumMax += max;
  });
  if (l2Max != null && sumMax > l2Max) {
    issues.push(
      `「${l2.name}」各学期最高学分之和（${sumMax}）超过二级分类最高学分限制（${l2Max}）`
    );
  }
  return issues;
}

function getClassificationLevelLabel(level) {
  return { 1: '一级', 2: '二级', 3: '三级' }[level] || '';
}

function getClassificationMaxCredits(node) {
  if (!node) return null;
  normalizeNodeCredits(node);
  if (node.level === 3) {
    if (node.creditsMax != null && node.creditsMax !== '') return Number(node.creditsMax);
    if (node.creditsMin != null && node.creditsMin !== '') return Number(node.creditsMin);
    return null;
  }
  return calcNodeCreditsMax(node);
}

function getEffectiveCourseCreditCap(node) {
  if (!node) return null;
  normalizeNodeCredits(node);
  if (node.level === 3) {
    if (node.creditsMax != null && node.creditsMax !== '') return Number(node.creditsMax);
    if (node.creditsMin != null && node.creditsMin !== '') return Number(node.creditsMin);
    return null;
  }
  if (node.level === 2 && node.children?.length) {
    return null;
  }
  return getClassificationMaxCredits(node);
}

function isCompulsoryCourseClassification(h1Id) {
  const l1 = findClassificationNode(h1Id);
  return l1?.studyType !== 'elective';
}

function isElectiveClassificationNode(node) {
  if (!node) return false;
  if (node.studyType === 'elective') return true;
  if (node.level === 3) {
    const l2 = findL2Parent(node.id);
    return l2?.studyType === 'elective';
  }
  return false;
}

function validateCourseCreditsOnAdd({ h2Id, credits, excludeCourseId = null }) {
  const addCredits = Number(credits) || 0;
  if (addCredits <= 0 || !h2Id) return { ok: true };

  const l2 = findClassificationNode(h2Id);
  if (!l2 || l2.level !== 2) return { ok: true };
  if (isElectiveClassificationNode(l2)) return { ok: true };

  normalizeNodeCredits(l2);
  const l2Max = getClassificationMaxCredits(l2);
  if (l2Max == null) return { ok: true };

  const current = sumCourseCreditsForNode(l2.id, excludeCourseId);
  const after = current + addCredits;
  if (after > l2Max) {
    return {
      ok: false,
      message: `课程学分之和超过「${l2.name}」二级分类的最高学分限制（${l2Max}）；当前已配置 ${current}，添加后为 ${after}`
    };
  }
  return { ok: true };
}

function validateCompulsoryCourseMaxCredits(params) {
  return validateCourseCreditsOnAdd(params);
}

function validateCreditsForVersionSubmit() {
  const shortcomings = [];

  CLASSIFICATION_TREE.forEach(l1 => {
    (l1.children || []).forEach(l2 => {
      normalizeNodeCredits(l2);
      const l2Min = Number(l2.creditsMin) || 0;
      const l2Max = getClassificationMaxCredits(l2);
      const l2Configured = sumCourseCreditsForNode(l2.id);

      if (l2.children?.length) {
        const structure = validateL2L3CreditsConsistency(l2);
        if (!structure.ok) shortcomings.push(structure.message);
      }

      if (l2Min > 0 && l2Configured < l2Min) {
        shortcomings.push(
          `「${l2.name}」（二级${l2.studyType === 'elective' ? '·选修' : ''}）` +
          `课程学分之和 ${l2Configured} 小于最低学分要求 ${l2Min}`
        );
      }
      if (l2.studyType !== 'elective' && l2Max != null && l2Configured > l2Max) {
        shortcomings.push(
          `「${l2.name}」（二级）最高学分 ${l2Max}，当前已配置课程学分 ${l2Configured}`
        );
      }

      if (l2.studyType === 'elective') {
        shortcomings.push(...validateStoredElectiveMatrix(l2));
      }

      (l2.children || []).forEach(l3 => {
        normalizeNodeCredits(l3);
        const l3Min = Number(l3.creditsMin) || 0;
        const l3Configured = sumCourseCreditsForNode(l3.id);
        if (l3Min > 0 && l3Configured < l3Min) {
          shortcomings.push(
            `「${l3.name}」（三级${l3.studyType === 'elective' ? '·选修' : ''}）` +
            `课程学分之和 ${l3Configured} 小于最低学分要求 ${l3Min}`
          );
        }
      });
    });
  });

  if (shortcomings.length) {
    return {
      ok: false,
      message: `学分校验未通过，无法提交审批：\n${shortcomings.join('\n')}`
    };
  }
  return { ok: true };
}

function validateCompulsoryMinCreditsForSubmit() {
  return validateCreditsForVersionSubmit();
}

function submitCurrentVersionForApproval() {
  if (currentExecPlan || versionEditReadonly) return;
  if (currentChangeApplication) {
    requestSubmitChangeApplication();
    return;
  }
  if (!currentEditVersion) return;
  const result = validateCompulsoryMinCreditsForSubmit();
  if (!result.ok) {
    alert(result.message);
    return;
  }
  requestSubmitVersion(currentEditVersion.id);
}

function getCourseClassificationShort(pc) {
  const l2 = pc.h2Id ? findClassificationNode(pc.h2Id) : null;
  const l3 = pc.h3Id ? findClassificationNode(pc.h3Id) : null;
  if (l3) return l3.name;
  if (l2) return l2.name;
  return findClassificationNode(pc.h1Id)?.name || '—';
}

function getCourseClassificationL1(h1Id) {
  return findClassificationNode(h1Id)?.name || '—';
}

function getCourseClassificationL2(h2Id) {
  return h2Id ? (findClassificationNode(h2Id)?.name || '—') : '—';
}

function getCourseClassificationL3(h3Id) {
  return h3Id ? (findClassificationNode(h3Id)?.name || '—') : '—';
}

function getElectiveL2Categories() {
  const list = [];
  CLASSIFICATION_TREE.forEach(l1 => {
    if (l1.studyType !== 'elective') return;
    (l1.children || []).forEach(l2 => {
      if (l2.level === 2) list.push({ l1, l2 });
    });
  });
  return list;
}

function renderSemesterMatrixTable() {
  const tbody = document.getElementById('semester-matrix-tbody');
  if (!tbody) return;
  const codes = getAllSemesterCodes();
  const categories = getElectiveL2Categories();

  if (!categories.length) {
    tbody.innerHTML = `<tr><td colspan="${2 + codes.length}" class="matrix-empty">暂无选修类二级分类</td></tr>`;
    return;
  }

  tbody.innerHTML = categories.map(({ l1, l2 }) => {
    const reqs = ELECTIVE_SEMESTER_REQUIREMENTS[l2.id] || {};
    const minCells = codes.map(code => {
      const v = normalizeElectiveSemesterReq(reqs[code])?.creditsMin;
      return `<td>${v != null && v !== '' ? v : '—'}</td>`;
    }).join('');
    const maxCells = codes.map(code => {
      const v = normalizeElectiveSemesterReq(reqs[code])?.creditsMax;
      return `<td>${v != null && v !== '' ? v : '—'}</td>`;
    }).join('');
    const countCells = codes.map(code => {
      const v = reqs[code]?.count;
      return `<td>${v != null && v !== '' ? v : '—'}</td>`;
    }).join('');
    return `
      <tr>
        <td class="sticky-col-cat cat-cell" rowspan="3">${escapeHtml(l2.name)}</td>
        <td class="sticky-col-req req-cell">最低学分</td>
        ${minCells}
      </tr>
      <tr>
        <td class="sticky-col-req req-cell">最高学分</td>
        ${maxCells}
      </tr>
      <tr>
        <td class="sticky-col-req req-cell">课程数</td>
        ${countCells}
      </tr>`;
  }).join('');
}

function buildElectivePoolCourseEntries() {
  const entries = [];
  getElectiveL2Categories().forEach(({ l1, l2 }) => {
    const reqs = ELECTIVE_SEMESTER_REQUIREMENTS[l2.id] || {};
    Object.entries(reqs).forEach(([semester, req]) => {
      normalizeElectiveSemesterReq(req);
      const count = Number(req.count) || 0;
      const credits = Number(req.creditsMin) || 0;
      if (count <= 0) return;
      const creditPerCourse = count > 0 ? credits / count : credits;
      const creditDisplay = Number.isInteger(creditPerCourse)
        ? creditPerCourse
        : Math.round(creditPerCourse * 10) / 10;
      for (let i = 0; i < count; i++) {
        entries.push({
          semester,
          name: l2.name,
          code: 'GXXXX',
          cls: l1.name,
          credit: creditDisplay,
          elective: true,
          isPool: true
        });
      }
    });
  });
  return entries;
}

function parseSemesterCode(code) {
  const m = /^Y(\d+)S(\d+)$/.exec(code || '');
  if (!m) return null;
  return { year: Number(m[1]), sem: Number(m[2]) };
}

function buildProgrammeStructureFromCourses() {
  const v = currentEditVersion;
  const programmeKey = v?.programmeKey || 'finance';
  const programme = PROGRAMMES[programmeKey];
  const programmeName = programme ? `${programme.name} (${programme.nameZh})` : 'Programme';

  const bySemester = {};
  PROGRAM_COURSES.forEach(pc => {
    if (!pc.semester) return;
    const cat = COURSE_CATALOG.find(c => c.id === pc.catalogId);
    if (!cat) return;
    if (!bySemester[pc.semester]) bySemester[pc.semester] = [];
    bySemester[pc.semester].push({
      name: cat.name,
      code: cat.code,
      cls: getCourseClassificationL1(pc.h1Id),
      credit: pc.credits ?? cat.credits,
      elective: pc.studyType === 'elective'
    });
  });

  const poolEntries = buildElectivePoolCourseEntries();
  poolEntries.forEach(entry => {
    if (!bySemester[entry.semester]) bySemester[entry.semester] = [];
    bySemester[entry.semester].push(entry);
  });

  const poolCredits = poolEntries.reduce((s, e) => s + (e.credit || 0), 0);
  const totalCredits = PROGRAM_COURSES.reduce((sum, pc) => {
    if (!pc.semester) return sum;
    const cat = COURSE_CATALOG.find(c => c.id === pc.catalogId);
    return sum + (pc.credits ?? cat?.credits ?? 0);
  }, 0) + poolCredits;

  const yearsMap = new Map();
  Object.entries(bySemester).forEach(([code, courses]) => {
    const parsed = parseSemesterCode(code);
    if (!parsed || !courses.length) return;
    if (!yearsMap.has(parsed.year)) yearsMap.set(parsed.year, new Map());
    yearsMap.get(parsed.year).set(parsed.sem, {
      label: `Semester ${parsed.sem}`,
      weeks: SEMESTER_WEEKS[parsed.sem] || 18,
      courses
    });
  });

  const years = [...yearsMap.keys()].sort((a, b) => a - b).map(year => {
    const semMap = yearsMap.get(year);
    const semesters = [];
    for (let sem = 1; sem <= SEMESTERS_PER_YEAR; sem++) {
      semesters.push(semMap.get(sem) || {
        label: `Semester ${sem}`,
        weeks: SEMESTER_WEEKS[sem] || 18,
        courses: []
      });
    }
    return { year, semesters };
  });

  return {
    institution: 'Xiamen University Malaysia',
    programme: programmeName,
    totalCredits: totalCredits || '—',
    years
  };
}

function refreshProgrammeStructureIfVisible() {
  if (document.getElementById('tab-structure')?.classList.contains('active')) {
    renderProgrammeStructure('programme-structure-root');
  }
}

function getCourseCreditsStatusClass(configured, min, max, { enforceMax = true } = {}) {
  if (min > 0 && configured < min) return 'warn';
  if (enforceMax && max != null && configured > max) return 'warn';
  if (min > 0 && configured >= min && (!enforceMax || max == null || configured <= max)) return 'ok';
  if (!enforceMax && min <= 0) return '';
  if (!enforceMax && configured > 0) return 'ok';
  return '';
}

function getCourseCreditsStatusMeta(configured, min, max, options = {}) {
  const cls = getCourseCreditsStatusClass(configured, min, max, options);
  if (cls === 'warn') return { cls, text: '不足' };
  if (cls === 'ok') return { cls, text: '达标' };
  return { cls: 'neutral', text: '—' };
}

function formatCourseCreditsRequirement(min, max, isElective = false) {
  if (isElective) {
    return min > 0 ? `≥ ${min}` : '—';
  }
  if (max != null) return min === max ? `${min}` : `${min} ~ ${max}`;
  if (min > 0) return `≥ ${min}`;
  return '—';
}

function renderCourseCreditsSummaryRow({ name, level, configured, min, max, isElective = false }) {
  const status = getCourseCreditsStatusMeta(configured, min, max, { enforceMax: false });
  const isL3 = level === 3;
  const rowCls = isL3 ? 'row-l3' : 'row-l2';
  const indentCls = isL3 ? 'indent-2' : 'indent-1';
  const prefix = isL3 ? '└' : '├';
  return `<tr class="${rowCls} credits-summary-row status-${status.cls}">` +
    `<td class="col-name ${indentCls}">${prefix} ${escapeHtml(name)}</td>` +
    `<td class="col-num"><strong>${configured}</strong></td>` +
    `<td class="col-req">${formatCourseCreditsRequirement(min, max, isElective)}</td>` +
    `<td class="col-status"><span class="status-badge ${status.cls}">${status.text}</span></td>` +
    `</tr>`;
}

let courseCreditsSummaryExpanded = true;

function toggleCourseCreditsSummary() {
  courseCreditsSummaryExpanded = !courseCreditsSummaryExpanded;
  const el = document.getElementById('course-credits-summary');
  if (el) el.classList.toggle('is-collapsed', !courseCreditsSummaryExpanded);
}

function syncProgramCourseFilterOptions() {
  const sel = document.getElementById('program-course-h1-filter');
  if (!sel) return;
  const current = sel.value;
  const options = ['<option value="">全部分类</option>']
    .concat(CLASSIFICATION_TREE.map(l1 =>
      `<option value="${l1.id}">${escapeHtml(l1.name)}</option>`
    ));
  sel.innerHTML = options.join('');
  if ([...sel.options].some(o => o.value === current)) sel.value = current;
}

function bindProgramCourseFilters() {
  const sel = document.getElementById('program-course-h1-filter');
  const search = document.getElementById('program-course-search');
  if (sel && !sel.dataset.bound) {
    sel.dataset.bound = '1';
    sel.addEventListener('change', () => renderProgramCoursesTable());
  }
  if (search && !search.dataset.bound) {
    search.dataset.bound = '1';
    search.addEventListener('input', () => renderProgramCoursesTable());
  }
}

function getProgramCourseFilters() {
  return {
    h1Id: document.getElementById('program-course-h1-filter')?.value || '',
    query: document.getElementById('program-course-search')?.value.trim().toLowerCase() || ''
  };
}

function matchesProgramCourseFilters(pc, cat, { h1Id, query }) {
  if (h1Id && pc.h1Id !== h1Id) return false;
  if (query) {
    const haystack = `${cat.code} ${cat.name}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
}

function renderCourseCreditsSummary() {
  const el = document.getElementById('course-credits-summary');
  if (!el) return;
  if (!CLASSIFICATION_TREE.length) {
    el.innerHTML = '';
    el.style.display = 'none';
    return;
  }
  const groups = [];
  CLASSIFICATION_TREE.forEach(l1 => {
    const rows = [];
    (l1.children || []).forEach(l2 => {
      normalizeNodeCredits(l2);
      const l2Min = Number(l2.creditsMin) || 0;
      const l2Max = getClassificationMaxCredits(l2);
      const l2Sum = sumCourseCreditsForNode(l2.id);
      rows.push(renderCourseCreditsSummaryRow({
        name: l2.name,
        level: 2,
        configured: l2Sum,
        min: l2Min,
        max: l2Max,
        isElective: isElectiveClassificationNode(l2)
      }));
      (l2.children || []).forEach(l3 => {
        normalizeNodeCredits(l3);
        const l3Min = Number(l3.creditsMin) || 0;
        const l3Sum = sumCourseCreditsForNode(l3.id);
        rows.push(renderCourseCreditsSummaryRow({
          name: l3.name,
          level: 3,
          configured: l3Sum,
          min: l3Min,
          max: null,
          isElective: isElectiveClassificationNode(l3)
        }));
      });
    });
    if (rows.length) {
      groups.push(
        `<tr class="row-l1${l1.highlight ? ' highlight' : ''}">` +
        `<td colspan="4" class="col-name">` +
        `<span class="tree-toggle">▼</span> ${escapeHtml(l1.name)}</td></tr>` +
        rows.join('')
      );
    }
  });
  if (!groups.length) {
    el.innerHTML = '';
    el.style.display = 'none';
    return;
  }
  el.style.display = 'block';
  el.classList.toggle('is-collapsed', !courseCreditsSummaryExpanded);
  el.innerHTML =
    `<div class="credits-summary-head" onclick="toggleCourseCreditsSummary()" role="button" tabindex="0"` +
    ` onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleCourseCreditsSummary();}">` +
    `<span class="credits-summary-title">` +
    `<span class="credits-summary-chevron" aria-hidden="true">▼</span>分类课程学分配置情况</span>` +
    `</div>` +
    `<div class="credits-summary-body">` +
    `<table class="credits-summary-table tree-table">` +
    `<thead><tr>` +
    `<th class="col-name">分类</th>` +
    `<th class="col-num">已配置学分</th>` +
    `<th class="col-req">学分要求</th>` +
    `<th class="col-status">状态</th>` +
    `</tr></thead>` +
    `<tbody>${groups.join('')}</tbody></table></div>`;
}

function renderProgramCoursesTable() {
  const tbody = document.getElementById('program-courses-tbody');
  if (!tbody) return;
  renderProgramCourseTableHeader();
  syncProgramCourseFilterOptions();
  renderCourseCreditsSummary();
  const filters = getProgramCourseFilters();
  const execMode = isExecPlanEditMode();
  const colSpan = execMode ? 10 : 9;
  const rows = PROGRAM_COURSES
    .map(pc => {
      const cat = COURSE_CATALOG.find(c => c.id === pc.catalogId);
      if (!cat || !matchesProgramCourseFilters(pc, cat, filters)) return '';
      const actions = versionEditReadonly
        ? `<a href="#" class="view-link" onclick="openViewProgramCourse('${pc.id}');return false">查看</a>`
        : `<a href="#" onclick="openEditProgramCourse('${pc.id}');return false">编辑</a>` +
          `<a href="#" class="danger" onclick="requestRemoveProgramCourse('${pc.id}');return false">移除</a>`;
      const actualSemesterCell = execMode
        ? `<td class="col-center"><code>${escapeHtml(pc.actualSemester || getActualOfferingSemester(pc.semester, currentExecPlan?.intake) || '—')}</code></td>`
        : '';
      return `<tr>
        <td><code>${escapeHtml(cat.code)}</code></td>
        <td>${escapeHtml(cat.name)}</td>
        <td>${escapeHtml(getCourseClassificationL1(pc.h1Id))}</td>
        <td>${escapeHtml(getCourseClassificationL2(pc.h2Id))}</td>
        <td>${escapeHtml(getCourseClassificationL3(pc.h3Id))}</td>
        <td class="col-center">${pc.credits ?? cat.credits}</td>
        <td class="col-center">${escapeHtml(pc.semester || '—')}</td>
        ${actualSemesterCell}
        <td class="col-center">${studyTypeTag(pc.studyType)}</td>
        <td class="actions">${actions}</td>
      </tr>`;
    })
    .filter(Boolean);
  tbody.innerHTML = rows.length
    ? rows.join('')
    : `<tr><td colspan="${colSpan}" class="text-muted" style="text-align:center;padding:24px">暂无匹配课程</td></tr>`;
  refreshProgrammeStructureIfVisible();
}

function requestRemoveProgramCourse(pcId) {
  if (versionEditReadonly) return;
  const pc = findProgramCourse(pcId);
  if (!pc) return;
  const cat = COURSE_CATALOG.find(c => c.id === pc.catalogId);
  const code = cat?.code || '—';
  const name = cat?.name || '该课程';
  const classification = getCourseClassificationDisplay(pc);
  openDeleteConfirm({
    title: '确认移除课程',
    message: `确定从本方案中移除课程「<strong>${escapeHtml(code)} ${escapeHtml(name)}</strong>」吗？此操作不可撤销。`,
    hint: classification !== '—' ? `分类：${classification}` : '',
    onConfirm: () => removeProgramCourse(pcId)
  });
}

function removeProgramCourse(pcId) {
  const idx = PROGRAM_COURSES.findIndex(pc => pc.id === pcId);
  if (idx < 0) return;
  PROGRAM_COURSES.splice(idx, 1);
  renderProgramCoursesTable();
  updateVersionEditTabStates();
}

function setCoursePickerSectionVisible(visible) {
  const section = document.getElementById('course-picker-section');
  if (section) section.classList.toggle('is-hidden', !visible);
}

function setCourseClassificationValues(h1Id, h2Id, h3Id) {
  const h1 = document.getElementById('course-h1-select');
  if (h1 && h1Id) {
    h1.value = h1Id;
    onCourseH1Change();
  }
  const h2 = document.getElementById('course-h2-select');
  if (h2 && h2Id) {
    h2.value = h2Id;
    onCourseH2Change();
  }
  const h3 = document.getElementById('course-h3-select');
  if (h3 && h3Id) {
    h3.value = h3Id;
  }
  updateCourseSaveButtonState();
}

function fillCourseFormFromProgramCourse(pc) {
  const catalog = COURSE_CATALOG.find(c => c.id === pc.catalogId);
  if (!catalog) return;
  selectedCatalogCourseId = pc.catalogId;
  selectedPrereqCourseIds = [...(pc.prereqIds || [])];
  setCourseFormDetailsEnabled(true);
  document.getElementById('course-code-input').value = catalog.code;
  document.getElementById('course-name-input').value = catalog.name;
  document.getElementById('course-dept-input').value = catalog.department;
  document.getElementById('course-coordinator-input').value = catalog.coordinator;
  document.getElementById('course-credits-input').value = pc.credits ?? catalog.credits;
  const lang = document.getElementById('course-language-select');
  if (lang) lang.value = pc.language || catalog.language || 'English';
  document.getElementById('course-prereq-input').value = formatPrereqDisplay(selectedPrereqCourseIds);
  document.getElementById('course-synopsis-input').value = pc.synopsis ?? catalog.synopsis ?? '';
  document.getElementById('course-refs-input').value = pc.references ?? catalog.references ?? '';
  setOfferingSemesterEnabled(Boolean(pc.semester), pc.semester || 'Y1S1');
  setCourseClassificationValues(pc.h1Id, pc.h2Id, pc.h3Id);
  syncOfferingSemesterControl();
  updateCourseCharCounts();
}

function readCourseFormIntoProgramCourse(pc) {
  const h1 = document.getElementById('course-h1-select');
  const h2 = document.getElementById('course-h2-select');
  const h3 = document.getElementById('course-h3-select');
  const offering = document.getElementById('offering-semester-select');
  const credits = document.getElementById('course-credits-input');
  const lang = document.getElementById('course-language-select');
  const synopsis = document.getElementById('course-synopsis-input');
  const refs = document.getElementById('course-refs-input');
  if (h1?.value) pc.h1Id = h1.value;
  if (h2?.value) pc.h2Id = h2.value;
  pc.h3Id = isCourseH3Required() && h3?.value ? h3.value : null;
  if (isCourseFormCompulsory() || isOfferingSemesterEnabled()) {
    pc.semester = offering?.value || null;
  } else {
    pc.semester = null;
  }
  if (credits?.value !== '') pc.credits = Number(credits.value);
  if (lang?.value) pc.language = lang.value;
  pc.prereqIds = [...selectedPrereqCourseIds];
  if (synopsis) pc.synopsis = synopsis.value;
  if (refs) pc.references = refs.value;
  const l1 = findClassificationNode(pc.h1Id);
  pc.studyType = l1?.studyType === 'elective' ? 'elective' : 'compulsory';
  finalizeProgramCourseForContext(pc);
}

function renderProgramCourseTableHeader() {
  const thead = document.querySelector('#tab-courses .data-table thead tr');
  if (!thead) return;
  const execMode = isExecPlanEditMode();
  thead.innerHTML = execMode
    ? '<th>课号</th><th>课名</th><th>Classification(H1)</th><th>Classification(H2)</th>' +
      '<th>Classification(H3)</th><th class="col-center">学分</th><th class="col-center">开课学期</th>' +
      '<th class="col-center">实际开课学期</th><th class="col-center">课程性质</th><th>操作</th>'
    : '<th>课号</th><th>课名</th><th>Classification(H1)</th><th>Classification(H2)</th>' +
      '<th>Classification(H3)</th><th class="col-center">学分</th><th class="col-center">开课学期</th>' +
      '<th class="col-center">课程性质</th><th>操作</th>';
}

function formatPrereqDisplay(ids) {
  return ids.map(id => {
    const c = COURSE_CATALOG.find(x => x.id === id);
    return c ? `${c.code} — ${c.name}` : '';
  }).filter(Boolean).join('；');
}

function isPrereqPickerSelected(id) {
  return pendingPrereqCourseIds.includes(id);
}

function getCourseCatalogOfferings() {
  return [...new Set(COURSE_CATALOG.map(c => c.department))].sort();
}

function rebuildOfferingFilterOptions() {
  const sel = document.getElementById('picker-filter-offering');
  if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = '<option value="">please select</option>' +
    getCourseCatalogOfferings().map(d => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');
  if (cur) sel.value = cur;
}

function filterCourseCatalogList() {
  const name = document.getElementById('picker-filter-name')?.value.trim().toLowerCase() || '';
  const code = document.getElementById('picker-filter-code')?.value.trim().toLowerCase() || '';
  const offering = document.getElementById('picker-filter-offering')?.value || '';
  return COURSE_CATALOG.filter(c => {
    if (name && !c.name.toLowerCase().includes(name)) return false;
    if (code && !c.code.toLowerCase().includes(code)) return false;
    if (offering && c.department !== offering) return false;
    return true;
  });
}

function renderCoursePickerTable(list) {
  coursePickerFilteredList = list;
  const tbody = document.getElementById('course-picker-tbody');
  const countEl = document.getElementById('course-picker-count');
  if (!tbody) return;

  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="matrix-empty">No records found</td></tr>';
    if (countEl) countEl.textContent = 'Total 0 records';
    return;
  }

  if (coursePickerMode === 'prereq' || coursePickerMode === 'batch') {
    tbody.innerHTML = list.map((c, i) => {
      const disabled = coursePickerMode === 'prereq'
        ? c.id === selectedCatalogCourseId
        : isBatchCourseDisabled(c.id);
      const selected = coursePickerMode === 'prereq'
        ? isPrereqPickerSelected(c.id)
        : isBatchPickerSelected(c.id);
      const toggleFn = coursePickerMode === 'prereq'
        ? `togglePrereqPickerRow('${c.id}')`
        : `toggleBatchPickerRow('${c.id}')`;
      return `
        <tr class="picker-row${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}" onclick="${toggleFn}">
          <td class="col-radio"><input type="checkbox" ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''} onclick="event.stopPropagation();${toggleFn}"></td>
          <td>${i + 1}</td>
          <td><code>${escapeHtml(c.code)}</code></td>
          <td>${escapeHtml(c.name)}${disabled && coursePickerMode === 'batch' ? ' <span class="text-muted">（已添加）</span>' : ''}</td>
          <td>${escapeHtml(c.department)}</td>
          <td>${c.credits}</td>
          <td>${escapeHtml(c.classification || '—')}</td>
        </tr>`;
    }).join('');
    const selectedCount = coursePickerMode === 'prereq'
      ? pendingPrereqCourseIds.length
      : pendingBatchCourseIds.length;
    if (countEl) countEl.textContent = `Total ${list.length} records · 已选 ${selectedCount} 门`;
    return;
  }

  tbody.innerHTML = list.map((c, i) => `
    <tr class="picker-row${pendingPickerCourseId === c.id ? ' selected' : ''}" onclick="selectCoursePickerRow('${c.id}')">
      <td class="col-radio"><input type="radio" name="course-pick" value="${c.id}" ${pendingPickerCourseId === c.id ? 'checked' : ''} onclick="event.stopPropagation();selectCoursePickerRow('${c.id}')"></td>
      <td>${i + 1}</td>
      <td><code>${escapeHtml(c.code)}</code></td>
      <td>${escapeHtml(c.name)}</td>
      <td>${escapeHtml(c.department)}</td>
      <td>${c.credits}</td>
      <td>${escapeHtml(c.classification || '—')}</td>
    </tr>`).join('');
  if (countEl) countEl.textContent = `Total ${list.length} records`;
}

function togglePrereqPickerRow(id) {
  if (id === selectedCatalogCourseId) return;
  const idx = pendingPrereqCourseIds.indexOf(id);
  if (idx >= 0) pendingPrereqCourseIds.splice(idx, 1);
  else pendingPrereqCourseIds.push(id);
  renderCoursePickerTable(coursePickerFilteredList);
}

function isBatchPickerSelected(id) {
  return pendingBatchCourseIds.includes(id);
}

function toggleBatchPickerRow(id) {
  if (isBatchCourseDisabled(id)) return;
  const idx = pendingBatchCourseIds.indexOf(id);
  if (idx >= 0) pendingBatchCourseIds.splice(idx, 1);
  else pendingBatchCourseIds.push(id);
  renderCoursePickerTable(coursePickerFilteredList);
}

function selectCoursePickerRow(id) {
  pendingPickerCourseId = id;
  renderCoursePickerTable(coursePickerFilteredList);
}

function searchCourseCatalog() {
  renderCoursePickerTable(filterCourseCatalogList());
}

function resetCoursePickerSearch() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  set('picker-filter-name', '');
  set('picker-filter-code', '');
  set('picker-filter-offering', '');
  if (coursePickerMode === 'prereq') {
    pendingPrereqCourseIds = [...selectedPrereqCourseIds];
  } else if (coursePickerMode === 'batch') {
    pendingBatchCourseIds = [...batchSelectedCatalogIds];
    pendingPickerCourseId = null;
  } else {
    pendingPickerCourseId = selectedCatalogCourseId;
  }
  renderCoursePickerTable(COURSE_CATALOG);
}

function openCoursePickerModal(mode = 'main') {
  coursePickerMode = mode;
  const title = document.getElementById('course-picker-title');
  if (title) {
    const titles = {
      prereq: '选择先修课程（可多选）',
      batch: '选择课程（可多选）',
      main: '选择课程'
    };
    title.textContent = titles[mode] || titles.main;
  }
  if (mode === 'prereq') {
    pendingPrereqCourseIds = [...selectedPrereqCourseIds];
    pendingPickerCourseId = null;
    pendingBatchCourseIds = [];
  } else if (mode === 'batch') {
    pendingBatchCourseIds = [...batchSelectedCatalogIds];
    pendingPickerCourseId = null;
    pendingPrereqCourseIds = [];
  } else {
    pendingPickerCourseId = selectedCatalogCourseId;
    pendingPrereqCourseIds = [];
    pendingBatchCourseIds = [];
  }
  rebuildOfferingFilterOptions();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  set('picker-filter-name', '');
  set('picker-filter-code', '');
  set('picker-filter-offering', '');
  renderCoursePickerTable(COURSE_CATALOG);
  document.getElementById('modal-course-picker')?.classList.add('open');
}

function openBatchCoursePickerModal() {
  openCoursePickerModal('batch');
}

function openPrereqCoursePickerModal() {
  if (!selectedCatalogCourseId) {
    alert('请先选择要新增的课程');
    return;
  }
  openCoursePickerModal('prereq');
}

function cancelCoursePicker() {
  pendingPickerCourseId = null;
  pendingPrereqCourseIds = [];
  pendingBatchCourseIds = [];
  document.getElementById('modal-course-picker')?.classList.remove('open');
}

function applySelectedCourse(course) {
  if (!course) return;
  selectedCatalogCourseId = course.id;
  selectedPrereqCourseIds = selectedPrereqCourseIds.filter(id => id !== course.id);
  document.getElementById('course-prereq-input').value = formatPrereqDisplay(selectedPrereqCourseIds);
  setCourseFormDetailsEnabled(true);
  document.getElementById('course-code-input').value = course.code;
  document.getElementById('course-name-input').value = course.name;
  document.getElementById('course-dept-input').value = course.department;
  document.getElementById('course-coordinator-input').value = course.coordinator;
  document.getElementById('course-credits-input').value = course.credits;
  const lang = document.getElementById('course-language-select');
  if (lang) lang.value = course.language || 'English';
  document.getElementById('course-synopsis-input').value = course.synopsis || '';
  document.getElementById('course-refs-input').value = course.references || '';
  const display = document.getElementById('course-picker-display');
  if (display) display.value = `${course.code} — ${course.name}`;
  updateCourseCharCounts();
  const hint = document.getElementById('course-picker-hint');
  if (hint) {
    hint.textContent = `已选择：${course.code} ${course.name}。课程库 CLO / SLT 已带入，可在 Step 2、3 中编辑；请继续填写方案内分类与开课学期。`;
  }
  initCourseModalDraftFromCatalog(course.id);
  syncOfferingSemesterControl();
  if (courseModalStep === 2) renderCloTable();
  if (courseModalStep === 3) renderSltAll();
  updateCourseSaveButtonState();
}

function confirmCoursePicker() {
  if (coursePickerMode === 'prereq') {
    selectedPrereqCourseIds = pendingPrereqCourseIds.filter(id => id !== selectedCatalogCourseId);
    document.getElementById('course-prereq-input').value = formatPrereqDisplay(selectedPrereqCourseIds);
    cancelCoursePicker();
    return;
  }

  if (coursePickerMode === 'batch') {
    batchSelectedCatalogIds = pendingBatchCourseIds.filter(id => !isBatchCourseDisabled(id));
    updateBatchCoursePickerDisplay();
    updateBatchAddButtonState();
    cancelCoursePicker();
    return;
  }

  if (!pendingPickerCourseId) {
    alert('请选择一门课程');
    return;
  }
  const course = COURSE_CATALOG.find(c => c.id === pendingPickerCourseId);
  if (!course) return;
  applySelectedCourse(course);
  cancelCoursePicker();
}

function clearCourseFormFields() {
  selectedCatalogCourseId = null;
  selectedPrereqCourseIds = [];
  pendingPickerCourseId = null;
  pendingPrereqCourseIds = [];
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  set('course-picker-display', '');
  set('course-code-input', '');
  set('course-name-input', '');
  set('course-dept-input', '');
  set('course-coordinator-input', '');
  set('course-credits-input', '');
  set('course-prereq-input', '');
  set('course-synopsis-input', '');
  set('course-refs-input', '');
  syncOfferingSemesterControl();
  const lang = document.getElementById('course-language-select');
  if (lang) lang.value = 'English';
  updateCourseCharCounts();
}

function updateCourseCharCounts() {
  const syn = document.getElementById('course-synopsis-input');
  const refs = document.getElementById('course-refs-input');
  const synCount = document.getElementById('course-synopsis-count');
  const refsCount = document.getElementById('course-refs-count');
  if (syn && synCount) synCount.textContent = `${(syn.value || '').length}/500`;
  if (refs && refsCount) refsCount.textContent = `${(refs.value || '').length}/500`;
}

function setCourseFormDetailsEnabled(enabled) {
  const details = document.getElementById('course-form-details');
  if (details) details.classList.toggle('course-form-disabled', !enabled);
}

function resetCoursePicker() {
  cancelCoursePicker();
  clearCourseFormFields();
  setCourseFormDetailsEnabled(false);
  const hint = document.getElementById('course-picker-hint');
  if (hint) hint.textContent = '须先从教务课程库选择一门课程；选定后自动带出课号、课名、开课单位与负责人。';
}

function refreshCourseClassificationSelects() {
  const h1 = document.getElementById('course-h1-select');
  const h2 = document.getElementById('course-h2-select');
  const h3 = document.getElementById('course-h3-select');
  const hint = document.getElementById('course-classification-hint');
  if (!h1 || !h2 || !h3) return false;

  const l1List = CLASSIFICATION_TREE.filter(l1 => l1.children?.length);
  if (!l1List.length) {
    h1.innerHTML = '<option value="">暂无分类</option>';
    h2.innerHTML = '<option value="">暂无分类</option>';
    h3.innerHTML = '<option value="">—</option>';
    h1.disabled = h2.disabled = h3.disabled = true;
    updateCourseH3FieldState(false);
    if (hint) {
      hint.innerHTML = '<strong>无法新增课程：</strong>请先在 TAB1 课程分类中建设至少一个一级分类及其二级分类。';
    }
    updateCourseSaveButtonState();
    return false;
  }

  h1.disabled = false;
  h1.innerHTML = l1List.map(l1 => `<option value="${l1.id}">${escapeHtml(l1.name)}</option>`).join('');
  if (hint) {
    hint.textContent = '课程分类选项来自 TAB1 已建设的分类树；有三级分类时须选择 H3。';
  }
  onCourseH1Change();
  return true;
}

function onCourseH1Change() {
  const h1Id = document.getElementById('course-h1-select')?.value;
  const h2 = document.getElementById('course-h2-select');
  const l1 = findClassificationNode(h1Id);
  const l2List = l1?.children || [];
  if (!h2) return;

  if (!l2List.length) {
    h2.innerHTML = '<option value="">无二级分类</option>';
    h2.disabled = true;
  } else {
    h2.disabled = false;
    h2.innerHTML = l2List.map(l2 => `<option value="${l2.id}">${escapeHtml(l2.name)}</option>`).join('');
  }
  onCourseH2Change();
  syncOfferingSemesterControl();
}

function updateCourseH3FieldState(hasL3) {
  const label = document.getElementById('course-h3-label');
  const wrap = document.getElementById('course-h3-wrap');
  const hint = document.getElementById('course-h3-hint');
  if (label) label.classList.toggle('req', hasL3);
  if (wrap) wrap.classList.toggle('field-disabled', !hasL3);
  if (hint) {
    hint.textContent = hasL3 ? '该二级分类下有三级分类，请选择（必填）' : '该二级分类无三级分类，无需填写';
  }
}

function onCourseH2Change() {
  const h2Id = document.getElementById('course-h2-select')?.value;
  const h3 = document.getElementById('course-h3-select');
  const l2 = findClassificationNode(h2Id);
  const l3List = l2?.children || [];
  if (!h3) return;

  const hasL3 = l3List.length > 0;
  const prevH3 = h3.value;
  updateCourseH3FieldState(hasL3);

  if (!hasL3) {
    h3.innerHTML = '<option value="">—</option>';
    h3.value = '';
    h3.disabled = true;
  } else {
    h3.disabled = false;
    h3.innerHTML = '<option value="">请选择</option>' +
      l3List.map(l3 => `<option value="${l3.id}">${escapeHtml(l3.name)}</option>`).join('');
    h3.value = l3List.some(l3 => l3.id === prevH3) ? prevH3 : '';
  }
  updateCourseSaveButtonState();
}

function validateCourseSubmit() {
  const editing = editingProgramCourseId ? findProgramCourse(editingProgramCourseId) : null;

  if (!editing && !selectedCatalogCourseId) {
    return { ok: false, message: '请先从课程库选择一门课程' };
  }
  if (!hasCourseClassificationOptions()) {
    return { ok: false, message: '请先在 TAB1 课程分类中建设分类（至少包含一级与二级），否则无法提交课程' };
  }

  const h1 = document.getElementById('course-h1-select');
  const h2 = document.getElementById('course-h2-select');
  const h3 = document.getElementById('course-h3-select');

  if (!h1?.value || h1.disabled) {
    return { ok: false, message: '请选择一级分类（H1）' };
  }
  if (!h2?.value || h2.disabled) {
    return { ok: false, message: '请选择二级分类（H2）' };
  }
  if (isCourseH3Required() && !h3?.value) {
    return { ok: false, message: '该二级分类下有三级分类，请选择三级分类（H3）' };
  }

  if (isCourseFormCompulsory() || isOfferingSemesterEnabled()) {
    const offering = document.getElementById('offering-semester-select');
    if (!offering?.value || offering.value === '—') {
      return {
        ok: false,
        message: isCourseFormCompulsory()
          ? '必修课程须开启指定学期并选择开课学期'
          : '已开启「指定学期」，请选择开课学期'
      };
    }
  }

  const creditsRaw = document.getElementById('course-credits-input')?.value;
  if (creditsRaw === '' || Number(creditsRaw) < 0) {
    return { ok: false, message: '请填写有效的课程学分' };
  }

  const h1Id = h1.value;
  const h2Id = h2.value;
  const h3Id = isCourseH3Required() && h3?.value ? h3.value : null;
  const credits = Number(creditsRaw);

  const maxCheck = validateCourseCreditsOnAdd({
    h2Id,
    credits,
    excludeCourseId: editing?.id || null
  });
  if (!maxCheck.ok) return maxCheck;

  return { ok: true, editing, h1Id, h2Id, h3Id, credits };
}

function canSaveCourse() {
  return validateCourseSubmit().ok;
}

function validateCourseCloStep() {
  const clos = courseModalDraft?.clos || [];
  if (!clos.length) {
    return {
      ok: false,
      message: '请先在 Step 2 创建至少一条 Course Learning Outcome（CLO），再进入 Student Learning Time（SLT）'
    };
  }
  return { ok: true };
}

function canProceedCourseModalNext() {
  if (courseModalStep === 1) return validateCourseSubmit().ok;
  if (courseModalStep === 2) return validateCourseCloStep().ok;
  return true;
}

function syncCourseModalStepBarState() {
  const step3 = document.querySelector('#course-modal-step-bar .step[data-step="3"]');
  if (!step3) return;
  if (courseModalReadonly) {
    step3.classList.remove('step-locked');
    step3.removeAttribute('title');
    return;
  }
  const blockStep3 = !validateCourseCloStep().ok && courseModalStep < 3;
  step3.classList.toggle('step-locked', blockStep3);
  if (blockStep3) {
    step3.title = '请先完成 Step 2（CLO），SLT 大纲须关联 CLO';
  } else {
    step3.removeAttribute('title');
  }
}

function updateCourseSaveButtonState() {
  const canProceed = courseModalReadonly || canProceedCourseModalNext();
  const nextBtn = document.getElementById('btn-course-next');
  if (nextBtn && !courseModalReadonly && courseModalStep < 3) {
    nextBtn.disabled = !canProceed;
  } else if (nextBtn) {
    nextBtn.disabled = false;
  }
  syncCourseModalStepBarState();
}

/* ── Course modal Step 2 CLO / Step 3 SLT ── */
const BLOOM_LEVELS = [
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
  'A1', 'A2', 'A3', 'A4', 'A5',
  'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'
];
const TEACHING_METHODS = ['Lecture', 'Tutorial', 'Practical', 'Seminar', 'Workshop', 'Others'];
const ASSESSMENT_METHODS = [
  'Assignments', 'Quiz', 'Mid-term Examination', 'Practical Test',
  'Lab Report', 'Presentation', 'Project', 'Coursework', 'Examination'
];

function getCloMethodValue(value) {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

function formatCloMethodDisplay(value) {
  if (Array.isArray(value)) return value.join(', ');
  return value || '';
}
const CONTINUOUS_ASSESSMENT_TYPES = ['Coursework', 'Midterm Examination', 'Quiz', 'Assignment'];
const FINAL_ASSESSMENT_TYPES = ['Final Examination', 'Project', 'Portfolio'];

let courseModalStep = 1;
let courseModalReadonly = false;
let courseModalDraft = null;
let editingCloId = null;
let editingSltOutlineId = null;
let sltAssessmentFormKind = 'continuous';
let editingSltAssessmentId = null;

function getDefaultCourseClos() {
  return [
    { id: 'clo-1', code: 'CLO1', outcome: 'Explain the basic theories and laws of mechanics', bloom: 'C1', teaching: 'Lecture', assessment: 'Coursework' },
    { id: 'clo-2', code: 'CLO2', outcome: "Apply Newton's laws of motion to solve problems quantitatively using mathematical techniques", bloom: 'C2', teaching: 'Lecture', assessment: 'Examination' },
    { id: 'clo-3', code: 'CLO3', outcome: 'Analyze conservation of energy and momentum in physical systems', bloom: 'A3', teaching: 'Tutorial', assessment: 'Coursework' },
    { id: 'clo-4', code: 'CLO4', outcome: 'Evaluate rotational dynamics and gravitation concepts', bloom: 'C2', teaching: 'Lecture', assessment: 'Examination' },
    { id: 'clo-5', code: 'CLO5', outcome: 'Design experiments to investigate wave phenomena and oscillations', bloom: 'P2', teaching: 'Practical', assessment: 'Lab Report' },
    { id: 'clo-6', code: 'CLO6', outcome: 'Compare classical mechanics with an introduction to special relativity', bloom: 'C2', teaching: 'Lecture', assessment: 'Examination' }
  ];
}

function getDefaultCourseSlt() {
  return {
    outlines: [
      { id: 'slt-o1', content: '1. Kinematics', subtopics: ['Displacement and vectors', 'Circular motion', 'Relative motion'], cloCodes: ['CLO1', 'CLO2', 'CLO3', 'CLO4'], f2fPhysical: { L: 5, T: 1, P: 1, O: 0 }, f2fOnline: { L: 0, T: 0, P: 0, O: 0 }, nf2f: 8 },
      { id: 'slt-o2', content: '2. Dynamics', subtopics: ['Newton laws', 'Friction', 'Circular dynamics'], cloCodes: ['CLO1', 'CLO2'], f2fPhysical: { L: 4, T: 1, P: 0, O: 0 }, f2fOnline: { L: 0, T: 0, P: 0, O: 0 }, nf2f: 6 },
      { id: 'slt-o3', content: '3. Energy and Momentum', subtopics: ['Work and energy', 'Conservation laws'], cloCodes: ['CLO3'], f2fPhysical: { L: 3, T: 1, P: 1, O: 0 }, f2fOnline: { L: 0, T: 0, P: 0, O: 0 }, nf2f: 5 },
      { id: 'slt-o4', content: '4. Rotational Motion', subtopics: ['Torque', 'Angular momentum'], cloCodes: ['CLO4', 'CLO5'], f2fPhysical: { L: 3, T: 0, P: 1, O: 0 }, f2fOnline: { L: 0, T: 0, P: 0, O: 0 }, nf2f: 4 }
    ],
    continuous: [
      { id: 'slt-c1', type: 'Coursework', percent: 30, f2fPhysical: 0, f2fOnline: 0, nf2f: 20 },
      { id: 'slt-c2', type: 'Midterm Examination', percent: 30, f2fPhysical: 2, f2fOnline: 0, nf2f: 8 }
    ],
    final: [
      { id: 'slt-f1', type: 'Final Examination', percent: 40, f2fPhysical: 2, f2fOnline: 0, nf2f: 10 }
    ]
  };
}

function catalogSltOutline(content, subtopics, cloCodes, f2fPhysical, nf2f) {
  return {
    content,
    subtopics,
    cloCodes,
    f2fPhysical,
    f2fOnline: { L: 0, T: 0, P: 0, O: 0 },
    nf2f
  };
}

function catalogStandardSlt(outlines) {
  return {
    outlines,
    continuous: [
      { type: 'Coursework', percent: 30, f2fPhysical: 0, f2fOnline: 0, nf2f: 18 },
      { type: 'Midterm Examination', percent: 30, f2fPhysical: 2, f2fOnline: 0, nf2f: 8 }
    ],
    final: [
      { type: 'Final Examination', percent: 40, f2fPhysical: 2, f2fOnline: 0, nf2f: 10 }
    ]
  };
}

/** 教务课程库预置 CLO / SLT（选课后带入方案，可在弹窗内编辑） */
const COURSE_CATALOG_CLO_SLT = {
  mpu3123: {
    clos: [
      { code: 'CLO1', outcome: 'Explain key milestones in Malaysian history and nation-building', bloom: 'C1', teaching: 'Lecture', assessment: 'Coursework' },
      { code: 'CLO2', outcome: 'Analyze political and social structures in contemporary Malaysia', bloom: 'A3', teaching: 'Seminar', assessment: 'Presentation' },
      { code: 'CLO3', outcome: 'Evaluate current issues affecting Malaysian society and governance', bloom: 'C4', teaching: 'Lecture', assessment: 'Examination' }
    ],
    slt: catalogStandardSlt([
      catalogSltOutline('1. Pre-independence Malaysia', ['Colonial period', 'Independence movement'], ['CLO1'], { L: 4, T: 1, P: 0, O: 0 }, 6),
      catalogSltOutline('2. Nation-building & Constitution', ['Federal system', 'Social contract'], ['CLO1', 'CLO2'], { L: 4, T: 1, P: 0, O: 0 }, 6),
      catalogSltOutline('3. Contemporary Malaysia', ['Economy', 'Multicultural society', 'Public policy'], ['CLO2', 'CLO3'], { L: 3, T: 1, P: 0, O: 0 }, 5)
    ])
  },
  fin101: {
    clos: [
      { code: 'CLO1', outcome: 'Explain the role of financial markets and institutions', bloom: 'C1', teaching: 'Lecture', assessment: 'Quiz' },
      { code: 'CLO2', outcome: 'Apply time value of money techniques to financial problems', bloom: 'C3', teaching: 'Tutorial', assessment: 'Assignments' },
      { code: 'CLO3', outcome: 'Analyze risk and return trade-offs for basic securities', bloom: 'A3', teaching: 'Lecture', assessment: 'Coursework' },
      { code: 'CLO4', outcome: 'Evaluate personal and corporate financing decisions at an introductory level', bloom: 'C4', teaching: 'Seminar', assessment: 'Examination' }
    ],
    slt: catalogStandardSlt([
      catalogSltOutline('1. Introduction to Finance', ['Financial system', 'Careers in finance'], ['CLO1'], { L: 3, T: 1, P: 0, O: 0 }, 5),
      catalogSltOutline('2. Time Value of Money', ['PV/FV', 'Annuities', 'Loan amortization'], ['CLO2'], { L: 4, T: 2, P: 0, O: 0 }, 8),
      catalogSltOutline('3. Risk & Return', ['Bonds', 'Stocks', 'Diversification'], ['CLO3', 'CLO4'], { L: 4, T: 1, P: 0, O: 0 }, 7)
    ])
  },
  fin201: {
    clos: [
      { code: 'CLO1', outcome: 'Explain the goals of corporate financial management and agency theory', bloom: 'C2', teaching: 'Lecture', assessment: 'Coursework' },
      { code: 'CLO2', outcome: 'Apply valuation techniques to stocks, bonds and investment projects', bloom: 'C3', teaching: 'Tutorial', assessment: 'Assignments' },
      { code: 'CLO3', outcome: 'Analyze capital structure and dividend policy decisions', bloom: 'A3', teaching: 'Lecture', assessment: 'Mid-term Examination' },
      { code: 'CLO4', outcome: 'Evaluate working capital and short-term financing strategies', bloom: 'C4', teaching: 'Seminar', assessment: 'Coursework' },
      { code: 'CLO5', outcome: 'Design capital budgeting analyses under uncertainty', bloom: 'P2', teaching: 'Workshop', assessment: 'Project' }
    ],
    slt: catalogStandardSlt([
      catalogSltOutline('1. Corporate Finance Overview', ['Agency theory', 'Financial markets'], ['CLO1'], { L: 4, T: 1, P: 0, O: 0 }, 6),
      catalogSltOutline('2. Valuation & Capital Budgeting', ['DCF', 'NPV/IRR', 'Risk analysis'], ['CLO2', 'CLO5'], { L: 5, T: 2, P: 0, O: 0 }, 10),
      catalogSltOutline('3. Capital Structure & Dividends', ['Leverage', 'Payout policy'], ['CLO3'], { L: 4, T: 1, P: 0, O: 0 }, 7),
      catalogSltOutline('4. Working Capital Management', ['Cash cycle', 'Credit policy'], ['CLO4'], { L: 3, T: 1, P: 0, O: 0 }, 5)
    ])
  },
  eng101: {
    clos: [
      { code: 'CLO1', outcome: 'Produce well-structured academic paragraphs and essays', bloom: 'C3', teaching: 'Tutorial', assessment: 'Assignments' },
      { code: 'CLO2', outcome: 'Analyze academic texts and integrate sources with proper citation', bloom: 'A3', teaching: 'Lecture', assessment: 'Coursework' },
      { code: 'CLO3', outcome: 'Present ideas clearly in written academic English', bloom: 'C2', teaching: 'Workshop', assessment: 'Examination' }
    ],
    slt: catalogStandardSlt([
      catalogSltOutline('1. Academic Writing Foundations', ['Paragraph structure', 'Thesis statements'], ['CLO1'], { L: 2, T: 2, P: 0, O: 0 }, 8),
      catalogSltOutline('2. Reading & Synthesis', ['Summary', 'Paraphrasing', 'APA citation'], ['CLO2'], { L: 2, T: 2, P: 0, O: 0 }, 10),
      catalogSltOutline('3. Essay & Examination Skills', ['Argumentation', 'Editing'], ['CLO1', 'CLO3'], { L: 2, T: 1, P: 0, O: 0 }, 6)
    ])
  },
  phy101: {
    clos: getDefaultCourseClos(),
    slt: getDefaultCourseSlt()
  },
  phy102: {
    clos: [
      { code: 'CLO1', outcome: 'Explain core concepts in data collection and exploratory analysis', bloom: 'C1', teaching: 'Lecture', assessment: 'Quiz' },
      { code: 'CLO2', outcome: 'Apply Python tools to clean and visualize datasets', bloom: 'C3', teaching: 'Practical', assessment: 'Lab Report' },
      { code: 'CLO3', outcome: 'Analyze simple predictive models and their limitations', bloom: 'A3', teaching: 'Tutorial', assessment: 'Coursework' },
      { code: 'CLO4', outcome: 'Evaluate ethical issues in data science applications', bloom: 'C4', teaching: 'Seminar', assessment: 'Presentation' }
    ],
    slt: catalogStandardSlt([
      catalogSltOutline('1. Data Science Workflow', ['Data types', 'Ethics'], ['CLO1', 'CLO4'], { L: 3, T: 1, P: 0, O: 0 }, 6),
      catalogSltOutline('2. Python for Data Analysis', ['Pandas', 'Visualization'], ['CLO2'], { L: 2, T: 0, P: 2, O: 0 }, 10),
      catalogSltOutline('3. Introductory Modelling', ['Regression basics', 'Model evaluation'], ['CLO3'], { L: 3, T: 1, P: 1, O: 0 }, 8)
    ])
  },
  csc201: {
    clos: [
      { code: 'CLO1', outcome: 'Explain fundamental programming concepts and Python syntax', bloom: 'C1', teaching: 'Lecture', assessment: 'Quiz' },
      { code: 'CLO2', outcome: 'Apply control structures and functions to solve computational problems', bloom: 'C3', teaching: 'Tutorial', assessment: 'Assignments' },
      { code: 'CLO3', outcome: 'Analyze algorithms using basic complexity reasoning', bloom: 'A3', teaching: 'Lecture', assessment: 'Coursework' },
      { code: 'CLO4', outcome: 'Design small programs using modular decomposition', bloom: 'P2', teaching: 'Practical', assessment: 'Project' },
      { code: 'CLO5', outcome: 'Evaluate program correctness through testing and debugging', bloom: 'C4', teaching: 'Practical', assessment: 'Lab Report' }
    ],
    slt: catalogStandardSlt([
      catalogSltOutline('1. Programming Basics', ['Variables', 'Data types', 'I/O'], ['CLO1'], { L: 4, T: 1, P: 1, O: 0 }, 8),
      catalogSltOutline('2. Control Flow & Functions', ['Loops', 'Functions', 'Scope'], ['CLO2', 'CLO4'], { L: 3, T: 1, P: 2, O: 0 }, 10),
      catalogSltOutline('3. Data Structures & Testing', ['Lists', 'Dictionaries', 'Debugging'], ['CLO3', 'CLO5'], { L: 3, T: 1, P: 1, O: 0 }, 8)
    ])
  },
  fin301: {
    clos: [
      { code: 'CLO1', outcome: 'Explain portfolio theory and asset pricing foundations', bloom: 'C2', teaching: 'Lecture', assessment: 'Coursework' },
      { code: 'CLO2', outcome: 'Apply valuation models to equity and fixed-income securities', bloom: 'C3', teaching: 'Tutorial', assessment: 'Assignments' },
      { code: 'CLO3', outcome: 'Analyze investment strategies using risk-return metrics', bloom: 'A3', teaching: 'Seminar', assessment: 'Project' },
      { code: 'CLO4', outcome: 'Evaluate portfolio performance and market efficiency evidence', bloom: 'C4', teaching: 'Lecture', assessment: 'Examination' }
    ],
    slt: catalogStandardSlt([
      catalogSltOutline('1. Portfolio Theory', ['Mean-variance', 'CAPM'], ['CLO1'], { L: 4, T: 1, P: 0, O: 0 }, 7),
      catalogSltOutline('2. Security Analysis', ['Equity valuation', 'Bond pricing'], ['CLO2'], { L: 4, T: 2, P: 0, O: 0 }, 9),
      catalogSltOutline('3. Investment Practice', ['Performance evaluation', 'Behavioral finance'], ['CLO3', 'CLO4'], { L: 3, T: 1, P: 0, O: 0 }, 6)
    ])
  },
  int401: {
    clos: [
      { code: 'CLO1', outcome: 'Apply professional skills in an industry workplace setting', bloom: 'P2', teaching: 'Others', assessment: 'Project' },
      { code: 'CLO2', outcome: 'Evaluate learning outcomes and career readiness through reflective practice', bloom: 'C4', teaching: 'Seminar', assessment: 'Presentation' }
    ],
    slt: {
      outlines: [
        catalogSltOutline('1. Industrial Placement', ['On-site training', 'Supervisor meetings'], ['CLO1'], { L: 0, T: 0, P: 0, O: 0 }, 120),
        catalogSltOutline('2. Reflection & Reporting', ['Logbook', 'Final report'], ['CLO1', 'CLO2'], { L: 1, T: 1, P: 0, O: 0 }, 20)
      ],
      continuous: [
        { type: 'Assignment', percent: 40, f2fPhysical: 0, f2fOnline: 0, nf2f: 80 },
        { type: 'Presentation', percent: 20, f2fPhysical: 1, f2fOnline: 0, nf2f: 10 }
      ],
      final: [
        { type: 'Project', percent: 40, f2fPhysical: 0, f2fOnline: 0, nf2f: 50 }
      ]
    }
  }
};

function rekeyCloSltForCatalog(catalogId, { clos, slt }) {
  return {
    clos: (clos || []).map((c, i) => ({ ...cloneJson(c), id: `clo-${catalogId}-${i + 1}` })),
    slt: {
      outlines: (slt?.outlines || []).map((o, i) => ({ ...cloneJson(o), id: `slt-${catalogId}-o${i + 1}` })),
      continuous: (slt?.continuous || []).map((c, i) => ({ ...cloneJson(c), id: `slt-${catalogId}-c${i + 1}` })),
      final: (slt?.final || []).map((c, i) => ({ ...cloneJson(c), id: `slt-${catalogId}-f${i + 1}` }))
    }
  };
}

function buildFallbackCatalogCloSlt(catalog) {
  const synopsis = catalog?.synopsis || 'Students will achieve the stated course learning outcomes.';
  return rekeyCloSltForCatalog(catalog?.id || 'unknown', {
    clos: [{
      code: 'CLO1',
      outcome: synopsis.slice(0, 120),
      bloom: 'C2',
      teaching: 'Lecture',
      assessment: 'Examination'
    }],
    slt: catalogStandardSlt([
      catalogSltOutline('1. Course Content', ['Core topics'], ['CLO1'], { L: 3, T: 1, P: 0, O: 0 }, 6)
    ])
  });
}

function getCatalogCourseCloSlt(catalogId) {
  const catalog = COURSE_CATALOG.find(c => c.id === catalogId);
  if (catalog?.clos?.length) {
    return {
      clos: cloneJson(catalog.clos),
      slt: cloneJson(catalog.slt || { outlines: [], continuous: [], final: [] })
    };
  }
  const preset = COURSE_CATALOG_CLO_SLT[catalogId];
  if (preset) return rekeyCloSltForCatalog(catalogId, preset);
  return buildFallbackCatalogCloSlt(catalog);
}

function enrichCourseCatalogCloSlt() {
  COURSE_CATALOG.forEach(c => {
    if (c.clos?.length) return;
    const { clos, slt } = getCatalogCourseCloSlt(c.id);
    c.clos = clos;
    c.slt = slt;
  });
}

function initCourseModalDraftFromCatalog(catalogId) {
  courseModalDraft = cloneJson(getCatalogCourseCloSlt(catalogId));
}

function initCourseModalDraft(pc) {
  if (pc) {
    const fromCatalog = getCatalogCourseCloSlt(pc.catalogId);
    const hasPcClos = Array.isArray(pc.clos) && pc.clos.length > 0;
    const hasPcSlt = pc.slt && (
      (pc.slt.outlines || []).length > 0 ||
      (pc.slt.continuous || []).length > 0 ||
      (pc.slt.final || []).length > 0
    );
    courseModalDraft = {
      clos: cloneJson(hasPcClos ? pc.clos : fromCatalog.clos),
      slt: cloneJson(hasPcSlt ? pc.slt : fromCatalog.slt)
    };
  } else {
    courseModalDraft = { clos: [], slt: { outlines: [], continuous: [], final: [] } };
  }
}

enrichCourseCatalogCloSlt();

function persistCourseDraftTo(pc) {
  if (!courseModalDraft) return;
  pc.clos = JSON.parse(JSON.stringify(courseModalDraft.clos));
  pc.slt = JSON.parse(JSON.stringify(courseModalDraft.slt));
}

function setCourseModalStep(step) {
  courseModalStep = step;
  [1, 2, 3].forEach(n => {
    const panel = document.getElementById(`course-step-panel-${n}`);
    if (panel) panel.hidden = n !== step;
    const stepEl = document.querySelector(`#course-modal-step-bar .step[data-step="${n}"]`);
    if (stepEl) stepEl.classList.toggle('active', n === step);
  });
  const prev = document.getElementById('btn-course-prev');
  const next = document.getElementById('btn-course-next');
  if (prev) prev.style.display = step > 1 ? '' : 'none';
  if (next) {
    if (step === 1) next.textContent = '下一步：CLO →';
    else if (step === 2) next.textContent = '下一步：SLT →';
    else next.style.display = 'none';
  }
  if (next && step < 3) next.style.display = '';
  if (step === 2) renderCloTable();
  if (step === 3) renderSltAll();
  updateCourseSaveButtonState();
}

function courseModalNextStep() {
  if (!courseModalReadonly) {
    if (courseModalStep === 1) {
      const check = validateCourseSubmit();
      if (!check.ok) {
        alert(check.message);
        return;
      }
    } else if (courseModalStep === 2) {
      const cloCheck = validateCourseCloStep();
      if (!cloCheck.ok) {
        alert(cloCheck.message);
        return;
      }
    }
  }
  if (courseModalStep < 3) setCourseModalStep(courseModalStep + 1);
}

function courseModalGoToStep(step) {
  if (step < 1 || step > 3) return;
  if (courseModalReadonly || step <= courseModalStep) {
    setCourseModalStep(step);
    return;
  }
  if (courseModalStep === 1 && step > 1) {
    const check = validateCourseSubmit();
    if (!check.ok) {
      alert(check.message);
      return;
    }
  }
  if (step === 3) {
    const cloCheck = validateCourseCloStep();
    if (!cloCheck.ok) {
      alert(cloCheck.message);
      return;
    }
  }
  setCourseModalStep(step);
}

function courseModalPrevStep() {
  if (courseModalStep > 1) setCourseModalStep(courseModalStep - 1);
}

function nextCloCode() {
  const n = (courseModalDraft?.clos?.length || 0) + 1;
  return `CLO${n}`;
}

function sumLtObj(obj) {
  return Object.values(obj || {}).reduce((s, v) => s + (Number(v) || 0), 0);
}

function calcOutlineRowTotal(row) {
  return sumLtObj(row.f2fPhysical) + sumLtObj(row.f2fOnline) + (Number(row.nf2f) || 0);
}

function calcAssessmentRowTotal(row) {
  return (Number(row.f2fPhysical) || 0) + (Number(row.f2fOnline) || 0) + (Number(row.nf2f) || 0);
}

function renderCloTable() {
  const tbody = document.getElementById('clo-table-body');
  if (!tbody || !courseModalDraft) return;
  const clos = courseModalDraft.clos;
  const readonly = courseModalReadonly;
  tbody.innerHTML = clos.length ? clos.map((c, i) => `
    <tr>
      ${readonly ? '' : `<td class="col-check"><input type="checkbox" class="clo-row-check" value="${c.id}" onchange="updateCloDeleteBtn()"></td>`}
      <td>${i + 1}</td>
      <td>${escapeHtml(c.code)}</td>
      <td>${escapeHtml(c.outcome)}</td>
      <td>${escapeHtml(c.bloom)}</td>
      <td>${escapeHtml(formatCloMethodDisplay(c.teaching))}</td>
      <td>${escapeHtml(formatCloMethodDisplay(c.assessment))}</td>
      <td class="actions">${readonly ? '<span class="text-muted">—</span>' : `<a href="#" onclick="event.preventDefault();openCloModal('${c.id}')">Edit</a><a href="#" class="danger" onclick="event.preventDefault();deleteClo('${c.id}')">Delete</a>`}</td>
    </tr>`).join('') : `<tr><td colspan="8" class="empty-cell">暂无 CLO${readonly ? '' : '，点击 Create 新增'}</td></tr>`;
  const all = document.getElementById('clo-check-all');
  if (all) {
    all.checked = false;
    all.closest('th')?.classList.toggle('col-check-hidden', readonly);
  }
  updateCloDeleteBtn();
}

function updateCloDeleteBtn() {
  const btn = document.getElementById('btn-clo-delete');
  const checked = document.querySelectorAll('.clo-row-check:checked').length;
  if (btn) btn.disabled = checked === 0;
}

function toggleAllCloCheck(checked) {
  document.querySelectorAll('.clo-row-check').forEach(cb => { cb.checked = checked; });
  updateCloDeleteBtn();
}

function populateCloFormSelects() {
  const bloom = document.getElementById('clo-bloom-select');
  const teach = document.getElementById('clo-teaching-select');
  const assess = document.getElementById('clo-assessment-select');
  if (bloom) bloom.innerHTML = '<option value="">please select</option>' + BLOOM_LEVELS.map(v => `<option value="${v}">${v}</option>`).join('');
  if (teach) teach.innerHTML = '<option value="">please select</option>' + TEACHING_METHODS.map(v => `<option value="${v}">${v}</option>`).join('');
  if (assess) assess.innerHTML = '<option value="">please select</option>' + ASSESSMENT_METHODS.map(v => `<option value="${v}">${v}</option>`).join('');
}

function openCloModal(id) {
  if (versionEditReadonly) return;
  editingCloId = id || null;
  populateCloFormSelects();
  const title = document.getElementById('clo-form-title');
  const code = document.getElementById('clo-code-input');
  const outcome = document.getElementById('clo-outcome-input');
  const bloom = document.getElementById('clo-bloom-select');
  const teach = document.getElementById('clo-teaching-select');
  const assess = document.getElementById('clo-assessment-select');
  if (id) {
    const c = courseModalDraft.clos.find(x => x.id === id);
    if (!c) return;
    if (title) title.textContent = 'Edit';
    if (code) code.value = c.code;
    if (outcome) outcome.value = c.outcome;
    if (bloom) bloom.value = c.bloom;
    if (teach) teach.value = getCloMethodValue(c.teaching);
    if (assess) assess.value = getCloMethodValue(c.assessment);
  } else {
    if (title) title.textContent = 'Create';
    if (code) code.value = nextCloCode();
    if (outcome) outcome.value = '';
    if (bloom) bloom.value = '';
    if (teach) teach.value = '';
    if (assess) assess.value = '';
  }
  updateCloOutcomeCount();
  openModal('modal-clo-form');
}

function updateCloOutcomeCount() {
  const ta = document.getElementById('clo-outcome-input');
  const el = document.getElementById('clo-outcome-count');
  if (ta && el) el.textContent = `${ta.value.length}/100`;
}

function confirmCloForm() {
  const code = document.getElementById('clo-code-input')?.value.trim();
  const outcome = document.getElementById('clo-outcome-input')?.value.trim();
  const bloom = document.getElementById('clo-bloom-select')?.value;
  const teach = document.getElementById('clo-teaching-select')?.value;
  const assess = document.getElementById('clo-assessment-select')?.value;
  if (!code || !outcome || !bloom || !teach || !assess) {
    alert('请填写所有必填项');
    return;
  }
  if (editingCloId) {
    const c = courseModalDraft.clos.find(x => x.id === editingCloId);
    if (c) Object.assign(c, { code, outcome, bloom, teaching: teach, assessment: assess });
  } else {
    courseModalDraft.clos.push({
      id: `clo-${Date.now()}`, code, outcome, bloom, teaching: teach, assessment: assess
    });
  }
  closeModal('modal-clo-form');
  renderCloTable();
  if (courseModalStep === 3) renderSltAll();
  updateCourseSaveButtonState();
}

function deleteClo(id) {
  if (versionEditReadonly) return;
  const c = courseModalDraft?.clos?.find(x => x.id === id);
  openDeleteConfirm({
    title: '删除 CLO',
    message: `确定删除 <strong>${escapeHtml(c?.code || '该 CLO')}</strong> 吗？此操作不可撤销。`,
    hint: c?.outcome ? `Outcome：${c.outcome.slice(0, 60)}${c.outcome.length > 60 ? '…' : ''}` : '',
    onConfirm: () => {
      courseModalDraft.clos = courseModalDraft.clos.filter(x => x.id !== id);
      renderCloTable();
      if (courseModalStep === 3) renderSltAll();
      updateCourseSaveButtonState();
    }
  });
}

function deleteSelectedClos() {
  if (versionEditReadonly) return;
  const ids = [...document.querySelectorAll('.clo-row-check:checked')].map(cb => cb.value);
  if (!ids.length) return;
  openDeleteConfirm({
    title: '批量删除 CLO',
    message: `确定删除选中的 <strong>${ids.length}</strong> 条 CLO 吗？此操作不可撤销。`,
    onConfirm: () => {
      courseModalDraft.clos = courseModalDraft.clos.filter(c => !ids.includes(c.id));
      renderCloTable();
      if (courseModalStep === 3) renderSltAll();
      updateCourseSaveButtonState();
    }
  });
}

function toggleSltSection(key) {
  const map = { outline: 'slt-section-outline', continuous: 'slt-section-continuous', final: 'slt-section-final' };
  const sec = document.getElementById(map[key]);
  if (!sec) return;
  sec.classList.toggle('open');
  const toggle = sec.querySelector('.slt-toggle');
  const body = sec.querySelector('.slt-section-body');
  const open = sec.classList.contains('open');
  if (toggle) toggle.textContent = open ? '▼' : '▶';
  if (body) body.hidden = !open;
}

function toggleSltInfoTip(event) {
  event.stopPropagation();
  const tip = event.currentTarget?.closest('.slt-info-tip');
  if (!tip) return;
  document.querySelectorAll('.slt-info-tip.open').forEach(el => {
    if (el !== tip) el.classList.remove('open');
  });
  tip.classList.toggle('open');
}

function closeSltInfoTip() {
  document.querySelectorAll('.slt-info-tip.open').forEach(el => el.classList.remove('open'));
}

function renderSltAll() {
  renderSltOutlineTable();
  renderSltAssessmentTable('continuous');
  renderSltAssessmentTable('final');
  renderSltSummary();
}

function renderSltOutlineTable() {
  const tbody = document.getElementById('slt-outline-body');
  const tfoot = document.getElementById('slt-outline-foot');
  if (!tbody || !courseModalDraft) return;
  const rows = courseModalDraft.slt.outlines;
  const readonly = courseModalReadonly;
  tbody.innerHTML = rows.length ? rows.map((r, i) => {
    const p = r.f2fPhysical || {};
    const o = r.f2fOnline || {};
    const subHtml = (r.subtopics || []).length
      ? `<ul class="outline-subtopics">${r.subtopics.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>` : '';
    const actions = readonly
      ? '<span class="text-muted">—</span>'
      : `<a href="#" onclick="event.preventDefault();openSltOutlineModal('${r.id}')">Edit</a><a href="#" class="danger" onclick="event.preventDefault();deleteSltOutline('${r.id}')">Delete</a>`;
    return `<tr>
      <td class="num-cell">${i + 1}</td>
      <td><div class="outline-content">${escapeHtml(r.content)}</div>${subHtml}</td>
      <td>${escapeHtml((r.cloCodes || []).join(', '))}</td>
      <td class="num-cell">${p.L || 0}</td><td class="num-cell">${p.T || 0}</td><td class="num-cell">${p.P || 0}</td><td class="num-cell">${p.O || 0}</td>
      <td class="num-cell">${o.L || 0}</td><td class="num-cell">${o.T || 0}</td><td class="num-cell">${o.P || 0}</td><td class="num-cell">${o.O || 0}</td>
      <td class="num-cell">${r.nf2f || 0}</td>
      <td class="num-cell"><strong>${calcOutlineRowTotal(r)}</strong></td>
      <td class="actions">${actions}</td>
    </tr>`;
  }).join('') : `<tr><td colspan="14" class="empty-cell">暂无大纲条目</td></tr>`;

  if (tfoot) {
    if (!rows.length) {
      tfoot.innerHTML = '';
    } else {
      const tot = rows.reduce((acc, r) => {
        const p = r.f2fPhysical || {};
        const o = r.f2fOnline || {};
        acc.pL += Number(p.L) || 0;
        acc.pT += Number(p.T) || 0;
        acc.pP += Number(p.P) || 0;
        acc.pO += Number(p.O) || 0;
        acc.oL += Number(o.L) || 0;
        acc.oT += Number(o.T) || 0;
        acc.oP += Number(o.P) || 0;
        acc.oO += Number(o.O) || 0;
        acc.nf2f += Number(r.nf2f) || 0;
        acc.slt += calcOutlineRowTotal(r);
        return acc;
      }, { pL: 0, pT: 0, pP: 0, pO: 0, oL: 0, oT: 0, oP: 0, oO: 0, nf2f: 0, slt: 0 });
      tfoot.innerHTML = `<tr class="slt-total-row">
        <td colspan="3" class="slt-total-label">Total</td>
        <td class="num-cell">${tot.pL}</td><td class="num-cell">${tot.pT}</td><td class="num-cell">${tot.pP}</td><td class="num-cell">${tot.pO}</td>
        <td class="num-cell">${tot.oL}</td><td class="num-cell">${tot.oT}</td><td class="num-cell">${tot.oP}</td><td class="num-cell">${tot.oO}</td>
        <td class="num-cell">${tot.nf2f}</td>
        <td class="num-cell">${tot.slt}</td>
        <td></td>
      </tr>`;
    }
  }
}

function renderSltAssessmentTable(kind) {
  const tbody = document.getElementById(`slt-${kind}-body`);
  const tfoot = document.getElementById(`slt-${kind}-foot`);
  if (!tbody || !courseModalDraft) return;
  const rows = courseModalDraft.slt[kind] || [];
  const readonly = courseModalReadonly;
  tbody.innerHTML = rows.length ? rows.map((r, i) => {
    const actions = readonly
      ? '<span class="text-muted">—</span>'
      : `<a href="#" onclick="event.preventDefault();openSltAssessmentModal('${kind}','${r.id}')">Edit</a><a href="#" class="danger" onclick="event.preventDefault();deleteSltAssessment('${kind}','${r.id}')">Delete</a>`;
    return `
    <tr>
      <td class="num-cell">${i + 1}</td>
      <td>${escapeHtml(r.type)}</td>
      <td class="num-cell">${r.percent}%</td>
      <td class="num-cell">${r.f2fPhysical || 0}</td>
      <td class="num-cell">${r.f2fOnline || 0}</td>
      <td class="num-cell">${r.nf2f || 0}</td>
      <td class="num-cell"><strong>${calcAssessmentRowTotal(r)}</strong></td>
      <td class="actions">${actions}</td>
    </tr>`;
  }).join('') : `<tr><td colspan="8" class="empty-cell">暂无数据</td></tr>`;
  if (tfoot) {
    const totPct = rows.reduce((s, r) => s + (Number(r.percent) || 0), 0);
    const totPhys = rows.reduce((s, r) => s + (Number(r.f2fPhysical) || 0), 0);
    const totOnline = rows.reduce((s, r) => s + (Number(r.f2fOnline) || 0), 0);
    const totNf2f = rows.reduce((s, r) => s + (Number(r.nf2f) || 0), 0);
    const totSlt = rows.reduce((s, r) => s + calcAssessmentRowTotal(r), 0);
    tfoot.innerHTML = rows.length ? `<tr class="slt-total-row">
      <td></td>
      <td class="slt-total-label">Total</td>
      <td class="num-cell">${totPct}</td>
      <td class="num-cell">${totPhys}</td>
      <td class="num-cell">${totOnline}</td>
      <td class="num-cell">${totNf2f}</td>
      <td class="num-cell">${totSlt}</td>
      <td></td>
    </tr>` : '';
  }
}

function renderSltSummary() {
  if (!courseModalDraft) return;
  const outlineTotal = courseModalDraft.slt.outlines.reduce((s, r) => s + calcOutlineRowTotal(r), 0);
  const contTotal = (courseModalDraft.slt.continuous || []).reduce((s, r) => s + calcAssessmentRowTotal(r), 0);
  const finalTotal = (courseModalDraft.slt.final || []).reduce((s, r) => s + calcAssessmentRowTotal(r), 0);
  const assessTotal = contTotal + finalTotal;
  const grandTotal = outlineTotal + assessTotal;
  let phys = 0, online = 0, nf2f = 0;
  courseModalDraft.slt.outlines.forEach(r => {
    phys += sumLtObj(r.f2fPhysical);
    online += sumLtObj(r.f2fOnline);
    nf2f += Number(r.nf2f) || 0;
  });
  [...courseModalDraft.slt.continuous, ...courseModalDraft.slt.final].forEach(r => {
    phys += Number(r.f2fPhysical) || 0;
    online += Number(r.f2fOnline) || 0;
    nf2f += Number(r.nf2f) || 0;
  });
  const physPct = grandTotal ? Math.round((phys / grandTotal) * 100) : 0;
  const onlinePct = grandTotal ? Math.round(((online + nf2f) / grandTotal) * 100) : 0;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('slt-total', grandTotal);
  set('slt-assessment-total', assessTotal);
  set('slt-physical-pct', `${physPct}%`);
  set('slt-online-pct', `${onlinePct}%`);
}

let sltOutlineSelectedClos = [];

function populateSltOutlineCloSelect(selected) {
  const clos = courseModalDraft?.clos || [];
  const validCodes = new Set(clos.map(c => c.code));
  sltOutlineSelectedClos = [...(selected || [])].filter(c => validCodes.has(c));
  const options = document.getElementById('slt-outline-clo-options');
  const empty = document.getElementById('slt-outline-clo-empty');
  closeSltOutlineCloDropdown();

  if (!clos.length) {
    if (empty) empty.hidden = false;
    if (options) options.innerHTML = '';
  } else {
    if (empty) empty.hidden = true;
    if (options) {
      options.innerHTML = clos.map(c => `
        <label class="clo-multiselect-option">
          <input type="checkbox" value="${escapeHtml(c.code)}"
            ${sltOutlineSelectedClos.includes(c.code) ? 'checked' : ''}
            onchange="onSltOutlineCloToggle(this)">
          <span>${escapeHtml(c.code)}</span>
        </label>`).join('');
    }
  }
  updateSltOutlineCloDisplay();
}

function updateSltOutlineCloDisplay() {
  const display = document.getElementById('slt-outline-clo-display');
  if (!display) return;
  if (sltOutlineSelectedClos.length) {
    display.textContent = sltOutlineSelectedClos.join(',');
    display.classList.remove('placeholder');
  } else {
    display.textContent = 'please select';
    display.classList.add('placeholder');
  }
}

function onSltOutlineCloToggle(checkbox) {
  const code = checkbox.value;
  if (checkbox.checked) {
    if (!sltOutlineSelectedClos.includes(code)) sltOutlineSelectedClos.push(code);
  } else {
    sltOutlineSelectedClos = sltOutlineSelectedClos.filter(c => c !== code);
  }
  const order = (courseModalDraft?.clos || []).map(c => c.code);
  sltOutlineSelectedClos.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  updateSltOutlineCloDisplay();
}

function toggleSltOutlineCloDropdown(event) {
  event.stopPropagation();
  const dd = document.getElementById('slt-outline-clo-dropdown');
  if (!dd) return;
  const willOpen = dd.hidden;
  closeSltOutlineCloDropdown();
  if (willOpen) dd.hidden = false;
}

function closeSltOutlineCloDropdown() {
  const dd = document.getElementById('slt-outline-clo-dropdown');
  if (dd) dd.hidden = true;
}

function getSltOutlineSelectedCloCodes() {
  return [...sltOutlineSelectedClos];
}

function readLtField(prefix) {
  const modal = document.getElementById('modal-slt-outline-form');
  const get = key => Number(modal?.querySelector(`[data-lt="${prefix}-${key}"]`)?.value) || 0;
  return { L: get('L'), T: get('T'), P: get('P'), O: get('O') };
}

function setLtField(prefix, obj) {
  const modal = document.getElementById('modal-slt-outline-form');
  ['L', 'T', 'P', 'O'].forEach(k => {
    const el = modal?.querySelector(`[data-lt="${prefix}-${k}"]`);
    if (el) el.value = obj?.[k] ?? 0;
  });
}

function updateSltOutlineLtTotal() {
  const phys = readLtField('phys');
  const online = readLtField('online');
  const nf2f = Number(document.getElementById('slt-outline-nf2f')?.value) || 0;
  const total = sumLtObj(phys) + sumLtObj(online) + nf2f;
  const el = document.getElementById('slt-outline-lt-total');
  if (el) el.textContent = total;
}

function updateSltOutlineContentCount() {
  const ta = document.getElementById('slt-outline-content');
  const el = document.getElementById('slt-outline-content-count');
  if (ta && el) el.textContent = `${ta.value.length}/100`;
}

function openSltOutlineModal(id) {
  if (versionEditReadonly) return;
  editingSltOutlineId = id || null;
  const content = document.getElementById('slt-outline-content');
  const subtopics = document.getElementById('slt-outline-subtopics');
  const nf2f = document.getElementById('slt-outline-nf2f');
  const title = document.getElementById('slt-outline-form-title');
  if (id) {
    const r = courseModalDraft.slt.outlines.find(x => x.id === id);
    if (!r) return;
    if (title) title.textContent = 'Edit Course Content Outline and Subtopics';
    if (content) content.value = r.content;
    if (subtopics) subtopics.value = (r.subtopics || []).join('\n');
    populateSltOutlineCloSelect(r.cloCodes);
    setLtField('phys', r.f2fPhysical);
    setLtField('online', r.f2fOnline);
    if (nf2f) nf2f.value = r.nf2f || 0;
  } else {
    if (title) title.textContent = 'Create Course Content Outline and Subtopics';
    if (content) content.value = '';
    if (subtopics) subtopics.value = '';
    populateSltOutlineCloSelect([]);
    setLtField('phys', { L: 0, T: 0, P: 0, O: 0 });
    setLtField('online', { L: 0, T: 0, P: 0, O: 0 });
    if (nf2f) nf2f.value = 0;
  }
  updateSltOutlineContentCount();
  updateSltOutlineLtTotal();
  openModal('modal-slt-outline-form');
}

function confirmSltOutlineForm() {
  const content = document.getElementById('slt-outline-content')?.value.trim();
  const subRaw = document.getElementById('slt-outline-subtopics')?.value || '';
  const cloCodes = getSltOutlineSelectedCloCodes();
  const nf2f = Number(document.getElementById('slt-outline-nf2f')?.value) || 0;
  if (!(courseModalDraft?.clos || []).length) {
    alert('请先在 Step 2 创建 CLO，再关联大纲条目');
    return;
  }
  if (!content || !cloCodes.length) {
    alert('请填写 Course Content 并选择 CLO');
    return;
  }
  const row = {
    content,
    subtopics: subRaw.split('\n').map(s => s.trim()).filter(Boolean),
    cloCodes,
    f2fPhysical: readLtField('phys'),
    f2fOnline: readLtField('online'),
    nf2f
  };
  if (editingSltOutlineId) {
    const r = courseModalDraft.slt.outlines.find(x => x.id === editingSltOutlineId);
    if (r) Object.assign(r, row);
  } else {
    row.id = `slt-o-${Date.now()}`;
    courseModalDraft.slt.outlines.push(row);
  }
  closeModal('modal-slt-outline-form');
  renderSltAll();
}

function deleteSltOutline(id) {
  if (versionEditReadonly) return;
  const r = courseModalDraft?.slt?.outlines?.find(x => x.id === id);
  openDeleteConfirm({
    title: '删除大纲条目',
    message: `确定删除该 Course Content Outline 条目吗？此操作不可撤销。`,
    hint: r?.content ? `内容：${r.content.slice(0, 80)}${r.content.length > 80 ? '…' : ''}` : '',
    onConfirm: () => {
      courseModalDraft.slt.outlines = courseModalDraft.slt.outlines.filter(x => x.id !== id);
      renderSltAll();
    }
  });
}

function getAssessmentPercentTotal(excludeKind, excludeId) {
  let total = 0;
  ['continuous', 'final'].forEach(kind => {
    (courseModalDraft?.slt?.[kind] || []).forEach(r => {
      if (kind === excludeKind && r.id === excludeId) return;
      total += Number(r.percent) || 0;
    });
  });
  return total;
}

function getAssessmentPercentRemaining(excludeKind, excludeId) {
  return Math.max(0, 100 - getAssessmentPercentTotal(excludeKind, excludeId));
}

function updateSltAssessmentPctHint() {
  const pctInput = document.getElementById('slt-assessment-pct');
  const hint = document.getElementById('slt-assessment-pct-hint');
  if (!pctInput || !hint) return;
  const remaining = getAssessmentPercentRemaining(sltAssessmentFormKind, editingSltAssessmentId);
  const used = 100 - remaining;
  const val = Number(pctInput.value);
  if (Number.isNaN(val) || val < 0 || val > 100) {
    hint.textContent = '百分比须在 0–100 之间';
    hint.className = 'form-hint pct-hint error';
    pctInput.classList.add('input-error');
    return;
  }
  if (val > remaining) {
    hint.textContent = `过程性考核 + 期末考核合计不得超过 100%（已用 ${used}%，最多还可填 ${remaining}%）`;
    hint.className = 'form-hint pct-hint error';
    pctInput.classList.add('input-error');
    return;
  }
  hint.textContent = `过程性考核 + 期末考核合计须为 100%（已用 ${used}%，剩余 ${remaining}%）`;
  hint.className = 'form-hint pct-hint';
  pctInput.classList.remove('input-error');
}

function validateAssessmentPercent(percent) {
  if (Number.isNaN(percent) || percent < 0 || percent > 100) {
    return '百分比须在 0–100 之间';
  }
  const remaining = getAssessmentPercentRemaining(sltAssessmentFormKind, editingSltAssessmentId);
  if (percent > remaining) {
    const used = 100 - remaining;
    return `过程性考核与期末考核合计不得超过 100%（已用 ${used}%，最多还可填 ${remaining}%）`;
  }
  return null;
}

function updateSltAssessmentLtTotal() {
  const phys = Number(document.getElementById('slt-assessment-phys')?.value) || 0;
  const online = Number(document.getElementById('slt-assessment-online')?.value) || 0;
  const nf2f = Number(document.getElementById('slt-assessment-nf2f')?.value) || 0;
  const el = document.getElementById('slt-assessment-lt-total');
  if (el) el.textContent = phys + online + nf2f;
}

function openSltAssessmentModal(kind, id) {
  if (versionEditReadonly) return;
  sltAssessmentFormKind = kind;
  editingSltAssessmentId = id || null;
  const title = document.getElementById('slt-assessment-form-title');
  const typeLabel = document.getElementById('slt-assessment-type-label');
  const typeSel = document.getElementById('slt-assessment-type-select');
  const pct = document.getElementById('slt-assessment-pct');
  const phys = document.getElementById('slt-assessment-phys');
  const online = document.getElementById('slt-assessment-online');
  const nf2f = document.getElementById('slt-assessment-nf2f');
  const types = kind === 'final' ? FINAL_ASSESSMENT_TYPES : CONTINUOUS_ASSESSMENT_TYPES;
  if (title) title.textContent = id
    ? (kind === 'final' ? 'Edit Final Assessment' : 'Edit Continuous Assessment')
    : (kind === 'final' ? 'Create Final Assessment' : 'Create Continuous Assessment');
  if (typeLabel) typeLabel.textContent = kind === 'final' ? 'Final Assessment' : 'Continuous Assessment';
  if (typeSel) typeSel.innerHTML = '<option value="">please select</option>' + types.map(t => `<option value="${t}">${t}</option>`).join('');
  if (id) {
    const r = courseModalDraft.slt[kind].find(x => x.id === id);
    if (!r) return;
    if (typeSel) typeSel.value = r.type;
    if (pct) pct.value = r.percent;
    if (phys) phys.value = r.f2fPhysical || 0;
    if (online) online.value = r.f2fOnline || 0;
    if (nf2f) nf2f.value = r.nf2f || 0;
  } else {
    if (typeSel) typeSel.value = '';
    if (pct) pct.value = 0;
    if (phys) phys.value = 0;
    if (online) online.value = 0;
    if (nf2f) nf2f.value = 0;
  }
  updateSltAssessmentLtTotal();
  updateSltAssessmentPctHint();
  openModal('modal-slt-assessment-form');
}

function confirmSltAssessmentForm() {
  const type = document.getElementById('slt-assessment-type-select')?.value;
  const percent = Number(document.getElementById('slt-assessment-pct')?.value);
  const f2fPhysical = Number(document.getElementById('slt-assessment-phys')?.value) || 0;
  const f2fOnline = Number(document.getElementById('slt-assessment-online')?.value) || 0;
  const nf2f = Number(document.getElementById('slt-assessment-nf2f')?.value) || 0;
  if (!type) {
    alert('请选择考核类型');
    return;
  }
  const pctError = validateAssessmentPercent(percent);
  if (pctError) {
    alert(pctError);
    updateSltAssessmentPctHint();
    return;
  }
  const row = { type, percent, f2fPhysical, f2fOnline, nf2f };
  const list = courseModalDraft.slt[sltAssessmentFormKind];
  if (editingSltAssessmentId) {
    const r = list.find(x => x.id === editingSltAssessmentId);
    if (r) Object.assign(r, row);
  } else {
    row.id = `slt-${sltAssessmentFormKind[0]}-${Date.now()}`;
    list.push(row);
  }
  closeModal('modal-slt-assessment-form');
  renderSltAll();
}

function deleteSltAssessment(kind, id) {
  if (versionEditReadonly) return;
  const r = courseModalDraft?.slt?.[kind]?.find(x => x.id === id);
  const kindLabel = kind === 'final' ? 'Final Assessment' : 'Continuous Assessment';
  openDeleteConfirm({
    title: `删除${kind === 'final' ? '期末' : '过程性'}考核`,
    message: `确定删除该 <strong>${kindLabel}</strong> 条目吗？此操作不可撤销。`,
    hint: r?.type ? `${r.type} · ${r.percent}%` : '',
    onConfirm: () => {
      courseModalDraft.slt[kind] = courseModalDraft.slt[kind].filter(x => x.id !== id);
      renderSltAll();
    }
  });
}

function openCourseModal(mode, programCourseId) {
  if (mode !== 'view' && versionEditReadonly) return;
  if (mode === 'add') {
    if (!hasCourseClassificationOptions()) {
      alert('请先在 TAB1 课程分类中建设分类（至少包含一级与二级），否则无法新增课程。');
      return;
    }
  }
  refreshCourseClassificationSelects();
  if (mode !== 'view' && !hasCourseClassificationOptions()) return;

  courseModalReadonly = mode === 'view';
  editingProgramCourseId = (mode === 'edit' || mode === 'view') ? programCourseId : null;
  const title = document.getElementById('modal-course-title');
  cancelCoursePicker();

  if (mode === 'edit' || mode === 'view') {
    const pc = findProgramCourse(programCourseId);
    if (!pc) return;
    if (title) title.textContent = mode === 'view' ? '查看课程' : '编辑课程';
    setCoursePickerSectionVisible(false);
    fillCourseFormFromProgramCourse(pc);
    initCourseModalDraft(pc);
    updateCourseSaveButtonState();
  } else {
    if (title) title.textContent = '新增课程';
    setCoursePickerSectionVisible(true);
    resetCoursePicker();
    initSemesterSelects();
    syncOfferingSemesterControl();
    initCourseModalDraft(null);
  }
  applyCourseModalReadonly(courseModalReadonly);
  setCourseModalStep(1);
  openModal('modal-add-course');
}

function applyCourseModalReadonly(readonly) {
  courseModalReadonly = readonly;
  const modal = document.getElementById('modal-add-course');
  if (modal) modal.classList.toggle('course-modal-readonly', readonly);
  const saveBtn = document.getElementById('btn-save-course');
  if (saveBtn) saveBtn.style.display = readonly ? 'none' : '';
  const cancelBtn = modal?.querySelector('.modal-foot .btn-ghost');
  if (cancelBtn) cancelBtn.textContent = readonly ? '关闭' : '取消';
  const cloToolbar = document.querySelector('#course-step-panel-2 .course-step-toolbar');
  if (cloToolbar) cloToolbar.style.display = readonly ? 'none' : '';
  modal?.querySelectorAll('#course-step-panel-3 .slt-section-head .btn-primary').forEach(btn => {
    btn.style.display = readonly ? 'none' : '';
  });
  modal?.querySelectorAll('#course-form-details input, #course-form-details select, #course-form-details textarea').forEach(el => {
    el.disabled = readonly;
  });
  const offeringToggle = document.getElementById('offering-semester-enabled');
  const offeringWrap = document.getElementById('offering-semester-wrap');
  if (offeringToggle) offeringToggle.disabled = readonly;
  const offeringToggleSwitch = offeringToggle?.closest('.toggle-switch');
  if (offeringToggleSwitch) {
    offeringToggleSwitch.classList.toggle('is-readonly', readonly);
    offeringToggleSwitch.setAttribute('aria-disabled', readonly ? 'true' : 'false');
  }
  if (offeringWrap) {
    offeringWrap.classList.toggle('is-view-readonly', readonly);
    if (readonly) offeringWrap.setAttribute('title', '查看模式下不可修改');
    else offeringWrap.removeAttribute('title');
  }
  const offeringSelect = document.getElementById('offering-semester-select');
  if (offeringSelect && readonly) offeringSelect.disabled = true;
  modal?.querySelectorAll('#course-picker-section button, #course-form-details .input-group button').forEach(btn => {
    btn.style.display = readonly ? 'none' : '';
  });
  if (!readonly) {
    onCourseH2Change();
    syncOfferingSemesterControl();
    updateCourseSaveButtonState();
  }
  if (courseModalDraft) {
    if (courseModalStep === 2) renderCloTable();
    if (courseModalStep === 3) renderSltAll();
  }
}

function openAddCourseModal() {
  openCourseModal('add');
}

function openEditProgramCourse(id) {
  openCourseModal('edit', id);
}

function openViewProgramCourse(id) {
  openCourseModal('view', id);
}

function saveCourse() {
  if (courseModalReadonly) return;
  const check = validateCourseSubmit();
  if (!check.ok) {
    alert(check.message);
    return;
  }

  const { editing, h1Id, h2Id, h3Id } = check;

  if (editing) {
    readCourseFormIntoProgramCourse(editing);
    persistCourseDraftTo(editing);
    renderProgramCoursesTable();
  } else {
    const pc = createProgramCourseFromCatalog(selectedCatalogCourseId, {
      h1Id,
      h2Id,
      h3Id,
      semester: (isCourseFormCompulsory() || isOfferingSemesterEnabled())
        ? document.getElementById('offering-semester-select')?.value
        : null
    });
    if (!pc) return;
    pc.prereqIds = [...selectedPrereqCourseIds];
    pc.synopsis = document.getElementById('course-synopsis-input')?.value || pc.synopsis;
    pc.references = document.getElementById('course-refs-input')?.value || pc.references;
    pc.language = document.getElementById('course-language-select')?.value || pc.language;
    const creditsInput = document.getElementById('course-credits-input')?.value;
    if (creditsInput !== '') pc.credits = Number(creditsInput);
    persistCourseDraftTo(pc);
    finalizeProgramCourseForContext(pc);
    PROGRAM_COURSES.push(pc);
    renderProgramCoursesTable();
  }
  editingProgramCourseId = null;
  closeModal('modal-add-course');
  alert('课程已提交（原型）');
}

function refreshBatchCourseClassificationSelects() {
  const h1 = document.getElementById('batch-course-h1-select');
  const h2 = document.getElementById('batch-course-h2-select');
  const h3 = document.getElementById('batch-course-h3-select');
  if (!h1 || !h2 || !h3) return false;

  const l1List = CLASSIFICATION_TREE.filter(l1 => l1.children?.length);
  if (!l1List.length) {
    h1.innerHTML = '<option value="">暂无分类</option>';
    h2.innerHTML = '<option value="">暂无分类</option>';
    h3.innerHTML = '<option value="">—</option>';
    h1.disabled = h2.disabled = h3.disabled = true;
    updateBatchCourseH3FieldState(false);
    return false;
  }

  h1.disabled = false;
  h1.innerHTML = l1List.map(l1 => `<option value="${l1.id}">${escapeHtml(l1.name)}</option>`).join('');
  onBatchCourseH1Change();
  return true;
}

function onBatchCourseH1Change() {
  const h1Id = document.getElementById('batch-course-h1-select')?.value;
  const h2 = document.getElementById('batch-course-h2-select');
  const l1 = findClassificationNode(h1Id);
  const l2List = l1?.children || [];
  if (!h2) return;

  if (!l2List.length) {
    h2.innerHTML = '<option value="">无二级分类</option>';
    h2.disabled = true;
  } else {
    h2.disabled = false;
    h2.innerHTML = l2List.map(l2 => `<option value="${l2.id}">${escapeHtml(l2.name)}</option>`).join('');
  }
  onBatchCourseH2Change();
  syncOfferingSemesterControl('batch');
}

function updateBatchCourseH3FieldState(hasL3) {
  const label = document.getElementById('batch-course-h3-label');
  const wrap = document.getElementById('batch-course-h3-wrap');
  const hint = document.getElementById('batch-course-h3-hint');
  if (label) label.classList.toggle('req', hasL3);
  if (wrap) wrap.classList.toggle('field-disabled', !hasL3);
  if (hint) {
    hint.textContent = hasL3 ? '该二级分类下有三级分类，请选择（必填）' : '该二级分类无三级分类，无需填写';
  }
}

function onBatchCourseH2Change() {
  const h2Id = document.getElementById('batch-course-h2-select')?.value;
  const h3 = document.getElementById('batch-course-h3-select');
  const l2 = findClassificationNode(h2Id);
  const l3List = l2?.children || [];
  if (!h3) return;

  const hasL3 = l3List.length > 0;
  const prevH3 = h3.value;
  updateBatchCourseH3FieldState(hasL3);

  if (!hasL3) {
    h3.innerHTML = '<option value="">—</option>';
    h3.value = '';
    h3.disabled = true;
  } else {
    h3.disabled = false;
    h3.innerHTML = '<option value="">请选择</option>' +
      l3List.map(l3 => `<option value="${l3.id}">${escapeHtml(l3.name)}</option>`).join('');
    h3.value = l3List.some(l3 => l3.id === prevH3) ? prevH3 : '';
  }
  updateBatchAddButtonState();
}

function isBatchCourseDisabled(id) {
  return getExistingProgramCatalogIds().has(id);
}

function formatBatchCourseDisplay(ids) {
  if (!ids.length) return '';
  const labels = ids.map(id => {
    const c = COURSE_CATALOG.find(x => x.id === id);
    return c ? `${c.code} — ${c.name}` : '';
  }).filter(Boolean);
  if (labels.length <= 3) return labels.join('；');
  return `${labels.slice(0, 2).join('；')} 等 ${labels.length} 门课程`;
}

function updateBatchCoursePickerDisplay() {
  const display = document.getElementById('batch-course-picker-display');
  const hint = document.getElementById('batch-course-picker-hint');
  if (display) display.value = formatBatchCourseDisplay(batchSelectedCatalogIds);
  if (hint) {
    hint.textContent = batchSelectedCatalogIds.length
      ? `已选 ${batchSelectedCatalogIds.length} 门课程，可点击「选择」调整`
      : '须从教务课程库选择课程；已添加至本方案的课程不可重复选择。';
  }
}

function canBatchAddCourses() {
  if (!batchSelectedCatalogIds.length) return false;
  if (!hasCourseClassificationOptions()) return false;
  const h1 = document.getElementById('batch-course-h1-select');
  const h2 = document.getElementById('batch-course-h2-select');
  const h3 = document.getElementById('batch-course-h3-select');
  if (!h1?.value || h1.disabled) return false;
  if (!h2?.value || h2.disabled) return false;
  if (isCourseH3Required('batch') && !h3?.value) return false;
  if (isCourseFormCompulsory('batch') || isOfferingSemesterEnabled('batch')) {
    const semester = document.getElementById('batch-offering-semester-select');
    if (!semester?.value || semester.value === '—') return false;
  }
  return true;
}

function updateBatchAddButtonState() {
  const btn = document.getElementById('btn-batch-add-course');
  if (!btn) return;
  const n = batchSelectedCatalogIds.length;
  btn.disabled = !canBatchAddCourses();
  btn.textContent = n ? `确认添加（${n} 门）` : '确认添加';
}

function openBatchAddCourseModal() {
  if (versionEditReadonly) return;
  if (!hasCourseClassificationOptions()) {
    alert('请先在 TAB1 课程分类中建设分类（至少包含一级与二级），否则无法新增课程。');
    return;
  }
  if (!refreshBatchCourseClassificationSelects()) {
    alert('请先在 TAB1 课程分类中建设分类（至少包含一级与二级），否则无法新增课程。');
    return;
  }
  batchSelectedCatalogIds = [];
  syncOfferingSemesterControl('batch');
  updateBatchCoursePickerDisplay();
  updateBatchAddButtonState();
  openModal('modal-batch-add-course');
}

function confirmBatchAddCourses() {
  if (!canBatchAddCourses()) {
    const needH3 = isCourseH3Required('batch');
    if (!batchSelectedCatalogIds.length) {
      alert('请至少选择一门课程');
    } else if (isCourseFormCompulsory('batch')) {
      alert('必修课程须指定开课学期');
    } else if (isOfferingSemesterEnabled('batch')) {
      alert(needH3 ? '请完善课程分类（H1/H2/H3）及开课学期' : '请完善课程分类（H1/H2）及开课学期');
    } else {
      alert(needH3 ? '请完善课程分类（H1/H2/H3）' : '请完善课程分类（H1/H2）');
    }
    return;
  }

  const h1Id = document.getElementById('batch-course-h1-select')?.value;
  const h2Id = document.getElementById('batch-course-h2-select')?.value;
  const h3 = document.getElementById('batch-course-h3-select');
  const h3Id = isCourseH3Required('batch') && h3?.value ? h3.value : null;
  const semester = (isCourseFormCompulsory('batch') || isOfferingSemesterEnabled('batch'))
    ? document.getElementById('batch-offering-semester-select')?.value
    : null;
  const existing = getExistingProgramCatalogIds();
  const toAdd = batchSelectedCatalogIds.filter(catalogId => !existing.has(catalogId));
  if (!toAdd.length) {
    alert('所选课程均已存在于本方案中。');
    return;
  }

  const batchCredits = toAdd.reduce((sum, catalogId) => {
    const cat = COURSE_CATALOG.find(c => c.id === catalogId);
    return sum + (Number(cat?.credits) || 0);
  }, 0);
  const maxCheck = validateCourseCreditsOnAdd({
    h2Id,
    credits: batchCredits,
    excludeCourseId: null
  });
  if (!maxCheck.ok) {
    alert(maxCheck.message);
    return;
  }

  let added = 0;

  toAdd.forEach(catalogId => {
    const pc = createProgramCourseFromCatalog(catalogId, { h1Id, h2Id, h3Id, semester });
    if (!pc) return;
    finalizeProgramCourseForContext(pc);
    PROGRAM_COURSES.push(pc);
    existing.add(catalogId);
    added++;
  });

  renderProgramCoursesTable();
  closeModal('modal-batch-add-course');
  alert(added ? `已批量添加 ${added} 门课程，可在列表中逐门编辑完善信息。` : '所选课程均已存在于本方案中。');
}

function canEditCategory(node) {
  if (node.level === 1) return false;
  return node.level === 2 || node.level === 3;
}

function canDeleteCategory(node) {
  return node.level === 2 || node.level === 3;
}

let editingCategoryId = null;
let pendingDeleteCategoryId = null;
let categoryFormMode = 'add-l2';
let parentL2CategoryId = null;

const H1_META = {
  compulsory: { id: 'l1-comp', name: 'Compulsory Courses', studyType: 'compulsory' },
  core: { id: 'l1-core', name: 'Core/Major/Specialisation', studyType: 'compulsory' },
  elective: { id: 'l1-elec', name: 'Optional/Elective Courses', studyType: 'elective', highlight: true },
  minor: { id: 'l1-minor', name: 'Minor Courses', studyType: 'elective' },
  training: { id: 'l1-training', name: 'Industrial Training/Practicum', studyType: 'compulsory' },
  others: { id: 'l1-others', name: 'Others', studyType: 'compulsory' }
};

function generateCategoryNodeId(level) {
  return `l${level}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

function findOrCreateL1(h1Key) {
  const meta = H1_META[h1Key];
  if (!meta) return null;
  let l1 = CLASSIFICATION_TREE.find(n => n.id === meta.id);
  if (!l1) {
    l1 = {
      id: meta.id,
      level: 1,
      name: meta.name,
      studyType: meta.studyType,
      children: [],
      highlight: meta.highlight
    };
    CLASSIFICATION_TREE.push(l1);
  }
  return l1;
}

function isCategoryL3Mode() {
  return categoryFormMode === 'add-l3' || categoryFormMode === 'edit-l3';
}

function getCategoryL3ParentL2() {
  if (!isCategoryL3Mode()) return null;
  if (parentL2CategoryId) return findClassificationNode(parentL2CategoryId);
  if (editingCategoryId) return findL2Parent(editingCategoryId);
  return null;
}

function getL2CreditsMaxLimit(l2) {
  if (!l2) return null;
  normalizeNodeCredits(l2);
  if (l2.creditsMax != null && l2.creditsMax !== '') return Number(l2.creditsMax);
  if (l2.creditsMin != null && l2.creditsMin !== '') return Number(l2.creditsMin);
  return null;
}

function sumL3CreditsMinUnderL2(l2, excludeL3Id = null) {
  if (!l2?.children?.length) return 0;
  return l2.children.reduce((sum, l3) => {
    if (excludeL3Id && l3.id === excludeL3Id) return sum;
    normalizeNodeCredits(l3);
    return sum + (Number(l3.creditsMin) || 0);
  }, 0);
}

function validateL3CreditsMinAgainstL2(l2, creditsMin, { excludeL3Id = null } = {}) {
  if (!l2) return { ok: true };
  const existingSum = sumL3CreditsMinUnderL2(l2, excludeL3Id);
  const total = existingSum + creditsMin;
  const l2Name = l2.name ? `「${l2.name}」` : '所属二级分类';
  const action = excludeL3Id ? '修改后' : '新增后';
  const siblingLabel = excludeL3Id ? '其他' : '已有';

  if (l2.studyType === 'elective') {
    normalizeNodeCredits(l2);
    const l2Min = Number(l2.creditsMin) || 0;
    if (l2Min > 0 && total > l2Min) {
      return {
        ok: false,
        message: `${action}三级分类最低学分合计（${total}）将超过${l2Name}二级最低学分（${l2Min}）；` +
          `当前${siblingLabel}子级合计 ${existingSum}，本次填写 ${creditsMin}` +
          '（选修须：三级最低合计≤二级最低）'
      };
    }
    return { ok: true };
  }

  const l2Max = getL2CreditsMaxLimit(l2);
  if (l2Max == null) return { ok: true };
  if (total > l2Max) {
    return {
      ok: false,
      message: `${action}三级分类最低学分合计（${total}）将超过${l2Name}学分上限（${l2Max}）；` +
        `当前${siblingLabel}子级合计 ${existingSum}，本次填写 ${creditsMin}` +
        '（必修须：三级最低合计=二级最低=二级最高）'
    };
  }
  return { ok: true };
}

function getCategoryFormStudyType() {
  if (isCategoryL3Mode()) {
    return getCategoryL3ParentL2()?.studyType || 'compulsory';
  }
  return document.getElementById('study-type-select')?.value || 'compulsory';
}

function isCategoryCreditsRangeMode() {
  if (isCategoryL3Mode()) return false;
  return getCategoryFormStudyType() === 'elective';
}

function syncCategoryCreditsMaxFromMin() {
  if (isCategoryL3Mode() || isCategoryCreditsRangeMode()) return;
  const minEl = document.getElementById('category-credits-min');
  const maxEl = document.getElementById('category-credits-max');
  if (minEl && maxEl) maxEl.value = minEl.value;
}

function updateCategoryCreditsFieldsUI() {
  const panel = document.getElementById('category-form-panel');
  const minLabel = document.getElementById('category-credits-min-label');
  const maxLabel = document.getElementById('category-credits-max-label');
  const minEl = document.getElementById('category-credits-min');
  const maxEl = document.getElementById('category-credits-max');
  const isL3 = isCategoryL3Mode();
  const isRange = isCategoryCreditsRangeMode();
  const lockMax = !isL3 && !isRange;

  if (panel) {
    panel.classList.toggle('credits-range-mode', isRange);
    panel.classList.toggle('credits-locked-max-mode', lockMax);
  }
  if (minLabel) minLabel.textContent = '最低学分';
  if (maxLabel) maxLabel.textContent = '最高学分';
  if (minEl) {
    minEl.placeholder = '最低';
    const l2Max = isL3 ? getL2CreditsMaxLimit(getCategoryL3ParentL2()) : null;
    if (l2Max != null) minEl.max = String(l2Max);
    else minEl.removeAttribute('max');
  }
  if (maxEl) {
    maxEl.placeholder = '最高';
    maxEl.disabled = lockMax;
    if (isL3) maxEl.value = '';
    else if (lockMax) syncCategoryCreditsMaxFromMin();
  }
}

function bindCategoryCreditsInputs() {
  const minEl = document.getElementById('category-credits-min');
  const maxEl = document.getElementById('category-credits-max');
  if (minEl && !minEl.dataset.bound) {
    minEl.dataset.bound = '1';
    minEl.addEventListener('input', () => {
      syncCategoryCreditsMaxFromMin();
      updateElectiveMatrixHint();
      if (isCategoryL3Mode()) onCategoryLevelChange();
    });
  }
  if (maxEl && !maxEl.dataset.bound) {
    maxEl.dataset.bound = '1';
    maxEl.addEventListener('input', updateElectiveMatrixHint);
  }
}

function bindElectiveMatrixInputs() {
  const tbody = document.getElementById('elective-matrix-tbody');
  if (!tbody || tbody.dataset.bound) return;
  tbody.dataset.bound = '1';
  tbody.addEventListener('input', e => {
    if (e.target.matches('.matrix-credit-min, .matrix-credit-max, .matrix-count')) {
      updateElectiveMatrixHint();
    }
  });
}

function applyCategoryFormMode() {
  const panel = document.getElementById('category-form-panel');
  const l2Fields = document.getElementById('category-l2-fields');
  const l3Fields = document.getElementById('category-l3-fields');
  const electiveSection = document.getElementById('elective-matrix-section');
  const isL3 = isCategoryL3Mode();

  if (panel) panel.className = `category-form-panel ${isL3 ? 'mode-l3' : 'mode-l2'}`;
  if (l2Fields) l2Fields.style.display = '';
  if (l3Fields) l3Fields.style.display = '';
  if (electiveSection) {
    electiveSection.style.display = !isL3 && isElectiveStudyType() ? 'block' : 'none';
  }
  updateCategoryCreditsFieldsUI();
}

function collectElectiveMatrixRequirements() {
  const reqs = {};
  document.querySelectorAll('#elective-matrix-tbody tr[data-row]').forEach(row => {
    const semester = row.querySelector('.semester-row-select')?.value;
    const creditsMin = row.querySelector('.matrix-credit-min')?.value.trim();
    const creditsMax = row.querySelector('.matrix-credit-max')?.value.trim();
    const count = row.querySelector('.matrix-count')?.value.trim();
    if (!semester) return;
    reqs[semester] = {
      creditsMin: creditsMin !== '' ? Number(creditsMin) : '',
      creditsMax: creditsMax !== '' ? Number(creditsMax) : '',
      count: count !== '' ? Number(count) : ''
    };
  });
  return reqs;
}

function loadElectiveMatrixForCategory(categoryId) {
  resetElectiveMatrix();
  const reqs = ELECTIVE_SEMESTER_REQUIREMENTS[categoryId];
  if (!reqs) return;
  Object.entries(reqs).forEach(([semester, req]) => {
    normalizeElectiveSemesterReq(req);
    addElectiveMatrixRow({
      semester,
      creditsMin: req.creditsMin,
      creditsMax: req.creditsMax,
      count: req.count
    });
  });
  updateElectiveMatrixHint();
}

function sumElectiveMatrixCreditsMin() {
  let sum = 0;
  document.querySelectorAll('#elective-matrix-tbody tr[data-row]').forEach(row => {
    const raw = row.querySelector('.matrix-credit-min')?.value.trim();
    if (raw !== '') sum += Number(raw) || 0;
  });
  return sum;
}

function updateElectiveMatrixHint() {
  const hint = document.getElementById('elective-matrix-hint');
  if (!hint) return;
  const base = '请手动添加需要限制的学期，选择学期并填写该学期的最低/最高学分要求及课程数量（Y1S1 ~ Y4S3）';
  if (!isElectiveStudyType() || isCategoryL3Mode()) {
    hint.textContent = `${base}。`;
    return;
  }
  const maxRaw = document.getElementById('category-credits-max')?.value.trim();
  const l2Max = maxRaw !== '' && !Number.isNaN(Number(maxRaw)) ? Number(maxRaw) : null;
  const sumMin = sumElectiveMatrixCreditsMin();
  const sumMax = sumElectiveMatrixCreditsMax();
  let capHint = '；各学期最低/最高学分要求均须满足：最高≥最低，且各学期最高学分之和≤二级最高学分';
  if (l2Max != null) {
    capHint += `（最低合计 ${sumMin}，最高合计 ${sumMax} / 二级上限 ${l2Max}）`;
  }
  hint.textContent = `${base}${capHint}。`;
}

function validateElectiveMatrixRequired(l2CreditsMax) {
  const rows = document.querySelectorAll('#elective-matrix-tbody tr[data-row]');
  if (!rows.length) {
    alert('修读类型为选修时，请至少添加一条学期修读要求');
    return false;
  }
  let valid = false;
  let sumMax = 0;
  for (const row of rows) {
    const semester = row.querySelector('.semester-row-select')?.value;
    const creditsMinRaw = row.querySelector('.matrix-credit-min')?.value.trim();
    const creditsMaxRaw = row.querySelector('.matrix-credit-max')?.value.trim();
    const count = row.querySelector('.matrix-count')?.value.trim();
    if (!semester) {
      alert('请为每条学期要求选择对应学期');
      return false;
    }
    if (creditsMinRaw || creditsMaxRaw || count) valid = true;
    if (creditsMinRaw !== '' && creditsMaxRaw !== '') {
      const creditsMin = Number(creditsMinRaw);
      const creditsMax = Number(creditsMaxRaw);
      if (!Number.isNaN(creditsMin) && !Number.isNaN(creditsMax) && creditsMax < creditsMin) {
        alert(`${semester} 最高学分限制须大于等于最低学分要求`);
        return false;
      }
      if (!Number.isNaN(creditsMax)) sumMax += creditsMax;
    } else if (creditsMaxRaw !== '') {
      sumMax += Number(creditsMaxRaw) || 0;
    }
  }
  if (!valid) {
    alert('请至少填写一条学期要求的最低/最高学分或课程数量');
    return false;
  }
  const sumMin = sumElectiveMatrixCreditsMin();
  if (l2CreditsMax != null && !Number.isNaN(l2CreditsMax) && sumMin > l2CreditsMax) {
    alert(`各学期最低学分要求之和（${sumMin}）不能超过二级分类最高学分限制（${l2CreditsMax}）`);
    return false;
  }
  if (l2CreditsMax != null && !Number.isNaN(l2CreditsMax) && sumMax > l2CreditsMax) {
    alert(`各学期最高学分限制之和（${sumMax}）不能超过二级分类最高学分限制（${l2CreditsMax}）`);
    return false;
  }
  return true;
}

function renderCourseCountCell(node) {
  const count = calcNodeCourseCount(node);
  const aggregated = isAggregatedCreditNode(node);
  const cls = aggregated ? 'credit-auto' : 'credit-value';
  const extra = node.level === 1 ? ' l1' : '';
  return `<td class="count-cell"><span class="${cls}${extra}">${count}</span></td>`;
}

function renderCreditCell(node) {
  const creditsMin = calcNodeCreditsMin(node);
  const creditsMax = calcNodeCreditsMax(node);
  const aggregated = isAggregatedCreditNode(node);
  const cls = aggregated ? 'credit-auto' : 'credit-value';
  const extra = node.level === 1 ? ' l1' : '';
  const title = aggregated && node.level === 1 ? ' title="自动汇总：各二级学分区间之和"' : '';
  const maxDisplay = node.level === 3 ? '—' : creditsMax;
  return `<td class="credit-cell"><span class="${cls}${extra}"${title}>${creditsMin}</span></td>
    <td class="credit-cell"><span class="${cls}${extra}"${title}>${maxDisplay}</span></td>`;
}

function clearCategoryCreditsInputs() {
  const minEl = document.getElementById('category-credits-min');
  const maxEl = document.getElementById('category-credits-max');
  if (minEl) minEl.value = '';
  if (maxEl) maxEl.value = '';
}

function setCategoryCreditsInputs(node) {
  normalizeNodeCredits(node);
  const minEl = document.getElementById('category-credits-min');
  const maxEl = document.getElementById('category-credits-max');
  if (minEl) minEl.value = node?.creditsMin ?? '';
  if (maxEl) {
    maxEl.value = (node?.level === 3 || isCategoryL3Mode()) ? '' : (node?.creditsMax ?? '');
  }
  syncCategoryCreditsMaxFromMin();
}

function readCategoryCreditsFromForm() {
  const minRaw = document.getElementById('category-credits-min')?.value.trim();
  if (isCategoryL3Mode()) {
    if (minRaw === '') return { error: '请填写最低学分' };
    const creditsMin = Number(minRaw);
    if (Number.isNaN(creditsMin) || creditsMin < 0) return { error: '学分须为非负数字' };
    const l2 = getCategoryL3ParentL2();
    const sumCheck = validateL3CreditsMinAgainstL2(l2, creditsMin, {
      excludeL3Id: categoryFormMode === 'edit-l3' ? editingCategoryId : null
    });
    if (!sumCheck.ok) return { error: sumCheck.message };
    return { creditsMin, creditsMax: null };
  }
  const isRange = isCategoryCreditsRangeMode();
  const maxRaw = isRange
    ? document.getElementById('category-credits-max')?.value.trim()
    : minRaw;
  if (minRaw === '') return { error: '请填写最低学分' };
  if (isRange && maxRaw === '') return { error: '请填写最高学分' };
  const creditsMin = Number(minRaw);
  const creditsMax = Number(maxRaw);
  if (Number.isNaN(creditsMin) || creditsMin < 0 || Number.isNaN(creditsMax) || creditsMax < 0) {
    return { error: '学分须为非负数字' };
  }
  if (creditsMin > creditsMax) {
    return { error: '最低学分不能大于最高学分' };
  }
  if (categoryFormMode === 'edit-l2' && editingCategoryId) {
    const l2 = findClassificationNode(editingCategoryId);
    if (l2?.children?.length) {
      const tempL2 = { ...l2, creditsMin, creditsMax };
      const check = validateL2L3CreditsConsistency(tempL2);
      if (!check.ok) return { error: check.message };
    }
  }
  return { creditsMin, creditsMax };
}

function renderCategoryActions(node) {
  if (versionEditReadonly) return '<span class="text-muted">—</span>';
  const parts = [];
  if (node.level === 2) {
    parts.push(`<a href="#" onclick="openAddL3CategoryModal('${node.id}');return false">+子级</a>`);
  }
  if (canEditCategory(node)) {
    parts.push(`<a href="#" onclick="openEditCategory('${node.id}');return false">编辑</a>`);
  }
  if (canDeleteCategory(node)) {
    parts.push(`<a href="#" class="danger" onclick="deleteCategory('${node.id}');return false">删除</a>`);
  }
  return parts.length ? parts.join('') : '<span class="text-muted">—</span>';
}

function deleteCategory(id) {
  if (versionEditReadonly) return;
  const node = findClassificationNode(id);
  if (!node || !canDeleteCategory(node)) return;
  pendingDeleteCategoryId = id;

  const msg = document.getElementById('delete-category-msg');
  const hint = document.getElementById('delete-category-hint');
  const levelLabel = node.level === 2 ? '二级' : '三级';
  if (msg) {
    msg.innerHTML = `确定删除<strong>${levelLabel}</strong>分类「<strong>${escapeHtml(node.name)}</strong>」吗？此操作不可撤销。`;
  }
  if (hint) {
    if (node.level === 2 && node.children?.length) {
      hint.textContent = `该分类下含 ${node.children.length} 个三级子分类，将一并删除。`;
    } else if (node.level === 2) {
      const l1 = findL1Ancestor(id);
      hint.textContent = l1?.children?.length === 1
        ? '删除后其所属一级分类也将自动移除。'
        : '';
    } else {
      hint.textContent = '';
    }
  }
  openModal('modal-delete-category');
}

function cancelDeleteCategory() {
  pendingDeleteCategoryId = null;
  closeModal('modal-delete-category');
}

function confirmDeleteCategory() {
  const id = pendingDeleteCategoryId;
  if (!id) return;
  pendingDeleteCategoryId = null;
  closeModal('modal-delete-category');

  for (let i = 0; i < CLASSIFICATION_TREE.length; i++) {
    const l1 = CLASSIFICATION_TREE[i];
    const i2 = l1.children?.findIndex(c => c.id === id) ?? -1;
    if (i2 >= 0) {
      delete ELECTIVE_SEMESTER_REQUIREMENTS[id];
      l1.children.splice(i2, 1);
      if (!l1.children.length) CLASSIFICATION_TREE.splice(i, 1);
      renderClassificationTree();
      return;
    }
    for (const l2 of l1.children || []) {
      const i3 = l2.children?.findIndex(c => c.id === id) ?? -1;
      if (i3 >= 0) {
        l2.children.splice(i3, 1);
        renderClassificationTree();
        return;
      }
    }
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setCategoryFormReadonly(readonly) {
  ['h1-select', 'h2-select', 'study-type-select'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = readonly;
  });
}

function resetCategoryL2FormDefaults() {
  const h1 = document.getElementById('h1-select');
  const h2 = document.getElementById('h2-select');
  const study = document.getElementById('study-type-select');
  if (h1) h1.value = '';
  if (h2) {
    h2.innerHTML = '<option value="">请选择</option>';
    h2.value = '';
  }
  if (study) study.value = 'compulsory';
}

function openAddCategoryModal() {
  if (versionEditReadonly) return;
  categoryFormMode = 'add-l2';
  parentL2CategoryId = null;
  editingCategoryId = null;
  document.getElementById('modal-category-title').textContent = '新增二级分类';
  setCategoryFormReadonly(false);
  document.getElementById('h1-select').disabled = false;
  document.getElementById('h2-select').disabled = false;
  document.getElementById('category-l3-name').value = '';
  clearCategoryCreditsInputs();
  resetCategoryL2FormDefaults();
  openModal('modal-add-category');
}

function openAddL3CategoryModal(l2Id) {
  if (versionEditReadonly) return;
  const l2 = findClassificationNode(l2Id);
  if (!l2 || l2.level !== 2) return;
  categoryFormMode = 'add-l3';
  parentL2CategoryId = l2Id;
  editingCategoryId = null;
  document.getElementById('modal-category-title').textContent = '新增三级分类';
  document.getElementById('category-l3-parent-display').value = l2.name;
  document.getElementById('category-l3-name').value = '';
  clearCategoryCreditsInputs();
  openModal('modal-add-category');
}

function findL1Ancestor(nodeId) {
  for (const l1 of CLASSIFICATION_TREE) {
    if (l1.id === nodeId) return l1;
    for (const l2 of l1.children || []) {
      if (l2.id === nodeId) return l1;
      if (l2.children?.some(l3 => l3.id === nodeId)) return l1;
    }
  }
  return null;
}

const L1_H1_MAP = {
  'l1-comp': 'compulsory',
  'l1-core': 'core',
  'l1-elec': 'elective'
};

function findL2Parent(nodeId) {
  for (const l1 of CLASSIFICATION_TREE) {
    for (const l2 of l1.children || []) {
      if (l2.id === nodeId) return l2;
      if (l2.children?.some(l3 => l3.id === nodeId)) return l2;
    }
  }
  return null;
}

function populateCategoryFormFromNode(node) {
  const h1 = document.getElementById('h1-select');
  const h2 = document.getElementById('h2-select');
  const l1 = findL1Ancestor(node.id);
  if (h1 && l1 && L1_H1_MAP[l1.id]) h1.value = L1_H1_MAP[l1.id];
  onH1Change();
  const l2 = node.level === 3 ? findL2Parent(node.id) : (node.level === 2 ? node : null);
  if (h2 && l2) {
    const opt = Array.from(h2.options).find(o => o.text === l2.name);
    if (opt) h2.value = opt.value;
    else h2.innerHTML += `<option>${escapeHtml(l2.name)}</option>`;
    h2.value = l2.name;
  }
  if (node.level === 3) {
    document.getElementById('category-l3-parent-display').value = l2?.name || '';
    document.getElementById('category-l3-name').value = node.name;
  }
}

function openEditCategory(id) {
  if (versionEditReadonly) return;
  const node = findClassificationNode(id);
  if (!node || !canEditCategory(node)) return;
  editingCategoryId = id;
  parentL2CategoryId = node.level === 3 ? findL2Parent(node.id)?.id : null;
  categoryFormMode = node.level === 3 ? 'edit-l3' : 'edit-l2';
  document.getElementById('modal-category-title').textContent =
    node.level === 3 ? '编辑三级分类' : '编辑二级分类';
  populateCategoryFormFromNode(node);
  setCategoryFormReadonly(true);
  setCategoryCreditsInputs(node);
  document.getElementById('study-type-select').value = node.studyType || 'compulsory';
  onCategoryLevelChange();
  openModal('modal-add-category');
}

function renderTreeSummaryCreditCell(value, total = false) {
  const cls = total ? 'credit-auto l1 total-value' : 'credit-auto l1';
  return `<td class="credit-cell"><span class="${cls}">${value}</span></td>`;
}

function renderTreeSummaryCountCell(value, total = false) {
  const cls = total ? 'credit-auto l1 total-value' : 'credit-auto l1';
  return `<td class="count-cell"><span class="${cls}">${value}</span></td>`;
}

function renderClassificationTree() {
  syncClassificationStoredCredits();
  const tbody = document.getElementById('classification-tree-body');
  if (!tbody) return;

  let totalCompulsory = 0;
  let totalElective = 0;
  let totalCompulsoryMax = 0;
  let totalElectiveMax = 0;
  let totalCompulsoryCount = 0;
  let totalElectiveCount = 0;
  const rows = [];

  CLASSIFICATION_TREE.forEach(l1 => {
    const l1Min = calcNodeCreditsMin(l1);
    const l1Max = calcNodeCreditsMax(l1);
    const l1Count = calcNodeCourseCount(l1);
    if (l1.studyType === 'compulsory') {
      totalCompulsory += l1Min;
      totalCompulsoryMax += l1Max;
      totalCompulsoryCount += l1Count;
    } else {
      totalElective += l1Min;
      totalElectiveMax += l1Max;
      totalElectiveCount += l1Count;
    }

    rows.push(`<tr class="row-l1${l1.highlight ? ' highlight' : ''}">
      <td><span class="tree-toggle">▼</span> ${l1.name}</td>
      <td class="col-center">${studyTypeTag(l1.studyType)}</td>
      ${renderCreditCell(l1)}
      ${renderCourseCountCell(l1)}
      <td class="actions">${renderCategoryActions(l1)}</td>
    </tr>`);

    (l1.children || []).forEach(l2 => {
      const hasL3 = !!l2.children?.length;
      rows.push(`<tr class="row-l2${hasL3 ? ' has-l3' : ''}">
        <td class="indent-1">├ ${l2.name}</td>
        <td class="col-center">${studyTypeTag(l2.studyType)}</td>
        ${renderCreditCell(l2)}
        ${renderCourseCountCell(l2)}
        <td class="actions">${renderCategoryActions(l2)}</td>
      </tr>`);

      (l2.children || []).forEach(l3 => {
        rows.push(`<tr class="row-l3">
          <td class="indent-2">└ ${l3.name}</td>
          <td class="col-center">${studyTypeTag(l3.studyType)}</td>
          ${renderCreditCell(l3)}
          ${renderCourseCountCell(l3)}
          <td class="actions">${renderCategoryActions(l3)}</td>
        </tr>`);
      });
    });
  });

  const totalMin = totalCompulsory + totalElective;
  const totalMax = totalCompulsoryMax + totalElectiveMax;
  const totalCourseCount = totalCompulsoryCount + totalElectiveCount;

  rows.push(`<tr class="subtotal-row">
    <td colspan="2">必修小计</td>
    ${renderTreeSummaryCreditCell(totalCompulsory)}
    ${renderTreeSummaryCreditCell(totalCompulsoryMax)}
    ${renderTreeSummaryCountCell(totalCompulsoryCount)}
    <td></td>
  </tr>`);
  rows.push(`<tr class="subtotal-row">
    <td colspan="2">选修小计</td>
    ${renderTreeSummaryCreditCell(totalElective)}
    ${renderTreeSummaryCreditCell(totalElectiveMax)}
    ${renderTreeSummaryCountCell(totalElectiveCount)}
    <td></td>
  </tr>`);
  rows.push(`<tr class="total-row">
    <td colspan="2"><strong>学分总计</strong> <span class="form-hint" style="font-weight:400">（必修 + 选修）</span></td>
    ${renderTreeSummaryCreditCell(totalMin, true)}
    ${renderTreeSummaryCreditCell(totalMax, true)}
    ${renderTreeSummaryCountCell(totalCourseCount, true)}
    <td></td>
  </tr>`);

  tbody.innerHTML = rows.join('');

  const sc = document.getElementById('sum-compulsory');
  const se = document.getElementById('sum-elective');
  const st = document.getElementById('sum-total');
  if (sc) sc.textContent = totalCompulsory;
  if (se) se.textContent = totalElective;
  if (st) st.textContent = totalMin;
  renderSemesterMatrixTable();
  renderCourseCreditsSummary();
  refreshProgrammeStructureIfVisible();
  updateVersionEditTabStates();
}

function onCategoryLevelChange() {
  const hint = document.getElementById('category-credits-hint');
  const wrap = document.getElementById('category-credits-wrap');
  const isRange = isCategoryCreditsRangeMode();
  if (!hint) return;
  if (categoryFormMode === 'add-l3' || categoryFormMode === 'edit-l3') {
    const l2 = getCategoryL3ParentL2();
    const excludeId = categoryFormMode === 'edit-l3' ? editingCategoryId : null;
    const siblingSum = sumL3CreditsMinUnderL2(l2, excludeId);
    const isElectiveL2 = l2?.studyType === 'elective';
    let capHint = '';
    if (isElectiveL2) {
      normalizeNodeCredits(l2);
      const l2Min = Number(l2.creditsMin) || 0;
      const remain = l2Min > 0 ? Math.max(0, l2Min - siblingSum) : null;
      if (l2Min > 0) {
        capHint = `；${categoryFormMode === 'edit-l3' ? '修改后' : '新增后'}三级最低合计不得超过` +
          `${l2?.name ? `「${l2.name}」` : '二级分类'}最低学分 ${l2Min}` +
          `（当前${excludeId ? '其他' : '已有'}子级合计 ${siblingSum}，剩余可分配 ${remain}）`;
      }
    } else {
      const l2Cap = getL2CreditsMaxLimit(l2);
      const remain = l2Cap != null ? Math.max(0, l2Cap - siblingSum) : null;
      if (l2Cap != null) {
        capHint = `；${categoryFormMode === 'edit-l3' ? '修改后' : '新增后'}三级最低合计须等于二级学分 ${l2Cap}` +
          `（当前${excludeId ? '其他' : '已有'}子级合计 ${siblingSum}，剩余可分配 ${remain}）`;
      }
    }
    const ruleHint = isElectiveL2
      ? '选修规则：三级最低合计≤二级最低'
      : '必修规则：三级最低合计=二级最低=二级最高';
    hint.textContent = categoryFormMode === 'edit-l3'
      ? `可修改三级分类名称与最低学分（三级不设最高学分；${ruleHint}${capHint}）`
      : `请填写该三级分类的最低学分（三级不设最高学分；${ruleHint}${capHint}）`;
    if (wrap) wrap.style.display = '';
    return;
  }
  if (editingCategoryId) {
    const editingL2 = findClassificationNode(editingCategoryId);
    const hasL3 = editingL2?.children?.length > 0;
    const structureHint = hasL3
      ? (isRange
        ? '；有三级子分类时须满足：三级最低合计≤二级最低≤二级最高'
        : '；有三级子分类时须满足：三级最低合计=二级最低=二级最高')
      : '';
    hint.textContent = isRange
      ? `选修二级：通过本弹窗修改最低/最高学分；分类名称与层级不可变更${structureHint}`
      : `必修二级：通过本弹窗修改最低学分；最高学分自动等于最低学分${structureHint}`;
    if (wrap) wrap.style.display = '';
    return;
  }
  hint.textContent = isRange
    ? '选修二级：请填写最低/最高学分（有三级子分类时须满足：三级最低合计≤二级最低≤二级最高）'
    : '必修二级：请填写最低学分，最高学分自动同步（有三级子分类时须满足：三级最低合计=二级最低=二级最高）';
}

function isElectiveStudyType() {
  return document.getElementById('study-type-select')?.value === 'elective';
}

function onStudyTypeChange() {
  applyCategoryFormMode();
  onCategoryLevelChange();
  updateElectiveMatrixHint();
}

function saveCategory() {
  const creditsResult = readCategoryCreditsFromForm();
  if (creditsResult.error) {
    alert(creditsResult.error);
    return;
  }
  const { creditsMin, creditsMax } = creditsResult;

  if (categoryFormMode === 'edit-l3' || categoryFormMode === 'edit-l2') {
    const node = findClassificationNode(editingCategoryId);
    if (!node) return;
    if (categoryFormMode === 'edit-l2') {
      const newStudyType = document.getElementById('study-type-select')?.value;
      if (newStudyType === 'elective' && !validateElectiveMatrixRequired(creditsMax)) return;
      if (node.children?.length) {
        const tempNode = { ...node, creditsMin, creditsMax };
        const structure = validateL2L3CreditsConsistency(tempNode);
        if (!structure.ok) {
          alert(structure.message);
          return;
        }
      }
    }
    node.creditsMin = creditsMin;
    if (categoryFormMode === 'edit-l3') {
      const name = document.getElementById('category-l3-name')?.value.trim();
      if (!name) {
        alert('请填写三级分类名称');
        return;
      }
      const l2 = findL2Parent(node.id);
      if (l2 && (l2.children || []).some(c => c.id !== node.id && c.name === name)) {
        alert('该二级分类下已存在同名三级分类');
        return;
      }
      node.name = name;
      delete node.creditsMax;
    } else {
      node.creditsMax = creditsMax;
    }
    delete node.credits;
    if (categoryFormMode === 'edit-l2') {
      node.studyType = document.getElementById('study-type-select').value;
      if (node.studyType === 'elective') {
        ELECTIVE_SEMESTER_REQUIREMENTS[node.id] = collectElectiveMatrixRequirements();
      } else {
        delete ELECTIVE_SEMESTER_REQUIREMENTS[node.id];
      }
    }
    editingCategoryId = null;
    parentL2CategoryId = null;
    categoryFormMode = 'add-l2';
    setCategoryFormReadonly(false);
    closeModal('modal-add-category');
    renderClassificationTree();
    alert('分类已更新（原型）');
    return;
  }

  if (categoryFormMode === 'add-l3') {
    const name = document.getElementById('category-l3-name')?.value.trim();
    if (!name) {
      alert('请填写三级分类名称');
      return;
    }
    const l2 = findClassificationNode(parentL2CategoryId);
    if (!l2 || l2.level !== 2) return;
    if ((l2.children || []).some(c => c.name === name)) {
      alert('该二级分类下已存在同名三级分类');
      return;
    }
    if (!l2.children) l2.children = [];
    l2.children.push({
      id: generateCategoryNodeId(3),
      level: 3,
      name,
      studyType: l2.studyType,
      creditsMin,
      courseCount: 0
    });
    delete l2.courseCount;
    parentL2CategoryId = null;
    categoryFormMode = 'add-l2';
    closeModal('modal-add-category');
    renderClassificationTree();
    alert('三级分类已添加（原型）');
    return;
  }

  const h1Key = document.getElementById('h1-select')?.value;
  const h2Name = document.getElementById('h2-select')?.value;
  const studyType = document.getElementById('study-type-select')?.value || 'compulsory';
  if (!h1Key) {
    alert('请选择一级分类');
    return;
  }
  if (!h2Name) {
    alert('请选择二级分类');
    return;
  }
  if (studyType === 'elective' && !validateElectiveMatrixRequired(creditsMax)) return;

  const l1 = findOrCreateL1(h1Key);
  if (!l1) return;
  if ((l1.children || []).some(c => c.name === h2Name)) {
    alert('该一级分类下已存在同名二级分类');
    return;
  }
  const l2Id = generateCategoryNodeId(2);
  const l2 = {
    id: l2Id,
    level: 2,
    name: h2Name,
    studyType,
    creditsMin,
    creditsMax,
    courseCount: 0
  };
  if (!l1.children) l1.children = [];
  l1.children.push(l2);
  if (studyType === 'elective') {
    ELECTIVE_SEMESTER_REQUIREMENTS[l2Id] = collectElectiveMatrixRequirements();
  }

  categoryFormMode = 'add-l2';
  closeModal('modal-add-category');
  renderClassificationTree();
  alert('二级分类已添加（原型）');
}

// ── Programme Structure (Table 3a) ──
const PROGRAMME_STRUCTURE = {
  institution: 'Xiamen University Malaysia',
  programme: 'Bachelor of Science in Physics (Honours)',
  totalCredits: 145,
  years: [
    {
      year: 1,
      semesters: [
        {
          label: 'Semester 1', weeks: 18,
          courses: [
            { name: 'Mechanics', code: 'PHY101', cls: 'Major Core', credit: 4 },
            { name: 'Calculus I A', code: 'BSC124', cls: 'Common Core', credit: 4 },
            { name: 'Introduction to Physics Lab', code: 'PHY102', cls: 'Major Core', credit: 2 },
            { name: 'English for Academic Writing', code: 'ENG101', cls: 'Compulsory', credit: 3 },
            { name: 'Malaysian Studies 3', code: 'MPU3123', cls: 'Compulsory', credit: 3 },
            { name: 'Physics Lab I', code: 'PHY103', cls: 'Major Core', credit: 2 },
            { name: 'Linear Algebra', code: 'BSC125', cls: 'Common Core', credit: 2 }
          ]
        },
        {
          label: 'Semester 2', weeks: 18,
          courses: [
            { name: 'Electricity and Magnetism', code: 'PHY104', cls: 'Major Core', credit: 4 },
            { name: 'Calculus I B', code: 'BSC126', cls: 'Common Core', credit: 4 },
            { name: 'Waves and Optics', code: 'PHY105', cls: 'Major Core', credit: 4 },
            { name: 'Introduction to Programming', code: 'BSC127', cls: 'Common Core', credit: 3 },
            { name: 'Ethnic Relations', code: 'MPU3113', cls: 'Compulsory', credit: 3 },
            { name: 'Physics Lab II', code: 'PHY106', cls: 'Major Core', credit: 1 }
          ]
        },
        {
          label: 'Semester 3', weeks: 6,
          courses: [
            { name: 'Community Service', code: 'MPU3412', cls: 'Compulsory', credit: 2 },
            { name: 'Physics Summer Workshop', code: 'PHY107', cls: 'Major Core', credit: 3 }
          ]
        }
      ]
    },
    {
      year: 2,
      semesters: [
        {
          label: 'Semester 1', weeks: 18,
          courses: [
            { name: 'Quantum Mechanics I', code: 'PHY201', cls: 'Major Core', credit: 4 },
            { name: 'Mathematical Methods for Physics', code: 'PHY202', cls: 'Major Core', credit: 4 },
            { name: 'Thermodynamics', code: 'PHY203', cls: 'Major Core', credit: 4 },
            { name: 'Electronics', code: 'PHY204', cls: 'Major Core', credit: 3 },
            { name: 'Computational Physics', code: 'PHY205', cls: 'Major Core', credit: 3 },
            { name: 'Physics Lab III', code: 'PHY206', cls: 'Major Core', credit: 2 }
          ]
        },
        {
          label: 'Semester 2', weeks: 18,
          courses: [
            { name: 'Quantum Mechanics II', code: 'PHY207', cls: 'Major Core', credit: 4 },
            { name: 'Statistical Mechanics', code: 'PHY208', cls: 'Major Core', credit: 4 },
            { name: 'Electromagnetic Theory', code: 'PHY209', cls: 'Major Core', credit: 4 },
            { name: 'Solid State Physics I', code: 'PHY210', cls: 'Major Core', credit: 3 },
            { name: 'Select from Table 2b', code: 'GXXXX', cls: 'General Elective', credit: 3, elective: true }
          ]
        },
        {
          label: 'Semester 3', weeks: 6,
          courses: [
            { name: 'Research Methods in Physics', code: 'PHY211', cls: 'Major Core', credit: 3 },
            { name: 'Select from Table 2b', code: 'GXXXX', cls: 'General Elective', credit: 2, elective: true }
          ]
        }
      ]
    },
    {
      year: 3,
      semesters: [
        {
          label: 'Semester 1', weeks: 18,
          courses: [
            { name: 'Solid State Physics II', code: 'PHY301', cls: 'Major Core', credit: 4 },
            { name: 'Nuclear and Particle Physics', code: 'PHY302', cls: 'Major Core', credit: 4 },
            { name: 'Select from Table 2f Group 1, 2, or 3', code: '—', cls: 'Major Elective', credit: 4, elective: true },
            { name: 'Select from Table 2f Group 1, 2, or 3', code: '—', cls: 'Major Elective', credit: 4, elective: true },
            { name: 'Select from Table 2b', code: 'GXXXX', cls: 'General Elective', credit: 3, elective: true }
          ]
        },
        {
          label: 'Semester 2', weeks: 18,
          courses: [
            { name: 'Industrial Training / Undergraduate Research II / Capstone Project', code: 'PHY303', cls: 'Industrial Training / Major Elective', credit: 6 },
            { name: 'Select from Table 2f Group 1, 2, or 3', code: '—', cls: 'Major Elective', credit: 4, elective: true },
            { name: 'Select from Table 2b', code: 'GXXXX', cls: 'General Elective', credit: 3, elective: true }
          ]
        },
        {
          label: 'Semester 3', weeks: 6,
          courses: [
            { name: 'Select from Table 2f Group 1, 2, or 3', code: '—', cls: 'Major Elective', credit: 3, elective: true }
          ]
        }
      ]
    },
    {
      year: 4,
      semesters: [
        {
          label: 'Semester 1', weeks: 18,
          courses: [
            { name: 'Final Year Project I', code: 'PHY401', cls: 'Major Core', credit: 4 },
            { name: 'Select from Table 2f Group 1, 2, or 3', code: '—', cls: 'Major Elective', credit: 4, elective: true },
            { name: 'Select from Table 2f Group 1, 2, or 3', code: '—', cls: 'Major Elective', credit: 4, elective: true },
            { name: 'Select from Table 2b', code: 'GXXXX', cls: 'General Elective', credit: 3, elective: true }
          ]
        },
        {
          label: 'Semester 2', weeks: 18,
          courses: [
            { name: 'Final Year Project II', code: 'PHY402', cls: 'Major Core', credit: 6 },
            { name: 'Select from Table 2f Group 1, 2, or 3', code: '—', cls: 'Major Elective', credit: 4, elective: true },
            { name: 'Select from Table 2b', code: 'GXXXX', cls: 'General Elective', credit: 3, elective: true }
          ]
        },
        {
          label: 'Semester 3', weeks: 6,
          courses: []
        }
      ]
    }
  ]
};

function sumCredits(courses) {
  return courses.reduce((s, c) => s + (c.credit || 0), 0);
}

function getProgrammeStructureCourseCodeDisplay(code, { isPool = false } = {}) {
  if (isPool) return '';
  const value = String(code || '').trim();
  if (!value || value === '—' || value === '-' || value.toUpperCase() === 'GXXXX') return '';
  return escapeHtml(value);
}

function renderSemesterTable(sem, year, semIndex) {
  const code = semesterCode(year, semIndex);
  const total = sumCredits(sem.courses);
  const rows = sem.courses.length
    ? sem.courses.map(c => `
        <tr class="${c.elective ? 'elective-row' : ''}">
          <td>${c.name}</td>
          <td>${getProgrammeStructureCourseCodeDisplay(c.code, { isPool: c.isPool })}</td>
          <td class="ps-classification">${c.cls}</td>
          <td>${c.credit}</td>
        </tr>`).join('')
    : `<tr><td colspan="4" style="text-align:center;color:#999;padding:12px">—</td></tr>`;

  const weeks = sem.weeks || SEMESTER_WEEKS[semIndex] || 18;

  return `
    <div class="ps-semester">
      <div class="ps-sem-header">${code}<br><small>Sem ${semIndex} · ${weeks} weeks</small></div>
      <table class="ps-course-table">
        <colgroup>
          <col class="col-name">
          <col class="col-code">
          <col class="col-cls">
          <col class="col-credit">
        </colgroup>
        <thead>
          <tr>
            <th>Name of Course</th>
            <th>Course Code</th>
            <th>Classification</th>
            <th>Credit Value</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td colspan="3">TOTAL CREDIT VALUE</td>
            <td>${total || '—'}</td>
          </tr>
        </tfoot>
      </table>
    </div>`;
}

function renderProgrammeStructure(containerId, data) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const d = data || buildProgrammeStructureFromCourses();
  const hasCourses = d.years.some(y => y.semesters.some(s => s.courses.length));

  if (!hasCourses) {
    el.innerHTML = `
      <div class="programme-structure">
        <div class="ps-meta">
          <div class="ps-meta-item"><label>Institution</label><span>${escapeHtml(d.institution)}</span></div>
          <div class="ps-meta-item"><label>Programme</label><span>${escapeHtml(d.programme)}</span></div>
          <div class="ps-meta-item"><label>Total Credit Value</label><span>—</span></div>
        </div>
        <h2 class="ps-title">Programme Structure</h2>
        <p class="ps-empty-hint">暂无已指定开课学期的课程。请在 TAB2 课程设置中为课程开启「指定学期」并保存，相关课程将按学期逐门展示于此。</p>
      </div>`;
    return;
  }

  const yearsHtml = d.years.map(y => `
    <div class="ps-year-block">
      <div class="ps-year-label">Year ${y.year}</div>
      <div class="ps-semesters">
        ${y.semesters.map((sem, idx) => renderSemesterTable(sem, y.year, idx + 1)).join('')}
      </div>
    </div>`).join('');

  el.innerHTML = `
    <div class="programme-structure">
      <div class="ps-meta">
        <div class="ps-meta-item"><label>Institution</label><span>${d.institution}</span></div>
        <div class="ps-meta-item"><label>Programme</label><span>${d.programme}</span></div>
        <div class="ps-meta-item"><label>Total Credit Value</label><span>${d.totalCredits}</span></div>
      </div>
      <h2 class="ps-title">Programme Structure</h2>
      ${yearsHtml}
    </div>`;
}

// ── Init ──
initVersionContentStore();
initExecContentStore();
syncAllVersionEndIntakes();
bindProgramCourseFilters();
bindCategoryCreditsInputs();
bindElectiveMatrixInputs();
onH1Change();
onStudyTypeChange();
onCategoryLevelChange();
resetElectiveMatrix();
initSemesterSelects();
renderClassificationTree();
renderProgramCoursesTable();
filterVersions();
rebuildExecListIntakeFilterOptions();
renderExecList();
renderApprovalList();
renderChangeReviewList();
initExecProgrammeSelect();
rebuildExecIntakeSelect('finance');
onExecIntakeInput();
renderProgrammeStructure('programme-structure-root');

// ── Data Statistics (Bloom's Taxonomy Charts) ──
const BLOOM_DOMAIN_SIZES = { cognitive: 6, affective: 5, psychomotor: 7 };

function slugifyStatsId(text) {
  return String(text || '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
}

function buildStatsTreeFromExecPlans() {
  const programmeGroups = new Map();
  EXEC_PLANS
    .filter(ep => ep.status === 'published')
    .forEach(ep => {
      const programme = PROGRAMMES[ep.programmeKey];
      if (!programme) return;
      const parsed = parseIntake(ep.intake);
      if (!parsed) return;
      const yearKey = String(parsed.year);

      if (!programmeGroups.has(ep.programmeKey)) {
        programmeGroups.set(ep.programmeKey, {
          id: `programme-${ep.programmeKey}`,
          label: `${programme.name} (${programme.nameZh})`,
          years: new Map()
        });
      }
      const mg = programmeGroups.get(ep.programmeKey);
      if (!mg.years.has(yearKey)) {
        mg.years.set(yearKey, {
          id: `programme-${ep.programmeKey}-year-${yearKey}`,
          label: yearKey,
          plans: []
        });
      }
      mg.years.get(yearKey).plans.push({
        id: `ep-${ep.id}`,
        leaf: true,
        epId: ep.id,
        intakeCode: ep.intake,
        programme: `${programme.name} (${programme.nameZh})`,
        label: formatIntakeDisplay(ep.intake),
        planCode: ep.planCode
      });
    });

  return [...programmeGroups.values()]
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'))
    .map(progGroup => ({
      id: progGroup.id,
      label: progGroup.label,
      children: [...progGroup.years.values()]
        .sort((a, b) => Number(b.label) - Number(a.label))
        .map(year => ({
          id: year.id,
          label: year.label,
          children: year.plans.sort((a, b) => String(b.intakeCode).localeCompare(String(a.intakeCode)))
        }))
    }));
}

let STATS_TREE = [];
let statsSelectedLeafId = null;
let statsTreeFilter = { bloom: '' };
let statsTreeExpanded = new Set();

function findFirstStatsLeafId(nodes = STATS_TREE) {
  for (const node of nodes) {
    if (node.leaf) return node.id;
    if (node.children?.length) {
      const found = findFirstStatsLeafId(node.children);
      if (found) return found;
    }
  }
  return null;
}

function initStatsTree() {
  STATS_TREE = buildStatsTreeFromExecPlans();
  if (!statsSelectedLeafId || !findStatsLeafNode(statsSelectedLeafId)) {
    statsSelectedLeafId = findFirstStatsLeafId() || 'ep-1';
  }
  statsTreeExpanded = new Set();
  STATS_TREE.forEach(prog => statsTreeExpanded.add(prog.id));
}

function resolveExecPlanFromStatsLeaf(leafId) {
  if (String(leafId || '').startsWith('ep-')) {
    const id = Number(leafId.slice(3));
    return EXEC_PLANS.find(ep => ep.id === id) || null;
  }
  return null;
}

function getProgramCourseClosForStats(pc) {
  if (Array.isArray(pc?.clos) && pc.clos.length) return pc.clos;
  return getCatalogCourseCloSlt(pc.catalogId).clos || [];
}

function parseBloomLevelCode(code) {
  const m = /^([CAP])(\d+)$/i.exec(String(code || '').trim());
  if (!m) return null;
  const domain = m[1].toUpperCase() === 'C'
    ? 'cognitive'
    : m[1].toUpperCase() === 'A'
      ? 'affective'
      : 'psychomotor';
  const index = Number(m[2]) - 1;
  const size = BLOOM_DOMAIN_SIZES[domain];
  if (index < 0 || index >= size) return null;
  return { domain, index };
}

function createEmptyBloomByYear(duration) {
  return Array.from({ length: duration }, (_, i) => ({
    year: i + 1,
    cognitive: 0,
    affective: 0,
    psychomotor: 0,
    cLevels: Array(BLOOM_DOMAIN_SIZES.cognitive).fill(0),
    aLevels: Array(BLOOM_DOMAIN_SIZES.affective).fill(0),
    pLevels: Array(BLOOM_DOMAIN_SIZES.psychomotor).fill(0)
  }));
}

function buildBloomDatasetFromCounts(counts, byYear) {
  const cTotal = counts.cognitive.reduce((a, b) => a + b, 0);
  const aTotal = counts.affective.reduce((a, b) => a + b, 0);
  const pTotal = counts.psychomotor.reduce((a, b) => a + b, 0);
  return {
    matrix: {
      cognitive: [...counts.cognitive, null, cTotal],
      affective: [...counts.affective, null, null, aTotal],
      psychomotor: [...counts.psychomotor, pTotal]
    },
    summary: {
      cognitive: [...counts.cognitive],
      affective: [...counts.affective],
      psychomotor: [...counts.psychomotor]
    },
    byYear,
    totals: { cognitive: cTotal, affective: aTotal, psychomotor: pTotal, all: cTotal + aTotal + pTotal }
  };
}

function computeBloomStatsForLeaf(leafId) {
  const ep = resolveExecPlanFromStatsLeaf(leafId);
  if (!ep) return buildBloomDatasetFromCounts({
    cognitive: Array(BLOOM_DOMAIN_SIZES.cognitive).fill(0),
    affective: Array(BLOOM_DOMAIN_SIZES.affective).fill(0),
    psychomotor: Array(BLOOM_DOMAIN_SIZES.psychomotor).fill(0)
  }, createEmptyBloomByYear(4));

  ensureExecPlanContentStore(ep);
  const content = getExecPlanContent(ep);
  const programCourses = content.programCourses || [];
  const version = findVersionById(ep.versionId);
  const duration = version?.duration || PROGRAMMES[ep.programmeKey]?.duration || 4;

  const counts = {
    cognitive: Array(BLOOM_DOMAIN_SIZES.cognitive).fill(0),
    affective: Array(BLOOM_DOMAIN_SIZES.affective).fill(0),
    psychomotor: Array(BLOOM_DOMAIN_SIZES.psychomotor).fill(0)
  };
  const byYear = createEmptyBloomByYear(duration);

  programCourses.forEach(pc => {
    const yearNum = parseSemesterCode(pc.semester)?.year;
    const yearRow = yearNum && yearNum >= 1 && yearNum <= duration ? byYear[yearNum - 1] : null;
    getProgramCourseClosForStats(pc).forEach(clo => {
      const parsed = parseBloomLevelCode(clo.bloom);
      if (!parsed) return;
      const { domain, index } = parsed;
      counts[domain][index] += 1;
      if (!yearRow) return;
      if (domain === 'cognitive') {
        yearRow.cLevels[index] += 1;
        yearRow.cognitive += 1;
      } else if (domain === 'affective') {
        yearRow.aLevels[index] += 1;
        yearRow.affective += 1;
      } else {
        yearRow.pLevels[index] += 1;
        yearRow.psychomotor += 1;
      }
    });
  });

  return buildBloomDatasetFromCounts(counts, byYear);
}

function getStatsNodeLabel(node) {
  if (node.intakeCode) return formatIntakeDisplay(node.intakeCode);
  return node.label || '';
}

function findStatsLeafNode(id, nodes = STATS_TREE) {
  for (const node of nodes) {
    if (node.id === id && node.leaf) return node;
    if (node.children) {
      const found = findStatsLeafNode(id, node.children);
      if (found) return found;
    }
  }
  return null;
}

function getStatsDataset(leafId) {
  return { bloom: computeBloomStatsForLeaf(leafId) };
}

function getStatsContextHtml(leafId) {
  const ep = resolveExecPlanFromStatsLeaf(leafId);
  if (ep) {
    const programme = PROGRAMMES[ep.programmeKey];
    const version = findVersionById(ep.versionId);
    const duration = version?.duration || programme?.duration || '—';
    return `<strong>Programme:</strong> ${escapeHtml(programme?.name || '—')} (${escapeHtml(programme?.nameZh || '')})` +
      ` &nbsp;&nbsp; <strong>Intake:</strong> ${escapeHtml(formatIntakeDisplay(ep.intake))}` +
      ` &nbsp;&nbsp; <strong>执行计划:</strong> ${escapeHtml(ep.planCode)}` +
      ` &nbsp;&nbsp; <strong>学制:</strong> ${duration} 年`;
  }
  const leaf = findStatsLeafNode(leafId);
  if (!leaf) return '';
  const intakeLabel = formatIntakeDisplay(leaf.intakeCode);
  return `<strong>Programme:</strong> ${escapeHtml(leaf.programme || '—')} &nbsp;&nbsp; <strong>Intake:</strong> ${escapeHtml(intakeLabel)}`;
}

function renderStatsTree(mode) {
  const container = document.getElementById(`stats-tree-${mode}`);
  if (!container) return;
  const filter = (statsTreeFilter[mode] || '').trim().toLowerCase();

  function nodeMatches(node) {
    if (!filter) return true;
    const label = getStatsNodeLabel(node).toLowerCase();
    if (label.includes(filter)) return true;
    if (node.label?.toLowerCase().includes(filter)) return true;
    if (node.programme?.toLowerCase().includes(filter)) return true;
    if (node.planCode?.toLowerCase().includes(filter)) return true;
    return node.children?.some(nodeMatches);
  }

  function renderNode(node, depth = 0) {
    if (!nodeMatches(node)) return '';
    const hasChildren = node.children?.length;
    const expanded = statsTreeExpanded.has(node.id);
    const isLeaf = !!node.leaf;
    const active = isLeaf && node.id === statsSelectedLeafId;
    const toggle = hasChildren
      ? `<span class="tree-toggle">${expanded ? '▾' : '▸'}</span>`
      : '<span class="tree-toggle empty">·</span>';
    let html = `
      <div class="stats-tree-node${active ? ' active' : ''}${hasChildren && !expanded ? ' collapsed' : ''}"
           data-node-id="${node.id}"
           onclick="onStatsTreeNodeClick('${node.id}', ${hasChildren ? 'true' : 'false'}, ${isLeaf ? 'true' : 'false'}, '${mode}')">
        ${toggle}<span>${escapeHtml(getStatsNodeLabel(node))}</span>
      </div>`;
    if (hasChildren && expanded) {
      html += `<div class="stats-tree-children">${node.children.map(child => renderNode(child, depth + 1)).join('')}</div>`;
    }
    return html;
  }

  container.innerHTML = STATS_TREE.map(node => `<div class="stats-tree-group">${renderNode(node)}</div>`).join('');
}

function onStatsTreeNodeClick(nodeId, hasChildren, isLeaf, mode) {
  if (isLeaf) {
    statsSelectedLeafId = nodeId;
    renderStatsTree('bloom');
    renderStatsBloomPage(false);
    return;
  }
  if (hasChildren) {
    if (statsTreeExpanded.has(nodeId)) statsTreeExpanded.delete(nodeId);
    else statsTreeExpanded.add(nodeId);
    renderStatsTree(mode);
  }
}

function filterStatsTree(mode) {
  const input = document.getElementById(`stats-tree-search-${mode}`);
  statsTreeFilter[mode] = input?.value || '';
  renderStatsTree(mode);
}

function exportStatsPage() {
  alert("Export Bloom's Taxonomy Charts（原型）");
}

function renderStatsLineChart(values, { width = 720, height = 220, yMax = 70, xLabels = null } = {}) {
  const pad = { top: 24, right: 16, bottom: 28, left: 36 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = yMax || Math.max(...values, 1);
  const step = values.length > 1 ? innerW / (values.length - 1) : innerW;
  const points = values.map((v, i) => {
    const x = pad.left + i * step;
    const y = pad.top + innerH - (v / max) * innerH;
    return { x, y, v, label: xLabels ? xLabels[i] : String(i + 1) };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const gridLines = [0, 10, 20, 30, 40, 50, 60, 70].filter(v => v <= max).map(v => {
    const y = pad.top + innerH - (v / max) * innerH;
    return `<line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" class="stats-chart-grid"/>`;
  }).join('');
  const dots = points.map(p =>
    `<circle cx="${p.x}" cy="${p.y}" r="3.5" class="stats-chart-dot"/>
     <text x="${p.x}" y="${p.y - 8}" text-anchor="middle" class="stats-chart-value">${p.v}</text>
     <text x="${p.x}" y="${height - 8}" text-anchor="middle" class="stats-chart-label">${escapeHtml(p.label)}</text>`
  ).join('');
  return `<svg viewBox="0 0 ${width} ${height}" class="stats-chart-svg" preserveAspectRatio="xMidYMid meet">
    ${gridLines}
    <path d="${path}" class="stats-chart-line"/>
    ${dots}
  </svg>`;
}

function renderBloomMatrixCell(value) {
  if (value == null) return '<td class="cell-na"></td>';
  return `<td>${value}</td>`;
}

function renderBloomMatrixTable(matrix) {
  const rows = [
    { key: 'cognitive', label: 'Cognitive (C)' },
    { key: 'affective', label: 'Affective (A)' },
    { key: 'psychomotor', label: 'Psychomotor (P)' }
  ];
  const body = rows.map(row => {
    const vals = matrix[row.key];
    return `<tr>
      <td class="matrix-row-label">${row.label}</td>
      ${vals.slice(0, 7).map(renderBloomMatrixCell).join('')}
      <td class="total-col">${vals[7] ?? '—'}</td>
    </tr>`;
  }).join('');

  return `
    <div class="bloom-matrix-wrap">
      <table class="bloom-matrix">
        <thead>
          <tr>
            <th rowspan="2"></th>
            <th colspan="2" class="order-lower">Lower Order</th>
            <th colspan="2" class="order-inter">Intermediate Order</th>
            <th colspan="3" class="order-higher">Higher Order</th>
            <th rowspan="2">Total</th>
          </tr>
          <tr>
            <th class="order-lower">1</th><th class="order-lower">2</th>
            <th class="order-inter">3</th><th class="order-inter">4</th>
            <th class="order-higher">5</th><th class="order-higher">6</th><th class="order-higher">7</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}

function renderYearSummaryPair(rows, levelKeys, levelPrefix) {
  const totals = rows.reduce((acc, r) => {
    acc.cognitive += r.cognitive || 0;
    acc.affective += r.affective || 0;
    acc.psychomotor += r.psychomotor || 0;
    levelKeys.forEach((k, i) => { acc.levels[i] += r[k] || 0; });
    return acc;
  }, { cognitive: 0, affective: 0, psychomotor: 0, levels: levelKeys.map(() => 0) });

  const levelGrand = totals.levels.reduce((a, b) => a + b, 0);
  const domainGrand = levelKeys.length
    ? levelGrand
    : totals.cognitive + totals.affective + totals.psychomotor;
  const pct = n => domainGrand ? `${Math.round(n / domainGrand * 100)}%` : '0%';

  const countHead = levelKeys.length
    ? `<th>Year</th>${levelKeys.map((_, i) => `<th>${levelPrefix}${i + 1}</th>`).join('')}<th>Total</th>`
    : `<th>Year</th><th>Cognitive</th><th>Affective</th><th>Psychomotor</th><th>Total</th>`;

  const countRows = rows.map(r => {
    const rowTotal = levelKeys.length
      ? levelKeys.reduce((s, k) => s + (r[k] || 0), 0)
      : r.cognitive + r.affective + r.psychomotor;
    const cells = levelKeys.length
      ? levelKeys.map(k => `<td>${r[k] ?? 0}</td>`).join('')
      : `<td>${r.cognitive}</td><td>${r.affective}</td><td>${r.psychomotor}</td>`;
    return `<tr><td class="year-col">${r.year}</td>${cells}<td>${rowTotal}</td></tr>`;
  }).join('');

  const countFoot = levelKeys.length
    ? `<tr><td class="year-col">Total</td>${totals.levels.map(v => `<td>${v}</td>`).join('')}<td>${levelGrand}</td></tr>`
    : `<tr><td class="year-col">Total</td><td>${totals.cognitive}</td><td>${totals.affective}</td><td>${totals.psychomotor}</td><td>${domainGrand}</td></tr>`;

  const pctRows = rows.map(r => {
    const rowTotal = levelKeys.length
      ? levelKeys.reduce((s, k) => s + (r[k] || 0), 0)
      : r.cognitive + r.affective + r.psychomotor;
    const cells = levelKeys.length
      ? levelKeys.map(k => `<td>${pct(r[k] || 0)}</td>`).join('')
      : `<td>${pct(r.cognitive)}</td><td>${pct(r.affective)}</td><td>${pct(r.psychomotor)}</td>`;
    return `<tr><td class="year-col">${r.year}</td>${cells}<td>${pct(rowTotal)}</td></tr>`;
  }).join('');

  const pctFoot = levelKeys.length
    ? `<tr><td class="year-col">Total</td>${totals.levels.map(v => `<td>${pct(v)}</td>`).join('')}<td>100%</td></tr>`
    : `<tr><td class="year-col">Total</td><td>${pct(totals.cognitive)}</td><td>${pct(totals.affective)}</td><td>${pct(totals.psychomotor)}</td><td>100%</td></tr>`;

  return `
    <table class="stats-year-table">
      <thead><tr>${countHead}</tr></thead>
      <tbody>${countRows}</tbody>
      <tfoot>${countFoot}</tfoot>
    </table>
    <table class="stats-year-table">
      <thead><tr>${countHead}</tr></thead>
      <tbody>${pctRows}</tbody>
      <tfoot>${pctFoot}</tfoot>
    </table>`;
}

function renderBloomContent(leafId) {
  const bloom = getStatsDataset(leafId).bloom;
  const rows = bloom.byYear.map(r => ({
    year: r.year,
    cognitive: r.cognitive,
    affective: r.affective,
    psychomotor: r.psychomotor,
    cLevels: r.cLevels,
    aLevels: r.aLevels,
    pLevels: r.pLevels
  }));

  const emptyHint = bloom.totals?.all === 0
    ? '<div class="alert-info">当前执行计划暂无 CLO 布鲁姆评级数据。请在执行计划 TAB2 完成课程设置并为各 CLO 指定 A/C/P 级别后查看统计。</div>'
    : '';

  const summaryCharts = [
    { title: 'Cognitive', values: bloom.summary.cognitive },
    { title: 'Affective', values: bloom.summary.affective },
    { title: 'Psychomotor', values: bloom.summary.psychomotor }
  ].map(item => `
    <div class="stats-chart-card stats-mini-chart">
      <div class="stats-chart-title">${item.title}</div>
      ${renderStatsLineChart(item.values, { width: 360, height: 180, yMax: Math.max(...item.values, 10) + 10 })}
    </div>`).join('');

  const cognitiveRows = rows.map(r => {
    const o = { year: r.year };
    r.cLevels.forEach((v, i) => { o[`c${i + 1}`] = v; });
    return o;
  });
  const affectiveRows = rows.map(r => {
    const o = { year: r.year };
    r.aLevels.forEach((v, i) => { o[`a${i + 1}`] = v; });
    return o;
  });
  const psychomotorRows = rows.map(r => {
    const o = { year: r.year };
    r.pLevels.forEach((v, i) => { o[`p${i + 1}`] = v; });
    return o;
  });

  return `
    ${emptyHint}
    <div class="stats-section">${renderBloomMatrixTable(bloom.matrix)}</div>
    <div class="stats-section">
      <div class="stats-section-head"><span class="stats-section-icon">▦</span> Summary</div>
      <div class="stats-chart-row">${summaryCharts}</div>
    </div>
    <div class="stats-section">
      <div class="stats-section-head"><span class="stats-section-icon">▦</span> Summary by Year</div>
      <div class="stats-table-pair">${renderYearSummaryPair(rows, [], '')}</div>
    </div>
    <div class="stats-section">
      <div class="stats-section-head"><span class="stats-section-icon">▦</span> Summary by Year [COGNITIVE]</div>
      <div class="stats-table-pair">${renderYearSummaryPair(cognitiveRows, ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'], 'C')}</div>
    </div>
    <div class="stats-section">
      <div class="stats-section-head"><span class="stats-section-icon">▦</span> Summary by Year [AFFECTIVE]</div>
      <div class="stats-table-pair">${renderYearSummaryPair(affectiveRows, ['a1', 'a2', 'a3', 'a4', 'a5'], 'A')}</div>
    </div>
    <div class="stats-section">
      <div class="stats-section-head"><span class="stats-section-icon">▦</span> Summary by Year [PSYCHOMOTOR]</div>
      <div class="stats-table-pair">${renderYearSummaryPair(psychomotorRows, ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'], 'P')}</div>
    </div>`;
}

function renderStatsBloomPage(renderTree = true) {
  if (!STATS_TREE.length) initStatsTree();
  if (renderTree) renderStatsTree('bloom');
  const ctx = document.getElementById('stats-bloom-context');
  const content = document.getElementById('stats-bloom-content');
  if (ctx) ctx.innerHTML = getStatsContextHtml(statsSelectedLeafId);
  if (content) content.innerHTML = renderBloomContent(statsSelectedLeafId);
}

initStatsTree();

const queryProgramme = document.getElementById('query-programme');
if (queryProgramme) {
  Object.entries(PROGRAMMES).forEach(([key, m]) => {
    queryProgramme.innerHTML += `<option value="${key}">${m.name} ${m.nameZh}</option>`;
  });
}
