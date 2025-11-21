import { build } from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entry = path.resolve(__dirname, 'CodePreviewWidget.tsx');
const outfile = path.resolve(__dirname, '../builds/code-preview.widget.js');

await build({
  entryPoints: [entry],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: ['es2018'],
  outfile,
  jsxFactory: 'figma.widget.h',
  jsxFragment: 'figma.widget.Fragment',
  sourcemap: false,
  logLevel: 'info',
  external: ['figma'],
});

