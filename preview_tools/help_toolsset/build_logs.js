/**
 * Build toolsset help logs from `tool_plugin/ToolsSetFig/log.md`.
 *
 * Output:
 * - `preview_tools/help_toolsset/logs.generated.js`
 *
 * Usage (from repo root):
 * - `node preview_tools/help_toolsset/build_logs.js`
 */
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const SRC_MD = path.resolve(__dirname, '../../tool_plugin/ToolsSetFig/log.md');
const OUT_JS = path.resolve(__dirname, 'logs.generated.js');

function parseToolsSetFigLogMd(mdText) {
  const text = String(mdText || '').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/);

  /**
   * Wrap leading keyword (with colon) into <span data-doc-key>...</span>
   * Examples:
   * - "✨ New: ..." -> "<span data-doc-key>✨ New:</span> ..."
   * - "🐞 修复: ..." -> "<span data-doc-key>🐞 修复:</span> ..."
   */
  const wrapDocKey = (s) => {
    const str = String(s ?? '');
    // optional emoji/prefix + keyword + ":" / "："
    const m = str.match(/^(\s*(?:[^\w\s]+[\s]*)?(?:New|Fix|Optimize|Change|新增|修复|优化|修改)\s*[:：])/u);
    if (!m) return str;
    const key = m[1];
    return `<span data-doc-key>${key}</span>${str.slice(key.length)}`;
  };

  /** @type {{title:[string,string], date:string, items:any[]}[]} */
  const logs = [];
  /** @type {{title:[string,string], date:string, items:any[]} | null} */
  let current = null;

  let inFence = false;
  /** @type {string} */
  let fenceLang = '';
  /** @type {string[]} */
  let fenceBuf = [];

  const flushFence = () => {
    if (!current) return;
    const codeText = fenceBuf.join('\n');
    // 结构约定：['code', lang, codeText]
    // code 不分中英文（后续渲染时会把 data-zh/data-en 都设为同一份）
    current.items.push(['code', fenceLang, codeText]);
    fenceLang = '';
    fenceBuf = [];
  };

  for (const rawLine of lines) {
    const line = (rawLine ?? '').replace(/\r$/, '');
    const trimmed = line.trim();

    // fenced code block: ```lang
    if (trimmed.startsWith('```')) {
      if (!inFence) {
        inFence = true;
        fenceLang = trimmed.replace(/^```/, '').trim();
        fenceBuf = [];
      } else {
        inFence = false;
        flushFence();
      }
      continue;
    }

    if (inFence) {
      fenceBuf.push(line);
      continue;
    }

    if (trimmed === '') continue;

    // version header: ### v0.1.3 2026/1/23
    if (trimmed.startsWith('### ')) {
      if (current) logs.push(current);
      const header = trimmed.replace(/^###\s+/, '').trim();
      const parts = header.split(/\s+/);
      const version = parts[0] || header;
      const date = parts.slice(1).join(' ') || '';
      current = {
        title: [`${version}`, `${version}`],
        date,
        items: [],
      };
      continue;
    }

    // bullet: - English；中文
    if (trimmed.startsWith('- ')) {
      if (!current) continue;
      const body = trimmed.replace(/^\-\s+/, '').trim();

      // 约定格式：英文；中文（全角分号优先）
      let en = body;
      let zh = body;
      if (body.includes('；')) {
        const idx = body.indexOf('；');
        en = body.slice(0, idx).trim();
        zh = body.slice(idx + 1).trim();
      } else if (body.includes(';')) {
        const idx = body.indexOf(';');
        en = body.slice(0, idx).trim();
        zh = body.slice(idx + 1).trim();
      }

      current.items.push(['li', wrapDocKey(zh), wrapDocKey(en)]);
    }
  }

  // 文件意外结束时的未闭合 fence：仍然输出，方便调试
  if (inFence) {
    flushFence();
  }

  if (current) logs.push(current);
  return logs;
}

function build() {
  const md = fs.readFileSync(SRC_MD, 'utf8');
  const logs = parseToolsSetFigLogMd(md);

  const js =
    '/* AUTO-GENERATED FILE. DO NOT EDIT. */\n' +
    `/* Source: ${path.relative(path.resolve(__dirname, '../..'), SRC_MD).replace(/\\/g, '/')} */\n` +
    `/* Built: ${new Date().toISOString()} */\n` +
    '\n' +
    '(function () {\n' +
    "  'use strict';\n" +
    `  window.__TOOLSSET_HELP_LOGS__ = ${JSON.stringify(logs, null, 2)};\n` +
    '})();\n';

  fs.writeFileSync(OUT_JS, js, 'utf8');
  console.log(`[build_logs] OK -> ${path.relative(process.cwd(), OUT_JS)}`);
}

build();

