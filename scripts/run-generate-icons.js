import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const scriptPath = resolve(__dirname, 'generatePerkIcons.ts');

const child = spawn('node', [
  '--loader',
  'ts-node/esm',
  scriptPath
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: '--experimental-loader ts-node/esm'
  }
});

child.on('error', (error) => {
  console.error('Failed to start subprocess:', error);
  process.exit(1);
});

child.on('close', (code) => {
  process.exit(code);
});
