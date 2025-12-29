/**
 * 同步构建文件到扩展目录
 * 将项目根目录的 builds 和 publics 文件同步到扩展目录
 * 避免文件重复，保持文件最新
 */

const fs = require('fs');
const path = require('path');

// 获取脚本所在目录（扩展目录）
const EXTENSION_DIR = __dirname;
// 扩展目录是 tool_web/Html2zy，项目根目录是上两级
const ROOT_DIR = path.resolve(EXTENSION_DIR, '../..');

const FILES_TO_SYNC = [
  { from: 'builds/yn_tool.js', to: 'builds/yn_tool.js' },
  { from: 'builds/yn_comp.js', to: 'builds/yn_comp.js' },
  { from: 'builds/yn_icon.js', to: 'builds/yn_icon.js' },
  { from: 'builds/yn_style.css', to: 'builds/yn_style.css' },
  { from: 'publics/run.js', to: 'publics/run.js' }
];

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ 创建目录: ${dir}`);
  }
}

function syncFile(from, to) {
  const sourcePath = path.join(ROOT_DIR, from);
  const targetPath = path.join(EXTENSION_DIR, to);
  
  if (!fs.existsSync(sourcePath)) {
    console.warn(`⚠ 源文件不存在: ${sourcePath}`);
    return false;
  }
  
  ensureDirectoryExists(targetPath);
  
  // 检查文件是否需要更新（比较修改时间）
  let needSync = true;
  if (fs.existsSync(targetPath)) {
    const sourceStat = fs.statSync(sourcePath);
    const targetStat = fs.statSync(targetPath);
    needSync = sourceStat.mtime > targetStat.mtime;
  }
  
  if (needSync) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✓ 同步: ${from} -> ${to}`);
    return true;
  } else {
    console.log(`○ 跳过（已是最新）: ${to}`);
    return false;
  }
}

function main() {
  console.log('开始同步构建文件...\n');
  
  let syncedCount = 0;
  FILES_TO_SYNC.forEach(({ from, to }) => {
    if (syncFile(from, to)) {
      syncedCount++;
    }
  });
  
  console.log(`\n完成！共同步 ${syncedCount} 个文件。`);
}

main();

