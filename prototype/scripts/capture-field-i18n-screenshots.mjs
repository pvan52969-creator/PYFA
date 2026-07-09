#!/usr/bin/env node
/**
 * 截取培养方案管理原型界面截图，供字段中英对照表引用。
 * 用法：npm start（端口 3000）后执行 npm run capture:field-screenshots
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, '参考文档', '字段截图');
const BASE_URL = process.env.PYFA_PROTOTYPE_URL || 'http://localhost:3000';

function findChrome() {
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ];
  return candidates.find(Boolean);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitAppReady(page) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.waitForFunction(() => typeof goPage === 'function' && typeof VERSIONS !== 'undefined', {
    timeout: 30000,
  });
  await wait(300);
}

async function closeModals(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.modal-overlay.open').forEach((el) => el.classList.remove('open'));
    document.querySelectorAll('#modal-course-picker.open').forEach((el) => el.classList.remove('open'));
  });
}

async function capture(page, slug, selector = '.main') {
  const out = join(OUT_DIR, `${slug}.png`);
  const el = selector ? await page.$(selector) : null;
  if (el) {
    await el.screenshot({ path: out });
  } else {
    await page.screenshot({ path: out, fullPage: false });
  }
  console.log('  ✓', slug);
}

async function captureModal(page, slug, modalId) {
  const out = join(OUT_DIR, `${slug}.png`);
  const el = await page.$(`#${modalId} .modal`);
  if (el) {
    await el.screenshot({ path: out });
  } else {
    await capture(page, slug, '.main');
  }
  console.log('  ✓', slug);
}

async function openFinDraftEdit(page) {
  await page.evaluate(() => {
    enterCurriculumModule();
    const v = VERSIONS.find((x) => x.programmeKey === 'fin' && x.status === 'draft')
      || VERSIONS.find((x) => x.programmeKey === 'fin' && x.status === 'approved')
      || VERSIONS.find((x) => x.programmeKey === 'fin');
    goEdit(v.status === 'approved' ? 'locked' : 'draft', v);
  });
  await page.waitForSelector('#page-version-edit.active');
  await wait(400);
}

async function openFinExecEdit(page) {
  await page.evaluate(() => {
    enterCurriculumModule();
    const ep = EXEC_PLANS.find((x) => x.programmeKey === 'fin') || EXEC_PLANS[0];
    if (ep) goExecEdit(ep.id, true);
  });
  await page.waitForSelector('#page-version-edit.active');
  await wait(400);
}

async function openCourseModalOnFin(page, step = 1) {
  await openFinDraftEdit(page);
  await page.evaluate((s) => {
    activateVersionEditTab('tab-courses');
    const pc = PROGRAM_COURSES[0];
    if (pc) openCourseModal('edit', pc.id);
    setCourseModalStep(s);
    if (s === 3) {
      document.getElementById('slt-section-outline')?.scrollIntoView({ block: 'start' });
    }
  }, step);
  await page.waitForSelector('#modal-add-course.open');
  await wait(350);
}

const SCENARIOS = [
  {
    slug: 'sidebar-curriculum',
    async run(page) {
      await page.evaluate(() => enterCurriculumModule());
      await wait(300);
      await capture(page, 'sidebar-curriculum', '.sidebar');
    },
  },
  {
    slug: 'bloom-stats-page',
    async run(page) {
      await page.evaluate(() => {
        enterCurriculumModule();
        goPage('stats-bloom');
      });
      await page.waitForSelector('#page-stats-bloom.active');
      await wait(500);
      await capture(page, 'bloom-stats-page', '#page-stats-bloom');
    },
  },
  {
    slug: 'version-list',
    async run(page) {
      await page.evaluate(() => {
        enterCurriculumModule();
        goPage('version-list');
      });
      await page.waitForSelector('#page-version-list.active');
      await wait(300);
      await capture(page, 'version-list', '#page-version-list .card');
    },
  },
  {
    slug: 'version-list-filter',
    async run(page) {
      await page.evaluate(() => {
        enterCurriculumModule();
        goPage('version-list');
      });
      await page.waitForSelector('#page-version-list.active');
      await capture(page, 'version-list-filter', '#page-version-list .filter-bar');
    },
  },
  {
    slug: 'common-actions',
    async run(page) {
      await page.evaluate(() => {
        enterCurriculumModule();
        goPage('version-list');
      });
      await page.waitForSelector('#page-version-list.active');
      await capture(page, 'common-actions', '#page-version-list .panel-toolbar');
    },
  },
  {
    slug: 'new-version-modal',
    async run(page) {
      await page.evaluate(() => {
        enterCurriculumModule();
        goPage('version-list');
        openModal('modal-new-version');
      });
      await page.waitForSelector('#modal-new-version.open');
      await captureModal(page, 'new-version-modal', 'modal-new-version');
      await closeModals(page);
    },
  },
  {
    slug: 'copy-version-modal',
    async run(page) {
      await page.evaluate(() => {
        enterCurriculumModule();
        goPage('version-list');
        openModal('modal-copy-version');
      });
      await page.waitForSelector('#modal-copy-version.open');
      await captureModal(page, 'copy-version-modal', 'modal-copy-version');
      await closeModals(page);
    },
  },
  {
    slug: 'version-edit-tabs',
    async run(page) {
      await openFinDraftEdit(page);
      await capture(page, 'version-edit-tabs', '#page-version-edit .tab-bar');
    },
  },
  {
    slug: 'version-edit-info-strip',
    async run(page) {
      await openFinDraftEdit(page);
      await capture(page, 'version-edit-info-strip', '#page-version-edit .edit-info-strip');
    },
  },
  {
    slug: 'version-edit-tab1',
    async run(page) {
      await openFinDraftEdit(page);
      await page.evaluate(() => activateVersionEditTab('tab-classification'));
      await wait(300);
      await capture(page, 'version-edit-tab1', '#tab-classification');
    },
  },
  {
    slug: 'version-edit-tab1-tree-readonly',
    async run(page) {
      await openFinDraftEdit(page);
      await page.evaluate(() => activateVersionEditTab('tab-classification'));
      await capture(page, 'version-edit-tab1-tree-readonly', '#tab-classification .tree-table');
    },
  },
  {
    slug: 'version-edit-tab1-credit-rules',
    async run(page) {
      await openFinDraftEdit(page);
      await page.evaluate(() => activateVersionEditTab('tab-classification'));
      await capture(page, 'version-edit-tab1-credit-rules', '#classification-credit-rules');
    },
  },
  {
    slug: 'version-edit-tab1-elective-matrix',
    async run(page) {
      await openFinDraftEdit(page);
      await page.evaluate(() => activateVersionEditTab('tab-classification'));
      await capture(page, 'version-edit-tab1-elective-matrix', '#elective-semester-matrix');
    },
  },
  {
    slug: 'version-edit-tab1-add-category-modal',
    async run(page) {
      await openFinDraftEdit(page);
      await page.evaluate(() => {
        activateVersionEditTab('tab-classification');
        openAddCategoryModal();
      });
      await page.waitForSelector('#modal-add-category.open');
      await captureModal(page, 'version-edit-tab1-add-category-modal', 'modal-add-category');
      await closeModals(page);
    },
  },
  {
    slug: 'version-edit-tab1-tree',
    async run(page) {
      await openFinDraftEdit(page);
      await page.evaluate(() => activateVersionEditTab('tab-classification'));
      await capture(page, 'version-edit-tab1-tree', '#classification-tree-table');
    },
  },
  {
    slug: 'version-edit-tab2-table',
    async run(page) {
      await openFinDraftEdit(page);
      await page.evaluate(() => activateVersionEditTab('tab-courses'));
      await wait(300);
      await capture(page, 'version-edit-tab2-table', '#tab-courses .course-table-wrap');
    },
  },
  {
    slug: 'version-edit-tab2-config-panel',
    async run(page) {
      await openFinDraftEdit(page);
      await page.evaluate(() => activateVersionEditTab('tab-courses'));
      await capture(page, 'version-edit-tab2-config-panel', '#course-credits-summary');
    },
  },
  {
    slug: 'version-edit-tab2-credits-summary',
    async run(page) {
      await openFinDraftEdit(page);
      await page.evaluate(() => activateVersionEditTab('tab-courses'));
      await capture(page, 'version-edit-tab2-credits-summary', '#course-credits-summary');
    },
  },
  {
    slug: 'version-edit-tab2-course-modal-step1',
    async run(page) {
      await openCourseModalOnFin(page, 1);
      await captureModal(page, 'version-edit-tab2-course-modal-step1', 'modal-add-course');
      await closeModals(page);
    },
  },
  {
    slug: 'version-edit-tab2-course-modal-step2',
    async run(page) {
      await openCourseModalOnFin(page, 2);
      await captureModal(page, 'version-edit-tab2-course-modal-step2', 'modal-add-course');
      await closeModals(page);
    },
  },
  {
    slug: 'version-edit-tab2-course-modal-step3-outline',
    async run(page) {
      await openCourseModalOnFin(page, 3);
      await page.evaluate(() => {
        document.getElementById('slt-section-outline')?.scrollIntoView({ block: 'start' });
      });
      await wait(200);
      const out = join(OUT_DIR, 'version-edit-tab2-course-modal-step3-outline.png');
      const el = await page.$('#slt-section-outline');
      if (el) await el.screenshot({ path: out });
      else await captureModal(page, 'version-edit-tab2-course-modal-step3-outline', 'modal-add-course');
      console.log('  ✓ version-edit-tab2-course-modal-step3-outline');
      await closeModals(page);
    },
  },
  {
    slug: 'version-edit-tab2-course-modal-step3-assessment',
    async run(page) {
      await openCourseModalOnFin(page, 3);
      await page.evaluate(() => {
        document.getElementById('slt-section-continuous')?.scrollIntoView({ block: 'start' });
      });
      await wait(200);
      const out = join(OUT_DIR, 'version-edit-tab2-course-modal-step3-assessment.png');
      const el = await page.$('#slt-section-continuous');
      if (el) await el.screenshot({ path: out });
      else await captureModal(page, 'version-edit-tab2-course-modal-step3-assessment', 'modal-add-course');
      console.log('  ✓ version-edit-tab2-course-modal-step3-assessment');
      await closeModals(page);
    },
  },
  {
    slug: 'version-edit-tab2-catalog-picker',
    async run(page) {
      await openFinDraftEdit(page);
      await page.evaluate(() => {
        activateVersionEditTab('tab-courses');
        openAddCourseModal();
        openCoursePickerModal('main');
      });
      await page.waitForSelector('#modal-course-picker.open');
      await captureModal(page, 'version-edit-tab2-catalog-picker', 'modal-course-picker');
      await closeModals(page);
    },
  },
  {
    slug: 'version-edit-tab3-list',
    async run(page) {
      await openFinDraftEdit(page);
      await page.evaluate(() => activateVersionEditTab('tab-course-groups'));
      await wait(300);
      await capture(page, 'version-edit-tab3-list', '#tab-course-groups');
    },
  },
  {
    slug: 'version-edit-tab3-modal',
    async run(page) {
      await openFinDraftEdit(page);
      await page.evaluate(() => {
        activateVersionEditTab('tab-course-groups');
        openCourseGroupModal('cg-me-y2s2');
      });
      await page.waitForSelector('#modal-course-group.open');
      await captureModal(page, 'version-edit-tab3-modal', 'modal-course-group');
      await closeModals(page);
    },
  },
  {
    slug: 'version-edit-tab3-view-modal',
    async run(page) {
      await openFinDraftEdit(page);
      await page.evaluate(() => {
        activateVersionEditTab('tab-course-groups');
        openCourseGroupViewModal('cg-me-y2s2');
      });
      await page.waitForSelector('#modal-course-group-view.open');
      await captureModal(page, 'version-edit-tab3-view-modal', 'modal-course-group-view');
      await closeModals(page);
    },
  },
  {
    slug: 'version-edit-tab3-member-picker',
    async run(page) {
      await openFinDraftEdit(page);
      await page.evaluate(() => {
        activateVersionEditTab('tab-course-groups');
        openCourseGroupModal(null);
        const sem = document.getElementById('course-group-semester');
        const h1 = document.getElementById('course-group-h1');
        const h2 = document.getElementById('course-group-h2');
        if (sem) sem.value = 'Y2S2';
        onCourseGroupSemesterChange();
        if (h1) h1.value = 'l1-elec';
        onCourseGroupH1Change();
        if (h2) h2.value = 'l2-me';
        openCourseGroupMemberPickerModal();
      });
      await page.waitForSelector('#modal-course-group-member-picker.open');
      await captureModal(page, 'version-edit-tab3-member-picker', 'modal-course-group-member-picker');
      await closeModals(page);
    },
  },
  {
    slug: 'version-edit-tab4-structure',
    async run(page) {
      await openFinDraftEdit(page);
      await page.evaluate(() => activateVersionEditTab('tab-structure'));
      await wait(300);
      await capture(page, 'version-edit-tab4-structure', '#tab-structure');
    },
  },
  {
    slug: 'exec-list',
    async run(page) {
      await page.evaluate(() => {
        enterCurriculumModule();
        goPage('exec-list');
      });
      await page.waitForSelector('#page-exec-list.active');
      await capture(page, 'exec-list', '#page-exec-list .card');
    },
  },
  {
    slug: 'exec-gen-modal',
    async run(page) {
      await page.evaluate(() => {
        enterCurriculumModule();
        goPage('exec-list');
        openModal('modal-gen-exec');
      });
      await page.waitForSelector('#modal-gen-exec.open');
      await captureModal(page, 'exec-gen-modal', 'modal-gen-exec');
      await closeModals(page);
    },
  },
  {
    slug: 'exec-change-log-modal',
    async run(page) {
      await page.evaluate(() => {
        enterCurriculumModule();
        goPage('exec-list');
        const ep = EXEC_PLANS.find((x) => x.programmeKey === 'fin') || EXEC_PLANS[0];
        if (ep) openExecChangeLogModal(ep.id);
      });
      await page.waitForSelector('#modal-exec-change-log.open');
      await captureModal(page, 'exec-change-log-modal', 'modal-exec-change-log');
      await closeModals(page);
    },
  },
  {
    slug: 'exec-edit-info-strip',
    async run(page) {
      await openFinExecEdit(page);
      await capture(page, 'exec-edit-info-strip', '#page-version-edit .edit-info-strip');
    },
  },
  {
    slug: 'exec-edit-tab2-extra',
    async run(page) {
      await openFinExecEdit(page);
      await page.evaluate(() => activateVersionEditTab('tab-courses'));
      await wait(300);
      await capture(page, 'exec-edit-tab2-extra', '#tab-courses .course-table-wrap');
    },
  },
  {
    slug: 'exec-stats-list',
    async run(page) {
      await page.evaluate(() => {
        enterCurriculumModule();
        goPage('stats-exec');
      });
      await page.waitForSelector('#page-stats-exec.active');
      await capture(page, 'exec-stats-list', '#page-stats-exec .card');
    },
  },
  {
    slug: 'approval-tabs',
    async run(page) {
      await page.evaluate(() => {
        enterCurriculumModule();
        goPage('approval-list');
      });
      await page.waitForSelector('#page-approval-list.active');
      await capture(page, 'approval-tabs', '#page-approval-list .approval-tabs');
    },
  },
  {
    slug: 'approval-list',
    async run(page) {
      await page.evaluate(() => {
        enterCurriculumModule();
        goPage('approval-list');
      });
      await page.waitForSelector('#page-approval-list.active');
      await capture(page, 'approval-list', '#page-approval-list .card');
    },
  },
  {
    slug: 'approval-review-modal',
    async run(page) {
      await page.evaluate(() => {
        enterCurriculumModule();
        goPage('approval-list');
        approvalActiveTab = 'pending';
        renderApprovalList();
        const item = APPROVAL_QUEUE.find((i) => resolveReviewerCentricBucket(i) === 'pending');
        if (item) openApprovalReview(item.id);
        else openModal('modal-approval-review');
      });
      await page.waitForSelector('#modal-approval-review.open');
      await captureModal(page, 'approval-review-modal', 'modal-approval-review');
      await closeModals(page);
    },
  },
  {
    slug: 'change-apply-list',
    async run(page) {
      await page.evaluate(() => {
        enterCurriculumModule();
        goPage('change-apply');
      });
      await page.waitForSelector('#page-change-apply.active');
      await capture(page, 'change-apply-list', '#page-change-apply .card');
    },
  },
  {
    slug: 'change-apply-new-modal',
    async run(page) {
      await page.evaluate(() => {
        enterCurriculumModule();
        goPage('change-apply');
        openModal('modal-new-change-apply');
      });
      await page.waitForSelector('#modal-new-change-apply.open');
      await captureModal(page, 'change-apply-new-modal', 'modal-new-change-apply');
      await closeModals(page);
    },
  },
];

function buildIndexHtml(results) {
  const items = results
    .map(({ slug, ok }) => {
      if (!ok) return '';
      return `<figure><img src="./${slug}.png" alt="${slug}"><figcaption><code>${slug}.png</code></figcaption></figure>`;
    })
    .filter(Boolean)
    .join('\n');
  return `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><title>培养方案管理 · 字段截图索引</title>
<style>
body{font-family:system-ui,sans-serif;margin:24px;background:#f8fafc;color:#0f172a}
h1{font-size:20px} p{color:#64748b;font-size:13px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;margin-top:20px}
figure{margin:0;background:#fff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden}
img{display:block;width:100%;height:auto;border-bottom:1px solid #e2e8f0}
figcaption{padding:10px 12px;font-size:12px}
code{color:#334155}
</style></head><body>
<h1>培养方案管理 · 界面截图索引</h1>
<p>由 <code>npm run capture:field-screenshots</code> 自动生成，供「培养方案管理字段中英对照表.xlsx」引用。</p>
<div class="grid">${items}</div>
</body></html>`;
}

mkdirSync(OUT_DIR, { recursive: true });

const chrome = findChrome();
if (!chrome) {
  console.error('未找到 Chrome/Chromium，无法截图。');
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900'],
});

const results = [];
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await waitAppReady(page);
  console.log(`开始截图（${SCENARIOS.length} 张）…`);
  for (const scenario of SCENARIOS) {
    try {
      await closeModals(page);
      await scenario.run(page);
      results.push({ slug: scenario.slug, ok: true });
    } catch (err) {
      console.warn('  ✗', scenario.slug, err.message);
      results.push({ slug: scenario.slug, ok: false });
    }
    await closeModals(page);
    await wait(150);
  }
} finally {
  await browser.close();
}

writeFileSync(join(OUT_DIR, 'index.html'), buildIndexHtml(results), 'utf8');
const okCount = results.filter((r) => r.ok).length;
console.log(`完成：${okCount}/${SCENARIOS.length} 张 → ${OUT_DIR}`);
