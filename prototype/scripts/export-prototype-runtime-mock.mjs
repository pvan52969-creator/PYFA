#!/usr/bin/env node
/**
 * 启动原型页、跑完演示种子后导出运行时 Mock 快照 → course-offering-runtime-mock.js
 * 用法：npm run export:runtime-mock
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import puppeteer from 'puppeteer-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_FILE = join(ROOT, 'course-offering-runtime-mock.js');
const PORT = 3017;
const BASE = `http://127.0.0.1:${PORT}`;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

function findChrome() {
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ];
  return candidates.find(Boolean);
}

function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      try {
        const urlPath = decodeURIComponent(String(req.url || '/').split('?')[0]);
        const rel = urlPath === '/' ? '/index.html' : urlPath;
        const filePath = join(ROOT, rel);
        if (!filePath.startsWith(ROOT)) {
          res.writeHead(403);
          res.end('Forbidden');
          return;
        }
        const body = readFileSync(filePath);
        const ext = extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(body);
      } catch (err) {
        res.writeHead(err.code === 'ENOENT' ? 404 : 500);
        res.end(String(err.message || err));
      }
    });
    server.on('error', reject);
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

async function waitForServer(url, attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch (_) { /* retry */ }
    await new Promise(r => setTimeout(r, 250));
  }
  throw new Error(`Server not ready: ${url}`);
}

const chrome = findChrome();
if (!chrome) {
  console.error('未找到 Chrome/Chromium/Edge，无法导出 Mock 快照。');
  process.exit(1);
}

let server;
try {
  server = await startStaticServer();
  await waitForServer(`${BASE}/index.html`);

  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(120000);
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle0', timeout: 120000 });

    await page.waitForFunction(() => typeof window.buildPrototypeRuntimeMockSnapshot === 'function', {
      timeout: 120000,
    });

    const snapshot = await page.evaluate(() => {
      if (typeof seedTeacherCourseConfirmationDemoIfNeeded === 'function') {
        seedTeacherCourseConfirmationDemoIfNeeded();
      }
      const term = typeof getDefaultOfferingTermCode === 'function' ? getDefaultOfferingTermCode() : '';
      if (term && typeof ensureSharedTeachingSlotLinkDemo === 'function') {
        ensureSharedTeachingSlotLinkDemo(term);
      }
      if (typeof ensureScheduleGlobalDemo === 'function') {
        ensureScheduleGlobalDemo();
      }
      if (typeof ensureGeOfferingQuota === 'function' && term) {
        ensureGeOfferingQuota(term);
      }
      return window.buildPrototypeRuntimeMockSnapshot();
    });

    const json = JSON.stringify(snapshot, null, 2);
    const contents = `/** 原型运行时 Mock 快照 — 由 scripts/export-prototype-runtime-mock.mjs 生成，请勿手改 */
/** 导出时间：${snapshot.exportedAt || new Date().toISOString()} · 版本：${snapshot.version || ''} */
var PROTOTYPE_RUNTIME_MOCK = ${json};
`;
    writeFileSync(OUT_FILE, contents, 'utf8');

    const planTerms = Object.keys(snapshot.planByTerm || {});
    const sectionCount = planTerms.reduce((n, t) => n + ((snapshot.planByTerm[t]?.sections || []).length), 0);
    console.log('Mock 快照已写入:', OUT_FILE);
    console.log(`  学期 ${planTerms.length} 个 · 教学班合计 ${sectionCount} 个`);
  } finally {
    await browser.close();
  }
} finally {
  if (server) {
    await new Promise(resolve => server.close(resolve));
  }
}
